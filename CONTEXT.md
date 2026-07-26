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
A verb graded on how *well* it is performed — precision, timing, control. Admits
a skill curve.

**Configuration**:
A verb graded only on whether the final arrangement is *correct* — sliders,
dials, gate placement. Solved once, then finished. Every Station built to date is
Configuration, and every one has measured zero Satisfaction.
_Avoid_: tuning, adjusting, setup
