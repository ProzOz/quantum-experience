#!/bin/zsh
# phone-shell.sh <site-dir> [iframe-src] [title]
#
# Writes <site-dir>/phone.html — an iPhone-style shell (titanium band, dynamic island,
# side buttons) framing the site in a 390x844 iframe on a dark studio backdrop.
# The instant desktop preview for a mobile-first scroll-film: open it right after any
# build step (e.g. `open http://localhost:8317/phone.html`).
# Mechanical lane — no model. The shell is deliberately brand-neutral chrome.
set -e -o pipefail
DIR=$1; SRC=${2:-/}; TITLE=${3:-"Scroll-film preview"}
[[ -d "$DIR" ]] || { echo "usage: phone-shell.sh <site-dir> [iframe-src] [title]"; exit 1; }

cat > "$DIR/phone.html" <<EOF
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE} — phone</title>
<style>
  html,body{height:100%;margin:0}
  body{
    display:flex;align-items:center;justify-content:center;gap:56px;
    background:radial-gradient(120% 120% at 50% 0%, #101820 0%, #05080b 60%, #020304 100%);
    font-family:ui-monospace,monospace;
  }
  .shell{
    position:relative;width:390px;height:844px;flex:0 0 auto;
    border-radius:54px;background:#000;
    box-shadow:
      0 0 0 2px #1a1d20,
      0 0 0 12px #2e3237,
      0 0 0 13px #14161a,
      0 40px 90px rgba(0,0,0,.75),
      0 8px 24px rgba(0,0,0,.6);
  }
  .shell iframe{width:390px;height:844px;border:0;border-radius:42px;background:#000;display:block}
  .island{
    position:absolute;top:12px;left:50%;transform:translateX(-50%);
    width:120px;height:34px;border-radius:20px;background:#000;z-index:5;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.04);
  }
  .island::after{
    content:'';position:absolute;right:14px;top:50%;transform:translateY(-50%);
    width:10px;height:10px;border-radius:50%;
    background:radial-gradient(circle at 35% 35%, #1b2b38 0%, #060a0e 60%);
  }
  .btn{position:absolute;background:#3a3f45;border-radius:3px}
  .btn.action{left:-15px;top:190px;width:3px;height:34px}
  .btn.volu  {left:-15px;top:248px;width:3px;height:58px}
  .btn.vold  {left:-15px;top:318px;width:3px;height:58px}
  .btn.power {right:-15px;top:264px;width:3px;height:92px}
  .hint{
    color:#5b6a70;font-size:11px;letter-spacing:.28em;text-transform:uppercase;
    writing-mode:vertical-rl;opacity:.7;user-select:none;
  }
  @media (max-height:920px){ body{zoom:0.86} }
</style>
</head>
<body>
  <div class="hint">${TITLE}</div>
  <div class="shell">
    <div class="island"></div>
    <i class="btn action"></i><i class="btn volu"></i><i class="btn vold"></i><i class="btn power"></i>
    <iframe src="${SRC}" title="site preview"></iframe>
  </div>
  <div class="hint" style="visibility:hidden">.</div>
</body>
</html>
EOF
echo "wrote $DIR/phone.html (iframe src: $SRC)"
