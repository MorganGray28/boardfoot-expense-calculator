import { z } from 'zod';
import { BoardFeetSchema } from '../server/trpc/router/lumber';

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

export type ConsumableType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	productName: string;
	price: number;
	usePercentage: number;
};

export type ProjectType = {
	createdAt: Date;
	id: string;
	name: string;
	updatedAt: Date;
	userId: string;
	lumber: LumberType[];
	consumables: ConsumableType[];
};
