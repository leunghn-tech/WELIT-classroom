import p6 from '../client/src/data/questionBanks/english/p6.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();
for (const unit of p6.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    if (question.choices) {
      check(question.choices.length === 4, `${question.id} 應有 4 個選項。`);
      check(new Set(question.choices).size === question.choices.length, `${question.id} 的選項重複。`);
      check(question.choices.filter((choice) => choice === question.answer).length === 1, `${question.id} 的正確答案沒有唯一存在於選項中。`);
      check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
    } else {
      check(Boolean(question.target && question.source && question.explanation), `${question.id} 的句子改寫資料不完整。`);
    }
  }
}
console.log(JSON.stringify({ grade: p6.grade, subject: p6.subject, unitCount: p6.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p6.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
