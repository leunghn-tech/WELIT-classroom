import p1MathBank from './p1.js';
import p2MathBank from './p2.js';
import p3MathBank from './p3.js';
import p4MathBank from './p4.js';
import p5MathBank from './p5.js';
import p6MathBank from './p6.js';
import { annotateQuestionBank } from '../questionMetadata.js';

const rawMathQuestionBanks = { P1: p1MathBank, P2: p2MathBank, P3: p3MathBank, P4: p4MathBank, P5: p5MathBank, P6: p6MathBank };
export const mathQuestionBanks = Object.fromEntries(Object.entries(rawMathQuestionBanks).map(([grade, bank]) => [grade, annotateQuestionBank(bank, '數學')]));
export const getMathQuestionBank = (grade) => mathQuestionBanks[grade] || null;
