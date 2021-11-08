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
let _today = new Date();
let dd = String(_today.getDate()).padStart(2, "0");
let mm = String(_today.getMonth() + 1).padStart(2, "0");
let yyyy = _today.getFullYear();
export const today = yyyy + "-" + mm + "-" + dd;
