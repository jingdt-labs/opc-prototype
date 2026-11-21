# Luma · R1 Core Journey + R2 Learn / Practice Supplement

**Entry:** [GitHub Pages /luma/](https://jingdt-labs.github.io/opc-prototype/luma/) · Plain static HTML, CSS, and ES modules.

This is a **high-fidelity interactive prototype**, not the production Learning Runtime. The product authority lives in `jingdt-labs/luma` (four Frozen documents); the delivery plan is [Issue #134](https://github.com/jingdt-labs/luma/issues/134).

## R1 student journey · Human walkthrough

1. Open the entry and choose **开始体验** (simulated, no credentials).
2. Pick one of three learning intentions. Preview and confirm the structured Goal (closed ~500-word scope, written meaning recognition, future delayed review).
3. Start a four-word Focus session from the workspace. Use the first item to try **我不知道**; for another word try a wrong choice; for another use **提示** before choosing correctly. Try at least one unassisted correct answer.
4. Observe the **different result messages** and deferred reinforcement after the first batch, and use **暂停并返回** to resume the exact current stage.
5. Finish the session, inspect **学习进步** and the evidence history, then start **针对性巩固**. The review does not turn same-day practice into independent retention evidence.
6. Test **浅色 / 深色 / 跟随系统**, refresh during a question or feedback, and use **重置演示数据** to replay.

**Keyboard:** A/B/C/D (case-insensitive) selects the matching lettered option; 1–4 remains as an optional fallback. Enter advances after feedback; Esc pauses. Keyboard answers are disabled while typing in editable inputs or using selectors.

## R2 gallery · Human Final Review walkthrough

Entry: **student Workspace** → scroll to the low-priority **设计评审专用** strip → **探索 R2 动态交互样本**. The gallery is **not** part of the student’s daily study navigation. Its goals, session and attempts are review-only, persisted in separate `previewSession` / `previewEvents` fields; they do not modify the confirmed Goal, R1 Session, Evidence or review eligibility.

Two new Learn / Practice paths precede the original five practice scenarios. Learn is an independent teaching and exploration activity, not another quiz.

**L1 · short — 陌生词先学再练：** in **不认识？先看懂 short**, read its core meaning, IPA, part of speech, natural example and optional pronunciation. Explore shorter/shortest, other meanings and collocations as needed; choose **现在去练一练**. A correct attempt after viewing the answer-bearing Learn content remains **immediate practice**, not evidence of first independent mastery. Feedback can reopen Learn.

**L2 · sometimes — 先试再针对性学习：** in **似乎认识？试试 sometimes**, answer *I ___ walk to school.* first. Try an incorrect `sometime` or `some times`; feedback retains the original attempt. Choose **查看完整讲解**, expand the four-way contrast, then **换一句话，再练一练** in a new sentence. The second answer is **immediate supported practice**, not delayed retention. If the first answer was correct, that independent-attempt evidence remains intact even after optional Learn.

All five original scenarios share the R1 Focus frame, answer / hint / don't know / feedback / continue / pause convention:

1. **A · 主动提取**: see *because*, type `因为` or `由于` without options and press Enter. Try a different unknown expression: the limited fixture evaluator refuses to claim a certain error and dynamically appends a **supported recognition** task. Finishing that choice is recorded as practice, not successful recall.
2. **B · 听觉辨认**: the English word and Chinese answer are hidden. Click **播放英文**; only after the browser speech engine reports that the utterance ended does the answer choice grid appear. Retry playback if desired. If speech is unavailable, choose **查看英文并转为支持学习**: the written choice is explicitly **not** auditory evidence. Asking "我不知道" without hearing also creates **no auditory performance**.
3. **C · 词形产出**: see the defined meaning **借入** and type `borrow`; press Enter to submit. Compare `lend`, typo, and hint-assisted cases. A–D keyboard shortcuts never intercept the text field.
4. **D · 语境理解**: read *Although it was raining, we went out.* and select the meaning. The extra non-target word gloss appears **only after requesting help**, and the response is then marked supported.
5. **E · 丰富材料**: read *I stayed home because I felt ill.* and identify the reason. Initial screen is limited to context + choices; after submitting, review the exact response, expand **补充材料** on demand, and optionally listen to the example. Post-answer audio is practice support, not independent listening Evidence.

The gallery juxtaposes **confirmed student Goal** and **temporary demonstration Goal**. Compare `because` in R1 recognition, R2 unprompted recall, R2 sound-only recognition, and R2 cause-in-context: the Language Resource overlaps, but each task asks for distinct performance and uses different materials. All R2 authored examples are **simulated, not attributed to an official exam**.

**Interaction safeguards:** A–D / optional 1–4 only for choices; Enter submits active text fields and advances from feedback; Esc pauses. Correct, hinted, uncertain open response, unknown, erroneous spelling, immediate rehearsal and audio fallback remain distinct. Real browser `speechSynthesis` is an optional demonstration dependency: voice/locale/quality may vary, some browsers may not offer speech, and an `onend` event does not verify what the listener actually perceived. Never interpret a click on play as proof of hearing or pronunciation.

**Human viewport check required:** at 1440×900 and 1366×768, inspect Learn reading and expansion, Learn → Practice, Practice → Feedback, Feedback → Learn and next. R2 uses a **single Focus-body scroll** for long teaching content, not an inner card scrollbar; R1 stays unchanged. Do not infer browser layout quality from synthetic tests alone.

## R2 Supplement · Design and bounded repair

- Learn displays focused core knowledge directly; richer materials are available via disclosures. Reading, opening material and completed pronunciation playback record **learning contact**, never an independent correct response.
- Evidence keeps original attempts, answer-bearing Learn exposure and recent same-material repeats. Immediate correct answers after exposure are not promoted into new independent or delayed retention evidence. No actual retention schedule or review test is implemented for these new gallery scenarios.
- R2 Practice and Feedback use the Focus body as their only deliberate overflow region, while Learn allows a longer reader layout and accessible actions. The original R1 route is preserved.
- English form production and English choices retain internal spaces and punctuation when evaluating correctness; outer whitespace/case may be tolerated. Chinese meaning recall retains light normalization.
- Audio feedback offers useful replay and visible reference text, without its former inactive text-to-support button or evidence mutation.

## R1 Repair — F1–F4

- **F1 · Answer shortcuts:** visible A/B/C/D matches the primary keyboard shortcuts (upper/lowercase). Number keys 1–4 are compatible but not advertised.
- **F2 · Focus continuity:** choice grid appears **only** in the question phase. Feedback replaces it with a compact response recap plus explanation; the card has a stable height/action footer. At desktop sizes, long teaching text scrolls **inside the card**, not the entire viewport. Programmatic focus uses `preventScroll`; entering Focus intentionally resets the previous workspace scroll position.
- **F3 · Review timing vs. need:** an unsupported first failure may receive one immediate reinforcement, but review/reinforcement outcomes are **held for delayed recheck**. Unassisted correct responses also receive a future recheck opportunity. The prototype uses **24 hours as a demonstrative eligibility threshold**, not a calibrated learning or retention policy. Items not due are visible in progress but never placed into an immediate review queue; due/awaiting counts and buttons reflect this distinction. Sample-history observations remain marked and separate.
- **F4 · Login dark theme:** themed tokens now control the dual-column illustration background, sample card, text, and decorative rings for Light/Dark/System.

**Review visually in a real browser:** check a 1440×900 and lower-height laptop viewport while switching question → feedback → next, including hint and long text. CSS constrains full-page scrolling on desktops but allows an inner teaching-text scroll if material is long; on small phones, the page can naturally scroll.

## Scope and semantics

- Eight authored representative words stand in for a proposed closed **~500-word** high-frequency exam vocabulary range. The full 500-word list is **not** present.
- Two preloaded `because` observations model an earlier independent recognition and a later failure. They are visibly labeled **示例历史（预置）** and are **not counted as actions performed in the browser**.
- Actual interactions are saved in browser `localStorage`; this is local prototype persistence, not authenticated cloud storage.
- Correct unassisted responses, hinted correct responses, explicit unknown, wrong attempts, and immediately reinforced correct responses are distinct. Answer exposure is kept; immediate practice never constitutes spaced retention.
- The queue is deterministic and bounded: four initial items, optionally delayed same-session reinforcement for uncertain items, a second batch of four examples, and a targeted review **only when items are currently due**. Nothing claims a calibrated adaptive or spaced repetition algorithm.
- Goal changes require explicit confirmation; routine task adaptation stays within the goal.
- Browser focus mode uses a distraction-free full viewport **app shell**, not the browser Fullscreen API. Focus has a stable header, visible exit, and optional keyboard shortcuts.

## Structure

- `index.html` — entry and module wiring
- `css/base.css`, `css/components.css` — theme tokens and high-fidelity visual/interaction styles
- `data/sample-data.js` — R1 words, Goal options, history
- `data/experience-data.js`, `data/vocabulary-data.js` — seven authored R2 scenarios and Learn materials (not official exam material)
- `js/state.js` — versioned persistence and evidence assembly
- `js/learning.js` — unchanged R1 decision and due-review model
- `js/variant-flow.js` — bounded review-only Learn and Practice transitions, exposure-aware evidence and speech gate
- `js/app.js` — routes, semantic HTML views, user interactions
- `tests/learning.test.mjs`, `tests/variant-flow.test.mjs`, `tests/interaction.test.mjs`, `tests/learn-flow.test.mjs` — R1 behavior, R2 Learn evidence, and interaction checks. Run `npm test` in `luma/` (Node built-ins, no dependencies).

All imports and stylesheets are relative and can be served under `/opc-prototype/luma/` with no build step. For local preview use `python3 -m http.server` at the repository root and open `/luma/`.

**Delivery boundary:** The browser may play real synthesized English and evaluate bounded choices/spelling, but the Goal selection, teaching adaptations and feedback are authored demonstration rules. No real AI, production assessment, comprehensive vocabulary bank, verified listening/pronunciation assessment, backend identity or sync, or calibrated review scheduling. **R2 Supplement does not expand the first engineering slice.** Await Human Final Review before selecting implementation scope.
