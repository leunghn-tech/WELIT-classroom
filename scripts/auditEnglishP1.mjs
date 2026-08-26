import p1 from '../client/src/data/questionBanks/english/p1.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();
for (const unit of p1.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    if (question.choices) {
      check(question.choices.length === 4, `${question.id} 應有 4 個選項。`);
      check(new Set(question.choices).size === question.choices.length, `${question.id} 的選項重複。`);
      check(question.choices.filter((choice) => choice === question.answer).length === 1, `${question.id} 的正確答案沒有唯一存在於選項中。`);
      check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
    } else {
      check(Boolean(question.sentence), `${question.id} 缺少學生可見英文句子。`);
      check(Boolean(question.translation), `${question.id} 缺少繁體中文輔助說明。`);
    }
  }
}
console.log(JSON.stringify({ grade: p1.grade, subject: p1.subject, unitCount: p1.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p1.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
