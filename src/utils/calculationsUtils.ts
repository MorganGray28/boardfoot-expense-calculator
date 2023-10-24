type BoardFeetPropsType = {
	numOfPieces: number;
	thickness: number;
	width: number;
	length: number;
};

export function calculateBoardFeet({ numOfPieces, thickness, width, length }: BoardFeetPropsType) {
	let boardFeet = numOfPieces * ((thickness * width * length) / 144);
	boardFeet = parseFloat(boardFeet.toFixed(2));
	return boardFeet;
}

type CostPropsType = {
	boardFeet: number;
	price: number;
	tax: number;
};

export function calculateCostFromBF({ boardFeet, price, tax }: CostPropsType) {
	const cost = parseFloat((boardFeet * price).toFixed(2));
	if (!tax) {
		return cost;
	} else {
		// might use formattedTax in the future if I decide to display tax separately
		// const formattedTax = parseFloat(((tax / 100) * cost).toFixed(2));
		let postTax = (tax / 100) * cost + cost;
		postTax = parseFloat(postTax.toFixed(2));
		return postTax;
	}
}
