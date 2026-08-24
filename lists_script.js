import { db } from "./db.js";

document.addEventListener("DOMContentLoaded", async () => {
	// サンプルデータが空ならDexieに追加
	await initSampleData();

	const receiptList = document.getElementById("receipt-list");
	const receiptSearch = document.getElementById("receipt-search");

	// 検索入力時のリアルタイムフィルター
	if (receiptSearch) {
		receiptSearch.addEventListener("input", () => renderLists());
	}

	// データの取得と一覧描画
	async function renderLists() {
		let items = [];
		try {
			// IndexedDB (db.money) から全件取得
			items = await db.money.toArray();
			// 最初は日付（date）で降順ソート（新しい順）にしておく
			items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
		} catch (error) {
			console.error("データの取得に失敗しました:", error);
			items = [];
		}

		if (receiptList) receiptList.innerHTML = "";

		const keyword = receiptSearch ? receiptSearch.value.toLowerCase().trim() : "";
		let filteredItems = items;

		// 検索キーワードがある場合のみフィルタリングと並び替えを実行
		if (keyword) {
			filteredItems = items
				.map((item) => {
					let score = 0;

					// 各項目のテキストを取得（比較用に小文字化）
					const tagsText = Array.isArray(item.tag) ? item.tag.join(" ") : (item.tag || "");
					const tagsTextLower = tagsText.toLowerCase();
					
					const placeText = (item.place || "").toLowerCase();
					const purposeText = (item.purpose || "").toLowerCase();
					const itemsNameText = (item.itemsName || "").toLowerCase();

					// ★タグにマッチした場合はスコアを高く設定（最優先）
					if (tagsTextLower.includes(keyword)) {
						score += 100; 
					}
					// 店名、場所（目的）、商品名にマッチした場合は通常のスコア
					if (placeText.includes(keyword)) {
						score += 10;
					}
					if (purposeText.includes(keyword)) {
						score += 10;
					}
					if (itemsNameText.includes(keyword)) {
						score += 10;
					}

					// itemとscoreのペアを返す
					return { item, score };
				})
				// スコアが1以上（どこかの項目にマッチした）ものを残す
				.filter((entry) => entry.score > 0)
				// スコアの降順でソート。スコアが同じなら日付が新しい順を維持
				.sort((a, b) => {
					if (b.score !== a.score) {
						return b.score - a.score; // スコアが高い方を上に
					}
					return new Date(b.item.date || 0) - new Date(a.item.date || 0);
				})
				// ソートが終わったら元の item データだけを取り出す
				.map((entry) => entry.item);
		}

		// 一覧の描画
		if (receiptList) {
			if (filteredItems.length === 0) {
				receiptList.innerHTML =
					'<p style="color: #718096; text-align: center; margin-top: 2rem;">該当するデータはありません。</p>';
			} else {
				filteredItems.forEach((item) => {
					receiptList.appendChild(createCardElement(item));
				});
			}
		}
	}

	// カード要素（HTML）の生成
	function createCardElement(item) {
		const card = document.createElement("div");
		card.className = "item-card";

		const dummyImage =
			"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%234a5568'%3ENo Image%3C/text%3E%3C/svg%3E";

		// 日付のフォーマット整形
		let displayDate = "";
		if (item.date) {
			const d = new Date(item.date);
			displayDate = isNaN(d.getTime()) ? item.date : d.toLocaleDateString("ja-JP");
		}

		// タグの表示整形
		const tagsHtml = Array.isArray(item.tag)
			? item.tag.map(t => `<span class="tag-badge">#${t}</span>`).join(" ")
			: (item.tag ? `<span class="tag-badge">#${item.tag}</span>` : "");

		card.innerHTML = `
			<img src="${item.image || dummyImage}" alt="プレビュー">
			<div class="card-content">
				<div class="title-label">${item.place || "利用店不明"}</div>
				<div class="purpose-label">${item.purpose || "目的未設定"}</div>
				<div class="date-label">日付: ${displayDate}</div>
				<div class="tags-container">${tagsHtml}</div>
			</div>
		`;

		// クリックで詳細ページ(details.html)へ移動
		card.addEventListener("click", () => {
			if (item.id) {
				window.location.href = `details.html?id=${item.id}`;
			}
		});

		return card;
	}

	// 初期表示を実行
	await renderLists();
});

// === サンプルデータを自動登録する関数 (Dexie: db.money構造に準拠) ===
async function initSampleData() {
	try {
		const count = await db.money.count();
		if (count > 0) return; // データが存在すればスキップ

		const dummyImage =
			"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%234a5568'%3Eサンプル画像%3C/text%3E%3C/svg%3E";

		// type money { purpose, place, date, tag } に合わせたサンプルデータ
		const sampleItems = [
			{
				place: "スーパーサンプラザ",
				purpose: "日用品の購入",
				date: Date.now() - 86400000 * 2, // 2日前
				tag: ["食費", "消耗品"],
				image: dummyImage
			},
			{
				place: "コンビニエンスストア",
				purpose: "軽食・おやつ",
				date: Date.now() - 86400000, // 1日前
				tag: ["おやつ"],
				image: dummyImage
			},
			{
				place: "文具の堂々堂",
				purpose: "ノートとペン",
				date: Date.now(), // 今日
				tag: ["勉強", "文房具"],
				image: dummyImage
			}
		];

		await db.money.bulkAdd(sampleItems);
	} catch (e) {
		console.error("サンプルデータの初期化に失敗しました:", e);
	}
}
