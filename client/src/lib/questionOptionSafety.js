export const normaliseChoiceValue = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/[⁄／]/gu, '/')
  .replace(/[−–—]/gu, '-')
  .replace(/\s+/gu, '')
  .replace(/^[$]/u, '');

export function validateQuestionOptionSafety({ questionId, answer, choices }) {
  const optionValues = Array.isArray(choices) ? choices.map(normaliseChoiceValue) : [];
  const answerValue = normaliseChoiceValue(answer);
  const uniqueValues = new Set(optionValues);
  const correctIndexes = optionValues.flatMap((value, index) => value === answerValue ? [index] : []);
  const wrongIndexes = optionValues.flatMap((value, index) => value !== answerValue ? [index] : []);
  const reasons = [];
  if (!questionId) reasons.push('MISSING_QUESTION_ID');
  if (!answerValue) reasons.push('MISSING_ANSWER');
  if (optionValues.length !== 4) reasons.push('NOT_FOUR_CHOICES');
  if (uniqueValues.size !== optionValues.length) reasons.push('DUPLICATE_CHOICES');
  if (correctIndexes.length !== 1) reasons.push(correctIndexes.length ? 'DUPLICATE_CORRECT_ANSWER' : 'ANSWER_NOT_IN_CHOICES');
  if (wrongIndexes.length < 2) reasons.push('INSUFFICIENT_WRONG_CHOICES');
  return {
    safe: reasons.length === 0,
    reasons,
    questionId: String(questionId || ''),
    answerValue,
    optionValues,
    correctIndexes,
    wrongIndexes,
  };
}

export function pickTwoWrongOptionIndexes(validation, random = Math.random) {
  if (!validation?.safe) return [];
  const candidates = [...validation.wrongIndexes];
  for (let index = candidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [candidates[index], candidates[swapIndex]] = [candidates[swapIndex], candidates[index]];
  }
  return candidates.slice(0, 2);
}
