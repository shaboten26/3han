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
