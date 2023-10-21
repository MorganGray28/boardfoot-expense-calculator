import React, { ReactNode } from 'react';
import styles from '../styles/ExpenseAndConsumableGroup.module.scss';

interface PropsType {
	children: ReactNode;
}

export default function ExpenseAndConsumableGroup({ children }: PropsType) {
	return <div className={styles.flexContainer}>{children}</div>;
}
