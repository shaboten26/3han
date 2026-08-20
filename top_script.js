import { db } from "./db.js";

const getChartData = async () => {
	const result = await db.money
		.where("date")
		.above(dateFns.startOfMonth(new Date()).getTime())
		.toArray();
	const thisMonthDays = dateFns.getDaysInMonth(new Date());
	const dailyTotals = new Array(thisMonthDays).fill(0);
	result.forEach((item) => {
		const day = dateFns.getDate(new Date(item.date));
		if (day >= 1 && day <= thisMonthDays) {
			const amount = item.price;
			dailyTotals[day - 1] += amount;
		}
	});
	return dailyTotals;
};

document.addEventListener("DOMContentLoaded", async () => {
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
});

//直近の履歴表示
document.getElementById("recent").addEventListener("click", async () => {updateRecentHistory()});

async function updateRecentHistory() {
	const recentHistory = document.getElementById("recent-history");
	const recentLength = recentHistory.childElementCount;
	console.log(recentLength);
	const recentData = await db.money.orderBy("date").reverse().offset(recentLength).limit(2).toArray();
    console.log("recentData");
    console.log(recentData);
	recentData.forEach(transaction =>{
		    console.log(transaction);
			const card = document.createElement("div");
			card.classList.add("card");
			let date = new Date(transaction.date * 1000);
			if(transaction.price > 0){
				card.innerHTML = `
					<h1 class="income">+${transaction.price}円</h1>
					<p>${date.toLocaleDateString()}</p>
				`;
			}else{
				card.innerHTML = `
					<h1 class="expense">${transaction.price}円</h1>
					<p>${date.toLocaleDateString().slice(5)}</p>
					<p>${transaction.purpose}</p>
					<p>${transaction.place}</p>
				`;
			}
			recentHistory.appendChild(card);

	});
	if(recentData.length === 0){
		if(recentLength % 2 == 1){
			recentHistory.appendChild(document.createElement("div"));
		}
		const noMoreData = document.createElement("p");
		noMoreData.textContent = "これ以上履歴はありません。";
		recentHistory.appendChild(noMoreData);
		document.getElementById("recent").remove();
	}
};

updateRecentHistory();