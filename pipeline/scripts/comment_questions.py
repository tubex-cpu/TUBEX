"""Viewer questions and requests in competitor comments (工程0 ③：競合が解決できていない疑問), YouTube Data API v3 free quota only.

Usage:
  YOUTUBE_API_KEY=... python3 pipeline/scripts/comment_questions.py VIDEO_ID [VIDEO_ID ...] [--max 100] [--json OUT]

For each video it reads up to --max top-level comments (order=relevance) and prints the ones that look like an
unanswered question or a request for another video (？, なぜ, どうして, 教えて, 知りたい, 解説して, やってほしい, 次は ...),
with like counts, so the researcher can check by hand whether the video (or the competitor's other videos) answered it.
This is a lead list, not proof: a question in the comments may already be answered elsewhere.

Quota: commentThreads.list = 1 unit per call (100 comments). Does not use the daily search limit. Videos with
comments disabled are skipped. A 403/429 stops the script; it never retries or switches to a paid option.
"""
import argparse
import json
import re
import sys

from yt_research import call

ASK = re.compile(r"[?？]|なぜ|何故|どうして|教えて|知りたい|気になる|解説して|やってほしい|やって欲しい|してほしい|して欲しい|お願いします|次は|続編|リクエスト")


def questions(vid: str, limit: int) -> list[dict]:
    try:
        res = call("commentThreads", part="snippet", videoId=vid, order="relevance", maxResults=min(limit, 100),
                   textFormat="plainText")
    except SystemExit as e:  # comments disabled → 403 commentsDisabled; anything else stops the run
        if "commentsDisabled" in str(e):
            return []
        raise
    out = []
    for it in res.get("items", []):
        top = it["snippet"]["topLevelComment"]["snippet"]
        text = " ".join(top["textDisplay"].split())
        if ASK.search(text):
            out.append({"video": vid, "likes": top.get("likeCount", 0), "replies": it["snippet"].get("totalReplyCount", 0),
                        "text": text[:200]})
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("video_ids", nargs="+")
    ap.add_argument("--max", type=int, default=100)
    ap.add_argument("--json")
    args = ap.parse_args()
    if len(args.video_ids) > 60:
        sys.exit("動画は60本まで")
    rows = [q for v in args.video_ids for q in questions(v, args.max)]
    rows.sort(key=lambda r: -r["likes"])
    for r in rows:
        print(f"- [{r['likes']}いいね・返信{r['replies']}] https://www.youtube.com/watch?v={r['video']} ：{r['text']}")
    if args.json:
        with open(args.json, "w") as fp:
            json.dump(rows, fp, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
