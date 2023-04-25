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

const Home: NextPage = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const { data: session, status } = useSession();
	const [currentCalculatorValues, setCurrentCalculatorValues] = useState<BoardFeetType | null>(null);
	const [activeProject, setActiveProject] = useState<ProjectType | null>(null);
	const { data: projectList, refetch: refetchProjects } = trpc.user.getProjectsById.useQuery(
		session?.user?.id!,
		{
			enabled: session?.user !== undefined,
			onSuccess(data) {
				setActiveProject(activeProject ?? data[0] ?? null);
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
								refetchProjects={refetchProjects}
							/>
						</Modal>
						{session && session.user ? (
							<Dashboard activeProject={activeProject} updateActiveProject={setNewActiveProject} />
						) : (
							<p>log in to save and track your expenses</p>
						)}
					</main>
				</div>
			</div>
		</>
	);
};

{
	/* 
				// TODO: Create Landing Page Component for unregistered/logged out users 
				// TODO: Design layout for adding general expenses to project expenses
				// TODO: Design layout for adding consumables 
				// TODO: Add Dummy data for multiple projects in our database
					// TODO: Connect our Active Project to our data 
				// TODO: Look into using Context for Active Project and current Board Feet calculator values
			
			*/
}

export default Home;
