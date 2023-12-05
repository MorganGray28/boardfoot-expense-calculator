import { useSession } from 'next-auth/react';
import React, { type Dispatch, type SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import styles from '../styles/addToProjectForm.module.scss';
import type { BoardFeetType, ProjectType } from '../types/types';
import { trpc } from '../utils/trpc';
import ProjectFormListItem from './ProjectFormListItem';
import { calculateBoardFeet, calculateCostFromBF } from '../utils/calculationsUtils';

type PropsType = {
	values: BoardFeetType | null;
	onClose: () => void;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
};

function AddToProjectForm({ values, onClose, setActiveProject }: PropsType) {
	const [search, setSearch] = useState('');
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');
	const [newProjectDescription, setNewProjectDescription] = useState('');
	const [projectNameError, setProjectNameError] = useState(false);
	const { data: session } = useSession();
	let projectList: ProjectType[] | undefined;
	if (session?.user?.id) {
		projectList = trpc.user.getProjectsById.useQuery(session?.user?.id, {
			enabled: session?.user !== undefined,
		}).data;
	}
	const ctx = trpc.useContext();

	const addLumber = trpc.lumber.addDimensionLumber.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data.project);
				toast.success('Lumber added to Project');
			}
			ctx.user.getProjectsById.invalidate();
		},
		onSettled: () => onClose(),
		onError: (err) => toast.error('Error: unable to add lumber to project'),
	});

	const addNewProjectWithLumber = trpc.project.createProjectWithLumber.useMutation({
		onSuccess: (data) => {
			if (data) {
				setActiveProject(data);
			}
			ctx.user.getProjectsById.invalidate();
			toast.success('Project created!');
		},
		onSettled: () => onClose(),
		onError: (err) => toast.error('Error: Please resubmit'),
	});

	function handleClick(id: string, values: BoardFeetType | null) {
		if (values) {
			addLumber.mutate({ ...values, projectId: id });
		}
	}

	async function handleCreateNewProjectWithLumber(values: BoardFeetType | null) {
		if (values && newProjectName) {
			await addNewProjectWithLumber.mutateAsync({
				name: newProjectName,
				description: newProjectDescription,
				values,
			});
		} else {
			setProjectNameError(true);
			// toast.error("Please make sure Project Name and lumber values aren't empty or invalid");
		}
	}

	function handleCancelNewProject() {
		setNewProjectName('');
		setNewProjectDescription('');
		setIsCreatingNew(false);
	}

	let projectsWithCost;
	if (projectList) {
		// mapping over our projectList to calculate and sum up each project's cost for lumber and expenses
		projectsWithCost = projectList.map((project) => {
			const projectFormatted = { ...project, cost: 0 };
			projectFormatted.lumber.forEach((l) => {
				const bf = calculateBoardFeet({
					numOfPieces: l.numOfPieces,
					thickness: l.thickness,
					width: l.width,
					length: l.length,
				});
				projectFormatted.cost += calculateCostFromBF({ boardFeet: bf, price: l.price, tax: l.tax });
			});
			projectFormatted.expenses.forEach((e) => {
				projectFormatted.cost += e.cost * e.amount;
			});
			return projectFormatted;
		});
	}

	let filteredProjectListItems;
	if (projectsWithCost !== undefined) {
		filteredProjectListItems = projectsWithCost
			.filter((project) => {
				if (search) {
					return project.name.toLowerCase().includes(search.toLowerCase());
				} else {
					return project;
				}
			})
			.map((project, index) => {
				// add an array of all the unique species of lumber to be shown
				const species: string[] = [];
				project.lumber.forEach((l) => {
					if (!species.includes(l.species.toLowerCase())) {
						species.push(l.species.toLowerCase());
					}
				});
				return (
					<ProjectFormListItem
						values={values}
						handleClick={handleClick}
						id={project.id}
						key={index}
						name={project.name}
						species={species}
						cost={project.cost}
					/>
				);
			});
	}

	let formContent;

	if (!isCreatingNew && projectList && projectList.length) {
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
				<div className={projectNameError ? `${styles.textfieldError}` : ''}>
					<label htmlFor='newProjectName' className={styles.textfieldLabel}>
						Name
					</label>
					<input
						id='newProjectName'
						name='newProjectName'
						value={newProjectName}
						onChange={(e) => {
							setNewProjectName(e.target.value);
							setProjectNameError(false);
						}}
						className={`${styles.searchInput} ${styles.nameInput}`}
						type='text'
					/>
				</div>
				<label htmlFor='newProjectDescription' className={styles.textfieldLabel}>
					Description (optional)
				</label>
				<textarea
					id='newProjectDescription'
					name='newProjectDescription'
					value={newProjectDescription}
					onChange={(e) => setNewProjectDescription(e.target.value)}
					className={`${styles.searchInput} ${styles.descriptionInput}`}
				/>

				<div className={styles.buttonGroup}>
					<button className={styles.dangerBtn} onClick={() => handleCancelNewProject()}>
						Cancel
					</button>
					<button className={styles.approveBtn} onClick={() => handleCreateNewProjectWithLumber(values)}>
						Done
					</button>
				</div>
			</>
		);
	}

	return <div className={styles.container}>{formContent}</div>;
}

export default AddToProjectForm;
