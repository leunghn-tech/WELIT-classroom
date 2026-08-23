import p1 from './p1.js';
import p2 from './p2.js';
import p3 from './p3.js';
import p4 from './p4.js';
import p5 from './p5.js';
import p6 from './p6.js';
import { annotateQuestionBank } from '../questionMetadata.js';

const rawEnglishQuestionBanks = { P1: p1, P2: p2, P3: p3, P4: p4, P5: p5, P6: p6 };
export const englishQuestionBanks = Object.fromEntries(Object.entries(rawEnglishQuestionBanks).map(([grade, bank]) => [grade, annotateQuestionBank(bank, '英文')]));

export function getEnglishQuestionBank(grade) {
  return englishQuestionBanks[grade] || null;
}
