import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { ActiveProjectForm } from './ActiveProjectForm';
import ExpenseAndConsumableGroup from './ExpenseAndConsumableGroup';
import ExpenseTable from './ExpenseTable';
import ConsumableTable from './ConsumableTable';

/*
createdAt: Wed Dec 28 2022 15:15:59 GMT-0800 (Pacific Standard Time) {}
id: "clc89zzyu0000voj0oblg43f4"
name: "Shelf"
updatedAt: Wed Dec 28 2022 15:15:49 GMT-0800 (Pacific Standard Time) {}
userId: "clbyb148i0000vocsn6ai0qig"
[[Prototype]]: Object

*/
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

type PropsType = {
	updateProjects(): void;
};

export default function Dashboard(updateProjects: ProjectType) {
	const { data: session } = useSession();
	const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

	const projects = trpc.user.getProjectsById.useQuery(session?.user?.id!);

	useEffect(() => {
		if (projects.data) {
			console.log(projects.data);
		}
	}, [projects]);

	// const userData = trpc.user.getUserData.useQuery(session?.user?.id!);

	if (projects && projects.data) {
		return (
			<div>
				<ActiveProjectForm
					projects={projects.data}
					activeProject={activeProject}
					updateActiveProject={setActiveProject}
				/>
				<ExpenseAndConsumableGroup>
					<ExpenseTable activeProject={activeProject} />
					<ConsumableTable activeProject={activeProject} />
				</ExpenseAndConsumableGroup>
			</div>
		);
	} else {
		return <p>Loading...</p>;
	}
}
