"""Upload-history analysis of 穴場 channels for 工程0, YouTube Data API v3 free quota only (no search.list).

Usage:
  YOUTUBE_API_KEY=... python3 pipeline/scripts/channel_history.py --from-genre channels/new-channels/data/genre_YYYY-MM-DD.json [--json OUT]
  YOUTUBE_API_KEY=... python3 pipeline/scripts/channel_history.py UCxxxx UCyyyy ...

Targets (with --from-genre): channels in the genre top 30 that are small (< 100k subscribers) and outperformed
(a video with views >= 3x subscribers), or that were created within 365 days.
For each channel it reads the uploads playlist (up to 200 latest uploads) and prints: first upload in that window,
uploads, uploads per week, long-form share, median views of long-form uploads, the first long-form upload that reached
100k views (its number in upload order and days after the first upload), median duration.
Subscriber history is NOT available from the API (only the current count).

Quota: channels.list / playlistItems.list / videos.list = 1 unit per call (≈ 9 units per channel). Does not use the
separate "search queries per day" limit. A 403/429 stops the script; it never retries or switches to a paid option.
"""
import argparse
import datetime as dt
import json
import statistics
import sys

from genre_research import minutes
from yt_research import call


def history(cid: str, today: dt.date) -> dict | None:
    ch = call("channels", part="snippet,statistics,contentDetails", id=cid).get("items", [])
    if not ch:
        return None
    ch = ch[0]
    st = ch.get("statistics", {})
    uploads = ch["contentDetails"]["relatedPlaylists"]["uploads"]
    ids, token = [], None
    while len(ids) < 200:
        kw = {"pageToken": token} if token else {}
        res = call("playlistItems", part="contentDetails", playlistId=uploads, maxResults=50, **kw)
        ids += [it["contentDetails"]["videoId"] for it in res.get("items", [])]
        token = res.get("nextPageToken")
        if not token:
            break
    vids = []
    for i in range(0, len(ids), 50):
        for v in call("videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50])).get("items", []):
            vids.append({"id": v["id"], "title": v["snippet"]["title"], "published": v["snippet"]["publishedAt"][:10],
                         "views": int(v.get("statistics", {}).get("viewCount", 0)),
                         "min": round(minutes(v["contentDetails"]["duration"]), 1)})
    vids.sort(key=lambda v: v["published"])
    longs = [v for v in vids if v["min"] >= 4]
    first = dt.date.fromisoformat(vids[0]["published"]) if vids else None
    weeks = max(((today - first).days / 7) if first else 0, 1)
    hit = next(((n, v) for n, v in enumerate(longs, 1) if v["views"] >= 100_000), None)
    return {"channelId": cid, "title": ch["snippet"]["title"], "created": ch["snippet"]["publishedAt"][:10],
            "subs": None if st.get("hiddenSubscriberCount") else int(st.get("subscriberCount", 0)),
            "videos_total": int(st.get("videoCount", 0)), "window_videos": len(vids),
            "first_upload": str(first) if first else None, "per_week": round(len(vids) / weeks, 1),
            "long_share": round(len(longs) / len(vids), 2) if vids else None,
            "median_views_long": int(statistics.median([v["views"] for v in longs])) if longs else None,
            "median_min_long": round(statistics.median([v["min"] for v in longs]), 1) if longs else None,
            "first_100k": {"nth_long": hit[0], "days": (dt.date.fromisoformat(hit[1]["published"]) - first).days,
                           "views": hit[1]["views"], "id": hit[1]["id"]} if hit else None,
            "videos": vids}


def targets_from_genre(path: str, today: dt.date) -> list[str]:
    out = []
    for g in json.load(open(path))["genres"]:
        for v in g["videos"]:
            subs, created = v.get("ch_subs"), v.get("ch_created")
            small_hit = subs is not None and subs < 100_000 and v["views"] >= 3 * subs
            new = created and (today - dt.date.fromisoformat(created)).days <= 365
            if small_hit or new:
                out.append(v["channelId"])
    return list(dict.fromkeys(out))


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("channel_ids", nargs="*")
    ap.add_argument("--from-genre")
    ap.add_argument("--json")
    args = ap.parse_args()
    today = dt.datetime.now(dt.timezone.utc).date()
    ids = args.channel_ids + (targets_from_genre(args.from_genre, today) if args.from_genre else [])
    ids = list(dict.fromkeys(ids))
    if len(ids) > 120:
        sys.exit("チャンネルは120個まで（無料枠を守るため）")
    rows = [r for r in (history(c, today) for c in ids) if r]
    f = lambda x: f"{x:,}" if isinstance(x, int) else ("–" if x is None else x)
    print(f"取得日：{today}（YouTube Data API v3、各チャンネルの最新200本まで。長尺＝4分以上）\n")
    print("| チャンネル | 開設 | 登録者 | 総本数 | 初投稿(範囲内) | 週の本数 | 長尺率 | 長尺の再生中央値 | 長尺の尺中央値 | 初の10万回（長尺何本目・初投稿から何日） |")
    print("|---|---|--:|--:|---|--:|--:|--:|--:|---|")
    for r in sorted(rows, key=lambda r: r["created"], reverse=True):
        h = r["first_100k"]
        hs = f"{h['nth_long']}本目・{h['days']}日（{h['views']:,}回）" if h else "なし"
        print(f"| {r['title']} | {r['created']} | {f(r['subs'])} | {r['videos_total']} | {r['first_upload']} | {r['per_week']} | "
              f"{r['long_share']} | {f(r['median_views_long'])} | {r['median_min_long']} | {hs} |")
    if args.json:
        with open(args.json, "w") as fp:
            json.dump({"retrieved": str(today), "channels": rows}, fp, ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    main()
