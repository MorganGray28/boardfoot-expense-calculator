import React from 'react';
import Image from 'next/image';
import styles from '../styles/LandingPage.module.scss';
import bfCalculatorIcon from '../../public/bf-calculator-icon.svg';

type PropsType = {
	signIn: () => void;
};

function LandingPage({ signIn }: PropsType) {
	return (
		<div className={styles.container}>
			<div className={`${styles.section} ${styles.sectionOne}`}>
				<div className={styles.blurbBlock}>
					<h2 className={styles.header}>
						Easily track project expenses, even the <span className={styles.magicFont}>little things</span>
					</h2>
					<p className={styles.subheader}>
						Are you letting unnoticed expenses go unaccounted for when you send out the bill?
					</p>
					<button onClick={signIn} className={styles.signInButton}>
						Sign In
					</button>
				</div>

				{/* FIXME: Replace this screenshot image with live component showing interactive list */}
				<Image
					className={styles.screenshotImage}
					src={'/expense-tracking.jpg'}
					alt='screenshot showing woodworking expenses'
					width={1065}
					height={590}
				/>
			</div>

			<div className={`${styles.section} ${styles.sectionTwo}`}>
				<Image
					className={styles.calculatorIcon}
					src={bfCalculatorIcon}
					alt='calculator illustration'
					width={68}
					height={61}
				/>
				<div className={styles.blurbBlock}>
					<h2 className={styles.header}>Calculate Board Feet measurements for Dimensional Lumber</h2>
					<p className={styles.subheader}>
						Whether you're planning a build or pricing lumber at the mill, quickly add up the costs using our
						calculator.
					</p>
				</div>

				{/* FIXME: Replace this screenshot image with live component showing interactive list */}
			</div>

			<div className={`${styles.section} ${styles.sectionThree}`}>
				<div className={styles.blurbBlock}>
					<h2 className={styles.header}>Add your Consumables once and they'll apply to all projects</h2>
					<p className={styles.subheader}>
						It takes a lot of supplies to build a project. Incorporate them into your billing by applying a
						percentage of their cost towards each project.
					</p>
				</div>

				{/* FIXME: Replace this screenshot image with live component showing interactive list */}
				<Image
					className={styles.screenshotImage}
					src={'/expense-tracking.jpg'}
					alt='screenshot showing woodworking expenses'
					width={1065}
					height={590}
				/>
			</div>

			<div className={`${styles.section} ${styles.sectionFour}`}>
				<div className={styles.blurbBlock}>
					<h2 className={styles.header}>Sign In using an existing account</h2>
					<p className={styles.subheader}>
						No need to keep track of another login account, sign in using your google or facebook account
					</p>
					<button onClick={signIn} className={styles.signInButton}>
						Get Started
					</button>
				</div>
			</div>
		</div>
	);
}

export default LandingPage;
