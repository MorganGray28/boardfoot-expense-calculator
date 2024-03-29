import React, { useState, type Dispatch, type SetStateAction } from 'react';
import type { ProjectType } from '../types/types';
import { ActiveProjectForm } from './ActiveProjectForm';
import ExpenseAndConsumableGroup from './ExpenseAndConsumableGroup';
import NewProjectForm from './NewProjectForm';
import LoadingSpinner from './ui/LoadingSpinner/LoadingSpinner';
import styles from '../styles/Dashboard.module.scss';

type PropsType = {
	projects: ProjectType[] | undefined;
	activeProject: ProjectType | null;
	isLoading: boolean;
	setActiveProject: Dispatch<SetStateAction<ProjectType | null>>;
};

export default function Dashboard({ projects, activeProject, setActiveProject, isLoading }: PropsType) {
	const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
	const [totalExpenseAmount, setTotalExpenseAmount] = useState(0);
	const [totalConsumableAmount, setTotalConsumableAmount] = useState(0);

	if (projects?.length) {
		return (
			<div style={{ minHeight: '100vh' }}>
				{isCreatingNewProject ? (
					<NewProjectForm
						cancel={true}
						setActiveProject={setActiveProject}
						setIsCreatingNewProject={setIsCreatingNewProject}
					/>
				) : (
					<ActiveProjectForm
						projects={projects}
						activeProject={activeProject}
						setActiveProject={setActiveProject}
						setIsCreatingNewProject={setIsCreatingNewProject}
					/>
				)}

				<ExpenseAndConsumableGroup
					activeProject={activeProject}
					setActiveProject={setActiveProject}
					totalExpenses={totalExpenseAmount}
					totalConsumables={totalConsumableAmount}
					setTotalExpenseAmount={setTotalExpenseAmount}
					setTotalConsumableAmount={setTotalConsumableAmount}
				/>
			</div>
		);
	} else if (isLoading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<LoadingSpinner type='standalone' />
			</div>
		);
	} else {
		return (
			<div style={{ paddingTop: '4rem' }}>
				<p className={styles.newProjectMessage}>Create a New Project</p>
				<NewProjectForm
					cancel={false}
					setActiveProject={setActiveProject}
					setIsCreatingNewProject={setIsCreatingNewProject}
				/>
			</div>
		);
	}
}
