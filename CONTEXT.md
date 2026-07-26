# Quantum Experience — SCiUS BUU booth

A bilingual (TH/EN) static site built as a science-fair booth exhibit for the SCiUS
programme at Burapha University. No backend, ever. Mobile portrait is the only
layout that matters.

## Language

### What we build

**Station**:
One self-contained activity a visitor performs. The canonical unit of the site.
_Avoid_: topic, puzzle, level, minigame

**Hook**:
A teaser card on the landing page advertising a side activity (Aura, Chat,
Match). Not a Station — it makes no claim to teach and carries no goal.
_Avoid_: card, feature, widget

> Note: the legacy `STATIONS` array uses ids `1, 2, 4, 7` while rendering them as
> "Station 1–4", and `TOPIC_CONFIG` / `PUZZLE` key the same activity by different
> numbers. That is a defect, not three concepts. One activity, one id, one word.

### How we judge it

**Satisfaction**:
Positive feedback *stated* by a SCiUS classmate who has played the thing. The
project's only success measure.
_Avoid_: fun, engagement, polish, quality

**Classmate**:
A SCiUS student other than the owner. The reference population — the only source
of Satisfaction that counts.
_Avoid_: user, player, tester, visitor

**Learning**:
A Classmate being able to say they now understand something they could not
before. The principal driver of Satisfaction, not a separate axis from it.

**Intrinsic meaning**:
Meaning a Station carries inside the activity itself — the player discovers what
it is *for* by doing it. Distinguished from meaning delivered by a poster, an
explainer, or narrative framing, which this project has twice measured at zero.
_Avoid_: context, framing, story

### How a Station works

**Execution**:
A verb graded on how *well* it is performed. Admits a skill curve. "Well" is any
dimension that ranks performances — **efficiency** counts, not only precision,
timing and control. That narrower reading is what produced PULSE, whose skill was
motor precision and therefore could not be compared against a classical baseline
(ADR-0005).

**Configuration**:
A verb graded only on whether the final arrangement is *correct* — sliders,
dials, gate placement. Solved once, then finished. Every Station built to date is
Configuration, and every one has measured zero Satisfaction. Permanently rejected
by ADR-0005.
_Avoid_: tuning, adjusting, setup

**Search**:
The project's chosen verb. The player spends Queries against a hidden answer and
is graded on how few they needed, racing a Classical baseline at the identical
task. A species of Execution, graded on efficiency.
_Avoid_: guessing, hunting, solving

**Query**:
One look at one hidden box — the unit a player spends and is scored on. The thing
Grover's algorithm makes cheaper, and therefore the only quantity on which a
quantum player can beat a Classical baseline.
_Avoid_: move, turn, attempt, guess

**Classical baseline**:
A non-quantum solver working the same task beside the player, spending its own
Queries visibly. It is not decoration and not a difficulty setting — it *is* the
teaching, and the scoreboard against it is what supplies Intrinsic meaning.
_Avoid_: opponent, AI, bot, computer
