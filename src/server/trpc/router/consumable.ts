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
			include: {
				projects: true,
			},
		});
	}),
	toggleConsumableInActiveProject: protectedProcedure
		.input(
			z.object({
				consumableId: z.string(),
				projectId: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				let activeProject = await ctx.prisma.project.findUnique({
					where: {
						id: input.projectId,
					},
					include: {
						consumables: true,
					},
				});
				if (activeProject) {
					let consumableInProject = activeProject?.consumables.filter(
						(c) => c.id === input.consumableId
					).length;
					if (!consumableInProject) {
						// if the consumable we're toggling is NOT already in the Project consumables list, we connect it to the project's consumable list
						await ctx.prisma.project.update({
							where: {
								id: input.projectId,
							},
							data: {
								consumables: {
									connect: { id: input.consumableId },
								},
							},
						});
					} else {
						// if the consumable we're toggling is in Project Consumable list, we disconnect the connection
						await ctx.prisma.project.update({
							where: {
								id: input.projectId,
							},
							data: {
								consumables: {
									disconnect: { id: input.consumableId },
								},
							},
						});
					}
				}
			} catch (err) {
				console.log(err);
			}
		}),
});
