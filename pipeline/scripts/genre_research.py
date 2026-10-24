"""Genre-level market research for 工程0 (channels/new-channels/00_genre_research.md), YouTube Data API v3 free quota only.

Usage:
  YOUTUBE_API_KEY=... python3 pipeline/scripts/genre_research.py "新NISA" "年金 老後" ... [--days 730] [--json OUT]

For each keyword (= one genre) it searches long-form videos only (videoDuration=medium and long, i.e. 4 min+;
Shorts are excluded by 社長方針 2026-10-11), takes the top 30 by views published within --days, and prints:
  - demand: views of #1 / #10 / #30
  - supply: distinct channels in the top 30, videos from channels under 100k subscribers whose views >= 3x
    the subscribers (small channel outperforming = 穴場のサイン), videos from channels under 100k subscribers
  - new entrants: channels created within 365 days that appear in the top 30 (current subscribers, video count,
    months since creation; when they crossed 1,000 subscribers is NOT available from the API)
  - watch time: median duration (min) of the top 30
Retrieval date is printed. The key is never printed.

Quota: 2 search.list calls per keyword (200 units) + a few 1-unit calls. Max 20 keywords per run (~4,000 units of
the 10,000 daily free quota). A 403 stops the script; it never retries or switches to a paid option.
"""
import argparse
import datetime as dt
import json
import re
import statistics
import sys

from yt_research import call  # same key handling and 403 stop

DUR = re.compile(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?")


def minutes(iso: str) -> float:
    d, h, m, s = (int(x or 0) for x in DUR.fullmatch(iso).groups())
    return (d * 86400 + h * 3600 + m * 60 + s) / 60


def genre(kw: str, after: str, today: dt.date) -> dict:
    ids: list[str] = []
    for length in ("medium", "long"):
        res = call("search", part="id", q=kw, type="video", order="viewCount", regionCode="JP", relevanceLanguage="ja",
                   publishedAfter=after, videoDuration=length, maxResults=50)
        ids += [it["id"]["videoId"] for it in res.get("items", []) if it["id"].get("videoId")]
    ids = list(dict.fromkeys(ids))
    vids = []
    for i in range(0, len(ids), 50):
        for v in call("videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50])).get("items", []):
            vids.append({"id": v["id"], "title": v["snippet"]["title"], "channel": v["snippet"]["channelTitle"],
                         "channelId": v["snippet"]["channelId"], "published": v["snippet"]["publishedAt"][:10],
                         "views": int(v.get("statistics", {}).get("viewCount", 0)),
                         "min": round(minutes(v["contentDetails"]["duration"]), 1)})
    vids = sorted((v for v in vids if v["min"] >= 4), key=lambda v: -v["views"])[:30]
    chs = {}
    cids = list(dict.fromkeys(v["channelId"] for v in vids))
    for i in range(0, len(cids), 50):
        for c in call("channels", part="snippet,statistics", id=",".join(cids[i:i + 50])).get("items", []):
            st = c.get("statistics", {})
            chs[c["id"]] = {"subs": None if st.get("hiddenSubscriberCount") else int(st.get("subscriberCount", 0)),
                            "videos": int(st.get("videoCount", 0)), "created": c["snippet"]["publishedAt"][:10]}
    for v in vids:
        v.update({f"ch_{k}": x for k, x in chs.get(v["channelId"], {}).items()})
    views = [v["views"] for v in vids]
    pick = lambda n: views[n - 1] if len(views) >= n else None
    over3 = [v for v in vids if v.get("ch_subs") and v["ch_subs"] < 100_000 and v["views"] >= 3 * v["ch_subs"]]
    small = [v for v in vids if v.get("ch_subs") is not None and v["ch_subs"] < 100_000]
    new = {}
    for v in vids:
        c = v.get("ch_created")
        if c and (today - dt.date.fromisoformat(c)).days <= 365:
            months = round((today - dt.date.fromisoformat(c)).days / 30.4, 1)
            new[v["channel"]] = {"created": c, "months": months, "subs": v.get("ch_subs"), "videos": v.get("ch_videos")}
    return {"keyword": kw, "n": len(vids), "top1": pick(1), "top10": pick(10), "top30": pick(30),
            "channels": len({v["channelId"] for v in vids}), "over3x": len(over3), "under100k": len(small),
            "new_channels": new, "median_min": round(statistics.median([v["min"] for v in vids]), 1) if vids else None,
            "videos": vids}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("keywords", nargs="+")
    ap.add_argument("--days", type=int, default=730)
    ap.add_argument("--json", help="write full per-video data here (outside the repo or in the scratchpad)")
    args = ap.parse_args()
    if len(args.keywords) > 20:
        sys.exit("キーワードは20個まで（無料枠を守るため）")
    now = dt.datetime.now(dt.timezone.utc)
    after = (now - dt.timedelta(days=args.days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    out = [genre(kw, after, now.date()) for kw in args.keywords]
    print(f"取得日：{now.date()}（YouTube Data API v3、日本・日本語、長尺4分以上のみ、直近{args.days}日）\n")
    print("| 検索語 | 1位 | 10位 | 30位 | 上位30のch数 | 小ch(10万未満)で再生≥登録×3 | 登録10万未満chの本数 | 開設1年以内ch | 尺の中央値(分) |")
    print("|---|--:|--:|--:|--:|--:|--:|--:|--:|")
    f = lambda x: f"{x:,}" if isinstance(x, int) else "–"
    for g in out:
        print(f"| {g['keyword']} | {f(g['top1'])} | {f(g['top10'])} | {f(g['top30'])} | {g['channels']} | {g['over3x']} | "
              f"{g['under100k']} | {len(g['new_channels'])} | {g['median_min']} |")
    print()
    for g in out:
        for name, c in g["new_channels"].items():
            print(f"- 新規ch［{g['keyword']}］{name}：開設 {c['created']}（{c['months']}か月）・登録 {f(c['subs'])}・動画 {c['videos']} 本")
    if args.json:
        with open(args.json, "w") as fp:
            json.dump({"retrieved": str(now.date()), "genres": out}, fp, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
