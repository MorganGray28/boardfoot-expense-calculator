import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';
import { LumberType, ConsumableType, ProjectType } from '../types/types';
import { ActiveProjectForm } from './ActiveProjectForm';
import ExpenseAndConsumableGroup from './ExpenseAndConsumableGroup';
import ExpenseTable from './ExpenseTable';
import ConsumableTable from './ConsumableTable';

type PropsType = {
	projects: ProjectType[] | undefined;
	activeProject: ProjectType | null;
	updateActiveProject: (project: ProjectType | null) => void;
};

export default function Dashboard({ projects, activeProject, updateActiveProject }: PropsType) {
	const { data: session } = useSession();

	let newActiveProject;

	if (activeProject) {
		newActiveProject = projects?.filter((project) => project.id === activeProject.id)[0];
	}

	if (projects) {
		return (
			<div>
				<ActiveProjectForm
					projects={projects}
					activeProject={activeProject}
					updateActiveProject={updateActiveProject}
				/>
				<ExpenseAndConsumableGroup>
					<ExpenseTable activeProject={newActiveProject} />
					<ConsumableTable activeProject={activeProject} />
				</ExpenseAndConsumableGroup>
			</div>
		);
	} else {
		return <p>Loading...</p>;
	}
}
