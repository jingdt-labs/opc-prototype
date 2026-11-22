import test from 'node:test';
import assert from 'node:assert/strict';
import { GOAL_SIZE, DEMOS, WORDS, taskFor, progressFor, canDeclareGoal, goalMessage,
  evaluateResponse, startQueue, assessmentQueue, sessionSummary, suggestedAction } from '../js/r3-model.js';
import { renderPage } from '../js/r3-view.js';

const state=(overrides={})=>({
  version:3,entered:true,confirmed:true,view:'home',theme:'system',scenario:'start',
  duration:30,events:[],visits:0,serial:0,session:null,...overrides
});
test('scenario aggregates cover the specified full Goal with a distinct unknown category',()=>{
 assert.equal(GOAL_SIZE,500);
 for(const [key,d] of Object.entries(DEMOS)){
  assert.equal(d.base+d.gained+d.strengthen+d.unknown,500,key);
  assert.ok([d.base,d.gained,d.strengthen,d.unknown].every(Number.isInteger));
 }
 assert.equal(progressFor('start').unknown,500);
 assert.equal(progressFor('start').reached,0);
});
test('only a verified, fully covered simulated whole-range review may declare completion',()=>{
 for(const key of Object.keys(DEMOS)){
  assert.equal(canDeclareGoal(progressFor(key)),key==='achieved',key);
 }
 assert.match(goalMessage('gap').detail,/13/);
 assert.match(goalMessage('near').title,/接近/);
 assert.match(goalMessage('achieved').detail,/跨时间/);
 assert.equal(canDeclareGoal({...progressFor('achieved'),unknown:1}),false);
});
test('meaning recognition uses the word meaning, not the sentence answer',()=>{
 const word=taskFor('borrow','meaning');
 const sentence=taskFor('borrow','context');
 assert.equal(word.expected,'借入');
 assert.ok(word.choices.includes('借入'));
 assert.equal(sentence.expected,'我可以借你的笔吗？');
 assert.ok(sentence.choices.includes(sentence.expected));
 assert.ok(!word.choices.includes(sentence.expected));
});
test('all authored words have a concise meaning and contextualized learning and independent review',()=>{
 assert.ok(WORDS.length>=10);
 for(const word of WORDS){
  assert.ok(word.sense&&word.note&&word.sentence&&word.sentenceMeaning,word.id);
  for(const type of ['meaning','context']){
   const task=taskFor(word.id,type);
   const independent=taskFor(word.id,type,true);
   assert.ok(task.choices.includes(task.expected),word.id+':'+type);
   assert.ok(independent.choices.includes(independent.expected),word.id+':'+type+':assessment');
   assert.notEqual(task.materialId,independent.materialId);
  }
 }
});
test('unassisted, helped, unknown and uncertain recall remain distinct',()=>{
 const t=taskFor('because','meaning');
 assert.equal(evaluateResponse(t,'因为','recall',false),'independent-correct');
 assert.equal(evaluateResponse(t,'由于','recall',false),'independent-correct');
 assert.equal(evaluateResponse(t,'因为','choice',true),'supported-correct');
 assert.equal(evaluateResponse(t,null,'recall'),'unknown');
 assert.equal(evaluateResponse(t,'正因为如此','recall'),'unverified');
 assert.equal(evaluateResponse(t,'但是','choice'),'incorrect');
});
test('context success is specific to sentence comprehension rather than spelling',()=>{
 const t=taskFor('borrow','context');
 assert.equal(evaluateResponse(t,t.expected,'choice'),'independent-correct');
 assert.equal(evaluateResponse(t,'借入','choice'),'incorrect');
});
test('a weak task influences the next daily session, with no finite session wall',()=>{
 const before=startQueue([],0,'start');
 assert.equal(before[0].wordId,'short');
 const ev=[{kind:'attempt',wordId:'borrow',result:'unknown'}];
 const after=startQueue(ev,1,'start');
 assert.equal(after[0].wordId,'borrow');
 assert.equal(after[0].type,'meaning');
 const corrected=startQueue([...ev,{kind:'attempt',wordId:'borrow',type:'meaning',result:'independent-correct'}],1,'start');
 assert.notEqual(corrected[0].wordId,'borrow');
 for(let visit=0;visit<28;visit++)assert.ok(startQueue([],visit,'start').length>0);
 assert.match(suggestedAction(ev),/borrow/);
});
test('stage assessment uses separate materials and the result remains a sample',()=>{
 const a=assessmentQueue();
 assert.equal(a.length,4);
 assert.ok(a.some(i=>i.type==='context'));
 assert.ok(a.some(i=>i.type==='meaning'));
 assert.ok(a.every(i=>taskFor(i.wordId,i.type,true).materialId.includes('independent')));
});
test('summary does not treat contact as independent performance',()=>{
 const sum=sessionSummary([
  {kind:'exposure',wordId:'because'},
  {kind:'attempt',wordId:'because',type:'meaning',result:'supported-correct'},
  {kind:'attempt',wordId:'borrow',type:'context',result:'independent-correct'},
  {kind:'attempt',wordId:'short',type:'meaning',result:'unverified'}
 ]);
 assert.equal(sum.independent,1);
 assert.equal(sum.supported,1);
 assert.equal(sum.pending,1);
 assert.equal(sum.hasContext,true);
});
test('student home centers next action and Goal progress, not R2 gallery or old slogan',()=>{
 const html=renderPage(state());
 assert.match(html,/开始本次学习/);
 assert.match(html,/尚待了解/);
 assert.match(html,/全范围模拟汇总/);
 assert.doesNotMatch(html,/为英语精进，日拱一卒/);
 assert.doesNotMatch(html,/设计评审专用|探索 R2 动态交互样本/);
});
test('focus has active help, meaning, pause and continuation actions',()=>{
 const q=startQueue([],0,'start');
 const html=renderPage(state({view:'focus',session:{
  type:'daily',items:q,idx:0,stage:'ask',mode:'recall',draft:'',
  micStatus:'',finished:false
 }}));
 for(const a of ['data-action="voice"','data-action="show-options"','data-action="unknown"',
  'data-action="learn"','data-action="pause"','data-action="submit"']){
  assert.ok(html.includes(a),a);
 }
});
test('assessment and achieved outcomes have separate learner views',()=>{
 const achieved=renderPage(state({scenario:'achieved',view:'goal-review'}));
 assert.match(achieved,/这一阶段的学习目标已达成/);
 assert.match(achieved,/不会自动扩大/);
 const unfinished=renderPage(state({scenario:'gap',view:'goal-review'}));
 assert.match(unfinished,/还不能宣布达成/);
 const intro=renderPage(state({view:'assessment-intro'}));
 assert.match(intro,/独立检查/);
});

test('independent assessment does not expose an auditory clue before answering',()=>{
 const html=renderPage(state({view:'focus',session:{
  type:'assessment',items:assessmentQueue(),idx:0,stage:'ask',mode:'choice',
  draft:'',micStatus:'',finished:false
 }}));
 assert.doesNotMatch(html,/data-action="pronounce"/);
 assert.doesNotMatch(html,/data-action="learn"/);
 assert.doesNotMatch(html,/data-action="show-options"/);
});
