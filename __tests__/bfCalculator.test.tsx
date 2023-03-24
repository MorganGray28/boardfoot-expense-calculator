import { calculateBoardFeet, calculateCostFromBF } from '../src/utils/calculationsUtils';

test('calculates board feet', () => {
	expect(calculateBoardFeet({ numOfPieces: 1, thickness: 1.75, width: 6, length: 72 })).toBe(5.25);
});

test('calculates cost from bf and price per bf', () => {
	expect(calculateCostFromBF({ boardFeet: 2, price: 20, tax: 10 })).toBe(44);
});
