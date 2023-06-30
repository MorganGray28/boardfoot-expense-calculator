import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import styles from '../styles/addToProjectForm.module.scss';
import { BoardFeetType, ProjectType } from '../types/types';
import { trpc } from '../utils/trpc';
import ProjectFormListItem from './ProjectFormListItem';

type PropsType = {
	values: BoardFeetType | null;
	onClose: () => void;
	updateActiveProject: (project: ProjectType | null) => void;
};

function AddToProjectForm({ values, onClose, updateActiveProject }: PropsType) {
	const [search, setSearch] = useState('');
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');
	const [newProjectDescription, setNewProjectDescription] = useState('');
	const { data: session, status } = useSession();
	const projectList: ProjectType[] | undefined = trpc.user.getProjectsById.useQuery(session?.user?.id!, {
		enabled: session?.user !== undefined,
	}).data;
	const ctx = trpc.useContext();

	const addLumber = trpc.lumber.addDimensionLumber.useMutation({
		onSuccess: () => {
			ctx.user.getProjectsById.invalidate();
		},
		onSettled: () => onClose(),
	});

	const addNewProjectWithLumber = trpc.project.createProjectWithLumber.useMutation({
		onSettled: () => {
			ctx.user.getProjectsById.invalidate();
			onClose();
		},
	});

	function handleClick(id: string, values: BoardFeetType | null) {
		if (values) {
			addLumber.mutate({ ...values, projectId: id });
			if (projectList) {
				let newActive = projectList.filter((p) => p.id === id)[0];
				if (newActive) {
					updateActiveProject(newActive);
				}
			}
		}
	}

	async function handleCreateNewProjectWithLumber(input: {
		name: string;
		description: string;
		values: BoardFeetType | null;
	}) {
		if (values) {
			let newProject = await addNewProjectWithLumber.mutateAsync({
				name: newProjectName,
				description: newProjectDescription,
				values,
			});

			// Assign the newly created Project as our new Active Project using it's ID returned from our mutation

			// if (projectList && newProject) {
			// 	let newActive = projectList.filter((p) => p.id === newProject.id)[0];
			// 	if (newActive) {
			// 		console.log(newActive);
			// 		console.log(projectList);
			// 		updateActiveProject(newActive);
			// 	}
			// }
		}
	}

	function handleCancelNewProject() {
		setNewProjectName('');
		setNewProjectDescription('');
		setIsCreatingNew(false);
	}

	let filteredProjectListItems;
	if (projectList !== undefined) {
		filteredProjectListItems = projectList
			.filter((project) => {
				if (search) {
					return project.name.toLowerCase().includes(search.toLowerCase());
				} else {
					return project;
				}
			})
			.map((project, index) => {
				return (
					<ProjectFormListItem
						values={values}
						handleClick={handleClick}
						id={project.id}
						key={index}
						name={project.name}
						species={project.species}
						cost={project.cost}
					/>
				);
			});
	}

	let formContent;

	if (!isCreatingNew) {
		formContent = (
			<>
				<h4 className={styles.header}>Add Lumber to a Project</h4>
				<input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className={styles.searchInput}
					type='text'
					placeholder='Search Projects'
				/>
				<ul className={styles.projectList}>{filteredProjectListItems}</ul>
				<div className={styles.buttonGroup}>
					<button onClick={onClose} className={styles.dangerBtn}>
						Cancel
					</button>
					<button className={styles.approveBtn} onClick={() => setIsCreatingNew(true)}>
						Create New
					</button>
				</div>
			</>
		);
	} else {
		formContent = (
			<>
				<h4 className={styles.header}>Create a New Project</h4>
				<label htmlFor='newProjectName'>Name</label>
				<input
					id='newProjectName'
					name='newProjectName'
					value={newProjectName}
					onChange={(e) => setNewProjectName(e.target.value)}
					className={`${styles.searchInput} ${styles.nameInput}`}
					type='text'
				/>
				<label htmlFor='newProjectDescription'>Description (optional)</label>
				<textarea
					id='newProjectDescription'
					name='newProjectDescription'
					value={newProjectDescription}
					onChange={(e) => setNewProjectDescription(e.target.value)}
					className={`${styles.searchInput} ${styles.descriptionInput}`}
				></textarea>

				<div className={styles.buttonGroup}>
					<button className={styles.dangerBtn} onClick={() => handleCancelNewProject()}>
						Cancel
					</button>
					<button
						className={styles.approveBtn}
						onClick={() =>
							handleCreateNewProjectWithLumber({
								name: newProjectName,
								description: newProjectDescription,
								values,
							})
						}
					>
						Done
					</button>
				</div>
			</>
		);
	}

	return <div className={styles.container}>{formContent}</div>;
}

export default AddToProjectForm;
