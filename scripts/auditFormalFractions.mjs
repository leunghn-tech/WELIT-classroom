/* 分數呈現稽核：列出全數學題庫的 a/b 資料，確認皆在正式分數元件支援的學生可見欄位中。 */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const grades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const fractionPattern = /\d+\s*\/\s*\d+/g;
const supportedPaths = new Set(['prompt', 'answer', 'choices', 'explanation', 'lifeModel.known', 'lifeModel.steps', 'lifeModel.check', 'visual.label']);
const report = { generatedAt: new Date().toISOString(), questionsReviewed: 0, fractionOccurrences: 0, supportedOccurrences: [], unsupportedOccurrences: [] };

for (const grade of grades) {
  const module = await import(`../client/src/data/questionBanks/math/${grade.toLowerCase()}.js`);
  for (const unit of module.default.units) {
    for (const question of unit.questions) {
      report.questionsReviewed += 1;
      const entries = [
        ['prompt', question.prompt], ['answer', question.answer], ['choices', question.choices], ['explanation', question.explanation],
        ['lifeModel.known', question.lifeModel?.known], ['lifeModel.steps', question.lifeModel?.steps], ['lifeModel.check', question.lifeModel?.check], ['visual.label', question.visual?.label],
      ];
      for (const [path, value] of entries) {
        const strings = Array.isArray(value) ? value : [value];
        strings.filter((item) => typeof item === 'string').forEach((item) => {
          const matches = item.match(fractionPattern) || [];
          matches.forEach((fraction) => {
            report.fractionOccurrences += 1;
            const record = { grade, unitId: unit.id, questionId: question.id, path, fraction: fraction.replace(/\s+/g, '') };
            if (supportedPaths.has(path)) report.supportedOccurrences.push(record);
            else report.unsupportedOccurrences.push(record);
          });
        });
      }
    }
  }
}

await mkdir('/home/ubuntu/question-bank-audit', { recursive: true });
const outputPath = resolve('/home/ubuntu/question-bank-audit/formal-fraction-audit.json');
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, questionsReviewed: report.questionsReviewed, fractionOccurrences: report.fractionOccurrences, supportedOccurrences: report.supportedOccurrences.length, unsupportedOccurrences: report.unsupportedOccurrences.length }, null, 2));
if (report.unsupportedOccurrences.length) process.exitCode = 1;
