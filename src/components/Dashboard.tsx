import React, { useState } from 'react';
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

export interface ProjectType {
	createdAt: Date;
	id: string;
	name: string;
	updatedAt: Date;
	userId: string;
}

export default function Dashboard() {
	const { data: session } = useSession();
	const [activeProject, setActiveProject] = useState('');

	const projects = trpc.user.getProjectsById.useQuery(session?.user?.id!);
	const userData = trpc.user.getUserData.useQuery(session?.user?.id!);

	if (projects.data) {
		return (
			<div>
				<ActiveProjectForm
					projects={projects.data}
					activeProject={activeProject}
					updateActiveProject={setActiveProject}
				/>
				<ExpenseAndConsumableGroup>
					<ExpenseTable />
					<ConsumableTable />
				</ExpenseAndConsumableGroup>
			</div>
		);
	} else {
		return <p>Loading...</p>;
	}
}
