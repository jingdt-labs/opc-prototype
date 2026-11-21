// R1 fixture only: eight authored examples represent a closed ~500-word goal.
// No claim that the remaining words are present or assessed.
export const sampleWords = [
  {
    id: 'because', text: 'because', sense: '因为', pos: '连词',
    note: '连接原因和结果，回答“为什么”。',
    contrast: 'because 解释原因；but 表示转折。',
    hint: '想想说出一个原因时，英文常用什么连接词。',
    choices: ['但是', '因为', '如果', '所以'],
    revisitChoices: ['即使', '因此', '因为', '然而'],
    answer: '因为'
  },
  {
    id: 'through', text: 'through', sense: '穿过', pos: '介词',
    note: '表示从某处的一端进入，再到另一端。',
    contrast: '这里聚焦“穿过”的常见空间含义。',
    hint: '想象从隧道的一端走到另一端。',
    choices: ['在……下面', '在……旁边', '穿过', '围绕'],
    revisitChoices: ['超过', '穿过', '停留在', '沿着'],
    answer: '穿过'
  },
  {
    id: 'enough', text: 'enough', sense: '足够的', pos: '形容词 / 副词',
    note: '数量或程度达到所需要的程度。',
    contrast: 'enough time 表示“足够的时间”。',
    hint: '如果时间不多不少，刚好满足需要，该怎么说？',
    choices: ['额外的', '足够的', '困难的', '普通的'],
    revisitChoices: ['适合的', '最少的', '足够的', '相反的'],
    answer: '足够的'
  },
  {
    id: 'decide', text: 'decide', sense: '决定', pos: '动词',
    note: '在几个可能的做法之间作出选择。',
    contrast: 'decide to do something：决定做某事。',
    hint: '考虑几个选项后，最终选定一个做法。',
    choices: ['描述', '发现', '忘记', '决定'],
    revisitChoices: ['决定', '拒绝', '相信', '邀请'],
    answer: '决定'
  },
  {
    id: 'instead', text: 'instead', sense: '代替；反而', pos: '副词',
    note: '表示没有选择原来的做法，而选择另一种。',
    contrast: '常与 instead of 搭配，表达“代替……”。',
    hint: '原本想坐车，最后改成步行。',
    choices: ['终于', '至少', '代替；反而', '同时'],
    revisitChoices: ['因此', '代替；反而', '附近', '从不'],
    answer: '代替；反而'
  },
  {
    id: 'borrow', text: 'borrow', sense: '借入', pos: '动词',
    note: '从别人那里借来东西，之后通常要归还。',
    contrast: 'borrow 是借入；lend 是借出。',
    hint: '你向同桌拿一本书暂时使用，是“借入”还是“借出”？',
    choices: ['归还', '购买', '借出', '借入'],
    revisitChoices: ['借入', '保存', '借出', '运送'],
    answer: '借入'
  },
  {
    id: 'during', text: 'during', sense: '在……期间', pos: '介词',
    note: '说明某件事发生在一段时间之内。',
    contrast: 'during the holiday：在假期期间。',
    hint: '用来指出某件事发生在哪段时间里。',
    choices: ['在……之后', '在……期间', '在……之外', '在……之前'],
    revisitChoices: ['在……附近', '在……期间', '在……下面', '在……之间'],
    answer: '在……期间'
  },
  {
    id: 'although', text: 'although', sense: '虽然；尽管', pos: '连词',
    note: '承认一种情况，同时引出不受其阻碍的另一情况。',
    contrast: 'although it is raining：虽然正在下雨。',
    hint: '前半句有困难，但后半句的事情还是发生了。',
    choices: ['除非', '因为', '虽然；尽管', '因此'],
    revisitChoices: ['即使……也不', '同时', '所以', '虽然；尽管'],
    answer: '虽然；尽管'
  }
];
export const wordById = Object.fromEntries(sampleWords.map(word => [word.id, word]));
export const starterIds = ['because', 'through', 'enough', 'decide'];
export const secondIds = ['instead', 'borrow', 'during', 'although'];
export const intents = [
  { id: 'homework', title: '作业里常遇到不认识的词', detail: '先补常见词义，让阅读不再处处卡住。' },
  { id: 'exam', title: '想读懂更多中考英语题目', detail: '从高价值基础词汇开始，慢慢减少猜测。' },
  { id: 'foundation', title: '想重新打好词汇基础', detail: '选择适合自己的起点，持续积累。' }
];
export const goalScope = '约 500 个高频中考词汇（封闭范围）';
export const goalPerformance = '看到英文，独立辨认常见书面词义';
export const goalEvidence = '用无提示作答观察当次表现；隔一段时间再复检是否记得';
export const seedHistory = [
  { id: 'seed-1', wordId: 'because', daysAgo: 4, result: 'independent-correct', kind: 'first', response: '因为', exposure: false, hintUsed: false, source: 'sample-history' },
  { id: 'seed-2', wordId: 'because', daysAgo: 1, result: 'incorrect', kind: 'review', response: '所以', exposure: false, hintUsed: false, source: 'sample-history' }
];
