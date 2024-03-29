import { router } from '../trpc';
import { authRouter } from './auth';
import { consumableRouter } from './consumable';
import { expenseRouter } from './expense';
import { lumberRouter } from './lumber';
import { projectRouter } from './project';
import { userRouter } from './user';

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	lumber: lumberRouter,
	project: projectRouter,
	expense: expenseRouter,
	consumable: consumableRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
