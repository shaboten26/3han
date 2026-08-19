let currentType = 'expense';

// 初期化：今日の日付をセット
window.onload = () => {
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
};

// 収支切り替え
function switchType(type) {
    currentType = type;
    document.getElementById('expense-btn').classList.toggle('active', type === 'expense');
    document.getElementById('income-btn').classList.toggle('active', type === 'income');
}

// フォーム送信
document.getElementById('pocket-money-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        type: currentType,
        amount: document.getElementById('amount').value,
        location: document.getElementById('location').value || '未入力',
        purpose: document.getElementById('purpose').value || '未入力',
        date: document.getElementById('date').value
    };

    console.log('保存データ:', data);
    alert('決定しました！\n' + JSON.stringify(data, null, 2));
});