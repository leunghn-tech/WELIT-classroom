import p4 from '../client/src/data/questionBanks/math/p4.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();
for (const unit of p4.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    check(Array.isArray(question.choices) && question.choices.length === 4, `${question.id} 應有 4 個選項。`);
    check(new Set(question.choices.map(String)).size === question.choices.length, `${question.id} 的選項重複。`);
    check(question.choices.filter((choice) => String(choice) === String(question.answer)).length === 1, `${question.id} 的正確答案沒有唯一存在於選項中。`);
    check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
  }
}
console.log(JSON.stringify({ grade: p4.grade, subject: p4.subject, activeUnitCount: p4.units.length, questionsReviewed: questionIds.size, activeUnitIds: p4.units.map((unit) => unit.id), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
