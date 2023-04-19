import { useSession } from 'next-auth/react';
import React from 'react';
import styles from '../styles/addToProjectForm.module.scss';
import { BoardFeetType } from '../types/types';
import { trpc } from '../utils/trpc';

type PropsType = {
	values: BoardFeetType | null;
};

function AddToProjectForm(values: PropsType) {
	const { data: session, status } = useSession();
	console.log(values);

	return (
		<div className={styles.container}>
			<h4 className={styles.header}>Add Lumber to a Project</h4>
			<input type='text' placeholder='Search Projects' />
			<ul className={styles.projectList}>
				<li className={styles.projectListItem}>
					<p className={styles.projectName}>Mid Century Modern Coffee Table</p>
					<p className={styles.projectSpecies}>Walnut</p>
					<p className={styles.projectCost}>$275</p>
				</li>
				<li className={styles.projectListItem}>
					<p className={styles.projectName}>Outdoor Slat Bench</p>
					<p className={styles.projectSpecies}>White Oak</p>
					<p className={styles.projectCost}>$400</p>
				</li>
				<li className={styles.projectListItem}>
					<p className={styles.projectName}>Walnut Burl Coffee Table</p>
					<p className={styles.projectSpecies}>Walnut Burl Slab, Walnut, Steel</p>
					<p className={styles.projectCost}>$750</p>
				</li>
				<li className={styles.projectListItem}>
					<p className={styles.projectName}>Rustic Cutting Board</p>
					<p className={styles.projectSpecies}>Olivewood</p>
					<p className={styles.projectCost}>$90</p>
				</li>
				<li className={styles.projectListItem}>
					<p className={styles.projectName}>Modern Picture Frame</p>
					<p className={styles.projectSpecies}>Walnut</p>
					<p className={styles.projectCost}>$85</p>
				</li>
				<li className={styles.projectListItem}>
					<p className={styles.projectName}>Outdoor Slat Bench</p>
					<p className={styles.projectSpecies}>White Oak</p>
					<p className={styles.projectCost}>$400</p>
				</li>
				<li className={styles.projectListItem}>
					<p className={styles.projectName}>Walnut Burl Coffee Table</p>
					<p className={styles.projectSpecies}>Walnut Burl Slab, Walnut, Steel</p>
					<p className={styles.projectCost}>$750</p>
				</li>
			</ul>

			<div className={styles.buttonGroup}>
				<button className={styles.dangerBtn}>Cancel</button>
				<button className={styles.approveBtn}>Create New</button>
			</div>
		</div>
	);
}

export default AddToProjectForm;
