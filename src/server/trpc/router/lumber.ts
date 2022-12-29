import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

const dimensionLumberInput = z.object({
	numOfPieces: z.string(),
	thickness: z.string(),
	width: z.string(),
	length: z.string(),
	species: z.string(),
	price: z.string(),
	tax: z.string(),
});

export const lumberRouter = router({
	addDimensionLumber: protectedProcedure.input(dimensionLumberInput).mutation(async ({ ctx, input }) => {
		try {
			await ctx.prisma.lumber.create({
				data: {},
			});
		} catch (err) {
			console.log(err);
		}
	}),
});
