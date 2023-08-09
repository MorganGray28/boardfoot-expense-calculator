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
	getAllConsumables: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
		return await ctx.prisma.consumable.findMany({
			where: {
				userId: input,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}),
	updateConsumable: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				amount: z.number(),
				cost: z.number(),
				id: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.prisma.consumable.update({
					data: { name: input.name, cost: input.cost, amount: input.amount },
					where: {
						id: input.id,
					},
				});
			} catch (err) {
				console.log(err);
			}
		}),
	deleteConsumable: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		try {
			await ctx.prisma.consumable.delete({
				where: {
					id: input,
				},
			});
		} catch (err) {
			console.log(err);
		}
	}),
});
