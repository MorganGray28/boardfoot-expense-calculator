import React, { Dispatch, SetStateAction } from 'react';
import styles from '../styles/ActiveProjectForm.module.scss';
import { ProjectType } from '../types/types';

interface PropsType {
	projects: ProjectType[];
	activeProject: ProjectType | null;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
	setIsCreatingNewProject: Dispatch<SetStateAction<boolean>>;
}

export function ActiveProjectForm({
	projects,
	activeProject,
	setActiveProject,
	setIsCreatingNewProject,
}: PropsType) {
	function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
		if (!e.target.value) {
			setActiveProject(null);
		}
		let newActiveProject = projects.filter((p) => p.id === e.target.value);
		if (newActiveProject && newActiveProject[0]) {
			setActiveProject(newActiveProject[0]);
		}
	}

	return (
		<div className={styles.container}>
			<p className={styles.header}>Choose a Project</p>
			<select
				className={styles.selectInput}
				name='projectList'
				onChange={(e) => handleChange(e)}
				value={activeProject?.id}
			>
				{projects.map((project) => (
					<option value={project.id} key={project.id}>
						{project.name}
					</option>
				))}
			</select>
			<button onClick={() => setIsCreatingNewProject(true)}>New Project</button>
		</div>
	);
}
