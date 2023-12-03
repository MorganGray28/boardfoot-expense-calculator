import styles from '../styles/index.module.scss';
import { type NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import BoardFootCalculator from '../components/BoardFootCalculator';
import Modal from '../components/Modal';
import AddToProjectForm from '../components/AddToProjectForm';
import Dashboard from '../components/Dashboard';
import type { ProjectType, BoardFeetType } from '../types/types';
import { trpc } from '../utils/trpc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import hamburgerIcon from '../../public/hamburger-icon.svg';

// FIXME: add calculator icon to top left for mobile
// TODO: reduce the width of expense/consumable container on phone mobile
// TODO: increase mobile edit and delete icons for expense/consumable items
// TODO: add dropdown menu for avator mobile icon to sign Out
// FIXME: convert alert messages to Toast messages for better error awareness
// TODO: design more easily legible active tab styling for expenses and consumables
// TODO: Make total expense component to show cost breakdown

// FIXME: number inputs won't allow a value of ".0X"
// TODO: Make Edit and Delete Icon Buttons more reusable and DRY
// TODO: Style ActiveProjectForm's ADD, EDIT, and DELETE dropdown buttons
// TODO: Style Expense and Consumable List Items alternating backgrounds
// TODO: Adjust Flex container size for sensible space usage in Add Expense Form
// FIXME: Mobile Responsive: move sign out to expandable sidebar and change calculator to hamburger menu
// FIXME: Make BF Calc add to project disabled when all the necessary fields aren't completed
// FIXME: Make edit Expense and Consumable disabled when all the necessary fields aren't completed
// FIXME: make generic expense list items share style module from lumber expense item styles so we can correctly display odd/even background colors for each item instead of breaking it up for each type of expense

const Home: NextPage = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const { data: session } = useSession();
	const [currentCalculatorValues, setCurrentCalculatorValues] = useState<BoardFeetType | null>(null);
	const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

	const { data: projectList, isLoading } = trpc.user.getProjectsById.useQuery(session?.user?.id as string, {
		enabled: session?.user?.id !== undefined,
		onSuccess: (data) => {
			setActiveProject(activeProject ?? data[0] ?? null);
		},
	});

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
				<BoardFootCalculator handleModal={handleOpen} />
				<div className={styles.projectContainer}>
					<nav className={styles.navbar}>
						<Image
							className={styles.hamburgerIcon}
							src={hamburgerIcon}
							width={22}
							height={22}
							alt='menu icon'
							priority
						/>
						<h1>Woodworking Expense Tracker</h1>
						{session ? (
							<>
								<button onClick={handleSignOut} className={styles.loginButton}>
									Sign Out
								</button>
								<FontAwesomeIcon className={styles.avatarIcon} icon={faUser} />
							</>
						) : (
							<>
								<button onClick={handleSignIn} className={styles.loginButton}>
									Sign In
								</button>
								<FontAwesomeIcon className={styles.avatarIcon} icon={faUser} />
							</>
						)}
					</nav>
					<main>
						<Modal open={modalOpen} onClose={handleClose}>
							<AddToProjectForm
								onClose={handleClose}
								values={currentCalculatorValues}
								setActiveProject={setActiveProject}
							/>
						</Modal>
						{session && session.user ? (
							<Dashboard
								isLoading={isLoading}
								projects={projectList}
								activeProject={activeProject}
								setActiveProject={setActiveProject}
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
