import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const consumableRouter = router({
	addNewConsumables: protectedProcedure
		.input(
			z.array(
				z.object({
					amount: z.number(),
					name: z.string(),
					cost: z.number(),
					userId: z.string(),
				})
			)
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.consumable.createMany({ data: input });
			} catch (err) {
				console.log(err);
			}
		}),
	getAllConsumables: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
		return ctx.prisma.consumable.findMany({
			where: {
				userId: input,
			},
		});
	}),
});
