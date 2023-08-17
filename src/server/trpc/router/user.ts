import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const userRouter = router({
	getProjectsById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.project.findMany({
			where: {
				userId: input,
			},
			include: {
				lumber: {
					orderBy: {
						createdAt: 'desc',
					},
				},
				expenses: {
					orderBy: {
						createdAt: 'desc',
					},
				},
			},
			orderBy: [
				{
					createdAt: 'desc',
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
