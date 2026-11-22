import test from 'node:test';
import assert from 'node:assert/strict';
import { GOAL_SIZE, DEMOS, WORDS, taskFor, progressFor, canDeclareGoal, goalMessage,
  evaluateResponse, startQueue, assessmentQueue, assessmentComparison, sessionSummary, suggestedAction } from '../js/r3-model.js';
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
test('first closed Goal requires 500/500 independently evidenced target items',()=>{
 for(const key of Object.keys(DEMOS)){
  const p=progressFor(key);
  assert.equal(canDeclareGoal(p),key==='achieved',key);
  assert.equal(p.status==='achieved',key==='achieved',key);
 }
 const near=progressFor('near'),achieved=progressFor('achieved');
 assert.equal(near.reached,499);
 assert.equal(near.remaining,1);
 assert.equal(achieved.reached,500);
 assert.equal(achieved.remaining,0);
 assert.equal(achieved.strengthen,0);
 assert.equal(achieved.unknown,0);
 assert.equal(canDeclareGoal({...achieved,gained:392,strengthen:1}),false); // 499 despite verified flag
 assert.equal(canDeclareGoal({...achieved,gained:392,unknown:1}),false); // missing evidence
 assert.equal(canDeclareGoal({...achieved,evidenceReview:'insufficient'}),false);
 assert.equal(canDeclareGoal({...achieved,verified:false}),false);
 assert.equal(canDeclareGoal({...achieved,materialRisk:true}),false);
 assert.equal(canDeclareGoal({...achieved,gained:394}),false); // malformed > 500
 assert.match(goalMessage('gap').detail,/13/);
 assert.match(goalMessage('near').title,/接近/);
 assert.match(goalMessage('near').detail,/499\/500/);
 assert.match(goalMessage('achieved').detail,/100%/);
 assert.match(goalMessage('achieved').detail,/跨时间/);
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
 assert.match(html,/全范围模拟历史/);
 assert.match(html,/data-field="scenario"/);
 assert.match(html,/持续学习中/);
 assert.doesNotMatch(html,/为英语精进，日拱一卒/);
 assert.doesNotMatch(html,/设计评审专用|探索 R2 动态交互样本/);
});
test('focus has active help, meaning, pause and continuation actions',()=>{
 const q=startQueue([],0,'start');
 const html=renderPage(state({view:'focus',session:{
  type:'daily',items:q,idx:0,stage:'ask',mode:'recall',draft:'',
  statusMessage:'',finished:false
 }}));
 for(const a of ['data-action="show-options"','data-action="unknown"',
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
  draft:'',statusMessage:'',finished:false
 }}));
 assert.doesNotMatch(html,/data-action="pronounce"/);
 assert.doesNotMatch(html,/data-action="learn"/);
 assert.doesNotMatch(html,/data-action="show-options"/);
});

test('review switcher shows meaningful nonzero progress and matches on home, detail and Goal',()=>{
 const active=state({scenario:'growing'});
 const home=renderPage(active);
 const detail=renderPage({...active,view:'progress'});
 const goal=renderPage({...active,view:'goal-review'});
 for(const html of [home,detail,goal]){
  assert.match(html,/data-field="scenario"/);
  assert.match(html,/136/);
  assert.match(html,/92/);
  assert.match(html,/194/);
  assert.match(html,/需要巩固/);
 }
 const newStart=renderPage(state());
 assert.match(newStart,/500/);
 assert.match(newStart,/尚待了解/);
});
test('word and sentence audio icons appear inline in Learn, practice and feedback, not assessment',()=>{
 const base={type:'daily',items:assessmentQueue(),idx:0,draft:'',mode:'choice',finished:false,statusMessage:''};
 const learn=renderPage(state({view:'focus',session:{...base,stage:'learn'}}));
 assert.match(learn,/data-speech-kind="word"/);
 assert.match(learn,/data-speech-kind="sentence"/);
 assert.match(learn,/aria-label="播放单词/);
 assert.match(learn,/aria-label="播放例句/);
 const practice=renderPage(state({view:'focus',session:{...base,stage:'ask'}}));
 assert.match(practice,/data-speech-kind="word"/);
 const feedback=renderPage(state({view:'focus',session:{...base,stage:'feedback',lastAttempt:{result:'independent-correct'}}}));
 assert.match(feedback,/data-speech-kind="sentence"/);
});
test('assessment uses changed sentences and alternate meaning choices, never an identical practice item',()=>{
 for(const item of assessmentQueue()){
  const learning=taskFor(item.wordId,item.type);
  const assessment=taskFor(item.wordId,item.type,true);
  if(item.type==='context')assert.notEqual(learning.stimulus,assessment.stimulus);
  else assert.notDeepEqual(learning.choices,assessment.choices);
 }
});
test('assessment comparison separates authored earlier baseline from this local sample',()=>{
 const e={kind:'attempt',wordId:'borrow',type:'context',result:'independent-correct'};
 const c=assessmentComparison(e);
 assert.match(c.prior,/原先/);
 assert.match(c.updated,/独立/);
 const id='demo-assessment';
 const html=renderPage(state({view:'assessment-result',session:{id,type:'assessment',finished:true},
   events:[{...e,sessionId:id,at:'2026-11-22T00:00:00Z'}]}));
 assert.match(html,/预设可比历史演示/);
 assert.match(html,/原先/);
 assert.match(html,/本次/);
 assert.match(html,/不构成真实的跨时间/);
});
test('Goal page offers only supported time preference, no misleading re-confirm action',()=>{
 const html=renderPage(state({view:'goal'}));
 assert.match(html,/data-field="duration"/);
 assert.doesNotMatch(html,/request-goal|重新确认目标/);
 assert.match(html,/目标范围与表现已确认/);
});

test('supported feedback uses clear result hierarchy and separate word, meaning, example',()=>{
 const session={type:'daily',items:assessmentQueue(),idx:0,stage:'feedback',mode:'choice',
  statusMessage:'',finished:false,lastAttempt:{result:'supported-correct'}};
 const html=renderPage(state({view:'focus',session}));
 assert.match(html,/在帮助下练对了/);
 assert.match(html,/以后还需要独立观察/);
 assert.match(html,/r3-feedback-status/);
 assert.match(html,/r3-feedback-word-line/);
 assert.match(html,/r3-feedback-meaning/);
 assert.match(html,/r3-feedback-example-line/);
 assert.match(html,/data-speech-kind="word"/);
 assert.match(html,/data-speech-kind="sentence"/);
 assert.doesNotMatch(html,/r3-feedback-symbol|◌/);
 assert.ok(html.indexOf('这次学习重点')<html.indexOf('r3-feedback-word-line'));
 assert.ok(html.indexOf('r3-feedback-word-line')<html.indexOf('r3-feedback-meaning'));
 assert.ok(html.indexOf('r3-feedback-meaning')<html.indexOf('r3-feedback-example-line'));
 assert.ok(html.indexOf('r3-feedback-example-line')<html.indexOf('data-action="next"'));
});
test('all four feedback types use the same hierarchy with non-shaming titles',()=>{
 const scenarios=[
  ['independent-correct','这次独立答对了','独立作答'],
  ['supported-correct','在帮助下练对了','得到帮助'],
  ['unverified','这次还不能确定','有待确认'],
  ['incorrect','这次还没有独立完成','继续学习']
 ];
 for(const [result,heading,tag] of scenarios){
  const html=renderPage(state({view:'focus',session:{type:'daily',items:assessmentQueue(),idx:0,
   stage:'feedback',mode:'choice',statusMessage:'',finished:false,lastAttempt:{result}}}));
  assert.match(html,new RegExp(heading));
  assert.match(html,new RegExp(tag));
  assert.match(html,/r3-feedback-content/);
  assert.match(html,/r3-focus-card-feedback/);
  assert.match(html,/data-action="next"/);
 }
});
test('499/500 and 500/500 goal pages agree with home and detailed progress',()=>{
 for(const [scenario,reached,remaining,complete] of [['near',499,1,false],['achieved',500,0,true]]){
  for(const view of ['home','progress','goal-review']){
   const html=renderPage(state({scenario,view}));
   assert.match(html,new RegExp('>'+reached+'</strong>'));
   assert.match(html,new RegExp('100% 达标|99\\.8% 达标'));
   assert.match(html,new RegExp(complete?'本阶段目标已完成|目标已达成|这一阶段的学习目标已达成':'还有 1 项尚未达标|接近目标|还不能宣布达成'));
   if(complete){
    assert.match(html,/已有基础/);
    assert.match(html,/新增进步/);
    assert.match(html,/需要巩固/);
    assert.match(html,/尚待了解/);
   }
  }
  const goalView=renderPage(state({scenario,view:'goal'}));
  assert.match(goalView,new RegExp(complete?'这一阶段的学习目标已达成':'接近目标，还差最后 1 项'));
 }
});
test('goal review states 100 percent coverage, not perfect future answer accuracy',()=>{
 const html=renderPage(state({scenario:'achieved',view:'goal-review'}));
 assert.match(html,/全部 500 项学习重点均已逐项达到/);
 assert.match(html,/不意味着未来每次作答零失误/);
 assert.doesNotMatch(html,/少量待巩固|少量待复核|有限波动/);
});

test('recognition is a first-class choice-only meaning task',()=>{
 const items=startQueue([],0,'start');
 assert.equal(items[0].wordId,'short');
 assert.equal(items[0].answerMode,'choice');
 const html=renderPage(state({view:'focus',session:{
  type:'daily',items,idx:0,stage:'ask',mode:'choice',
  draft:'',statusMessage:'',finished:false
 }}));
 assert.match(html,/选项辨认词义/);
 assert.match(html,/data-action="choose"/);
 assert.match(html,/选择这个词的中文意思/);
 assert.doesNotMatch(html,/id="r3-answer"|data-action="submit"|data-action="show-options"/);
 assert.doesNotMatch(html,/data-action="voice"|语音回答|SpeechRecognition/);
 assert.match(html,/data-action="unknown"|data-action="learn"/);
});
test('active recall is text-only until assistance switches to options',()=>{
 const items=startQueue([],0,'start');
 const html=renderPage(state({view:'focus',session:{
  type:'daily',items,idx:1,stage:'ask',mode:'recall',
  draft:'',statusMessage:'',finished:false
 }}));
 assert.match(html,/主动提取词义/);
 assert.match(html,/id="r3-answer"/);
 assert.match(html,/data-action="submit"/);
 assert.match(html,/data-action="show-options"/);
 assert.match(html,/data-action="unknown"|data-action="learn"/);
 assert.doesNotMatch(html,/data-action="choose"|class="r3-options"/);
 assert.doesNotMatch(html,/data-action="voice"|语音回答|语音识别/);
 const after=renderPage(state({view:'focus',session:{
  type:'daily',items,idx:1,stage:'ask',mode:'choice',help:true,
  draft:'',statusMessage:'已切换为选项辨认；本次答案会保留求助条件。',finished:false
 }}));
 assert.match(after,/data-action="choose"/);
 assert.doesNotMatch(after,/id="r3-answer"|data-action="submit"|data-action="show-options"/);
 assert.match(after,/保留求助条件/);
 assert.equal(evaluateResponse(taskFor('because','meaning'),'因为','choice',true),'supported-correct');
});
test('home swaps cards, contains detail action inside progress panel, and retains one coherent progress',()=>{
 for(const scenario of ['start','growing','review','near','achieved']){
  const html=renderPage(state({scenario}));
  const left=html.indexOf('<div class="r3-hero-side r3-panel">');
  const detail=html.indexOf('data-action="nav-progress"');
  const hero=html.indexOf('<div class="r3-hero r3-panel">');
  assert.ok(left>=0&&left<hero,scenario+': progress should precede task');
  const detailsButton=html.indexOf('<div class="r3-progress-actions">');
  assert.ok(detailsButton>left&&detailsButton<hero,scenario+': detail button inside progress card');
  assert.match(html,/r3-progress-actions/);
  assert.doesNotMatch(html,/r3-inline-link/);
  assert.match(html,/r3-home-grid/);
 }
});

test('direct recognition feedback is not mislabelled as active recall',()=>{
 const html=renderPage(state({view:'focus',session:{
  type:'daily',items:startQueue([],0,'start'),idx:0,stage:'feedback',mode:'choice',
  draft:'',statusMessage:'',finished:false,
  lastAttempt:{result:'independent-correct',answerMode:'choice',choiceShown:true,supported:false}
 }}));
 assert.match(html,/这次认对了词义/);
 assert.match(html,/独立辨认/);
 assert.match(html,/不等于无选项主动提取/);
 assert.doesNotMatch(html,/在帮助下练对了/);
});
