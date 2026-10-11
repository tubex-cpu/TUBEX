"""デスクトップに TUBEX の作業フォルダを作る（git に入れないもの用）。

使い方:  python3 pipeline/scripts/setup_desktop.py
既にあるフォルダ・ファイルは触らない（何度実行しても安全）。
"""
import os
import sys
from pathlib import Path

# (フォルダ, そこに置くもの)
FOLDERS = [
    ("TUBEX_素材/00_受け取り", "とりあえず置き場。週1回、下のどこかに仕分けて空にする"),
    ("TUBEX_素材/01_リサーチ資料", "論文 PDF・公的資料など。出典 URL は episodes/<id>/01_research.md に書く"),
    ("TUBEX_素材/02_競合サムネ", "yt_research.py --thumbs-dir の保存先。git には入れない（URL だけ 06b に記録）"),
    ("TUBEX_素材/06_サムネ素材/写真_フリー素材", "商用利用・加工可の無料写真。出典・作者・ライセンスは 06c_thumbnail_assets.md に記録"),
    ("TUBEX_素材/06_サムネ素材/画像生成", "追加費用0の画像生成の出力。根拠は 06c_thumbnail_assets.md に記録"),
    ("TUBEX_素材/07_完成mp4", "フル画質の書き出し（video/out/<id>.mp4）をここへ移す。<id>.mp4 の名前のまま"),
    ("TUBEX_素材/08_公開済み", "YouTube に公開した最終版。<id>_公開日.mp4 で保管"),
    ("TUBEX_素材/09_分析", "YouTube Studio のスクショ・CSV。<id>_取得日.png"),
    ("個人", "TUBEX と関係ないもの"),
]


def desktop() -> Path:
    if sys.platform == "win32":
        # OneDrive でデスクトップが移動している場合にも対応
        import ctypes.wintypes
        buf = ctypes.create_unicode_buffer(ctypes.wintypes.MAX_PATH)
        ctypes.windll.shell32.SHGetFolderPathW(None, 0x10, None, 0, buf)
        return Path(buf.value)
    return Path.home() / "Desktop"


def main() -> None:
    base = Path(sys.argv[1]) if len(sys.argv) > 1 else desktop()
    for rel, note in FOLDERS:
        d = base / rel
        d.mkdir(parents=True, exist_ok=True)
        readme = d / "_ここに置くもの.txt"
        if not readme.exists():
            readme.write_text(note + "\n", encoding="utf-8")
        print(f"OK  {d}")
    if not (base / "TUBEX").exists():
        print(f"\nTUBEX 本体がまだありません。次で取得してください:\n  cd {base} && git clone https://github.com/tubex-cpu/TUBEX.git")


if __name__ == "__main__":
    main()
