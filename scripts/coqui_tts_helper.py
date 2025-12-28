# Coqui TTS local helper (example)
# Usage: python scripts/coqui_tts_helper.py --text "hello" --out out.wav
import argparse
import subprocess
import os

parser = argparse.ArgumentParser()
parser.add_argument('--text', required=True)
parser.add_argument('--out', default='out.wav')
args = parser.parse_args()

# This file assumes you have Coqui TTS installed and a local server or CLI available.
# Example using TTS CLI (after pip install TTS):
# TTS --text "hello" --out_path out.wav --model_name "tts_models/multilingual/multi-dataset/your-model"
cmd = ['TTS', '--text', args.text, '--out_path', args.out]
subprocess.run(cmd)
print('Wrote', args.out)
