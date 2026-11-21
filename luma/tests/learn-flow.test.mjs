import test from 'node:test';
import assert from 'node:assert/strict';
import { state, resetDemo, change } from '../js/state.js';
import { currentPreview, beginPreview, previewOpenLearn, previewLearnExposure,
  previewLearnPractice, previewSubmit, previewOutcome, previewNext } from '../js/variant-flow.js';

const store=new Map();
globalThis.window={localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)}};

test('L1: unknown short → Learn contact → Practice → feedback remains immediate supported practice',()=>{
  resetDemo();
  assert.ok(beginPreview(state,'learn-short'));
  assert.equal(state.previewSession.phase,'learn');
  assert.equal(state.previewLearnEvents.length,1);
  assert.equal(state.previewEvents.length,0);
  assert.equal(state.previewLearnEvents[0].section,'core');
  assert.ok(previewLearnExposure(state,'forms'));
  assert.ok(previewLearnExposure(state,'audio'));
  assert.ok(previewLearnExposure(state,'forms')); // repeated opening is not duplicate contact
  assert.equal(state.previewLearnEvents.length,3);
  assert.ok(previewLearnPractice(state));
  assert.equal(currentPreview(state).id,'learn-short-meaning');
  assert.equal(state.previewSession.phase,'ask');
  assert.ok(previewSubmit(state,'短的'));
  const e=previewOutcome(state);
  assert.equal(e.result,'practice-correct');
  assert.equal(e.learnedBeforeAttempt,true);
  assert.deepEqual(e.learnSectionsSeen,['core','forms','audio']);
  assert.equal(e.isDelayedReview,false);
  assert.equal(e.reviewType,'practice-not-delayed-review');
  previewNext(state);
  assert.equal(state.previewSession.finished,true);
});

test('L2: unfamiliar expression → wrong attempt → targeted Learn → new immediate practice, no lost failure',()=>{
  resetDemo();
  beginPreview(state,'learn-sometimes');
  assert.equal(state.previewSession.phase,'ask');
  assert.equal(state.previewLearnEvents.length,0);
  previewSubmit(state,'sometime');
  assert.equal(previewOutcome(state).result,'incorrect');
  assert.equal(state.previewSession.queue.length,2);
  const wrongId=previewOutcome(state).id;
  assert.ok(previewOpenLearn(state));
  assert.equal(state.previewSession.phase,'learn');
  assert.equal(state.previewSession.learnReturn,'next');
  assert.ok(previewLearnExposure(state,'contrast'));
  assert.equal(state.previewLearnEvents.at(-1).afterFeedback,true);
  assert.ok(previewLearnPractice(state));
  assert.equal(currentPreview(state).id,'choose-sometimes-again');
  assert.equal(state.previewSession.phase,'ask');
  previewSubmit(state,'sometimes');
  assert.equal(previewOutcome(state).result,'practice-correct');
  assert.equal(previewOutcome(state).learnedBeforeAttempt,true);
  assert.equal(previewOutcome(state).priorAttempts,1);
  assert.equal(state.previewEvents[0].id,wrongId);
  assert.equal(state.previewEvents[0].result,'incorrect');
});

test('L2: independent first success is not downgraded; optional Learn then reattempt is not fresh evidence',()=>{
  resetDemo();beginPreview(state,'learn-sometimes');
  previewSubmit(state,'sometimes');
  assert.equal(previewOutcome(state).result,'independent-correct');
  const firstId=previewOutcome(state).id;
  previewOpenLearn(state);
  assert.equal(state.previewSession.learnReturn,'current');
  previewLearnPractice(state);
  previewSubmit(state,'sometimes');
  assert.equal(previewOutcome(state).result,'practice-correct');
  assert.equal(state.previewEvents[0].id,firstId);
  assert.equal(state.previewEvents[0].result,'independent-correct');
});

test('opening Learn before first attempt never fabricates a Question/Attempt',()=>{
  resetDemo();beginPreview(state,'learn-sometimes');
  previewOpenLearn(state);
  assert.equal(state.previewEvents.length,0);
  assert.equal(state.previewLearnEvents.length,1);
  previewLearnPractice(state);
  previewSubmit(state,'sometimes');
  assert.equal(previewOutcome(state).result,'practice-correct');
});

test('English spelling: case and boundary spaces are tolerant; internal spaces and punctuation are not',()=>{
  const spell=(answer)=>{resetDemo();beginPreview(state,'spell');previewSubmit(state,answer);return previewOutcome(state).result;};
  assert.equal(spell('  BORROW  '),'independent-correct');
  for(const wrong of ['bor row','borr ow','bor.row','bo-rrow','borrow!','borrow,']) {
    assert.equal(spell(wrong),'incorrect',wrong);
  }
  resetDemo();beginPreview(state,'learn-sometimes');
  previewSubmit(state,'some times');
  assert.equal(previewOutcome(state).result,'incorrect','internal space changes the English expression');
  resetDemo();beginPreview(state,'retrieve');previewSubmit(state,'  由 于！ ');
  assert.equal(previewOutcome(state).result,'independent-correct');
});

test('recent same-material repetition across sessions remains exposure-conditioned',()=>{
  resetDemo();beginPreview(state,'spell');previewSubmit(state,'borrow');
  assert.equal(previewOutcome(state).result,'independent-correct');
  beginPreview(state,'spell');previewSubmit(state,'BORROW');
  assert.equal(previewOutcome(state).result,'practice-correct');
  assert.equal(previewOutcome(state).sameMaterialRecent,true);
});

test('Learn exposure survives pause/resume persistence without contaminating R1 events',()=>{
  resetDemo();beginPreview(state,'learn-short');
  previewLearnExposure(state,'phrases');
  change(()=>{});
  const saved=JSON.parse(store.get('luma-r1-prototype-v1'));
  assert.equal(saved.previewSession.phase,'learn');
  assert.equal(saved.previewLearnEvents.length,2);
  assert.deepEqual(saved.events,[]);
  assert.equal(saved.previewEvents.length,0);
});
