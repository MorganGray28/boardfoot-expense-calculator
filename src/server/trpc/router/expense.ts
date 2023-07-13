import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const expenseRouter = router({
	addExpense: protectedProcedure
		.input(
			z.object({
				amount: z.number().positive(),
				name: z.string(),
				cost: z.number().positive(),
				projectId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.expense.create({
					data: input,
				});
			} catch (err) {
				console.log(err);
			}
		}),
	deleteExpense: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		try {
			await ctx.prisma.expense.delete({
				where: {
					id: input,
				},
			});
		} catch (err) {
			console.log(err);
		}
	}),
});
