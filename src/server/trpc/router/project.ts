import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const projectRouter = router({
	getProject: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.project.findUnique({
			where: {
				id: input,
			},
			include: {
				lumber: true,
				consumables: true,
			},
		});
	}),

	createProject: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		const userId = ctx.session.user.id;
		try {
			const project = await ctx.prisma.project.create({
				data: { name: input, userId },
			});
			return project;
		} catch (err) {
			console.log(err);
		}
	}),
});
