import styles from '../styles/index.module.scss';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { trpc } from '../utils/trpc';
import BoardFootCalculator from '../components/BoardFootCalculator';

const Home: NextPage = () => {
	const { data: session, status } = useSession();
	console.log(session);
	console.log(status);

	function handleSignIn() {
		signIn();
	}

	function handleSignOut() {
		signOut();
	}

	return (
		<>
			{/* 
				//FIXME: Research proper way to import google fonts into header 
				// TODO: Add Sign in functionality with next auth
				// TODO: Create Landing Page Component for unregistered/logged out users 
				// TODO: Create Project Expense Component to list all expenses for current Project
				// TODO: Create Consumables Component to list all consumables 
				// TODO: Create current project select input to view all expenses
				// TODO: Design layout for adding general expenses to project expenses
				// TODO: Design layout for adding consumables 
			*/}
			<Head>
				<title>Woodworking Expense Calculator</title>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
				<link
					href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Quicksand:wght@500&display=swap'
					rel='stylesheet'
				/>
				<meta name='description' content='Calculate woodworking expenses and lumber board feet' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className={styles.dashboard}>
				<div className={styles.calculatorContainer}>
					<BoardFootCalculator />
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
						<h4>Project content goes here</h4>
					</main>
				</div>
			</div>
		</>
	);
};

export default Home;
