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
				return await ctx.prisma.lumber.create({
					data: input,
					include: {
						project: {
							include: {
								expenses: true,
								lumber: true,
							},
						},
					},
				});
			} catch (err) {
				throw err;
			}
		}),
	deleteDimensionLumber: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		try {
			let deleted = await ctx.prisma.lumber.delete({
				where: {
					id: input,
				},
				include: {
					project: {
						include: {
							expenses: true,
							lumber: true,
						},
					},
				},
			});
			let updatedProject = await ctx.prisma.project.findFirst({
				where: {
					id: deleted.project.id,
				},
				include: {
					expenses: true,
					lumber: true,
				},
			});

			return updatedProject;
		} catch (err) {
			console.log(err);
		}
	}),
});
