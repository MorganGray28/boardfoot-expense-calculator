import React from 'react';

interface PropTypes {
	category: string;
}

export default function CostList({ category }: PropTypes) {
	return (
		<div>
			<p>{category}</p>
		</div>
	);
}
