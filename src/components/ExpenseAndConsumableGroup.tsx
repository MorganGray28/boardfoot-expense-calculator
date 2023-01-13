import React, { ReactNode } from 'react';

interface PropsType {
	children: ReactNode;
}

export default function ExpenseAndConsumableGroup({ children }: PropsType) {
	return <div style={{ display: 'flex', justifyContent: 'space-around' }}>{children}</div>;
}
