#!/bin/zsh
# assemble.sh <assets-dir> <frames-out-dir> <clip1> <clip2> ...  (clip names, no .mp4, in order)
#
# Concats the chained clips (dropping the duplicate junction frame on clips 2+), encodes the
# master with -fps_mode vfr (CFR padding causes frozen scrub zones), extracts ~300 JPEG frames
# for the canvas scrubber, and prints the final-frame seam colour for the handoff.
#
# Vertical-native: frames are scaled by HEIGHT (1280px tall for 9:16 film — ~720px wide).
# One frame set serves phone (full-bleed) and desktop (the ~650px-wide cinema stage).
# For a deliberate 16:9 build, frames scale by width instead (auto-detected below).
# Mechanical lane — no model. Requires: ffmpeg, xxd.
set -e -o pipefail
setopt null_glob 2>/dev/null || true
A=$1; F=$2; shift 2
if [[ -z "$A" || -z "$F" || $# -lt 2 ]]; then
  echo "usage: assemble.sh <assets-dir> <frames-out-dir> <clip1> <clip2> ... (>=2 clips)"; exit 1
fi
for CLIP in "$@"; do [[ -r "$A/$CLIP.mp4" ]] || { echo "missing clip: $A/$CLIP.mp4"; exit 1; }; done
mkdir -p "$F"

INPUTS=(); FILTER=""; N=0
for CLIP in "$@"; do
  INPUTS+=(-i "$A/$CLIP.mp4")
  if (( N == 0 )); then FILTER+="[${N}:v]setpts=PTS-STARTPTS[v${N}];"
  else FILTER+="[${N}:v]select='gte(n\\,1)',setpts=PTS-STARTPTS[v${N}];"; fi
  N=$((N+1))
done
CONCAT=""; for ((i=0;i<N;i++)); do CONCAT+="[v${i}]"; done
FILTER+="${CONCAT}concat=n=${N}:v=1:a=0[out]"

ffmpeg -y -v error "${INPUTS[@]}" -filter_complex "$FILTER" -map "[out]" \
  -fps_mode vfr -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p "$A/master.mp4"
read MW MH MNF <<< "$(ffprobe -v error -select_streams v -show_entries stream=width,height,nb_frames -of csv=p=0 "$A/master.mp4" | tr ',' ' ')"
echo "master: ${MW}x${MH}, ${MNF} frames"

# Portrait film → fix height at 1280; landscape film → fix width at 1280.
if (( MH > MW )); then SCALE="scale=-2:1280"; else SCALE="scale=1280:-2"; fi

rm -f "$F"/f_*.jpg
ffmpeg -v error -i "$A/master.mp4" -vf "select='not(mod(n\\,2))',$SCALE" -vsync vfr -q:v 4 "$F/f_%04d.jpg"
FRAMES=("$F"/f_*.jpg)
COUNT=${#FRAMES[@]}
if (( COUNT == 0 )); then echo "FAILED — no frames were extracted"; exit 1; fi
echo "frames: $COUNT ($SCALE), $(du -sh "$F" | cut -f1)"
echo "engine contract: files are f_0001..f_$(printf '%04d' $COUNT) — FRAME_COUNT=$COUNT, frame i (0-based) = f_\$(i+1)"

LAST=${FRAMES[-1]}
# Seam colour: average a centred patch of the bottom strip (edges get polluted by vignette).
SEAM=$(ffmpeg -v error -i "$LAST" -vf "crop=iw*0.5:ih*0.10:iw*0.25:ih*0.88,scale=1:1" -frames:v 1 -f rawvideo -pix_fmt rgb24 - | xxd -p | cut -c1-6)
if [[ -z "$SEAM" ]]; then echo "warning: seam colour could not be sampled — sample $LAST manually"; else
echo "seam colour of $(basename $LAST): #$SEAM   (start the after-film section background here)"; fi
