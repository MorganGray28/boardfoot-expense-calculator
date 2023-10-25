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
			},
		});
	}),

	createProject: protectedProcedure
		.input(z.object({ name: z.string(), description: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			try {
				const project = await ctx.prisma.project.create({
					data: { name: input.name, description: input.description, userId },
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

	createProjectWithLumber: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string(),
				values: z.object({
					numOfPieces: z.number().positive().min(1),
					thickness: z.number(),
					width: z.number(),
					length: z.number(),
					species: z.string(),
					price: z.number(),
					tax: z.number(),
				}),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const userId = ctx.session.user.id;
			try {
				const project = await ctx.prisma.project.create({
					data: {
						name: input.name,
						description: input.description,
						userId,
						lumber: {
							create: { ...input.values },
						},
					},
					include: {
						expenses: true,
						lumber: true,
					},
				});
				return project;
			} catch (err) {
				console.log(err);
			}
		}),

	deleteProject: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		try {
			await ctx.prisma.project.delete({
				where: {
					id: input,
				},
			});
		} catch (err) {
			console.log(err);
		}
	}),

	updateProjectName: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				newName: z.string(),
				newDescription: z.string().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			try {
				return await ctx.prisma.project.update({
					data: {
						name: input.newName,
						description: input.newDescription,
					},
					include: {
						expenses: true,
						lumber: true,
					},
					where: {
						id: input.projectId,
					},
				});
			} catch (err) {
				console.log(err);
			}
		}),
});
