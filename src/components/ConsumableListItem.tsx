import React from 'react';
import styles from '../styles/ConsumableListItem.module.scss';
import { ProjectType } from '../types/types';
import { trpc } from '../utils/trpc';

interface PropTypes {
	name: string;
	cost: number;
	id: string;
	checked: boolean;
	activeProject: ProjectType | null;
}

export default function ConsumableListItem({ name, cost, id, checked, activeProject }: PropTypes) {
	const ctx = trpc.useContext();
	const toggleConsumableInProject = trpc.consumable.toggleConsumableInActiveProject.useMutation({
		onSettled: () => {
			ctx.consumable.getAllConsumables.invalidate();
		},
	});
	// let checked;
	// if (activeProject?.consumables.filter((c) => c.id === id).length) {
	// 	checked = true;
	// } else {
	// 	checked = false;
	// }

	function handleCheck() {
		if (id && activeProject && activeProject.id) {
			toggleConsumableInProject.mutateAsync({ consumableId: id, projectId: activeProject.id });
		}
	}

	return (
		<div className={styles.container}>
			<input className={styles.checkbox} type='checkbox' checked={checked} onChange={handleCheck} />
			<h2 className={styles.name}>{name}</h2>
			<p className={styles.cost}>${cost}</p>
		</div>
	);
}
