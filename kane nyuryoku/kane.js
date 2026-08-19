window.onload = function() {
    setToday();
};

let currentType = 'expense';

// 本日の日付をセットする関数
function setToday() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = today;
    }
}

function changeType(type) {
    currentType = type;
    const btnExpense = document.getElementById('btnExpense');
    const btnIncome = document.getElementById('btnIncome');
    const submitBtn = document.getElementById('submitBtn');

    if (type === 'expense') {
        btnExpense.classList.add('active');
        btnIncome.classList.remove('active');
        
        submitBtn.classList.remove('income');
        submitBtn.classList.add('expense');
    } else {
        btnIncome.classList.add('active');
        btnExpense.classList.remove('active');
        
        submitBtn.classList.remove('expense');
        submitBtn.classList.add('income');
    }
}

function addTransaction() {
    const amountInput = document.getElementById('amount');
    const locationInput = document.getElementById('location');
    const purposeInput = document.getElementById('purpose');
    const dateInput = document.getElementById('date');

    const amount = Number(amountInput.value);
    
    // 入力チェック
    if (!amount || amount <= 0) {
        alert('正しい金額を入力してください');
        return;
    }
    if (!dateInput.value) {
        alert('日付を選択してください');
        return;
    }

    const typeText = currentType === 'expense' ? '支出' : '収入';
    alert(`${typeText}として登録しました！`);

    // --- 各入力欄を強制的に空にする ---
    amountInput.value = '';
    locationInput.value = '';
    purposeInput.value = '';
    
    // 日付を今日に再設定
    setToday();

    // ブラウザの入力保持（オートコンプリート等）を回避するため、金額欄にフォーソルを戻す
    amountInput.focus();
}