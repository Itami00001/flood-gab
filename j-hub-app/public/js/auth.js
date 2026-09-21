let currentUser = null;

function setCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    updateAuthUI();
    updateBalanceDisplay();
}

function getCurrentUser() {
    const stored = localStorage.getItem('user');
    if (stored) {
        currentUser = JSON.parse(stored);
    }
    return currentUser;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateAuthUI();
    window.location.href = 'index.html';
}

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

function quickLogin(username, password) {
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
}

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
    `;

    try {
        // Here you would need to get the customer ID from the user data
        // For now, we'll assume it's available
        const customerId = 1; // This should come from the user data

        const sales = await getCustomerSales(customerId);
        const rentals = await getCustomerRentals(customerId);
        const testDrives = await getCustomerTestDrives(customerId);

        document.getElementById('mySales').innerHTML = sales.length > 0 ?
            sales.map(sale => `<p>${sale.car?.brand} ${sale.car?.model} - ${formatPrice(sale.total_price)} ₽</p>`).join('') :
            '<p>Нет покупок</p>';

        document.getElementById('myRentals').innerHTML = rentals.length > 0 ?
            rentals.map(rental => `<p>${rental.car?.brand} ${rental.car?.model} - ${new Date(rental.start_date).toLocaleDateString()}</p>`).join('') :
            '<p>Нет аренд</p>';

        document.getElementById('myTestDrives').innerHTML = testDrives.length > 0 ?
            testDrives.map(td => `<p>${td.brand} ${td.model} - ${new Date(td.date).toLocaleDateString()}</p>`).join('') :
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
