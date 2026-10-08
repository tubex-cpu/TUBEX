import os

import streamlit as st

from tubex.analysis import build_video_frame, channel_summary, find_gaps, growth_patterns, rule_based_strategy
from tubex.youtube import YouTubeClient

st.set_page_config(page_title="TUBEX", layout="wide")

st.title("🎥 TUBEX - YouTube Marketing AI")
st.subheader("競合調査 → 伸びている共通点 → 差別化の穴場設計")


def secret(name: str) -> str:
    try:
        return st.secrets.get(name, "") or os.getenv(name, "")
    except Exception:
        return os.getenv(name, "")


with st.sidebar:
    st.header("⚙️ 設定")
    yt_key = st.text_input("YouTube Data API Key", value=secret("YOUTUBE_API_KEY"), type="password")
    claude_key = st.text_input("Anthropic API Key（③のAI戦略用・任意）", value=secret("ANTHROPIC_API_KEY"),
                               type="password")
    videos_per_channel = st.slider("1チャンネルあたりの分析動画数", 10, 50, 30)
    max_competitors = st.slider("自動収集する競合数", 3, 15, 8)

st.markdown("### 📊 ① 競合調査")
c1, c2 = st.columns(2)
keyword = c1.text_input("ジャンル / キーワード（例：AI 副業、筋トレ 初心者）")
manual = c2.text_area("競合チャンネルを直接指定（URL・@handle・ID、1行1件・任意）")
my_channel = st.text_input("自分のチャンネルの方向性（任意：例『30代会社員向けのAI活用』）")

if st.button("分析開始", type="primary", disabled=not (yt_key and (keyword or manual.strip()))):
    yt = YouTubeClient(yt_key)
    with st.spinner("競合を収集中..."):
        ids = [cid for ref in manual.splitlines() if ref.strip() and (cid := yt.resolve_channel_id(ref))]
        if keyword:
            ids += [c for c in yt.search_channels(keyword, max_competitors) if c not in ids]
        channels = yt.channels(ids)
        vids = []
        for ch in channels:
            vids += yt.videos(yt.recent_video_ids(ch["uploads_playlist"], videos_per_channel))
        demand = yt.search_video_titles(keyword) if keyword else []
    df = build_video_frame(vids)
    if df.empty:
        st.error("動画データが取得できませんでした。")
        st.stop()
    patterns = growth_patterns(df)
    st.session_state.result = {
        "channels": channel_summary(channels, df), "df": df, "patterns": patterns,
        "gaps": find_gaps(df, demand, patterns), "my_channel": my_channel,
    }

res = st.session_state.get("result")
if not res:
    st.info("サイドバーにAPIキーを入れ、キーワードか競合チャンネルを指定して「分析開始」を押してください。")
    st.stop()

pct = {"hit_rate": "{:.0%}", "views_per_sub": "{:.2f}", "avg_views_per_day": "{:,.0f}",
       "recent_median_views": "{:,.0f}", "subscribers": "{:,}", "uploads_per_week": "{:.1f}"}
st.dataframe(res["channels"].style.format(pct), use_container_width=True)
st.caption("views_per_sub = 直近動画の中央値再生 ÷ 登録者数（1超えは登録者外に届いている＝伸び盛り） / "
           "hit_rate = チャンネル中央値の2倍以上伸びた動画の割合")

st.markdown("### 🚀 ② 競合の伸びている共通点")
p = res["patterns"]
st.markdown("**伸びた動画（チャンネル中央値比の外れ値）TOP15**")
st.dataframe(p["hits"][["channel", "title", "views", "outlier_score", "duration_type", "weekday"]].head(15)
             .style.format({"views": "{:,}", "outlier_score": "{:.1f}x"}), use_container_width=True)
a, b = st.columns(2)
a.markdown("**タイトル要素：伸びた動画 vs その他**")
a.dataframe(p["title_lift"].style.format({c: "{:+.0%}" if c == "差" else "{:.0%}"
                                          for c in ["伸びた動画での割合", "その他での割合", "差"]}),
            use_container_width=True, hide_index=True)
if p["hit_title_len"]:
    a.caption(f"タイトル文字数の中央値：伸びた動画 {p['hit_title_len']:.0f}字 / その他 {p['other_title_len'] or 0:.0f}字")
b.markdown("**伸びた動画に偏って出るキーワード**")
b.dataframe(p["keywords"], use_container_width=True, hide_index=True)
a, b = st.columns(2)
a.markdown("**尺ごとの成績**")
a.dataframe(p["by_format"].style.format({"中央値再生": "{:.2f}x", "ヒット率": "{:.0%}"}), use_container_width=True)
b.markdown("**曜日ごとの外れ値スコア（中央値）**")
b.bar_chart(p["by_weekday"])

st.markdown("### 🎯 ③ 競合と差別化する穴場設計")
g = res["gaps"]
st.markdown("**需要はあるのに競合の供給が薄いテーマ（穴場スコア順）**")
if g["topic_gaps"].empty:
    st.caption("需要データがありません（キーワード指定時のみ算出）。")
else:
    st.dataframe(g["topic_gaps"].style.format({"穴場スコア": "{:.2f}", "供給がある場合の平均外れ値": "{:.1f}"},
                                              na_rep="—"), use_container_width=True, hide_index=True)
a, b = st.columns(2)
a.markdown("**空いている尺（本数少 × ヒット率高）**")
a.dataframe(g["format_gap"], use_container_width=True)
b.markdown("**空いている曜日（投稿が少ない × 伸びやすい）**")
b.write("、".join(g["weekday_gap"]) or "—")

st.markdown("#### 📝 穴場設計レポート（無料・AI不要）")
st.markdown(rule_based_strategy(res["channels"], p, g))

st.markdown("#### 🤖 AIでさらに詳しく設計（任意・Anthropic API）")
if st.button("戦略を生成", disabled=not claude_key):
    from tubex.ai import design_strategy

    ctx = {
        "channels": res["channels"].to_markdown(),
        "hits": p["hits"][["channel", "title", "views", "outlier_score", "duration_type"]].head(20).to_markdown(),
        "title_lift": p["title_lift"].to_markdown(index=False),
        "keywords": p["keywords"].to_markdown(index=False) if not p["keywords"].empty else "なし",
        "gaps": g["topic_gaps"].to_markdown(index=False) if not g["topic_gaps"].empty else "なし",
        "format_gap": g["format_gap"].to_markdown(),
        "weekday_gap": "、".join(g["weekday_gap"]) or "なし",
    }
    with st.spinner("戦略を設計中..."):
        st.markdown(design_strategy(claude_key, res["my_channel"], ctx))
if not claude_key:
    st.caption("Anthropic API Keyを入れると、上記データを根拠に穴場ポジション・企画10本・投稿設計まで自動生成します。")

st.markdown("---")
st.markdown("**TUBEX** automates your YouTube management with AI")
