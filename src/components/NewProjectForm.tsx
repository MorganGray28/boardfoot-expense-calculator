import React, { type Dispatch, type SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
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
				toast.success('Project Created', { duration: 2000 });
			}
			setNewProjectName('');
			setNewProjectDescription('');
			setIsCreatingNewProject(false);
			ctx.user.getProjectsById.invalidate();
		},
		onError: () => toast.error('Error, was unable to create Project'),
	});

	function handleCancelNewProject() {
		setIsCreatingNewProject(false);
		setNewProjectName('');
		setNewProjectDescription('');
	}

	async function handleSubmitNewProject(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (newProjectName) {
			await addNewProject({ name: newProjectName, description: newProjectDescription });
		} else {
			toast.error('Please fill out the Project Name', {
				id: 'emptyProjectName',
			});
		}
	}

	return (
		<div className={styles.flexContainer}>
			<form onSubmit={(e) => handleSubmitNewProject(e)}>
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
					<button className={styles.approveBtn} disabled={isCreating} type='submit'>
						Create
					</button>
				</div>
			</form>
		</div>
	);
}

export default NewProjectForm;
