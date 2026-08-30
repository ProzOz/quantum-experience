# Quantum Experience

Bilingual (TH / EN) lab site for basic quantum ideas. Built with SCIUS at Burapha University for booths and school visits — open it in a browser, no physics stack required.

<p align="center">
  <img src="classroom.jpg" alt="Quantum Experience lab backdrop" width="720">
</p>

**Stack:** HTML · CSS · vanilla JS &nbsp;·&nbsp; **Runtime:** static files, no backend &nbsp;·&nbsp; **Lang:** Thai + English

---

## Why this exists

Most intro-to-quantum pages are slides. Kids tap Next and leave.

We wanted something they can *break*: drag a Hadamard, watch the bars move, hold space and split into two lanes. If they only remember one thing after the booth, it should be “a qubit is not a coin flip with extra steps.”

---

## What you can do

| | Room | What happens |
| --- | --- | --- |
| 🧪 | Lab stations | Superposition, measurement, entanglement, interference, tunneling… walk the trail |
| ⚡ | Station 7 · Circuit | Drag H / X / CNOT / Oracle / Diffusion onto 3 wires. Run. Bars should peak on \|2⟩ |
| 🎮 | Qubit Runner | Canvas runner. Hold `Space` to split and phase through walls |
| 🌀 | Extra rooms | Aura intro, text-the-particle chat, match/duel, co-op entanglement |

Language toggle sits in the header. `TH` ↔ `EN`.

---

## Run it

Serve the folder. `file://` blocks the classroom video in some browsers.

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080)

Node, if you already have it:

```bash
npx serve .
```

Docker:

```bash
docker build -t quantum-experience .
docker run --rm -p 3000:3000 quantum-experience
```

→ [http://localhost:3000](http://localhost:3000)

No `npm install` needed just to play the site. Playwright in `package.json` is optional, for UI checks later.

---

## How the circuit piece works

Station 7 is a tiny state-vector on **3 qubits** (8 complex amplitudes).

- start at \|000⟩
- H on each wire → uniform superposition
- Oracle flips the phase of \|2⟩ (`010`)
- Diffusion amplifies that amplitude
- one Grover iteration → \|2⟩ around **82%**

That is enough to *see* Grover. It is not Qiskit and it will not scale past 3 qubits. That was the point — keep the math on-screen and the loop under a second.

---

## Files

```
index.html        entry + page shells
app.js            i18n + topic pages
lab.js            home, stations, Quantum Core
circuit.js/.css   drag-and-drop builder
game.js/.css      Qubit Runner
aura.js chat.js coop.js duel.js why.js
styles.css        shared theme
images/           station diagrams
Dockerfile        nginx:alpine, port 3000
```

Logos and classroom footage sit next to `index.html`.

---

## Team

| | |
| --- | --- |
| Dev | Chonlatee Sukwiwattanaporn |
| Dev | Pawat Iemsupapong |
| Advisor | Aukrit Natkaew |

SCIUS BUU · Faculty of Science, Burapha University

---

## License

MIT on the code. SCIUS / BUU logos stay with their owners — don’t reuse those on other projects.
