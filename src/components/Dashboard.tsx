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
				{/* //TODO: Add styling to styles sheet */}
				<h3 style={{ textAlign: 'center' }}>{activeProject?.name}</h3>
				<div className='button-group' style={{ display: 'flex', justifyContent: 'center' }}>
					{/* //TODO: Add functionality to buttons */}
					<button>Edit</button>
					<button>Delete</button>
				</div>
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
