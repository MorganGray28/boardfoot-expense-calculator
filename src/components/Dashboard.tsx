import React, { useState, Dispatch, SetStateAction } from 'react';
import { trpc } from '../utils/trpc';
import { ProjectType } from '../types/types';
import { ActiveProjectForm } from './ActiveProjectForm';
import ExpenseAndConsumableGroup from './ExpenseAndConsumableGroup';
import ExpenseTable from './ExpenseTable';
import ConsumableTable from './ConsumableTable';

type PropsType = {
	projects: ProjectType[] | undefined;
	activeProject: ProjectType | null;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
};

export default function Dashboard({ projects, activeProject, setActiveProject }: PropsType) {
	const [isEditingProject, setIsEditingProject] = useState(false);

	const ctx = trpc.useContext();
	const { mutateAsync: deleteProject, isLoading: isDeleting } = trpc.project.deleteProject.useMutation({
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
		}
	}

	if (projects) {
		return (
			<div>
				<ActiveProjectForm
					projects={projects}
					activeProject={activeProject}
					setActiveProject={setActiveProject}
				/>
				{isEditingProject && activeProject ? (
					<EditProjectNameForm
						projectName={activeProject.name}
						id={activeProject.id}
						setIsEditingProject={setIsEditingProject}
					/>
				) : (
					<>
						<h3 style={{ textAlign: 'center', textTransform: 'capitalize' }}>
							{activeProject?.name ? activeProject.name : ''}
						</h3>
						{projects.length && activeProject ? (
							<div className='button-group' style={{ display: 'flex', justifyContent: 'center' }}>
								<button onClick={() => setIsEditingProject(true)}>Edit</button>
								<button onClick={handleDeleteProject} disabled={isDeleting}>
									Delete
								</button>
							</div>
						) : (
							''
						)}
					</>
				)}

				<ExpenseAndConsumableGroup>
					<ExpenseTable activeProject={newActiveProject} />
					<ConsumableTable />
				</ExpenseAndConsumableGroup>
			</div>
		);
	} else {
		return <p>Loading...</p>;
	}
}

function EditProjectNameForm({
	projectName,
	id,
	setIsEditingProject,
}: {
	projectName: string;
	id: string;
	setIsEditingProject: Dispatch<SetStateAction<boolean>>;
}) {
	const [projectNameInput, setProjectNameInput] = useState(projectName);

	const ctx = trpc.useContext();
	const {
		mutateAsync: updateProjectName,
		error,
		isError,
	} = trpc.project.updateProjectName.useMutation({
		onError: () => console.log('there is an error'),
		onSettled: async () => await ctx.user.getProjectsById.invalidate(),
	});

	function handleNameInputChange(e: React.FormEvent<HTMLInputElement>) {
		setProjectNameInput(e.currentTarget.value);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		console.log({ id, projectNameInput });
		updateProjectName({ projectId: id, newName: projectNameInput });
		if (!error) {
			setIsEditingProject(false);
		}
	}

	return (
		<form onSubmit={(e) => handleSubmit(e)}>
			<label htmlFor='projectName'>Edit Project Name</label>
			<input
				type='text'
				id='projectName'
				name='projectName'
				value={projectNameInput}
				onChange={(e) => handleNameInputChange(e)}
			/>
			<button type='button' onClick={() => setIsEditingProject(false)}>
				Cancel
			</button>
			<button type='submit'>Done</button>
		</form>
	);
}
