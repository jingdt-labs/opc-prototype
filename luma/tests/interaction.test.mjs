import test from 'node:test';
import assert from 'node:assert/strict';

const storage=new Map(), handlers={};
const root={
  innerHTML:'',
  contains:()=>true,
  addEventListener:(name,fn)=>{handlers[name]=fn;},
  querySelector:(selector)=>selector==='.focus-next'?{focus:()=>{}}:
    selector==='#variant-submit'?{disabled:false}:null
};
const docHandlers=[];
globalThis.document={
  documentElement:{dataset:{}}, title:'',
  activeElement:{tagName:'BODY'},
  getElementById:()=>root,
  addEventListener:(name,fn)=>{if(name==='keydown')docHandlers.push(fn);}
};
const played=[];
class Utterance {constructor(text){this.text=text;}}
globalThis.window={
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  confirm:()=>true, scrollTo:()=>{},
  SpeechSynthesisUtterance:Utterance,
  speechSynthesis:{cancel:()=>{},speak:u=>{played.push(u.text);u.onstart?.();u.onend?.();}}
};
const {state} = await import('../js/state.js');
await import('../js/app.js');
const click=(action,extras={})=>{
  const control={dataset:{action,...extras},disabled:false};
  handlers.click({target:{closest:()=>control}});
};
const input=value=>handlers.input({target:{id:'variant-answer',value}});
const key=(k,target={tagName:'BODY'})=>{
  let prevented=false;
  for(const listener of docHandlers) listener({
    key:k,target,repeat:false,ctrlKey:false,metaKey:false,altKey:false,
    preventDefault:()=>{prevented=true;}
  });
  return prevented;
};

test('R1 student journey remains available and R2 gallery stays separate',()=>{
  assert.ok(root.innerHTML.includes('开始体验'));
  click('enter');click('confirm-goal');
  const goal=JSON.stringify(state.goal);
  assert.ok(root.innerHTML.includes('为英语精进'));
  click('start');
  assert.equal(state.screen,'focus');
  assert.ok(root.innerHTML.includes('可按 A–D 作答'));
  assert.ok(!root.innerHTML.includes('参考答案：因为'));
  key('B');assert.equal(state.session.phase,'feedback');
  click('pause');assert.equal(state.screen,'workspace');
  const snapshot=JSON.stringify({goal:state.goal,session:state.session,events:state.events});
  click('route',{screen:'lab'});
  assert.ok(root.innerHTML.includes('R2 · HUMAN REVIEW SPACE'));
  click('studio-start',{scenario:'retrieve'});
  assert.ok(root.innerHTML.includes('id="variant-answer"'));
  assert.ok(!root.innerHTML.includes('参考答案：因为'));
  input('因为');key('Enter',{id:'variant-answer',tagName:'INPUT'});
  assert.equal(state.previewEvents.at(-1).result,'independent-correct');
  click('studio-next');
  assert.equal(state.screen,'lab');
  assert.equal(JSON.stringify({goal:state.goal,session:state.session,events:state.events}),snapshot);
  assert.equal(JSON.stringify(state.goal),goal);
});

test('listen hides target before playback and actually invokes speech',()=>{
  click('studio-start',{scenario:'listen'});
  assert.ok(!root.innerHTML.includes('data-action="studio-answer"'));
  assert.ok(!root.innerHTML.includes('because'));
  click('studio-play');
  assert.equal(played.at(-1),'because');
  assert.ok(root.innerHTML.includes('data-action="studio-answer"'));
  key('b');
  assert.equal(state.previewEvents.at(-1).result,'independent-correct');
  assert.ok(root.innerHTML.includes('参考答案：因为'));
  click('studio-next');
});

test('spelling never intercepts A–D while typing; rich material reveals on feedback',()=>{
  click('studio-start',{scenario:'spell'});
  input('BORROW');
  assert.equal(key('A',{tagName:'INPUT',id:'variant-answer'}),false);
  key('Enter',{tagName:'INPUT',id:'variant-answer'});
  assert.equal(state.previewEvents.at(-1).result,'independent-correct');
  click('studio-next');
  click('studio-start',{scenario:'rich'});
  assert.ok(root.innerHTML.includes('I stayed home because I felt ill.'));
  assert.ok(!root.innerHTML.includes('延伸辨析 · 按需展开'));
  click('studio-answer',{answer:'身体不舒服'});
  assert.ok(root.innerHTML.includes('延伸辨析 · 按需展开'));
  assert.ok(root.innerHTML.includes('studio-after-audio'));
  handlers.change({target:{id:'theme',value:'dark'}});
  assert.equal(document.documentElement.dataset.theme,'dark');
  click('studio-pause');
  assert.equal(state.screen,'lab');
  assert.equal(state.previewSession.phase,'feedback');
});
