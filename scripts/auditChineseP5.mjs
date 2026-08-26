import p5 from '../client/src/data/questionBanks/chinese/p5.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();
for (const unit of p5.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    if (question.choices) {
      check(question.choices.length === 4, `${question.id} 應有 4 個選項。`);
      check(new Set(question.choices).size === question.choices.length, `${question.id} 選項重複。`);
      check(question.choices.filter((choice) => choice === question.answer).length === 1, `${question.id} 正確答案沒有唯一存在於選項中。`);
    }
    if (question.matches) {
      for (const key of ['id', 'word', 'symbol', 'meaning']) {
        const values = question.matches.map((item) => item[key]);
        check(values.every(Boolean) && new Set(values).size === values.length, `${question.id} 的配對 ${key} 不完整或重複。`);
      }
    }
    if (question.steps) {
      for (const step of question.steps) {
        check(step.options.filter((option) => option === step.answer).length === 1, `${question.id} 的 ${step.id} 答案不唯一。`);
        check(new Set(step.options).size === step.options.length, `${question.id} 的 ${step.id} 選項重複。`);
      }
    }
    check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
  }
}
console.log(JSON.stringify({ grade: p5.grade, subject: p5.subject, unitCount: p5.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p5.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
