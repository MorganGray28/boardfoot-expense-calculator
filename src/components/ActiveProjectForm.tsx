import React, { useEffect, Dispatch, SetStateAction } from 'react';
import styles from '../styles/ActiveProjectForm.module.scss';
import { ProjectType } from './Dashboard';

interface PropsType {
	projects: ProjectType[];
	activeProject: string;
	updateActiveProject: Dispatch<SetStateAction<string>>;
}

// TODO: Style the Select arrow svg
// TODO: Style the Select dropdown list

export function ActiveProjectForm({ projects, activeProject, updateActiveProject }: PropsType) {
	useEffect(() => {
		if (projects && projects[0]) {
			console.log(projects);
			updateActiveProject(projects[0].name);
		}
	}, []);

	console.log(activeProject);

	return (
		<div className={styles.container}>
			<p className={styles.header}>Choose a Project</p>
			<select
				className={styles.selectInput}
				name='projectList'
				value={activeProject}
				onChange={(e) => updateActiveProject(e.target.value)}
			>
				{projects.map((p) => (
					<option value={p.name} key={p.id}>
						{p.name}
					</option>
				))}
			</select>
		</div>
	);
}
