"""Display subtitles for chizu-003-canada-housing (copied from chizu-005; widths measured with M PLUS Rounded 1c ExtraBold, the on-screen font).
Original notes (chizu-001 v2): (kept separate from the script and from the spoken text).

Rules (instruction relayed 2026-11-07): 1080p, 72 px, at most 2 lines, no 、。 and no unnecessary 「」 on screen,
line breaks at units of meaning (the script's 、 boundaries first).
Timing: each sentence's real start/end comes from audio/timings.json (the approved narration, unchanged). Inside a
sentence, each 、-phrase gets a share of that time from the VOICEVOX engine's own phoneme lengths for the same
words (audio_query, same voice/speed), so a card changes when its phrase is spoken.
Writes subtitles_v2.json and subtitles_v2.srt. Needs the VOICEVOX engine at 127.0.0.1:50021.
"""
import json, re, sys, urllib.parse, urllib.request
from pathlib import Path

EP = Path(__file__).resolve().parents[1]
R1 = EP.parent / "chizu-001-australia-coast"   # shared fonts/drawing helpers
sys.path.insert(0, str(R1 / "render"))
from PIL import ImageFont  # noqa: E402
_RF = ImageFont.truetype(str(R1 / "render/vendor/expo-google-fonts-m-plus-rounded-1c-0.4.1/package/800ExtraBold/MPLUSRounded1c_800ExtraBold.ttf"), 72)


def text_w(s, size=72):
    b = _RF.getbbox(s)
    return b[2] - b[0]
sys.path.insert(0, str(EP / "scripts"))
from make_narration import READ, READ2, years, SPEAKER, VV  # noqa: E402

SIZE, MAXW, MAXLINES = 72, 1640, 2
import os
AUD = EP / os.environ.get("SUB_AUDIO_DIR", "audio")          # v2.3: SUB_AUDIO_DIR=audio_v2_3 SUB_OUT=subtitles_v2_3
SUB_OUT = os.environ.get("SUB_OUT", "subtitles")
SPEED = json.loads((AUD / "timings.json").read_text())["speed"]


def disp(s):
    return re.sub(r"[「」。、]", "", s)


def fits(s):
    return text_w(s, SIZE) <= MAXW


def phrase_secs(p):
    for k, v in READ:
        p = p.replace(k, v)
    p = years(p)
    for k, v in READ2:
        p = p.replace(k, v)
    q = json.loads(urllib.request.urlopen(urllib.request.Request(
        f"{VV}/audio_query?speaker={SPEAKER}&text={urllib.parse.quote(p)}", method="POST"), timeout=60).read())
    t = 0.0
    for ap in q["accent_phrases"]:
        for m in ap["moras"] + ([ap["pause_mora"]] if ap.get("pause_mora") else []):
            t += (m.get("consonant_length") or 0) + m["vowel_length"]
    return t / SPEED


def split_line(s):
    """Two lines from one phrase, breaking after a particle nearest the middle."""
    best = None
    for k in range(3, len(s) - 2):
        if s[k - 1] in "はがをにでともへのや" and s[k] not in "ー":
            a, b = s[:k], s[k:]
            if fits(a) and fits(b):
                sc = abs(text_w(a, SIZE) - text_w(b, SIZE))
                if best is None or sc < best[0]:
                    best = (sc, a, b)
    if best:
        return [best[1], best[2]]
    k = len(s) // 2
    return [s[:k], s[k:]]


def cards_for(sentence):
    phrases = [p for p in re.split(r"(?<=、)", sentence.rstrip("。")) if p]
    phrases = [p.rstrip("、") for p in phrases]
    cards, cur = [], []
    for p in phrases:
        trial = cur + [p]
        if layout(trial):
            cur = trial
        else:
            if cur:
                cards.append(cur)
            cur = [p]
    if cur:
        cards.append(cur)
    return cards


def layout(phr):
    """Lines for a card made of phrases, or None if it needs more than MAXLINES lines.
    Phrases on the same line are separated by a full-width space (instead of 、).
    The line break goes where the two lines are most even, preferring phrase boundaries, then after a particle."""
    texts = [disp(p) for p in phr]
    one = "\u3000".join(texts)
    if fits(one):
        return [one]
    flat, kinds = "", []
    for i, x in enumerate(texts):
        if i:
            kinds.append((len(flat), 0)); flat += "\u3000"
        for k in range(1, len(x)):
            if x[k - 1] in "はがをにでともへのや" and x[k] != "ー":
                kinds.append((len(flat) + k, 900))
        flat += x
    best = None
    for pos, pen in kinds:
        a, b = flat[:pos].rstrip("\u3000"), flat[pos:].lstrip("\u3000")
        if len(a) < 2 or len(b) < 2 or not (fits(a) and fits(b)):
            continue
        sc = abs(text_w(a, SIZE) - text_w(b, SIZE)) + pen
        if best is None or sc < best[0]:
            best = (sc, a, b)
    return [best[1], best[2]] if best else None


def main():
    tim = json.loads((AUD / "timings.json").read_text())
    out = []
    for sc in tim["scenes"]:
        for se in sc["sentences"]:
            cards = cards_for(se["text"])
            secs = [sum(phrase_secs(p) for p in c) for c in cards]
            tot = sum(secs) or 1
            t = se["start"]
            for c, s in zip(cards, secs):
                d = (se["end"] - se["start"]) * s / tot
                out.append({"scene": sc["scene"], "start": round(t, 3), "end": round(t + d, 3), "lines": layout(c)})
                t += d
    ov = json.loads((EP / "subtitles_overrides.json").read_text())
    res = []
    for c in out:
        key = "".join(c["lines"]).replace("\u3000", "")
        if key in ov:
            parts = ov[key]
            n = [len("".join(p)) for p in parts]
            t, d = c["start"], c["end"] - c["start"]
            for p, k in zip(parts, n):
                assert all(fits(x) for x in p) and len(p) <= MAXLINES, p
                dd = d * k / sum(n)
                res.append({"scene": c["scene"], "start": round(t, 3), "end": round(t + dd, 3), "lines": p}); t += dd
        else:
            res.append(c)
    out = res
    (EP / f"{SUB_OUT}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    def ts(x):
        h, r = divmod(x, 3600); m, s = divmod(r, 60)
        return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"
    srt = "".join(f"{i + 1}\n{ts(c['start'])} --> {ts(c['end'])}\n" + "\n".join(c["lines"]) + "\n\n" for i, c in enumerate(out))
    (EP / f"{SUB_OUT}.srt").write_text(srt)
    print(len(out), "cards; max lines", max(len(c["lines"]) for c in out), "; shortest", min(c["end"] - c["start"] for c in out))


if __name__ == "__main__":
    main()
