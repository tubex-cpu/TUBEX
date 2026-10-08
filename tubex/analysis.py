"""競合分析：①競合調査 → ②伸びている共通点 → ③差別化の穴場設計。"""
from __future__ import annotations

import re
from collections import Counter

import pandas as pd

WEEKDAYS = ["月", "火", "水", "木", "金", "土", "日"]
STOPWORDS = {
    "の", "は", "が", "を", "に", "で", "と", "も", "た", "て", "し", "な", "する", "した", "こと", "これ",
    "それ", "ため", "よう", "さん", "です", "ます", "shorts", "the", "and", "for", "with", "you", "how",
}
TOKEN_RE = re.compile(r"[ァ-ヴー]{2,}|[一-龠々]{2,}|[A-Za-z][A-Za-z0-9+#.]{1,}|\d+[選個つ万円%]")


def tokenize(text: str) -> list[str]:
    toks = [t.lower() for t in TOKEN_RE.findall(text)]
    return [t for t in toks if t not in STOPWORDS]


def duration_bucket(sec: int) -> str:
    if sec <= 60:
        return "ショート(〜1分)"
    if sec <= 480:
        return "短尺(1〜8分)"
    if sec <= 1200:
        return "中尺(8〜20分)"
    return "長尺(20分〜)"


def title_features(title: str) -> dict:
    return {
        "has_number": bool(re.search(r"\d", title)),
        "has_bracket": bool(re.search(r"[【】\[\]「」『』]", title)),
        "has_question": "?" in title or "？" in title,
        "has_exclaim": "!" in title or "！" in title,
        "negative_word": bool(re.search(r"やめ|失敗|NG|ダメ|危険|後悔|損|罠|注意|知らない", title)),
        "title_len": len(title),
    }


# ① 競合調査 ---------------------------------------------------------------
def build_video_frame(videos: list[dict]) -> pd.DataFrame:
    df = pd.DataFrame(videos)
    if df.empty:
        return df
    df["views_per_day"] = df["views"] / df["days_since"]
    df["engagement"] = (df["likes"] + df["comments"]) / df["views"].clip(lower=1)
    df["duration_type"] = df["duration_sec"].map(duration_bucket)
    df["weekday"] = df["published_at"].dt.tz_convert("Asia/Tokyo").dt.weekday.map(lambda i: WEEKDAYS[i])
    df["hour"] = df["published_at"].dt.tz_convert("Asia/Tokyo").dt.hour
    df = pd.concat([df, df["title"].apply(title_features).apply(pd.Series)], axis=1)
    # チャンネル中央値比の「外れ値スコア」：チャンネル規模に依らず“伸びた動画”を測る
    median = df.groupby("channel_id")["views"].transform("median").clip(lower=1)
    df["outlier_score"] = df["views"] / median
    df["is_hit"] = df["outlier_score"] >= 2.0
    return df


def channel_summary(channels: list[dict], df: pd.DataFrame) -> pd.DataFrame:
    ch = pd.DataFrame(channels).set_index("channel_id")
    g = df.groupby("channel_id")
    ch["recent_median_views"] = g["views"].median()
    ch["avg_views_per_day"] = g["views_per_day"].mean()
    ch["hit_rate"] = g["is_hit"].mean()
    span = (g["published_at"].max() - g["published_at"].min()).dt.days.clip(lower=1)
    ch["uploads_per_week"] = g.size() / span * 7
    ch["views_per_sub"] = ch["recent_median_views"] / ch["subscribers"].clip(lower=1)
    ch["main_format"] = g["duration_type"].agg(lambda s: s.mode().iat[0])
    cols = ["title", "subscribers", "video_count", "recent_median_views", "avg_views_per_day",
            "views_per_sub", "hit_rate", "uploads_per_week", "main_format"]
    return ch[cols].sort_values("avg_views_per_day", ascending=False)


# ② 伸びている共通点 -------------------------------------------------------
def growth_patterns(df: pd.DataFrame) -> dict:
    hits, rest = df[df["is_hit"]], df[~df["is_hit"]]
    feats = ["has_number", "has_bracket", "has_question", "has_exclaim", "negative_word"]
    labels = {"has_number": "数字入りタイトル", "has_bracket": "【】「」などの括弧", "has_question": "疑問形",
              "has_exclaim": "感嘆符", "negative_word": "ネガティブ訴求(失敗/NG/後悔等)"}
    title_lift = pd.DataFrame({
        "要素": [labels[f] for f in feats],
        "伸びた動画での割合": [hits[f].mean() if len(hits) else 0 for f in feats],
        "その他での割合": [rest[f].mean() if len(rest) else 0 for f in feats],
    })
    title_lift["差"] = title_lift["伸びた動画での割合"] - title_lift["その他での割合"]

    hit_words = Counter(w for t in hits["title"] for w in set(tokenize(t)))
    all_words = Counter(w for t in df["title"] for w in set(tokenize(t)))
    n_hit, n_all = max(len(hits), 1), max(len(df), 1)
    kw = pd.DataFrame([
        {"キーワード": w, "伸びた動画で出現": c, "リフト": (c / n_hit) / (all_words[w] / n_all),
         "使っている競合数": df[df["title"].str.lower().str.contains(re.escape(w))]["channel_id"].nunique()}
        for w, c in hit_words.items() if c >= 2
    ])
    if not kw.empty:
        kw = kw.sort_values(["リフト", "伸びた動画で出現"], ascending=False).head(20)

    by_format = df.groupby("duration_type").agg(本数=("views", "size"), 中央値再生=("outlier_score", "median"),
                                                ヒット率=("is_hit", "mean")).sort_values("ヒット率", ascending=False)
    by_weekday = df.groupby("weekday")["outlier_score"].median().reindex(WEEKDAYS)
    return {
        "hits": hits.sort_values("outlier_score", ascending=False),
        "title_lift": title_lift.sort_values("差", ascending=False),
        "keywords": kw,
        "by_format": by_format,
        "by_weekday": by_weekday,
        "hit_title_len": hits["title_len"].median() if len(hits) else None,
        "other_title_len": rest["title_len"].median() if len(rest) else None,
    }


# ③ 穴場設計 ---------------------------------------------------------------
def find_gaps(df: pd.DataFrame, demand_titles: list[str], patterns: dict) -> dict:
    """需要（検索上位）にはあるが競合の供給が薄いテーマ ＝ 穴場。"""
    n_ch = max(df["channel_id"].nunique(), 1)
    demand = Counter(w for t in demand_titles for w in set(tokenize(t)))
    supply = Counter(w for t in df["title"] for w in set(tokenize(t)))
    rows = []
    for w, d in demand.items():
        if d < 2:
            continue
        s = supply.get(w, 0)
        covered = df[df["title"].str.lower().str.contains(re.escape(w))]
        rows.append({
            "テーマ語": w,
            "需要(検索上位での出現)": d,
            "競合の供給本数": s,
            "扱う競合数": covered["channel_id"].nunique(),
            "供給がある場合の平均外れ値": covered["outlier_score"].mean() if len(covered) else None,
            "穴場スコア": d / (1 + s) * (1 + (n_ch - covered["channel_id"].nunique()) / n_ch),
        })
    gaps = pd.DataFrame(rows)
    if not gaps.empty:
        gaps = gaps.sort_values("穴場スコア", ascending=False).head(20)

    fmt = patterns["by_format"]
    format_gap = fmt[(fmt["本数"] <= fmt["本数"].median()) & (fmt["ヒット率"] >= fmt["ヒット率"].median())]
    wd = patterns["by_weekday"].dropna()
    crowded = df["weekday"].value_counts()
    weekday_gap = [d for d in wd.index if wd[d] >= wd.median() and crowded.get(d, 0) <= crowded.median()]
    return {"topic_gaps": gaps, "format_gap": format_gap, "weekday_gap": weekday_gap}
