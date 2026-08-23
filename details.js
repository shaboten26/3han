document.addEventListener('DOMContentLoaded', () => {
    const detailContent = document.getElementById('detail-content');
    
    // URLのクエリパラメータからIDを取得 (例: details.html?id=123456789)
    const params = new URLSearchParams(window.location.search);
    const itemId = Number(params.get('id'));

    const items = JSON.parse(localStorage.getItem('receiptPrintItems')) || [];
    const item = items.find(i => i.id === itemId);

    if (!item) {
        detailContent.innerHTML = '<p style="color: #e53e3e;">該当するデータが見つかりませんでした。</p>';
        return;
    }

    let html = `
        <img src="${item.image}" alt="詳細画像">
        <div class="detail-item"><strong>保存日時:</strong> ${item.createdAt}</div>
        <div class="detail-item"><strong>種類:</strong> ${item.type === 'receipt' ? 'レシート' : 'プリント'}</div>
    `;

    if (item.type === 'receipt') {
        html += `
            <div class="detail-item"><strong>場所:</strong> ${item.place || '-'}</div>
            <div class="detail-item"><strong>日付:</strong> ${item.date || '-'}</div>
            <div class="detail-item"><strong>タグ:</strong> ${item.tag || '-'}</div>
            <div class="detail-item"><strong>小計:</strong> ¥${item.subtotal ? Number(item.subtotal).toLocaleString() : '0'}</div>
            <div class="detail-item"><strong>商品名:</strong> ${item.itemsName || '-'}</div>
        `;
    } else {
        const catText = item.category === 'submission' ? '提出物' : '配布物';
        html += `<div class="detail-item"><strong>区分:</strong> ${catText}</div>`;
        if (item.category === 'submission') {
            html += `
                <div class="detail-item"><strong>教科:</strong> ${item.subject || '-'}</div>
                <div class="detail-item"><strong>名前:</strong> ${item.name || '-'}</div>
                <div class="detail-item"><strong>提出期限:</strong> ${item.date || '-'}</div>
            `;
        }
    }

    detailContent.innerHTML = html;
});