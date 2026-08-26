import p6 from '../client/src/data/questionBanks/chinese/p6.js';

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
    }
    if (question.blocks) {
      const orders = question.blocks.map((block) => block.order);
      check(orders.every((order, index) => order === index), `${question.id} 的論證排序不連續。`);
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
console.log(JSON.stringify({ grade: p6.grade, subject: p6.subject, unitCount: p6.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p6.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
