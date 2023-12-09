import React, { type Dispatch, type SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import { trpc } from '../utils/trpc';
import type { ProjectType } from '../types/types';
import styles from '../styles/NewProjectForm.module.scss';
import Button from './ui/Buttons/Button';

type PropsType = {
	cancel: boolean;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
	setIsCreatingNewProject: Dispatch<SetStateAction<boolean>>;
};

function NewProjectForm({ cancel, setActiveProject, setIsCreatingNewProject }: PropsType) {
	const [newProjectName, setNewProjectName] = useState('');
	const [newProjectDescription, setNewProjectDescription] = useState('');
	const [projectNameError, setProjectNameError] = useState(false);

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
		setProjectNameError(false);
	}

	async function handleSubmitNewProject(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (newProjectName) {
			await addNewProject({ name: newProjectName, description: newProjectDescription });
		} else {
			setProjectNameError(true);
			toast.error('Please fill out the Project Name', {
				id: 'emptyProjectName',
			});
		}
	}

	return (
		<div className={styles.flexContainer}>
			<form className={styles.newProjectForm} onSubmit={(e) => handleSubmitNewProject(e)}>
				<div className={projectNameError ? `${styles.textfieldError}` : ''}>
					<div className={styles.inputLabelFlexGroup}>
						<label className={styles.textfieldLabel} htmlFor='newProjectName'>
							Project Name
						</label>
						{projectNameError && <p className={styles.errorMessage}>*Required</p>}
					</div>
					<input
						className={`${styles.searchInput} ${styles.nameInput}`}
						id='newProjectName'
						autoComplete='off'
						type='text'
						placeholder='enter project name'
						value={newProjectName}
						onChange={(e) => {
							setNewProjectName(e.target.value);
							setProjectNameError(false);
						}}
					/>
				</div>
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
						<Button variant='outlined' color='danger' type='button' onClick={handleCancelNewProject}>
							Cancel
						</Button>
					)}
					<Button isLoading={isCreating} type='submit' loadingText='Creating...'>
						Create
					</Button>
				</div>
			</form>
		</div>
	);
}

export default NewProjectForm;
