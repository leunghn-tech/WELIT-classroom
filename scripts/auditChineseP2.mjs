import p2 from '../client/src/data/questionBanks/chinese/p2.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const questionIds = new Set();

for (const unit of p2.units) {
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);
    if (['context-choice', 'connector-cloze', 'tale-reading', 'writing-choice'].includes(unit.interaction)) {
      check(question.choices?.length === 4, `${question.id} 應有 4 個選項。`);
      check(new Set(question.choices).size === question.choices.length, `${question.id} 的選項重複。`);
      check(question.choices.filter((item) => item === question.answer).length === 1, `${question.id} 的正確答案沒有唯一地存在於選項中。`);
      check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
    }
    if (unit.interaction === 'connector-cloze') {
      check(question.sentence?.includes('（　　）'), `${question.id} 缺少關聯詞空格。`);
      check(Boolean(question.context), `${question.id} 缺少語境。`);
    }
    if (unit.interaction === 'format-sort') {
      const orders = question.blocks?.map((block) => block.order) || [];
      check(orders.length >= 3, `${question.id} 的排序卡不足 3 張。`);
      check(new Set(orders).size === orders.length, `${question.id} 的排序次序重複。`);
      check(orders.every((order, index) => order === index), `${question.id} 的排序次序不是由 0 連續開始。`);
      check(new Set(question.blocks.map((block) => block.text)).size === question.blocks.length, `${question.id} 的排序文字重複。`);
      check(Boolean(question.explanation), `${question.id} 缺少解釋。`);
    }
  }
}

const counts = Object.fromEntries(p2.units.map((unit) => [unit.id, unit.questions.length]));
console.log(JSON.stringify({ grade: p2.grade, subject: p2.subject, unitCount: p2.units.length, questionsReviewed: questionIds.size, questionsByUnit: counts, structuralFailures: failures }, null, 2));
if (failures.length) process.exitCode = 1;
