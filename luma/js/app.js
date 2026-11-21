import { intents, sampleWords, wordById, goalScope, goalPerformance, goalEvidence } from '../data/sample-data.js';
import { state, change, resetDemo, allEvidence, timeLabel } from './state.js';
import { wordStatus, reviewDueIds, reviewWaitingIds, summary, nextBatch, startLesson, currentTask, hint, recordAnswer, nextTask, pauseLesson, abandonLesson, latestOutcome, resultDisplay } from './learning.js';

const root = document.getElementById('app');
const symbolPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 2 6-7"/>',
  arrow: '<path d="M4 12h16m-7-7 7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  light: '<path d="M9 18h6m-5 3h4"/><path d="M12 2a7 7 0 0 0-4 12.8V16h8v-1.2A7 7 0 0 0 12 2Z"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  replay: '<path d="M3 11a9 9 0 1 1 3 7"/><path d="M3 4v7h7"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>'
};
const icon = (name) => '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (symbolPaths[name] || '') + '</svg>';
const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const brand = () => '<span class="brand"><span class="brand-mark" aria-hidden="true">✦</span><span>Luma</span></span>';
const theme = () => '<label class="theme-wrap"><span class="screen-reader-only">外观主题</span><select class="theme-select" id="theme" aria-label="外观主题"><option value="system"' + (state.theme === 'system' ? ' selected' : '') + '>跟随系统</option><option value="light"' + (state.theme === 'light' ? ' selected' : '') + '>浅色</option><option value="dark"' + (state.theme === 'dark' ? ' selected' : '') + '>深色</option></select></label>';
const button = (label, action, cls = 'btn-outline', extra = '') =>
  '<button type="button" class="btn ' + cls + '" data-action="' + action + '" ' + extra + '>' + label + '</button>';
const go = (screen, label, cls='btn-ghost') => button(label, 'route', cls, 'data-screen="' + screen + '"');
const mockTag = '<span class="demo-pill">R1 模拟体验</span>';
const footerNote = '<p class="mini text-muted">本原型只使用 8 个代表词汇；约 500 词是 Goal 的设定范围，并非已导入或学过的数量。</p>';

function loginPage() {
  return `<main class="login-page">
    <section class="login-left">
      <header>${brand()}</header>
      <div class="login-inner">
        <div class="eyebrow">Your learning space</div>
        <h1>从今天的自己<br>开始，慢慢变好。</h1>
        <p>不必一次学会很多。先找到合适的起点，把不认识的词，一个个变成你理解的词。</p>
        <div class="login-panel">
          <strong>进入你的学习空间</strong>
          <p>R1 使用本机演示身份，无须账号、密码或个人信息。</p>
          ${button('开始体验 ' + icon('arrow'), 'enter', 'btn-primary btn-wide')}
        </div>
        <div class="login-caption">一个安静、持续、属于你的英语学习空间。 ${theme()}</div>
      </div>
      <footer class="login-footer">Luma · Interactive Prototype R1 · 本地模拟，无真实登录</footer>
    </section>
    <aside class="login-right" aria-label="Luma 学习理念">
      <div class="eyebrow">A little, every day.</div>
      <div class="login-quotation">为英语精进，<br>日拱一卒。</div>
      <p class="login-quote-foot">Start where you are. Grow from there.<br>从真实起点开始，持续向前。</p>
      <div class="login-sample"><span class="eyebrow">One word at a time</span><div class="login-sample-word">because</div><p class="login-sample-description">今天也可以从一个熟悉的单词开始。</p><div class="login-sample-foot">Luma · 学习不必从完美开始</div></div>
    </aside>
  </main>`;
}
function sidebar() {
  const active = state.screen;
  const nav = [
    ['workspace','home','学习首页'],
    ['progress','chart','学习进步'],
    ['goal','target','我的目标']
  ];
  return `<aside class="sidebar">
    ${brand()}
    <div class="nav-caption">LEARNING</div>
    <nav aria-label="主要导航">${nav.map(([screen, symbol, title]) =>
      '<button class="nav-item ' + (active===screen?'active':'') + '" data-action="route" data-screen="' + screen + '" ' + (active===screen?'aria-current="page"':'') + '>' + icon(symbol) + '<span>' + title + '</span></button>'
    ).join('')}</nav>
    <div class="sidebar-bottom"><div class="sidebar-note"><span class="eyebrow">A gentle reminder</span><p>每一个认真尝试，都值得被看见。</p></div>
      <button class="inline-link" data-action="logout">退出演示入口</button>
      <div style="margin-top:12px"><button class="inline-link" data-action="reset">重置演示数据</button></div>
    </div>
  </aside>`;
}
function shell(content, title) {
  return `<div class="app-shell">${sidebar()}<div class="app-main">
    <header class="topbar"><div class="topbar-title">Luma <span style="padding:0 6px;color:var(--faint)">/</span> ${esc(title)}</div>
      <div class="topbar-right">${mockTag}${theme()}</div></header>${content}
  </div></div>`;
}
function goalFact(label, body) {
  return '<div class="goal-fact"><span>' + label + '</span><strong>' + esc(body) + '</strong></div>';
}
function goalPanel() {
  const selected = intents.find(x=>x.id===state.goal?.intentId) || intents[0];
  return `<div class="card card-side">
    <div class="card-top"><div class="eyebrow">当前学习方向</div>${icon('target')}</div>
    <h3>${esc(selected.title)}</h3>
    <p>${esc(goalPerformance)}，先从适合自己的词开始。</p>
    <div class="divider"></div>
    <div class="goal-fact"><span>词汇范围</span><strong>${esc(goalScope)}</strong></div>
    ${go('goal','查看或调整目标 ' + icon('arrow'), 'btn-ghost btn-sm')}
  </div>`;
}
function workspace() {
  const s = summary(state);
  const active = !!state.session && !state.session.finished;
  const batch = nextBatch(state);
  const weak = reviewDueIds(state);
  const waiting = reviewWaitingIds(state);
  const primaryLabel = active ? '继续刚才的学习 ' + icon('arrow') :
    batch.length ? (s.firstCount ? '继续学习新词 ' : '开始今天的学习 ') + icon('arrow') :
    weak.length ? '开始到期复检 ' + icon('arrow') : '查看学习进步 ' + icon('arrow');
  const primaryAction = active ? 'resume' : batch.length ? 'start' : weak.length ? 'start-review' : 'progress';
  const decision = active ? '刚才的学习已保存。回到离开的位置，不必重新开始。'
    : batch.length ? (weak.length ? '先认识几个常见词。另有到期复检，可从「学习进步」开始。' : '先认识几个常见词，遇到陌生词可以直接说不知道。')
    : weak.length ? '根据现有记录，' + weak.map(id=>wordById[id].text).slice(0,2).join('、') + ' 现在适合巩固或延迟复检。'
      : waiting.length ? '刚练过的词先留一点间隔，再看看自己还记不记得。'
      : '先试着独立辨认；遇到陌生的词，也可以直接说不知道。';
  return shell(`<main class="content">
    <section class="hero" aria-label="欢迎与学习方向">
      <div><span class="eyebrow">A little progress, every day</span>
        <h1>为英语精进，<br>日拱一卒。</h1>
        <p>不求一下记住所有词。今天，先认真认识眼前的几个。</p>
      </div>
      <div class="hero-quote">Start where you are. Grow from there.<small>从真实起点开始，持续向前。</small></div>
    </section>
    <section class="feature-grid" aria-label="当前学习安排">
      <div class="card card-feature">
        <div class="card-top"><span class="eyebrow">YOUR NEXT STEP</span><span class="chip">${icon(active?'pause':'light')} ${active?'学习已暂停':'建议从这里开始'}</span></div>
        <h2>${active?'接着刚才的地方，继续。':batch.length?'从几个常见词开始。':weak.length?'有几个词，今天适合回头看一看。':waiting.length?'这一轮先休息，留给下次复检。':'从几个常见词开始。'}</h2>
        <p>${esc(decision)}</p>
        <div class="action-row">${button(primaryLabel, primaryAction, 'btn-primary')}
          ${go('progress','看看学习记录','btn-ghost btn-sm')}
        </div>
        <div class="subtle-illustration" aria-hidden="true"><span class="word-tile">because</span><span class="word-tile">through</span><span class="word-tile">enough</span></div>
        ${active?'<div style="margin-top:25px">'+button('结束本次学习（保留记录）','end-lesson','btn-ghost btn-sm')+'</div>':''}
      </div>
      ${goalPanel()}
    </section>
    <div class="section-head"><div><div class="eyebrow">Learning, not streaks</div><h2>正在积累的观察</h2></div>${go('progress','查看详情 '+icon('arrow'),'btn-ghost btn-sm')}</div>
    <section class="metrics" aria-label="本机演示中产生的学习记录">
      <div class="metric"><div class="metric-num mono">${s.attempted}</div><p>本次演示中的真实操作记录</p></div>
      <div class="metric"><div class="metric-num mono">${s.independent}</div><p>未用提示的书面词义辨认正确</p></div>
      <div class="metric"><div class="metric-num mono">${s.review}</div><p>现在适合巩固或复检的代表词</p></div>
    </section>
    <p class="mini text-muted" style="margin-top:-22px;margin-bottom:32px">${waiting.length} 个代表词在等待延迟复检；今天不必立即重做。</p>
    <div class="goal-strip"><div><strong>真正记住，需要时间来检验。</strong>
      <p>今天答对，不等于过几天仍记得。Luma 会保留不同条件下的表现。</p></div>
      ${go('progress','查看为什么复习 '+icon('arrow'),'btn-soft btn-sm')}
    </div>
    <div style="margin-top:25px">${footerNote}</div>
  </main>`,'学习首页');
}
function goalPage() {
  const editing=!!state.goal;
  const selected=intents.find(x=>x.id===state.draftIntent) || intents[0];
  return shell(`<main class="content content-narrow">
    <header class="page-heading"><div class="eyebrow">${editing?'Review your goal':'First, find your direction'}</div>
      <h1>${editing?'你的学习方向':'先说说，你最想解决什么？'}</h1>
      <p>不用先做完整测评，也不用填很多表格。只要选一个最贴近你的想法，我们就能从少量词汇开始。</p></header>
    <div class="goal-layout">
      <div><div class="card"><div class="eyebrow">01 / 你想改善什么</div>
        <div class="intent-list">${intents.map(item=>`<button class="intent-option ${selected.id===item.id?'selected':''}"
          data-action="intent" data-intent="${esc(item.id)}" aria-pressed="${selected.id===item.id}">
          <span class="radio-marker" aria-hidden="true">✓</span><span><strong>${esc(item.title)}</strong><small>${esc(item.detail)}</small></span>
        </button>`).join('')}</div>
      </div><div class="inline-tip" style="margin-top:16px">${icon('info')}<span>这一轮先聚焦<strong>看英文，辨认基本词义</strong>。发音、拼写与真实阅读运用可以留到后续目标与学习活动中。</span></div></div>
      <aside class="card goal-preview"><span class="eyebrow">你的 Goal · 预览</span><h3>${esc(selected.title)}</h3>
        ${goalFact('学习范围',goalScope)}
        ${goalFact('希望做到',goalPerformance)}
        ${goalFact('怎样判断有进步',goalEvidence)}
        <p class="mini text-muted">当前只用 8 个代表词展示路径，不代表 500 个词已经准备完毕或已经学会。</p>
        <div class="goal-footer">${button(editing?'确认目标调整 '+icon('check'):'确认方向，开始学习 '+icon('arrow'),'confirm-goal','btn-primary btn-wide')}</div>
        ${editing?'<div style="margin-top:9px;text-align:center">'+go('workspace','暂不调整','btn-ghost btn-sm')+'</div>':''}
      </aside>
    </div>
  </main>`,'我的目标');
}
function eventLabel(e) {
  const labels = {
    'independent-correct':'独立辨认正确',
    'supported-correct':'有提示时正确',
    'practice-correct':'近期巩固正确',
    incorrect:'本次未答对',
    unknown:'主动表示不知道'
  };
  return labels[e.result] || e.result;
}
function progressPage() {
  const s=summary(state);
  const weak=reviewDueIds(state);
  const waiting=reviewWaitingIds(state);
  const nextWords=nextBatch(state);
  const active=state.session && !state.session.finished;
  const history=allEvidence(state).slice().reverse();
  return shell(`<main class="content">
    <header class="page-heading"><div class="eyebrow">Evidence & next steps</div>
      <h1>把每一次尝试，变成下一步的依据。</h1>
      <p>这里展示的是具体词汇在具体条件下的表现，不是统一的“掌握度”分数。示例历史和本次操作分开标注。</p>
    </header>
    <section class="metrics" aria-label="演示观察统计">
      <div class="metric"><div class="metric-num mono">${s.independent}</div><p>本机演示期间独立辨认正确的次数</p></div>
      <div class="metric"><div class="metric-num mono">${s.supported}</div><p>提示后或近期巩固正确的次数</p></div>
      <div class="metric"><div class="metric-num mono">${weak.length}</div><p>现在适合巩固／复检的代表词</p></div>
    </section>
    <p class="mini text-muted" style="margin-top:-24px;margin-bottom:30px">另有 ${waiting.length} 个代表词刚练过，等待间隔后复检；并不代表已经掌握。</p>
    <div class="progress-layout">
      <section class="card"><div class="card-top"><div><span class="eyebrow">Vocabulary in focus</span><h2 style="margin:10px 0 3px">哪些词值得再看？</h2></div>
        <span class="chip">${sampleWords.length} 个代表词</span></div>
        <p class="progress-intro" style="margin-top:8px">同一个词，可能经历独立答对、之后遗忘、再次获得支持。这里保留这些变化。</p>
        <div style="overflow-x:auto"><table class="table-like"><thead><tr><th>词汇</th><th>最近观察</th><th>后续建议</th></tr></thead><tbody>
          ${sampleWords.map(w=>{const st=wordStatus(state,w.id);return `<tr><td>${esc(w.text)}<div class="mini text-muted" style="font-weight:400">${esc(w.pos)}</div></td><td><span class="status-tag ${st.type}">${esc(st.title)}</span></td><td class="text-muted">${esc(st.detail)}</td></tr>`;}).join('')}
        </tbody></table></div>
      </section>
      <div class="stack">
        <section class="card"><span class="eyebrow">Next learning decision</span><h3 style="margin-top:14px">${weak.length?'现在可以复习这些词':waiting.length?'刚练过，等待更有价值的复检':'先继续积累观察'}</h3>
          <p class="mini-detail text-muted">${weak.length?`目前可复检 ${weak.map(id=>wordById[id].text).slice(0,3).join('、')}。是否算保持证据取决于独立性和实际间隔。`:waiting.length?'最近练习过的词暂未到复检时机，先休息或认识新词。':'暂无到期复习，但独立表现仍需要日后验证。'}</p>
          <div style="margin-top:22px">${active?button('先继续当前学习 '+icon('arrow'),'resume','btn-primary btn-wide'):weak.length?button('开始到期复习 '+icon('arrow'),'start-review','btn-primary btn-wide'):nextWords.length?button('继续学习新词 '+icon('arrow'),'start','btn-primary btn-wide'):go('workspace','返回学习首页','btn-outline btn-wide')}</div>
        </section>
        <section class="card"><span class="eyebrow">Recent evidence</span><h3 style="margin-top:12px">观察记录</h3>
          ${history.length?history.slice(0,8).map(e=>`<div class="evidence-item"><strong>${esc(wordById[e.wordId]?.text || e.wordId)} · ${esc(eventLabel(e))}</strong>
            <small>${esc(timeLabel(e.at))} · ${e.source==='sample-history'?'示例历史（预置）':'本机操作'} · ${e.hintUsed?'使用过提示 · ':''}${e.kind==='reinforce'?'刚看过答案后的巩固':e.kind==='review'?'复习观察':'首次呈现'}</small></div>`).join(''):'<p class="text-muted mini">还没有观察。</p>'}
        </section>
      </div>
    </div>
    <div class="inline-tip" style="margin-top:24px">${icon('info')}<span><strong>证据边界：</strong>历史示例是预置模拟；本机记录只是原型交互。跨时间保持只能通过真实间隔后的独立表现观察，不能由这次练习自动生成。</span></div>
  </main>`,'学习进步');
}
function focusPage() {
  const lesson=state.session;
  const task=currentTask(state);
  if (!lesson || !task) return workspace();
  const word=wordById[task.wordId];
  const feedback=lesson.phase==='feedback';
  const outcome=feedback?latestOutcome(state):null;
  const [resultTitle,resultText,resultTone]=resultDisplay(outcome?.result);
  const options=task.kind==='first'?word.choices:word.revisitChoices;
  const label=task.kind==='reinforce'?'刚学过 · 再巩固一次':task.kind==='review'?'针对性复习 · 书面词义辨认':'书面词义辨认 · 独立尝试';
  const hintPanel=lesson.hintUsed && !feedback?`<div class="hint-panel"><strong>一点提示 · 这次会记录为受支持的尝试</strong>${esc(word.hint)}</div>`:'';
  const choices=options.map((option,i)=>{
    const match=feedback&&option===word.answer;
    const wrong=feedback&&outcome?.response===option && !match;
    const mark=match?' ✓':wrong?' ×':'';
    return `<button type="button" class="choice ${match?'correct':''} ${wrong?'incorrect':''}"
       data-action="answer" data-answer="${esc(option)}" ${feedback?'disabled':''}
       ${feedback&&outcome?.response===option?'aria-label="你的选择：'+esc(option)+'"':''}>
       <span class="choice-num">${String.fromCharCode(65+i)}</span><span>${esc(option)}${mark}</span>
     </button>`;
  }).join('');
  const feedbackPanel=feedback?`<div class="feedback-panel ${resultTone}">
    <h3>${resultTone==='success'?icon('check')+' ':''}${esc(resultTitle)}</h3>
    <p>${esc(resultText)}</p>
    <div class="explain"><p><strong>正确词义：${esc(word.answer)}</strong> <span class="text-muted">· ${esc(word.pos)}</span></p>
      <p>${esc(word.note)} ${esc(word.contrast)}</p>
      ${outcome?.result==='incorrect'||outcome?.result==='unknown'||outcome?.result==='supported-correct'?
        '<p class="mini text-muted" style="margin-top:8px">先看懂解释，再根据复习时机继续观察；即刻重答不等于独立掌握。</p>':''}</div>
  </div>`:'';
  return `<main class="focus-page">
    <header class="focus-topbar">
      <div class="focus-brand"><span class="brand-mark">✦</span> <span>专注学习</span></div>
      <div class="focus-progress"><span>第 ${lesson.index+1} / ${lesson.queue.length} 次练习 · ${lesson.mode==='review'?'针对性复习':'基础词义辨认'}</span>
        <div class="progress-line" aria-label="本次学习进度"><i style="width:${Math.round(100*lesson.index/lesson.queue.length)}%"></i></div></div>
      <div class="focus-actions">${theme()}${button(icon('pause')+' 暂停并返回','pause','btn-ghost btn-sm')}</div>
    </header>
    <div class="focus-body"><div class="focus-main">
      <section class="focus-card" aria-label="当前词汇学习任务">
        <div class="focus-card-inside ${feedback?"is-feedback":"is-question"}">
          <div class="focus-eyebrow"><span class="focus-kicker">${esc(label)}</span><span>${feedback?'看懂反馈后再继续':'先自己想一想'}</span></div>
          <div class="word-area"><p>${feedback?'本次学习的词汇':'你觉得这个英文词是什么意思？'}</p>
            <h1 class="focus-word">${esc(word.text)}</h1><div class="word-underline"></div></div>
          ${hintPanel}
          <div class="focus-stage">
            ${feedback ? `<div class="focus-response" aria-label="本次回答"><span>你的回答</span><strong>${esc(outcome?.response)}</strong></div>` : `<div class="choice-grid" role="group" aria-label="选择词义">${choices}</div>`}
            ${feedbackPanel}
          </div>
        </div>
        <div class="focus-card-bottom">
          ${feedback?`<small>按 Enter 进入下一项，或停留读完解释</small>${button((lesson.index+1===lesson.queue.length?'完成本次学习':'继续学习')+' '+icon('arrow'),'next','btn-primary focus-next')}`:
            `<div class="focus-assist">${lesson.hintUsed?'<span class="chip">已查看提示</span>':button(icon('light')+' 给我一点提示','hint','btn-outline btn-sm')}
              ${button('我不知道','unknown','btn-ghost btn-sm')}</div><small>选择即提交 · 可按 A–D 作答</small>`}
        </div>
      </section>
      <div class="focus-caption">${task.kind==='reinforce'?'这次紧接着讲解后的练习，不会当作跨时间保持证据。':
        '遇到不认识的词可以直接选择「我不知道」，这也是有效的学习起点。'}</div>
    </div></div>
    <footer class="focus-bottom">Luma · R1 演示逻辑 ${icon('clock')} 可随时暂停并接续</footer>
  </main>`;
}
function summaryPage() {
  const s=summary(state), weak=reviewDueIds(state), waiting=reviewWaitingIds(state);
  const batch=nextBatch(state);
  const last=state.session;
  const thisSession=state.events.filter(e=>e.sessionId===last?.id);
  const independent=thisSession.filter(e=>e.result==='independent-correct').length;
  const supported=thisSession.filter(e=>e.result==='supported-correct'||e.result==='practice-correct').length;
  return shell(`<main class="content content-narrow"><div class="summary-wrap">
    <div class="card"><div class="summary-symbol">✦</div>
      <span class="eyebrow">Session complete</span><h1>这一段学习，完成了。</h1>
      <p>重要的不是做了多少题，而是今天哪些词已经能独立辨认、哪些词还需要一点时间。</p>
      <div class="metrics" style="margin-top:25px;margin-bottom:23px;grid-template-columns:repeat(3,1fr)">
        <div class="metric"><div class="metric-num mono">${thisSession.length}</div><p>本次尝试</p></div>
        <div class="metric"><div class="metric-num mono">${independent}</div><p>无提示正确</p></div>
        <div class="metric"><div class="metric-num mono">${supported}</div><p>支持／巩固正确</p></div>
      </div>
      <div class="inline-tip">${icon('light')}<span>${weak.length?`现在可以巩固或复检 ${weak.map(id=>wordById[id].text).slice(0,3).join('、')}。`:waiting.length?'这次练习已经完成。刚练过的词留到间隔之后再复检，避免反复刷同一道题。':'下一步可以继续接触新词，但今天的成功还要留待日后再观察。'}</span></div>
      <div class="summary-actions">
        ${go('progress','看看哪些词要复习 '+icon('arrow'),'btn-primary')}
        ${go('workspace','返回学习首页','btn-outline')}
        ${batch.length?button('再认识几个词','start','btn-ghost') : weak.length ? button('开始针对性巩固','start-review','btn-soft') : ''}
      </div>
      <p class="mini text-muted" style="margin-top:24px;margin-bottom:0">本页仅总结本次演示行为，不宣称已经形成跨时间保持能力。</p>
    </div>
  </div></main>`,'本次回顾');
}
function render() {
  document.documentElement.dataset.theme=state.theme;
  if (!state.entered) state.screen='login';
  if (state.entered && !state.goal && state.screen!=='goal') state.screen='goal';
  if (state.screen==='focus' && !currentTask(state)) state.screen='workspace';
  const view = state.screen==='login'?loginPage()
    :state.screen==='goal'?goalPage()
    :state.screen==='progress'?progressPage()
    :state.screen==='focus'?focusPage()
    :state.screen==='summary'?summaryPage()
    :workspace();
  root.innerHTML=view+'<span id="announcer" class="screen-reader-only" role="status" aria-live="polite"></span>';
  document.title='Luma · '+({ login:'欢迎', goal:'我的目标', workspace:'学习首页', progress:'学习进步', focus:'专注学习', summary:'本次回顾' }[state.screen]||'学习');
}
function transact(fn, focusTarget) {
  const previousScreen = state.screen;
  change(fn); render();
  // Scroll to top only when entering Focus, never between its stages.
  if (previousScreen !== "focus" && state.screen === "focus") window.scrollTo?.(0,0);
  if (focusTarget) root.querySelector(focusTarget)?.focus({ preventScroll: true });
}
function clickAction(element) {
  const action=element.dataset.action;
  switch(action) {
    case 'enter': transact(s=>{s.entered=true;s.screen=s.goal?'workspace':'goal';}); break;
    case 'route': {
      const screen=element.dataset.screen;
      if (screen==='focus' && !currentTask(state)) return;
      transact(s=>{s.screen=screen; if(screen==='goal')s.draftIntent=s.goal?.intentId||s.draftIntent;});
      break;
    }
    case 'intent': transact(s=>{s.draftIntent=element.dataset.intent;}); break;
    case 'confirm-goal': transact(s=>{
      s.goal={intentId:s.draftIntent,scope:'closed-500',performance:'written-meaning-recognition',
        review:'independent-and-later', updatedAt:new Date().toISOString()};
      s.screen='workspace';
    }); break;
    case 'start': transact(s=>{if(!startLesson(s,'new')) s.screen='progress';}); break;
    case 'start-review': transact(s=>{if(!startLesson(s,'review'))s.screen='progress';}); break;
    case 'resume': transact(s=>{if(s.session&&!s.session.finished){s.session.paused=false;s.screen='focus';} else startLesson(s,'new');}); break;
    case 'hint': transact(s=>hint(s)); break;
    case 'answer': {
      if(state.session?.phase!=='ask') return;
      transact(s=>recordAnswer(s,element.dataset.answer),'.focus-next');
      break;
    }
    case 'unknown': transact(s=>recordAnswer(s,null),'.focus-next'); break;
    case 'next': transact(s=>nextTask(s),state.session?.finished?'':'.focus-card'); break;
    case 'pause': transact(s=>pauseLesson(s)); break;
    case 'end-lesson': if(window.confirm('结束未完成的学习？已经发生的作答与提示记录会保留。')) transact(s=>abandonLesson(s)); break;
    case 'logout': transact(s=>{s.entered=false;s.screen='login';}); break;
    case 'reset': if(window.confirm('重置本机的 Luma R1 演示记录？这会清空本次 Goal 和尝试，并恢复预置示例历史。')){resetDemo();render();} break;
    case 'progress': transact(s=>s.screen='progress'); break;
  }
}
root.addEventListener('click',event=>{
  const control=event.target.closest('[data-action]');
  if(control && root.contains(control) && !control.disabled) clickAction(control);
});
root.addEventListener('change',event=>{
  if(event.target.id==='theme') transact(s=>{s.theme=event.target.value;});
});
document.addEventListener('keydown',event=>{
  if(state.screen!=='focus'||event.metaKey||event.ctrlKey||event.altKey||event.repeat) return;
  const focused = event.target || document.activeElement;
  if (focused?.isContentEditable || ['SELECT','INPUT','TEXTAREA'].includes(focused?.tagName)) return;
  if(event.key==='Escape'){event.preventDefault();transact(s=>pauseLesson(s));return;}
  if(state.session?.phase==='feedback' && event.key==='Enter'){
    if (focused?.tagName === 'BUTTON' && focused?.dataset?.action !== 'next') return;
    event.preventDefault();transact(s=>nextTask(s));return;
  }
  if(state.session?.phase==='ask') {
    const key = event.key.toUpperCase();
    const index = /^[A-D]$/.test(key) ? key.charCodeAt(0)-65 :
      /^[1-4]$/.test(event.key) ? Number(event.key)-1 : -1;
    if (index < 0) return;
    const options=currentTask(state).kind==='first'?wordById[currentTask(state).wordId].choices:wordById[currentTask(state).wordId].revisitChoices;
    const answer=options[index];
    if(answer){event.preventDefault();transact(s=>recordAnswer(s,answer),'.focus-next');}
  }
});
render();
