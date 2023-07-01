import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const BoardFeetSchema = z.object({
	numOfPieces: z.number().positive().min(1),
	thickness: z.number(),
	width: z.number(),
	length: z.number(),
	name: z.string().optional(),
	species: z.string(),
	price: z.number(),
	tax: z.number(),
});

export const lumberRouter = router({
	addDimensionLumber: protectedProcedure
		.input(
			z.object({
				numOfPieces: z.number().positive().min(1),
				thickness: z.number().positive(),
				width: z.number().positive(),
				length: z.number().positive(),
				name: z.string().optional(),
				species: z.string(),
				price: z.number(),
				tax: z.number(),
				projectId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				// const parsedInput = BoardFeetSchema.safeParse(input);
				await ctx.prisma.lumber.create({
					data: input,
				});
			} catch (err) {
				console.log(err);
			}
		}),
	deleteDimensionLumber: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		try {
			await ctx.prisma.lumber.delete({
				where: {
					id: input,
				},
			});
		} catch (err) {
			console.log(err);
		}
	}),
});
