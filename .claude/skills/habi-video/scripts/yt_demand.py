"""YouTubeでの需要の目安を、キーワードごとに測る（YouTube Data API v3。環境変数 YOUTUBE_API_KEY を使う）。
YouTubeは検索回数そのものを公開していないので、次の値を「需要の目安」とする。
  上位中央値：関連度順の上位20本の再生数の中央値（その言葉で見られている動画の厚み）
  上位3本：関連度順の上位3本の再生数の合計
  直近1年：この1年に公開された動画のうち再生数の多い10本の、1日あたり再生数の合計（いまの勢い）
  件数：検索結果のおおよその件数（競合の多さ）
1キーワードで約201ユニット（search 2回＋videos 1回）。1日の上限は10,000ユニット。
  python3 .claude/skills/habi-video/scripts/yt_demand.py マチュピチュ "クフ王 太陽の船" 卑弥呼
"""
import datetime as dt
import json
import os
import statistics
import sys
import urllib.parse
import urllib.request

KEY = os.environ['YOUTUBE_API_KEY']
API = 'https://www.googleapis.com/youtube/v3/'


def get(path, **q):
    q['key'] = KEY
    with urllib.request.urlopen(API + path + '?' + urllib.parse.urlencode(q), timeout=30) as r:
        return json.load(r)


def search(q, **extra):
    d = get('search', part='id', type='video', maxResults=extra.pop('n', 20), regionCode='JP', relevanceLanguage='ja', q=q, **extra)
    return [i['id']['videoId'] for i in d['items'] if 'videoId' in i['id']], d['pageInfo']['totalResults']


def stats(ids):
    if not ids:
        return {}
    d = get('videos', part='statistics,snippet', id=','.join(ids))
    return {v['id']: (int(v['statistics'].get('viewCount', 0)), v['snippet']['publishedAt'][:10], v['snippet']['title']) for v in d['items']}


now = dt.datetime.now(dt.timezone.utc)
year_ago = (now - dt.timedelta(days=365)).strftime('%Y-%m-%dT%H:%M:%SZ')
rows = []
for kw in sys.argv[1:]:
    rel, total = search(kw)
    recent, _ = search(kw, n=10, order='viewCount', publishedAfter=year_ago)
    st = stats(list(dict.fromkeys(rel + recent)))
    views = [st[i][0] for i in rel if i in st]
    per_day = 0.0
    for i in recent:
        if i in st:
            days = max(1, (now.date() - dt.date.fromisoformat(st[i][1])).days)
            per_day += st[i][0] / days
    top = max((st[i] for i in rel if i in st), default=(0, '', ''))
    rows.append((kw, int(statistics.median(views)) if views else 0, sum(sorted(views, reverse=True)[:3]), int(per_day), total, top))

print('| キーワード | 上位中央値 | 上位3本 | 直近1年（1日あたり） | 件数 | 最も見られている上位動画 |')
print('|---|---:|---:|---:|---:|---|')
for kw, med, top3, pd, total, top in sorted(rows, key=lambda r: -r[3]):
    print(f'| {kw} | {med:,} | {top3:,} | {pd:,} | {total:,} | {top[2][:40]}（{top[0]:,}回・{top[1]}） |')
