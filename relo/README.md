# Relo — R1 Learning Experience Foundation · Repair

Static interactive prototype: [`relo/index.html`](./index.html), with relative `./style.css` and `./app.js`. Published URL: https://jingdt-labs.github.io/opc-prototype/relo/.

**Scope:** R1 bounded UX repair (F1–F4), not R2. Frozen Authority remains in `jingdt-labs/relo` (`PRODUCT.md`, `LEARNING-MODEL.md`, `UX-SPEC.md`). All credentials, objectives, support events, answers, and adaptation are **demo-only**.

## Reproduce the repair

1. **Bootstrap:** `重置演示` → 学生入口 (`student / 1234`) shows the no-objective state → return → 教学入口 (`teacher / 2468`) → `采用模拟建议` (or edit) → `确认并生效` → student login. The learner starts without picking a course or task.
2. **F1 · T1 (three distinct routes):** On `before`, choose **认识，能想起词义** → mentally recall → **核对完整词义** → **遮住词义，再回忆** → **再次核对**. On `after`, choose **有点印象** → see a semantic cue *before* revealing the answer. On `because`, choose **还不认识** → get meaning, example, concise explanation immediately. The alternative **想直接学习？查看词义与解释** bypasses self-rating. These choices are self-reports or learning contact, **never proof of mastery**. `跳过这个词` skips only the current word.
3. **F2 · Pronunciation simulation:** Tap **听单词发音（模拟）** with T1, **朗读例句（模拟）** after a meaning is revealed, **朗读这句话（模拟）** in T2, and **朗读句子（模拟）** in T3/T5. Each click displays the exact text that *would* be spoken and clearly says that **no audio was played**. On T4, the sentence contains the missing word, so no pronunciation control is available until **看答案与解释** has revealed it; only then does **朗读完整答案（模拟）** appear. No listening performance is recorded.
4. **F3 · T2 and final skip:** From T2, **先用 before 试一道题** (before explanation) or **换句子检验 before** (after explanation) opens *She washes her hands before breakfast* and asks which action happened first. Seeing the prior explanation marks the subsequent feedback as supported learning. From the explanation, **继续：学习原因句** honestly announces the switch to because. At T5, skipping the first question supplies a shorter replacement; skipping its final question enters a summary headed **最后一段先跳过，这一轮就到这里**, without claiming the skipped task was learned or actively ended.
5. **F4 · Rest of T1–T5:** In T3 intentionally answer wrong or choose **我不知道**, request a hint, reveal answer, then try the *same* question and continue to a *different* question; feedback does not call this first unassisted success. In T4 type `before` or reveal the answer and retry. In T5 a clean initial answer selects a harder before-clause variant; an uncertain answer selects a simpler because sentence. The final new question can be completed for a natural summary. **结束本轮** remains available, and **再学一轮** starts a new simulated Session.

`重置演示` is the reproducible branch reset. On narrow screens, use the visible skip/end controls below the main card.

## Evidence and implementation boundaries

- In-memory simulation of Task/Question/Attempt supports first unassisted responses, hints, answer exposure, same-question retries, new-question variants and explicit "不知道". T1 self-reports and pronunciation *requests* do not create achievement or actual listening evidence; same-question rechecks after a meaning was displayed remain learning contact.
- The support history distinguishes a T2 check completed after the lesson, from one reached without seeing the lesson explanation. Clicking a pronunciation simulation does not imply that sound was actually heard.
- Simulated student/teacher login, editable objective + explicit confirmation, and optional reference 15/20/30-minute duration (default 20) remain unchanged.
- **Not implemented:** real TTS/audio, listening assessment, T6–T9, real AI/authorization, durable persistence, interrupted-session recovery, teaching evidence analysis, or validated adaptive teaching logic. **Refreshing clears the demo**; the apparent identity separation is not real security.
- Workspace extension to audio-first, long text with multiple questions, shared option pools and independent assessment remains a forward-fit design hypothesis, not implemented R2/R3 coverage.

## Checks performed for R1 Repair

- JavaScript syntax: `node --check app.js`.
- Chromium/Playwright test (injected unchanged HTML, CSS and JavaScript into a browser page because this environment blocks local navigation), desktop 1390×900 and narrow 390×844: all three T1 paths, audio simulation, T2 first-try and post-explanation branches, T3 wrong/hint/reveal/retry, T4 audio-answer gate, T5 clean/stretch and unknown/easier variants, final skip/natural summary, next Session, no runtime errors or horizontal overflow.
- GitHub Pages publication must be independently verified for the **exact submitted Commit**; local test success alone does not prove live site availability.