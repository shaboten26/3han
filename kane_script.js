import { db } from "./db.js";

document.addEventListener("DOMContentLoaded", () => {
	const secretBox = document.getElementById("only-expense");
	const radioButtons = document.querySelectorAll('input[name="type"]');
	const formElement = document.getElementById("transaction-form");
	const purposeElement = document.getElementById("purpose");
	const locationElement = document.getElementById("location");
	const amountElement = document.getElementById("amount");
	const dateElement = document.getElementById("date");

	// タグ機能に関する要素
	const tagInputElement = document.getElementById("tag-input");
	const addTagBtn = document.getElementById("add-tag-btn");
	const tagListElement = document.getElementById("tag-list");

	let isExpense = true;
	let tags = []; // タグを保持する配列

	// 日付初期値を本日に設定（利便性のため）
	const today = new Date().toISOString().split("T")[0];
	dateElement.value = today;

	// --- タグ関連の処理 ---
	const renderTags = () => {
		tagListElement.innerHTML = "";
		tags.forEach((tag, index) => {
			const tagBadge = document.createElement("span");
			tagBadge.className = "tag-badge";
			tagBadge.innerHTML = `
				#${tag}
				<button type="button" class="tag-remove-btn" data-index="${index}">&times;</button>
			`;
			tagListElement.appendChild(tagBadge);
		});
	};

	const addTag = () => {
		const val = tagInputElement.value.trim();
		if (val && !tags.includes(val)) {
			tags.push(val);
			tagInputElement.value = "";
			renderTags();
		}
	};

	// 「追加」ボタンでタグ追加
	addTagBtn.addEventListener("click", addTag);

	// Enterキーでタグ追加
	tagInputElement.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag();
		}
	});

	// タグ削除（イベント委任）
	tagListElement.addEventListener("click", (e) => {
		if (e.target.classList.contains("tag-remove-btn")) {
			const index = Number(e.target.dataset.index);
			tags.splice(index, 1);
			renderTags();
		}
	});

	// --- フォーム送信処理 ---
	formElement.addEventListener("submit", async (e) => {
		e.preventDefault();

		const amount = Number(amountElement.value);
		// dateElement.valueAsDate を安全にタイムスタンプ化
		const dateTime = dateElement.valueAsDate
			? dateElement.valueAsDate.getTime()
			: new Date(dateElement.value).getTime();

		const data = {
			price: isExpense ? -amount : amount,
			date: dateTime,
		};

		// 支出の場合のみ任意項目（用途・場所・タグ）を追加
		if (isExpense) {
			if (purposeElement.value.trim()) {
				data.purpose = purposeElement.value.trim();
			}
			if (locationElement.value.trim()) {
				data.place = locationElement.value.trim();
			}
			if (tags.length > 0) {
				data.tag = [...tags];
			}
		}

		await db.money.add(data);
		console.log("登録データ:", data);

		alert("保存しました");
		window.location.assign("top.html");
	});

	// --- ラジオボタン切替 ---
	radioButtons.forEach((radio) => {
		radio.addEventListener("change", (e) => {
			if (e.target.value === "expense") {
				secretBox.style.display = "block";
				isExpense = true;
			} else {
				secretBox.style.display = "none";
				isExpense = false;
			}
		});
	});
});
