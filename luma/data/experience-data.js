// R2 review-only learning materials. Authored samples, not actual exam questions.
// These activities never change the learner's confirmed Goal or R1 Evidence.
export const studioScenarios = [
  { id:'learn-short', letter:'L1', title:'不认识？先看懂 short', subtitle:'Learn · 先学再练',
    goal:'读懂 short 在简单句中的“短的”意思', performance:'书面词义辨认',
    what:'先看到词义、发音与一个简单例句；其他义项、词形和搭配按需展开，再去练习。', startInLearn:true, taskIds:['learn-short-meaning'] },
  { id:'learn-sometimes', letter:'L2', title:'似乎认识？试试 sometimes', subtitle:'Practice → Learn',
    goal:'在句子中区分 sometimes 等易混表达', performance:'语境中的词语辨认',
    what:'先独立选择。若混淆，再看有针对性的对比解释，回到一条新的练习句。', taskIds:['choose-sometimes'] },
  { id:'retrieve', letter:'A', title:'不看选项，自己想起词义', subtitle:'主动意义提取',
    goal:'看见英文，独立说出它的常见意义', performance:'主动意义提取',
    what:'同一个 because，从“辨认选项”变成“独立想起词义”。遇到困难时，切换为有帮助的辨认练习。', taskIds:['retrieve-because'] },
  { id:'listen', letter:'B', title:'听见单词，再选择意义', subtitle:'听觉理解',
    goal:'不看英文词形，根据词音辨认意义', performance:'无文本的听觉词义辨认',
    what:'作答前隐藏词形和释义；可实际播放浏览器英文语音。浏览器无语音时明确转为支持性文本学习。', taskIds:['hear-because'] },
  { id:'spell', letter:'C', title:'从意义写出英文', subtitle:'词形产出',
    goal:'根据准确意义，独立写出目标英文词形', performance:'书面词形产出',
    what:'输入英文、按 Enter 提交。能辨认词义并不证明能够正确拼写。', taskIds:['spell-borrow'] },
  { id:'context', letter:'D', title:'在句子里理解表达', subtitle:'语境意义理解',
    goal:'在自然、低负担的句子中理解目标联系', performance:'简短语境意义理解',
    what:'用一句难度适当的英文观察 although 的让步关系，不把单词选择题直接当作语境理解。', taskIds:['context-although'] },
  { id:'rich', letter:'E', title:'一项任务，分层使用多种材料', subtitle:'丰富材料组合',
    goal:'读句子，识别 because 引出的原因', performance:'语境中的原因关系辨认',
    what:'同一词汇在新 Goal 下用句子作材料；例句比较、短语和发音留到反馈后按需展开。', taskIds:['rich-because'] }
];
export const taskExamples = {
  'retrieve-because': {
    id:'retrieve-because', scenario:'retrieve', wordId:'because', format:'text',
    performance:'active-recall', materialId:'r2.retrieve.because.v1',
    instruction:'不用看选项，试着想起它的中文意思。',
    stimulus:'because', expected:'因为',
    accepted:['因为','由于'], hint:'它是解释原因时常用的连接词。',
    explanation:'because 表示“因为”，常用于连接原因和结果。这里不要求你同时掌握所有用法。',
    afterMistake:'recognize-because'
  },
  'recognize-because': {
    id:'recognize-because', scenario:'retrieve', wordId:'because', format:'choice',
    performance:'written-recognition', materialId:'r2.support.because.v1',
    instruction:'先换成有选项的练习，帮助建立词形和意义的联系。',
    stimulus:'because', expected:'因为',
    choices:['但是','因为','尽管','除非'],
    hint:'想一想：这是表示原因，还是表示转折？',
    explanation:'选项辨认是重建联系的支持练习，不代表已经独立回忆出词义。',
    supportedByDesign:true
  },
  'hear-because': {
    id:'hear-because', scenario:'listen', wordId:'because', format:'audio',
    performance:'auditory-recognition', materialId:'r2.audio.because.browser-tts.v1',
    instruction:'先听英文发音，再选择它表达的意义。',
    audioText:'because', expected:'因为',
    choices:['但是','因为','如果','尽管'],
    hint:'这是连接句子、解释原因的常见词。',
    explanation:'because 表示“因为”。这次只观察在实际播放条件下的听觉词义辨认；不评价发音，也不代表所有口音都能听懂。'
  },
  'spell-borrow': {
    id:'spell-borrow', scenario:'spell', wordId:'borrow', format:'text',
    performance:'written-form-production', materialId:'r2.spell.borrow.v1',
    instruction:'请写出表示“从别人那里借入物品”的英文动词。',
    stimulus:'借入', expected:'borrow', accepted:['borrow'],
    context:'例如：我可以借你的尺子吗？',
    hint:'以 b 开头，共 6 个字母。',
    explanation:'borrow 是“借入”，lend 是“借出”。本题观察具体英文词形，不以“认识词义”代替拼写表现。'
  },
  'context-although': {
    id:'context-although', scenario:'context', wordId:'although', format:'choice',
    performance:'context-meaning', materialId:'r2.context.although.v1',
    instruction:'读一读这句话，选出与句意相符的理解。',
    sentence:'Although it was raining, we went out.',
    translationSupport:'raining：正在下雨 · went out：出门',
    expected:'虽然下雨，我们仍然出门',
    choices:['下雨，所以我们待在家','虽然下雨，我们仍然出门','我们等雨停了才出门','我们出门以后才下雨'],
    hint:'注意 although 所连接的两部分，有“尽管这样，仍然……”的关系。',
    explanation:'although 表示“虽然／尽管”。这里即使下雨，出门这件事仍然发生。选择题只支持当前句子的理解表现。',
    extra:[{label:'自然表达',body:'Although it was raining, we went out. → 虽然在下雨，我们还是出门了。'}]
  },
  'rich-because': {
    id:'rich-because', scenario:'rich', wordId:'because', format:'choice',
    performance:'cause-in-context', materialId:'r2.rich.because.v1',
    instruction:'读句子，找出主人公待在家里的原因。',
    sentence:'I stayed home because I felt ill.',
    translationSupport:'stayed home：待在家 · felt ill：身体不舒服',
    expected:'身体不舒服',
    choices:['要去学校','天气很热','身体不舒服','想借一本书'],
    hint:'because 后面的部分通常解释前面行为的原因。',
    explanation:'because 引出原因：I felt ill（身体不舒服）解释了为什么 I stayed home。',
    extra:[
      {label:'延伸辨析 · 按需展开',body:'because + 句子：I stayed home because I felt ill.  /  because of + 名词短语：I stayed home because of the rain. 本轮不单独评价这项辨析。'},
      {label:'例句再看一眼',body:'She smiled because she was happy. → 她笑了，因为她很开心。'}
    ],
    audioText:'I stayed home because I felt ill.'
  }
};
Object.assign(taskExamples, {
  'learn-short-meaning': {
    id:'learn-short-meaning', scenario:'learn-short', wordId:'short', learnKey:'short',
    format:'choice', performance:'written-recognition', materialId:'r2.learn.short.choice.v1',
    sentence:'This is a short story.', instruction:'这句话里的 short 表示什么意思？',
    expected:'短的', choices:['短的','安静的','困难的','遥远的'],
    hint:'看看 story（故事）前面的形容词，说的是长短。',
    explanation:'a short story 是“一个短故事”。short 还有“矮的”和“缺少的”等用法，要结合句子判断。'
  },
  'choose-sometimes': {
    id:'choose-sometimes', scenario:'learn-sometimes', wordId:'sometimes', learnKey:'sometimes',
    format:'choice', performance:'context-meaning', materialId:'r2.learn.sometimes.first.v1',
    sentence:'I ___ walk to school.', instruction:'想表达“我有时步行上学”，应该填哪一个？',
    expected:'sometimes', choices:['some time','sometime','sometimes','some times'],
    hint:'这里需要表示频率的副词，意思是“有时”。',
    explanation:'sometimes 是“有时”，表示事情偶尔发生；sometime 指“某个时候”，some time 指“一段时间”。',
    afterMistake:'choose-sometimes-again'
  },
  'choose-sometimes-again': {
    id:'choose-sometimes-again', scenario:'learn-sometimes', wordId:'sometimes', learnKey:'sometimes',
    format:'choice', performance:'context-meaning', materialId:'r2.learn.sometimes.followup.v1',
    sentence:'We ___ play basketball after school.',
    instruction:'换一个简单句子，再认一认“有时”应该怎么写。',
    expected:'sometimes', choices:['sometime','sometimes','some times','some time'],
    hint:'想表达某件事偶尔会发生，而不是“一段时间”。',
    explanation:'We sometimes play basketball after school.（我们有时放学后打篮球。）本轮紧接着学习，仍是即时巩固。',
    supportedByDesign:true
  }
});
export const scenarioById = Object.fromEntries(studioScenarios.map(item=>[item.id,item]));
export const exampleById = taskExamples;
