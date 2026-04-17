#!/usr/bin/env bash
# RG 158 video asset pipeline. Reproducible — drop new MOVs in raw-videos/ and rerun.
# Outputs: public/videos/*.mp4 + .webm, public/gallery/*.jpg + .webp, public/*-poster.jpg
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RAW="$ROOT/raw-videos"
VID="$ROOT/public/videos"
GAL="$ROOT/public/gallery"
PUB="$ROOT/public"

mkdir -p "$VID" "$GAL"

# Consistent color grade — punch + saturation + slight gamma lift
GRADE="eq=contrast=1.08:saturation=1.18:gamma=0.96,vignette=PI/5"

# ─────────────────────────────────────────────────────────────────────
# STILLS — extract gallery images at hand-picked timestamps
# ─────────────────────────────────────────────────────────────────────
extract_still () {
  # $1 source, $2 timestamp, $3 outname (basename, no ext)
  ffmpeg -y -loglevel error -ss "$2" -i "$1" -frames:v 1 \
    -vf "${GRADE},scale=1920:-2:flags=lanczos" -q:v 2 "$GAL/$3.jpg"
  ffmpeg -y -loglevel error -i "$GAL/$3.jpg" -c:v libwebp -quality 85 "$GAL/$3.webp"
}

echo "→ Extracting gallery stills"
# Mapped to existing Gallery.jsx filenames + new additions
extract_still "$RAW/clip-01.mov"  2.0  "venue-main"          # upstairs view of full-lit stage
extract_still "$RAW/clip-03.mov"  8.5  "bar-area"            # main bar wide w/ magenta+blue LEDs
extract_still "$RAW/clip-01.mov"  38.5 "stage-lights"        # PA stage close-up w/ smoke
extract_still "$RAW/clip-01.mov"  22.5 "vip-upstairs"        # upstairs balcony in blue
extract_still "$RAW/clip-01.mov"  8.0  "event-setup"         # VIP curtained cabanas
extract_still "$RAW/clip-01.mov"  37.0 "sound-system"        # PA speakers + lighting rig
extract_still "$RAW/clip-03.mov"  28.0 "crowd-event"         # dance floor w/ multicolor disco speckles
extract_still "$RAW/clip-01.mov"  15.5 "bar-drinks"          # private bar w/ bartender + bottles
extract_still "$RAW/clip-03.mov"  21.0 "projector-screen"    # projector wall area

# Extra stills for richness
extract_still "$RAW/clip-04.mov"  11.5 "neon-logo"           # RG 158 neon (purple)
extract_still "$RAW/clip-04.mov"  2.5  "neon-logo-pink"      # RG 158 neon (pink)
extract_still "$RAW/clip-03.mov"  15.0 "main-bar-wide"       # long bar wide
extract_still "$RAW/clip-03.mov"  34.0 "bar-tvs"             # bar w/ TVs
extract_still "$RAW/clip-01.mov"  30.0 "upstairs-lounge"     # upstairs lounge tables
extract_still "$RAW/clip-01.mov"  6.5  "vip-cabanas-close"   # closer cabana shot

echo "→ Hero poster"
ffmpeg -y -loglevel error -ss 2.0 -i "$RAW/clip-01.mov" -frames:v 1 \
  -vf "${GRADE},scale=1920:-2:flags=lanczos" -q:v 2 "$PUB/hero-poster.jpg"

echo "→ Sizzle poster (with subtle dark gradient bottom for play-button readability)"
ffmpeg -y -loglevel error -ss 8.5 -i "$RAW/clip-03.mov" -frames:v 1 \
  -vf "${GRADE},scale=1920:-2:flags=lanczos,format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(gt(Y,H*0.5), 255, 255)'" \
  -q:v 2 "$PUB/sizzle-poster.jpg"

echo "→ OG card (1200x630 with logo overlay)"
ffmpeg -y -loglevel error -ss 8.5 -i "$RAW/clip-03.mov" -frames:v 1 \
  -vf "${GRADE},crop=1280:720,scale=1200:630:force_original_aspect_ratio=increase,crop=1200:630" \
  -q:v 3 "$PUB/og-card.jpg"

# ─────────────────────────────────────────────────────────────────────
# HERO LOOP — silent, looping, ≤2MB, dual-encode H.264 + VP9 WebM
# ─────────────────────────────────────────────────────────────────────
echo "→ Hero loop (mp4 + webm)"

# Use clip-01 0-10s (upstairs view of full-lit stage). Add 0.5s xfade end→start for seamless loop.
# First trim a clean 10s segment, color-grade it, then encode.
ffmpeg -y -loglevel error -ss 0.5 -t 10 -i "$RAW/clip-01.mov" \
  -an \
  -vf "${GRADE},scale=1280:720:flags=lanczos,fade=t=in:st=0:d=0.4,fade=t=out:st=9.6:d=0.4" \
  -c:v libx264 -profile:v high -level 4.0 -preset slow -crf 26 -pix_fmt yuv420p \
  -movflags +faststart \
  "$VID/hero-loop.mp4"

ffmpeg -y -loglevel error -i "$VID/hero-loop.mp4" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -tile-columns 2 -frame-parallel 1 \
  -an "$VID/hero-loop.webm"

# ─────────────────────────────────────────────────────────────────────
# FEATURE HIGHLIGHT CLIPS — 4× muted, 12-18s each, ~2Mbps
# ─────────────────────────────────────────────────────────────────────
echo "→ Feature highlight clips"

build_feature () {
  # $1 source, $2 start, $3 duration, $4 out-name
  ffmpeg -y -loglevel error -ss "$2" -t "$3" -i "$RAW/$1" \
    -an \
    -vf "${GRADE},scale=1280:720:flags=lanczos,fade=t=in:st=0:d=0.6,fade=t=out:st=$(awk "BEGIN{print $3-0.6}"):d=0.6" \
    -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -movflags +faststart \
    "$VID/$4.mp4"
}

build_feature "clip-03.mov"  4.5  16  "feature-bar"          # main bar walk-through
build_feature "clip-01.mov"  0.5  12  "feature-stage"        # stage w/ full color lights
build_feature "clip-01.mov"  6.5  18  "feature-vip"          # VIP cabanas → private bar
build_feature "clip-03.mov"  24.0 12  "feature-dancefloor"   # dance floor w/ disco speckles

# ─────────────────────────────────────────────────────────────────────
# SIZZLE REEL — 50-55s, structured, with text overlays
# Music gets mixed in by sizzle-music.sh once track is provided.
# ─────────────────────────────────────────────────────────────────────
echo "→ Sizzle reel (silent first pass — music mix in after)"

# Build the reel by concatenating named segments via filter_complex with crossfade transitions.
# Segments (timing in source MOV):
#   S1: clip-04  3.0s  →  RG 158 neon brand cold open
#   S2: clip-01  0.5s → 6.0s  →  full stage with lights
#   S3: clip-03  5.0s → 12.0s →  main bar magenta+blue
#   S4: clip-01  13.0s → 19.0s → private bar / bottles
#   S5: clip-01  6.5s → 11.5s →  VIP cabanas
#   S6: clip-01  22.0s → 28.0s → upstairs balcony
#   S7: clip-03  25.0s → 31.0s → dance floor disco speckles
#   S8: clip-01  36.0s → 40.0s → stage PA close-up
#   S9: clip-04  10.0s → 13.0s → neon brand close (different color cycle)

# Pre-cut every segment into a temp file with consistent format.
TMP="$ROOT/scripts/tmp-segments"
mkdir -p "$TMP"
rm -f "$TMP"/*.mp4

cut_seg () {
  # $1 source, $2 start, $3 duration, $4 out-name
  ffmpeg -y -loglevel error -ss "$2" -t "$3" -i "$RAW/$1" \
    -an \
    -vf "${GRADE},scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080,fps=30,setpts=PTS-STARTPTS" \
    -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p \
    "$TMP/$4.mp4"
}

cut_seg "clip-04.mov" 0.5  3.0  "s1-neon-open"
cut_seg "clip-01.mov" 0.5  5.5  "s2-stage-wide"
cut_seg "clip-03.mov" 5.0  7.0  "s3-main-bar"
cut_seg "clip-01.mov" 13.0 6.0  "s4-private-bar"
cut_seg "clip-01.mov" 6.5  5.0  "s5-vip-cabanas"
cut_seg "clip-01.mov" 22.0 6.0  "s6-upstairs-balcony"
cut_seg "clip-03.mov" 25.0 6.0  "s7-dance-floor"
cut_seg "clip-01.mov" 36.0 4.0  "s8-stage-pa"
cut_seg "clip-04.mov" 10.0 3.0  "s9-neon-close"

# Build end-card: 5s of solid black with gold Bebas Neue text + CTA.
echo "→ End card"
ffmpeg -y -loglevel error \
  -f lavfi -t 5 -i "color=c=black:s=1920x1080:r=30" \
  -vf "drawtext=text='RG 158':fontcolor=#d4a843:fontsize=180:font='Impact':x=(w-text_w)/2:y=(h-text_h)/2-100:alpha='if(lt(t,0.4),t/0.4,1)',\
       drawtext=text='Your Event. Our Stage.':fontcolor=#f0f0f0:fontsize=58:font='Inter':x=(w-text_w)/2:y=(h-text_h)/2+90:alpha='if(lt(t,0.7),max(0\,(t-0.3)/0.4),1)',\
       drawtext=text='rg158ent.com  ·  Book Today':fontcolor=#a0a0a0:fontsize=36:font='Inter':x=(w-text_w)/2:y=(h-text_h)/2+170:alpha='if(lt(t,1.0),max(0\,(t-0.6)/0.4),1)',\
       fade=t=out:st=4.4:d=0.6" \
  -an \
  -c:v libx264 -preset medium -crf 22 -pix_fmt yuv420p \
  "$TMP/s10-endcard.mp4"

# Concat list
{
  for s in s1-neon-open s2-stage-wide s3-main-bar s4-private-bar s5-vip-cabanas s6-upstairs-balcony s7-dance-floor s8-stage-pa s9-neon-close s10-endcard; do
    echo "file '$TMP/$s.mp4'"
  done
} > "$TMP/concat.txt"

# Concat with smooth re-encode (handles tiny timing drift)
ffmpeg -y -loglevel error -f concat -safe 0 -i "$TMP/concat.txt" \
  -an \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart \
  "$VID/sizzle-reel.mp4"

# ─────────────────────────────────────────────────────────────────────
# VERTICAL SOCIAL CUT (1080x1920) — derived from sizzle reel + clip-02
# ─────────────────────────────────────────────────────────────────────
echo "→ Vertical social cut"

# Center-crop the sizzle reel to vertical 9:16
ffmpeg -y -loglevel error -i "$VID/sizzle-reel.mp4" -t 30 \
  -vf "crop=ih*9/16:ih,scale=1080:1920:flags=lanczos" \
  -an \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p -movflags +faststart \
  "$VID/social-vertical.mp4"

# Cleanup
rm -rf "$TMP"

# Print sizes
echo
echo "─── Output sizes ───"
ls -lh "$VID"
echo
ls -lh "$GAL" | head -25
echo
ls -lh "$PUB"/hero-poster.jpg "$PUB"/sizzle-poster.jpg "$PUB"/og-card.jpg
