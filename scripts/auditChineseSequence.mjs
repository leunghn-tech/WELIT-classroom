import { chineseQuestionBanks } from '../client/src/data/questionBanks/chinese/index.js';
import chineseCatalog from '../client/src/data/chineseCatalog.js';
import { chinesePracticeLinks } from '../client/src/data/catalogPracticeLinks.js';

const expectedOrders = {
  P1: ['P1-CN-R01', 'P1-CN-R02', 'P1-CN-R03', 'P1-CN-W01'],
  P2: ['P2-CN-R03', 'P2-CN-R01', 'P2-CN-R02', 'P2-CN-W01', 'P2-CN-W02', 'P2-CN-W03'],
  P3: ['P3-CN-R01', 'P3-CN-R03', 'P3-CN-R09', 'P3-CN-R07', 'P3-CN-R08', 'P3-CN-R02', 'P3-CN-R04', 'P3-CN-R05', 'P3-CN-R06', 'P3-CN-W03', 'P3-CN-W01', 'P3-CN-W02'],
  P4: ['P4-CN-R01', 'P4-CN-R02', 'P4-CN-R07', 'P4-CN-R08', 'P4-CN-R06', 'P4-CN-R03', 'P4-CN-R04', 'P4-CN-R05', 'P4-CN-W02', 'P4-CN-W01', 'P4-CN-W03', 'P4-CN-W04'],
  P5: ['P5-CN-R03', 'P5-CN-R01', 'P5-CN-R02', 'P5-CN-W05', 'P5-CN-W06', 'P5-CN-W02', 'P5-CN-W01', 'P5-CN-W03', 'P5-CN-W04'],
  P6: ['P6-CN-R02', 'P6-CN-R01', 'P6-CN-W01', 'P6-CN-W06', 'P6-CN-W07', 'P6-CN-W08', 'P6-CN-W02', 'P6-CN-W03', 'P6-CN-W04', 'P6-CN-W05'],
};

const issues = [];
for (const [grade, expected] of Object.entries(expectedOrders)) {
  const bank = chineseQuestionBanks[grade];
  const actual = bank.units.map((unit) => unit.id);
  if (actual.join('|') !== expected.join('|')) issues.push(`${grade} 單元順序不符：${actual.join(', ')}`);
  for (const unit of bank.units) {
    const link = chinesePracticeLinks[grade]?.[unit.id];
    if (!link) { issues.push(`${unit.id} 缺少目錄連結`); continue; }
    const [strand, index] = link;
    if (!chineseCatalog[grade]?.[strand]?.[index]) issues.push(`${unit.id} 連結到不存在的 ${strand}[${index}]`);
    if (!unit.questions.length) issues.push(`${unit.id} 沒有題目`);
  }
}

if (issues.length) {
  console.error(JSON.stringify({ valid: false, issues }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ valid: true, grades: Object.keys(expectedOrders), unitsReviewed: Object.values(expectedOrders).flat().length }, null, 2));
