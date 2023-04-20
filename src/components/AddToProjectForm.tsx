import { useSession } from 'next-auth/react';
import React from 'react';
import styles from '../styles/addToProjectForm.module.scss';
import { BoardFeetType } from '../types/types';
import { trpc } from '../utils/trpc';
import ProjectFormListItem from './ProjectFormListItem';

type PropsType = {
	values: BoardFeetType | null;
	onClose: () => void;
};

function AddToProjectForm({ values, onClose }: PropsType) {
	const { data: session, status } = useSession();
	console.log(values);

	return (
		<div className={styles.container}>
			<h4 className={styles.header}>Add Lumber to a Project</h4>
			<input className={styles.searchInput} type='text' placeholder='Search Projects' />
			<ul className={styles.projectList}>
				<ProjectFormListItem name='Mid Century Modern Coffee Table' species='Walnut' cost={275} />
				<ProjectFormListItem name='Outdoor Slat Bench' species='White Oak' cost={400} />
				<ProjectFormListItem name='Rustic Cutting Board' species='Olivewood' cost={90} />
				<ProjectFormListItem name='Walnut Burl Coffee Table' species='Walnut Burl Slab' cost={275} />
				<ProjectFormListItem name='Modern Picture Frame' species='Walnut' cost={75} />
				<ProjectFormListItem name='Book Shelf' species='Walnut' cost={400} />
				<ProjectFormListItem name='End Grain Cutting Board' species='Walnut' cost={95} />
			</ul>

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
