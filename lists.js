document.addEventListener('DOMContentLoaded', () => {
    // 【追加】もしデータがまだ何も入っていなければ、サンプルデータを自動追加する
    initSampleData();

    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPages = document.querySelectorAll('.tab-page');
    
    const receiptList = document.getElementById('receipt-list');
    const printList = document.getElementById('print-list');
    
    const receiptSearch = document.getElementById('receipt-search');
    const printSearch = document.getElementById('print-search');

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            navBtns.forEach(b => b.classList.remove('active'));
            tabPages.forEach(p => p.classList.remove('active'));

            e.target.classList.add('active');
            const targetId = e.target.dataset.target;
            document.getElementById(targetId).classList.add('active');
            renderLists();
        });
    });

    if (receiptSearch) receiptSearch.addEventListener('input', () => renderLists());
    if (printSearch) printSearch.addEventListener('input', () => renderLists());

    function renderLists() {
        let items = JSON.parse(localStorage.getItem('receiptPrintItems')) || [];
        
        if (receiptList) receiptList.innerHTML = '';
        if (printList) printList.innerHTML = '';

        const receiptKeyword = receiptSearch ? receiptSearch.value.toLowerCase() : '';
        const printKeyword = printSearch ? printSearch.value.toLowerCase() : '';

        const receipts = items.filter(item => {
            if (item.type !== 'receipt') return false;
            const matchText = `${item.place || ''} ${item.tag || ''} ${item.itemsName || ''}`.toLowerCase();
            return matchText.includes(receiptKeyword);
        });

        const prints = items.filter(item => {
            if (item.type !== 'print') return false;
            const catName = item.category === 'submission' ? '提出物' : '配布物';
            const matchText = `${item.subject || ''} ${item.name || ''} ${catName}`.toLowerCase();
            return matchText.includes(printKeyword);
        });

        if (receiptList) {
            if (receipts.length === 0) {
                receiptList.innerHTML = '<p style="color: #718096;">該当するレシートはありません。</p>';
            } else {
                receipts.forEach(item => {
                    receiptList.appendChild(createCardElement(item));
                });
            }
        }

        if (printList) {
            if (prints.length === 0) {
                printList.innerHTML = '<p style="color: #718096;">該当するプリントはありません。</p>';
            } else {
                prints.forEach(item => {
                    printList.appendChild(createCardElement(item));
                });
            }
        }
    }

    function createCardElement(item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        let subLabel = 'レシート';
        if (item.type === 'print') {
            subLabel = item.category === 'submission' ? '提出物プリント' : '配布物プリント';
        }

        card.innerHTML = `
            <img src="${item.image}" alt="プレビュー">
            <div class="title-label">${subLabel}</div>
            <div class="date-label">保存: ${item.createdAt}</div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `details.html?id=${item.id}`;
        });
        return card;
    }

    renderLists();
});

// === サンプルデータを自動登録する関数 ===
function initSampleData() {
    let items = JSON.parse(localStorage.getItem('receiptPrintItems')) || [];
    
    // すでにデータが何かしら入っている場合は重複作成しない
    if (items.length > 0) return;

    // ダミー用のプレースホルダー画像（グレーの背景に文字を表示する画像URL）
    const dummyImage = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%234a5568'%3Eサンプル画像%3C/text%3E%3C/svg%3E";

    const sampleItems = [
        // レシート1
        {
            id: 1710000001000,
            type: 'receipt',
            image: dummyImage,
            createdAt: '2026/06/01 10:30:00',
            place: 'スーパーサンプラザ',
            date: '2026-06-01',
            tag: '食費, 消耗品',
            subtotal: '2480',
            itemsName: '牛乳, 卵, パン, 洗剤'
        },
        // レシート2
        {
            id: 1710000002000,
            type: 'receipt',
            image: dummyImage,
            createdAt: '2026/06/02 18:15:00',
            place: 'コンビニエンスストア',
            date: '2026-06-02',
            tag: 'おやつ',
            subtotal: '650',
            itemsName: 'コーヒー, サンドイッチ'
        },
        // プリント1（提出物）
        {
            id: 1710000003000,
            type: 'print',
            category: 'submission',
            image: dummyImage,
            createdAt: '2026/06/03 15:00:00',
            subject: '数学',
            name: '二次方程式の演習プリント',
            date: '2026-06-10'
        },
        // プリント2（配布物）
        {
            id: 1710000004000,
            type: 'print',
            category: 'distribution',
            image: dummyImage,
            createdAt: '2026/06/04 09:00:00'
            // 配布物は教科や名前の項目がないためシンプル
        }
    ];

    localStorage.setItem('receiptPrintItems', JSON.stringify(sampleItems));
}

document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabPages = document.querySelectorAll('.tab-page');
    
    const receiptList = document.getElementById('receipt-list');
    const printList = document.getElementById('print-list');
    
    const receiptSearch = document.getElementById('receipt-search');
    const printSearch = document.getElementById('print-search');

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            navBtns.forEach(b => b.classList.remove('active'));
            tabPages.forEach(p => p.classList.remove('active'));

            e.target.classList.add('active');
            const targetId = e.target.dataset.target;
            document.getElementById(targetId).classList.add('active');
            renderLists();
        });
    });

    if (receiptSearch) receiptSearch.addEventListener('input', () => renderLists());
    if (printSearch) printSearch.addEventListener('input', () => renderLists());

    function renderLists() {
        let items = JSON.parse(localStorage.getItem('receiptPrintItems')) || [];
        
        if (receiptList) receiptList.innerHTML = '';
        if (printList) printList.innerHTML = '';

        const receiptKeyword = receiptSearch ? receiptSearch.value.toLowerCase() : '';
        const printKeyword = printSearch ? printSearch.value.toLowerCase() : '';

        const receipts = items.filter(item => {
            if (item.type !== 'receipt') return false;
            const matchText = `${item.place || ''} ${item.tag || ''} ${item.itemsName || ''}`.toLowerCase();
            return matchText.includes(receiptKeyword);
        });

        const prints = items.filter(item => {
            if (item.type !== 'print') return false;
            const catName = item.category === 'submission' ? '提出物' : '配布物';
            const matchText = `${item.subject || ''} ${item.name || ''} ${catName}`.toLowerCase();
            return matchText.includes(printKeyword);
        });

        if (receiptList) {
            if (receipts.length === 0) {
                receiptList.innerHTML = '<p style="color: #718096;">該当するレシートはありません。</p>';
            } else {
                receipts.forEach(item => {
                    receiptList.appendChild(createCardElement(item));
                });
            }
        }

        if (printList) {
            if (prints.length === 0) {
                printList.innerHTML = '<p style="color: #718096;">該当するプリントはありません。</p>';
            } else {
                prints.forEach(item => {
                    printList.appendChild(createCardElement(item));
                });
            }
        }
    }

    function createCardElement(item) {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        let subLabel = 'レシート';
        if (item.type === 'print') {
            subLabel = item.category === 'submission' ? '提出物プリント' : '配布物プリント';
        }

        card.innerHTML = `
            <img src="${item.image}" alt="プレビュー">
            <div class="title-label">${subLabel}</div>
            <div class="date-label">保存: ${item.createdAt}</div>
        `;

        // クリックしたら詳細ページ(details.html)へIDつきで遷移
        card.addEventListener('click', () => {
            window.location.href = `details.html?id=${item.id}`;
        });
        return card;
    }

    renderLists();
});