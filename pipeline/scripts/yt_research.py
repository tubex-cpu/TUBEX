"""Competitor research via YouTube Data API v3 (free quota only, no billing).

Usage:
  YOUTUBE_API_KEY=... python3 pipeline/scripts/yt_research.py "クラゲ 眠る" "動物 睡眠 雑学" [--max 10] [--days 730] [--thumbs-dir DIR]

--thumbs-dir saves each competitor thumbnail as DIR/<views>_<videoId>.jpg so the auditor can look at the real
images. DIR must be OUTSIDE the repository (competitor images are never committed). Needs i.ytimg.com allowed
in the environment's network settings.

Prints a Markdown table (title / channel / views / published / thumbnail URL / video URL) sorted by views,
with the retrieval date, for 02_competitors.md and 06b_thumbnail_benchmark.md.

Quota: search.list = 100 units per keyword, videos.list = 1 unit per call (daily free quota: 10,000 units).
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


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("keywords", nargs="+")
    ap.add_argument("--max", type=int, default=10, help="videos per keyword (<=50)")
    ap.add_argument("--days", type=int, default=730, help="only videos published within N days")
    ap.add_argument("--thumbs-dir", help="download thumbnails here (must be outside the repo)")
    args = ap.parse_args()
    if "YOUTUBE_API_KEY" not in os.environ:
        sys.exit("YOUTUBE_API_KEY が未設定です（環境設定に登録してください。キーをチャットやリポジトリに書かないこと）")
    if len(args.keywords) > 20:
        sys.exit("キーワードは20個まで（無料枠を守るため）")

    after = (dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=args.days)).strftime("%Y-%m-%dT%H:%M:%SZ")
    ids: list[str] = []
    for kw in args.keywords:
        res = call("search", part="id", q=kw, type="video", order="viewCount", regionCode="JP",
                   relevanceLanguage="ja", publishedAfter=after, maxResults=min(args.max, 50))
        ids += [it["id"]["videoId"] for it in res.get("items", []) if it["id"].get("videoId")]
    ids = list(dict.fromkeys(ids))

    rows = []
    for i in range(0, len(ids), 50):
        res = call("videos", part="snippet,statistics", id=",".join(ids[i:i + 50]))
        for v in res.get("items", []):
            sn, st = v["snippet"], v.get("statistics", {})
            thumbs = sn.get("thumbnails", {})
            thumb = (thumbs.get("maxres") or thumbs.get("high") or thumbs.get("default") or {}).get("url", "")
            rows.append((int(st.get("viewCount", 0)), sn["title"], sn["channelTitle"], sn["publishedAt"][:10], thumb, v["id"]))

    rows.sort(reverse=True)
    if args.thumbs_dir:
        repo = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        out = os.path.abspath(args.thumbs_dir)
        if out == repo or out.startswith(repo + os.sep):
            sys.exit("--thumbs-dir はリポジトリの外を指定してください（競合画像はコミットしない）")
        os.makedirs(out, exist_ok=True)
        for views, _t, _c, _p, thumb, vid in rows:
            if not thumb:
                continue
            try:
                urllib.request.urlretrieve(thumb, os.path.join(out, f"{views:012d}_{vid}.jpg"))
            except Exception as e:  # noqa: BLE001 - report and continue; never fabricate images
                print(f"<!-- サムネ取得失敗 {vid}: {e} -->", file=sys.stderr)
    today = dt.date.today().isoformat()
    print(f"取得日：{today}（YouTube Data API v3）／検索語：{' / '.join(args.keywords)}\n")
    print("| 再生数 | タイトル | チャンネル | 公開日 | サムネURL | 動画URL |")
    print("|---|---|---|---|---|---|")
    for views, title, ch, pub, thumb, vid in rows:
        title = title.replace("|", "｜")
        print(f"| {views:,} | {title} | {ch} | {pub} | {thumb} | https://www.youtube.com/watch?v={vid} |")


if __name__ == "__main__":
    main()
