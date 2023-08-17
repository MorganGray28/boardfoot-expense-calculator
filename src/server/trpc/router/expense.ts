import { router, protectedProcedure } from '../trpc';
import { date, z } from 'zod';

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
				let expense = await ctx.prisma.expense.create({
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
				return expense.project;
			} catch (err) {
				console.log(err);
			}
		}),
	deleteExpense: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		try {
			let deleted = await ctx.prisma.expense.delete({
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
	addManyExpenses: protectedProcedure
		.input(
			z.array(
				z.object({
					amount: z.number(),
					name: z.string(),
					cost: z.number(),
					projectId: z.string(),
				})
			)
		)
		.mutation(async ({ ctx, input }) => {
			try {
				let projectId = input[0]?.projectId;

				await ctx.prisma.expense.createMany({
					data: input,
				});
				let project = await ctx.prisma.project.findFirst({
					where: {
						id: projectId,
					},
					include: {
						lumber: true,
						expenses: true,
					},
				});
				return project;
			} catch (err) {
				console.log(err);
			}
		}),
	editGenericExpense: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
				cost: z.number(),
				amount: z.number(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				let updated = await ctx.prisma.expense.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
						amount: input.amount,
						cost: input.cost,
					},
					include: {
						project: {
							include: {
								expenses: {
									orderBy: { createdAt: 'desc' },
								},
								lumber: {
									orderBy: { createdAt: 'desc' },
								},
							},
						},
					},
				});
				return updated.project;
			} catch (err) {
				console.log(err);
			}
		}),
});
