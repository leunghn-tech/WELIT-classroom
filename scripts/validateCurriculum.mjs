import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.join(here, '../client/src/data/curriculumDB.json');
const database = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
const p1Bank = (await import('../client/src/data/questionBanks/chinese/p1.js')).default;
const { chineseQuestionBanks, chineseQuestionUnitMetadata } = await import('../client/src/data/questionBanks/chinese/index.js');
const p1EnglishBank = (await import('../client/src/data/questionBanks/english/p1.js')).default;
const p2EnglishBank = (await import('../client/src/data/questionBanks/english/p2.js')).default;
const p3EnglishBank = (await import('../client/src/data/questionBanks/english/p3.js')).default;
const p4EnglishBank = (await import('../client/src/data/questionBanks/english/p4.js')).default;
const p5EnglishBank = (await import('../client/src/data/questionBanks/english/p5.js')).default;
const p6EnglishBank = (await import('../client/src/data/questionBanks/english/p6.js')).default;
const { mathQuestionBanks } = await import('../client/src/data/questionBanks/math/index.js');
const { englishQuestionBanks } = await import('../client/src/data/questionBanks/english/index.js');
const englishCatalog = (await import('../client/src/data/englishCatalog.js')).default;
const chineseCatalog = (await import('../client/src/data/chineseCatalog.js')).default;
const { englishPracticeLinks, chinesePracticeLinks } = await import('../client/src/data/catalogPracticeLinks.js');
const grades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const subjects = ['中文', '英文', '數學'];
const expected = grades.flatMap((grade) => subjects.map((subject) => `${grade}-${subject === '英文' ? 'English' : subject}`));
const ids = database.topics.map((topic) => topic.id);
const errors = [];
const allDifficultyLabels = new Set(['基礎', '應用', '進階', '挑戰']);

for (const [subject, banks] of Object.entries({ 中文: chineseQuestionBanks, 英文: englishQuestionBanks, 數學: mathQuestionBanks })) {
  for (const bank of Object.values(banks)) {
    for (const unit of bank.units) {
      for (const question of unit.questions) {
        if (!allDifficultyLabels.has(question.difficulty)) errors.push(`${question.id || unit.id} 缺少有效難度標記。`);
        if (!question.learningObjective) errors.push(`${question.id || unit.id} 缺少學習目標標記。`);
      }
    }
  }
}

if (database.mode !== 'catalog-in-progress') errors.push('資料庫必須標示為 catalog-in-progress。');
if (database.topics.length !== 18) errors.push(`應有 18 個示範單元，實際為 ${database.topics.length}。`);
for (const id of expected) if (!ids.includes(id)) errors.push(`缺少示範單元：${id}`);
for (const topic of database.topics) {
  if (topic.options?.length !== 4) errors.push(`${topic.id} 必須有四個選項。`);
  if (!Number.isInteger(topic.answerIndex) || topic.answerIndex < 0 || topic.answerIndex > 3) errors.push(`${topic.id} 的答案索引無效。`);
  if (!topic.prompt || !topic.explanation) errors.push(`${topic.id} 缺少題幹或解析。`);
}

const p1EnglishRequiredUnits = [
  ['認識英文字母', 'P1-EN-A01', 'english-letter-choice'],
  ['校園與生活單字', 'P1-EN-V01', 'english-vocabulary-choice'],
  ['A 或 An？', 'P1-EN-G01', 'english-article-choice'],
  ['位置在哪裡？', 'P1-EN-G02', 'english-preposition-choice'],
  ['一個還是多個？', 'P1-EN-G03', 'english-noun-choice'],
  ['誰在說？', 'P1-EN-G04', 'english-pronoun-foundation-choice'],
  ['我是、你有', 'P1-EN-G05', 'english-be-have-choice'],
  ['例句朗讀', 'P1-EN-L01', 'english-sentence-read'],
  ['句子拼砌', 'P1-EN-S01', 'english-sentence-build'],
];
if (p1EnglishBank.grade !== 'P1' || p1EnglishBank.subject !== '英文') errors.push('P1 英文題庫的年級或學科資料不正確。');
for (const [name, id, interaction] of p1EnglishRequiredUnits) {
  const unit = p1EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P1 英文「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P1 英文「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P1 英文「${name}」必須剛好有十題。`);
    for (const question of unit.questions) {
      if (!question.id) errors.push(`${name} 缺少題目編號。`);
      if (interaction === 'english-sentence-read' || interaction === 'english-sentence-build') {
        if (!question.sentence || !question.translation) errors.push(`${question.id || name} 缺少英文例句或中文意思。`);
      } else {
        if (!question.prompt || !question.answer || !question.explanation) errors.push(`${question.id || name} 缺少題幹、答案或解析。`);
        if (!Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id || name} 必須有四個不重複選項，且包含正確答案。`);
      }
      if (interaction === 'english-vocabulary-choice' && !question.clueChinese) errors.push(`${question.id || name} 缺少中文圖意提示。`);
    }
  }
}

const p2EnglishRequiredUnits = [
  ['正在做甚麼？', 'P2-EN-G01', 'english-continuous-choice'],
  ['每天做甚麼？', 'P2-EN-G02', 'english-present-choice'],
  ['問一問', 'P2-EN-G03', 'english-question-choice'],
  ['我做得到！', 'P2-EN-G04', 'english-modal-choice'],
];
if (p2EnglishBank.grade !== 'P2' || p2EnglishBank.subject !== '英文') errors.push('P2 英文題庫的年級或學科資料不正確。');
for (const [name, id, interaction] of p2EnglishRequiredUnits) {
  const unit = p2EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P2 英文「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P2 英文「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P2 英文「${name}」必須剛好有十題。`);
    for (const question of unit.questions) {
      if (!question.id || !question.prompt || !question.sentence || !question.answer || !question.explanation) errors.push(`${question.id || name} 缺少題幹、句子、答案或解析。`);
      if (!Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id || name} 必須有四個不重複選項，且包含正確答案。`);
    }
  }
}

const p3EnglishRequiredUnits = [
  ['昨天做了甚麼？', 'P3-EN-G01', 'english-past-choice'],
  ['不規則動詞偵察', 'P3-EN-G02', 'english-irregular-choice'],
  ['代名詞百寶袋', 'P3-EN-G03', 'english-pronoun-choice'],
  ['把句子連起來', 'P3-EN-G04', 'english-connector-choice'],
  ['有多少？', 'P3-EN-G05', 'english-quantifier-choice'],
];
if (p3EnglishBank.grade !== 'P3' || p3EnglishBank.subject !== '英文') errors.push('P3 英文題庫的年級或學科資料不正確。');
for (const [name, id, interaction] of p3EnglishRequiredUnits) {
  const unit = p3EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P3 英文「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P3 英文「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P3 英文「${name}」必須剛好有十題。`);
    for (const question of unit.questions) {
      if (!question.id || !question.prompt || !question.sentence || !question.answer || !question.explanation) errors.push(`${question.id || name} 缺少題幹、句子、答案或解析。`);
      if (!Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id || name} 必須有四個不重複選項，且包含正確答案。`);
    }
  }
}

const p3EnglishExtensionUnits = [
  ['過去式例句朗讀', 'P3-EN-L01', 'english-sentence-read'],
  ['過去式句子拼砌', 'P3-EN-S01', 'english-sentence-build'],
  ['不規則動詞圖像記憶卡', 'P3-EN-M01', 'english-verb-memory'],
];
for (const [name, id, interaction] of p3EnglishExtensionUnits) {
  const unit = p3EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P3 英文延伸「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P3 英文延伸「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P3 英文延伸「${name}」必須剛好有十題。`);
    for (const question of unit.questions) {
      if (interaction === 'english-verb-memory') {
        if (!question.id || !question.symbol || !question.baseWord || !question.pastWord || !question.translation || !question.sentence) errors.push(`${question.id || name} 缺少圖像記憶卡資料。`);
      } else if (!question.id || !question.sentence || !question.translation) errors.push(`${question.id || name} 缺少英文例句或中文意思。`);
    }
  }
}

const p4EnglishRequiredUnits = [
  ['形容詞還是副詞？', 'P4-EN-G01', 'english-adjective-choice'],
  ['誰比較厲害？', 'P4-EN-G02', 'english-comparative-choice'],
  ['規則與建議', 'P4-EN-G03', 'english-advanced-modal-choice'],
  ['自己動手！', 'P4-EN-G04', 'english-reflexive-choice'],
  ['時間、條件與轉折', 'P4-EN-G05', 'english-advanced-connector-choice'],
];
if (p4EnglishBank.grade !== 'P4' || p4EnglishBank.subject !== '英文') errors.push('P4 英文題庫的年級或學科資料不正確。');
for (const [name, id, interaction] of p4EnglishRequiredUnits) {
  const unit = p4EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P4 英文「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P4 英文「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P4 英文「${name}」必須剛好有十題。`);
    for (const question of unit.questions) {
      if (!question.id || !question.prompt || !question.sentence || !question.answer || !question.explanation) errors.push(`${question.id || name} 缺少題幹、句子、答案或解析。`);
      if (!Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id || name} 必須有四個不重複選項，且包含正確答案。`);
    }
  }
}

const p4EnglishReadingUnit = p4EnglishBank.units.find((unit) => unit.id === 'P4-EN-R01');
if (!p4EnglishReadingUnit) errors.push('缺少 P4 英文「短篇閱讀偵探」題庫單元。');
else {
  if (p4EnglishReadingUnit.interaction !== 'english-reading-comprehension') errors.push('P4 英文短篇閱讀必須使用 english-reading-comprehension 互動。');
  if (!Array.isArray(p4EnglishReadingUnit.passageSets) || p4EnglishReadingUnit.passageSets.length !== 2) errors.push('P4 英文短篇閱讀必須包含兩篇閱讀材料。');
  if (p4EnglishReadingUnit.questions.length !== 10) errors.push('P4 英文短篇閱讀必須共十題。');
  const passageQuestionIds = [];
  for (const passage of p4EnglishReadingUnit.passageSets || []) {
    if (!passage.id || !passage.title || !passage.type || !passage.text || !Array.isArray(passage.questions) || passage.questions.length !== 5) errors.push('P4 英文每篇閱讀材料必須有完整資料及五題。');
    for (const question of passage.questions || []) {
      passageQuestionIds.push(question.id);
      if (question.passageId !== passage.id || !question.skill || !question.prompt || !question.answer || !question.explanation || !Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id || '未命名題目'} 缺少完整且唯一的英文閱讀理解資料。`);
    }
  }
  const unitQuestionIds = p4EnglishReadingUnit.questions.map((question) => question.id);
  if (new Set(passageQuestionIds).size !== passageQuestionIds.length || passageQuestionIds.length !== 10 || passageQuestionIds.length !== unitQuestionIds.length || passageQuestionIds.some((questionId) => !unitQuestionIds.includes(questionId))) errors.push('P4 英文短篇閱讀的題組與單元題目清單必須一致。');
}

const p5EnglishRequiredUnits = [
  ['已完成的經驗', 'P5-EN-G01', 'english-perfect-choice'],
  ['完成式的時間線索', 'P5-EN-G02', 'english-perfect-time-choice'],
  ['誰做了這件事？', 'P5-EN-G03', 'english-passive-choice'],
  ['把兩句合起來', 'P5-EN-G04', 'english-relative-choice'],
  ['成對連接詞', 'P5-EN-G05', 'english-correlative-choice'],
];
if (p5EnglishBank.grade !== 'P5' || p5EnglishBank.subject !== '英文') errors.push('P5 英文題庫的年級或學科資料不正確。');
for (const [name, id, interaction] of p5EnglishRequiredUnits) {
  const unit = p5EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P5 英文「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P5 英文「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P5 英文「${name}」必須剛好有十題。`);
    for (const question of unit.questions) {
      if (!question.id || !question.prompt || !question.sentence || !question.answer || !question.explanation) errors.push(`${question.id || name} 缺少題幹、句子、答案或解析。`);
      if (!Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id || name} 必須有四個不重複選項，且包含正確答案。`);
    }
  }
}

const p5EnglishExtensionUnits = [
  ['完成式句子拼砌', 'P5-EN-S01', 'english-sentence-build'],
  ['被動句子拼砌', 'P5-EN-S02', 'english-sentence-build'],
];
for (const [name, id, interaction] of p5EnglishExtensionUnits) {
  const unit = p5EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P5 英文延伸「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P5 英文延伸「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P5 英文延伸「${name}」必須剛好有十題。`);
    for (const question of unit.questions) if (!question.id || !question.sentence || !question.translation) errors.push(`${question.id || name} 缺少英文例句或中文意思。`);
  }
}

const p6EnglishRequiredUnits = [
  ['如果……會怎樣？', 'P6-EN-G01', 'english-conditional-choice'],
  ['把話轉述出來', 'P6-EN-G02', 'english-reported-choice'],
  ['V-ing 還是 to V？', 'P6-EN-G03', 'english-nonfinite-choice'],
  ['動詞多一個意思', 'P6-EN-G04', 'english-phrasal-choice'],
];
if (p6EnglishBank.grade !== 'P6' || p6EnglishBank.subject !== '英文') errors.push('P6 英文題庫的年級或學科資料不正確。');
for (const [name, id, interaction] of p6EnglishRequiredUnits) {
  const unit = p6EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P6 英文「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P6 英文「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P6 英文「${name}」必須剛好有十題。`);
    for (const question of unit.questions) {
      if (!question.id || !question.prompt || !question.sentence || !question.answer || !question.explanation) errors.push(`${question.id || name} 缺少題幹、句子、答案或解析。`);
      if (!Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id || name} 必須有四個不重複選項，且包含正確答案。`);
    }
  }
}

const p6EnglishRewriteUnits = [
  ['條件句改寫', 'P6-EN-RW01', 'english-sentence-rewrite-conditional'],
  ['間接引語改寫', 'P6-EN-RW02', 'english-sentence-rewrite-reported'],
];
for (const [name, id, interaction] of p6EnglishRewriteUnits) {
  const unit = p6EnglishBank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P6 英文句子改寫「${name}」題庫單元。`);
  else {
    if (unit.interaction !== interaction) errors.push(`P6 英文句子改寫「${name}」的互動類型不正確。`);
    if (unit.questions.length !== 10) errors.push(`P6 英文句子改寫「${name}」必須剛好有十題。`);
    for (const question of unit.questions) {
      if (!question.id || !question.prompt || !question.instruction || !question.source || !question.focus || !question.target || !question.hint || !question.explanation) errors.push(`${question.id || name} 缺少句子改寫必要資料。`);
    }
  }
}

function validateEnglishReadingUnit(bank, grade, unitId, title) {
  const unit = bank.units.find((item) => item.id === unitId);
  if (!unit) { errors.push(`缺少 ${grade} 英文「${title}」閱讀題組。`); return; }
  if (unit.interaction !== 'english-reading-comprehension') errors.push(`${unitId} 必須使用 english-reading-comprehension 互動。`);
  if (!Array.isArray(unit.passageSets) || unit.passageSets.length !== 2 || unit.questions.length !== 10) errors.push(`${unitId} 必須包含兩篇材料及共十題。`);
  const passageQuestionIds = [];
  for (const passage of unit.passageSets || []) {
    if (!passage.id || !passage.title || !passage.type || !passage.text || !Array.isArray(passage.questions) || passage.questions.length !== 5) errors.push(`${unitId} 的每篇閱讀材料必須有完整資料及五題。`);
    for (const question of passage.questions || []) {
      passageQuestionIds.push(question.id);
      if (question.passageId !== passage.id || !question.skill || !question.prompt || !question.answer || !question.explanation || !Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id || unitId} 缺少完整且唯一的英文閱讀理解資料。`);
    }
  }
  const unitQuestionIds = unit.questions.map((question) => question.id);
  if (new Set(passageQuestionIds).size !== passageQuestionIds.length || passageQuestionIds.length !== 10 || passageQuestionIds.length !== unitQuestionIds.length || passageQuestionIds.some((questionId) => !unitQuestionIds.includes(questionId))) errors.push(`${unitId} 的題組與單元題目清單必須一致。`);
}

validateEnglishReadingUnit(p5EnglishBank, 'P5', 'P5-EN-R01', '閱讀推論工作紙');
validateEnglishReadingUnit(p6EnglishBank, 'P6', 'P6-EN-R01', '證據式閱讀挑戰');

const mathRequiredUnitIds = {
  P1: ['P1-MATH-A02', 'P1-MATH-A03', 'P1-MATH-A04', 'P1-MATH-A05', 'P1-MATH-M01', 'P1-MATH-M02', 'P1-MATH-S01', 'P1-MATH-S02'],
  P2: ['P2-MATH-A01', 'P2-MATH-A02', 'P2-MATH-A04', 'P2-MATH-A05', 'P2-MATH-A06', 'P2-MATH-A07', 'P2-MATH-M01', 'P2-MATH-M02', 'P2-MATH-M03', 'P2-MATH-S03'],
  P3: ['P3-MATH-A02', 'P3-MATH-A03', 'P3-MATH-A04', 'P3-MATH-A05', 'P3-MATH-M01', 'P3-MATH-M02', 'P3-MATH-M03', 'P3-MATH-S01'],
  P4: ['P4-MATH-A01', 'P4-MATH-A02', 'P4-MATH-A03', 'P4-MATH-A04', 'P4-MATH-A05', 'P4-MATH-A06', 'P4-MATH-A07', 'P4-MATH-M01', 'P4-MATH-S01'],
  P5: ['P5-MATH-A01', 'P5-MATH-A02', 'P5-MATH-A03', 'P5-MATH-A05', 'P5-MATH-A06', 'P5-MATH-A07'],
  P6: ['P6-MATH-A02', 'P6-MATH-A03', 'P6-MATH-A04', 'P6-MATH-M01', 'P6-MATH-M02', 'P6-MATH-S03', 'P6-MATH-D01', 'P6-MATH-C01'],
};
for (const [grade, unitIds] of Object.entries(mathRequiredUnitIds)) {
  const bank = mathQuestionBanks[grade];
  if (!bank || bank.grade !== grade || bank.subject !== '數學') { errors.push(`${grade} 數學題庫的年級或學科資料不正確。`); continue; }
  for (const unitId of unitIds) {
    const unit = bank.units.find((item) => item.id === unitId);
    if (!unit) { errors.push(`缺少 ${unitId} 數學單元。`); continue; }
    const expectedQuestionCount = unit.interaction === 'math-life-application' ? 6 : 10;
    if (!['math-number-line', 'math-ten-frame', 'math-choice', 'math-shopping', 'math-measurement', 'math-fraction-pie', 'math-fraction-compare', 'math-equal-groups', 'math-sharing', 'math-sharing-remainder', 'math-life-application'].includes(unit.interaction) || !unit.objective || unit.questions.length !== expectedQuestionCount) errors.push(`${unitId} 必須有互動類型、學習目標及 ${expectedQuestionCount} 題。`);
    if (unit.interaction === 'math-life-application' && (!unit.featured || !unit.hintTitle || !Array.isArray(unit.hintSteps) || unit.hintSteps.length !== 4 || unit.hintSteps.some((step) => !step.label || !step.text))) errors.push(`${unitId} 必須有專屬入口及完整的四步解題提示。`);
    for (const question of unit.questions) {
      if (!question.id || !question.prompt || question.answer === undefined || !question.explanation) errors.push(`${question.id || unitId} 缺少題幹、答案或解析。`);
      if (unit.interaction === 'math-number-line') {
        const line = question.line;
        if (!line || !Number.isFinite(line.start) || !Number.isFinite(line.end) || !Number.isFinite(line.step) || line.start >= line.end || line.step <= 0 || !Number.isFinite(question.answer) || question.answer < line.start || question.answer > line.end || (question.answer - line.start) % line.step !== 0) errors.push(`${question.id} 的數線範圍、刻度或答案不正確。`);
      } else if (unit.interaction === 'math-ten-frame') {
        const frame = question.frame;
        if (!frame || !Number.isInteger(frame.initial) || frame.initial < 0 || frame.initial > 10 || !Number.isInteger(frame.removed) || frame.removed < 0 || frame.removed > frame.initial || question.answer !== frame.initial - frame.removed || !Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id} 的十格框資料、計算答案或選項不正確。`);
      } else if (unit.interaction === 'math-shopping') {
        const items = question.items || [{ item: question.item, price: question.price }];
        const total = items.reduce((sum, item) => sum + item.price, 0);
        const paid = Array.isArray(question.paidCoins) ? question.paidCoins.reduce((sum, value) => sum + value, 0) : NaN;
        if (!Array.isArray(items) || items.length < 1 || items.some((item) => !item.item || !Number.isFinite(item.price) || item.price < 0) || !Number.isFinite(question.limit) || question.limit < total || !Array.isArray(question.paidCoins) || !question.paidCoins.length || paid < total || question.answer !== paid - total || !Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id} 缺少完整找續購物籃資料，或商品合計、限額及找續答案不一致。`);
      } else if (unit.interaction === 'math-measurement') {
        if (!question.visual || !['ruler', 'cup', 'clock'].includes(question.visual.type) || !Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整量度圖解資料。`);
      } else if (unit.interaction === 'math-fraction-pie') {
        const expectedFraction = `${question.target}/${question.total}`;
        if (!Number.isInteger(question.total) || !Number.isInteger(question.target) || question.target < 1 || question.target > question.total || question.answer !== expectedFraction || !Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 的切餅分數答案或資料不正確。`);
      } else if (unit.interaction === 'math-fraction-compare') {
        const leftFraction = `${question.left?.filled}/${question.left?.total}`;
        const rightFraction = `${question.right?.filled}/${question.right?.total}`;
        const expectedAnswer = question.left?.filled > question.right?.filled ? leftFraction : rightFraction;
        if (!question.left || !question.right || !Number.isInteger(question.left.total) || !Number.isInteger(question.right.total) || !Number.isInteger(question.left.filled) || !Number.isInteger(question.right.filled) || question.left.filled === question.right.filled || question.left.filled < 0 || question.right.filled < 0 || question.left.filled > question.left.total || question.right.filled > question.right.total || question.left.total !== question.right.total || question.answer !== expectedAnswer || !Array.isArray(question.choices) || question.choices.length !== 2 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 2) errors.push(`${question.id} 的分數比較答案或資料不正確。`);
      } else if (!Array.isArray(question.choices) || question.choices.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id} 必須有四個不重複選項，且包含正確答案。`);
    }
  }
}

const removedMathUnitIds = ['P2-MATH-S01', 'P2-MATH-D01', 'P3-MATH-A01', 'P3-MATH-S02', 'P3-MATH-D01', 'P4-MATH-M02', 'P4-MATH-M03', 'P4-MATH-S02', 'P4-MATH-D01', 'P5-MATH-M01', 'P5-MATH-M02', 'P5-MATH-M03', 'P5-MATH-S02', 'P5-MATH-S03', 'P5-MATH-D02', 'P6-MATH-M03', 'P6-MATH-D02'];
for (const unitId of removedMathUnitIds) {
  const grade = unitId.split('-')[0];
  if (mathQuestionBanks[grade]?.units.some((unit) => unit.id === unitId)) errors.push(`${unitId} 已被指定刪除，不應再出現在數學目錄。`);
}

const englishBanks = { P1: p1EnglishBank, P2: p2EnglishBank, P3: p3EnglishBank, P4: p4EnglishBank, P5: p5EnglishBank, P6: p6EnglishBank };
for (const grade of grades) {
  const bank = englishBanks[grade];
  const links = englishPracticeLinks[grade] || {};
  for (const topic of englishCatalog[grade]?.coreTopics || []) if (!Object.values(links).some((link) => link.topic === topic.title)) errors.push(`${grade} 英文核心課題「${topic.title}」尚未連結到練習。`);
  for (const unit of bank.units) {
    const link = links[unit.id];
    if (!link) errors.push(`${unit.id} 未連結至英文課題目錄。`);
    if (!unit.objective) errors.push(`${unit.id} 缺少可供核對的學習目標。`);
  }
  for (const unitId of Object.keys(links)) if (!bank.units.some((unit) => unit.id === unitId)) errors.push(`${grade} 英文課題映射連結了不存在的單元 ${unitId}。`);
}

for (const grade of grades) {
  const bank = chineseQuestionBanks[grade];
  const links = chinesePracticeLinks[grade] || {};
  for (const unit of bank.units) {
    const link = links[unit.id];
    if (!link) errors.push(`${unit.id} 未連結至中文課題目錄。`);
    else {
      const [strand, index] = link;
      if (!chineseCatalog[grade]?.[strand]?.[index]) errors.push(`${unit.id} 的中文課題映射無效。`);
    }
    if (unit.questions.some((question) => !question.learningObjective || !question.difficulty)) errors.push(`${unit.id} 有題目缺少學習目標或難度標籤。`);
  }
  for (const unitId of Object.keys(links)) if (!bank.units.some((unit) => unit.id === unitId)) errors.push(`${grade} 中文課題映射連結了不存在的單元 ${unitId}。`);
}

const p1WordUnit = p1Bank.units.find((unit) => unit.id === 'P1-CN-R01');
const p1RadicalUnit = p1Bank.units.find((unit) => unit.id === 'P1-CN-R02');
const p1SentenceUnit = p1Bank.units.find((unit) => unit.id === 'P1-CN-W01');
const p2Bank = (await import('../client/src/data/questionBanks/chinese/p2.js')).default;
const p2ContextUnit = p2Bank.units.find((unit) => unit.id === 'P2-CN-R01');
const p2ConnectorUnit = p2Bank.units.find((unit) => unit.id === 'P2-CN-R02');
const p2TaleUnit = p2Bank.units.find((unit) => unit.id === 'P2-CN-R03');
const p2PortraitUnit = p2Bank.units.find((unit) => unit.id === 'P2-CN-W01');
const p2PracticalUnit = p2Bank.units.find((unit) => unit.id === 'P2-CN-W02');
const p2FormatUnit = p2Bank.units.find((unit) => unit.id === 'P2-CN-W03');
const p3Bank = (await import('../client/src/data/questionBanks/chinese/p3.js')).default;
const p3StoryUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-R09');
const p3InfoUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-R01');
const p3IdiomUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-R02');
const p3ParagraphMarkUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-R03');
const p3MetaphorUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-R04');
const p3PersonificationUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-R05');
const p3ParallelismUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-R06');
const p3ParagraphStructureUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-W01');
const p3SensoryUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-W02');
const p3NarrativeUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-W03');
const p3GenreUnit = p3Bank.units.find((unit) => unit.id === 'P3-CN-R07');
const p4Bank = (await import('../client/src/data/questionBanks/chinese/p4.js')).default;
const p4RequiredUnits = [
  ['字詞辨析', 'P4-CN-R01'], ['段意歸納', 'P4-CN-R02'], ['重組句子', 'P4-CN-R03'], ['進階標點', 'P4-CN-R04'], ['句子改寫', 'P4-CN-R05'],
  ['順敘與倒敘', 'P4-CN-W01'], ['人物與步移描寫', 'P4-CN-W02'], ['說明方法', 'P4-CN-W03'], ['實用文格式', 'P4-CN-W04'],
];
const p5Bank = (await import('../client/src/data/questionBanks/chinese/p5.js')).default;
const p5RequiredUnits = [
  ['進階重組句子', 'P5-CN-R01'], ['修辭手法與作用', 'P5-CN-R02'], ['篇章理解與推論', 'P5-CN-R03'],
  ['記敘文應試', 'P5-CN-W01'], ['說明文應試', 'P5-CN-W02'], ['進階實用文', 'P5-CN-W03'], ['審題與文體', 'P5-CN-W04'],
];
const p6Bank = (await import('../client/src/data/questionBanks/chinese/p6.js')).default;
const p6RequiredUnits = [
  ['文言虛詞與句式', 'P6-CN-R01'], ['深層主旨', 'P6-CN-R02'], ['夾敘夾議', 'P6-CN-W01'], ['抒情描寫', 'P6-CN-W02'],
  ['全套實用文', 'P6-CN-W03'], ['高分字詞與修辭', 'P6-CN-W04'], ['模擬改錯', 'P6-CN-W05'],
];
if (!p1WordUnit) errors.push('缺少 P1「認讀基礎字詞」題庫單元。');
else {
  if (p1WordUnit.interaction !== 'word-match') errors.push('P1 認讀基礎字詞必須使用 word-match 互動。');
  if (p1WordUnit.questions.length < 10) errors.push('P1 認讀基礎字詞至少需要 10 組配對題。');
  for (const question of p1WordUnit.questions) {
    if (!question.prompt || !question.explanation) errors.push(`${question.id} 缺少題幹或解析。`);
    if (!Array.isArray(question.matches) || question.matches.length !== 3) errors.push(`${question.id} 必須包含 3 張字詞配對卡。`);
    const matchIds = question.matches?.map((item) => item.id) || [];
    const words = question.matches?.map((item) => item.word) || [];
    if (new Set(matchIds).size !== matchIds.length || new Set(words).size !== words.length) errors.push(`${question.id} 的配對卡不可重複。`);
    for (const item of question.matches || []) if (!item.symbol || !item.meaning) errors.push(`${question.id} 的配對卡缺少圖意或意思。`);
  }
}

if (!p1RadicalUnit) errors.push('缺少 P1「常用部首認識」題庫單元。');
else {
  if (p1RadicalUnit.interaction !== 'radical-sort') errors.push('P1 常用部首認識必須使用 radical-sort 互動。');
  if (p1RadicalUnit.questions.length < 10) errors.push('P1 常用部首認識至少需要 10 題。');
  for (const question of p1RadicalUnit.questions) {
    if (!question.prompt || !question.explanation || !question.character || !question.radical || !question.radicalName) errors.push(`${question.id} 缺少部首題必要資料。`);
    if (!Array.isArray(question.choices) || question.choices.length !== 4) errors.push(`${question.id} 必須有四個候選部首。`);
    if (!question.choices?.includes(question.radical)) errors.push(`${question.id} 的正確部首必須包含在候選中。`);
    if (new Set(question.choices || []).size !== question.choices?.length) errors.push(`${question.id} 的候選部首不可重複。`);
  }
}

const p1PunctuationUnit = p1Bank.units.find((unit) => unit.id === 'P1-CN-R03');
if (!p1PunctuationUnit) errors.push('缺少 P1「基本標點符號」題庫單元。');
else {
  if (p1PunctuationUnit.interaction !== 'punctuation-drop') errors.push('P1 基本標點符號必須使用 punctuation-drop 互動。');
  if (p1PunctuationUnit.questions.length < 10) errors.push('P1 基本標點符號至少需要 10 題。');
  for (const question of p1PunctuationUnit.questions) {
    if (!question.prompt || !question.before || !question.answer || !question.explanation) errors.push(`${question.id} 缺少標點題必要資料。`);
    if (!Array.isArray(question.choices) || question.choices.length !== 3) errors.push(`${question.id} 必須有三個候選標點。`);
    if (!question.choices?.includes(question.answer)) errors.push(`${question.id} 的正確標點必須包含在候選中。`);
  }
}

if (!p3StoryUnit) errors.push('缺少 P3「簡單短文的起、承、轉、合」題庫單元。');
else {
  if (p3StoryUnit.interaction !== 'story-structure') errors.push('P3 簡單短文的起、承、轉、合必須使用 story-structure 互動。');
  if (!Array.isArray(p3StoryUnit.stories) || p3StoryUnit.stories.length < 3) errors.push('P3 簡單短文的起、承、轉、合至少需要三篇短文。');
  if (p3StoryUnit.questions.length < 12) errors.push('P3 簡單短文的起、承、轉、合至少需要十二條問題。');
  const storyQuestionIds = [];
  for (const [index, story] of (p3StoryUnit.stories || []).entries()) {
    if (!story.id || !story.title || !Array.isArray(story.paragraphs) || story.paragraphs.length !== 4) errors.push('每篇 P3 短文必須有名稱及四段內容。');
    if (!Array.isArray(story.questions) || story.questions.length < 4) errors.push(`短文「${story.title || '未命名'}」至少需要四條問題。`);
    if (story.questions?.length !== 4) errors.push(`短文「${story.title || '未命名'}」必須剛好有四條問題。`);
    const paragraphIds = story.paragraphs?.map((paragraph) => paragraph.id) || [];
    for (const paragraph of story.paragraphs || []) if (!paragraph.id || !paragraph.text) errors.push('P3 短文段落缺少編號或文字。');
    for (const question of story.questions || []) {
      storyQuestionIds.push(question.id);
      if (!question.prompt || !question.stage || !question.answer || !question.explanation) errors.push(`${question.id} 缺少短文題必要資料。`);
      if (!paragraphIds.includes(question.answer)) errors.push(`${question.id} 的答案必須對應所屬短文中的段落。`);
    }
  }
  if (new Set(storyQuestionIds).size !== storyQuestionIds.length) errors.push('短文閱讀問題不可重複。');
  if (p3StoryUnit.questions.length !== storyQuestionIds.length) errors.push('短文單元的總題數必須等於各篇短文問題數之和。');
}

if (!p1SentenceUnit) errors.push('缺少 P1「句子擴寫」題庫單元。');
else {
  if (p1SentenceUnit.interaction !== 'sentence-expand') errors.push('P1 句子擴寫必須使用 sentence-expand 互動。');
  if (p1SentenceUnit.questions.length < 10) errors.push('P1 句子擴寫至少需要十題。');
  for (const question of p1SentenceUnit.questions) {
    const parts = question.parts || {};
    for (const key of ['time', 'person', 'place', 'action']) {
      const part = parts[key];
      if (!part?.label || !part.answer || !Array.isArray(part.choices) || part.choices.length !== 3) errors.push(`${question.id} 的「${key}」資料不完整。`);
      if (part && !part.choices.includes(part.answer)) errors.push(`${question.id} 的「${key}」正確答案必須包含在候選中。`);
    }
    if (!question.prompt || !question.explanation) errors.push(`${question.id} 缺少句子擴寫題幹或解析。`);
  }
}

if (!p2ContextUnit) errors.push('缺少 P2「利用上下文推測字詞意思」題庫單元。');
else {
  if (p2ContextUnit.interaction !== 'context-choice') errors.push('P2 上下文推測字詞意思必須使用 context-choice 互動。');
  if (p2ContextUnit.questions.length < 10) errors.push('P2 上下文推測字詞意思至少需要十題。');
  for (const question of p2ContextUnit.questions) if (!question.target || !question.context || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的上下文推測資料。`);
}

if (!p2ConnectorUnit) errors.push('缺少 P2「常見關聯詞」題庫單元。');
else {
  if (p2ConnectorUnit.interaction !== 'connector-cloze') errors.push('P2 常見關聯詞必須使用 connector-cloze 互動。');
  if (p2ConnectorUnit.questions.length < 10) errors.push('P2 常見關聯詞至少需要十題。');
  for (const question of p2ConnectorUnit.questions) if (!question.context || !question.sentence || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的關聯詞資料。`);
}

if (!p2TaleUnit) errors.push('缺少 P2「寓言故事與童話大意」題庫單元。');
else {
  if (p2TaleUnit.interaction !== 'tale-reading') errors.push('P2 寓言故事與童話大意必須使用 tale-reading 互動。');
  if (!Array.isArray(p2TaleUnit.stories) || p2TaleUnit.stories.length !== 3) errors.push('P2 寓言故事與童話必須包含三篇故事。');
  if (p2TaleUnit.questions.length !== 9) errors.push('P2 寓言故事與童話必須共九題。');
  for (const story of p2TaleUnit.stories || []) {
    if (!story.id || !story.title || !story.type || !story.text || !Array.isArray(story.questions) || story.questions.length !== 3) errors.push(`P2 故事「${story.title || '未命名'}」資料不完整或不是三題。`);
    for (const question of story.questions || []) if (!question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的故事閱讀資料。`);
  }
}

if (!p2PortraitUnit) errors.push('缺少 P2「基礎人物描寫：外貌特徵」題庫單元。');
else {
  if (p2PortraitUnit.interaction !== 'writing-choice' || p2PortraitUnit.writingType !== 'portrait') errors.push('P2 基礎人物描寫必須使用 portrait writing-choice 互動。');
  if (p2PortraitUnit.questions.length < 10) errors.push('P2 基礎人物描寫至少需要十題。');
  for (const question of p2PortraitUnit.questions) if (!question.profile || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的人物描寫資料。`);
}

if (!p2PracticalUnit) errors.push('缺少 P2「簡單日記與書信」題庫單元。');
else {
  if (p2PracticalUnit.interaction !== 'writing-choice' || p2PracticalUnit.writingType !== 'practical') errors.push('P2 簡單日記與書信必須使用 practical writing-choice 互動。');
  if (p2PracticalUnit.questions.length < 10) errors.push('P2 簡單日記與書信至少需要十題。');
  for (const question of p2PracticalUnit.questions) if (!question.document || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的日記或書信資料。`);
}

if (!p2FormatUnit) errors.push('缺少 P2「日記與書信格式排序」題庫單元。');
else {
  if (p2FormatUnit.interaction !== 'format-sort') errors.push('P2 日記與書信格式排序必須使用 format-sort 互動。');
  if (p2FormatUnit.questions.length < 10) errors.push('P2 日記與書信格式排序至少需要十組。');
  for (const question of p2FormatUnit.questions) {
    if (!question.title || !question.type || !question.explanation || !Array.isArray(question.blocks) || question.blocks.length < 3) errors.push(`${question.id} 缺少完整的格式排序資料。`);
    const orders = question.blocks?.map((block) => block.order) || [];
    if (new Set(orders).size !== orders.length || !orders.every((order, index) => order === index)) errors.push(`${question.id} 的格式卡次序必須由零開始且不可重複。`);
  }
}

if (!p3InfoUnit) errors.push('缺少 P3「短篇說明文閱讀理解」題庫單元。');
else {
  if (p3InfoUnit.interaction !== 'p3-reading') errors.push('P3 短篇說明文閱讀理解必須使用 p3-reading 互動。');
  if (p3InfoUnit.questions.length < 10) errors.push('P3 短篇說明文閱讀理解至少需要十題。');
  for (const question of p3InfoUnit.questions) if (!question.title || !question.text || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的說明文閱讀資料。`);
}

if (!p3IdiomUnit) errors.push('缺少 P3「基礎成語運用」題庫單元。');
else {
  if (p3IdiomUnit.interaction !== 'p3-idiom') errors.push('P3 基礎成語運用必須使用 p3-idiom 互動。');
  if (p3IdiomUnit.questions.length < 10) errors.push('P3 基礎成語運用至少需要十題。');
  for (const question of p3IdiomUnit.questions) if (!question.context || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的成語資料。`);
}

if (!p3ParagraphMarkUnit) errors.push('缺少 P3「說明文段落重點標記」題庫單元。');
else {
  if (p3ParagraphMarkUnit.interaction !== 'paragraph-mark') errors.push('P3 說明文段落重點標記必須使用 paragraph-mark 互動。');
  if (p3ParagraphMarkUnit.questions.length < 10) errors.push('P3 說明文段落重點標記至少需要十題。');
  for (const question of p3ParagraphMarkUnit.questions) if (!question.title || !question.prompt || !question.answer || !question.explanation || question.paragraphs?.length < 3 || !question.paragraphs.some((paragraph) => paragraph.id === question.answer)) errors.push(`${question.id} 缺少完整的段落標記資料。`);
}

for (const [name, unit] of [['比喻', p3MetaphorUnit], ['擬人', p3PersonificationUnit], ['排比', p3ParallelismUnit]]) {
  if (!unit) errors.push(`缺少 P3「${name}手法」題庫單元。`);
  else {
    if (unit.interaction !== 'p3-figure') errors.push(`P3 ${name}手法必須使用 p3-figure 互動。`);
    if (unit.questions.length < 10) errors.push(`P3 ${name}手法至少需要十題。`);
    for (const question of unit.questions) if (!question.hint || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的${name}資料。`);
  }
}

for (const [name, unit] of [['總—分—總段落結構', p3ParagraphStructureUnit], ['五感描寫', p3SensoryUnit], ['記敘文六要素', p3NarrativeUnit]]) {
  if (!unit) errors.push(`缺少 P3「${name}」題庫單元。`);
  else {
    if (unit.interaction !== 'p3-figure' || unit.area !== '寫作') errors.push(`P3 ${name}必須使用寫作互動。`);
    if (unit.questions.length < 10) errors.push(`P3 ${name}至少需要十題。`);
    for (const question of unit.questions) if (!question.hint || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的${name}資料。`);
  }
}

if (!p3GenreUnit) errors.push('缺少 P3「進階記敘、科普與抒情文」題庫單元。');
else {
  if (p3GenreUnit.interaction !== 'p3-figure') errors.push('P3 進階篇章閱讀必須使用閱讀工作紙互動。');
  if (p3GenreUnit.questions.length < 10) errors.push('P3 進階篇章閱讀至少需要十題。');
  for (const question of p3GenreUnit.questions) if (!question.hint || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer)) errors.push(`${question.id} 缺少完整的進階篇章閱讀資料。`);
}

for (const [name, id] of p4RequiredUnits) {
  const unit = p4Bank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P4「${name}」題庫單元。`);
  else {
    if (unit.interaction !== 'p3-figure') errors.push(`P4 ${name}必須使用呈分試工作紙互動。`);
    if (unit.questions.length !== 10) errors.push(`P4 ${name}必須剛好有十題。`);
    for (const question of unit.questions) if (!question.hint || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id} 缺少完整且唯一的小四呈分試資料。`);
  }
}

for (const [name, id] of p5RequiredUnits) {
  const unit = p5Bank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P5「${name}」題庫單元。`);
  else {
    if (unit.interaction !== 'p3-figure') errors.push(`P5 ${name}必須使用呈分試工作紙互動。`);
    if (unit.questions.length !== 10) errors.push(`P5 ${name}必須剛好有十題。`);
    for (const question of unit.questions) if (!question.hint || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id} 缺少完整且唯一的小五呈分試資料。`);
  }
}

for (const [name, id] of p6RequiredUnits) {
  const unit = p6Bank.units.find((item) => item.id === id);
  if (!unit) errors.push(`缺少 P6「${name}」題庫單元。`);
  else {
    if (unit.interaction !== 'p3-figure') errors.push(`P6 ${name}必須使用呈分試工作紙互動。`);
    if (unit.questions.length !== 10) errors.push(`P6 ${name}必須剛好有十題。`);
    const ids = unit.questions.map((question) => question.id);
    if (new Set(ids).size !== ids.length) errors.push(`P6 ${name}的問題編號不可重複。`);
    for (const question of unit.questions) if (!question.hint || !question.prompt || !question.answer || !question.explanation || question.choices?.length !== 4 || !question.choices.includes(question.answer) || new Set(question.choices).size !== 4) errors.push(`${question.id} 缺少完整且唯一的小六呈分試資料。`);
  }
}

const p6ClassicalUnit = p6Bank.units.find((unit) => unit.id === 'P6-CN-R01');
if (!p6ClassicalUnit?.questions.every((question) => question.hintSatchel)) errors.push('P6 文言虛詞與句式每題均須提供提示錦囊內容。');

for (const [name, id] of [['文言虛詞與句式', 'P6-CN-R01'], ['深層主旨', 'P6-CN-R02']]) {
  const unit = p6Bank.units.find((item) => item.id === id);
  if (!unit?.passageSets || unit.passageSets.length !== 2) errors.push(`P6 ${name}必須包含兩篇短篇閱讀材料。`);
  else {
    const passageQuestionIds = [];
    for (const passage of unit.passageSets) {
      if (!passage.id || !passage.title || !passage.type || !passage.text || !Array.isArray(passage.questions) || passage.questions.length !== 5) errors.push(`P6 ${name}的閱讀題組資料不完整或不是五題。`);
      for (const question of passage.questions || []) {
        passageQuestionIds.push(question.id);
        if (question.passageId !== passage.id) errors.push(`${question.id} 未正確連結至所屬閱讀材料。`);
      }
    }
    const unitQuestionIds = unit.questions.map((question) => question.id);
    if (new Set(passageQuestionIds).size !== passageQuestionIds.length || passageQuestionIds.length !== 10) errors.push(`P6 ${name}的題組問題編號或題數無效。`);
    if (passageQuestionIds.length !== unitQuestionIds.length || passageQuestionIds.some((questionId) => !unitQuestionIds.includes(questionId))) errors.push(`P6 ${name}的題組問題必須與單元問題清單一致。`);
  }
}

const difficultyLabels = new Set(['基礎', '應用', '進階', '挑戰']);
for (const [grade, bank] of Object.entries(chineseQuestionBanks)) {
  for (const unit of bank.units) {
    if (!chineseQuestionUnitMetadata[unit.id]) errors.push(`${grade}「${unit.title}」缺少單元學習目標設定。`);
    for (const question of unit.questions) {
      if (!difficultyLabels.has(question.difficulty)) errors.push(`${question.id} 缺少有效難度標籤。`);
      if (!question.learningObjective?.trim()) errors.push(`${question.id} 缺少學習目標。`);
    }
  }
}

if (errors.length) {
  console.error(JSON.stringify({ status: 'invalid', errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: 'valid', mode: database.mode, topics: database.topics.length, grades, subjects, questionsPerTopic: 1, p1WordMatchQuestions: p1WordUnit.questions.length, p1RadicalQuestions: p1RadicalUnit.questions.length, p1PunctuationQuestions: p1PunctuationUnit.questions.length, p1SentenceExpandQuestions: p1SentenceUnit.questions.length, p2ContextQuestions: p2ContextUnit.questions.length, p2ConnectorQuestions: p2ConnectorUnit.questions.length, p2TaleQuestions: p2TaleUnit.questions.length, p2PortraitQuestions: p2PortraitUnit.questions.length, p2PracticalQuestions: p2PracticalUnit.questions.length, p2FormatQuestions: p2FormatUnit.questions.length, p3InfoQuestions: p3InfoUnit.questions.length, p3IdiomQuestions: p3IdiomUnit.questions.length, p3ParagraphMarkQuestions: p3ParagraphMarkUnit.questions.length, p3StoryStructureQuestions: p3StoryUnit.questions.length, p3MetaphorQuestions: p3MetaphorUnit.questions.length, p3PersonificationQuestions: p3PersonificationUnit.questions.length, p3ParallelismQuestions: p3ParallelismUnit.questions.length, p6ExamUnits: p6Bank.units.length, p6ExamQuestions: p6Bank.units.reduce((total, unit) => total + unit.questions.length, 0) }, null, 2));
