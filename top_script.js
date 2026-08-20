const getChartData = async () => {
	// const result = await db.money
	// 	.where("date")
	// 	.above(startOfMonth(new Date()))
	// 	.toArray();
	// db.money.where("date").above(startOfMonth(new Date())).toArray() の戻り値イメージ
	const result = [
		// 8月1日
		{
			purpose: "income",
			place: "給料",
			date: new Date("2026-08-01").getTime(),
			tag: ["固定収入"],
			price: 250000,
		},
		{
			purpose: "expense",
			place: "スーパー",
			date: new Date("2026-08-01").getTime(),
			tag: ["食費"],
			price: -3200,
		},
		// 8月3日
		{
			purpose: "expense",
			place: "コンビニ",
			date: new Date("2026-08-03").getTime(),
			tag: ["間食"],
			price: -650,
		},
		// 8月10日
		{
			purpose: "expense",
			place: "カフェ",
			date: new Date("2026-08-10").getTime(),
			tag: ["交際費"],
			price: -1200,
		},
		// 8月15日
		{
			purpose: "income",
			place: "フリマアプリ売上",
			date: new Date("2026-08-15").getTime(),
			tag: ["副収入"],
			price: 4500,
		},
		// 8月20日（今日）
		{
			purpose: "expense",
			place: "ドラッグストア",
			date: new Date("2026-08-20").getTime(),
			tag: ["日用品"],
			price: -2100,
		},
	];

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
