import streamlit as st

st.set_page_config(page_title="TUBEX", layout="wide")

st.title("🎥 TUBEX - YouTube Marketing AI")
st.subheader("AI-Powered YouTube Content Strategy")

# デモUI
col1, col2 = st.columns(2)

with col1:
      st.markdown("### 📊 YouTube分析")
      channel_name = st.text_input("チャンネル名")
      if channel_name:
                st.info(f"分析対象: {channel_name}")

  with col2:
        st.markdown("### 🎬 コンテンツ生成")
        topic = st.text_input("動画トピック")
        if topic:
                  st.success(f"生成中: {topic}")

    st.markdown("---")
st.markdown("**TUBEX** - YouTube運用を AI が自動化します")
