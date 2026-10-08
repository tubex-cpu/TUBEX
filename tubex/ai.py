"""分析結果からClaudeに差別化戦略（穴場設計）を書かせる。"""
from __future__ import annotations

import anthropic

MODEL = "claude-opus-5-5"

PROMPT = """あなたはYouTubeチャンネル戦略のプロです。以下の競合データを根拠に、
「競合と差別化できる穴場ポジション」を設計してください。

# 自チャンネルの前提
{my_channel}

# ① 競合サマリー
{channels}

# ② 伸びている動画（チャンネル中央値の2倍以上）上位
{hits}

# ② タイトル要素のリフト
{title_lift}

# ② 伸びた動画に多いキーワード
{keywords}

# ③ 需要はあるが供給が薄いテーマ（穴場候補）
{gaps}

# ③ 尺・曜日の空き
{format_gap}
空いている曜日: {weekday_gap}

# 出力形式（日本語・Markdown）
1. 競合の伸びている共通点（3〜5個、必ずデータ根拠つき）
2. 競合が取りこぼしているポジション（誰の・どんな悩みが放置されているか）
3. 穴場ポジション設計（ターゲット / 切り口 / 競合との違いを1行で / 勝てる理由）
4. 最初の10本の企画案（タイトル案 + 狙う穴場 + 流用する勝ちパターン）
5. フォーマット・投稿設計（尺、頻度、曜日、サムネの方向性）
6. リスクと検証方法（最初の30日で見るKPI）
"""


def design_strategy(api_key: str, my_channel: str, ctx: dict) -> str:
    client = anthropic.Anthropic(api_key=api_key)
    msg = client.messages.create(
        model=MODEL,
        max_tokens=8000,
        messages=[{"role": "user", "content": PROMPT.format(my_channel=my_channel or "（未入力）", **ctx)}],
    )
    return "".join(b.text for b in msg.content if b.type == "text")
