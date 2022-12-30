import { z } from 'zod';
import { BoardFeetSchema } from '../server/trpc/router/lumber';

export type BoardFeetType = z.infer<typeof BoardFeetSchema>;
