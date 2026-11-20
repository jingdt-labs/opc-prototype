/* Relo R1 — Learning Experience Foundation
 * Deliberately small, dependency-free, in-memory interactive prototype.
 * All accounts, objectives, adaptive decisions and Evidence are simulations.
 */
(() => {
  'use strict';
  const $ = document.getElementById('app');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const seed = Object.freeze({
    title: '看懂常用连接词表达的原因与先后',
    outcome: '在简单的新句子中，能不看提示识别 because、before、after，并说清基本原因或时间先后。',
    focus: 'because、before、after 的常用词义与简单句意义',
    evidence: '用未提前展示答案的短句观察首次回答；把提示、答案揭示与换句作答分开记录。',
    review: '约一周后结合新句与复习表现回顾'
  });
  const words = [
    {word:'before', phonetic:'/bɪˈfɔːr/', meaning:'在……之前', example:'I wash my hands before dinner.', lead:'晚饭之前，我先洗手。', explain:'before 连接两个时间点，让我们知道哪件事先发生。'},
    {word:'after', phonetic:'/ˈæftər/', meaning:'在……之后', example:'I read a book after dinner.', lead:'晚饭之后，我读书。', explain:'after 让我们知道一件事发生在另一件事之后。'},
    {word:'because', phonetic:'/bɪˈkɔːz/', meaning:'因为', example:'I stayed home because it rained.', lead:'因为下雨，我待在家里。', explain:'because 常用来连接一件事和它的原因。'}
  ];
  const bank = {
    'before-check': {id:'before-check',type:'choice',focus:'before',sentence:'She washes her hands before breakfast.',instruction:'这句话里，哪件事先发生？',options:['先洗手','先吃早餐','同时发生'],right:0,hint:'before 表示“在……之前”。想想 breakfast 是早餐。',answer:'先洗手',explain:'洗手发生在吃早餐之前；before 表示先后关系。'},
    'cause-one': {id:'cause-one',type:'choice', focus:'because', sentence:'I took an umbrella because it was raining.', instruction:'我为什么带了伞？', options:['因为正在下雨','因为我想散步','因为天气晴朗'], right:0, hint:'先找到 because。它后面的内容告诉我们原因。', answer:'因为正在下雨', explain:'because it was raining 解释了带伞的原因。'},
    'cause-one-alt': {id:'cause-one-alt',type:'choice', focus:'because', sentence:'I closed the window because it was windy.', instruction:'我为什么关窗？', options:['因为房间很热','因为外面风很大','因为我要出门'], right:1, hint:'because 后面给出了关窗的原因。windy 意为“有风的”。', answer:'因为外面风很大', explain:'because it was windy 说明关窗的原因。'},
    'cause-followup': {id:'cause-followup',type:'choice',focus:'because',sentence:'She smiled because she was happy.',instruction:'她为什么笑了？',options:['因为她饿了','因为她很开心','因为她迟到了'],right:1,hint:'because 后面是原因。happy 是“开心的”。',answer:'因为她很开心',explain:'she was happy 是让她微笑的原因。'},
    'cause-followup-alt': {id:'cause-followup-alt',type:'choice',focus:'because',sentence:'He sat down because he was tired.',instruction:'他为什么坐下？',options:['因为他累了','因为他迟到了','因为他很高'],right:0,hint:'tired 是“累的”；留意 because 后面的原因。',answer:'因为他累了',explain:'he was tired 说明他坐下的原因。'},
    'before-fill': {id:'before-fill',type:'fill',focus:'before',sentence:'I brush my teeth ___ I go to bed.',instruction:'睡觉前刷牙。请填入合适的英文连接词。',right:'before',hint:'先刷牙，后睡觉。哪个词表示“在……之前”？',answer:'before',explain:'before I go to bed 表示“在我睡觉之前”。'},
    'before-fill-alt': {id:'before-fill-alt',type:'fill',focus:'before',sentence:'She eats breakfast ___ school.',instruction:'她上学前吃早餐。请填入合适的英文连接词。',right:'before',hint:'吃早餐发生在上学之前，试着回忆表示“之前”的词。',answer:'before',explain:'before school 表示“上学之前”。'},
    'series-one': {id:'series-one',type:'choice',focus:'because',sentence:'We stayed inside because it was cold.',instruction:'这句话说我们为什么待在室内？',options:['因为外面很冷','因为想买东西','因为要去学校'],right:0,hint:'because 后面的 it was cold 解释原因。cold 是“冷的”。',answer:'因为外面很冷',explain:'it was cold 是待在室内的原因。'},
    'series-one-alt': {id:'series-one-alt',type:'choice',focus:'because',sentence:'He stayed home because he felt sick.',instruction:'他为什么待在家里？',options:['因为他很开心','因为他身体不舒服','因为天气很好'],right:1,hint:'felt sick 表示“感觉不舒服”。留意 because 的后半句。',answer:'因为他身体不舒服',explain:'he felt sick 说明他待在家里的原因。'},
    'series-stretch': {id:'series-stretch',type:'choice',focus:'because',sentence:'Because it was late, we went home.',instruction:'哪一部分说明了我们回家的原因？',options:['we went home','it was late','went home'],right:1,hint:'这次 because 放在句首，原因仍然紧跟着它。',answer:'it was late',explain:'because 可以放在句首；it was late 是原因，we went home 是结果。'},
    'series-easy': {id:'series-easy',type:'choice',focus:'because',sentence:'He drank water because he was thirsty.',instruction:'他为什么喝水？',options:['因为他很渴','因为他很困','因为他很忙'],right:0,hint:'thirsty 是“口渴的”。because 后面是原因。',answer:'因为他很渴',explain:'he was thirsty 解释了喝水的原因。'}
  };

  function initialState(){ return {
    view:'gateway', choosingRole:null, error:'', objective:null, draft:{...seed, title:'',outcome:'',focus:'',evidence:'',review:''}, pref:20,
    editGoal:false, sessionNo:0, sessionActive:false, task:0, word:0, wordOpened:false, wordPath:null, wordHiddenAgain:false, explainShown:false, sentenceTesting:false, audioNotice:null,
    question:null, t3Variant:false, t5Step:0, evidence:[], transition:'', modal:null,
    teacherNote:'', lastSessionEnd:'natural'
  }; }
  let s=initialState();
  function record(type, extra={}){
    s.evidence.push({type, session:s.sessionNo, task:s.task, at:new Date().toISOString(), ...extra});
  }
  const action = (name, text, cl='btn btn-primary', extra='') => `<button type="button" class="${cl}" data-action="${esc(name)}" ${extra}>${text}</button>`;
  const button = (name, text, cl='btn btn-primary', extra='') => action(name, text, cl, extra);
  function mainShell(content, opts={}){
    const role=s.view==='teacher'?'教学端':(s.view==='student'||s.view==='summary'||s.view==='no-objective'?'学生端':'');
    return `<div class="shell"><header class="topbar"><div class="brand" aria-label="Relo"><span class="brand-logo">r</span><span class="brand-text">relo<span class="brand-extra">Recall · Review · Loop</span></span></div><nav class="top-actions" aria-label="顶部操作">${role?`<span class="role-chip">${role}</span>`:''}${role?button('logout','退出登录','link-button'):''}${button('reset','重置演示','link-button')}</nav></header>${content}</div><div class="demo-ribbon">R1 交互原型 · 全部数据仅为当前页面模拟 · 刷新会重置</div>${s.modal?renderModal():''}`;
  }
  function gateway(){ return mainShell(`<main class="gateway">
    <section class="gateway-content"><span class="eyebrow">A quieter way to learn English</span><h1>学过的，<br><span>慢慢变成会的。</span></h1><p>记住一个词，读懂一句话，再换个情境试一试。每次学习不必很多，但每一步都应该真实。</p><span class="quiet-signature">RECALL &nbsp;·&nbsp; REVIEW &nbsp;·&nbsp; LOOP</span></section>
    <section class="gateway-panel"><span class="eyebrow">从这里开始</span><h2>今天，从哪一端进入？</h2><p>学习与教学各有自己的入口。</p>
      <button class="entry-card" data-action="pick-role" data-value="student"><span><span class="entry-name">学生入口</span><span class="entry-desc" style="display:block">开始一段由系统引导的英语学习</span></span><span class="entry-arrow" aria-hidden="true">↗</span></button>
      <button class="entry-card" data-action="pick-role" data-value="teacher"><span><span class="entry-name">教学入口</span><span class="entry-desc" style="display:block">确认阶段目标，陪伴学习方向</span></span><span class="entry-arrow" aria-hidden="true">↗</span></button>
      <div class="muted-line" style="padding:12px 3px 0">演示账户已准备好，无需注册。</div></section>
  </main>`); }
  function loginView(){ const teacher=s.choosingRole==='teacher', account=teacher?'teacher':'student', pin=teacher?'2468':'1234';
    return mainShell(`<main class="login-layout"><button class="back-link" data-action="back-gateway">← 返回入口</button><section class="login-box"><span class="eyebrow">${teacher?'TEACHING ACCESS':'LEARNER ACCESS'}</span><h1>${teacher?'进入教学端':'进入学习端'}</h1><p>${teacher?'从确认学习目标开始，让接下来的学习有方向。':'不用选择课程，进入后就从合适的内容开始。'}</p>
      <form id="login-form"><div class="field"><label for="account">演示账号</label><input id="account" name="account" type="text" value="${account}" autocomplete="off" required></div><div class="field"><label for="pin">演示密码</label><input id="pin" name="pin" type="password" value="${pin}" autocomplete="off" required></div>${s.error?`<div class="alert" role="alert">${esc(s.error)}</div>`:''}<button class="btn btn-primary btn-wide" type="submit">${teacher?'进入教学端':'进入学习' } <span aria-hidden="true">↗</span></button></form>
      <div class="note" style="margin-top:23px">仅演示身份区分：账号 <b>${account}</b> ／密码 <b>${pin}</b>。这里不是真实认证系统。</div></section></main>`); }
  function field(name,label,placeholder,rows=0){ const v=esc(s.draft[name]); return `<div class="field"><label for="goal-${name}">${label}</label>${rows?`<textarea id="goal-${name}" data-goal-field="${name}" placeholder="${esc(placeholder)}" rows="${rows}">${v}</textarea>`:`<input id="goal-${name}" data-goal-field="${name}" value="${v}" placeholder="${esc(placeholder)}">`}</div>`; }
  function timePicker(){return `<div class="field"><label>单轮学习参考时长</label><div class="segmented" aria-label="参考时长">${[15,20,30].map(n=>`<button type="button" class="${s.pref===n?'active':''}" data-action="pref" data-value="${n}" aria-pressed="${s.pref===n}">${n} 分钟</button>`).join('')}</div><div class="help-text">这是参考节奏，可以提前结束，不会倒计时。</div></div>`;}
  function teacherView(){const edit=!s.objective||s.editGoal;return mainShell(`<main><div class="teacher-head"><div><span class="eyebrow">TEACHING SPACE</span><h1>${edit?'先确定一个够具体的学习方向':'当前的学习方向'}</h1><p>${edit?'不需要先有系统内记录，也不必预先安排每道题。':'已确认的目标才会引导学生下一段学习。'}</p></div></div>
    <div class="teacher-grid"><section class="panel">${edit?`<span class="eyebrow">STAGE OBJECTIVE · ${s.objective?'REVISION':'BOOTSTRAP'}</span><h2>${s.objective?'调整阶段目标':'拟定阶段目标'}</h2><p class="panel-intro">你可以自己写，也可以采用右侧的模拟 AI 建议，再做最后确认。</p>
      ${field('title','学习端显示的简短目标','例如：看懂简单句中的原因与先后')}${field('outcome','希望观察到的表现','例如：看到新句子时能够不看提示说清关系',3)}${field('focus','近期重点','例如：because、before、after')}${field('evidence','用什么来判断','例如：新句中的首次无提示回答与求助情况',3)}${field('review','准备何时回顾','例如：约一周后')}${timePicker()}
      ${s.error?`<div class="alert" role="alert">${esc(s.error)}</div>`:''}
      <div class="form-foot"><p>只有点击「确认并生效」，目标才会用于学生学习。</p><div style="display:flex;gap:9px;flex-wrap:wrap">${s.objective?button('cancel-edit','取消修改','btn btn-outline'):''}${button('confirm-goal','确认并生效')}</div></div>`:
      `<span class="status-tag">当前生效</span><h2 class="objective-title">${esc(s.objective.title)}</h2><dl class="objective-meta"><dt>希望观察到</dt><dd>${esc(s.objective.outcome)}</dd><dt>近期重点</dt><dd>${esc(s.objective.focus)}</dd><dt>判断依据</dt><dd>${esc(s.objective.evidence)}</dd><dt>回顾时点</dt><dd>${esc(s.objective.review)}</dd><dt>学习节奏</dt><dd>单轮约 ${s.pref} 分钟（可自由结束）</dd></dl><div class="teacher-next">${button('go-student','切换至学生登录 <span aria-hidden="true">↗</span>')}${button('edit-goal','调整目标','btn btn-outline')}</div>`}
    </section><aside class="panel panel-side">${edit?`<span class="eyebrow">OPTIONAL AI SUGGESTION</span><h3>一个可编辑的起点</h3><div class="suggestion-preview">先把常见连接词用稳，再看它们在新句子里表达的关系。</div><div class="suggestion-context">此建议依据产品提供的演示学习场景，不来自 Relo 内部学习记录；没有调用真实 AI。</div>${button('use-suggestion','采用模拟建议','btn btn-secondary btn-wide')}`:
      `<span class="eyebrow">LEARNING EVIDENCE</span><h3>学习表现，将从这里回顾</h3><p>本轮只建立目标确认的教学入口。详细证据核对与 AI 阶段分析留在 R3。</p><div class="note">${s.evidence.length?`当前页面包含 ${s.evidence.filter(e=>e.type==='attempt').length} 条模拟作答反应。它们未保存，不代表真实学习证据。`:'目前没有 Relo 内部真实学习证据；不预设孩子已经掌握。'}</div>`}</aside></div></main>`);}
  function noObjective(){return mainShell(`<main class="empty-wrap"><div class="empty-icon">✦</div><span class="eyebrow">还差一步</span><h1>学习方向还没有确认</h1><p>这次先不安排题目。请教学端使用者确认一个近期学习目标，然后你再登录学生端，就能直接开始学习。</p><div class="bottom-actions">${button('logout','返回入口','btn btn-primary')}</div><div class="muted-line" style="margin-top:18px">学生端无法自行确认教学目标。</div></main>`);}
  function sessionHeader(){return `<header class="student-header"><span class="eyebrow">最近的目标</span><h1>${esc(s.objective.title)}</h1><div class="session-context"><span>这一轮参考约 ${s.pref} 分钟</span><span class="bullet"></span><span>按自己的节奏来，随时可以结束</span></div></header>`;}
  function skipLabel(){return s.task===0?'跳过这个词 →':s.task===1?'跳过这段学习 →':'跳过当前练习 →';}
  function aside(){return `<aside class="side-rail"><div class="side-rule"></div><span class="eyebrow">TAKE YOUR TIME</span><h3>不确定，也没关系。</h3><p>你可以先想一想，也可以要一点提示。看过解释后再试，是学习的一部分。</p><div class="side-actions">${button('skip',skipLabel(),'link-button')}${button('ask-end','结束本轮','link-button')}</div><div class="side-foot">这里不会显示分数、排名或固定待完成题数。</div></aside>`;}
  function taskFrame(inner, pill, subtitle=''){return `<article class="study-card"><div class="study-inner"><div class="study-topline"><span class="study-pill">${pill}</span><span class="study-sub">${subtitle}</span></div>${s.transition?`<div class="adaptive-note" role="status">${esc(s.transition)}</div>`:''}${inner}</div></article>`;}
  // Pronunciation is deliberately *only* a request simulation in R1: no audio is heard,
  // so clicking it must NOT be recorded as actual listening or pronunciation support.
  function speakButton(scope, label){return button('pronounce',`<span aria-hidden="true">◖))</span> ${label}`,'speak-button',`data-value="${esc(scope)}"`);}
  function audioFeedback(scope){return s.audioNotice?.scope===scope?`<div class="audio-feedback" role="status" aria-live="polite">${esc(s.audioNotice.text)}</div>`:'';}
  function wordView(){
    const w=words[s.word];
    const cue=({before:'提示：想想两件事中“先发生”的那一件。',after:'提示：想想两件事中“后发生”的那一件。',because:'提示：它用来回答“为什么”。'})[w.word];
    const choice=!s.wordPath?`<div class="word-self-check"><p class="word-choice-title">看到这个词，你现在的感觉是？</p><div class="word-choice-row">${button('word-known','认识，能想起词义','btn btn-outline word-choice')}${button('word-fuzzy','有点印象','btn btn-outline word-choice')}${button('word-new','还不认识','btn btn-outline word-choice')}</div><button class="word-direct" data-action="show-word">想直接学习？查看词义与解释 →</button></div>`:'';
    const route=!s.wordOpened&&s.wordPath?`<div class="word-recall-stage"><span class="eyebrow">${s.wordHiddenAgain?'再试一次回忆':s.wordPath==='known'?'先在心里回忆':s.wordPath==='fuzzy'?'先借一点线索':'自己想一想'}</span><p>${s.wordPath==='fuzzy'&&!s.wordHiddenAgain?esc(cue):s.wordHiddenAgain?'刚才看过词义，现在暂时遮住了。试着自己说出它的意思。':'不用打字；先在心里说出这个词的意思。'}</p><div class="bottom-actions">${button('show-word',s.wordHiddenAgain?'再次核对词义 →':'核对完整词义 →')}${s.wordPath==='known'&&!s.wordHiddenAgain?button('word-hint','给我一点线索','btn btn-text'):''}</div></div>`:'';
    const meaning=s.wordOpened?`<div class="meaning-block" role="status"><span class="eyebrow">词义与例句</span><div class="meaning-value">${esc(w.meaning)}</div><p lang="en" class="meaning-example">${esc(w.example)}</p><p>${esc(w.lead)}</p><p>${esc(w.explain)}</p><div class="meaning-actions">${speakButton('example','朗读例句（模拟）')}</div>${audioFeedback('example')}</div><p class="muted-line">${s.wordPath==='known'?'这是自行回忆后的核对。':s.wordPath==='fuzzy'?'这次使用了线索或解释。':s.wordPath==='unknown'?'这是直接学习新词。':'这是直接查看词义。'} 本轮仅记录学习接触，不认定已经掌握。</p>`:'';
    return taskFrame(`<h2 class="study-title">先认识几个常用的小词</h2><p class="study-lead">认识的可以核对，不熟的可以先看解释。每个词按自己的情况学习。</p><div class="word-hero"><div class="word-display" lang="en">${esc(w.word)}</div><div class="word-audio"><span class="phonetic" lang="en">${esc(w.phonetic)}</span>${speakButton('word','听单词发音（模拟）')}</div>${audioFeedback('word')}</div>${choice}${route}${meaning}${s.wordOpened?`<div class="bottom-actions">${button('next-word',s.word===words.length-1?'进入句子学习 →':'继续下一个词 →')}${button('hide-word','遮住词义，再回忆','btn btn-outline')}</div>`:''}<p class="task-count">这是对熟悉程度的自我描述，不是能力评级；看过答案的再次回忆也不等于独立掌握。</p>`, '先认识词义', '逐词学习 · 自由核对');
  }
  function sentenceView(){return taskFrame(`<h2 class="study-title">读懂这个句子里的先后关系</h2><p class="study-lead">读一遍，看看你能不能想象出事情发生的顺序。</p><div class="sentence-hero"><p class="sentence" lang="en">I washed my hands <mark>before</mark> dinner.</p><div class="sentence-audio">${speakButton('sentence','朗读这句话（模拟）')}</div>${audioFeedback('sentence')}${s.explainShown?`<div class="translation">吃晚饭前，我洗了手。</div>`:''}</div>${s.explainShown?`<div class="explain-label">这里的时间关系</div><div class="relationship"><span class="step">先 · 洗手</span><span class="connector">→</span><span class="step">后 · 吃晚饭</span></div><p class="explanation"><strong>before</strong> 告诉我们：洗手发生在晚饭之前。读句子时，要把两个动作联系起来，而不只是逐个翻译单词。</p>`:`<p class="recall-prompt">想一想：洗手和吃晚饭，哪件事情先发生？</p>`}<div class="bottom-actions">${!s.explainShown?button('show-explain','看看句意与先后关系 →'):button('try-before','换句子检验 before →')}${!s.explainShown?button('try-before','先用 before 试一道题','btn btn-outline'):button('next-task','继续：学习原因句 →','btn btn-text')}</div>`, '读懂一句话','句意 · 时间关系'); }

  function makeQuestion(id){return {question:bank[id],hint:false,revealed:false,selected:null,input:'',attempts:[],feedback:null,priorLesson:false};}
  function currentQ(){return s.question?.question;}
  function questionView(){const z=s.question,q=z.question;const locked=!!z.feedback;const inline=q.type==='fill';const content=inline?`<div class="fill-label">把空格补完整：</div><div class="fill-line"><span lang="en">${esc(q.sentence.split('___')[0])}</span><input id="fill-answer" aria-label="填入英文连接词" type="text" data-fill="true" value="${esc(z.input)}" placeholder="输入单词" autocomplete="off" spellcheck="false" ${locked?'disabled':''}><span lang="en">${esc(q.sentence.split('___')[1])}</span></div>`:
    `<div class="choices" role="group" aria-label="选择一个答案">${q.options.map((v,i)=>`<button type="button" class="choice ${z.selected===i?'selected':''}" data-action="select-choice" data-value="${i}" aria-pressed="${z.selected===i}" ${locked?'disabled':''}><span class="choice-key">${'ABC'[i]}</span><span>${esc(v)}</span></button>`).join('')}</div>`;
    const primaryTag=s.task===1?'换一句话，看看 before 的时间先后':(s.task===4?'同一个重点，换个句子':(s.task===3?'试着回忆一个词':'读句子，找线索'));
    const subTag=s.task===1?'before · 小检验':(s.task===4?'连续练习':(inline?'主动回忆':'短句理解'));
    const attemptInfo=z.attempts.length>0?`<div class="hint-context">这道题已经尝试过 ${z.attempts.length} 次。新一次作答仍会保留之前的支持情况。</div>`:'';
    let support='';
    if(z.hint)support+=`<div class="support-box" role="status"><span class="eyebrow">一点提示</span><p>${esc(q.hint)}</p></div>`;
    if(z.revealed)support+=`<div class="support-box answered" role="status"><span class="eyebrow">答案已揭示</span><p>参考答案：<strong>${esc(q.answer)}</strong></p><p>${esc(q.explain)}。再做同一道题，只能算看答案后的练习。</p></div>`;
    const fb=locked?renderFeedback(z):'';
    return taskFrame(`<h2 class="study-title">${primaryTag}</h2><div class="question-hero"><p class="question-sentence" lang="en">${esc(q.sentence)}</p>${!inline?`<div class="question-audio">${speakButton('question','朗读句子（模拟）')}</div>${audioFeedback('question')}`:z.revealed?`<div class="question-audio">${speakButton('fill-answer','朗读完整答案（模拟）')}</div>${audioFeedback('fill-answer')}`:''}<p class="question-instruction">${esc(q.instruction)}</p></div>${content}${support}${attemptInfo}${fb}${locked?`<div class="bottom-actions">${button('retry','同题再试',z.feedback.kind==='correct'?'btn btn-outline':'btn btn-primary')}${button('advance',advanceText(),z.feedback.kind==='correct'?'btn btn-primary':'btn btn-secondary')}</div>`:
      `<div class="bottom-actions">${button('submit-answer','提交回答', 'btn btn-primary', (inline?!z.input.trim():z.selected===null)?'disabled':'')}${button('dont-know','我不知道','btn btn-outline')}</div>`}
    <div class="question-tools">${!z.hint?button('hint','给一点提示','btn btn-text btn-sm'):''}${!z.revealed?button('reveal','看答案与解释','btn btn-text btn-sm'):''}${z.hint||z.revealed?`<span class="muted-line">${z.revealed?'已看过答案':'已获得提示'}，后续会按实际条件描述</span>`:''}</div>`, '试一试',subTag); }
  function labelCondition(c){return ({'after_lesson':'作答前已看过同一重点的讲解；这是新句子的检验，不算无支持首次表现。','first_unassisted':'这道题首次作答，未获得题内提示或答案。','after_hint':'这次作答之前已经看过提示。','after_reveal':'已经看过本题答案，这次是巩固练习。','repeated_unassisted':'这不是首次作答；之前的尝试仍然保留。'})[c]||'按实际支持情况记录。';}
  function renderFeedback(z){const fb=z.feedback; if(!fb)return '';const correct=fb.kind==='correct';const unknown=fb.kind==='unknown';let title=correct?'这次答对了':unknown?'不会也可以直接说':'这次还没答对';
    let lead='';
    if(correct){lead=fb.condition==='first_unassisted'?'本题首次回答，没有获得题内提示。可以继续用新句子看看。':fb.condition==='after_reveal'?'这是看过答案后的同题练习，不算首次独立答对。':fb.condition==='after_hint'?'提示帮助了这次回答，下一步可以换新句试试。':fb.condition==='after_lesson'?'之前已看过这一重点的讲解；这是新句中的练习表现。':'这是同题再次尝试，值得继续用新句子验证。';}
    else if(unknown){lead='不必猜答案。先看一点提示，再自己试试；也可以查看答案。';}
    else{lead='先别着急，可以要一点提示、同题再试，或者换更短的句子。';}
    return `<div class="feedback ${correct?'':'fail'}" role="status" aria-live="polite"><div class="feedback-title"><span class="symbol">${correct?'✓':'·'}</span><span>${title}</span></div><p>${lead}</p><div class="condition">${unknown?'这次记录为「不知道」，不是答错。':`本次条件：${labelCondition(fb.condition)}`}</div></div>`;
  }
  function advanceText(){if(s.task===1&&s.sentenceTesting)return '继续：学习原因句 →';if(s.task===4 && s.t5Step===1)return '看看本轮小结 →';if(s.task===4)return '换一个新句 →';if(s.task===2 && !s.t3Variant)return isClean(s.question)?'继续下一段 →':'换个短句再试 →';return '继续学习 →';}
  function summaryView(){const events=s.evidence.filter(e=>e.session===s.sessionNo);const attempts=events.filter(e=>e.type==='attempt');const first=attempts.filter(e=>e.correct===true&&e.condition==='first_unassisted').length;const supported=attempts.filter(e=>e.correct===true&&['after_hint','after_reveal','after_lesson'].includes(e.condition)).length;const unknown=attempts.filter(e=>e.answer==='不知道').length;const skips=events.filter(e=>e.type==='skip').length;const contacts=new Set(events.filter(e=>e.type==='contact'&&e.resource).map(e=>e.resource));const newQ=attempts.filter(e=>e.correct===true&&e.condition==='first_unassisted'&&e.questionId!=='cause-one');
    const next=unknown||supported||attempts.some(a=>a.correct===false)?'下一轮可以再用较短的新句子练一练；需要帮助过的内容，之后还要留出间隔再看。':'这一轮接触了这些内容。下次可以换新句子，并在隔一段时间后再看看能否独立理解。';
    return mainShell(`<main class="summary-wrap"><div class="summary-card"><div class="summary-icon" aria-hidden="true">${s.lastSessionEnd==='skipped_final'?'↗':'✓'}</div><span class="eyebrow">SESSION REFLECTION · 模拟小结</span><h1>${s.lastSessionEnd==='manual'?'这一轮先到这里。':s.lastSessionEnd==='skipped_final'?'最后一段先跳过，这一轮就到这里。':'这一小段，学到这里。'}</h1><p class="lead">${s.lastSessionEnd==='skipped_final'?'最后一段未完成，不算答错，也不代表已经学会。':'完成多少不重要。'}下面只描述这次在页面里实际发生过的学习行为，不据此判断长期掌握。</p>
      <div class="summary-grid"><div class="summary-stat"><strong>${contacts.size ? `${contacts.size} 个` : '尚无'}</strong><span>接触过的核心连接词${contacts.size?`：${[...contacts].map(esc).join('、')}`:''}</span></div><div class="summary-stat"><strong>${first} 次</strong><span>本题首次、无题内支持地答对（不等于长期掌握）</span></div><div class="summary-stat"><strong>${supported} 次</strong><span>提示、讲解或看过答案之后答对</span></div><div class="summary-stat"><strong>${unknown} 次</strong><span>明确选择了「不知道」${skips?`；另外跳过 ${skips} 段内容`:''}</span></div></div>
      <div class="summary-callout"><b>下一步可以这样学</b><div>${next}</div>${newQ.length?`<div>其中有 ${newQ.length} 次发生在这轮后续的新题中；仍需之后再次检验。</div>`:''}</div><p class="muted-line">仅供 UX 交互评审：作答与支持历史保留在当前页面内存；未写入数据库，刷新即清空。不会把同题看过答案后的重试计入首次无提示正确。</p>
      <div class="summary-actions">${button('again','再学一轮 →')}${button('logout','先休息，退出','btn btn-outline')}</div></div></main>`); }
  function studentView(){if(!s.objective)return noObjective();if(s.view==='summary')return summaryView();let content=s.task===0?wordView():s.task===1&&!s.sentenceTesting?sentenceView():questionView();return mainShell(`<main>${sessionHeader()}<div class="learning-layout">${content}<div class="mobile-learning-controls">${button('skip',skipLabel(),'btn btn-outline btn-sm')}${button('ask-end','结束本轮','btn btn-text btn-sm')}</div>${aside()}</div></main>`);}
  function renderModal(){const ending=s.modal==='end';const title=ending?'现在结束这一轮吗？':'重新开始这次原型演示？';const desc=ending?'不必完成当前内容。已发生的模拟学习行为会进入本轮小结；这次尚未回答的部分不会被算作错误。':'将清空本页面内的模拟目标、作答和支持历史，回到双入口首页。此操作无法撤回。';return `<div class="modal-layer" role="presentation"><section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">${title}</h2><p>${desc}</p><div class="modal-actions">${button('close-modal','继续当前操作','btn btn-outline')}${button(ending?'end-now':'reset-now',ending?'结束并看小结':'清空并重来',ending?'btn btn-primary':'btn btn-danger')}</div></section></div>`;}
  function render(){let html=s.view==='gateway'?gateway():s.view==='login'?loginView():s.view==='teacher'?teacherView():s.view==='no-objective'?noObjective():studentView();$.innerHTML=html;document.title=(s.view==='student'?'正在学习':s.view==='teacher'?'教学端':s.view==='summary'?'本轮小结':'欢迎')+' · Relo';}

  function chooseRole(role){s.choosingRole=role;s.error='';s.view='login';render();}
  function confirmGoal(){const fields=['title','outcome','focus','evidence','review'];const missing=fields.filter(k=>!String(s.draft[k]||'').trim());if(missing.length){s.error='请先写清目标、观察表现、重点、判断依据和回顾时点。';render();return;}s.objective=Object.fromEntries(fields.map(k=>[k,s.draft[k].trim()]));s.editGoal=false;s.error='';s.view='teacher';render();}
  function startSession(){s.sessionNo++;s.sessionActive=true;s.lastSessionEnd='natural';s.view='student';enterTask(0,s.sessionNo>1?'这是新的一轮学习。我们先复习几个熟悉的词，再换句子试试。':'');}
  function enterTask(index,msg=''){s.task=index;s.word=0;s.wordOpened=false;s.wordPath=null;s.wordHiddenAgain=false;s.explainShown=false;s.sentenceTesting=false;s.audioNotice=null;s.t3Variant=false;s.t5Step=0;s.transition=msg;
    if(index===0){s.question=null;record('contact',{resource:words[0].word,material:'word:'+words[0].word});}
    else if(index===1){s.question=null;record('contact',{resource:'before',material:'sentence:before-wash'});}
    else if(index===2)s.question=makeQuestion(s.sessionNo===1?'cause-one':'cause-one-alt');
    else if(index===3)s.question=makeQuestion(s.sessionNo===1?'before-fill':'before-fill-alt');
    else if(index===4)s.question=makeQuestion(s.sessionNo===1?'series-one':'series-one-alt');
    render();}
  function finishSession(manual=false,reason=null){s.sessionActive=false;s.lastSessionEnd=reason||(manual?'manual':'natural');s.modal=null;s.view='summary';render();}
  function skip(){record('skip',{material:s.question?.question.id||(s.task===0?'word:'+words[s.word].word:`task-${s.task}`)});s.audioNotice=null;
    if(s.task===0){if(s.word<words.length-1){nextWord(true);return;}enterTask(1,'最后一个词先跳过。接着看看简单句里的先后关系。');return;}
    if(s.task===4){if(s.t5Step===0){s.t5Step=1;s.question=makeQuestion('series-easy');s.transition='这道先放一放。换一个短句再试一次原因关系。';render();return;}finishSession(false,'skipped_final');return;}
    enterTask(s.task+1,'这段内容先放一放，换一种方式继续。');}
  function hint(){const z=s.question;if(!z||z.hint)return;z.hint=true;record('support',{questionId:z.question.id,support:'hint',material:z.question.id});render();}
  function reveal(){const z=s.question;if(!z||z.revealed)return;z.revealed=true;record('support',{questionId:z.question.id,support:'answer_revealed',material:z.question.id});render();}
  function responseCondition(z){if(z.revealed)return 'after_reveal';if(z.hint)return 'after_hint';if(z.attempts.length)return 'repeated_unassisted';if(z.priorLesson)return 'after_lesson';return 'first_unassisted';}
  function submit(dontKnow=false){const z=s.question;if(!z||z.feedback)return;const q=z.question;const raw=dontKnow?'不知道':(q.type==='fill'?z.input.trim():q.options[z.selected]);if(!dontKnow&&!raw)return;
    const correct=dontKnow?null:(q.type==='fill'?raw.toLowerCase()===String(q.right).toLowerCase():z.selected===q.right);
    const condition=dontKnow?'unknown':responseCondition(z);
    const attempt={questionId:q.id,answer:raw,correct,condition};z.attempts.push(attempt);record('attempt',{...attempt,material:q.id,focus:q.focus,source:'R1 hand-authored demo material'});
    if(dontKnow){z.hint=true;record('support',{questionId:q.id,support:'hint_after_unknown',material:q.id});}
    z.feedback={kind:dontKnow?'unknown':correct?'correct':'wrong',condition};
    // A correct-answer explanation is only opened on explicit request. An immediately repeated
    // response remains a subsequent attempt, never a fresh first attempt.
    render();}
  function retry(){if(!s.question)return;s.question.feedback=null;s.question.selected=null;s.question.input='';render();const input=document.querySelector('#fill-answer');if(input)input.focus();}
  function isClean(qState){return qState.attempts.length===1&&qState.attempts[0].correct===true&&qState.attempts[0].condition==='first_unassisted';}
  function advance(){const z=s.question;if(!z||!z.feedback)return;
    if(s.task===1&&s.sentenceTesting){enterTask(2,'刚才在新句中检验了 before 的时间先后。接下来读一句说明原因的话。');return;}
    if(s.task===2){if(!s.t3Variant&&!isClean(z)){s.t3Variant=true;s.question=makeQuestion(s.sessionNo===1?'cause-followup':'cause-followup-alt');s.audioNotice=null;s.transition='刚才这句还需要一点练习。换个更短的新句子，再找一次原因。';render();return;}enterTask(3,isClean(z)?'这道题是首次无提示答对。接下来试着自己回忆英文单词。':'接下来试试一个不同的时间关系。');return;}
    if(s.task===3){enterTask(4,'现在用几道不同的新句子，再看看 because 表达的原因。');return;}
    if(s.task===4){if(s.t5Step===0){const clean=isClean(z);s.t5Step=1;s.question=makeQuestion(clean?'series-stretch':'series-easy');s.audioNotice=null;s.transition=clean?'这次没有用题内提示，试试 because 放在句首的新表达。':'刚才这句需要多一点支持。先用更短的新句子继续理解原因。';render();return;}finishSession(false);return;}
  }
  function nextWord(skipped=false){if(s.word<words.length-1){s.word++;s.wordOpened=false;s.wordPath=null;s.wordHiddenAgain=false;s.audioNotice=null;s.transition=skipped?'这个词先跳过。继续看看下一个。':'';record('contact',{resource:words[s.word].word,material:'word:'+words[s.word].word});render();}else enterTask(1,'看了几个词，现在把它们放进一句完整的话里。');}
  function wordRoute(path){if(s.task!==0)return;s.wordPath=path;s.wordHiddenAgain=false;s.wordOpened=path==='unknown';s.audioNotice=null;record('self_report',{resource:words[s.word].word,report:path,material:'word:'+words[s.word].word});if(path==='fuzzy')record('support',{material:'word:'+words[s.word].word,support:'semantic_cue'});if(path==='unknown')record('support',{material:'word:'+words[s.word].word,support:'meaning_shown'});render();}
  function showWord(){if(s.task!==0||s.wordOpened)return;s.wordPath=s.wordPath||'direct';s.wordOpened=true;record('support',{material:'word:'+words[s.word].word,support:'meaning_shown'});render();}
  function pronounce(scope){let text='';if(scope==='word')text=words[s.word].word;else if(scope==='example')text=words[s.word].example;else if(scope==='sentence')text='I washed my hands before dinner.';else if(scope==='question'&&s.question?.question.type==='choice')text=s.question.question.sentence;else if(scope==='fill-answer'&&s.question?.revealed)text=s.question.question.sentence.replace('___',s.question.question.answer);else return;s.audioNotice={scope,text:`原型演示：此处将朗读「${text}」。本轮没有实际播放音频，也不记录为听力表现。`};render();}
  function tryBefore(){s.sentenceTesting=true;s.question=makeQuestion('before-check');s.question.priorLesson=s.explainShown;s.transition=s.explainShown?'刚刚看过 before 的讲解。换一句新句子，练习判断先后。':'还是 before 的时间关系。这次换个句子，自己判断先后。';s.audioNotice=null;render();}
  function dispatch(a,v){switch(a){
    case 'pick-role':chooseRole(v);break;
    case 'back-gateway':s.view='gateway';s.error='';render();break;
    case 'logout':s.choosingRole=null;s.error='';s.view='gateway';render();break;
    case 'go-student':chooseRole('student');break;
    case 'reset':s.modal='reset';render();break;
    case 'close-modal':s.modal=null;render();break;
    case 'reset-now':s=initialState();render();break;
    case 'ask-end':s.modal='end';render();break;
    case 'end-now':finishSession(true);break;
    case 'use-suggestion':s.draft={...seed};s.error='';render();break;
    case 'pref':s.pref=Number(v);render();break;
    case 'confirm-goal':confirmGoal();break;
    case 'edit-goal':s.draft={...s.objective};s.editGoal=true;s.error='';render();break;
    case 'cancel-edit':s.editGoal=false;s.error='';render();break;
    case 'word-known':wordRoute('known');break;
    case 'word-fuzzy':wordRoute('fuzzy');break;
    case 'word-new':wordRoute('unknown');break;
    case 'word-hint':s.wordPath='fuzzy';record('support',{material:'word:'+words[s.word].word,support:'semantic_cue'});render();break;
    case 'show-word':showWord();break;
    case 'hide-word':if(s.wordOpened){s.wordOpened=false;s.wordHiddenAgain=true;s.audioNotice=null;render();}break;
    case 'pronounce':pronounce(v);break;
    case 'next-word':nextWord();break;
    case 'show-explain':if(!s.explainShown){s.explainShown=true;record('support',{material:'sentence:before-wash',support:'explanation_shown'});}render();break;
    case 'try-before':tryBefore();break;
    case 'next-task':enterTask(2,'刚才讲的是时间顺序；这次读一句表达原因的新句子。');break;
    case 'select-choice':if(s.question&&!s.question.feedback){s.question.selected=Number(v);render();}break;
    case 'submit-answer':submit(false);break;
    case 'dont-know':submit(true);break;
    case 'hint':hint();break;
    case 'reveal':reveal();break;
    case 'retry':retry();break;
    case 'advance':advance();break;
    case 'skip':skip();break;
    case 'again':startSession();break;
  }}
  $.addEventListener('click',e=>{const target=e.target.closest('[data-action]');if(!target||target.disabled)return;dispatch(target.dataset.action,target.dataset.value);});
  $.addEventListener('input',e=>{const t=e.target;if(t.dataset.goalField){s.draft[t.dataset.goalField]=t.value;}if(t.hasAttribute('data-fill')&&s.question){s.question.input=t.value;const b=document.querySelector('[data-action="submit-answer"]');if(b)b.disabled=!t.value.trim();}});
  $.addEventListener('keydown',e=>{if(e.target.hasAttribute('data-fill')&&e.key==='Enter'){e.preventDefault();submit(false);}});
  $.addEventListener('submit',e=>{if(e.target.id!=='login-form')return;e.preventDefault();const data=new FormData(e.target);const teacher=s.choosingRole==='teacher';const ok=data.get('account')===(teacher?'teacher':'student')&&data.get('pin')===(teacher?'2468':'1234');if(!ok){s.error='账号或密码与所选入口不匹配。请使用本入口的演示账号。';render();return;}s.error='';if(teacher){s.view='teacher';s.draft=s.objective?{...s.objective}:{...seed,title:'',outcome:'',focus:'',evidence:'',review:''};s.editGoal=false;render();}else if(!s.objective){s.view='no-objective';render();}else if(s.sessionActive){s.view='student';render();}else startSession();});
  render();
})();