import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const BoardFeetSchema = z.object({
	numOfPieces: z.number().positive().min(1),
	thickness: z.number(),
	width: z.number(),
	length: z.number(),
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
});
