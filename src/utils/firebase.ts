import { PointQuestion } from '@/types';

export const validatePointQuestion = (q: PointQuestion | undefined | null) => {
  if (!q) return false;
  if (!q.question || q.question == '') return false;
  if (!q.correctAnswer || q.correctAnswer == '') return false;
  if (q.incorrectAnswers.length != 3 || q.incorrectAnswers.find(q => q === ''))
    return false;
  return true;
};
