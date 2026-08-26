import p3 from '../client/src/data/questionBanks/math/p3.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();
for (const unit of p3.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    if (question.choices) {
      check(new Set(question.choices.map(String)).size === question.choices.length, `${question.id} 的選項重複。`);
      check(question.choices.filter((choice) => String(choice) === String(question.answer)).length === 1, `${question.id} 的正確答案沒有唯一存在於選項中。`);
    }
    check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
    if (question.visual?.type === 'fraction' && !question.prompt.includes('相同分母')) {
      const fraction = `${question.visual.filled}/${question.visual.total}`;
      if (typeof question.answer === 'string' && /^\d+\/\d+$/.test(question.answer)) check(question.answer === fraction, `${question.id} 的分數條與答案不符。`);
    }
    if (question.visual?.type === 'clock' && /^\d{1,2}:\d{2}$/.test(String(question.answer))) {
      const expected = `${question.visual.hour}:${String(question.visual.minute).padStart(2, '0')}`;
      check(question.answer === expected, `${question.id} 的鐘面答案與模型不符。`);
    }
  }
}
console.log(JSON.stringify({ grade: p3.grade, subject: p3.subject, activeUnitCount: p3.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p3.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
