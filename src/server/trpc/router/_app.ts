import { router } from '../trpc';
import { authRouter } from './auth';
import { lumberRouter } from './lumber';
import { projectRouter } from './project';
import { userRouter } from './user';

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	lumber: lumberRouter,
	project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
