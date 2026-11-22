// R3 — one coherent learner journey. Static interactive prototype; never a production evaluator.
import { WORD_BY_ID, taskFor, startQueue, assessmentQueue, evaluateResponse } from './r3-model.js';
import { renderPage } from './r3-view.js';

const KEY='luma-r3-first-learner-v1';
const VERSION=3;
const fresh=()=>({
 version:VERSION, entered:false, confirmed:false, view:'login', theme:'system',
 scenario:'start', duration:30, events:[], visits:0, serial:0, session:null
});
function load(){
 try {
  const raw=JSON.parse(localStorage.getItem(KEY)||'null');
  if(!raw||raw.version!==VERSION||!Array.isArray(raw.events))return fresh();
  const s={...fresh(),...raw};
  if(!['system','light','dark'].includes(s.theme))s.theme='system';
  if(!['start','growing','review','near','gap','achieved'].includes(s.scenario))s.scenario='start';
  return s;
 } catch {return fresh();}
}
const state=load();
function save(){
 try{localStorage.setItem(KEY,JSON.stringify(state));}catch{/* Private mode retains this tab. */}
}
function render(scroll=false){
 document.documentElement.setAttribute('data-theme',state.theme);
 document.getElementById('app').innerHTML=renderPage(state);
 document.title='Luma · 学习空间';
 if(scroll)window.scrollTo({top:0,behavior:'instant'});
 if(state.view==='focus'&&state.session?.stage==='ask'&&state.session.mode==='recall'){
   const input=document.getElementById('r3-answer');
   if(input&&document.activeElement!==input){
     input.focus({preventScroll:true});
     if(state.session.draft)input.setSelectionRange(input.value.length,input.value.length);
   }
 }
}
function update(fn,scroll=false){fn();save();render(scroll);}
function route(view){update(()=>{state.view=view;},true);}
function newSession(type){
 if(state.session&&!state.session.finished&&state.session.type===type){
  update(()=>{state.session.paused=false;state.view='focus';},true);return;
 }
 const queue=type==='assessment'?assessmentQueue():startQueue(state.events,state.visits,state.scenario);
 update(()=>{
  if(type==='daily')state.visits++;
  state.serial++;
  state.session={
   id:'r3-'+state.serial+'-'+type, type, items:queue,
   idx:0, stage:'ask', mode:initialMode(queue[0],type), draft:'',
   help:false,exposed:false,paused:false,finished:false,
   statusMessage:'',lastAttempt:null,
   startedAt:new Date().toISOString()
  };
  state.view='focus';
 },true);
}
function initialMode(item,type){return type==='assessment'||item.type==='context'||item.answerMode==='choice'?'choice':'recall';}
function activeTask(){
 const s=state.session;
 if(!s||s.finished||!s.items[s.idx])return null;
 return taskFor(s.items[s.idx].wordId,s.items[s.idx].type,s.type==='assessment');
}
function appendEvent(ev){
 state.events.push({
  id:'local-'+(state.events.length+1),sessionId:state.session.id,
  scenario:state.scenario,source:'r3-local-prototype',
  at:new Date().toISOString(),...ev
 });
}
function expose(reason='learn'){
 const f=state.session,t=activeTask();
 if(!t||f.type==='assessment')return;
 appendEvent({
   kind:'exposure',reason,wordId:t.wordId,type:t.type,
   materialId:t.materialId,
   inputMode:'reading',answerVisible:true,confidence:'no-performance-claim'
 });
 f.exposed=true;
}
function study(){
 const f=state.session,t=activeTask();
 if(!f||!t||f.type==='assessment')return;
 update(()=>{expose('explanation');f.stage='learn';f.statusMessage='';},true);
}
function recordResponse(response){
 const f=state.session,t=activeTask();
 if(!f||!t||f.stage!=='ask')return;
 const supported=Boolean(f.help||f.exposed);
 const result=evaluateResponse(t,response,f.mode,supported);
 update(()=>{
  const event={
   kind:'attempt',wordId:t.wordId,type:t.type,materialId:t.materialId,
   requestedPerformance:t.type==='meaning'?'written-meaning':'simple-sentence-comprehension',
   response:response===null?null:String(response).slice(0,100),
   result,choiceShown:f.mode==='choice',supported,answerVisibleBefore:f.exposed,
   inputMode:f.mode==='choice'?'choice':'typed', answerMode:f.mode,
   evaluation:result==='unverified'?'limited-demo-cannot-grade-open-answer':'bounded-example-fixture',
   assessment:f.type==='assessment'
  };
  appendEvent(event);
  f.lastAttempt=event;
  f.draft='';
  if(f.type==='assessment'){
    advance(true);
  } else if(result==='unknown'||(result==='incorrect'&&!f.exposed)){
    expose(result==='unknown'?'unknown-to-learn':'incorrect-to-learn');
    f.stage='learn';f.statusMessage='';
  } else {
    f.stage='feedback';f.statusMessage='';
  }
 },true);
}
function advance(insideUpdate=false){
 const f=state.session;
 const act=()=>{
  f.idx++;
  if(f.idx>=f.items.length){
    f.finished=true;f.paused=false;
    state.view=f.type==='assessment'?'assessment-result':'session-end';
    return;
  }
  f.stage='ask';f.mode=initialMode(f.items[f.idx],f.type);
  f.help=false;f.exposed=false;f.draft='';f.statusMessage='';
  f.lastAttempt=null;
  state.view='focus';
 };
 if(insideUpdate)act();else update(act,true);
}
function endSession(){
 const f=state.session;
 if(!f||f.finished){route('home');return;}
 if(f.type==='assessment'){update(()=>{f.paused=true;state.view='home';},true);return;}
 update(()=>{f.finished=true;f.paused=false;state.view='session-end';},true);
}
function setStatusMessage(message){
 if(!state.session||state.session.finished)return;
 update(()=>{state.session.statusMessage=message;},false);
}
let speechSerial=0;
function pronounce(el){
 const f=state.session,t=activeTask();
 if(!f||!t||f.type==='assessment')return; // Independent assessments cannot receive speech support.
 const kind=el?.dataset?.speechKind;
 if(kind!=='word'&&kind!=='sentence')return;
 const stage=f.stage, idx=f.idx;
 const utteranceText=kind==='word'?t.word.text:
   stage==='learn'?t.word.sentence:
   stage==='feedback'&&t.type==='meaning'?t.word.sentence:t.stimulus;
 if(!utteranceText)return;
 if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){
  setStatusMessage('发音暂时不可用，可以继续看文字学习。');
  return;
 }
 const token=++speechSerial;
 const stillHere=()=>speechSerial===token&&state.session===f&&f.idx===idx&&f.stage===stage;
 try{
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(utteranceText);
  u.lang='en-US';u.rate=.87;
  u.onstart=()=>{
   if(!stillHere())return;
   update(()=>{
    if(stage==='ask'){
     f.help=true; // Audio may cue meaning: never promote this attempt to unsupported evidence.
     appendEvent({kind:'audio-support',wordId:t.wordId,type:t.type,
       materialId:t.materialId,spokenText:utteranceText,performance:'no-assessment-claim'});
    }
    f.statusMessage=kind==='word'?'正在朗读单词…':'正在朗读例句…';
   });
  };
  u.onend=()=>{if(stillHere())setStatusMessage('朗读已结束，可以继续学习。');};
  u.onerror=()=>{if(stillHere())setStatusMessage('这次朗读没有成功，请继续用文字学习。');};
  window.speechSynthesis.speak(u);
 }catch{
  if(stillHere())setStatusMessage('朗读暂时不可用，不影响当前学习。');
 }
}
function handleAction(action,el){
 const f=state.session;
 switch(action){
 case 'enter':update(()=>{state.entered=true;state.view='setup';},true);break;
 case 'confirm-goal':update(()=>{state.confirmed=true;state.view='home';},true);break;
 case 'nav-home':route('home');break;
 case 'nav-progress':route('progress');break;
 case 'nav-goal':route('goal');break;
 case 'return-home':route('home');break;
 case 'goal-review':route('goal-review');break;
 case 'start-daily':newSession('daily');break;
 case 'open-assessment':
 case 'assessment-info':route('assessment-intro');break;
 case 'start-assessment':newSession('assessment');break;
 case 'resume':if(f&&!f.finished)update(()=>{f.paused=false;state.view='focus';},true);else newSession('daily');break;
 case 'pause':update(()=>{if(f)f.paused=true;state.view='home';},true);break;
 case 'end-session':endSession();break;
 case 'finish-session':endSession();break;
 case 'show-options':
   if(f&&f.stage==='ask'&&f.type==='daily'&&f.mode==='recall')update(()=>{
    const t=activeTask();
    appendEvent({kind:'support-request',reason:'switch-to-options',
      wordId:t.wordId,type:t.type,materialId:t.materialId,
      priorAnswerDraft:f.draft||null,priorAnswerSubmitted:false,
      answerVisible:false,performance:'no-performance-claim'});
    f.mode='choice';f.help=true;f.draft='';
    f.statusMessage='已切换为选项辨认；本次答案会保留求助条件。';
   });break;
 case 'learn':study();break;
 case 'unknown':recordResponse(null);break;
 case 'choose':
   if(el&&el.dataset.answer!==undefined)recordResponse(el.dataset.answer);break;
 case 'submit':
   if(f&&f.stage==='ask'){
    if(!String(f.draft||'').trim()){setStatusMessage('先写下你的想法，或者直接选择“我不知道”。');break;}
    recordResponse(f.draft);
   }break;
 case 'study-after-learn':
   if(f&&f.stage==='learn')update(()=>{
    f.stage='ask';f.mode='choice';f.help=true;f.draft='';
    f.statusMessage='先看过讲解，接下来是巩固练习。';
   },true);break;
 case 'retry-options':
   if(f&&f.stage==='feedback'&&f.type==='daily')update(()=>{
    expose('feedback-answer-visible');
    f.stage='ask';f.mode='choice';f.help=true;f.draft='';
    f.statusMessage='这次换成选项来巩固，不记为独立主动提取。';
   },true);break;
 case 'next':if(f&&f.stage==='feedback')advance();break;
 case 'pronounce':pronounce(el);break;
 case 'reset-demo':
   if(window.confirm('清除这台浏览器的 R3 演示记录并回到首次体验？')){
    const next=fresh();Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,next);
    save();render(true);
   }break;
 }
}
document.addEventListener('click',event=>{
 const target=event.target.closest('[data-action]');
 if(!target)return;
 event.preventDefault();
 handleAction(target.dataset.action,target);
});
document.addEventListener('input',event=>{
 if(event.target.id!=='r3-answer'||!state.session||state.session.stage!=='ask')return;
 state.session.draft=event.target.value.slice(0,80);
 save();
});
document.addEventListener('change',event=>{
 const field=event.target.dataset.field;
 if(field==='theme'){
  update(()=>{state.theme=event.target.value;});return;
 }
 if(field==='duration'){
  const n=Number(event.target.value);
  if([20,30,40,60].includes(n))update(()=>{state.duration=n;});return;
 }
 if(field==='scenario'){
  const choice=event.target.value;
  if(!['start','growing','review','near','gap','achieved'].includes(choice))return;
  if(choice===state.scenario)return;
  if((state.events.length>0||(state.session&&!state.session.finished)) &&
      !window.confirm('切换演示阶段将清除当前本地样题记录；这不会变更真实学习目标。继续吗？')){
   render();return;
  }
  update(()=>{
   state.scenario=choice;state.events=[];state.visits=0;state.session=null;
   if(!['home','progress','goal','goal-review'].includes(state.view))state.view='home';
  },true);
 }
});
document.addEventListener('keydown',event=>{
 if(state.view!=='focus'||!state.session||state.session.finished)return;
 const f=state.session,t=activeTask();
 if(!t)return;
 if(event.key==='Escape'){
  event.preventDefault();handleAction('pause');return;
 }
 const el=event.target,tag=el?.tagName||'';
 const editing=tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT'||el?.isContentEditable;
 if(event.key==='Enter'){
  if(editing&&tag==='INPUT'&&f.stage==='ask'&&f.mode==='recall'){
   event.preventDefault();handleAction('submit');
  } else if(!editing&&tag!=='BUTTON'&&f.stage==='feedback'){
   event.preventDefault();handleAction('next');
  }
  return;
 }
 if(editing||tag==='BUTTON'||f.stage!=='ask'||f.mode!=='choice')return;
 const choices=t.choices||[];
 const key=String(event.key).toUpperCase();
 const idx='ABCD'.indexOf(key);
 if(idx>=0&&idx<choices.length){
  event.preventDefault();recordResponse(choices[idx]);
 }
});
render();
