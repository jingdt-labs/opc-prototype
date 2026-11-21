// R2 review-only learning materials. Authored samples, not actual exam questions.
// These activities never change the learner's confirmed Goal or R1 Evidence.
export const studioScenarios = [
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
export const scenarioById = Object.fromEntries(studioScenarios.map(item=>[item.id,item]));
export const exampleById = taskExamples;
