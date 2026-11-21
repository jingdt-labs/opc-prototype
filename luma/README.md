# Luma · R1 Complete Core Journey

**Entry:** [GitHub Pages /luma/](https://jingdt-labs.github.io/opc-prototype/luma/) · Plain static HTML, CSS, and ES modules.

This is a **high-fidelity interactive prototype**, not the production Learning Runtime. The product authority lives in `jingdt-labs/luma` (four Frozen documents); the delivery plan is [Issue #134](https://github.com/jingdt-labs/luma/issues/134).

## Human walkthrough

1. Open the entry and choose **开始体验** (simulated, no credentials).
2. Pick one of three learning intentions. Preview and confirm the structured Goal (closed ~500-word scope, written meaning recognition, future delayed review).
3. Start a four-word Focus session from the workspace. Use the first item to try **我不知道**; for another word try a wrong choice; for another use **提示** before choosing correctly. Try at least one unassisted correct answer.
4. Observe the **different result messages** and deferred reinforcement after the first batch, and use **暂停并返回** to resume the exact current stage.
5. Finish the session, inspect **学习进步** and the evidence history, then start **针对性巩固**. The review does not turn same-day practice into independent retention evidence.
6. Test **浅色 / 深色 / 跟随系统**, refresh during a question or feedback, and use **重置演示数据** to replay.

**Keyboard:** A/B/C/D (case-insensitive) selects the matching lettered option; 1–4 remains as an optional fallback. Enter advances after feedback; Esc pauses. Keyboard answers are disabled while typing in editable inputs or using selectors.

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
- `data/sample-data.js` — authored words, Goal options, separated sample history
- `js/state.js` — versioned persistence and evidence assembly
- `js/learning.js` — deterministic task/attempt/evidence decisions
- `js/app.js` — routes, semantic HTML views, user interactions
- `tests/learning.test.mjs` — domain-behavior regression tests; run `npm test` in `luma/` (no dependencies)

All imports and stylesheets are relative and can be served under `/opc-prototype/luma/` with no build step. For local preview use `python3 -m http.server` at the repository root and open `/luma/`.

**R2 boundary:** No real AI, complete vocabulary bank, audio, oral/spelling/sentence tasks, credentials, cross-device sync, pedagogical performance claims, or production-grade review scheduling. Extend interaction patterns only after Human reviews R1.
