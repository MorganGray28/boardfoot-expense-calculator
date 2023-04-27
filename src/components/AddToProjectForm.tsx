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

	return (
		<div className={styles.container}>
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
				<button className={styles.approveBtn}>Create New</button>
			</div>
		</div>
	);
}

export default AddToProjectForm;
