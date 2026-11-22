# Luma · R3 First Learner Experience

**Preview:** https://jingdt-labs.github.io/opc-prototype/luma/

**Authority:** jingdt-labs/luma, master — PRODUCT, LEARNING-MODEL, VOCABULARY-LEARNING-SPEC, UX-SPEC, and FIRST-LEARNER-VALIDATION (Frozen, 2026-11-22).

R3 is a **high-fidelity, static, learner-facing interactive prototype** for the first real learner journey. It is not the production Learning Runtime or a complete 500-word product delivery. The entrance is now an integrated, student-facing experience instead of the bounded R1 queue plus R2 review gallery.

## Student journey

1. Enter without credentials; confirm an understandable Goal for **approximately 500 high-value words**, with written meaning **and simple-sentence comprehension**. Adjust the suggested session length without a mandatory timer or quota.
2. From the uncluttered home, start learning or resume a paused session. **short** can be recognized without relearning; **because** can move from "I don't know" or unprompted recall to a real Learn explanation and supported practice; **borrow** connects meaning to understanding a simple sentence.
3. Two distinct meaning-answer UIs share the same Focus: **Recognition (选项辨认)** directly presents Chinese choices without a text field; **Active Recall (主动提取)** presents a Chinese text field without prior choices. On recall difficulty, **看看选项** replaces the text UI with choices and records an assistance request; a correct answer thereafter remains *supported recognition*, not independent recall. **我不知道** records an explicit learner response; **先看解释** records a help/exposure request, not a claim of inability. Chinese voice answering has been removed. Uncertain free-text answers are not automatically marked wrong.
4. End early or pause/reload/resume. Local attempts, exposures and support conditions persist. Subsequent sessions are available without a fixed count; weak observed items can be prioritized (demonstration logic, **not** a calibrated review schedule).
5. See a short session recap and an overall Goal progress view. **Already known**, **learning-acquired progress**, **needs consolidation**, and **not sufficiently observed** remain distinct.
6. Use a stage assessment of meaning and changed simple sentences. Feedback is shown at the end so it does not disclose answers between independent samples; the next learning session can prioritize difficulties.
7. View near-goal, evidence-gap, and achieved examples. This first closed Goal is complete only with **500/500 individually evidenced target items** and a credible review; occasional future errors still do not imply permanent forgetting.

**Important reviewer controls:** A small **进度演示 · 非真实成绩** selector sits above the home/progress/goal content (and Goal review). It offers first use, growing progress, after assessment, near Goal, strong but insufficient evidence, and achieved Goal. Pick **持续学习中** to immediately inspect nonzero progress. The tool is separated visually from the student's learning cards and remains unavailable in Focus. Switching requires confirmation only if local attempts or an active session would be cleared; it preserves the current overview screen.

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
| S10 Failure boundaries | Open-answer ambiguity, optional English pronunciation unavailable, pause/refresh, no automatic inflated conclusions |

**Gate A:** R3 permits **representative UX review only**, not Gate A acceptance. The first usable product still requires about 500 verified words and sufficient materials, real runtime learning evidence/continuity, autonomous task adaptation, and credible whole-Goal adjudication. **Gate B:** Learning effectiveness, retention, transfer, and genuine increased ability require longitudinal dogfooding with real comparable observations.

## Truthful demo boundary

- Only 10 handcrafted word fixtures (8 existing R1 and 2 R2 Learn examples) are available for interactions. No official exam content claim is made.
- Goal-wide totals are **explicitly labelled simulated summaries of an imagined whole-range history**. They are not computed by inflating sample answer counts. No unobserved item is called "unknown to the learner".
- Real interactions in this browser are saved in a separate versioned R3 localStorage key; they can affect priority in the next sample session and its local recap. They **do not** alter the fictional 500-word aggregate.
- English word/example playback uses the browser speechSynthesis API, when available; a text-only fallback remains if unavailable. No voice answering or pronunciation, spelling, listening, or English speaking proficiency is graded.
- Immediate supported success is never treated as proof of independent, delayed retention. All aggregate attainment and assessment-stage examples are simulated; there is no production scheduling, AI evaluator, complete material supply, cloud persistence, verified assessment algorithm or multi-device sync.
- R1/R2 source modules and their tests remain available as historic reusable material/interaction assets; **their design gallery is no longer a student-facing entrance**.

## Files and validation

- index.html loads css/base.css, css/r3.css, and js/r3-app.js.
- js/r3-model.js: sample vocabulary, context materials, simulated whole-Goal profiles and pure decision helpers.
- js/r3-view.js: learner entry, onboarding, home, Focus, Learn, recap, assessment, progress and Goal decisions.
- js/r3-app.js: client navigation, answer-mode/help evidence conditions, persistence, optional English pronunciation, interruption and keyboard handling.
- tests/r3.test.mjs: whole-Goal semantics, model/interaction guards and representative screen checks.
- Historic R1/R2 modules and tests are intentionally not deleted, but are no longer loaded by the public prototype entry.

Run the static tests with cd luma && npm test. For browser review, serve the repository root with python3 -m http.server and open /luma/. Check at desktop laptop sizes (1440×900 and 1366×768), refresh during a question and after receiving support, use Light/Dark/System, and repeat with unavailable English speech playback.

**Deployment:** GitHub Pages serves files from the prototype repository’s main branch at /luma/; publishing the static file changes requires no backend or build step.

## R3 Final Repair — bounded changes (F1–F5)

- **F1 · Progress visualization:** The small top-level review-only selector switches immediately among six authored 500-word profiles. The default remains zero observed with **500 not yet observed**, never "500 unknown words". The daily home, detailed progress and Goal review use the same selected profile. For a visible demonstration select **持续学习中 (92 originally known, 136 newly supported by credible evidence, 78 need consolidation, 194 insufficient evidence)**; also compare **阶段测评后**, **接近目标**, **表现良好但证据不足**, and **目标已达成**. These counts are illustrative whole-range history, not generated from sample answers.
- **F2 · Inline English audio:** Small, accessible loudspeaker buttons now sit directly after English **words** and **example sentences** in Learn, ordinary practice and feedback. Click the word icon for that word, the sentence icon for that entire sentence. Browser speechSynthesis is optional, with a visible playing/finished/error message and text-only fallback. Audio is support, **not** an evaluation of listening, speaking, or pronunciation; optional sound during an ordinary question marks it as supported. Independent assessment gives no audio controls before answering.
- **F3 · Stage assessment:** Changed sentences and authored alternate multiple-choice distractors avoid replaying identical materials. The result compares the just-completed local attempt with a **clearly labeled fictional prior baseline** for the same sample, highlighting support/remaining weakness and giving the next learning suggestion. This comparison is a review simulation, **not** verified longitudinal gain. A few assessment samples do not change the whole-Goal numbers or prove the entire target is achieved.
- **F4 · Goal completion (superseded by the Final Closure Repair below):** Goal coverage is evaluated for the first closed scope of 500 learning targets; see the final 100% evidence rule below.
- **F5 · Goal entry:** Removed the misleading **重新确认目标** action. The Goal view clearly presents the confirmed fixed ~500-word scope and target performance, and only offers the actually functioning time preference and navigation; it does not suggest that a full Goal editor exists.

**Quick acceptance:** Open the public /luma/ page → enter and confirm → choose **持续学习中** in the small top review strip → inspect homepage and 学习进展 → try word and sentence loudspeakers after selecting "先看解释" → use 阶段测评 with changed materials → inspect "原先（预设） vs 本次（本地）" → choose **目标已达成** for the fully evidenced 500/500 completion example → visit 学习目标 and adjust only session time.

**Validation scope:** The built-in Node test suite covers the R1/R2 historical assets as well as R3 model/UI checks; English pronunciation browser availability, accessibility and viewport rendering still require Human's browser review. No production AI, 500-word content bank, speech assessment, retention algorithm, real comprehensive Goal evaluation, or backend was added.

## R3 Final Closure Repair — Frozen 100% Goal & Focus feedback

Authority: `jingdt-labs/luma/docs/FIRST-LEARNER-VALIDATION.md` as revised by Human at commit `1f0644249222700bb9593cc6f163369be3dc4fc9` (§1 / S9 / Gate A9). This repair changes **only** Focus feedback layout/wording and first-Goal completion fixtures/guards; other R3 flows remain intact.

**F1 — Focus feedback:** The four outcomes share a compact visual hierarchy: status with an unambiguous label, short feedback, distinct English word + accessible inline word speaker, Chinese core meaning, concise note, English example with a separate sentence speaker, then the primary **继续下一项** action. An assisted correct answer now says **在帮助下练对了** and explicitly requires later independent evidence. There is no empty-ring/loading-like symbol. The layout has compact desktop spacing and a small-screen alternative; browser speech remains optional and never counts as pronunciation/listening competence.

**F2 — First closed Goal:** The achieved fixture is **107 baseline + 393 gained = 500/500**, **0 needs consolidation, 0 lacks evidence**, with an explicitly authored full-range trustworthy verdict. Near Goal is **107 + 392 = 499/500, 1 not yet attained** and must **not** show achieved. The strong-but-insufficient-evidence fixture remains unachieved. The bounded demo guard checks all 500 targets, zero uncovered/unattained items, and trustworthy authoring flags; even a numerical 500/500 without sufficiently credible evidence does not count. **100% means all target items have evidence of the agreed performance, not 100% accuracy on every attempt or a promise of permanent memory.** This rule applies only to this first closed Goal; production per-item Evidence evaluation belongs to later engineering.

**Acceptance:** Open the published `/luma/` page. For layout, start a normal session → ask for options or explanation → answer correctly → inspect Focus feedback and test both pronunciation icons. For completion, choose the review-only demo `接近目标 · 499/500` and compare with `目标已达成 · 500/500` using 学习首页, 学习进展 and Goal 达成回顾. **Theoretical evidence is demonstrated by named fixtures, not calculated from the small local practice sample.**

## R3 Final UX Simplification — answer modes & home cards

- **F1:** Only two distinct meaning-question UIs: normal **直接选项辨认** (choice buttons only), and **中文文本主动提取** (one text field and submit; no prior choices). The initial sample sequence intentionally demonstrates both: **short** uses direct Recognition; **because** uses Active Recall. This is a **preauthored UI fixture**, not a claim about production task-selection strategy. **看看选项** is available only from Recall and replaces the input with choices, storing a local `support-request` event (including any unsubmitted draft as such) and preserving supported-answer semantics; **我不知道** remains an actual learner answer, while **先看解释** is separate help. There is no Chinese speech-recognition control, runtime, or transcription state. English word/sentence pronunciation buttons remain available, with independent stage assessment still silent before response.
- **F2:** Desktop home cards are **swapped** relative to the previous R3: **Goal progress on the left**, **current learning action on the right**. This follows the explicit card-swap instruction; the prior description referring to the "right progress card" describes the pre-swap location. The **看详细进展** action is now **inside the progress card**, anchored at its bottom, not detached below. Both panels share a grid row and stretch to identical heights; there is no hardcoded blank-space spacer. Below 920px the cards form one column with the primary learning action first and progress beneath, with consistent Light/Dark/System tokens.

**Review:** Enter the prototype, note the two desktop panels and progress detail action. Start learning → answer `short` directly via choices → continue to `because` and see text-only recall → choose `看看选项` and observe a *supported* outcome; alternatively use `我不知道` or `先看解释`. After help, test the English word and sentence speakers in Learn/Feedback. Use the existing review-only progress scenario switcher to check changing content and the card alignment. Production scheduling and mastery decisions remain out of scope.
