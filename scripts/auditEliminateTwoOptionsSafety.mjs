import { chineseQuestionBanks } from '../client/src/data/questionBanks/chinese/index.js';
import { englishQuestionBanks } from '../client/src/data/questionBanks/english/index.js';
import { mathQuestionBanks } from '../client/src/data/questionBanks/math/index.js';

const normalise = (value) => String(value ?? '').replace(/\s+/gu, '').replace(/^[$]/u, '');
const findings = [];
const rows = [];
const collectQuestions = (unit) => [
  ...(unit.questions || []),
  ...(unit.passageSets || []).flatMap((set) => set.questions || []),
  ...(unit.stories || []).flatMap((story) => story.questions || []),
];
for (const [subject, banks] of Object.entries({ 中文: chineseQuestionBanks, 英文: englishQuestionBanks, 數學: mathQuestionBanks })) {
  for (const [grade, bank] of Object.entries(banks)) {
    const questions = bank.units.flatMap(collectQuestions);
    const fourChoice = questions.filter((question) => question.choices?.length === 4 && (question.answer ?? question.radical) !== undefined);
    const formattedFractionChoices = fourChoice.filter((question) => question.choices.some((choice) => /\d+\s*\/\s*\d+/u.test(String(choice))));
    for (const question of fourChoice) {
      const answer = question.answer ?? question.radical;
      const matches = question.choices.filter((choice) => normalise(choice) === normalise(answer));
      const wrongCount = question.choices.length - matches.length;
      if (matches.length !== 1) findings.push(`${subject} ${grade} ${question.id}: 正確答案匹配 ${matches.length} 項，無法安全排除。`);
      if (wrongCount < 2) findings.push(`${subject} ${grade} ${question.id}: 錯誤選項不足兩項。`);
    }
    rows.push({ subject, grade, questionsReviewed: questions.length, fourChoiceProtected: fourChoice.length, formattedFractionChoiceQuestions: formattedFractionChoices.length, failures: findings.filter((finding) => finding.startsWith(`${subject} ${grade} `)).length });
  }
}
console.log(JSON.stringify({ comparator: '先讀取 data-choice-value；一般選項回退至可見文字，分數不再以格式化 DOM 文字比對。', rows, totalFourChoiceProtected: rows.reduce((sum, row) => sum + row.fourChoiceProtected, 0), formattedFractionChoiceQuestions: rows.reduce((sum, row) => sum + row.formattedFractionChoiceQuestions, 0), failures: findings }, null, 2));
if (findings.length) process.exitCode = 1;
