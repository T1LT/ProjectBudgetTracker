export const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
let _today = new Date();
let dd = String(_today.getDate()).padStart(2, "0");
let mm = String(_today.getMonth() + 1).padStart(2, "0");
let yyyy = _today.getFullYear();
export const today = yyyy + "-" + mm + "-" + dd;
