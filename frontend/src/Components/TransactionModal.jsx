import React from "react";
import Modal from "react-modal";
import { Alert, AlertTitle } from "@mui/material";
import { today } from "../utils";

const TransactionModal = ({
	isOpen,
	closeModal,
	transactionType,
	setTransactionType,
	formTransactionData,
	setFormTransactionData,
	handleTransaction,
	showError,
	setShowError,
	caller,
}) => {
	const handleChange = (event) => {
		if (event.target.name === "transaction-amount") {
			if (event.target.value[0] === "-") {
				setShowError(true);
			} else {
				setShowError(false);
				setFormTransactionData({
					...formTransactionData,
					[event.target.name]: event.target.value,
				});
			}
		} else if (event.target.name === "transaction-date") {
			setFormTransactionData({
				...formTransactionData,
				"transaction-date": event.target.value,
			});
		} else {
			setFormTransactionData({
				...formTransactionData,
				[event.target.name]: event.target.value,
			});
		}
	};

	const handleTransactionType = (event) => {
		setTransactionType(event.target.value);
		handleChange(event);
	};
	return (
		<Modal
			isOpen={isOpen}
			onRequestClose={closeModal}
			closeTimeoutMS={200}
			className="Modal"
			overlayClassName="Overlay"
			ariaHideApp={false}
		>
			<form>
				<center>
					<h1>{caller} a Transaction</h1>
				</center>
				<label htmlFor="transaction-name">Transaction Name: </label>
				<input
					type="text"
					id="transaction-name"
					name="transaction-name"
					defaultValue={
						caller === "Edit" ? formTransactionData["transaction-name"] : ""
					}
					onChange={handleChange}
					required
				/>
				<label htmlFor="transaction-date">Transaction Date: </label>
				<input
					type="date"
					id="transaction-date"
					name="transaction-date"
					defaultValue={
						caller === "Edit" ? formTransactionData["transaction-date"] : today
					}
					max={today}
					onChange={handleChange}
					required
				/>
				<label htmlFor="transaction-type">Type of Transaction: </label>
				<select
					type="text"
					id="transaction-type"
					name="transaction-type"
					value={
						caller === "Edit"
							? formTransactionData["transaction-type"]
							: transactionType
					}
					onChange={handleTransactionType}
					required
				>
					<option value="Architect">Architect</option>
					<option value="DBA">DBA</option>
					<option value="Technical Lead">Technical Lead</option>
					<option value="Developer">Developer</option>
					<option value="Business Analyst">Business Analyst</option>
					<option value="Tester">Tester</option>
					<option value="Networking and Security">
						Networking and Security
					</option>
					<option value="Travel Expenses">Travel Expenses</option>
					<option value="Hardware Costs">Hardware Costs</option>
					<option value="Software Costs">Software Costs</option>
					<option value="Stationery">Stationery</option>
					<option value="Training">Training</option>
					<option value="Miscellaneous">Miscellaneous</option>
				</select>
				<label
					htmlFor="transaction-amount"
					className={showError ? "labelError" : "tempclass"}
				>
					Transaction Amount:{" "}
				</label>
				<input
					type="number"
					step="any"
					id="transaction-amount"
					name="transaction-amount"
					defaultValue={
						caller === "Edit"
							? Number.parseFloat(formTransactionData["transaction-amount"])
							: ""
					}
					onChange={handleChange}
					className={showError ? "errorClass" : "tempclass"}
					required
				/>
				{showError && (
					<Alert severity="error">
						<AlertTitle>Error</AlertTitle>
						Enter a positive value for amount!
					</Alert>
				)}
				<center>
					<button
						type="submit"
						onClick={handleTransaction}
						id="transaction-submit"
					>
						Submit
					</button>
					<button type="reset" value="Reset">
						Reset
					</button>
				</center>
			</form>
			<button onClick={closeModal} id="closeButton">
				&times;
			</button>
		</Modal>
	);
};

export default TransactionModal;
