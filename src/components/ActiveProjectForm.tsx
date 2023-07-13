import React, { ChangeEvent, useState } from 'react';
import styles from '../styles/ActiveProjectForm.module.scss';
import { ProjectType } from '../types/types';
import { trpc } from '../utils/trpc';

interface PropsType {
	projects: ProjectType[];
	activeProject: ProjectType | null;
	updateActiveProject: (project: ProjectType | null) => void;
}

export function ActiveProjectForm({ projects, activeProject, updateActiveProject }: PropsType) {
	const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');

	const { mutateAsync: addNewProject, isLoading: isCreating } = trpc.project.createProject.useMutation({
		onSuccess: () => {
			setNewProjectName('');
			setIsCreatingNewProject(false);
			ctx.user.getProjectsById.invalidate();
		},
	});

	const ctx = trpc.useContext();

	function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
		if (!e.target.value) {
			updateActiveProject(null);
		}
		let newActiveProject = projects.filter((p) => p.id === e.target.value);
		if (newActiveProject && newActiveProject[0]) {
			updateActiveProject(newActiveProject[0]);
		}
	}

	function handleCancelNewProject() {
		setIsCreatingNewProject(false);
		setNewProjectName('');
	}

	async function handleSubmitNewProject() {
		if (newProjectName) {
			const newProject = await addNewProject(newProjectName);
			if (newProject) {
				updateActiveProject(newProject);
			}
		}
	}

	let content;

	if (isCreatingNewProject) {
		content = (
			<>
				<label htmlFor='newProject'>New Project Name</label>
				<input
					id='newProject'
					type='text'
					placeholder='enter project name'
					value={newProjectName}
					onChange={(e) => setNewProjectName(e.target.value)}
				/>
				<button onClick={() => handleCancelNewProject()}>Cancel</button>
				<button disabled={isCreating} onClick={() => handleSubmitNewProject()}>
					Create Project
				</button>
			</>
		);
	} else {
		content = (
			<>
				<p className={styles.header}>Choose a Project</p>
				<select
					className={styles.selectInput}
					name='projectList'
					onChange={(e) => handleChange(e)}
					value={activeProject?.id}
				>
					<option value={''}></option>
					{projects.map((project) => (
						<option value={project.id} key={project.id}>
							{project.name}
						</option>
					))}
				</select>
				<button onClick={() => setIsCreatingNewProject(true)}>New Project</button>
			</>
		);
	}

	return <div className={styles.container}>{content}</div>;
}
