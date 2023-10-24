import type { z } from 'zod';
import type { BoardFeetSchema } from '../server/trpc/router/lumber';

export type BoardFeetType = z.infer<typeof BoardFeetSchema>;

export type LumberType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name?: string | null;
	numOfPieces: number;
	thickness: number;
	width: number;
	length: number;
	species: string;
	price: number;
	tax: number;
};

export type ExpenseType = {
	amount: number;
	name: string;
	cost: number;
	[key: string | number]: string | number;
};

export type ExpenseTypeDB = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	amount: number;
	name: string;
	cost: number;
};

export type ConsumableType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	name: string;
	cost: number;
	amount: number;
};

export type ProjectType = {
	createdAt: Date;
	id: string;
	name: string;
	description?: string | null;
	updatedAt: Date;
	userId: string;
	lumber: LumberType[];
	expenses: ExpenseTypeDB[];
};
