import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { LumberType, ConsumableType, ProjectType } from '../types/types';
import { ActiveProjectForm } from './ActiveProjectForm';
import ExpenseAndConsumableGroup from './ExpenseAndConsumableGroup';
import ExpenseTable from './ExpenseTable';
import ConsumableTable from './ConsumableTable';

// TODO: make modal work for adding lumber from bf calculator
// TODO: work on consumables table to adjust percentage for each
// TODO: make add consumables form component to add new consumables
// TODO: basic responsiveness
// TODO: Make sure it's presentable and deploy

/*
createdAt: Wed Dec 28 2022 15:15:59 GMT-0800 (Pacific Standard Time) {}
id: "clc89zzyu0000voj0oblg43f4"
name: "Shelf"
updatedAt: Wed Dec 28 2022 15:15:49 GMT-0800 (Pacific Standard Time) {}
userId: "clbyb148i0000vocsn6ai0qig"
[[Prototype]]: Object

*/

type PropsType = {
	activeProject: ProjectType | null;
	updateActiveProject: (project: ProjectType | null) => void;
};

export default function Dashboard({ activeProject, updateActiveProject }: PropsType) {
	const { data: session } = useSession();
	// const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

	const { data: projects, refetch: refetchProjects } = trpc.user.getProjectsById.useQuery(
		session?.user?.id!,
		{
			enabled: session?.user !== undefined,
		}
	);

	// useEffect(() => {
	// 	// if (projects.data) {
	// 		// console.log(projects.data);
	// 	}
	// }, [projects]);

	// const userData = trpc.user.getUserData.useQuery(session?.user?.id!);

	if (projects) {
		return (
			<div>
				<ActiveProjectForm
					projects={projects}
					activeProject={activeProject}
					updateActiveProject={updateActiveProject}
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
