import styles from '../styles/index.module.css';
import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { trpc } from '../utils/trpc';
import BoardFootCalculator from '../components/BoardFootCalculator';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Woodworking Expense Calculator</title>
				<link rel="preconnect" href="https://fonts.googleapis.com"/>
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true'/>
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
				<meta
					name='description'
					content='Calculate woodworking expenses and lumber board feet'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<div className={styles.calculatorContainer}>
					<BoardFootCalculator />
				</div>
			</main>
		</>
	);
};

export default Home;
