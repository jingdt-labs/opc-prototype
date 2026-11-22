# Luma · R3 First Learner Experience

**Preview:** https://jingdt-labs.github.io/opc-prototype/luma/

**Authority:** jingdt-labs/luma, master — PRODUCT, LEARNING-MODEL, VOCABULARY-LEARNING-SPEC, UX-SPEC, and FIRST-LEARNER-VALIDATION (Frozen, 2026-11-22).

R3 is a **high-fidelity, static, learner-facing interactive prototype** for the first real learner journey. It is not the production Learning Runtime or a complete 500-word product delivery. The entrance is now an integrated, student-facing experience instead of the bounded R1 queue plus R2 review gallery.

## Student journey

1. Enter without credentials; confirm an understandable Goal for **approximately 500 high-value words**, with written meaning **and simple-sentence comprehension**. Adjust the suggested session length without a mandatory timer or quota.
2. From the uncluttered home, start learning or resume a paused session. **short** can be recognized without relearning; **because** can move from "I don't know" or unprompted recall to a real Learn explanation and supported practice; **borrow** connects meaning to understanding a simple sentence.
3. In meaning recall, speak a **Chinese translation** when the browser supports SpeechRecognition, type Chinese, ask for options or an explanation, or answer "I don't know". Voice transcription must be inspected/corrected before submission. Uncertain open answers are not marked wrong by the fixture rule.
4. End early or pause/reload/resume. Local attempts, exposures and support conditions persist. Subsequent sessions are available without a fixed count; weak observed items can be prioritized (demonstration logic, **not** a calibrated review schedule).
5. See a short session recap and an overall Goal progress view. **Already known**, **learning-acquired progress**, **needs consolidation**, and **not sufficiently observed** remain distinct.
6. Use a stage assessment of meaning and changed simple sentences. Feedback is shown at the end so it does not disclose answers between independent samples; the next learning session can prioritize difficulties.
7. View near-goal, evidence-gap, and achieved examples, each with a different, comprehensible explanation of why the whole Goal is or is not achieved.

**Important reviewer controls:** At the bottom of the learner home/progress/goal pages, expand **原型体验情境设置** and switch between: first use, growing progress, after assessment, near Goal, strong but insufficient evidence, and achieved Goal. This review-only fixture selector is deliberately outside the prominent student navigation. Switching scenarios clears only R3 local sample interactions, after confirmation.

## S1–S10 representative coverage

| Scenario | R3 observable flow |
| --- | --- |
| S1 Light onboarding | Login → confirm Goal and session preference → first study |
| S2 Already knows | short meaning, independent answer → no forced lecture; later checking remains appropriate |
| S3 Completely unfamiliar | because → "我不知道" → answer-bearing explanation, example, pronunciation, supported choice |
| S4 Partly familiar | borrow meaning → "Can I borrow your pen?" contextual interpretation and targeted help |
| S5 Session end | Recap distinguishes independent observation, assisted learning and pending weak connections |
| S6 Return later | Pause/reload/resume; repeatable sessions; event-informed priority (timing itself is **not** simulated as a real delayed test) |
| S7 Goal-wide progress | 500-word segmented overview: originally known, newly supported progress, needs reinforcement, not observed |
| S8 Assessment | Assessment intro → independent sampled tasks with different material → calibrated recap and next-task priority |
| S9 Achieved / unachieved | Near, coverage-gap and achieved scenarios; completion requires **whole-range** coverage and convincing evidence in the simulated aggregate |
| S10 Failure boundaries | Open-answer ambiguity, voice errors, no speech support, pause/refresh, no automatic inflated conclusions |

**Gate A:** R3 permits **representative UX review only**, not Gate A acceptance. The first usable product still requires about 500 verified words and sufficient materials, real runtime learning evidence/continuity, autonomous task adaptation, and credible whole-Goal adjudication. **Gate B:** Learning effectiveness, retention, transfer, and genuine increased ability require longitudinal dogfooding with real comparable observations.

## Truthful demo boundary

- Only 10 handcrafted word fixtures (8 existing R1 and 2 R2 Learn examples) are available for interactions. No official exam content claim is made.
- Goal-wide totals are **explicitly labelled simulated summaries of an imagined whole-range history**. They are not computed by inflating sample answer counts. No unobserved item is called "unknown to the learner".
- Real interactions in this browser are saved in a separate versioned R3 localStorage key; they can affect priority in the next sample session and its local recap. They **do not** alter the fictional 500-word aggregate.
- Recognition of Chinese speech uses the browser Web Speech API when available and requires user correction/confirmation. The underlying service may be unavailable. No voice, pronunciation, spelling, listening, or actual English speaking proficiency is graded.
- Immediate supported success is never treated as proof of independent, delayed retention. All aggregate attainment and assessment-stage examples are simulated; there is no production scheduling, AI evaluator, complete material supply, cloud persistence, verified assessment algorithm or multi-device sync.
- R1/R2 source modules and their tests remain available as historic reusable material/interaction assets; **their design gallery is no longer a student-facing entrance**.

## Files and validation

- index.html loads css/base.css, css/r3.css, and js/r3-app.js.
- js/r3-model.js: sample vocabulary, context materials, simulated whole-Goal profiles and pure decision helpers.
- js/r3-view.js: learner entry, onboarding, home, Focus, Learn, recap, assessment, progress and Goal decisions.
- js/r3-app.js: client navigation, interaction/evidence conditions, persistence, optional speech, interruption and keyboard handling.
- tests/r3.test.mjs: whole-Goal semantics, model/interaction guards and representative screen checks.
- Historic R1/R2 modules and tests are intentionally not deleted, but are no longer loaded by the public prototype entry.

Run the static tests with cd luma && npm test. For browser review, serve the repository root with python3 -m http.server and open /luma/. Check at desktop laptop sizes (1440×900 and 1366×768), refresh during a question and after receiving support, use Light/Dark/System, and repeat with unavailable voice support.

**Deployment:** GitHub Pages serves files from the prototype repository’s main branch at /luma/; publishing the static file changes requires no backend or build step.
