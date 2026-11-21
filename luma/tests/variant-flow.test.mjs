import test from 'node:test';
import assert from 'node:assert/strict';
import { scenarioById, exampleById } from '../data/experience-data.js';
import { state, resetDemo, change } from '../js/state.js';
import { startLesson, currentTask, recordAnswer } from '../js/learning.js';
import { beginPreview, currentPreview, previewHint, previewAudioCompleted,
  previewAudioError, previewRevealText, previewDraft, previewSubmit,
  previewOutcome, previewNext, pausePreview, resumePreview } from '../js/variant-flow.js';

const store=new Map();
globalThis.window={localStorage:{getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)}};

test('R2 gallery uses different goals and authored materials without changing R1',()=>{
  resetDemo();
  state.goal={intentId:'homework',performance:'written-meaning-recognition'};
  startLesson(state,'new');
  recordAnswer(state,null);
  const r1Copy=JSON.stringify({goal:state.goal,session:state.session,events:state.events});
  for(const key of ['retrieve','listen','spell','context','rich']){
    assert.ok(scenarioById[key]);
    assert.ok(beginPreview(state,key));
    assert.equal(currentPreview(state).id,scenarioById[key].taskIds[0]);
    assert.ok(currentPreview(state).materialId);
  }
  assert.equal(JSON.stringify({goal:state.goal,session:state.session,events:state.events}),r1Copy);
});

test('open meaning answer has bounded uncertainty and triggers recognition support',()=>{
  resetDemo();beginPreview(state,'retrieve');
  previewDraft(state,'我记不清');
  assert.equal(previewSubmit(state,state.previewSession.draft),true);
  assert.equal(previewOutcome(state).result,'unverified');
  assert.equal(state.previewSession.queue.length,2);
  assert.equal(previewOutcome(state).evaluatedBy,'bounded-fixture-rule');
  previewNext(state);
  assert.equal(currentPreview(state).id,'recognize-because');
  previewSubmit(state,'因为');
  assert.equal(previewOutcome(state).result,'practice-correct');
  assert.equal(previewOutcome(state).wasShownPriorAnswer,true);
  previewNext(state);
  assert.equal(state.screen,'lab');
  assert.equal(state.previewSession.finished,true);
});

test('equivalent Chinese recall accepted without an unnecessary support task',()=>{
  resetDemo();beginPreview(state,'retrieve');
  previewSubmit(state,'  由于 ');
  assert.equal(previewOutcome(state).result,'independent-correct');
  assert.equal(state.previewSession.queue.length,1);
  assert.equal(previewOutcome(state).observedPerformance,'active-recall');
});

test('audio choice is gated by genuine completed playback',()=>{
  resetDemo();beginPreview(state,'listen');
  assert.equal(previewSubmit(state,'因为'),false);
  assert.equal(state.previewEvents.length,0);
  previewAudioCompleted(state);previewAudioCompleted(state);
  previewSubmit(state,'因为');
  const evidence=previewOutcome(state);
  assert.equal(evidence.result,'independent-correct');
  assert.equal(evidence.audioPlayed,true);
  assert.equal(evidence.audioPlays,2);
  assert.equal(evidence.textRevealed,false);
  assert.equal(evidence.observedPerformance,'auditory-recognition');
});

test('audio unavailable -> visible transcript creates no pure listening success',()=>{
  resetDemo();beginPreview(state,'listen');
  previewAudioError(state,'模拟浏览器不支持语音');
  assert.ok(state.previewSession.audioError);
  previewRevealText(state);
  previewSubmit(state,'因为');
  const event=previewOutcome(state);
  assert.equal(event.result,'supported-correct');
  assert.equal(event.audioPlayed,false);
  assert.equal(event.textRevealed,true);
  assert.equal(event.observedPerformance,'written-recognition-with-visible-text');
});

test('spelling uses an English entry and retains hint conditions',()=>{
  resetDemo();beginPreview(state,'spell');
  previewDraft(state,'BORROW');
  previewSubmit(state,state.previewSession.draft);
  assert.equal(previewOutcome(state).result,'independent-correct');
  previewNext(state);assert.equal(state.previewSession.finished,true);
  beginPreview(state,'spell');previewHint(state);previewDraft(state,'borrow');
  previewSubmit(state,state.previewSession.draft);
  assert.equal(previewOutcome(state).result,'supported-correct');
  assert.equal(previewOutcome(state).hintUsed,true);
  beginPreview(state,'spell');previewSubmit(state,'lend');
  assert.equal(previewOutcome(state).result,'incorrect');
  assert.equal(previewOutcome(state).response,'lend');
});

test('context and rich scenarios have context-specific independent attempts',()=>{
  resetDemo();beginPreview(state,'context');
  assert.ok(currentPreview(state).sentence.includes('Although'));
  previewSubmit(state,'虽然下雨，我们仍然出门');
  assert.equal(previewOutcome(state).result,'independent-correct');
  previewNext(state);
  beginPreview(state,'rich');
  assert.equal(exampleById['rich-because'].extra.length,2);
  previewHint(state);previewSubmit(state,'身体不舒服');
  assert.equal(previewOutcome(state).result,'supported-correct');
  assert.equal(previewOutcome(state).materialId,'r2.rich.because.v1');
  assert.equal(previewOutcome(state).requestedPerformance,'cause-in-context');
});

test('preview pause / refresh-save / resume keeps precise conditions',()=>{
  resetDemo();beginPreview(state,'spell');previewHint(state);previewDraft(state,'bo');
  pausePreview(state);assert.equal(state.screen,'lab');
  assert.equal(resumePreview(state),true);assert.equal(state.screen,'variant');
  assert.equal(state.previewSession.draft,'bo');
  assert.equal(state.previewSession.hintUsed,true);
  change(()=>{});
  const persisted=JSON.parse(store.get('luma-r1-prototype-v1'));
  assert.equal(persisted.previewSession.draft,'bo');
  assert.equal(persisted.previewSession.hintUsed,true);
  assert.ok(Array.isArray(persisted.previewEvents));
});
