import { sampleWords, starterIds, secondIds, wordById } from '../data/sample-data.js';
import { allEvidence } from './state.js';

const fresh = (s, wordId) => allEvidence(s).filter(e => e.wordId === wordId);
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

export function wordStatus(s, wordId) {
  const history = fresh(s, wordId);
  const last = history[history.length - 1];
  if (!last) return { type: 'unseen', title: '尚未尝试', detail: '还没有这项表现的观察。', needsReview: false };
  if (last.result === 'independent-correct') {
    return {
      type: 'observed', title: '有一次独立答对',
      detail: last.delayed ? '这是间隔后的书面辨认观察，仍不能证明永久记住。'
        : '只是当次的书面辨认表现，保持情况还要隔段时间再看。',
      needsReview: false
    };
  }
  if (last.result === 'practice-correct' || last.result === 'supported-correct') {
    return { type: 'supported', title: '已练习 · 待独立复检',
      detail: '有帮助或近期看过答案；这次正确不能当作独立掌握。', needsReview: true };
  }
  return { type: 'needs', title: last.result === 'unknown' ? '刚表示不知道' : '需要巩固',
    detail: '先理解正确词义，再找机会独立观察。', needsReview: true };
}

export function weakWordIds(s) {
  return sampleWords.map(w => w.id).filter(id => wordStatus(s, id).needsReview);
}
export function summary(s) {
  const recent = s.events;
  const first = recent.filter(e => e.kind !== 'reinforce' && e.kind !== 'review');
  return {
    attempted: recent.length,
    independent: recent.filter(e => e.result === 'independent-correct').length,
    supported: recent.filter(e => e.result === 'supported-correct' || e.result === 'practice-correct').length,
    review: weakWordIds(s).length,
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
export function startLesson(s, mode = 'new') {
  const active = s.session && !s.session.finished;
  if (active) { s.session.paused = false; s.screen = 'focus'; return true; }
  const freshBatch = nextBatch(s);
  const isReview = mode === 'review' || (mode === 'new' && freshBatch.length === 0);
  const ids = isReview ? weakWordIds(s).slice(0,4) : freshBatch;
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
export function recordAnswer(s, response) {
  const task = currentTask(s);
  if (!task || s.session.phase !== 'ask') return false;
  const w = wordById[task.wordId];
  if (!w) return false;
  const now = new Date().toISOString();
  const previous = fresh(s, w.id);
  const recentExposure = previous.some(e => e.source !== 'sample-history' && sameDay(e.at, now));
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
    shownAnswerAfter: true, at: now, source: 'this-demo',
    delayed: task.kind === 'review' && previous.length > 0 && !recentExposure &&
      (Date.parse(now) - Date.parse(previous[previous.length-1].at) >= 18 * 3600000)
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
