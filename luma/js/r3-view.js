// R3 student-facing views. No evidence internals or gallery navigation.
import { DEMOS, progressFor, goalMessage, taskFor, WORD_BY_ID, sessionSummary, suggestedAction, canDeclareGoal } from './r3-model.js';

const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(label,act,variant='quiet',attrs='')=>'<button type="button" class="r3-btn r3-'+variant+'" data-action="'+act+'" '+attrs+'>'+label+'</button>';
const brand='<span class="r3-brand"><span class="r3-brand-symbol">✦</span>Luma</span>';
const chip=(s)=>'<span class="r3-chip">'+s+'</span>';
const fixtureNote='<span class="r3-demo-tag">演示情境 · 模拟学习历史</span>';
function theme(s) {
  return '<label class="r3-theme-label">外观 <select aria-label="外观主题" data-field="theme">'+
    [['system','跟随系统'],['light','浅色'],['dark','深色']].map(([v,label])=>'<option value="'+v+'" '+(s.theme===v?'selected':'')+'>'+label+'</option>').join('')+'</select></label>';
}
function header(s,active='home') {
  return '<header class="r3-header"><div class="r3-header-inner">'+brand+
    '<nav aria-label="主要导航" class="r3-nav">'+
    '<button data-action="nav-home" class="'+(active==='home'?'is-active':'')+'">学习</button>'+
    '<button data-action="nav-progress" class="'+(active==='progress'?'is-active':'')+'">学习进展</button>'+
    '<button data-action="nav-goal" class="'+(active==='goal'?'is-active':'')+'">学习目标</button></nav>'+
    theme(s)+'</div></header>';
}
function shell(s,active,main) {
  return header(s,active)+'<main class="r3-container">'+main+'</main>';
}
function scenarioControls(s) {
  return '<details class="r3-scenario"><summary>原型体验情境设置</summary>'+
    '<p>这里是设计验收工具，不是学生日常功能。切换后会使用预设的 500 词汇总情境；本次作答不会自动成为整个词表的测评。</p>'+
    '<label for="r3-scenario">查看不同阶段</label><select id="r3-scenario" data-field="scenario">'+
    Object.entries(DEMOS).map(([id,v])=>'<option value="'+id+'" '+(s.scenario===id?'selected':'')+'>'+e(v.label)+'</option>').join('')+
    '</select>'+btn('重置本地演示','reset-demo','text')+'</details>';
}
function progressGraphic(s,compact=false) {
  const p=progressFor(s.scenario);
  const segments=[
    ['base','已有基础',p.base],
    ['gain','新增进步',p.gained],
    ['repair','需要巩固',p.strengthen],
    ['unknown','尚待了解',p.unknown]
  ];
  return '<div class="r3-progress '+(compact?'r3-progress-compact':'')+'">'+
    '<div class="r3-progress-heading"><div><span class="r3-eyebrow">整个学习目标</span><h2>向约 500 个高价值词汇的目标前进</h2></div>'+
    '<div class="r3-progress-score"><strong>'+p.reached+'</strong><span> / 500 已有足够证据</span></div></div>'+
    '<div class="r3-bar" role="img" aria-label="'+segments.map(x=>x[1]+' '+x[2]).join('，')+'">'+
    segments.map(([id,label,value])=>'<span class="r3-bar-'+id+'" title="'+label+' '+value+'" style="width:'+(value/5)+'%"></span>').join('')+
    '</div>'+
    '<div class="r3-legend">'+segments.map(([id,label,value])=>'<div class="r3-legend-item"><i class="r3-dot-'+id+'"></i><span>'+label+'</span><strong>'+value+'</strong></div>').join('')+'</div>'+
    '<p class="r3-muted r3-progress-foot">'+e(p.note)+' <strong>这是全范围模拟汇总，不是你的实测成绩。</strong></p>'+
    '</div>';
}
export function login(s) {
  return '<main class="r3-entry"><div class="r3-entry-content">'+brand+
    '<div class="r3-entry-card"><span class="r3-eyebrow">英语词汇学习</span>'+
    '<h1>从你现在会的地方开始</h1><p>先看看需要学什么。认识的词不必从头来，遇到不懂的可以先学会，再慢慢巩固。</p>'+
    btn('开始体验','enter','primary r3-wide')+
    '<p class="r3-small">无需账号 · 本地交互原型 · 学习内容与历史均为演示</p></div>'+
    '</div><div class="r3-entry-aside"><div class="r3-entry-quote">认识一个词，<br>再读懂一句话。</div>'+
    '<div class="r3-entry-example"><span>今天的一个小例子</span><strong>because</strong><p>I stayed home <b>because</b> I felt ill.</p><small>不懂？先看解释，然后再试一次。</small></div></div></main>';
}
export function setup(s) {
  return shell(s,'goal','<div class="r3-setup"><span class="r3-eyebrow">开始之前</span><h1>先确定这段时间学什么</h1>'+
    '<p class="r3-lead">先补常见的英语词汇，重点不是背完单词表，而是能看懂意思、逐渐读懂简单句。</p>'+
    '<div class="r3-panel r3-goal-summary"><div><span class="r3-overline">学习范围</span><strong>约 500 个高价值中考词汇</strong><p>这是首批已经确认的目标范围。</p></div>'+
    '<div><span class="r3-overline">希望做到</span><strong>看懂常见书面词义，并理解适当简单句</strong><p>通过独立表现、间隔后的复习和阶段测评逐步确认。</p></div></div>'+
    '<div class="r3-panel r3-setup-time"><div><h3>一般一次想学多久？</h3><p>只是建议时长，随时可以提前结束或继续。</p></div>'+
    '<label class="r3-screen-reader" for="r3-duration">每次学习时长</label><select id="r3-duration" data-field="duration">'+
    [20,30,40,60].map(n=>'<option value="'+n+'" '+(s.duration===n?'selected':'')+'>'+n+' 分钟</option>').join('')+'</select></div>'+
    '<div class="r3-actions">'+btn('确认目标，开始学习','confirm-goal','primary')+'</div>'+
    '<p class="r3-muted">不需要先做完 500 个词的测试。学习过程中会逐步了解你原本会什么。</p></div>');
}
export function home(s) {
  const p=progressFor(s.scenario),msg=goalMessage(s.scenario);
  const running=s.session&&!s.session.finished;
  const assessmentReady=s.scenario!=='start'||s.visits>0;
  const title=running?(s.session.type==='assessment'?'上次测评暂停了，继续就好':'上次学到一半，继续就好'):s.visits>0?'接着上次的进展继续':'先从几个常见词开始';
  return shell(s,'home',
    '<section class="r3-home-top">'+fixtureNote+'<div class="r3-home-grid">'+
    '<div class="r3-hero r3-panel"><span class="r3-eyebrow">现在适合做的事</span>'+
    '<h1>'+title+'</h1>'+
    '<p>'+ (running?'你的上次学习进度已经保留，可以接着做。':s.scenario==='achieved'?'当前阶段已模拟达成。可以选择保持复习，不会自动扩大目标。':'Luma 会把认识的词、需要帮助的词和简单句理解串在一起。无需自己安排词表。')+'</p>'+
    '<div class="r3-actions">'+btn(running?(s.session.type==='assessment'?'继续上次测评':'继续上次学习'):s.scenario==='achieved'?'做一次保持复习':'开始本次学习',running?'resume':'start-daily','primary')+
    (running?btn('结束这次学习','end-session','outline'):'')+'</div>'+
    '<span class="r3-hero-sub">建议 '+s.duration+' 分钟 · 随时可暂停或提前结束</span></div>'+
    '<div class="r3-hero-side">'+progressGraphic(s,true)+
    '<div class="r3-inline-link">'+btn('看详细进展','nav-progress','text')+'</div></div></div></section>'+
    '<section class="r3-home-bottom"><div class="r3-section-heading"><div><span class="r3-eyebrow">接下来</span><h2>值得关注的学习重点</h2></div></div>'+
    '<div class="r3-next-grid"><div class="r3-panel r3-next"><span class="r3-next-icon">↗</span><h3>学习与巩固自然接续</h3><p>'+e(s.visits?suggestedAction(s.events):s.scenario==='start'?'先用少量词了解起点；不认识时会先教你。':'先巩固不稳定的内容，再逐步了解未观察的词。')+'</p>'+
    btn('去学习','start-daily','text')+'</div>'+
    '<div class="r3-panel r3-next"><span class="r3-next-icon">◎</span><h3>'+ (canDeclareGoal(p)?'回顾本阶段的成果':assessmentReady?'适合做一次独立检查':'阶段检测会在适当时候出现')+'</h3>'+
    '<p>'+ (canDeclareGoal(p)?'了解为什么现在可以认为目标已达成，以及如何继续保持。':assessmentReady?'用几道独立样题校准学习判断，发现需要巩固的地方。':'先在日常学习里积累一些观察，不必急着参加测评。')+'</p>'+
    btn(canDeclareGoal(p)?'查看达成说明':assessmentReady?'开始阶段测评':'了解阶段测评',canDeclareGoal(p)?'goal-review':assessmentReady?'open-assessment':'assessment-info','text')+'</div></div></section>'+
    '<div class="r3-goal-small"><div><strong>当前目标</strong><span>约 500 个高价值词汇 · 看懂书面词义和适当简单句</span></div>'+btn('查看目标','nav-goal','text')+'</div>'+
    scenarioControls(s));
}
export function progress(s) {
 const p=progressFor(s.scenario),m=goalMessage(s.scenario);
 return shell(s,'progress','<div class="r3-page-title"><span class="r3-eyebrow">学习进展</span><h1>比刚开始时，真正前进了多少？</h1>'+
   '<p>区分原本就会的、学习后取得的新进步，还有需要继续巩固和暂时不能判断的部分。</p></div>'+
   '<div class="r3-panel r3-progress-main">'+progressGraphic(s)+'</div>'+
   '<div class="r3-two-cards"><div class="r3-panel"><span class="r3-overline">与你的起点相比</span><h2>新增进步：'+p.gained+' 个学习重点</h2>'+
   '<p>模拟情境中，这些内容具有与原先表现可比较、并经过适当间隔与简单句观察支持的进展。<b>起点已会的 '+p.base+' 个没有计入新增。</b></p></div>'+
   '<div class="r3-panel"><span class="r3-overline">接下来怎么学</span><h2>'+m.title+'</h2><p>'+m.next+'</p></div></div>'+
   '<div class="r3-page-actions">'+btn('继续学习','start-daily','primary')+' '+btn('查看目标判断','goal-review','outline')+'</div>'+
   scenarioControls(s));
}
export function goal(s) {
 const p=progressFor(s.scenario), m=goalMessage(s.scenario);
 return shell(s,'goal','<div class="r3-page-title"><span class="r3-eyebrow">学习目标</span><h1>这段时间，我们想做到什么</h1>'+
   '<p>范围和希望达到的表现都清楚，日常学习怎么安排，由 Luma 帮你处理。</p></div>'+
   '<div class="r3-panel r3-goal-full"><div><span class="r3-overline">范围</span><h2>约 500 个高价值中考词汇</h2><p>不是整个中考词汇范围，也不是每个词所有义项。</p></div>'+
   '<div><span class="r3-overline">目标表现</span><h2>看懂常见书面词义与适当难度的简单句</h2><p>通过不依赖答案的表现、跨时间保持和阶段测评判断进展。</p></div>'+
   '<div><span class="r3-overline">现在的状态</span><h2>'+m.title+'</h2><p>'+m.detail+'</p></div></div>'+
   '<div class="r3-panel r3-preferences"><div><h3>一次学习多久</h3><p>可以随时结束，不必为了凑时长完成更多题目。</p></div>'+
   '<select data-field="duration" aria-label="调整建议学习时长">'+[20,30,40,60].map(n=>'<option value="'+n+'" '+(s.duration===n?'selected':'')+'>'+n+' 分钟</option>').join('')+'</select></div>'+
   '<p class="r3-muted">需要变更目标范围或目标表现时，应先确认。演示原型不会擅自将 500 词扩大为完整中考词表。</p>'+
   '<div class="r3-page-actions">'+btn('重新确认目标','request-goal','outline')+' '+btn('返回学习','nav-home','primary')+'</div>'+scenarioControls(s));
}
function options(task) {
 return '<div class="r3-options" role="group" aria-label="可选择的答案">'+task.choices.map((choice,i)=>
   '<button class="r3-option" data-action="choose" data-answer="'+e(choice)+'"><span>'+String.fromCharCode(65+i)+'</span>'+e(choice)+'</button>').join('')+'</div>';
}
function learnCard(s,task) {
 const w=task.word;
 const guide=w.guide;
 return '<div class="r3-study"><div class="r3-study-top"><span class="r3-eyebrow">先理解，再试一试</span>'+
   '<h1>'+e(w.text)+'</h1><p class="r3-study-pos">'+e(w.pos)+'</p></div>'+
   '<div class="r3-meaning"><span>这次先记住</span><strong>'+e(w.sense)+'</strong><p>'+e(w.note)+'</p></div>'+
   '<div class="r3-sentence-box"><span>放在句子里</span><div class="r3-sentence">'+e(w.sentence)+'</div>'+
   '<p>'+e(w.guide?.translation||w.sentenceMeaning)+'</p>'+
   '<div class="r3-sentence-actions">'+btn('听英文示范','pronounce','text')+'</div></div>'+
   '<div class="r3-tip"><strong>再理解一点</strong><p>'+e(w.contrast||'先抓住当前词义，其他用法可以以后再补。')+'</p></div>'+
   (guide&&guide.sections?.length?'<details class="r3-extra"><summary>想了解更多例子和区别</summary>'+
     guide.sections.slice(0,2).map(sec=>'<div><b>'+e(sec.title)+'</b><p>'+sec.lines.map(line=>e(line.join('：'))).join('；')+'</p></div>').join('')+'</details>':'')+
   '<div class="r3-study-footer"><p>刚看过解释后的正确，只算当次巩固；以后还会在合适时机独立复检。</p>'+
   btn('明白了，练一练','study-after-learn','primary')+'</div></div>';
}
function questionCard(s,task) {
 const f=s.session, assessment=f.type==='assessment', isMeaning=task.type==='meaning';
 const title=isMeaning?'这个词，你知道是什么意思吗？':'读一读，选出最符合句意的理解';
 let input='';
 if(f.mode==='recall') input='<div class="r3-input-row"><label class="r3-input-label" for="r3-answer">用中文表达它的意思</label>'+
   '<div class="r3-answer-wrap"><input id="r3-answer" type="text" maxlength="80" autocomplete="off" placeholder="想到什么就写什么…" value="'+e(f.draft)+'" />'+btn('语音回答','voice','outline')+'</div>'+
   '<p class="r3-muted">可以用中文说或写，不是在考英语发音。</p></div>';
 else input=options(task);
 return '<div class="r3-question"><span class="r3-eyebrow">'+(assessment?'独立检查':isMeaning?'认识词义':'理解简单句')+'</span>'+
    '<h2>'+title+'</h2>'+
    '<div class="r3-stimulus '+(isMeaning?'r3-word':'r3-context')+'">'+e(task.stimulus)+'</div>'+
    (isMeaning?'<div class="r3-pronounce">'+btn('听单词读音','pronounce','text')+'</div>':'')+
    input+
    (f.micStatus?'<p class="r3-status" role="status">'+e(f.micStatus)+'</p>':'')+
    (f.transcriptPending?'<p class="r3-status">请核对上面的识别文字，确认无误后再提交；识别出错不会直接判你不会。</p>':'')+
    '<div class="r3-question-actions">'+
    (f.mode==='recall'?btn('提交回答','submit','primary'):'')+
    btn('我不知道','unknown','quiet')+
    (!assessment?(f.mode==='recall'?btn('看看选项','show-options','outline'):'')+btn('先看解释','learn','text'):'')+
    '</div>'+
    (!assessment&&task.type==='context'?'<p class="r3-muted">读句子有困难时可以看解释。系统不会直接把不熟悉的其他词算成目标词的错误。</p>':'')+
    '</div>';
}
function feedbackCard(s,task) {
 const ev=s.session.lastAttempt||{},good=ev.result==='independent-correct';
 const supported=ev.result==='supported-correct';
 const uncertain=ev.result==='unverified';
 const heading=good?'这次你独立完成了':supported?'得到帮助后完成了':uncertain?'这次回答暂时不能确定':'我们已经看到还要练的地方';
 const detail=good?'这次表现值得保留，但还需要适当间隔和新句子来确认是否稳定。':
   supported?'在解释、选项或已见答案的帮助下完成了当前练习；它不会冒充此前就会。':
   uncertain?'开放回答可能有不同的合理表达。演示规则不能可靠评价时，不会把它直接判成不会。':
   '这次尝试还没有独立完成。先理解正确联系，后面会安排适合的巩固。';
 return '<div class="r3-feedback"><span class="r3-feedback-symbol">'+(good?'✓':supported?'◌':uncertain?'?':'↗')+'</span>'+
   '<h1>'+heading+'</h1><p>'+detail+'</p>'+
   '<div class="r3-feedback-content"><span>这次学习重点</span><strong>'+e(task.word.text)+' · '+e(task.word.sense)+'</strong>'+
   '<p>'+e(task.word.note)+'</p>'+(task.type==='context'?'<p>'+e(task.sentence||task.stimulus)+'</p>':'')+'</div>'+
   '<div class="r3-actions">'+btn('继续下一项','next','primary')+
   (uncertain?btn('换成选项练习','retry-options','outline'):'')+
   btn('再看一遍解释','learn','text')+'</div></div>';
}
export function focus(s) {
 const f=s.session;
 if(!f)return home(s);
 const item=f.items[f.idx],task=taskFor(item.wordId,item.type,f.type==='assessment');
 const assessment=f.type==='assessment';
 const title=assessment?'阶段性独立测评':'专注学习';
 const body=f.stage==='learn'?learnCard(s,task):f.stage==='feedback'?feedbackCard(s,task):questionCard(s,task);
 return '<div class="r3-focus"><header class="r3-focus-header">'+brand+
   '<div><strong>'+title+'</strong><span>第 '+(f.idx+1)+' 项 / '+f.items.length+' 项 · 可随时暂停</span></div>'+
   btn(assessment?'退出测评':'暂停并返回','pause','outline')+'</header>'+
   '<main class="r3-focus-body"><div class="r3-focus-card">'+body+'</div></main>'+
   '<footer class="r3-focus-footer"><div class="r3-step-bar" aria-hidden="true"><span style="width:'+Math.round(f.idx/f.items.length*100)+'%"></span></div>'+
   '<span>'+ (assessment?'测评结果只用于模拟校准，不等于整体 500 词已被测完':'先理解，再尝试；没有时间或题量压力')+'</span>'+
   (assessment?'':btn('提前结束本次学习','end-session','text'))+'</footer></div>';
}
export function endPage(s) {
 const events=s.events.filter(x=>x.sessionId===s.session?.id);
 const sum=sessionSummary(events);
 const independent=events.filter(x=>x.kind==='attempt'&&x.result==='independent-correct').map(x=>WORD_BY_ID[x.wordId]?.text).filter(Boolean);
 const learned=events.filter(x=>x.kind==='exposure').map(x=>WORD_BY_ID[x.wordId]?.text).filter(Boolean);
 const pending=events.filter(x=>x.kind==='attempt'&&['unknown','incorrect','unverified'].includes(x.result)).map(x=>WORD_BY_ID[x.wordId]?.text).filter(Boolean);
 return shell(s,'home','<section class="r3-result"><span class="r3-eyebrow">这次学习结束了</span><h1>今天的进展，已经保留</h1>'+
   '<p class="r3-lead">认识的词不必反复重学；刚看过讲解的词，下次还会找适合的时机再试。</p>'+
   '<div class="r3-result-list"><div class="r3-panel"><h3>本次独立完成</h3><p>'+e(independent.length?[...new Set(independent)].join('、'):'暂时没有新的独立完成观察')+'</p><small>当次正确不等于长期稳定</small></div>'+
   '<div class="r3-panel"><h3>新建立或巩固的联系</h3><p>'+e(learned.length?[...new Set(learned)].join('、'):'本次主要在自主辨认')+'</p><small>刚学会还需要后续复检</small></div>'+
   '<div class="r3-panel"><h3>下次值得留意</h3><p>'+e(pending.length?[...new Set(pending)].join('、'):'可以继续了解新的学习重点')+'</p><small>有困难不等于你学不会</small></div></div>'+
   '<div class="r3-actions">'+btn('返回学习首页','return-home','primary')+btn('查看整体进展','nav-progress','outline')+'</div>'+
   '<p class="r3-muted">本次浏览器交互已保存在本机。上方 500 词目标汇总仍属于预设模拟情境，并非由这些样题推算。</p></section>');
}
export function assessmentIntro(s) {
 return shell(s,'home','<section class="r3-assessment-intro"><span class="r3-eyebrow">阶段性独立测评</span><h1>看看已经学过的内容，哪些更稳了</h1>'+
   '<p class="r3-lead">这次用几道新的代表性题目独立检查书面词义和简单句理解。期间不展示答案和提示；不会的可以选“不知道”。</p>'+
   '<div class="r3-panel r3-assess-explain"><div><strong>我们要观察</strong><p>是否能独立认出词义，以及在稍有变化的简单句中读懂意思。</p></div>'+
   '<div><strong>测评之后</strong><p>结果会帮助调整下一次学习，不能代替完整约 500 个词汇的总体判断。</p></div></div>'+
   '<div class="r3-actions">'+btn('开始独立检查','start-assessment','primary')+btn('先继续学习','return-home','outline')+'</div></section>');
}
export function assessmentResult(s) {
 const events=s.events.filter(x=>x.sessionId===s.session?.id&&x.kind==='attempt');
 const done=events.filter(x=>x.result==='independent-correct');
 const uncertain=events.filter(x=>x.result!=='independent-correct');
 const weakWords=[...new Set(uncertain.map(x=>WORD_BY_ID[x.wordId]?.text).filter(Boolean))];
 return shell(s,'home','<section class="r3-result"><span class="r3-eyebrow">阶段测评已结束</span><h1>这次独立检查说明了什么</h1>'+
   '<p class="r3-lead">不做高压分数排名。这里是几道代表性样题的表现回顾；全范围目标仍需更多可信证据。</p>'+
   '<div class="r3-result-list r3-result-list-two"><div class="r3-panel"><h3>在这些新材料中独立完成</h3><strong class="r3-large">'+done.length+' / '+events.length+'</strong><p>只说明这次抽样条件下的独立表现。</p></div>'+
   '<div class="r3-panel"><h3>接下来优先关注</h3><p>'+e(weakWords.length?weakWords.join('、'):'保持已取得的表现，继续了解目标范围中缺少证据的部分')+'</p>'+
   '<small>不把单次错误当成永久标签</small></div></div>'+
   '<p class="r3-follow">后续学习建议：'+e(suggestedAction(s.events))+'</p>'+
   '<div class="r3-actions">'+btn('回到学习首页','return-home','primary')+btn('查看整体进展','nav-progress','outline')+'</div>'+
   '<p class="r3-muted">测评的本地作答记录会保留；预设全范围模拟数据不会被少量样题自动改写。</p></section>');
}
export function goalReview(s) {
 const p=progressFor(s.scenario),m=goalMessage(s.scenario),achieved=canDeclareGoal(p);
 return shell(s,'progress','<section class="r3-goal-review"><span class="r3-eyebrow">目标达成回顾 · 演示情境</span>'+
   '<div class="r3-review-mark">'+(achieved?'✓':'↗')+'</div><h1>'+m.title+'</h1><p class="r3-lead">'+m.detail+'</p>'+
   '<div class="r3-panel r3-review-details">'+progressGraphic(s,true)+
   '<div class="r3-divider"></div><h3>'+ (achieved?'为什么这次可以确认达成':'为什么现在还不能宣布达成')+'</h3>'+
   '<p>'+ (achieved?'模拟情境假设：完整目标范围已有充分覆盖；词义辨认、适当新句理解、跨时间复检和阶段独立测评共同支持整体结论。允许个别偶发波动，但没有未解决的重大证据缺口。':
       '仍有需要巩固或尚无足够证据的内容。已掌握和新增进步不会因此抹除；未观察也不被解释为不会。')+'</p>'+
   '<p class="r3-muted">这只针对约 500 词的指定书面词义与简单句目标，不表示英语全部能力达标，也不保证永久记得。</p></div>'+
   '<div class="r3-actions">'+btn(achieved?'安排保持复习':'继续解决下一步','start-daily','primary')+
   btn('返回整体进展','nav-progress','outline')+'</div>'+
   (achieved?'<p class="r3-muted">如需开始新的学习范围，请先确认新的目标；系统不会自动扩大当前范围。</p>':'')+
   '</section>'+scenarioControls(s));
}
export function renderPage(s) {
 if(!s.entered)return login(s);
 if(!s.confirmed||s.view==='setup')return setup(s);
 switch(s.view) {
 case 'progress':return progress(s);
 case 'goal':return goal(s);
 case 'focus':return focus(s);
 case 'session-end':return endPage(s);
 case 'assessment-intro':return assessmentIntro(s);
 case 'assessment-result':return assessmentResult(s);
 case 'goal-review':return goalReview(s);
 default:return home(s);
 }
}
