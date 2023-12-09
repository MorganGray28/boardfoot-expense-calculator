import styles from '../styles/index.module.scss';
import { type NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useRef, useEffect, type RefObject } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import BoardFootCalculator from '../components/BoardFootCalculator';
import Modal from '../components/Modal';
import AddToProjectForm from '../components/AddToProjectForm';
import Dashboard from '../components/Dashboard';
import type { ProjectType, BoardFeetType } from '../types/types';
import { trpc } from '../utils/trpc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

// TODO: Design pojectcostsummary component
// TODO: Design logged out main about page in Figma
// TODO: implement logged out main page
// TODO: better initial page loading UI
// FIXME: number inputs won't allow a value of ".0X"
// TODO: Make Edit and Delete Icon Buttons more reusable and DRY

const Home: NextPage = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [profileMenuOpen, setProfileMenuOpen] = useState(false);
	const { data: session } = useSession();
	const [currentCalculatorValues, setCurrentCalculatorValues] = useState<BoardFeetType | null>(null);
	const [activeProject, setActiveProject] = useState<ProjectType | null>(null);

	const { data: projectList, isLoading } = trpc.user.getProjectsById.useQuery(session?.user?.id as string, {
		enabled: session?.user?.id !== undefined,
		onSuccess: (data) => {
			setActiveProject(activeProject ?? data[0] ?? null);
		},
		onError: () => toast.error('Error, something went wrong'),
	});

	const profileDropdownRef = useRef() as RefObject<HTMLDivElement>;

	useEffect(() => {
		const handler = (e: Event) => {
			if (profileDropdownRef.current) {
				if (!profileDropdownRef.current.contains(e.target as Element)) {
					setProfileMenuOpen(false);
				}
			}
		};

		document.addEventListener('mousedown', handler);

		return () => {
			document.removeEventListener('mousedown', handler);
		};
	}, [profileDropdownRef]);

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

	function handleProfileMenu() {
		if (profileMenuOpen) {
			setProfileMenuOpen(false);
		} else {
			setProfileMenuOpen(true);
		}
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
						<h1>Woodworking Expense Tracker</h1>
						{session ? (
							<>
								<button onClick={handleSignOut} className={styles.loginButton}>
									Sign Out
								</button>
								<div className={styles.profileMenuContainer} ref={profileDropdownRef}>
									<FontAwesomeIcon onClick={handleProfileMenu} className={styles.avatarIcon} icon={faUser} />
									<div
										className={
											profileMenuOpen
												? `${styles.profileMenuOpen} ${styles.profileDropdownMenu}`
												: `${styles.profileDropdownMenu}`
										}
									>
										<p onClick={handleSignOut}>Sign Out</p>
									</div>
								</div>
							</>
						) : (
							<>
								<button onClick={handleSignIn} className={styles.loginButton}>
									Sign In
								</button>
								<div className={styles.profileMenuContainer} ref={profileDropdownRef}>
									<FontAwesomeIcon onClick={handleProfileMenu} className={styles.avatarIcon} icon={faUser} />
									<div
										className={
											profileMenuOpen
												? `${styles.profileMenuOpen} ${styles.profileDropdownMenu}`
												: `${styles.profileDropdownMenu}`
										}
									>
										<p onClick={handleSignIn}>Sign In</p>
									</div>
								</div>
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
