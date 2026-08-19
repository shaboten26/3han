import { startOfMonth } from "https://esm.run";
import { db } from "./db";

const chartElement = document.getElementById("chart");

const getChartData = async () => {
	const result = await db.money
		.where("date")
		.above(startOfMonth(new Date()))
		.toArray();
	return result;
};

chartElement.addEventListener("click", getChartData);
