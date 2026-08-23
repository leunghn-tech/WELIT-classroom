export const DIFFICULTY_LABELS = ['基礎', '應用', '進階', '挑戰'];

function resolveDifficulty(grade, index, total) {
  const ratio = (index + 1) / Math.max(total, 1);
  if (grade === 'P1') return ratio <= 0.55 ? '基礎' : '應用';
  if (grade === 'P2') return ratio <= 0.3 ? '基礎' : ratio <= 0.8 ? '應用' : '進階';
  if (grade === 'P3') return ratio <= 0.2 ? '基礎' : ratio <= 0.7 ? '應用' : ratio <= 0.9 ? '進階' : '挑戰';
  if (grade === 'P4') return ratio <= 0.25 ? '應用' : ratio <= 0.72 ? '進階' : '挑戰';
  return ratio <= 0.2 ? '應用' : ratio <= 0.65 ? '進階' : '挑戰';
}

export function annotateQuestionBank(bank, subject) {
  return {
    ...bank,
    units: bank.units.map((unit) => ({
      ...unit,
      learningObjective: unit.learningObjective || unit.objective || `掌握本單元的${subject}學習重點。`,
      questions: unit.questions.map((question, index) => ({
        ...question,
        difficulty: question.difficulty || resolveDifficulty(bank.grade, index, unit.questions.length),
        learningObjective: question.learningObjective || unit.learningObjective || unit.objective || `掌握本單元的${subject}學習重點。`,
      })),
    })),
  };
}
