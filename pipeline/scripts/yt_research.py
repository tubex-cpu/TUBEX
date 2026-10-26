"""Competitor research via YouTube Data API v3 (free quota only, no billing).

Usage:
  YOUTUBE_API_KEY=... python3 pipeline/scripts/yt_research.py "クラゲ 眠る" "動物 睡眠 雑学" [--max 10] [--days 730] [--thumbs-dir DIR]
  YOUTUBE_API_KEY=... python3 pipeline/scripts/yt_research.py --channel UCxxxx [--max 50]

--channel lists a channel's latest uploads (up to --max, <=200) instead of searching. It uses playlistItems.list
(1 unit per 50 videos), not search.list, so it does not consume the daily search limit.

--thumbs-dir saves each competitor thumbnail as DIR/<views>_<videoId>.jpg so the auditor can look at the real
images. DIR must be OUTSIDE the repository (competitor images are never committed). Needs www.googleapis.com (API)
and i.ytimg.com (thumbnails) allowed
in the environment's network settings.

Prints a Markdown table (views / length / title / channel / subscribers / channel created / views per subscriber /
published / thumbnail URL / video URL) sorted by views, with the retrieval date, for 02_competitors.md,
06b_thumbnail_benchmark.md and channels/<name>/00_genre_research.md. Hidden subscriber counts print as 非公開.

Quota: search.list = 100 units per keyword, videos.list / channels.list = 1 unit per call of up to 50 IDs
(daily free quota: 10,000 units).
The script refuses to run more than 20 keywords at once. If the daily quota is used up the API returns 403
and the script stops; it never retries or switches to a paid option.
"""
import argparse
import datetime as dt
import json
import os
import sys
import urllib.error
import urllib.parse
import re
import urllib.request

API = "https://www.googleapis.com/youtube/v3/"


def call(endpoint: str, **params) -> dict:
    params["key"] = os.environ["YOUTUBE_API_KEY"]
    url = API + endpoint + "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:300]
        sys.exit(f"YouTube API error {e.code}（上限超過やキー設定を確認。課金はしない）: {body}")


def length(iso: str) -> str:
    """ISO 8601 duration (PT1H2M3S) -> h:mm:ss / m:ss."""
    m = re.fullmatch(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not m:
        return "不明"
    d, h, mi, se = (int(x or 0) for x in m.groups())
    h += d * 24
    return f"{h}:{mi:02d}:{se:02d}" if h else f"{mi}:{se:02d}"


def uploads(channel_id: str, limit: int) -> list[str]:
    res = call("channels", part="contentDetails", id=channel_id)
    items = res.get("items", [])
    if not items:
        sys.exit(f"チャンネルが見つかりません: {channel_id}")
    playlist = items[0]["contentDetails"]["relatedPlaylists"]["uploads"]
    ids: list[str] = []
    token = None
    while len(ids) < limit:
        params = dict(part="contentDetails", playlistId=playlist, maxResults=50)
        if token:
            params["pageToken"] = token
        res = call("playlistItems", **params)
        ids += [it["contentDetails"]["videoId"] for it in res.get("items", [])]
        token = res.get("nextPageToken")
        if not token:
            break
    return ids[:limit]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("keywords", nargs="*")
    ap.add_argument("--channel", help="list this channel's uploads instead of searching (no search quota)")
    ap.add_argument("--max", type=int, default=10, help="videos per keyword (<=50)")
    ap.add_argument("--days", type=int, default=730, help="only videos published within N days")
    ap.add_argument("--thumbs-dir", help="download thumbnails here (must be outside the repo)")
    args = ap.parse_args()
    if "YOUTUBE_API_KEY" not in os.environ:
        sys.exit("YOUTUBE_API_KEY が未設定です（環境設定に登録してください。キーをチャットやリポジトリに書かないこと）")
    if len(args.keywords) > 20:
        sys.exit("キーワードは20個まで（無料枠を守るため）")
    if bool(args.keywords) == bool(args.channel):
        sys.exit("検索語か --channel のどちらか一方を指定してください")

    after = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=args.days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    ids: list[str] = uploads(args.channel, min(args.max, 200)) if args.channel else []
    for kw in args.keywords:
        res = call("search", part="id", q=kw, type="video", order="viewCount", regionCode="JP",
                   relevanceLanguage="ja", publishedAfter=after, maxResults=min(args.max, 50))
        ids += [it["id"]["videoId"] for it in res.get("items", []) if it["id"].get("videoId")]
    ids = list(dict.fromkeys(ids))

    rows = []
    for i in range(0, len(ids), 50):
        res = call("videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]))
        for v in res.get("items", []):
            sn, st = v["snippet"], v.get("statistics", {})
            thumbs = sn.get("thumbnails", {})
            thumb = (thumbs.get("maxres") or thumbs.get("high") or thumbs.get("default") or {}).get("url", "")
            rows.append((int(st.get("viewCount", 0)), sn["title"], sn["channelTitle"], sn["publishedAt"][:10], thumb, v["id"],
                         sn["channelId"], length(v.get("contentDetails", {}).get("duration", ""))))

    channels: dict[str, tuple[int | None, str]] = {}
    ch_ids = list(dict.fromkeys(r[6] for r in rows))
    for i in range(0, len(ch_ids), 50):
        res = call("channels", part="snippet,statistics", id=",".join(ch_ids[i:i + 50]))
        for c in res.get("items", []):
            st = c.get("statistics", {})
            subs = None if st.get("hiddenSubscriberCount") else int(st.get("subscriberCount", 0))
            channels[c["id"]] = (subs, c["snippet"]["publishedAt"][:10])

    rows.sort(reverse=True)
    if args.thumbs_dir:
        repo = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        out = os.path.abspath(args.thumbs_dir)
        if out == repo or out.startswith(repo + os.sep):
            sys.exit("--thumbs-dir はリポジトリの外を指定してください（競合画像はコミットしない）")
        os.makedirs(out, exist_ok=True)
        for views, _t, _c, _p, thumb, vid, _ch, _len in rows:
            if not thumb:
                continue
            try:
                urllib.request.urlretrieve(thumb, os.path.join(out, f"{views:012d}_{vid}.jpg"))
            except Exception as e:  # noqa: BLE001 - report and continue; never fabricate images
                print(f"<!-- サムネ取得失敗 {vid}: {e} -->", file=sys.stderr)
    today = dt.date.today().isoformat()
    source = f"チャンネル：{args.channel}（最新{len(ids)}本）" if args.channel else f"検索語：{' / '.join(args.keywords)}"
    print(f"取得日：{today}（YouTube Data API v3）／{source}\n")
    print("| 再生数 | 長さ | タイトル | チャンネル | 登録者数 | チャンネル開設日 | 再生数/登録者 | 公開日 | サムネURL | 動画URL |")
    print("|---|---|---|---|---|---|---|---|---|---|")
    for views, title, ch, pub, thumb, vid, ch_id, dur in rows:
        title = title.replace("|", "｜")
        subs, created = channels.get(ch_id, (None, "不明"))
        subs_s = "非公開" if subs is None else f"{subs:,}"
        ratio = f"{views / subs:.1f}" if subs else "–"
        print(f"| {views:,} | {dur} | {title} | {ch} | {subs_s} | {created} | {ratio} | {pub} | {thumb} | https://www.youtube.com/watch?v={vid} |")


if __name__ == "__main__":
    main()
