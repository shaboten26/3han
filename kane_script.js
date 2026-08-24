import { db } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
	const secretBox = document.getElementById("only-expense");
	const radioButtons = document.querySelectorAll('input[name="type"]');
	const formElement = document.getElementById("transaction-form");
	const purposeElement = document.getElementById("purpose");
	const locationElement = document.getElementById("location");
	const amountElement = document.getElementById("amount");
	const dateElement = document.getElementById("date");
	let isExpense = true;

	formElement.addEventListener("submit", async (e) => {
		e.preventDefault(); // ページのリロードを防ぐ
		if (isExpense) {
			await db.money.add({
				purpose: purposeElement.value,
				place: locationElement.value,
				price: -Number(amountElement.value),
				date: dateElement.valueAsDate.getTime(),
			});
			console.log({
				purpose: purposeElement.value,
				place: locationElement.value,
				price: -Number(amountElement.value),
				date: dateElement.valueAsDate.getTime(),
			});
		} else {
			await db.money.add({
				price: Number(amountElement.value),
				date: date.valueAsDate.getTime(),
			});
			console.log({
				price: Number(amountElement.value),
				date: dateElement.valueAsDate.getTime(),
			});
		}
		alert("保存しました");
		window.location.assign("top.html");
	});

	radioButtons.forEach((radio) => {
		radio.addEventListener("change", (e) => {
			// 特定の値（例: option1）が選ばれた時だけ表示する
			if (e.target.value === "expense") {
				secretBox.style.display = "block";
				isExpense = true;
				purposeElement.required = true;
				locationElement.required = true;
			} else {
				secretBox.style.display = "none";
				isExpense = false;
				purposeElement.required = false;
				locationElement.required = false;
			}
		});
	});
});
