export const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
export const _months = {
	Jan: "january",
	Feb: "february",
	Mar: "march",
	Apr: "april",
	May: "may",
	Jun: "june",
	Jul: "july",
	Aug: "august",
	Sep: "september",
	Oct: "october",
	Nov: "november",
	Dec: "december",
};
let _today = new Date();
let dd = String(_today.getDate()).padStart(2, "0");
let mm = String(_today.getMonth() + 1).padStart(2, "0");
let yyyy = _today.getFullYear();
export const today = yyyy + "-" + mm + "-" + dd;

export const addOneYear = (input) => {
	const date = new Date(input);
	date.setFullYear(date.getFullYear() + 1);
	let dd = String(date.getDate()).padStart(2, "0");
	let mm = String(date.getMonth()).padStart(2, "0");
	let yyyy = date.getFullYear();
	return yyyy + "-" + mm + "-" + dd;
};
