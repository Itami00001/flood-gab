// FIX-7: Сессия хранится под единым ключом jhub_user, проверено 2026-09-21
let currentUser = null;

function setCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('jhub_user', JSON.stringify(user));
    updateAuthUI();
    updateBalanceDisplay();
}

function getCurrentUser() {
    const stored = localStorage.getItem('jhub_user');
    if (stored) {
        currentUser = JSON.parse(stored);
    }
    return currentUser;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('jhub_user');
    updateAuthUI();
    window.location.href = 'index.html';
}

// FIX-10: Admin и Swagger ссылки для админа, проверено 2026-09-21
function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        if (currentUser) {
            loginLink.textContent = 'Выйти';
            loginLink.onclick = logout;
        } else {
            loginLink.textContent = 'Войти';
            loginLink.onclick = () => window.location.href = 'login.html';
        }
    }

    // Показать Admin и Swagger ссылки для админа
    const adminLink = document.getElementById('adminLink');
    const swaggerLink = document.getElementById('swaggerLink');
    
    if (currentUser && currentUser.role === 'admin') {
        if (adminLink) adminLink.style.display = 'block';
        if (swaggerLink) swaggerLink.style.display = 'block';
    } else {
        if (adminLink) adminLink.style.display = 'none';
        if (swaggerLink) swaggerLink.style.display = 'none';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const user = await login(username, password);
        setCurrentUser(user);
        window.location.href = 'index.html';
    } catch (error) {
        alert('Ошибка входа: ' + error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const userData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        full_name: document.getElementById('full_name').value
    };

    try {
        const user = await register(userData);
        setCurrentUser(user);
        window.location.href = 'index.html';
    } catch (error) {
        alert('Ошибка регистрации: ' + error.message);
    }
}

async function quickLogin(username, password) {
    try {
        const user = await login(username, password);
        setCurrentUser(user);
        window.location.href = 'index.html';
    } catch (error) {
        alert('Ошибка быстрого входа: ' + error.message);
    }
}

// Expose globally for event listeners
window.quickLogin = quickLogin;

// FIX-8: Профиль использует customer_id из localStorage и query-параметры, проверено 2026-09-21
async function loadProfile() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const profileInfo = document.getElementById('profileInfo');
    profileInfo.innerHTML = `
        <h3>${user.full_name}</h3>
        <p><strong>Имя пользователя:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Роль:</strong> ${user.role}</p>
        <p><strong>Баланс:</strong> ${formatPrice(user.balance || 0)} ₽</p>
    `;

    try {
        if (!user.customer_id) {
            document.getElementById('mySales').innerHTML = '<p>Профиль клиента не найден</p>';
            document.getElementById('myRentals').innerHTML = '<p>Профиль клиента не найден</p>';
            document.getElementById('myTestDrives').innerHTML = '<p>Профиль клиента не найден</p>';
            return;
        }

        const sales = await getSales();
        const userSales = sales.filter(s => s.customer_id === user.customer_id);
        
        const rentals = await getRentals();
        const userRentals = rentals.filter(r => r.customer_id === user.customer_id);
        
        const testDrives = await getTestDrives();
        const userTestDrives = testDrives.filter(td => td.customer_id === user.customer_id);

        document.getElementById('mySales').innerHTML = userSales.length > 0 ?
            userSales.map(sale => `
                <div style="padding: 0.5rem; border-bottom: 1px solid #807e83;">
                    <p><strong>${sale.car?.brand} ${sale.car?.model}</strong></p>
                    <p>Цена: ${formatPrice(sale.total_price)} ₽</p>
                    <p>Дата: ${new Date(sale.sale_date).toLocaleDateString()}</p>
                    <p>Статус: <span class="status ${sale.status}">${translateStatus(sale.status)}</span></p>
                </div>
            `).join('') :
            '<p>Нет покупок</p>';

        document.getElementById('myRentals').innerHTML = userRentals.length > 0 ?
            userRentals.map(rental => `
                <div style="padding: 0.5rem; border-bottom: 1px solid #807e83;">
                    <p><strong>${rental.car?.brand} ${rental.car?.model}</strong></p>
                    <p>Период: ${new Date(rental.start_date).toLocaleDateString()} - ${new Date(rental.end_date).toLocaleDateString()}</p>
                    <p>Стоимость: ${formatPrice(rental.total_price)} ₽</p>
                    <p>Статус: <span class="status ${rental.status}">${translateStatus(rental.status)}</span></p>
                </div>
            `).join('') :
            '<p>Нет аренд</p>';

        document.getElementById('myTestDrives').innerHTML = userTestDrives.length > 0 ?
            userTestDrives.map(td => `
                <div style="padding: 0.5rem; border-bottom: 1px solid #807e83;">
                    <p><strong>${td.car?.brand} ${td.car?.model}</strong></p>
                    <p>Дата: ${new Date(td.date).toLocaleString()}</p>
                    <p>Статус: <span class="status ${td.status}">${translateStatus(td.status)}</span></p>
                </div>
            `).join('') :
            '<p>Нет тест-драйвов</p>';
    } catch (error) {
        console.error('Error loading profile data:', error);
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    getCurrentUser();
    updateAuthUI();
    updateBalanceDisplay();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (document.getElementById('profileInfo')) {
        loadProfile();
    }
});
