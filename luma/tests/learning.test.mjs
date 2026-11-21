import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleWords, wordById } from '../data/sample-data.js';

const storage = new Map();
globalThis.window = { localStorage: {
  getItem: key => storage.get(key) ?? null,
  setItem: (key,value) => storage.set(key,value)
}};
const { state, resetDemo, change, allEvidence } = await import('../js/state.js');
const {
  startLesson, currentTask, recordAnswer, hint, nextTask, pauseLesson, latestOutcome,
  wordStatus, weakWordIds, summary, nextBatch
} = await import('../js/learning.js');

test('fixture history remains explicitly separate and can prompt review',()=>{
  resetDemo();
  const history=allEvidence(state);
  assert.equal(history.length,2);
  assert.ok(history.every(event=>event.source==='sample-history'));
  assert.equal(wordStatus(state,'because').needsReview,true);
  assert.equal(summary(state).attempted,0);
});

test('unknown -> explanation -> deferred rehearsal never becomes independent mastery',()=>{
  resetDemo();
  assert.equal(startLesson(state),true);
  assert.equal(currentTask(state).wordId,'because');
  assert.equal(recordAnswer(state,null),true);
  assert.equal(latestOutcome(state).result,'unknown');
  assert.equal(state.session.queue.length,5);
  nextTask(state);
  recordAnswer(state,wordById.through.answer);
  assert.equal(latestOutcome(state).result,'independent-correct');
  nextTask(state);
  hint(state); recordAnswer(state,wordById.enough.answer);
  assert.equal(latestOutcome(state).result,'supported-correct');
  nextTask(state);
  recordAnswer(state,'错误选项');
  assert.equal(latestOutcome(state).result,'incorrect');
  nextTask(state);
  const seen=[];
  while(!state.session.finished) {
    const task=currentTask(state);
    assert.equal(task.kind,'reinforce');
    seen.push(task.wordId);
    recordAnswer(state,wordById[task.wordId].answer);
    assert.equal(latestOutcome(state).result,'practice-correct');
    nextTask(state);
  }
  assert.deepEqual(seen,['because','enough','decide']);
  assert.equal(summary(state).independent,1);
  assert.equal(summary(state).supported,4);
  assert.equal(nextBatch(state).length,4);
  assert.ok(state.events.every(e=>e.sessionId==='lesson-1'));
});

test('paused focus preserves hint exposure and returns to same task',()=>{
  resetDemo(); startLesson(state);
  hint(state); assert.equal(state.session.hintUsed,true);
  pauseLesson(state);
  assert.equal(state.screen,'workspace');
  assert.equal(state.session.paused,true);
  assert.equal(startLesson(state),true);
  assert.equal(state.screen,'focus');
  assert.equal(state.session.phase,'ask');
  assert.equal(state.session.hintUsed,true);
  recordAnswer(state,wordById.because.answer);
  assert.equal(latestOutcome(state).result,'supported-correct');
  change(()=>{});
  const stored=JSON.parse(storage.get('luma-r1-prototype-v1'));
  assert.equal(stored.session.phase,'feedback');
  assert.equal(stored.events[0].hintUsed,true);
});

test('same-day review correct is not a new independent or delayed proof',()=>{
  resetDemo(); startLesson(state);
  recordAnswer(state,null);
  nextTask(state);
  for(const id of ['through','enough','decide']){
    recordAnswer(state,wordById[id].answer); nextTask(state);
  }
  recordAnswer(state,wordById.because.answer);nextTask(state);
  assert.equal(state.session.finished,true);
  assert.equal(startLesson(state,'review'),true);
  assert.equal(currentTask(state).kind,'review');
  recordAnswer(state,wordById.because.answer);
  assert.equal(latestOutcome(state).result,'supported-correct');
  assert.equal(latestOutcome(state).delayed,false);
  assert.ok(weakWordIds(state).includes('because'));
});
