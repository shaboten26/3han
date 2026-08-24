import { db } from "./db.js";

document.addEventListener('DOMContentLoaded', async () => {
	const detailContent = document.getElementById('detail-content');
	
	// URLのクエリパラメータからIDを取得 (例: details.html?id=1)
	const params = new URLSearchParams(window.location.search);
	const itemId = Number(params.get('id'));

	if (!itemId) {
		detailContent.innerHTML = '<p style="color: #e53e3e;">IDが正しく指定されていません。</p>';
		return;
	}

	// DexieからIDをキーにして直接1件取得
	const item = await db.money.get(itemId);

	if (!item) {
		detailContent.innerHTML = '<p style="color: #e53e3e;">該当するデータが見つかりませんでした。</p>';
		return;
	}

	// 日付 (date: number タイムスタンプ対応) のフォーマット整形
	let displayDate = "-";
	if (item.date) {
		const d = new Date(item.date);
		displayDate = isNaN(d.getTime()) ? item.date : d.toLocaleDateString("ja-JP");
	}

	// タグ (tag: string[]) の表示整形
	let tagsText = "-";
	if (Array.isArray(item.tag) && item.tag.length > 0) {
		tagsText = item.tag.map(t => `#${t}`).join(' ');
	} else if (typeof item.tag === 'string' && item.tag) {
		tagsText = `#${item.tag}`;
	}

	const dummyImage =
		"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%234a5568'%3ENo Image%3C/text%3E%3C/svg%3E";

	// 削除ボタンを含めたHTMLを生成
	const html = `
		<div class="detail-card">
			<img src="${item.image || dummyImage}" alt="詳細画像" class="detail-image">
			<div class="detail-item"><strong>収支:</strong> ${item.price || "-"}</div>
			<div class="detail-item"><strong>場所 (店名):</strong> ${item.place || '-'}</div>
			<div class="detail-item"><strong>目的:</strong> ${item.purpose || '-'}</div>
			<div class="detail-item"><strong>日付:</strong> ${displayDate}</div>
			<div class="detail-item"><strong>タグ:</strong> ${tagsText}</div>
		</div>
		
		<!-- 削除ボタンのエリア -->
		<div class="action-buttons" style="margin-top: 2rem; text-align: center;">
			<button id="delete-btn" class="delete-btn">この記録を削除する</button>
		</div>
	`;

	detailContent.innerHTML = html;

	// 削除ボタンのイベントリスナーを設定
	const deleteBtn = document.getElementById('delete-btn');
	if (deleteBtn) {
		deleteBtn.addEventListener('click', async () => {
			// ブラウザ標準の確認ダイアログを表示
			const isConfirmed = window.confirm("このデータを削除してもよろしいですか？\n※この操作は取り消せません。");
			
			// 「OK」が押された場合のみ削除処理を実行
			if (isConfirmed) {
				try {
					// IndexedDB からデータを削除
					const theData  = db.money.get(itemId);
					await db.money.delete(itemId);
					const nowMoney = localStorage.getItem("nowMoney");
					localStorage.setItem("nowMoney", Number(nowMoney) + theData.price);
					
					// 削除完了のアラートを出し、一覧ページへ戻る
					alert("データを削除しました。");
					window.location.href = "lists.html"; // 一覧ページのファイル名に合わせてください
				} catch (error) {
					console.error("削除中にエラーが発生しました:", error);
					alert("削除に失敗しました。");
				}
			}
		});
	}
});
