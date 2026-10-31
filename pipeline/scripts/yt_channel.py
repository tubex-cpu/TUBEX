"""List a channel's recent uploads with real numbers and (optionally) save their thumbnails. Free quota only.

Usage:
  YOUTUBE_API_KEY=... python3 pipeline/scripts/yt_channel.py @handle [@handle2 ...] [--max 50] [--thumbs-dir DIR]

Accepts @handles, channel URLs (https://www.youtube.com/@xxx, percent-encoded is fine) or UC... channel IDs.
--thumbs-dir saves DIR/<handle>/<views>_<videoId>.jpg for `thumb_sheet.py`. DIR must be OUTSIDE the repository.
Quota: about 1 + ceil(max/50)*2 units per channel (channels.list / playlistItems.list / videos.list).
Shorts are included; the table marks videos of 60 s or less as ショート.
"""
import argparse
import datetime as dt
import os
import re
import sys
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from yt_research import call  # noqa: E402  (same free-quota API helper; stops on 403)


def channel_ref(arg: str) -> dict:
    arg = urllib.parse.unquote(arg.strip())
    m = re.search(r"(UC[\w-]{22})", arg)
    if m:
        return {"id": m.group(1)}
    m = re.search(r"@([^/?#\s]+)", arg)
    return {"forHandle": "@" + (m.group(1) if m else arg.lstrip("@"))}


def seconds(iso: str) -> int:
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    d, h, mi, s = (int(x or 0) for x in m.groups()) if m else (0, 0, 0, 0)
    return ((d * 24 + h) * 60 + mi) * 60 + s


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("channels", nargs="+")
    ap.add_argument("--max", type=int, default=50, help="recent uploads per channel")
    ap.add_argument("--thumbs-dir")
    args = ap.parse_args()
    if "YOUTUBE_API_KEY" not in os.environ:
        sys.exit("YOUTUBE_API_KEY が未設定です（キーをチャットやリポジトリに書かないこと）")
    if len(args.channels) > 10:
        sys.exit("チャンネルは10個まで（無料枠を守るため）")
    repo = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    if args.thumbs_dir:
        out = os.path.abspath(args.thumbs_dir)
        if out == repo or out.startswith(repo + os.sep):
            sys.exit("--thumbs-dir はリポジトリの外を指定してください（競合画像はコミットしない）")

    print(f"取得日：{dt.date.today().isoformat()}（YouTube Data API v3）\n")
    for arg in args.channels:
        res = call("channels", part="snippet,statistics,contentDetails", **channel_ref(arg))
        if not res.get("items"):
            print(f"## {arg}\n\nチャンネルが見つかりません\n")
            continue
        c = res["items"][0]
        st, sn = c["statistics"], c["snippet"]
        subs = None if st.get("hiddenSubscriberCount") else int(st.get("subscriberCount", 0))
        handle = sn.get("customUrl", c["id"])
        uploads = c["contentDetails"]["relatedPlaylists"]["uploads"]
        ids, token = [], None
        while len(ids) < args.max:
            params = {"part": "contentDetails", "playlistId": uploads, "maxResults": min(50, args.max - len(ids))}
            if token:
                params["pageToken"] = token
            pl = call("playlistItems", **params)
            ids += [it["contentDetails"]["videoId"] for it in pl.get("items", [])]
            token = pl.get("nextPageToken")
            if not token:
                break
        rows = []
        for i in range(0, len(ids), 50):
            vs = call("videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]))
            for v in vs.get("items", []):
                t = v["snippet"].get("thumbnails", {})
                thumb = (t.get("maxres") or t.get("high") or t.get("default") or {}).get("url", "")
                rows.append((int(v.get("statistics", {}).get("viewCount", 0)), v["snippet"]["title"],
                             v["snippet"]["publishedAt"][:10], seconds(v["contentDetails"].get("duration", "")),
                             thumb, v["id"]))
        rows.sort(reverse=True)
        subs_s = "非公開" if subs is None else f"{subs:,}"
        print(f"## {sn['title']}（{handle}）\n")
        print(f"登録者 {subs_s}／総再生 {int(st.get('viewCount', 0)):,}／動画数 {st.get('videoCount')}／"
              f"開設 {sn['publishedAt'][:10]}／https://www.youtube.com/channel/{c['id']}\n")
        print("| 再生数 | 再生数/登録者 | タイトル | 公開日 | 尺 | サムネURL | 動画URL |")
        print("|---|---|---|---|---|---|---|")
        for views, title, pub, sec, thumb, vid in rows:
            ratio = f"{views / subs:.2f}" if subs else "–"
            dur = "ショート" if sec <= 60 else f"{sec // 60}分"
            print(f"| {views:,} | {ratio} | {title.replace('|', '｜')} | {pub} | {dur} | {thumb} | "
                  f"https://www.youtube.com/watch?v={vid} |")
        print()
        if args.thumbs_dir:
            d = os.path.join(out, re.sub(r"[^\w@.-]", "_", handle))
            os.makedirs(d, exist_ok=True)
            for views, _t, _p, _s, thumb, vid in rows:
                if thumb:
                    try:
                        urllib.request.urlretrieve(thumb, os.path.join(d, f"{views:012d}_{vid}.jpg"))
                    except Exception as e:  # noqa: BLE001 - report and continue; never fabricate images
                        print(f"<!-- サムネ取得失敗 {vid}: {e} -->", file=sys.stderr)


if __name__ == "__main__":
    main()
