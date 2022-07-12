import { z } from "zod";

import { createRouter } from "./context";
import { prisma } from "../../db/client";
import { createQuestionValidator } from "../../shared/create-question-validator";

export const questionRouter = createRouter()
  .query("get-all-my-questions", {
    async resolve({ ctx }) {
      if (!ctx.token) return [];

      return await prisma.pollQuestion.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          },
        },
      });
    },
  })
  .query("get-by-id", {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      const question = await prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      });

      const myVote = await prisma.vote.findFirst({
        where: {
          questionId: input.id,
          voterToken: ctx.token,
        },
      });

      const rest = {
        question,
        vote: myVote,
        isOwner: question?.ownerToken === ctx.token,
      };

      if (rest.vote || rest.isOwner) {
        const votes = await prisma.vote.groupBy({
          where: {
            questionId: input.id,
          },
          by: ["choice"],
          _count: true,
        });

        return {
          ...rest,
          votes,
        };
      }

      return { ...rest, votes: undefined };
    },
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({ ctx, input }) {
      if (!ctx.token) throw new Error("Unauthorized");
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.token,
        },
      });
    },
  })
  .mutation("vote-on-question", {
    input: z.object({
      questionId: z.string(),
      option: z.number().min(0).max(10),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.token) throw new Error("Unauthorized");
      await prisma.vote.create({
        data: {
          choice: input.option,
          questionId: input.questionId,
          voterToken: ctx.token,
        },
      });

      return await prisma.vote.groupBy({
        where: { questionId: input.questionId },
        by: ["choice"],
        _count: true,
      });
    },
  });
