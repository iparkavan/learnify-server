import { prisma } from "../config/prisma.config";

export const createQuiz = async (lectureId: string, data: any) => {
  return prisma.quiz.create({
    data: {
      lectureId,
      questions: {
        create: data.questions.map(
          (q: {
            question: any;
            options: { [x: string]: any };
            correctAnswer: string | number;
          }) => ({
            text: q.question,
            options: q.options,
            answer: q.options[q.correctAnswer],
          }),
        ),
      },
    },
  });
};
