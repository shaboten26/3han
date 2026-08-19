// 要素の取得
const form = document.getElementById('transaction-form');
const amountInput = document.getElementById('amount');
const titleInput = document.getElementById('title');
const locationInput = document.getElementById('location');
const dateInput = document.getElementById('date');
const transactionList = document.getElementById('transaction-list');

const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const totalBalanceEl = document.getElementById('total-balance');

// 今日の日付を初期値としてセット
dateInput.valueAsDate = new Date();

// ローカルストレージからデータを読み込む
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// 初期描画
init();

function init() {
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => addTransactionDOM(transaction, index));
    updateValues();
}

// 画面にリストを追加する関数
function addTransactionDOM(transaction, index) {
    const li = document.createElement('li');
    li.classList.add(transaction.type);

    const sign = transaction.type === 'income' ? '+' : '-';
    const formattedAmount = `${sign}¥${Number(transaction.amount).toLocaleString()}`;

    li.innerHTML = `
        <div class="item-info">
            <span class="item-date">${transaction.date}</span>
            <span class="item-title">${transaction.title}（${transaction.location}）</span>
        </div>
        <div class="item-right">
            <span class="item-amount">${formattedAmount}</span>
            <button class="delete-btn" onclick="removeTransaction(${index})">×</button>
        </div>
    `;

    transactionList.appendChild(li);
}

// 合計金額を計算して画面を更新する関数
function updateValues() {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expense;

    totalIncomeEl.textContent = `¥${income.toLocaleString()}`;
    totalExpenseEl.textContent = `¥${expense.toLocaleString()}`;
    totalBalanceEl.textContent = `¥${balance.toLocaleString()}`;
}

// 決定ボタンが押されたときの処理
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // 選択されているラジオボタン（支出 or 収入）の値を取得
    const typeValue = document.querySelector('input[name="type"]:checked').value;

    const transaction = {
        type: typeValue,
        amount: Number(amountInput.value),
        title: titleInput.value.trim(),
        location: locationInput.value.trim(),
        date: dateInput.value
    };

    transactions.push(transaction);
    updateLocalStorage();
    init();

    // 入力欄をクリア（日付と区分はそのまま維持）
    amountInput.value = '';
    titleInput.value = '';
    locationInput.value = '';
    amountInput.focus();
});

// データを削除する関数
function removeTransaction(index) {
    transactions.splice(index, 1);
    updateLocalStorage();
    init();
}

// ローカルストレージを更新する関数
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}