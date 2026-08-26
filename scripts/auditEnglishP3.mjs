import p3 from '../client/src/data/questionBanks/english/p3.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();
for (const unit of p3.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    if (question.choices) {
      check(question.choices.length === 4, `${question.id} 應有 4 個選項。`);
      check(new Set(question.choices).size === question.choices.length, `${question.id} 的選項重複。`);
      check(question.choices.filter((choice) => choice === question.answer).length === 1, `${question.id} 的正確答案沒有唯一存在於選項中。`);
      check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
    } else if (question.baseWord) {
      check(Boolean(question.baseWord && question.pastWord && question.sentence && question.translation), `${question.id} 的不規則動詞記憶卡資料不完整。`);
    } else {
      check(Boolean(question.sentence && question.translation), `${question.id} 的句子朗讀／拼砌資料不完整。`);
    }
  }
}
console.log(JSON.stringify({ grade: p3.grade, subject: p3.subject, unitCount: p3.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p3.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
