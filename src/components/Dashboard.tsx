import React from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';

function Dashboard() {
	const { data: session } = useSession();
	const projects = trpc.user.getProjectsById.useQuery(session?.user?.id!);

	const userData = trpc.user.getUserData.useQuery(session?.user?.id!);

	if (userData.data) {
		console.log(userData.data);
	}

	if (projects.data) {
		return (
			<div>
				{projects.data.map((p) => (
					<li key={p.id}>{p.name}</li>
				))}
			</div>
		);
	} else {
		return <p>Loading...</p>;
	}
}

export default Dashboard;
