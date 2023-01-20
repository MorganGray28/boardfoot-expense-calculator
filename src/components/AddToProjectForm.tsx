import { useSession } from 'next-auth/react';
import React from 'react';
import styles from '../styles/addToProjectForm.module.scss';
import { BoardFeetType } from '../types/types';
import { trpc } from '../utils/trpc';

function AddToProjectForm(values: BoardFeetType) {
	const { data: session, status } = useSession();
	console.log(values);

	return (
		<div className={styles.container}>
			<p>This will be a form to add lumber to specific projects</p>
			<p>If we don't have any retrieved projects from our user, we'll have a create button</p>
		</div>
	);
}

export default AddToProjectForm;
