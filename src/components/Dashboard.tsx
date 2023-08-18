import React, { useState, Dispatch, SetStateAction } from 'react';
import { ProjectType } from '../types/types';
import { ActiveProjectForm } from './ActiveProjectForm';
import ExpenseAndConsumableGroup from './ExpenseAndConsumableGroup';
import ExpenseTable from './ExpenseTable';
import ConsumableTable from './ConsumableTable';
import NewProjectForm from './NewProjectForm';
import ProjectCostSummary from './ProjectCostSummary';

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
			<div>
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

				<ExpenseAndConsumableGroup>
					<ExpenseTable
						activeProject={activeProject}
						setActiveProject={setActiveProject}
						setTotalExpenseAmount={setTotalExpenseAmount}
					/>
					<ConsumableTable setTotalConsumableAmount={setTotalConsumableAmount} />
				</ExpenseAndConsumableGroup>
				<ProjectCostSummary totalExpenses={totalExpenseAmount} totalConsumables={totalConsumableAmount} />
			</div>
		);
	} else if (isLoading) {
		return (
			<div>
				<p>Loading...</p>
			</div>
		);
	} else {
		return (
			// TODO: Change this to a more inviting initial create your first project input
			// TODO: Also, incorporate Project Description in creating new project
			<div>
				<NewProjectForm
					cancel={false}
					setActiveProject={setActiveProject}
					setIsCreatingNewProject={setIsCreatingNewProject}
				/>
			</div>
		);
	}
}
