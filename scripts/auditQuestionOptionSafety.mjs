import { chineseQuestionBanks } from '../client/src/data/questionBanks/chinese/index.js';
import { englishQuestionBanks } from '../client/src/data/questionBanks/english/index.js';
import { mathQuestionBanks } from '../client/src/data/questionBanks/math/index.js';

const BANKS = { 中文: chineseQuestionBanks, 英文: englishQuestionBanks, 數學: mathQuestionBanks };
const normalise = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/[⁄／]/gu, '/')
  .replace(/[−–—]/gu, '-')
  .replace(/\s+/gu, '')
  .replace(/^[$]/u, '');

const collectQuestions = (unit) => [
  ...(unit.questions || []),
  ...(unit.passageSets || []).flatMap((set) => set.questions || []),
  ...(unit.stories || []).flatMap((story) => story.questions || []),
];

const combinationsOfTwo = (items) => items.flatMap((item, index) => items.slice(index + 1).map((next) => [item, next]));
const findings = [];
const rows = [];

for (const [subject, grades] of Object.entries(BANKS)) {
  for (const [grade, bank] of Object.entries(grades)) {
    const questions = bank.units.flatMap((unit) => collectQuestions(unit).map((question) => ({ ...question, unitId: unit.id, unitTitle: unit.title })));
    const choiceQuestions = questions.filter((question) => Array.isArray(question.choices));
    const metrics = { subject, grade, questionsReviewed: questions.length, choiceQuestions: choiceQuestions.length, fourChoiceQuestions: 0, answerMissing: 0, answerNotInChoices: 0, duplicateChoices: 0, duplicateCorrectAnswer: 0, fewerThanTwoWrongChoices: 0, unsafeEliminationSimulations: 0 };

    for (const question of choiceQuestions) {
      const source = `${subject} ${grade} ${question.unitId} ${question.id}`;
      const answer = question.answer ?? question.radical;
      const options = question.choices.map((choice, index) => ({ index, raw: choice, value: normalise(choice) }));
      const answerValue = normalise(answer);

      if (question.choices.length === 4) metrics.fourChoiceQuestions += 1;
      if (answer === undefined || answer === null || answerValue === '') {
        metrics.answerMissing += 1;
        findings.push({ source, code: 'ANSWER_MISSING', message: '題目有選項，但沒有可比對的正確答案。' });
        continue;
      }

      const duplicateGroups = [...new Map(options.map((option) => [option.value, options.filter((candidate) => candidate.value === option.value)])).values()].filter((group) => group.length > 1);
      if (duplicateGroups.length) {
        metrics.duplicateChoices += 1;
        findings.push({ source, code: 'DUPLICATE_CHOICES', message: `選項重複：${duplicateGroups.map((group) => group.map((option) => String(option.raw)).join(' / ')).join('；')}` });
      }

      const correctOptions = options.filter((option) => option.value === answerValue);
      if (correctOptions.length !== 1) {
        metrics.answerNotInChoices += correctOptions.length === 0 ? 1 : 0;
        metrics.duplicateCorrectAnswer += correctOptions.length > 1 ? 1 : 0;
        findings.push({ source, code: correctOptions.length === 0 ? 'ANSWER_NOT_IN_CHOICES' : 'ANSWER_DUPLICATED', message: `正確答案「${String(answer)}」在選項中匹配 ${correctOptions.length} 次。` });
      }

      if (question.choices.length !== 4 || correctOptions.length !== 1) continue;
      const wrongOptions = options.filter((option) => option.value !== answerValue);
      if (wrongOptions.length < 2) {
        metrics.fewerThanTwoWrongChoices += 1;
        findings.push({ source, code: 'INSUFFICIENT_WRONG_CHOICES', message: `只有 ${wrongOptions.length} 個可安全排除的錯誤選項。` });
        continue;
      }

      const unsafePairs = combinationsOfTwo(wrongOptions).filter((pair) => pair.some((option) => option.value === answerValue));
      if (unsafePairs.length) {
        metrics.unsafeEliminationSimulations += 1;
        findings.push({ source, code: 'UNSAFE_ELIMINATION', message: '兩錯項排除模擬包含正確答案。' });
      }
    }

    rows.push(metrics);
  }
}

const totals = rows.reduce((total, row) => Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'subject' && key !== 'grade').map(([key, value]) => [key, (total[key] || 0) + value])), {});
const report = {
  purpose: '檢查題庫選項是否重複、正確答案是否存在，並模擬兩錯項排除時正確答案不會進入刪除集合。',
  comparator: '以題庫原始 answer／radical 與 choices 值比對；文字會作 Unicode、分數斜線、負號及空白正規化。',
  rows,
  totals,
  findings,
};

console.log(JSON.stringify(report, null, 2));
if (findings.length) process.exitCode = 1;
