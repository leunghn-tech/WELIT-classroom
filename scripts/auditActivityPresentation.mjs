/* 課堂呈現稽核：確保每一題可向學生顯示題幹，並完整保留句子、短文與 before／after 空格線索。 */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const grades = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const empty = (value) => value === undefined || value === null || String(value).trim() === '';
const text = (value) => !empty(value) && String(value).trim();

function collectQuestions(value, collected = new Map(), inherited = {}) {
  if (!value || typeof value !== 'object') return collected;
  if (Array.isArray(value)) { value.forEach((item) => collectQuestions(item, collected, inherited)); return collected; }
  if (Array.isArray(value.stories)) {
    value.stories.forEach((story) => story.questions.forEach((question) => collected.set(question.id, { ...question, __sharedContext: story.text || story.intro || '', __sharedTitle: story.title || '' })));
    return collected;
  }
  if (Array.isArray(value.passageSets)) {
    value.passageSets.forEach((passage) => passage.questions.forEach((question) => collected.set(question.id, { ...question, __sharedContext: passage.text || '', __sharedTitle: passage.title || '' })));
    return collected;
  }
  if (value.id && (value.prompt || value.sentence || value.context || value.source || value.target || value.answer || value.baseWord || value.blocks || value.parts || value.matches || value.character)) collected.set(value.id, { ...inherited, ...value });
  const parentMaterial = [inherited.__parentMaterial, value.prompt, value.title, value.sentence, value.context, value.source, value.text, value.instruction].filter(text).join('｜');
  Object.entries(value).forEach(([key, child]) => { if (key !== 'choices') collectQuestions(child, collected, { ...inherited, __parentMaterial: parentMaterial }); });
  return collected;
}

function visibleQuestionText(question) {
  if (question.before !== undefined || question.after !== undefined) return `${question.before || ''}（　）${question.after || ''}`.trim();
  const blocks = Array.isArray(question.blocks) ? question.blocks.map((block) => block.text).filter(text) : [];
  const steps = Array.isArray(question.steps) ? question.steps.flatMap((step) => [step.label, step.focus, ...(step.options || [])]).filter(text) : [];
  const parts = Array.isArray(question.parts) ? question.parts.map((part) => typeof part === 'string' ? part : part.text || part.label).filter(text) : [];
  return [question.prompt, question.title, question.sentence, question.context, question.source, question.text, question.scene, question.instruction, question.__sharedContext, question.__parentMaterial, question.baseWord, question.character, ...blocks, ...steps, ...parts].filter(text).join('｜');
}

function materialErrors(question) {
  const errors = [];
  if (!text(question.id)) errors.push('missing-question-id');
  if (!text(visibleQuestionText(question))) errors.push('missing-student-visible-prompt-or-context');
  if (question.before !== undefined || question.after !== undefined) {
    if (!text(question.before)) errors.push('before-after-question-missing-before');
    if (question.after !== undefined && typeof question.after !== 'string') errors.push('before-after-question-invalid-after');
  }
  for (const field of ['prompt', 'sentence', 'context', 'source', 'scene', 'instruction', 'text', 'before', 'after']) {
    if (question[field] !== undefined && !text(question[field]) && !(field === 'after' && question.before !== undefined)) errors.push(`blank-${field}`);
  }
  if (Array.isArray(question.blocks) && question.blocks.some((block) => !text(block.text))) errors.push('blank-reading-block');
  if (Array.isArray(question.paragraphs) && question.paragraphs.some((paragraph) => !text(paragraph.text))) errors.push('blank-paragraph');
  if (Array.isArray(question.choices) && question.choices.some((choice) => !text(choice))) errors.push('blank-choice');
  return errors;
}

const report = { generatedAt: new Date().toISOString(), questionsReviewed: 0, unitsReviewed: 0, missingPresentation: [], missingUnitMetadata: [], bySubject: {}, questionShapes: {} };
for (const [subjectKey, subjectLabel] of [['chinese', '中文'], ['english', '英文'], ['math', '數學']]) {
  report.bySubject[subjectLabel] = { units: 0, questions: 0 };
  for (const grade of grades) {
    const module = await import(`../client/src/data/questionBanks/${subjectKey}/${grade.toLowerCase()}.js`);
    for (const unit of module.default.units) {
      report.unitsReviewed += 1;
      report.bySubject[subjectLabel].units += 1;
      for (const field of ['id', 'title', 'interaction']) if (!text(unit[field])) report.missingUnitMetadata.push({ subject: subjectLabel, grade, unitId: unit.id || '(missing)', field });
      const questions = [...collectQuestions(unit).values()];
      for (const question of questions) {
        report.questionsReviewed += 1;
        report.bySubject[subjectLabel].questions += 1;
        const shape = question.before !== undefined || question.after !== undefined ? 'before-after-blank' : question.sentence ? 'sentence' : question.context ? 'context' : question.__sharedContext ? 'shared-passage' : question.source ? 'source' : question.prompt ? 'prompt' : 'other';
        report.questionShapes[shape] = (report.questionShapes[shape] || 0) + 1;
        const errors = materialErrors(question);
        if (errors.length) report.missingPresentation.push({ subject: subjectLabel, grade, unitId: unit.id, questionId: question.id || '(missing)', errors });
      }
    }
  }
}

await mkdir('/home/ubuntu/question-bank-audit', { recursive: true });
const outputPath = resolve('/home/ubuntu/question-bank-audit/activity-presentation-audit.json');
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, questionsReviewed: report.questionsReviewed, unitsReviewed: report.unitsReviewed, missingPresentation: report.missingPresentation.length, missingUnitMetadata: report.missingUnitMetadata.length, questionShapes: report.questionShapes }, null, 2));
if (report.missingPresentation.length || report.missingUnitMetadata.length) process.exitCode = 1;
