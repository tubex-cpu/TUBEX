"""YouTube Data API v3 の薄いクライアント（競合調査用）。"""
from __future__ import annotations

import re
from datetime import datetime, timezone

import requests

API = "https://www.googleapis.com/youtube/v3"


class YouTubeClient:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def _get(self, path: str, **params) -> dict:
        params["key"] = self.api_key
        r = requests.get(f"{API}/{path}", params=params, timeout=20)
        r.raise_for_status()
        return r.json()

    # --- チャンネル -------------------------------------------------------
    def resolve_channel_id(self, ref: str) -> str | None:
        """URL / @handle / チャンネルID / チャンネル名 からチャンネルIDを解決する。"""
        ref = ref.strip()
        if m := re.search(r"(UC[\w-]{22})", ref):
            return m.group(1)
        if m := re.search(r"@([\w.\-]+)", ref):
            items = self._get("channels", part="id", forHandle=m.group(1)).get("items", [])
            if items:
                return items[0]["id"]
        items = self._get("search", part="snippet", type="channel", q=ref, maxResults=1).get("items", [])
        return items[0]["snippet"]["channelId"] if items else None

    def search_channels(self, keyword: str, max_results: int = 10, region: str = "JP") -> list[str]:
        """キーワードで動画検索し、上位に出てくるチャンネルを競合として集める。"""
        data = self._get(
            "search", part="snippet", type="video", q=keyword, order="viewCount",
            maxResults=50, regionCode=region, relevanceLanguage="ja",
        )
        ids: list[str] = []
        for it in data.get("items", []):
            cid = it["snippet"]["channelId"]
            if cid not in ids:
                ids.append(cid)
        return ids[:max_results]

    def channels(self, ids: list[str]) -> list[dict]:
        out = []
        for i in range(0, len(ids), 50):
            data = self._get("channels", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]))
            for it in data.get("items", []):
                s = it["statistics"]
                out.append({
                    "channel_id": it["id"],
                    "title": it["snippet"]["title"],
                    "published_at": it["snippet"]["publishedAt"],
                    "subscribers": int(s.get("subscriberCount", 0)),
                    "total_views": int(s.get("viewCount", 0)),
                    "video_count": int(s.get("videoCount", 0)),
                    "uploads_playlist": it["contentDetails"]["relatedPlaylists"]["uploads"],
                })
        return out

    # --- 動画 -------------------------------------------------------------
    def recent_video_ids(self, uploads_playlist: str, limit: int = 50) -> list[str]:
        ids, token = [], None
        while len(ids) < limit:
            data = self._get("playlistItems", part="contentDetails", playlistId=uploads_playlist,
                             maxResults=50, **({"pageToken": token} if token else {}))
            ids += [it["contentDetails"]["videoId"] for it in data.get("items", [])]
            token = data.get("nextPageToken")
            if not token:
                break
        return ids[:limit]

    def videos(self, ids: list[str]) -> list[dict]:
        out = []
        now = datetime.now(timezone.utc)
        for i in range(0, len(ids), 50):
            data = self._get("videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]))
            for it in data.get("items", []):
                sn, st = it["snippet"], it.get("statistics", {})
                published = datetime.fromisoformat(sn["publishedAt"].replace("Z", "+00:00"))
                out.append({
                    "video_id": it["id"],
                    "channel_id": sn["channelId"],
                    "channel": sn["channelTitle"],
                    "title": sn["title"],
                    "tags": sn.get("tags", []),
                    "published_at": published,
                    "days_since": max((now - published).days, 1),
                    "duration_sec": parse_duration(it["contentDetails"]["duration"]),
                    "views": int(st.get("viewCount", 0)),
                    "likes": int(st.get("likeCount", 0)),
                    "comments": int(st.get("commentCount", 0)),
                    "thumbnail": sn["thumbnails"].get("medium", {}).get("url", ""),
                })
        return out

    def search_video_titles(self, keyword: str, max_results: int = 50, region: str = "JP") -> list[str]:
        """視聴者側の需要（検索上位タイトル）を取得する。"""
        data = self._get("search", part="snippet", type="video", q=keyword, order="relevance",
                         maxResults=max_results, regionCode=region, relevanceLanguage="ja")
        return [it["snippet"]["title"] for it in data.get("items", [])]


def parse_duration(iso: str) -> int:
    m = re.fullmatch(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso)
    if not m:
        return 0
    d, h, mi, s = (int(x or 0) for x in m.groups())
    return d * 86400 + h * 3600 + mi * 60 + s
