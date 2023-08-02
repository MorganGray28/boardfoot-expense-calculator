import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const userRouter = router({
	getProjectsById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.project.findMany({
			where: {
				userId: input,
			},
			include: {
				lumber: true,
				expenses: true,
			},
			orderBy: [
				{
					updatedAt: 'desc',
				},
			],
		});
	}),
	getUserData: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.user.findUnique({
			where: {
				id: input,
			},
			include: {
				projects: {
					include: {
						lumber: true,
					},
					orderBy: [{ updatedAt: 'desc' }],
				},
			},
		});
	}),
});
