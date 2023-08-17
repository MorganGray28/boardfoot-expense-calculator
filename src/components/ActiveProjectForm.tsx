import React, { useState, Dispatch, SetStateAction, useRef, RefObject, useEffect, MouseEvent } from 'react';
import styles from '../styles/ActiveProjectForm.module.scss';
import { ProjectType } from '../types/types';
import { trpc } from '../utils/trpc';

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
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [isEditingProject, setIsEditingProject] = useState(false);

	let dropdownRef = useRef() as RefObject<HTMLDivElement>;

	useEffect(() => {
		const handler = (e: Event): any => {
			if (dropdownRef.current) {
				if (!dropdownRef.current.contains(e.target as Element)) {
					setDropdownOpen(false);
				}
			}
		};

		document.addEventListener('mousedown', handler);

		return () => {
			document.removeEventListener('mousedown', handler);
		};
	}, [dropdownRef]);

	const ctx = trpc.useContext();
	const { mutateAsync: deleteProject, isLoading: isDeleting } = trpc.project.deleteProject.useMutation({
		onSuccess: () => {
			setActiveProject(null);
			ctx.user.getProjectsById.invalidate();
		},
	});

	function handleEditProject() {
		setIsEditingProject(true);
		setDropdownOpen(false);
	}

	function handleDeleteProject() {
		if (activeProject) {
			deleteProject(activeProject.id);
		}
		setDropdownOpen(false);
	}

	function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
		if (!e.target.value) {
			setActiveProject(null);
		}
		let newActiveProject = projects.filter((p) => p.id === e.target.value);
		if (newActiveProject && newActiveProject[0]) {
			setActiveProject(newActiveProject[0]);
		}
	}

	if (activeProject && isEditingProject) {
		return (
			<EditProjectNameForm
				projectName={activeProject.name}
				id={activeProject.id}
				setActiveProject={setActiveProject}
				setIsEditingProject={setIsEditingProject}
			/>
		);
	} else {
		return (
			<div className={styles.container}>
				<div className={styles.flexContainer}>
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

					<div className={styles.menuContainer} ref={dropdownRef}>
						<div className={styles.svgContainer} onClick={() => setDropdownOpen(!dropdownOpen)}>
							<svg
								className={styles.dropdownSVG}
								width='5'
								height='27'
								viewBox='0 0 5 27'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0C3.88071 0 5 1.11929 5 2.5Z'
									fill='#1B4276'
								/>
								<path
									d='M5 13.5C5 14.8807 3.88071 16 2.5 16C1.11929 16 0 14.8807 0 13.5C0 12.1193 1.11929 11 2.5 11C3.88071 11 5 12.1193 5 13.5Z'
									fill='#1B4276'
								/>
								<path
									d='M5 24.5C5 25.8807 3.88071 27 2.5 27C1.11929 27 0 25.8807 0 24.5C0 23.1193 1.11929 22 2.5 22C3.88071 22 5 23.1193 5 24.5Z'
									fill='#1B4276'
								/>
							</svg>
						</div>
						<div
							className={styles.dropdownContainer + ' ' + (dropdownOpen ? styles.active : styles.inactive)}
						>
							<button className={styles.dropdownButton} onClick={() => setIsCreatingNewProject(true)}>
								New Project
							</button>
							<button className={styles.dropdownButton} onClick={handleEditProject}>
								Edit Project
							</button>
							<button className={styles.dropdownButton} onClick={handleDeleteProject} disabled={isDeleting}>
								Delete Project
							</button>
						</div>
					</div>
				</div>
				{/* <p></p> */}
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
