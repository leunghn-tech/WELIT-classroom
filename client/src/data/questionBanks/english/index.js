import p1 from './p1.js';
import p2 from './p2.js';
import p3 from './p3.js';
import p4 from './p4.js';
import p5 from './p5.js';
import p6 from './p6.js';
import { annotateQuestionBank } from '../questionMetadata.js';

const rawEnglishQuestionBanks = { P1: p1, P2: p2, P3: p3, P4: p4, P5: p5, P6: p6 };
const englishDifficulty = (unit) => {
  const grade = unit.id.slice(0, 2);
  const text = `${unit.title} ${unit.objective}`.toLowerCase();
  let level = 1;
  if (grade === 'P2') level = /(continuous|there|question|story|段落)/.test(text) ? 2 : 1;
  if (grade === 'P3') level = /(past|irregular|paragraph|段落)/.test(text) ? 3 : 2;
  if (grade === 'P4') level = /(comparative|connector|reading|text|推論|寫作)/.test(text) ? 3 : 2;
  if (grade === 'P5') level = /(past continuous|小數|gerund|infinitive|narrative)/.test(text) ? 2 : 3;
  if (grade === 'P6') level = /(phrasal|短語|gerund|infinitive)/.test(text) ? 2 : 3;
  const details = {
    1: { label: '入門', note: '以熟悉詞彙、句型或單一步驟建立英語基礎。' },
    2: { label: '鞏固', note: '把已學文法或詞彙運用到完整句子與生活語境。' },
    3: { label: '挑戰', note: '需要綜合時態、語篇線索或多個句式完成任務。' },
  };
  return { level, ...details[level] };
};
export const englishQuestionBanks = Object.fromEntries(Object.entries(rawEnglishQuestionBanks).map(([grade, bank]) => [grade, annotateQuestionBank({ ...bank, units: bank.units.map((unit) => ({ ...unit, difficulty: englishDifficulty(unit) })) }, '英文')]));

export function getEnglishQuestionBank(grade) {
  return englishQuestionBanks[grade] || null;
}
