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
				<meta
					name='description'
					content='Calculate woodworking expenses and lumber board feet'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<h1>Home Page</h1>
				<BoardFootCalculator />
				<Link href='/about'>About Page</Link>
			</main>
		</>
	);
};

export default Home;
