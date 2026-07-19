# Plan: Quantum Circuit Builder (Station 7)

## What we're building

A **drag-and-drop quantum circuit builder** as Station 7 — the capstone that ties every quantum concept together. The user assembles a Grover's Search circuit from scratch and watches it work.

## Why this is the right idea

Grover's algorithm is the climax of the quantum journey (already scaffolded as the Quantum Core page). Station 7 bridges "understanding quantum gates" → "actually building a quantum algorithm." It has:

- **Real interactivity**: drag gates, wire them together, watch the circuit run
- **Immediate feedback**: every gate placement changes output probabilities live
- **Goal structure**: hit a target probability distribution, not just observe one
- **Ties everything together**: superposition (H), entanglement (CNOT), interference (oracle + diffusion), measurement
- **Satisfying to complete**: the moment the circuit "works" and lights up the right answer is genuinely exciting

## Design

```
┌─────────────────────────────────────────────────────────────┐
│  STATION 7 · QUANTUM CIRCUIT BUILDER                        │
│  "Find |2⟩ — build Grover's search algorithm"               │
├───────────────┬─────────────────────────────────────────────┤
│  Gate Palette │  Circuit Canvas (horizontal wire lanes)      │
│  [H] Hadamard │  [Q0] ──[H]──[Oracle]──[H]──[Diffuse]──|M|  │
│  [X] Pauli-X  │  [Q1] ──[H]──[Oracle]──[H]──[Diffuse]──|M|  │
│  [CNOT]       │  [Q2] ──[H]──[Oracle]──[H]──[Diffuse]──|M|  │
│  [Oracle]     ├─────────────────────────────────────────────┤
│  [Diffuse]    │  Output: Probability Distribution            │
│  [Measure]    │  ▓▓▓▓▓▓▓░░░ |0⟩ 14%                         │
│               │  ▓▓▓▓▓▓▓▓▓░ |1⟩ 3%   ← Target: |2⟩ ≥ 75%   │
├───────────────┤  ▓▓▓▓▓▓▓▓▓▓ |2⟩ 82%  ✅                    │
│  [Reset]      │  ▓▓▓▓▓▓▓░░░ |3⟩ 1%                         │
│  [Hint]       │  ▓▓▓▓▓▓▓▓░░ |4⟩ 3%                         │
│               ├─────────────────────────────────────────────┤
│               │  [Run Circuit] [Check Solution]              │
└───────────────┴─────────────────────────────────────────────┘
```

## Gate reference

| Gate | Color | Effect |
|------|-------|--------|
| H | cyan | Hadamard — superposition |
| X | red | Pauli-X — bit flip |
| CNOT | violet | Control-Not — entanglement |
| Oracle | gold | Marks target state (|2⟩ = 010) |
| Diffusion | green | Amplifies marked state's amplitude |
| Measure | white | Collapse and show probabilities |

## Quantum math (3 qubits, simplified)

- State vector: 8 complex amplitudes for |000⟩ … |111⟩
- Starting state: [1, 0, 0, 0, 0, 0, 0, 0] (|000⟩)
- H gate: `1/√2 * [[1,1],[1,-1]]` applied per qubit
- Oracle for |2⟩: flip phase of amplitude index 2
- Diffusion: `2|s⟩⟨s| - I` where |s⟩ = uniform superposition
- After 1 Grover iteration on |2⟩ with 3 qubits: |2⟩ ≈ 82%

## Files to create

### `circuit.css`
- Gate palette sidebar
- Circuit canvas (3 horizontal wire lanes)
- Gate pills (draggable, color-coded)
- Probability bar chart
- Success/failure states

### `circuit.js`
- Gate definitions + matrix math
- State vector simulation (8-element complex array)
- Gate application (matrix multiplication)
- Render circuit wires + placed gates
- HTML5 drag-and-drop for gate placement
- Probability calculation + bar chart
- `checkCircuit7()` — success criteria
- `showCircuitSuccess()` — unlock flow + confetti
- `resetCircuit7()` — clear all
- Hint system (3 progressive hints)

## Modifications

### `app.js`
- Add station 7 I18N keys (title, desc, intro, challenge, quiz)
- Add station 7 to `TOPIC_META` and `TOPIC_CONFIG`
- Station 7 topic page is minimal — circuit.js injects its own UI into `#circuitPage`

### `lab.js`
- Add station 7 to `STATIONS` array
- Add `7: { solved: false }` to `PUZZLE`
- `checkCircuit7Score()` callback

### `index.html`
- Already has `<section class="page" id="circuitPage"></section>` ✅

## Acceptance criteria

1. Drag H gates onto Q0/Q1/Q2 wires → superposition applied
2. Oracle + Diffusion gates → |2⟩ probability ≥ 75% on run
3. Success triggers confetti + Quantum Core unlock
4. Reset clears all gates
5. 3 progressive hints guide stuck users
6. Works in Thai and English
7. Visually polished to match the other 6 stations
