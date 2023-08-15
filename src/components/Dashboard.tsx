import React, { useState, Dispatch, SetStateAction } from 'react';
import { trpc } from '../utils/trpc';
import { ProjectType } from '../types/types';
import { ActiveProjectForm } from './ActiveProjectForm';
import ExpenseAndConsumableGroup from './ExpenseAndConsumableGroup';
import ExpenseTable from './ExpenseTable';
import ConsumableTable from './ConsumableTable';
import NewProjectForm from './NewProjectForm';

type PropsType = {
	projects: ProjectType[] | undefined;
	activeProject: ProjectType | null;
	isLoading: boolean;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
};

export default function Dashboard({ projects, activeProject, setActiveProject, isLoading }: PropsType) {
	const [isEditingProject, setIsEditingProject] = useState(false);
	const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);

	const ctx = trpc.useContext();
	const { mutateAsync: deleteProject, isLoading: isDeleting } = trpc.project.deleteProject.useMutation({
		onSuccess: () => {
			setActiveProject(null);
			ctx.user.getProjectsById.invalidate();
		},
	});

	function handleDeleteProject() {
		if (activeProject) {
			deleteProject(activeProject.id);
		}
	}

	if (projects?.length) {
		return (
			<div>
				{isCreatingNewProject ? (
					<NewProjectForm
						cancel={true}
						setActiveProject={setActiveProject}
						setIsCreatingNewProject={setIsCreatingNewProject}
					/>
				) : (
					<ActiveProjectForm
						projects={projects}
						activeProject={activeProject}
						setActiveProject={setActiveProject}
						setIsCreatingNewProject={setIsCreatingNewProject}
					/>
				)}
				{isEditingProject && activeProject ? (
					<EditProjectNameForm
						projectName={activeProject.name}
						id={activeProject.id}
						setActiveProject={setActiveProject}
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
					<ExpenseTable activeProject={activeProject} setActiveProject={setActiveProject} />
					<ConsumableTable />
				</ExpenseAndConsumableGroup>
			</div>
		);
	} else if (isLoading) {
		return (
			<div>
				<p>Loading...</p>
			</div>
		);
	} else {
		return (
			// TODO: Change this to a more inviting initial create your first project input
			// TODO: Also, incorporate Project Description in creating new project
			<div>
				<NewProjectForm
					cancel={false}
					setActiveProject={setActiveProject}
					setIsCreatingNewProject={setIsCreatingNewProject}
				/>
			</div>
		);
	}
}

function EditProjectNameForm({
	projectName,
	id,
	setIsEditingProject,
	setActiveProject,
}: {
	projectName: string;
	id: string;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
	setIsEditingProject: Dispatch<SetStateAction<boolean>>;
}) {
	const [projectNameInput, setProjectNameInput] = useState(projectName);

	const ctx = trpc.useContext();
	const {
		mutate: updateProjectName,
		error,
		isError,
	} = trpc.project.updateProjectName.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data);
			}
		},
		onError: () => console.log('there is an error'),
		onSettled: () => ctx.user.getProjectsById.invalidate(),
	});

	function handleNameInputChange(e: React.FormEvent<HTMLInputElement>) {
		setProjectNameInput(e.currentTarget.value);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
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
