import p3 from '../client/src/data/questionBanks/chinese/p3.js';

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
    }
    if (question.paragraphs) {
      const paragraphIds = question.paragraphs.map((paragraph) => paragraph.id);
      check(new Set(paragraphIds).size === paragraphIds.length, `${question.id} 的段落 ID 重複。`);
      check(paragraphIds.filter((id) => id === question.answer).length === 1, `${question.id} 的答案段落不存在或不唯一。`);
    }
    check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
  }
}

console.log(JSON.stringify({ grade: p3.grade, subject: p3.subject, unitCount: p3.units.length, questionsReviewed: questionIds.size, questionsByUnit: Object.fromEntries(p3.units.map((unit) => [unit.id, unit.questions.length])), structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
