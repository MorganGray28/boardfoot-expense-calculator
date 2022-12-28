import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const userRouter = router({
	getProjectsById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.project.findMany({
			where: {
				userId: input,
			},
		});
	}),
});

/*
export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
});
*/
