import { englishQuestionBanks } from '../client/src/data/questionBanks/english/index.js';
import englishCatalog from '../client/src/data/englishCatalog.js';
import { englishPracticeLinks } from '../client/src/data/catalogPracticeLinks.js';

const expectedOrder = {
  P1: ['P1-EN-A01', 'P1-EN-P01', 'P1-EN-V01', 'P1-EN-G04', 'P1-EN-G05', 'P1-EN-G03', 'P1-EN-G01', 'P1-EN-G02', 'P1-EN-L01', 'P1-EN-S01'],
  P2: ['P2-EN-P01', 'P2-EN-G01', 'P2-EN-G05', 'P2-EN-G02', 'P2-EN-G03', 'P2-EN-G04'],
  P3: ['P3-EN-G01', 'P3-EN-G02', 'P3-EN-G03', 'P3-EN-G04', 'P3-EN-G05', 'P3-EN-L01', 'P3-EN-S01', 'P3-EN-M01'],
  P4: ['P4-EN-G01', 'P4-EN-G02', 'P4-EN-G03', 'P4-EN-G04', 'P4-EN-G05', 'P4-EN-G06', 'P4-EN-G07', 'P4-EN-R01'],
  P5: ['P5-EN-G01', 'P5-EN-G02', 'P5-EN-G06', 'P5-EN-G07', 'P5-EN-G03', 'P5-EN-G04', 'P5-EN-G05', 'P5-EN-S01', 'P5-EN-S02', 'P5-EN-R01'],
  P6: ['P6-EN-G01', 'P6-EN-RW01', 'P6-EN-G02', 'P6-EN-RW02', 'P6-EN-G03', 'P6-EN-G04', 'P6-EN-R01'],
};

const errors = [];
const banks = Object.values(englishQuestionBanks);
for (const bank of banks) {
  const ids = bank.units.map((unit) => unit.id);
  const expected = expectedOrder[bank.grade] || [];
  if (JSON.stringify(ids) !== JSON.stringify(expected)) errors.push(`${bank.grade} 題庫順序不符合覆核後學習路徑。`);
  if (!englishCatalog[bank.grade]?.summary) errors.push(`${bank.grade} 缺少課程遞進說明。`);
  for (const unit of bank.units) if (!englishPracticeLinks[bank.grade]?.[unit.id]) errors.push(`${unit.id} 缺少英文目錄映射。`);
}

const removedEnglishUnitIds = ['P2-EN-W01', 'P3-EN-W01', 'P4-EN-W01', 'P5-EN-W01', 'P6-EN-W01', 'P6-EN-W02', 'P6-EN-W03', 'P6-EN-W04', 'P6-EN-W05', 'P6-EN-W06'];
for (const unitId of removedEnglishUnitIds) {
  const grade = unitId.split('-')[0];
  if (englishQuestionBanks[grade]?.units.some((unit) => unit.id === unitId)) errors.push(`${unitId} 已被指定刪除，不應再出現在英文目錄。`);
  if (englishPracticeLinks[grade]?.[unitId]) errors.push(`${unitId} 已被指定刪除，不應保留英文目錄映射。`);
}

const report = { valid: errors.length === 0, grades: banks.map((bank) => bank.grade), unitsReviewed: banks.reduce((total, bank) => total + bank.units.length, 0), errors };
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
