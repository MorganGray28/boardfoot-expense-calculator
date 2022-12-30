import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { trpc } from '../utils/trpc';

/*
createdAt: Wed Dec 28 2022 15:15:59 GMT-0800 (Pacific Standard Time) {}
id: "clc89zzyu0000voj0oblg43f4"
name: "Shelf"
updatedAt: Wed Dec 28 2022 15:15:49 GMT-0800 (Pacific Standard Time) {}
userId: "clbyb148i0000vocsn6ai0qig"
[[Prototype]]: Object

*/

interface ProjectType {
	createdAt: Date;
	id: string;
	name: string;
	updatedAt: Date;
	userId: string;
}

function ActiveProjectForm({ projects }: { projects: ProjectType[] }) {
	const [ActiveProject, setActiveProject] = useState('');
	console.log(projects);
	return (
		<div>
			<select name='projectList' value={ActiveProject} onChange={(e) => setActiveProject(e.target.value)}>
				{projects.map((p) => (
					<option value={p.name} key={p.id}>
						{p.name}
					</option>
				))}
			</select>
		</div>
	);
}

function Dashboard() {
	const { data: session } = useSession();
	const projects = trpc.user.getProjectsById.useQuery(session?.user?.id!);

	const userData = trpc.user.getUserData.useQuery(session?.user?.id!);

	if (projects.data) {
		return (
			<div>
				<ActiveProjectForm projects={projects.data} />
			</div>
		);
	} else {
		return <p>Loading...</p>;
	}
}

export default Dashboard;
