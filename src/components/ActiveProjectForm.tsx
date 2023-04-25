import React, { useEffect, Dispatch, SetStateAction, ChangeEvent } from 'react';
import styles from '../styles/ActiveProjectForm.module.scss';
import { ProjectType } from '../types/types';

// FIXME: activeProject has bugs showing the right value in select input vs the activeProject
// FIXME: Redesign Data flow and shape for activeProject
// TODO: Style the Select arrow svg
// TODO: Style the Select dropdown list

interface PropsType {
	projects: ProjectType[];
	activeProject: ProjectType | null;
	updateActiveProject: (project: ProjectType | null) => void;
}

export function ActiveProjectForm({ projects, activeProject, updateActiveProject }: PropsType) {
	// console.log(projects);

	function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
		if (!e.target.value) {
			updateActiveProject(null);
		}
		// console.log(e.target.value);
		let newActiveProject = projects.filter((p) => p.id === e.target.value);
		if (newActiveProject && newActiveProject[0]) {
			updateActiveProject(newActiveProject[0]);
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
				<option value={''}></option>
				{projects.map((project) => (
					<option value={project.id} key={project.id}>
						{project.name}
					</option>
				))}
			</select>
		</div>
	);
}
