#!/usr/bin/env python3
"""Create-only Git execution claims. No credentials, retries, expiry or deletion.

This is an execution interlock, not a gate approver or a production runner.
An empty assignment list is a successful no-op. A claimed key stays consumed
after completion or interruption; only a separately reviewed new input may run.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import uuid

POLICY_REF = "refs/heads/codex/weekly-operations-20261025"
RESERVED = {"note-n0", "pr-11", "habi"}


def git(*args, data=None):
    # Never echo stderr: authenticated remotes may put private details there.
    return subprocess.run(["git", *args], input=data, text=True,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                          timeout=90)


def remote_sha(ref):
    result = git("ls-remote", "--refs", "origin", ref)
    if result.returncode:
        raise RuntimeError("remote-read-failed")
    rows = [line.split() for line in result.stdout.splitlines()]
    exact = [row[0] for row in rows if len(row) == 2 and row[1] == ref]
    if len(exact) > 1:
        raise RuntimeError("ambiguous-ref")
    return exact[0] if exact else None


def eligibility(config, job, stage, input_sha):
    if job in RESERVED or job in config.get("reserved", []):
        return False
    matches = [a for a in config.get("assignments", [])
               if (a.get("job"), a.get("stage"), a.get("input_commit"))
               == (job, stage, input_sha)]
    return len(matches) == 1 and matches[0].get("gate_status") == "ready" \
        and bool(matches[0].get("approval_evidence"))


def claim(job, stage, input_sha, run_id, test=False):
    key = hashlib.sha256(json.dumps([job, stage, input_sha],
                                   separators=(",", ":")).encode()).hexdigest()
    namespace = "tubex-routine-test-v1" if test else "tubex-routine-claims-v1"
    ref = f"refs/heads/{namespace}/{key}"
    existing = remote_sha(ref)
    if existing:
        return {"status": "CONSUMED", "ref": ref, "claim": existing}
    tree = git("rev-parse", f"{input_sha}^{{tree}}")
    if tree.returncode:
        raise RuntimeError("input-commit-unavailable")
    record = json.dumps({"job": job, "stage": stage, "input_commit": input_sha,
                         "run_id": run_id, "nonce": str(uuid.uuid4()),
                         "state": "consumed-before-work"}, sort_keys=True)
    commit = git("-c", "user.name=TUBEX Routine", "-c",
                 "user.email=routine@invalid", "commit-tree", tree.stdout.strip(),
                 "-p", input_sha, data=record + "\n")
    if commit.returncode:
        raise RuntimeError("claim-object-failed")
    candidate = commit.stdout.strip()
    # Empty expected value means the remote ref MUST NOT exist. This cannot
    # overwrite a pre-existing ref. No force-only push and no automatic retry.
    try:
        git("push", "--porcelain", f"--force-with-lease={ref}:",
            "origin", f"{candidate}:{ref}")
    except (subprocess.TimeoutExpired, OSError):
        pass
    # Even a failed/timed-out push can have reached the server. Read once.
    try:
        actual = remote_sha(ref)
    except (RuntimeError, subprocess.TimeoutExpired, OSError):
        actual = None
    if actual == candidate:
        return {"status": "ACQUIRED", "ref": ref, "claim": candidate}
    if actual:
        return {"status": "CONSUMED", "ref": ref, "claim": actual}
    return {"status": "UNKNOWN", "ref": ref, "candidate": candidate,
            "action": "stop; inspect this exact ref; never retry acquisition"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--job")
    parser.add_argument("--stage")
    parser.add_argument("--input")
    parser.add_argument("--run-id")
    parser.add_argument("--test", action="store_true")
    args = parser.parse_args()
    config = json.loads((Path(__file__).resolve().parents[1]
                         / "routine_assignments.json").read_text())
    if not args.job and not args.test:
        print(json.dumps({"status": "NO_WORK" if not config["assignments"]
                          else "ASSIGNMENTS_REQUIRE_GATE_CHECK",
                          "count": len(config["assignments"])}))
        return 0
    if not all([args.job, args.stage, args.input, args.run_id]):
        parser.error("job, stage, input and run-id are required")
    if not re.fullmatch(r"[0-9a-f]{40}", args.input):
        parser.error("input must be a full commit SHA")
    if args.test:
        if not re.fullmatch(r"verification-20261025-[a-z0-9-]+", args.job) \
                or args.stage != "dry-run":
            parser.error("test mode accepts only the narrow verification namespace")
    elif not eligibility(config, args.job, args.stage, args.input):
        print('{"status":"NOT_ASSIGNED_OR_GATE_WAIT"}')
        return 3
    else:
        head = git("rev-parse", "HEAD").stdout.strip()
        if remote_sha(POLICY_REF) != head or git("status", "--porcelain").stdout:
            raise RuntimeError("policy-checkout-stale-or-dirty")
    result = claim(args.job, args.stage, args.input, args.run_id, args.test)
    print(json.dumps(result, sort_keys=True))
    return {"ACQUIRED": 0, "CONSUMED": 3, "UNKNOWN": 4}[result["status"]]


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (RuntimeError, subprocess.TimeoutExpired, OSError, ValueError) as exc:
        print(json.dumps({"status": "STOP", "reason": type(exc).__name__}))
        sys.exit(4)
