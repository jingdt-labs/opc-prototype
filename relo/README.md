# Relo — R1 Learning Experience Foundation

Static prototype: `index.html` (with relative `./style.css` and `./app.js`). Published at `https://jingdt-labs.github.io/opc-prototype/relo/`.

## Review walkthrough (demo only)

1. Start with **学生入口** → prefilled `student / 1234`: the unconfirmed-objective state explains why learning cannot begin.
2. Return → **教学入口** → prefilled `teacher / 2468` → **采用模拟建议** (or write your own) → **确认并生效** → **切换至学生登录**.
3. After student login, learning starts without task selection. T1: reveal `before`, `after`, `because` meanings. T2: unfold sentence meaning/timeline. T3: choose a wrong answer or **我不知道**; use hints/reveal, retry the *same* question, and continue to a *new* question. T4: fill **before**, or choose **我不知道**. T5: choose a correct / wrong answer to see two different next sentences for the same **because** focus, then reach the summary. Use **跳过当前内容** for the skip case.
4. **结束本轮** prompts for confirmation even mid-task and shows an honest summary. **再学一轮** starts a new in-memory session with some different question material. **重置演示** clears all simulated data to reproduce other branches.

T1–T5 describe representative content structures for reviewing the prototype; they are not task types or menus exposed to the learner.

## What is and isn't implemented

- Simulated separate student/teaching login, editable objective with explicit confirmation, and default 20-minute nonbinding reference duration (15/20/30).
- In-memory simulated Task/Question/Attempt events; distinguishes first unassisted attempts, repeated same-question attempts, hint support, answer exposure, unknown responses, and skipping. Task continuation branches based on prior attempts / support. No score or mastery-rate claims.
- R2/R3 not implemented: no audio playback, passage/multi-blank rendering, stage assessment, real AI, real authentication, durable persistence, interruption recovery, or teaching evidence analysis. A browser refresh **clears state**; this is deliberate and not a representation of Relo's eventual reliability.
- Public demo material only; **not actual learner evidence**. The apparent account segregation is frontend simulation and is **not** an authorization or security boundary.

## Forward-fit design note

The central reading/response surface allows alternative material layouts under the same outer objective header, with small, consistent submission/support/continue controls. Audio-first tasks can replace the sentence display with an audio-first player without leaking transcripts; passages can keep a shared context visible alongside related questions; multiple blanks can replace one response with a grouped response area; independent assessment can reuse the response surface with a clearly separate condition banner and restricted help semantics. These are proposed accommodations, **not implemented or verified R1 coverage**.

## Scope / verification

R1 implementation only. This prototype tests UX operability and design choices, not learning efficacy, identity security, reliable Evidence storage or the future recommendation algorithm. Consult `jingdt-labs/relo` `PRODUCT.md`, `LEARNING-MODEL.md`, and `UX-SPEC.md` for authoritative behavior and constraints.