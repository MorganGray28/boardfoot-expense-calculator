export function checkForIdenticalObjects<Tobj extends {}>(obj1: Tobj, obj2: Tobj) {
	let identical = true;
	for (let key in obj1) {
		if (obj1[key] !== obj2[key]) {
			identical = false;
		}
	}
	return identical;
}
