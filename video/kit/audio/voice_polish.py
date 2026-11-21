"""Narration finishing used in ルール改変ニッポン (2026-11-13): low cut, a little warmth, presence, de-harsh, gentle compression.
Usage: from voice_polish import polish; y = polish(x, sr)   # x: (n,) or (n, 2) float array
Needs: pip install pedalboard"""
import numpy as np
from pedalboard import Pedalboard, HighpassFilter, PeakFilter, Compressor, LowShelfFilter


def polish(x, sr):
    board = Pedalboard([HighpassFilter(75), LowShelfFilter(cutoff_frequency_hz=160, gain_db=1.0), PeakFilter(cutoff_frequency_hz=3200, gain_db=2.5, q=0.9),
                        PeakFilter(cutoff_frequency_hz=7000, gain_db=-1.5, q=1.2), Compressor(threshold_db=-20, ratio=2.5, attack_ms=6, release_ms=120)])
    a = np.asarray(x, dtype=np.float32)
    mono = a.ndim == 1
    y = board((a[None, :] if mono else a.T), sr)
    return (y[0] if mono else y.T).astype(np.float64)
