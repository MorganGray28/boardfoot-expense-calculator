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
});
