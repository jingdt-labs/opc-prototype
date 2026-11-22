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
   micStatus:'',transcriptPending:false,inputMode:'typed',lastAttempt:null,
   startedAt:new Date().toISOString()
  };
  state.view='focus';
 },true);
}
function initialMode(item,type){return type==='assessment'||item.type==='context'?'choice':'recall';}
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
 update(()=>{expose('explanation');f.stage='learn';f.micStatus='';},true);
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
   inputMode:f.inputMode, transcriptConfirmed:f.inputMode==='speech',
   evaluation:result==='unverified'?'limited-demo-cannot-grade-open-answer':'bounded-example-fixture',
   assessment:f.type==='assessment'
  };
  appendEvent(event);
  f.lastAttempt=event;
  f.draft=''; f.transcriptPending=false;
  if(f.type==='assessment'){
    advance(true);
  } else if(result==='unknown'||(result==='incorrect'&&!f.exposed)){
    expose(result==='unknown'?'unknown-to-learn':'incorrect-to-learn');
    f.stage='learn';f.micStatus='';
  } else {
    f.stage='feedback';f.micStatus='';
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
  f.help=false;f.exposed=false;f.draft='';f.micStatus='';
  f.transcriptPending=false;f.inputMode='typed';f.lastAttempt=null;
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
function setMicStatus(message){
 if(!state.session||state.session.finished)return;
 update(()=>{state.session.micStatus=message;},false);
}
function voice(){
 const f=state.session;
 if(!f||f.stage!=='ask'||f.mode!=='recall')return;
 const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SpeechRecognition){
  setMicStatus('此浏览器未提供中文语音输入，可直接键入中文或选择“看看选项”。');
  return;
 }
 let recognition;
 try{
  recognition=new SpeechRecognition();
  recognition.lang='zh-CN'; recognition.interimResults=false;
  recognition.maxAlternatives=1;
  recognition.onresult=ev=>{
   const transcript=ev.results?.[0]?.[0]?.transcript||'';
   if(!transcript)return setMicStatus('没有收到可核对的文字，请改用输入或选项。');
   if(!state.session||state.session!==f||f.stage!=='ask')return;
   update(()=>{
    f.draft=String(transcript).slice(0,80);f.inputMode='speech';
    f.transcriptPending=true;
    f.micStatus='已转成文字。请核对后再提交；如果识别有误，可以直接修改。';
   });
  };
  recognition.onerror=()=>{
   if(state.session===f)setMicStatus('这次语音识别未完成，请手动输入或换用选项；不记为答错。');
  };
  recognition.start();
  setMicStatus('正在听你的中文回答…');
 }catch{
  setMicStatus('语音功能暂时无法使用，请手动输入或选择选项；不会据此判断学习情况。');
 }
}
function pronounce(){
 const t=activeTask();
 if(!t)return;
 if(!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){
  setMicStatus('当前浏览器无法朗读。你仍可以阅读文字解释，声音不可用不影响词义判断。');
  return;
 }
 try{
  window.speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t.word.text);
  u.lang='en-US';u.rate=.87;
  u.onerror=()=>setMicStatus('朗读没有成功，可直接阅读词义和例句。');
  window.speechSynthesis.speak(u);
 }catch{
  setMicStatus('朗读暂时不可用，可继续阅读学习材料。');
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
   if(f&&f.stage==='ask'&&f.type==='daily')update(()=>{
    f.mode='choice';f.help=true;
    f.micStatus='这里提供了选项，这次会记为得到帮助后的辨认。';
   });break;
 case 'learn':study();break;
 case 'unknown':recordResponse(null);break;
 case 'choose':
   if(el&&el.dataset.answer!==undefined)recordResponse(el.dataset.answer);break;
 case 'submit':
   if(f&&f.stage==='ask'){
    if(!String(f.draft||'').trim()){setMicStatus('先写下你的想法，或者直接选择“我不知道”。');break;}
    recordResponse(f.draft);
   }break;
 case 'study-after-learn':
   if(f&&f.stage==='learn')update(()=>{
    f.stage='ask';f.mode='choice';f.help=true;f.draft='';
    f.micStatus='先看过讲解，接下来是巩固练习。';
   },true);break;
 case 'retry-options':
   if(f&&f.stage==='feedback'&&f.type==='daily')update(()=>{
    expose('feedback-answer-visible');
    f.stage='ask';f.mode='choice';f.help=true;f.draft='';
    f.micStatus='这次换成选项来巩固，不记为独立主动提取。';
   },true);break;
 case 'next':if(f&&f.stage==='feedback')advance();break;
 case 'voice':voice();break;
 case 'pronounce':pronounce();break;
 case 'request-goal':
   if(window.confirm('重新确认当前约 500 词的学习目标？原型不会扩展词汇范围，原有演示记录保留。')){
    update(()=>{state.view='setup';},true);
   }break;
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
 state.session.transcriptPending=false;
 state.session.inputMode='typed';
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
  if(!window.confirm('切换模拟学习阶段会清除本地演示作答，并回到首页。继续吗？')){
   render();return;
  }
  update(()=>{
   state.scenario=choice;state.events=[];state.visits=0;state.session=null;
   state.view='home';
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
