# Plan: Quantum Circuit Builder (Station 7)

## What we're building

A **drag-and-drop quantum circuit builder** as Station 7 — the capstone that ties every quantum concept together. Instead of watching pre-built demos, the user assembles a Grover's Search circuit from scratch and watches it work.

## Why this is the right idea

Grover's algorithm is the climax of the quantum journey (already scaffolded as the Quantum Core page). Station 7 bridges the gap between "understanding quantum gates" and "actually building a quantum algorithm." It has:

- **Real interactivity**: drag gates, wire them together, watch the circuit run
- **Immediate feedback**: every gate placement changes the output probabilities live
- **Goal structure**: hit a target probability distribution, not just observe one
- **Ties everything together**: superposition (H gates), entanglement (CNOT), interference (oracle + diffusion), measurement (final bar chart)
- **Satisfying to complete**: the moment the circuit "works" and lights up the right answer is genuinely exciting

## Design

### UI Layout
```
┌─────────────────────────────────────────────────────────────┐
│  STATION 7 · QUANTUM CIRCUIT BUILDER                        │
│  [objective card: "Build Grover's search for |2⟩"]          │
├───────────────┬─────────────────────────────────────────────┤
│               │  Circuit Canvas (horizontal wire lanes)      │
│   Gate        │  [Q0] ──[H]──[Oracle]──[H]──[Diffuse]──|M|  │
│   Palette     │  [Q1] ──[H]──[Oracle]──[H]──[Diffuse]──|M|  │
│               │  [Q2] ──[H]──[Oracle]──[H]──[Diffuse]──|M|  │
│  [H] Hadamard ├─────────────────────────────────────────────┤
│  [X] Pauli-X  │  Output: Probability Distribution           │
│  [CNOT]       │  ▓▓▓▓▓▓▓░░░ |0⟩ 14%                        │
│  [Oracle]     │  ▓▓▓▓▓▓▓▓▓░ |1⟩ 3%   ← Target: |2⟩ ≥ 80%  │
│  [Diffuse]    │  ▓▓▓▓▓▓▓▓▓▓ |2⟩ 82%  ✅                    │
│  [Measure]    │  ▓▓▓▓▓▓▓░░░ |3⟩ 1%                         │
│               │  ▓▓▓▓▓▓▓▓░░ |4⟩ 3%                         │
├───────────────┴─────────────────────────────────────────────┤
│  [Reset] [Hint]                          [Check Solution]   │
└─────────────────────────────────────────────────────────────┘
```

### Gates
| Gate | Color | Effect on 3-qubit state |
|------|-------|------------------------|
| H (Hadamard) | cyan | Puts qubit in superposition |
| X (Pauli) | red | Bit flip |
| CNOT | violet | Entangles control + target |
| Oracle | gold | Marks the target state |
| Diffusion | green | Amplifies amplitude of marked state |
| Measure | white | Collapses and shows probability |

### Gameplay loop
1. User sees a 3-qubit register starting at |000⟩
2. Target shown: "Find |2⟩ (binary 010) — build Grover's algorithm"
3. User drags H gates to initialize superposition on all 3 qubits
4. User places the Oracle gate (marks |2⟩)
5. User places the Diffusion operator
6. Circuit runs → probability bars animate
7. If |2⟩ probability ≥ 75% → success! Overlay shows "QUANTUM CORE UNLOCKED"
8. If wrong, bars show which states are too high/low — user iterates

### Hints system
- Hint 1: "Grover's needs all qubits in superposition first"
- Hint 2: "The Oracle marks the target state — which state are we searching for?"
- Hint 3: "Diffusion amplifies the marked state's amplitude"

### Visual style
- Same dark space aesthetic as the rest of the lab
- Gates are pill-shaped buttons with quantum notation labels
- Circuit wires are glowing horizontal lines
- Probability bars animate smoothly with CSS transitions
- Success state: bars pulse green, confetti, Quantum Core panel unlocks

## Files to create/modify

### New file: `circuit.css`
- Gate palette sidebar (left column, 120px wide)
- Circuit canvas (horizontal wires, drag targets)
- Gate pills (draggable, color-coded by type)
- Probability chart (bar chart with labels)
- Target indicator overlay on the bar chart
- Hint panel (collapsible)
- Success overlay styling

### New file: `circuit.js`
- `initCircuit7()` — set up the 3-qubit circuit state
- Gate definitions: H, X, CNOT, Oracle, Diffusion, Measure
- State vector math: 8-element complex amplitude array
- Gate application functions (matrix multiplication)
- Render: draw circuit wires + placed gates
- Drag-and-drop: HTML5 drag API or pointer events
- Probability calculation from state vector
- Bar chart rendering (CSS or Canvas)
- `checkCircuit7()` — compare output to target
- `showCircuitSuccess()` — trigger success overlay + unlock core
- `resetCircuit7()` — clear all gates
- Hint system
- Success/failure feedback

### Modify: `app.js`
- Add station 7 to `TOPIC_CONFIG` (empty for now — circuit.js takes over)
- Add station 7 I18N keys for the circuit builder text
- Add station 7 to `TOPIC_META`

### Modify: `index.html`
- Ensure `#circuitPage` section exists (it does: `<section class="page" id="circuitPage"></section>`)

### Modify: `lab.js`
- Add station 7 to `STATIONS` array
- Add station 7 to `PUZZLE` config (criteria: circuit succeeds)
- `checkCircuit7Score()` callback

## Quantum math (simplified for 3 qubits)

State vector: `[a0, a1, a2, a3, a4, a5, a6, a7]` — amplitudes for |000⟩ through |111⟩

Starting state: `[1, 0, 0, 0, 0, 0, 0, 0]` (|000⟩)

**H gate** (single qubit): `1/√2 * [[1, 1], [1, -1]]`

**CNOT** (control=0, target=1): flip target if control=1

**Oracle** for target |2⟩ (binary 010): flips phase of |2⟩ (multiply by -1)

**Diffusion** (Grover): `2|s⟩⟨s| - I` where |s⟩ is uniform superposition

**Measure**: probability of state |k⟩ = |amplitude_k|²

Target: after 1 Grover iteration on |2⟩ with 3 qubits, probability should reach ~82%

## Acceptance criteria

1. Dragging H gates onto Q0/Q1/Q2 wires applies superposition
2. Placing Oracle + Diffusion gates and running shows |2⟩ probability ≥ 75%
3. Success triggers the same confetti + unlock flow as other stations
4. Reset clears all gates
5. Hint system progressively reveals the solution
6. Works in both Thai and English (I18N)
7. Looks and feels as polished as the other 6 stations
