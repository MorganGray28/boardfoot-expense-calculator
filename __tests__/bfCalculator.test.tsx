import { calculateBoardFeet } from '../src/utils/calculationsUtils';

test('calculates board feet', () => {
	expect(calculateBoardFeet({ numOfPieces: 1, thickness: 1.75, width: 6, length: 72 })).toBe(5.25);
});
