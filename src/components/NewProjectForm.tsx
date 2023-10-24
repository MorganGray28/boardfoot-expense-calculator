import React, { type Dispatch, type SetStateAction, useState } from 'react';
import { trpc } from '../utils/trpc';
import type { ProjectType } from '../types/types';

type PropsType = {
	cancel: boolean;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
	setIsCreatingNewProject: Dispatch<SetStateAction<boolean>>;
};

function NewProjectForm({ cancel, setActiveProject, setIsCreatingNewProject }: PropsType) {
	const [newProjectName, setNewProjectName] = useState('');

	const ctx = trpc.useContext();
	const { mutateAsync: addNewProject, isLoading: isCreating } = trpc.project.createProject.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data);
			}
			setNewProjectName('');
			setIsCreatingNewProject(false);
			ctx.user.getProjectsById.invalidate();
		},
	});

	function handleCancelNewProject() {
		setIsCreatingNewProject(false);
		setNewProjectName('');
	}

	async function handleSubmitNewProject() {
		if (newProjectName) {
			await addNewProject(newProjectName);
		} else {
			alert('Please fill out the Project Name input');
		}
	}

	return (
		<>
			<label htmlFor='newProject'>New Project Name</label>
			<input
				id='newProject'
				autoComplete='off'
				type='text'
				placeholder='enter project name'
				value={newProjectName}
				onChange={(e) => setNewProjectName(e.target.value)}
			/>
			{cancel && <button onClick={() => handleCancelNewProject()}>Cancel</button>}
			<button disabled={isCreating} onClick={() => handleSubmitNewProject()}>
				Create Project
			</button>
		</>
	);
}

export default NewProjectForm;
