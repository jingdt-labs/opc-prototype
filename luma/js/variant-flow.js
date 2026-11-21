import { scenarioById, exampleById } from '../data/experience-data.js';
import { vocabularyGuides } from '../data/vocabulary-data.js';

// R2 review preview is intentionally separate from the learner's R1 Goal, Session
// and Evidence. No schema engine or production learning policy is implied.
const normalizedMeaning = value => String(value ?? '').trim().toLowerCase()
  .replace(/[\s。．，,！!]+/g,'');
const normalizedSpelling = value => String(value ?? '').trim().toLowerCase();
// Choices are authored options (including English phrases): their internal spaces are meaningful.
const normalizedFor = task => task.format==='choice' || task.format==='audio' ||
  task.performance==='written-form-production' ? normalizedSpelling : normalizedMeaning;
const relevantWord = task => task.learnKey || task.wordId;
const recent = (at, now) => {
  const delta = Date.parse(now) - Date.parse(at);
  return Number.isFinite(delta) && delta >= 0 && delta < 86400000; // 24h demo exposure window, not a retention rule
};
export function previewLearnExposure(s, section='core', now=new Date()) {
  const task=currentPreview(s), p=s.previewSession;
  const guide=task && vocabularyGuides[task.learnKey];
  if (!guide || !p || p.phase!=='learn') return false;
  if (!Array.isArray(s.previewLearnEvents)) s.previewLearnEvents=[];
  if (section!=='core' && section!=='audio' && !guide.sections.some(x=>x.id===section)) return false;
  if (section!=='core' && p.openSections?.includes(section)) return true;
  if (section!=='core') p.openSections=[...(p.openSections||[]),section];
  s.previewLearnEvents.push({
    previewId:p.id, taskId:task.id, wordId:relevantWord(task),
    materialId:guide.materialId, section, answerBearing:true,
    afterFeedback:p.learnFromFeedback, at:new Date(now).toISOString(),
    source:'r2-review-learn-exposure'
  });
  return true;
}
export function previewOpenLearn(s, now=new Date()) {
  const task=currentPreview(s), p=s.previewSession;
  if (!task?.learnKey || !vocabularyGuides[task.learnKey] || !p) return false;
  if (p.phase!=='ask' && p.phase!=='feedback') return false;
  const fromFeedback=p.phase==='feedback';
  p.learnReturn=fromFeedback && p.index+1<p.queue.length?'next':'current';
  p.learnFromFeedback=fromFeedback;
  p.openSections=[];
  p.phase='learn';
  return previewLearnExposure(s,'core',now);
}
export function previewLearnPractice(s) {
  const p=s.previewSession;
  if (!p || p.phase!=='learn' || !currentPreview(s)) return false;
  if (p.learnReturn==='next') {
    p.phase='feedback'; // previewNext owns the transition and clears transient fields
    previewNext(s);
  } else {
    p.phase='ask'; p.hintUsed=false; p.draft='';
    p.audioPlayed=false; p.audioPlays=0; p.audioError=''; p.textRevealed=false; p.outcome=null;
  }
  p.learnReturn=null; p.learnFromFeedback=false; p.openSections=[];
  return true;
}
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
    queue:scenario.taskIds.slice(), index:0, phase:scenario.startInLearn?'learn':'ask',
    hintUsed:false, textRevealed:false, audioPlayed:false,
    audioPlays:0, audioError:'', draft:'', outcome:null,
    learnReturn:null, learnFromFeedback:false, openSections:[],
    finished:false, paused:false
  };
  s.previewEvents = Array.isArray(s.previewEvents) ? s.previewEvents : [];
  s.previewLearnEvents = Array.isArray(s.previewLearnEvents) ? s.previewLearnEvents : [];
  if (scenario.startInLearn) previewLearnExposure(s,'core');
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
  const normalize=normalizedFor(task);
  const answered=response!==null && normalize(raw).length>0;
  const expected=task.format==='text' ? (task.accepted||[task.expected]) : [task.expected];
  const correct=answered && expected.some(x=>normalize(x)===normalize(raw));
  const at=new Date(now).toISOString();
  const priorAttempts=(s.previewEvents||[]).filter(x=>x.wordId===relevantWord(task) && x.previewId===p.id);
  const sameMaterialRecent=(s.previewEvents||[]).filter(x=>x.materialId===task.materialId && recent(x.at,at));
  const learnExposures=(s.previewLearnEvents||[]).filter(x=>x.wordId===relevantWord(task) && recent(x.at,at));
  const exposed=p.textRevealed || !!task.supportedByDesign || learnExposures.length>0 ||
    priorAttempts.some(x=>x.shownAnswerAfter) || sameMaterialRecent.length>0;
  const supported=p.hintUsed || exposed;
  let result='incorrect';
  if (!answered) result='unknown';
  else if (task.format==='audio' && !p.audioPlayed && p.textRevealed) {
    result=correct ? 'supported-correct' : 'unverified';
  } else if (correct && (task.supportedByDesign || learnExposures.length ||
      priorAttempts.some(x=>x.shownAnswerAfter) || sameMaterialRecent.length)) result='practice-correct';
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
    textRevealed:p.textRevealed, wasShownPriorAnswer:exposed,
    learnedBeforeAttempt:learnExposures.length>0,
    learnSectionsSeen:[...new Set(learnExposures.map(x=>x.section))],
    priorAttempts:priorAttempts.length, sameMaterialRecent:sameMaterialRecent.length>0,
    reviewType:'practice-not-delayed-review', isDelayedReview:false,
    audioPlayed:p.audioPlayed, audioPlays:p.audioPlays,
    shownAnswerAfter:true, at,
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
  if (result==='practice-correct') return ['这次巩固练习做对了',
    '之前已经看过相关学习内容或答案；这是即时练习，不等于首次独立掌握，也不表示跨时间保持。','info'];
  if (result==='supported-correct') return ['获得支持后完成了',
    '提示或已展示的文本帮助了作答；这次结果不会冒充无提示、纯听觉或长期保持表现。','info'];
  if (result==='unverified') return ['记录了尝试，暂不判为独立正确或错误',
    task.format==='audio'?'播放失败后改为文字支持，不能评价纯听音表现。':'开放回答可能有合理的其他表达，固定样本规则无法可靠判断。','warning'];
  if (result==='unknown') return ['先从理解开始','主动选择“不知道”也是有效的观察；随后可以看解释或更简单的练习。','info'];
  return ['这次还没完成目标表现','先看清正确联系，再决定是否需要调整材料或支持；不是永久能力标签。','warning'];
}
