import { chineseQuestionBanks } from '../client/src/data/questionBanks/chinese/index.js';
import { englishQuestionBanks } from '../client/src/data/questionBanks/english/index.js';
import { mathQuestionBanks } from '../client/src/data/questionBanks/math/index.js';
import { pickTwoWrongOptionIndexes, validateQuestionOptionSafety } from '../client/src/lib/questionOptionSafety.js';

const BANKS = { 中文: chineseQuestionBanks, 英文: englishQuestionBanks, 數學: mathQuestionBanks };
const collectQuestions = (unit) => [
  ...(unit.questions || []),
  ...(unit.passageSets || []).flatMap((set) => set.questions || []),
  ...(unit.stories || []).flatMap((story) => story.questions || []),
];

const combinationsOfTwo = (items) => items.flatMap((item, index) => items.slice(index + 1).map((next) => [item, next]));
const findings = [];
const rows = [];
const guardRailCases = [
  { name: '有效四選一題', input: { questionId: 'valid', answer: 'B', choices: ['A', 'B', 'C', 'D'] }, expectedSafe: true },
  { name: '答案不在選項', input: { questionId: 'missing-answer', answer: 'E', choices: ['A', 'B', 'C', 'D'] }, expectedSafe: false },
  { name: '正確答案重複', input: { questionId: 'duplicate-answer', answer: 'B', choices: ['A', 'B', 'B', 'D'] }, expectedSafe: false },
  { name: '選項重複', input: { questionId: 'duplicate-choice', answer: 'A', choices: ['A', 'B', 'B', 'D'] }, expectedSafe: false },
  { name: '錯項不足', input: { questionId: 'insufficient-wrong', answer: 'A', choices: ['A', 'A', 'A', 'A'] }, expectedSafe: false },
];
const guardRailResults = guardRailCases.map(({ name, input, expectedSafe }) => {
  const validation = validateQuestionOptionSafety(input);
  const picked = pickTwoWrongOptionIndexes(validation, () => 0.5);
  const passed = validation.safe === expectedSafe && (validation.safe ? picked.length === 2 && !picked.includes(validation.correctIndexes[0]) : picked.length === 0);
  if (!passed) findings.push({ source: `防呆測試 ${name}`, code: 'GUARD_RAIL_FAILURE', message: `safe=${validation.safe}，預期 ${expectedSafe}；抽取索引為 ${picked.join(',') || '無'}。` });
  return { name, passed, safe: validation.safe, reasons: validation.reasons, pickedIndexes: picked };
});

for (const [subject, grades] of Object.entries(BANKS)) {
  for (const [grade, bank] of Object.entries(grades)) {
    const questions = bank.units.flatMap((unit) => collectQuestions(unit).map((question) => ({ ...question, unitId: unit.id, unitTitle: unit.title })));
    const choiceQuestions = questions.filter((question) => Array.isArray(question.choices));
    const metrics = { subject, grade, questionsReviewed: questions.length, choiceQuestions: choiceQuestions.length, fourChoiceQuestions: 0, answerMissing: 0, answerNotInChoices: 0, duplicateChoices: 0, duplicateCorrectAnswer: 0, fewerThanTwoWrongChoices: 0, unsafeEliminationSimulations: 0 };

    for (const question of choiceQuestions) {
      const source = `${subject} ${grade} ${question.unitId} ${question.id}`;
      const answer = question.answer ?? question.radical;
      const validation = validateQuestionOptionSafety({ questionId: question.id, answer, choices: question.choices });
      const options = question.choices.map((choice, index) => ({ index, raw: choice, value: validation.optionValues[index] }));

      if (question.choices.length === 4) metrics.fourChoiceQuestions += 1;
      if (answer === undefined || answer === null || validation.answerValue === '') {
        metrics.answerMissing += 1;
        findings.push({ source, code: 'ANSWER_MISSING', message: '題目有選項，但沒有可比對的正確答案。' });
        continue;
      }

      const duplicateGroups = [...new Map(options.map((option) => [option.value, options.filter((candidate) => candidate.value === option.value)])).values()].filter((group) => group.length > 1);
      if (duplicateGroups.length) {
        metrics.duplicateChoices += 1;
        findings.push({ source, code: 'DUPLICATE_CHOICES', message: `選項重複：${duplicateGroups.map((group) => group.map((option) => String(option.raw)).join(' / ')).join('；')}` });
      }

      const correctOptions = options.filter((option) => option.value === validation.answerValue);
      if (correctOptions.length !== 1) {
        metrics.answerNotInChoices += correctOptions.length === 0 ? 1 : 0;
        metrics.duplicateCorrectAnswer += correctOptions.length > 1 ? 1 : 0;
        findings.push({ source, code: correctOptions.length === 0 ? 'ANSWER_NOT_IN_CHOICES' : 'ANSWER_DUPLICATED', message: `正確答案「${String(answer)}」在選項中匹配 ${correctOptions.length} 次。` });
      }

      if (question.choices.length !== 4 || correctOptions.length !== 1) continue;
      const wrongOptions = options.filter((option) => option.value !== validation.answerValue);
      if (wrongOptions.length < 2) {
        metrics.fewerThanTwoWrongChoices += 1;
        findings.push({ source, code: 'INSUFFICIENT_WRONG_CHOICES', message: `只有 ${wrongOptions.length} 個可安全排除的錯誤選項。` });
        continue;
      }

      const unsafePairs = combinationsOfTwo(wrongOptions).filter((pair) => pair.some((option) => option.value === validation.answerValue));
      const simulatedIndexes = pickTwoWrongOptionIndexes(validation, () => 0.5);
      if (unsafePairs.length || simulatedIndexes.length !== 2 || simulatedIndexes.includes(validation.correctIndexes[0])) {
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
  guardRailResults,
  rows,
  totals,
  findings,
};

console.log(JSON.stringify(report, null, 2));
if (findings.length) process.exitCode = 1;
