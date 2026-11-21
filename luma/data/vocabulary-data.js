// Authored vocabulary learning materials for R2 UX only — not exam questions or a content schema.
export const vocabularyGuides = {
  short: {
    materialId:'r2.learn.short.guide.v1', word:'short', ipa:'英 /ʃɔːt/ · 美 /ʃɔːrt/',
    partOfSpeech:'形容词 adj.', meaning:'短的；矮的', focus:'这次先认识“短的”这个意思。',
    example:'This is a short story.', translation:'这是一个短故事。',
    pronunciation:'short',
    sections:[
      {id:'forms', title:'词形变化', teaser:'shorter / shortest',
        lines:[['shorter','比较级：更短的 / 更矮的'],['shortest','最高级：最短的 / 最矮的'],['例句','My ruler is shorter than yours. 我的尺子比你的短。']]},
      {id:'meanings', title:'不同意思，结合句子理解', teaser:'长短 · 身高 · 缺少',
        lines:[['长度 / 时间短','a short story 一个短故事；a short break 短暂休息'],['个子矮','a short boy 一个个子矮的男孩'],['不够 / 缺少','We are short of time. 我们时间不够。']]},
      {id:'phrases', title:'常见搭配与短语', teaser:'short hair · be short of · in short',
        lines:[['short hair','短发'],['be short of','缺少；不足'],['in short','简而言之 / 总之']]},
      {id:'tip', title:'学习提醒', teaser:'不要一次把所有意思都背完',
        lines:[['辨认方法','先看 short 修饰什么：story 指故事篇幅，boy 指身高。'],['注意','做当前练习时只考“短的”，其他用法以后按需要再练。']]}
    ]
  },
  sometimes: {
    materialId:'r2.learn.sometimes.guide.v1', word:'sometimes', ipa:'/ˈsʌmtaɪmz/',
    partOfSpeech:'副词 adv.', meaning:'有时；偶尔', focus:'这次重点是把四个相似表达分清。',
    example:'I sometimes walk to school.', translation:'我有时步行上学。',
    pronunciation:'sometimes',
    sections:[
      {id:'contrast', title:'四个易混表达', teaser:'sometimes / sometime / some time / some times',
        lines:[['sometimes','有时；偶尔。I sometimes read at night. 我有时晚上读书。'],
          ['sometime','某个时候（不指具体时间）。See you sometime next week. 下周找个时候见。'],
          ['some time','一段时间。I need some time to think. 我需要一些时间想一想。'],
          ['some times','分开的两个词；较少单独用于表示“几次”，日常通常说 several times。']]},
      {id:'examples', title:'再读两个自然例句', teaser:'用句意判断，而不是死记空格',
        lines:[['频率','She sometimes goes to the park. 她有时去公园。'],
          ['时间长度','Please give me some time. 请给我一点时间。']]},
      {id:'tip', title:'快速辨认提醒', teaser:'有时＝sometimes（一个词）',
        lines:[['什么时候用','句子表示“偶尔做某事”时，优先考虑 sometimes。'],
          ['别混淆','sometime 没有结尾的 s，表示某个时候；some time 分开写，强调一段时间。']]}
    ]
  }
};
