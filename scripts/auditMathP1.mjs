import p1 from '../client/src/data/questionBanks/math/p1.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();
for (const unit of p1.units) {
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
      check(paid === question.limit, `${question.id} 的付款硬幣與限額不一致。`);
      check(question.answer === paid - total, `${question.id} 的找續答案計算錯誤。`);
    }
    if (question.groups) check(question.answer === question.groups * question.perGroup, `${question.id} 的相同分組答案計算錯誤。`);
    if (question.shareTo && typeof question.answer === 'number') check(question.answer === question.total / question.shareTo, `${question.id} 的平均分配答案計算錯誤。`);
    if (question.shareTo && typeof question.answer === 'string') {
      const expected = question.total % question.shareTo === 0 ? `${question.total / question.shareTo}` : null;
      check(!expected || question.answer.includes(expected), `${question.id} 的分配答案不含正確商數。`);
      check(question.answer.includes(`餘 ${question.total % question.shareTo}`), `${question.id} 的餘數答案計算錯誤。`);
    }
    if (question.visual?.type === 'clock') {
      const expected = `${question.visual.hour}:${String(question.visual.minute).padStart(2, '0')}`;
      if (/^\d{1,2}:\d{2}$/.test(String(question.answer))) check(question.answer === expected, `${question.id} 的鐘面答案與模型不符。`);
    }
  }
}
console.log(JSON.stringify({ grade: p1.grade, subject: p1.subject, activeUnitCount: p1.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p1.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
