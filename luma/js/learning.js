import { sampleWords, starterIds, secondIds, wordById } from '../data/sample-data.js';
import { allEvidence } from './state.js';

const fresh = (s, wordId) => allEvidence(s).filter(e => e.wordId === wordId);
// R1 demo scheduling threshold, NOT a spaced-repetition algorithm.
export const REVIEW_DELAY_MS = 24 * 60 * 60 * 1000;

export function wordStatus(s, wordId, now = Date.now()) {
  const history = fresh(s, wordId);
  const last = history[history.length - 1];
  if (!last) return { type: 'unseen', title: '尚未尝试', detail: '还没有这项表现的观察。',
    dueNow: false, awaiting: false, needsReview: false };
  // An unsupported first failure merits one same-session reinforcement; if interrupted,
  // it is still useful to finish that first reinforcement. Reviews never loop immediately.
  if (last.kind === 'first' && ['unknown', 'incorrect'].includes(last.result)) {
    return { type: 'needs', title: '现在适合巩固',
      detail: '首次遇到困难，先把词义联系建立起来；随后再等待独立复检。',
      dueNow: true, awaiting: false, needsReview: true };
  }
  const dueAt = Date.parse(last.at) + REVIEW_DELAY_MS;
  const dueNow = Number.isFinite(dueAt) && now >= dueAt;
  if (dueNow) return {
    type: 'due', title: '可以延迟复检',
    detail: '距上次尝试已有间隔，可再次观察书面词义辨认；仍不能据此推断永久掌握。',
    dueNow: true, awaiting: false, needsReview: true, dueAt
  };
  if (last.result === 'independent-correct') return {
    type: 'observed', title: '独立答对 · 待保持验证',
    detail: '已有一次独立书面辨认正确；约 24 小时后可再检查是否保持。',
    dueNow: false, awaiting: true, needsReview: true, dueAt
  };
  return { type: 'supported', title: '刚练过 · 等待复检',
    detail: '刚获得反馈或巩固，不再立即反复测同一词；约 24 小时后独立复检。',
    dueNow: false, awaiting: true, needsReview: true, dueAt };
}

export function reviewDueIds(s, now = Date.now()) {
  return sampleWords.map(w => w.id).filter(id => wordStatus(s, id, now).dueNow);
}
export function reviewWaitingIds(s, now = Date.now()) {
  return sampleWords.map(w => w.id).filter(id => wordStatus(s, id, now).awaiting);
}
export function summary(s) {
  const recent = s.events;
  const first = recent.filter(e => e.kind !== 'reinforce' && e.kind !== 'review');
  return {
    attempted: recent.length,
    independent: recent.filter(e => e.result === 'independent-correct').length,
    supported: recent.filter(e => e.result === 'supported-correct' || e.result === 'practice-correct').length,
    review: reviewDueIds(s).length,
    waiting: reviewWaitingIds(s).length,
    triedWords: new Set(recent.map(e => e.wordId)).size,
    firstCount: first.length
  };
}
export function nextBatch(s) {
  const touched = new Set(s.events.filter(e => e.kind === 'first').map(e => e.wordId));
  if (starterIds.some(id => !touched.has(id))) return starterIds.filter(id => !touched.has(id)).slice(0,4);
  if (secondIds.some(id => !touched.has(id))) return secondIds.filter(id => !touched.has(id)).slice(0,4);
  return [];
}
export function startLesson(s, mode = 'new', now = Date.now()) {
  const active = s.session && !s.session.finished;
  if (active) { s.session.paused = false; s.screen = 'focus'; return true; }
  const freshBatch = nextBatch(s);
  const isReview = mode === 'review' || (mode === 'new' && freshBatch.length === 0);
  const ids = isReview ? reviewDueIds(s, now).slice(0,4) : freshBatch;
  if (!ids.length) return false;
  s.sequence += 1;
  s.session = {
    id: 'lesson-' + s.sequence, mode: isReview ? 'review' : 'new',
    queue: ids.map(wordId => ({ wordId, kind: isReview ? 'review' : 'first' })),
    index: 0, phase: 'ask', hintUsed: false, outcome: null,
    paused: false, finished: false
  };
  s.screen = 'focus';
  return true;
}
export const currentTask = s => s.session && !s.session.finished
  ? s.session.queue[s.session.index] || null : null;
export function hint(s) {
  if (!currentTask(s) || s.session.phase !== 'ask') return;
  s.session.hintUsed = true;
}
export function recordAnswer(s, response, now = new Date()) {
  const task = currentTask(s);
  if (!task || s.session.phase !== 'ask') return false;
  const w = wordById[task.wordId];
  if (!w) return false;
  const at = new Date(now).toISOString();
  const previous = fresh(s, w.id);
  const recentExposure = previous.some(e =>
    e.source !== 'sample-history' && Date.parse(at) >= Date.parse(e.at) &&
    Date.parse(at) - Date.parse(e.at) < REVIEW_DELAY_MS);
  const wasSupported = s.session.hintUsed || task.kind === 'reinforce' || (task.kind === 'review' && recentExposure);
  const correct = response !== null && response === w.answer;
  let result = 'incorrect';
  if (response === null) result = 'unknown';
  else if (correct && task.kind === 'reinforce') result = 'practice-correct';
  else if (correct && wasSupported) result = 'supported-correct';
  else if (correct) result = 'independent-correct';
  const event = {
    id: 'observation-' + (s.events.length + 1), sessionId: s.session.id, wordId: w.id,
    kind: task.kind, materialId: w.id + '.' + task.kind + '.r1',
    response: response ?? '我不知道', result,
    hintUsed: s.session.hintUsed, exposure: task.kind === 'reinforce' || recentExposure,
    shownAnswerAfter: true, at, source: 'this-demo',
    delayed: task.kind === 'review' && previous.length > 0 && !recentExposure &&
      (Date.parse(at) - Date.parse(previous[previous.length-1].at) >= REVIEW_DELAY_MS)
  };
  s.events.push(event);
  s.session.outcome = event.id;
  s.session.phase = 'feedback';
  if (task.kind === 'first' && result !== 'independent-correct' &&
      !s.session.queue.some((x, i) => i > s.session.index && x.wordId === w.id)) {
    s.session.queue.push({ wordId: w.id, kind: 'reinforce' });
  }
  return true;
}
export function nextTask(s) {
  if (!s.session || s.session.phase !== 'feedback') return;
  s.session.index += 1;
  if (s.session.index >= s.session.queue.length) {
    s.session.finished = true;
    s.session.paused = false;
    s.screen = 'summary';
  } else {
    s.session.phase = 'ask';
    s.session.outcome = null;
    s.session.hintUsed = false;
  }
}
export function pauseLesson(s) {
  if (!s.session || s.session.finished) return;
  s.session.paused = true;
  s.screen = 'workspace';
}
export function abandonLesson(s) {
  if (!s.session || s.session.finished) return;
  s.session.finished = true;
  s.session.paused = false;
  s.screen = 'workspace';
}
export function latestOutcome(s) {
  return s.events.find(e => e.id === s.session?.outcome) || null;
}
export function resultDisplay(result) {
  const data = {
    'independent-correct': ['独立答对了', '这次没有提示，你在选项中辨认出了词义。', 'success'],
    'supported-correct': ['在支持下答对了', '提示或近期接触帮助了你；还需要下一次独立观察。', 'info'],
    'practice-correct': ['巩固练习答对了', '这次刚看过讲解，是有效的练习，但不是跨时间保持。', 'info'],
    incorrect: ['这次还没选对', '这是发现薄弱点的机会，先看正确联系。', 'warning'],
    unknown: ['不知道也没关系', '先把词和意义联系起来，不必反复盲猜。', 'info']
  };
  return data[result] || data.unknown;
}
