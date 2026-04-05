import streamlit as st

st.set_page_config(page_title="TUBEX", layout="wide")

st.title("🎥 TUBEX - YouTube Marketing AI")
st.subheader("AI-Powered YouTube Content Strategy")

st.markdown("### 📊 YouTube Analysis")
channel = st.text_input("Enter channel name:")
if channel:
          st.info(f"Analyzing: {channel}")

st.markdown("### 🎬 Content Generation")
topic = st.text_input("Enter video topic:")
if topic:
          st.success(f"Generating: {topic}")

st.markdown("---")
st.markdown("**TUBEX** automates your YouTube management with AI")
