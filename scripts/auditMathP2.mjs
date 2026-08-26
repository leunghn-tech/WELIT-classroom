import p2 from '../client/src/data/questionBanks/math/p2.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();
for (const unit of p2.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    if (question.choices) {
      check(new Set(question.choices.map(String)).size === question.choices.length, `${question.id} 的選項重複。`);
      check(question.choices.filter((choice) => String(choice) === String(question.answer)).length === 1, `${question.id} 的正確答案沒有唯一存在於選項中。`);
    }
    check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
    if (question.items) {
      const total = question.items.reduce((sum, item) => sum + item.price, 0);
      const paid = question.paidCoins.reduce((sum, coin) => sum + coin, 0);
      check(paid === question.limit && question.answer === paid - total, `${question.id} 的購物找續計算錯誤。`);
    }
    if (question.groups) check(question.answer === question.groups * question.perGroup, `${question.id} 的相同分組答案計算錯誤。`);
    if (question.shareTo && typeof question.answer === 'number') check(question.answer === question.total / question.shareTo, `${question.id} 的平均分配答案計算錯誤。`);
    if (question.visual?.type === 'clock' && /^\d{1,2}:\d{2}$/.test(String(question.answer))) {
      const expected = `${question.visual.hour}:${String(question.visual.minute).padStart(2, '0')}`;
      check(question.answer === expected, `${question.id} 的鐘面答案與模型不符。`);
    }
  }
}
console.log(JSON.stringify({ grade: p2.grade, subject: p2.subject, activeUnitCount: p2.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p2.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
