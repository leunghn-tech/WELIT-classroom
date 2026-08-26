import p1 from '../client/src/data/questionBanks/chinese/p1.js';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const units = p1.units;
const questionIds = new Set();

check(p1.grade === 'P1' && p1.subject === '中文', '題庫年級或學科標記不正確。');
check(units.length === 4, `預期 4 個單元，實際 ${units.length} 個。`);

for (const unit of units) {
  check(unit.questions.length === 10, `${unit.id} 的題數不是 10。`);
  for (const question of unit.questions) {
    check(!questionIds.has(question.id), `重複題目 ID：${question.id}`);
    questionIds.add(question.id);

    if (unit.interaction === 'word-match') {
      check(question.matches?.length === 3, `${question.id} 應有 3 組配對。`);
      const fields = ['id', 'word', 'symbol', 'meaning'];
      for (const field of fields) {
        const values = question.matches.map((item) => item[field]);
        check(values.every(Boolean), `${question.id} 的 ${field} 有空值。`);
        check(new Set(values).size === values.length, `${question.id} 的 ${field} 有重複值。`);
      }
    }

    if (unit.interaction === 'radical-sort') {
      check(question.choices?.length === 4, `${question.id} 應有 4 個部首選項。`);
      check(new Set(question.choices).size === question.choices.length, `${question.id} 的部首選項重複。`);
      check(question.choices.filter((item) => item === question.radical).length === 1, `${question.id} 的正確部首沒有唯一地存在於選項中。`);
      check(Boolean(question.radicalName), `${question.id} 缺少部首名稱。`);
    }

    if (unit.interaction === 'punctuation-drop') {
      check(question.choices?.length === 3, `${question.id} 應有 3 個標點選項。`);
      check(new Set(question.choices).size === question.choices.length, `${question.id} 的標點選項重複。`);
      check(question.choices.filter((item) => item === question.answer).length === 1, `${question.id} 的正確標點沒有唯一地存在於選項中。`);
      check(['。', '？', '！'].includes(question.answer), `${question.id} 使用了範圍外的標點答案。`);
    }

    if (unit.interaction === 'sentence-expand') {
      const parts = Object.values(question.parts || {});
      check(parts.length === 4, `${question.id} 應有時間、人物、地點與動作 4 個要素。`);
      for (const part of parts) {
        check(part.choices?.length === 3, `${question.id} 的「${part.label}」應有 3 個選項。`);
        check(new Set(part.choices).size === part.choices.length, `${question.id} 的「${part.label}」選項重複。`);
        check(part.choices.filter((item) => item === part.answer).length === 1, `${question.id} 的「${part.label}」正確答案沒有唯一地存在於選項中。`);
      }
    }
  }
}

const summary = {
  grade: p1.grade,
  subject: p1.subject,
  units: units.map((unit) => ({ id: unit.id, title: unit.title, interaction: unit.interaction, questionCount: unit.questions.length })),
  questionsReviewed: questionIds.size,
  structuralFailures: failures,
};

console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exitCode = 1;
