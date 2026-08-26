import p6 from '../client/src/data/questionBanks/math/p6.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const lifeAnswerChecks = {
  'P6-MATH-C01-Q01': '12 人',
  'P6-MATH-C01-Q02': '$1,413',
  'P6-MATH-C01-Q03': '1 小時 45 分鐘',
  'P6-MATH-C01-Q04': '28 kg',
  'P6-MATH-C01-Q05': '$25',
  'P6-MATH-C01-Q06': '0.5 L',
};
const questionIds = new Set();
for (const unit of p6.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    check(Array.isArray(question.choices) && question.choices.length === 4, `${question.id} 應有 4 個選項。`);
    check(new Set(question.choices.map(String)).size === question.choices.length, `${question.id} 的選項重複。`);
    check(question.choices.filter((choice) => String(choice) === String(question.answer)).length === 1, `${question.id} 的正確答案沒有唯一存在於選項中。`);
    check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
    if (lifeAnswerChecks[question.id]) check(question.answer === lifeAnswerChecks[question.id], `${question.id} 的生活應用答案與核對值不符。`);
  }
}
console.log(JSON.stringify({ grade: p6.grade, subject: p6.subject, activeUnitCount: p6.units.length, questionsReviewed: questionIds.size, activeUnitIds: p6.units.map((unit) => unit.id), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
