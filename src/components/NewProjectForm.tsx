import React, { type Dispatch, type SetStateAction, useState } from 'react';
import { trpc } from '../utils/trpc';
import type { ProjectType } from '../types/types';
import styles from '../styles/NewProjectForm.module.scss';

type PropsType = {
	cancel: boolean;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
	setIsCreatingNewProject: Dispatch<SetStateAction<boolean>>;
};

function NewProjectForm({ cancel, setActiveProject, setIsCreatingNewProject }: PropsType) {
	const [newProjectName, setNewProjectName] = useState('');
	const [newProjectDescription, setNewProjectDescription] = useState('');

	const ctx = trpc.useContext();
	const { mutateAsync: addNewProject, isLoading: isCreating } = trpc.project.createProject.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data);
			}
			setNewProjectName('');
			setNewProjectDescription('');
			setIsCreatingNewProject(false);
			ctx.user.getProjectsById.invalidate();
		},
	});

	function handleCancelNewProject() {
		setIsCreatingNewProject(false);
		setNewProjectName('');
		setNewProjectDescription('');
	}

	// FIXME: revise the alert to something better when no name is entered
	async function handleSubmitNewProject() {
		if (newProjectName) {
			await addNewProject({ name: newProjectName, description: newProjectDescription });
		} else {
			alert('Please fill out the Project Name input');
		}
	}

	return (
		<>
			<label className={styles.textfieldLabel} htmlFor='newProjectName'>
				Project Name
			</label>
			<input
				className={`${styles.searchInput} ${styles.nameInput}`}
				id='newProjectName'
				autoComplete='off'
				type='text'
				placeholder='enter project name'
				value={newProjectName}
				onChange={(e) => setNewProjectName(e.target.value)}
			/>
			<label htmlFor='newProjectDescription' className={styles.textfieldLabel}>
				Project Description (optional)
			</label>
			<textarea
				id='newProjectDescription'
				name='projectDescription'
				value={newProjectDescription}
				onChange={(e) => setNewProjectDescription(e.target.value)}
				className={`${styles.searchInput} ${styles.descriptionInput}`}
			/>
			<div className={styles.formButtonGroup}>
				{cancel && (
					<button className={styles.dangerBtn} type='button' onClick={handleCancelNewProject}>
						Cancel
					</button>
				)}
				<button
					className={styles.approveBtn}
					disabled={isCreating}
					onClick={() => handleSubmitNewProject()}
					type='submit'
				>
					Create Project
				</button>
			</div>
		</>
	);
}

export default NewProjectForm;
