# Luma · R3 UX Reference

**Source of truth:** `jingdt-labs/luma/prototype/` (this directory). **Publication only:** `jingdt-labs/opc-prototype/luma/` · [GitHub Pages](https://jingdt-labs.github.io/opc-prototype/luma/).

This is the Human-approved **static R3 learner experience baseline**, not a real Learning Runtime or a 500-word content bank. The product semantics and UX implementation constraints are owned by [UX Spec](../docs/ux-spec.md) and [First Learner](../docs/first-learner.md); the `ux-spec.md` fixed Git commit selects the authoritative reference version.

## Preview and checks

Serve this repository root locally (for example, `python3 -m http.server 8000`), then open `http://localhost:8000/prototype/`. No build or server dependencies are required.

Run `cd prototype && npm test` (Node 22+). All required R3 assets are present here: `index.html`, `css/`, `data/`, `js/`, and `tests/`. The older R1/R2 prototype modules are **not** included.

## Verified UX boundaries

- Onboarding → confirmed ~500-word Goal → learning workspace → Focus → Learn / Practice / Feedback → continuation, recap, progress, assessment and Goal review.
- Separate Recognition (options only) and Active Recall (Chinese text only), with a support-aware **看看选项** transition. Asking for help, declaring “不知道” and performing independent recall are distinct.
- English word and sentence audio are optional learning aids; no Chinese speech-answer input. Independent assessment must not disclose audio cues or answers before a response.
- Goal progress is an explicitly simulated overview, never derived from ten fixtures. Achieved is permissible only for a fully evidenced **500/500** target coverage example; 499/500 and evidence gaps must not pass.
- Light / Dark / System, pause / reload / resume and meaningful action feedback are part of the prototype. Scheduling, mastery calculations, backend persistence, AI grading and material supply remain future engineering work.

## One-way publication

`.github/workflows/publish-prototype.yml` verifies this source and, when the repository secret `OPC_PROTOTYPE_PUBLISH_TOKEN` is configured, synchronizes **only** `prototype/` to `jingdt-labs/opc-prototype/luma/` and commits any changes there. The secret needs **Contents: Read and write** limited to the public `opc-prototype` repository; the default `GITHUB_TOKEN` cannot push across repositories. With no secret, verification runs but publication is skipped with a warning. Never edit the published copy as a second source.
