import concurrent.futures
import contextlib
import io
import json
import os
from pathlib import Path
import subprocess
import tempfile
import threading
import unittest
from unittest.mock import patch

import routine_claim as rc


class Claims(unittest.TestCase):
    def test_atomic_claim_and_permanent_consumption(self):
        original = os.getcwd()
        with tempfile.TemporaryDirectory() as directory:
            def run(*args):
                return subprocess.check_output(["git", *args], cwd=directory,
                                               stderr=subprocess.DEVNULL, text=True).strip()
            run("init", "--bare", "remote.git")
            run("init", "work")
            os.chdir(Path(directory) / "work")
            try:
                rc.git("config", "user.name", "Test")
                rc.git("config", "user.email", "test@invalid")
                rc.git("commit", "--allow-empty", "-m", "fixture")
                sha = rc.git("rev-parse", "HEAD").stdout.strip()
                rc.git("remote", "add", "origin", str(Path(directory) / "remote.git"))
                barrier = threading.Barrier(2)
                original_remote = rc.remote_sha
                count = 0
                lock = threading.Lock()
                def simultaneous_absent(ref):
                    nonlocal count
                    value = original_remote(ref)
                    with lock:
                        count += 1
                        first = count <= 2
                    if first:
                        self.assertIsNone(value)
                        barrier.wait(timeout=10)
                    return value
                with patch.object(rc, "remote_sha", side_effect=simultaneous_absent), \
                        concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                    futures = [pool.submit(rc.claim, "verification-20261025-local",
                                           "dry-run", sha, f"run-{n}", True)
                               for n in range(2)]
                    results = [f.result() for f in futures]
                self.assertEqual(sorted(r["status"] for r in results),
                                 ["ACQUIRED", "CONSUMED"])
                winner = next(r for r in results if r["status"] == "ACQUIRED")
                before = rc.remote_sha(winner["ref"])
                # Simulates interruption, elapsed time and completion: no TTL
                # or release exists, so none can make the same input runnable.
                for run_id in ["after-interruption", "after-time", "after-completion"]:
                    self.assertEqual(rc.claim("verification-20261025-local", "dry-run",
                                              sha, run_id, True)["status"], "CONSUMED")
                    self.assertEqual(rc.remote_sha(winner["ref"]), before)
                self.assertEqual(rc.git("status", "--porcelain").stdout, "")
            finally:
                os.chdir(original)

    def test_unknown_does_not_retry(self):
        calls = []
        def fake_git(*args, **kwargs):
            calls.append(args)
            return subprocess.CompletedProcess(args, 0,
                                               "" if args[0] == "ls-tree" else "a" * 40 + "\n", "")
        with patch.object(rc, "git", side_effect=fake_git), \
                patch.object(rc, "remote_sha", side_effect=[None, RuntimeError()]):
            result = rc.claim("verification-20261025-unknown", "dry-run", "b" * 40, "run", True)
        self.assertEqual(result["status"], "UNKNOWN")
        self.assertEqual(sum(a[0] == "push" for a in calls), 1)

    def test_reservations_gates_and_exact_input(self):
        assignment = {"job": "assigned", "stage": "research", "input_commit": "a" * 40,
                      "gate_status": "ready", "approval_evidence": "reviewed allocation"}
        config = {"assignments": [assignment]}
        self.assertTrue(rc.eligibility(config, "assigned", "research", "a" * 40))
        for job in ["note-n0", "pr-11", "habi", "not-assigned"]:
            self.assertFalse(rc.eligibility(config, job, "research", "a" * 40))
        for job in ["note", "note-001-example", "habi-002-proto-elamite", "new-channels"]:
            reserved_assignment = dict(assignment, job=job)
            self.assertFalse(rc.eligibility({"assignments": [reserved_assignment]},
                                            job, "research", "a" * 40))
        self.assertFalse(rc.eligibility(config, "assigned", "research", "b" * 40))
        assignment["gate_status"] = "waiting"
        self.assertFalse(rc.eligibility(config, "assigned", "research", "a" * 40))

    def test_no_work_and_unassigned_have_no_git_effects(self):
        for argv, expected in [(["claim"], 0),
                               (["claim", "--job", "note-n0", "--stage", "N0",
                                 "--input", "a" * 40, "--run-id", "test"], 3)]:
            with patch("sys.argv", argv), patch.object(rc, "git") as git, \
                    contextlib.redirect_stdout(io.StringIO()) as output:
                self.assertEqual(rc.main(), expected)
                git.assert_not_called()
                self.assertIn(json.loads(output.getvalue())["status"],
                              ["NO_WORK", "NOT_ASSIGNED_OR_GATE_WAIT"])


if __name__ == "__main__":
    unittest.main()
