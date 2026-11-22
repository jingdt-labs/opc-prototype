// R3 prototype fixtures and pure decisions. All aggregate counts are illustrative, never learner measurements.
import { sampleWords } from '../data/sample-data.js';
import { vocabularyGuides } from '../data/vocabulary-data.js';

export const GOAL_SIZE = 500;
export const DEMOS = {
  start: {label:'第一次开始', base:0, gained:0, strengthen:0, unknown:500, note:'还在逐步了解原有基础。没有观察过，不代表不会。'},
  growing: {label:'持续学习中', base:92, gained:136, strengthen:78, unknown:194, note:'一部分词汇已经在间隔后的独立识词和简单句中表现稳定。'},
  review: {label:'阶段测评后', base:96, gained:202, strengthen:112, unknown:90, note:'阶段测评发现少量句子理解仍不稳定，后续会优先巩固。'},
  near: {label:'接近目标', base:104, gained:349, strengthen:30, unknown:17, note:'已经很接近目标，但少数薄弱联系和证据缺口仍需解决。'},
  gap: {label:'表现良好，证据不足', base:105, gained:380, strengthen:2, unknown:13, note:'已观察到的内容表现不错，仍不能用局部优秀代表完整范围。'},
  achieved: {label:'目标已达成', base:107, gained:388, strengthen:3, unknown:2, note:'少量表现波动与局部待复核仍然存在；整体范围的独立词义理解、跨时间保持和新句理解已有充分、可复核证据。', verified:true, evidenceReview:'sufficient', materialRisk:false}
};
export function progressFor(key='start') {
  const p=DEMOS[key]||DEMOS.start;
  return {...p, key, reached:p.base+p.gained, total:GOAL_SIZE,
    remaining:p.strengthen+p.unknown, status:p.verified?'achieved':p.unknown?'pending':'review'};
}
export function canDeclareGoal(p) {
  // This is an authored whole-Goal review verdict, not a universal score or zero-error formula.
  return Boolean(p && p.verified && p.evidenceReview==='sufficient' && p.materialRisk===false);
}
export function goalMessage(key) {
  const p=progressFor(key);
  if(canDeclareGoal(p)) return {
    title:'这一阶段的学习目标已达成',
    detail:'模拟的全范围回顾已综合独立词义理解、跨时间保持、新句理解与阶段测评。虽然有少量偶发波动和局部待复核，仍未发现足以改变整体结论的重大薄弱项或证据缺口。',
    next:'已有充分依据确认本阶段目标；可以保持复习，是否开始新目标由你确认。'
  };
  if(key==='gap') return {
    title:'表现不错，但还不能宣布达成',
    detail:'已观察的词汇大多表现稳定，但仍有 13 个学习重点缺少足以判断的证据。未知不等于不会，也不能当成已达成。',
    next:'接下来优先补足证据，而不是机械重新学习全部内容。'
  };
  if(key==='near') return {
    title:'正在接近目标，还需要一点巩固',
    detail:'一些词的书面词义或新句理解还不稳定，也有尚未观察充分的部分。已经取得的进步仍然有效。',
    next:'先解决薄弱联系，并在适当阶段做独立复核。'
  };
  return {
    title:'目标正在推进中',
    detail:'已有基础和学习后的进步分别计算。刚学会、刚答对、或只是接触过，不会自动成为长期稳定掌握。',
    next:'继续当前任务，逐步补上值得学、值得复习和证据尚不足的部分。'
  };
}

const context = {
  short: {sentence:'This is a short story.', answer:'这是一个短故事', choices:['这是一个短故事','这是一个有趣的故事','这是一个困难的故事'], gloss:'story：故事', second:'She took a short break.', secondAnswer:'她休息了一小会儿', secondChoices:['她休息了一小会儿','她休息了一整天','她讲了一个故事']},
  because: {sentence:'I stayed home because I felt ill.', answer:'因为身体不舒服，所以我待在家里', choices:['因为身体不舒服，所以我待在家里','因为天气好，所以我出门了','我待在家里，因为要看书'], gloss:'stayed home：待在家 · felt ill：身体不舒服', second:'She smiled because she was happy.', secondAnswer:'因为开心，所以她笑了', secondChoices:['因为开心，所以她笑了','虽然不开心，她还是笑了','她笑了，所以很累']},
  borrow: {sentence:'Can I borrow your pen?', answer:'我可以借你的笔吗？', choices:['我可以借你的笔吗？','我可以把笔借给你吗？','我可以买你的笔吗？'], gloss:'pen：笔', second:'May I borrow this book?', secondAnswer:'我可以借这本书吗？', secondChoices:['我可以借这本书吗？','我可以归还这本书吗？','我可以写一本书吗？']},
  sometimes: {sentence:'I sometimes walk to school.', answer:'我有时步行去学校', choices:['我有时步行去学校','我每天都步行去学校','我有一天会去学校'], gloss:'walk to school：步行上学', second:'We sometimes play basketball.', secondAnswer:'我们有时打篮球', secondChoices:['我们有时打篮球','我们正在打篮球','我们从来不打篮球']},
  through: {sentence:'We walked through the park.', answer:'我们穿过公园', choices:['我们穿过公园','我们绕着公园走','我们在公园旁停下'], gloss:'park：公园 · walked：走了', second:'The train went through a tunnel.', secondAnswer:'火车穿过了一条隧道', secondChoices:['火车穿过了一条隧道','火车停在隧道前','火车绕开了隧道']},
  enough: {sentence:'We have enough time.', answer:'我们有足够的时间', choices:['我们有足够的时间','我们没有时间','我们花了太多时间'], gloss:'time：时间', second:'Is the room big enough?', secondAnswer:'房间够大吗？', secondChoices:['房间够大吗？','房间在哪里？','房间太大了']},
  decide: {sentence:'I decided to stay home.', answer:'我决定待在家里', choices:['我决定待在家里','我忘记回家','我被要求离开家'], gloss:'stay home：待在家', second:'She decided to try again.', secondAnswer:'她决定再试一次', secondChoices:['她决定再试一次','她不想再试了','她已经忘记了']},
  instead: {sentence:'I had tea instead of coffee.', answer:'我没有喝咖啡，改喝茶', choices:['我没有喝咖啡，改喝茶','我同时喝了茶和咖啡','我只喝了咖啡'], gloss:'tea：茶 · coffee：咖啡', second:'He walked instead of taking a bus.', secondAnswer:'他没有坐公交，改为步行', secondChoices:['他没有坐公交，改为步行','他步行去乘坐公交','他没有出门']},
  during: {sentence:'I read during the holiday.', answer:'我在假期期间读了书', choices:['我在假期期间读了书','我假期之后才开始读书','我假期前没有读书'], gloss:'holiday：假期', second:'It rained during the night.', secondAnswer:'夜间下了雨', secondChoices:['夜间下了雨','雨在早晨停了','一整天都没有下雨']},
  although: {sentence:'Although it rained, we went out.', answer:'虽然下雨，我们还是出门了', choices:['虽然下雨，我们还是出门了','因为下雨，我们待在家','雨停后，我们才出门'], gloss:'rained：下雨 · went out：出门', second:'Although he was tired, he kept reading.', secondAnswer:'虽然累了，他还是继续阅读', secondChoices:['虽然累了，他还是继续阅读','因为累了，他停止阅读','他休息后才开始阅读']}
};
const extra=[
  {id:'short',text:'short',sense:'短的',pos:'形容词',note:'说长度或时间比较短。',contrast:'short story 是短故事；短不是困难的意思。',choices:['短的','沉重的','困难的','安静的'],answer:'短的'},
  {id:'sometimes',text:'sometimes',sense:'有时',pos:'副词',note:'表示有些时候发生，不是一直发生。',contrast:'sometimes（有时）与 sometime（某个时候）容易混淆。',choices:['总是','有时','很快','从不'],answer:'有时'}
];
export const WORDS=[...extra,...sampleWords].map(w=>{
  const c=context[w.id];
  return {...w, sentence:c.sentence, sentenceMeaning:c.answer, sentenceChoices:c.choices,
    second:c.second, secondAnswer:c.secondAnswer, secondChoices:c.secondChoices, gloss:c.gloss,
    accepted:w.id==='because'?['因为','由于']:w.id==='short'?['短的','短']:w.id==='sometimes'?['有时','偶尔']:[w.sense],
    guide:vocabularyGuides[w.id]||null};
});
export const WORD_BY_ID=Object.fromEntries(WORDS.map(w=>[w.id,w]));
// Meaning-check alternatives differ from the day-to-day practice choices.
const assessmentChoices={
  short:['缓慢的','短的','宽阔的','柔软的'],
  sometimes:['有时','从未','总是','立刻']
};
export function taskFor(wordId, type='meaning', assessment=false) {
  const w=WORD_BY_ID[wordId];
  if(!w) throw new Error('Unknown word: '+wordId);
  const contextMode=type==='context';
  return {
    wordId, type, assessment,
    stimulus:contextMode?(assessment?w.second:w.sentence):w.text,
    expected:contextMode?(assessment?w.secondAnswer:w.sentenceMeaning):w.answer,
    choices:contextMode?(assessment?w.secondChoices:w.sentenceChoices):(assessment?(w.revisitChoices||assessmentChoices[w.id]):w.choices),
    accepted:contextMode?[assessment?w.secondAnswer:w.sentenceMeaning]:w.accepted,
    gloss:w.gloss, word:w,
    materialId:'r3.'+wordId+'.'+type+(assessment?'.independent-v2':'.learning-v1')
  };
}
export function evaluateResponse(task, response, mode, supported=false) {
  if(response===null || String(response).trim()==='') return 'unknown';
  const normalized=x=>String(x).toLowerCase().replace(/[。！？!?,，\s]/g,'').trim();
  const good=task.accepted.some(a=>normalized(a)===normalized(response));
  if(good) return supported?'supported-correct':'independent-correct';
  return mode==='recall'?'unverified':'incorrect';
}
export function startQueue(events=[], visit=0, scenario='start') {
  const plans={
    start:['short:meaning','because:meaning','borrow:meaning','borrow:context','sometimes:context'],
    growing:['because:meaning','borrow:context','sometimes:meaning','through:context','short:context'],
    review:['because:meaning','sometimes:context','borrow:context','enough:meaning','through:context'],
    near:['during:context','although:context','instead:meaning','borrow:context','decide:context'],
    gap:['through:context','during:meaning','although:context','instead:meaning','enough:context'],
    achieved:['because:context','short:context','borrow:meaning','sometimes:context']
  };
  const base=plans[scenario]||plans.start;
  const latest=new Map();
  for(const event of [...events].reverse())
    if(event.kind==='attempt'&&!latest.has(event.wordId)) latest.set(event.wordId,event);
  const recent=[...latest.values()].filter(e=>WORD_BY_ID[e.wordId]);
  const firstWeak=recent.find(e=>['unknown','incorrect','unverified'].includes(e.result))
    || recent.find(e=>e.result==='supported-correct');
  const shift=visit===0?0:visit%base.length;
  const rotated=base.slice(shift).concat(base.slice(0,shift));
  if(firstWeak) {
    const next=firstWeak.wordId+':'+(firstWeak.type==='context'?'context':'meaning');
    return [next,...rotated.filter(x=>x!==next)].slice(0,5).map(parseItem);
  }
  return rotated.map(parseItem);
}
function parseItem(item) {
  const [wordId,type]=item.split(':');
  return {wordId,type};
}
// Small, contrasting reference observations. They are authored fiction, not a recorded learner baseline.
export const ASSESSMENT_REFERENCE = {
  short:{prior:'原先独立认识“短的”',meaning:'保持已有基础'},
  borrow:{prior:'原先认得“借入”，但换句子理解不稳',meaning:'检验句子理解'},
  because:{prior:'原先需要选项帮助才能理解词义',meaning:'检验独立辨认'},
  sometimes:{prior:'原先简单句理解不稳定',meaning:'检验换句理解'}
};
export function assessmentComparison(event) {
 const prior=ASSESSMENT_REFERENCE[event.wordId];
 if(!prior)return null;
 const independent=event.result==='independent-correct';
 const updated=independent?(event.wordId==='short'?'本次换一组选项仍独立辨认': '本次在变化材料中独立完成') :
   event.result==='unknown'?'本次选择了“不知道”，适合再学习和复核':
   event.result==='unverified'?'本次回答不能可靠评价，暂不下结论':
   '本次未独立完成，接下来针对性巩固';
 return {wordId:event.wordId, word:WORD_BY_ID[event.wordId]?.text, prior:prior.prior, updated,
   interpretation:independent?(event.wordId==='short'?'进一步支持原有基础': '与预设起点相比出现积极表现，仍待跨时间复核'):'尚不能确认预设薄弱点已经改善',
   next:independent?'后续保持观察': event.type==='context'?'换更容易理解的句子再巩固':'先重新建立词义联系'};
}
export function assessmentQueue() {
  return [
    {wordId:'short',type:'meaning'},
    {wordId:'borrow',type:'context'},
    {wordId:'because',type:'meaning'},
    {wordId:'sometimes',type:'context'}
  ];
}
export function sessionSummary(events) {
  const attempts=events.filter(e=>e.kind==='attempt');
  return {
    independent:attempts.filter(e=>e.result==='independent-correct').length,
    supported:attempts.filter(e=>e.result==='supported-correct').length,
    pending:attempts.filter(e=>['unknown','incorrect','unverified'].includes(e.result)).length,
    words:[...new Set(attempts.map(e=>e.wordId))],
    hasContext:attempts.some(e=>e.type==='context')
  };
}
export function suggestedAction(events) {
  const byWord=new Map();
  for(const event of [...events].reverse())
    if(event.kind==='attempt'&&!byWord.has(event.wordId)) byWord.set(event.wordId,event);
  const latest=[...byWord.values()].find(e=>['unknown','incorrect','unverified','supported-correct'].includes(e.result));
  if(latest) return (latest.result==='supported-correct'?'稍后独立确认 ':'先巩固 ')+(WORD_BY_ID[latest.wordId]?.text||'刚才学习的内容')+'，再继续学习。';
  return '下一次会结合刚才的表现，安排少量新内容和适当复习。';
}
