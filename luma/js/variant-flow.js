import { scenarioById, exampleById } from '../data/experience-data.js';

// R2 review preview is intentionally separate from the learner's R1 Goal, Session
// and Evidence. No schema engine or production learning policy is implied.
const normalized = value => String(value ?? '').trim().toLowerCase()
  .replace(/[\s。．，,！!]+/g,'');
export function currentPreview(s) {
  const preview = s.previewSession;
  return preview && !preview.finished ? exampleById[preview.queue[preview.index]] || null : null;
}
export function beginPreview(s, scenarioId) {
  const scenario = scenarioById[scenarioId];
  if (!scenario) return false;
  s.previewSequence = (s.previewSequence || 0) + 1;
  s.previewSession = {
    id:'r2-'+s.previewSequence, scenarioId,
    queue:scenario.taskIds.slice(), index:0, phase:'ask',
    hintUsed:false, textRevealed:false, audioPlayed:false,
    audioPlays:0, audioError:'', draft:'', outcome:null,
    finished:false, paused:false
  };
  s.previewEvents = Array.isArray(s.previewEvents) ? s.previewEvents : [];
  s.screen='variant';
  return true;
}
export function pausePreview(s) {
  if (!currentPreview(s)) return;
  s.previewSession.paused=true;
  s.screen='lab';
}
export function resumePreview(s) {
  if (!currentPreview(s)) return false;
  s.previewSession.paused=false;
  s.screen='variant';
  return true;
}
export function previewHint(s) {
  if (currentPreview(s) && s.previewSession.phase==='ask') s.previewSession.hintUsed=true;
}
export function previewAudioCompleted(s) {
  if (!currentPreview(s) || s.previewSession.phase!=='ask') return;
  s.previewSession.audioPlayed=true;
  s.previewSession.audioPlays++;
  s.previewSession.audioError='';
}
export function previewAudioError(s, error='当前浏览器未能播放声音') {
  if (!currentPreview(s)) return;
  s.previewSession.audioError=error;
}
export function previewRevealText(s) {
  if (currentPreview(s)?.format==='audio' && s.previewSession.phase==='ask') {
    s.previewSession.textRevealed=true;
  }
}
export function previewDraft(s, value) {
  const task=currentPreview(s);
  if (task && task.format==='text' && s.previewSession.phase==='ask')
    s.previewSession.draft=String(value).slice(0,100);
}
export function previewSubmit(s, response, now=new Date()) {
  const task=currentPreview(s), p=s.previewSession;
  if (!task || p.phase!=='ask') return false;
  // A silent/broken audio control must not produce fabricated auditory Evidence.
  if (task.format==='audio' && !p.audioPlayed && !p.textRevealed && response!==null) return false;
  if (response!==null && task.format==='choice' && !task.choices.includes(response) &&
      task.format!=='audio') return false;
  if (response!==null && task.format==='audio' && !task.choices.includes(response)) return false;
  const raw=response===null ? '我不知道' : String(response).trim().slice(0,100);
  const answered=response!==null && normalized(raw).length>0;
  const expected=task.format==='text' ? (task.accepted||[task.expected]) : [task.expected];
  const correct=answered && expected.some(x=>normalized(x)===normalized(raw));
  const exposed=p.textRevealed || !!task.supportedByDesign;
  const supported=p.hintUsed || exposed;
  let result='incorrect';
  if (!answered) result='unknown';
  else if (task.format==='audio' && !p.audioPlayed && p.textRevealed) {
    result=correct ? 'supported-correct' : 'unverified';
  } else if (correct && task.supportedByDesign) result='practice-correct';
  else if (correct) result=supported?'supported-correct':'independent-correct';
  else if (task.format==='text' && task.performance==='active-recall') result='unverified';
  const event={
    id:'r2-observation-'+((s.previewEvents?.length||0)+1),
    previewId:p.id, scenarioId:p.scenarioId, taskId:task.id,
    wordId:task.wordId, materialId:task.materialId, goalKey:scenarioById[p.scenarioId].goal,
    requestedPerformance:task.performance,
    observedPerformance:task.format==='audio' && !p.audioPlayed ?
      (p.textRevealed ? 'written-recognition-with-visible-text' : 'no-auditory-stimulus') : task.performance,
    response:raw, expected:task.expected, result, hintUsed:p.hintUsed,
    textRevealed:p.textRevealed, wasShownPriorAnswer:!!task.supportedByDesign,
    audioPlayed:p.audioPlayed, audioPlays:p.audioPlays,
    shownAnswerAfter:true, at:new Date(now).toISOString(),
    source:'r2-review-only', evaluatedBy:'bounded-fixture-rule'
  };
  if (!Array.isArray(s.previewEvents)) s.previewEvents=[];
  s.previewEvents.push(event);
  p.outcome=event.id;
  p.phase='feedback';
  if (task.afterMistake && result!=='independent-correct' &&
      !p.queue.slice(p.index+1).includes(task.afterMistake)) p.queue.push(task.afterMistake);
  return true;
}
export function previewOutcome(s) {
  return (s.previewEvents||[]).find(x=>x.id===s.previewSession?.outcome)||null;
}
export function previewNext(s) {
  const p=s.previewSession;
  if (!p || p.phase!=='feedback') return;
  p.index++;
  if (p.index>=p.queue.length) {
    p.finished=true; p.paused=false; s.screen='lab'; return;
  }
  p.phase='ask'; p.hintUsed=false; p.textRevealed=false;
  p.audioPlayed=false; p.audioPlays=0; p.audioError=''; p.draft=''; p.outcome=null;
}
export function previewFeedback(result,task) {
  if (result==='independent-correct') return [
    task.format==='audio'?'在本次听音条件下选对了':'这次独立完成了',
    task.format==='audio'?'已记录实际播放次数和未显示词形的条件。单次听辨不代表听说能力已稳定。':
      '只说明本次要求与材料条件下的表现，不自动推断保持、迁移或其他能力。','success'];
  if (result==='practice-correct') return ['支持性练习完成',
    '这道题是在看过答案之后进行的辨认，不是新的独立提取证据。','info'];
  if (result==='supported-correct') return ['获得支持后完成了',
    '提示或已展示的文本帮助了作答；这次结果不会冒充无提示、纯听觉或长期保持表现。','info'];
  if (result==='unverified') return ['记录了尝试，暂不判为独立正确或错误',
    task.format==='audio'?'播放失败后改为文字支持，不能评价纯听音表现。':'开放回答可能有合理的其他表达，固定样本规则无法可靠判断。','warning'];
  if (result==='unknown') return ['先从理解开始','主动选择“不知道”也是有效的观察；随后可以看解释或更简单的练习。','info'];
  return ['这次还没完成目标表现','先看清正确联系，再决定是否需要调整材料或支持；不是永久能力标签。','warning'];
}
