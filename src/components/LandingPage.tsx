import React from 'react';
import Image from 'next/image';
import styles from '../styles/LandingPage.module.scss';

function LandingPage() {
	return (
		<div>
			<div className={styles.section}>
				<div className={styles.blurbBlock}>
					<h2 className={styles.header}>
						Easily track project expenses, even the <span className={styles.magicFont}>little things</span>
					</h2>
					<p className={styles.subheader}>
						Are you letting unnoticed expenses go unaccounted for when you send out the bill?
					</p>
					<button className={styles.signInButton}>Sign In</button>
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
		</div>
	);
}

export default LandingPage;
