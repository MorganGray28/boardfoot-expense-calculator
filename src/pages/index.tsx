import styles from '../styles/index.module.scss';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import BoardFootCalculator from '../components/BoardFootCalculator';
import Modal from '../components/Modal';
import AddToProjectForm from '../components/AddToProjectForm';
import Dashboard from '../components/Dashboard';
import { ProjectType } from '../types/types';
import { BoardFeetType } from '../types/types';
import { trpc } from '../utils/trpc';

// TODO: Create ExpenseTotals Component that displays material costs, consumable totals, and Project Expense Totals
// TODO: Add Modal that confirms you want to delete a project
// TODO: EDIT and DELETE functions for each Expense Item
// TODO: Add 4/4, 6/4, and 8/4 quick select options on our BF Calculator form under Thickness
// FIXME: Adding new project with lumber doesn't update the dashboard to the newly created project
// FIXME: Only conditionally show the expense and consumable table if there's an active project selected

const Home: NextPage = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const { data: session, status } = useSession();
	const [currentCalculatorValues, setCurrentCalculatorValues] = useState<BoardFeetType | null>(null);
	const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
	const { data: projectList, refetch: refetchProjects } = trpc.user.getProjectsById.useQuery(
		session?.user?.id!,
		{
			enabled: session?.user?.id !== undefined,
			onSuccess: (data) => {
				if (!data[0]) {
					setActiveProject(null);
				} else {
					setActiveProject(data[0] ?? null);
				}
			},
		}
	);

	function setNewActiveProject(project: ProjectType | null) {
		setActiveProject(project);
	}

	function handleSignIn() {
		signIn();
	}

	function handleSignOut() {
		signOut();
	}

	function handleClose() {
		setModalOpen(false);
	}

	function handleOpen(values: BoardFeetType) {
		setCurrentCalculatorValues(values);
		setModalOpen(true);
	}

	return (
		<>
			<Head>
				<title>Woodworking Expense Calculator</title>
				<meta name='description' content='Calculate woodworking expenses and lumber board feet' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className={styles.dashboard}>
				<div className={styles.calculatorContainer}>
					<BoardFootCalculator handleModal={handleOpen} />
				</div>
				<div className={styles.projectContainer}>
					<nav className={styles.navbar}>
						{session && (
							<p>
								Hello, <span className={styles.username}>{session.user?.name}</span>
							</p>
						)}
						<h1>Woodworking Expense Tracker</h1>
						{session ? (
							<button onClick={handleSignOut} className={styles.loginButton}>
								Sign Out
							</button>
						) : (
							<button onClick={handleSignIn} className={styles.loginButton}>
								Sign In
							</button>
						)}
					</nav>
					<main>
						<Modal open={modalOpen} onClose={handleClose}>
							<AddToProjectForm
								onClose={handleClose}
								values={currentCalculatorValues}
								updateActiveProject={setNewActiveProject}
							/>
						</Modal>
						{session && session.user ? (
							<Dashboard
								projects={projectList}
								activeProject={activeProject}
								updateActiveProject={setNewActiveProject}
							/>
						) : (
							<p>log in to save and track your expenses</p>
						)}
					</main>
				</div>
			</div>
		</>
	);
};

export default Home;
