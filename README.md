# Quantum Experience

Interactive bilingual site (Thai / English) about basic quantum ideas.
Made with the SCIUS team at Burapha University for outreach — lab booths, school visits, and anyone who wants to poke at qubits without installing a physics stack.

Static HTML / CSS / JS. No backend. No build step.

## Team

| Role | Name |
| --- | --- |
| Dev | Chonlatee Sukwiwattanaporn |
| Dev | Pawat Iemsupapong |
| Advisor | Aukrit Natkaew |

SCIUS BUU · Faculty of Science, Burapha University

## What's on the site

- Lab stations: superposition, measurement, entanglement, interference, and the rest of the trail
- Station 7 circuit builder — drag H / X / CNOT / Oracle / Diffusion onto 3 wires, run, watch the probability bars
- **Qubit Runner** — canvas game. Hold space to split into superposition and phase through walls
- Extra rooms: Quantum Aura intro, text-the-particle chat, match/duel, co-op entanglement

TH / EN switch is in the header.

## Run locally

Some browsers block media from `file://`, so serve the folder.

```bash
python3 -m http.server 8080
```

Open http://localhost:8080

Same thing with Node:

```bash
npx serve .
```

### Docker

```bash
docker build -t quantum-experience .
docker run --rm -p 3000:3000 quantum-experience
```

http://localhost:3000

## Layout

```
index.html          entry
app.js              i18n + topic pages
lab.js              home, stations, Quantum Core
circuit.js/.css     circuit builder
game.js/.css        Qubit Runner
aura.js  chat.js  coop.js  duel.js  why.js
styles.css          shared theme
images/             station diagrams
Dockerfile          nginx:alpine, port 3000
nginx.conf
```

Logos and classroom footage sit next to `index.html` (`buraphalogo.png`, `classroom-bg.mp4`, aura backgrounds).

## Notes

- The circuit sim is an 8-amplitude state vector (3 qubits). Enough to show one Grover iteration. Not Qiskit.
- `playwright` in package.json is optional, for UI checks later. You do not need `npm install` just to open the site.

## License

MIT for the code. SCIUS / BUU logos stay with their owners.
