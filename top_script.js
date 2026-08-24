import { db } from "./db.js";

const getChartData = async () => {
	const now = new Date();
	const start = dateFns.startOfMonth(now).getTime();
	const end = dateFns.endOfMonth(now).getTime();

	// 今月1日〜今月末日の範囲内のみ取得（両端を含む true, true）
	const result = await db.money
		.where("date")
		.between(start, end, true, true)
		.toArray();

	const thisMonthDays = dateFns.getDaysInMonth(now);
	const dailyTotals = new Array(thisMonthDays).fill(0);

	result.forEach((item) => {
		const day = dateFns.getDate(new Date(item.date));
		if (day >= 1 && day <= thisMonthDays) {
			const amount = Number(item.price) || 0;
			dailyTotals[day - 1] += amount;
		}
	});

	return dailyTotals;
};

const updateRecentHistory = async () => {
	const recentHistory = document.getElementById("recent-history");
	const recentLength = recentHistory.childElementCount;
	console.log(recentLength);
	const recentData = await db.money
		.orderBy("date")
		.reverse()
		.offset(recentLength)
		.limit(2)
		.toArray();
	recentData.forEach((transaction) => {
		console.log(transaction);
		const card = document.createElement("div");
		card.classList.add("card");
		const date = new Date(transaction.date);
		if (transaction.price > 0) {
			card.innerHTML = `
					<h1 class="income">+${transaction.price}円</h1>
					<p>${date.toLocaleDateString().slice(5)}</p>
				`;
		} else {
			card.innerHTML = `
					<h1 class="expense">${transaction.price}円</h1>
					<p>${date.toLocaleDateString().slice(5)}</p>
					<p>${transaction.purpose}</p>
					<p>${transaction.place}</p>
				`;
		}
		card.addEventListener(
			"click",
			() => (window.location.href = `details.html?id=${transaction.id}`),
		);
		recentHistory.appendChild(card);
	});
	if (recentData.length === 0) {
		if (recentLength % 2 === 1) {
			recentHistory.appendChild(document.createElement("div"));
		}
		const noMoreData = document.createElement("p");
		noMoreData.textContent = "これ以上履歴はありません。";
		recentHistory.appendChild(noMoreData);
		document.getElementById("recent").remove();
	}
};

document.addEventListener("DOMContentLoaded", () => {
	const init = async () => {
		const myBarChartElement = document.getElementById("myBarChart");
		new Chart(myBarChartElement, {
			type: "bar",
			data: {
				labels: Array.from(
					{ length: dateFns.getDaysInMonth(new Date()) },
					(_, i) => i + 1,
				),
				datasets: [
					{
						label: "収支",
						data: await getChartData(),
						borderWidth: 1,
					},
				],
			},
		});
		await updateRecentHistory();
		const nowMoney = localStorage.getItem("nowMoney") || 0;
		const nowMoneyElement = document.getElementById("nowMoney");
		nowMoneyElement.textContent = nowMoney || 0;
	};
	init();
});

//直近の履歴表示
document
	.getElementById("recent")
	.addEventListener("click", () => updateRecentHistory());
