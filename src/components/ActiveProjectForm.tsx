import React, { Dispatch, SetStateAction } from 'react';
import styles from '../styles/ActiveProjectForm.module.scss';
import { ProjectType } from './Dashboard';

interface PropsType {
	projects: ProjectType[];
	activeProject: string;
	updateActiveProject: Dispatch<SetStateAction<string>>;
}

export function ActiveProjectForm({ projects, activeProject, updateActiveProject }: PropsType) {
	return (
		<div className={styles.container}>
			<p className={styles.header}>Choose a Project</p>
			<select name='projectList' value={activeProject} onChange={(e) => updateActiveProject(e.target.value)}>
				{projects.map((p) => (
					<option value={p.name} key={p.id}>
						{p.name}
					</option>
				))}
			</select>
		</div>
	);
}
