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
	const ctx = trpc.useContext();
	const { mutate: deleteProject, isLoading: isDeleting } = trpc.project.deleteProject.useMutation({
		onSuccess: () => {
			ctx.user.getProjectsById.invalidate();
		},
	});

	let newActiveProject;
	if (activeProject) {
		newActiveProject = projects?.filter((project) => project.id === activeProject.id)[0];
	}

	function handleDeleteProject() {
		if (activeProject) {
			const nextActiveProject = deleteProject(activeProject.id);
			// FIXME: Once active project is deleted, update the active project
		}
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
					<button onClick={handleDeleteProject}>Delete</button>
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
