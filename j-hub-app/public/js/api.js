const API_BASE = 'http://localhost:6868/api';

async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Cars API
async function getCars(filters = {}) {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/cars?${params}`);
}

async function getCar(id) {
    return fetchAPI(`/cars/${id}`);
}

async function getCarDetails(id) {
    return fetchAPI(`/cars/${id}/details`);
}

// Users API
async function login(username, password) {
    return fetchAPI('/users/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}

async function register(userData) {
    return fetchAPI('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

// Sales API
async function createSale(saleData) {
    return fetchAPI('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
    });
}

async function getSales() {
    return fetchAPI('/sales');
}

// Rentals API
async function createRental(rentalData) {
    return fetchAPI('/rentals', {
        method: 'POST',
        body: JSON.stringify(rentalData),
    });
}

async function getRentals() {
    return fetchAPI('/rentals');
}

async function getAvailableCars(start, end) {
    return fetchAPI(`/rentals/available?start=${start}&end=${end}`);
}

// Test Drives API
async function createTestDrive(testDriveData) {
    return fetchAPI('/testdrives', {
        method: 'POST',
        body: JSON.stringify(testDriveData),
    });
}

async function getTestDrives() {
    return fetchAPI('/testdrives');
}

// Admin API
async function getAdminStats() {
    return fetchAPI('/admin/statistics/overview');
}

async function getUserBalances() {
    return fetchAPI('/admin/users/balances');
}

async function getCarStats() {
    return fetchAPI('/admin/cars/stats');
}

async function topupUserBalance(customerId, amount) {
    return fetchAPI(`/admin/users/${customerId}/topup`, {
        method: 'PUT',
        body: JSON.stringify({ amount }),
    });
}

async function getUsers() {
    return fetchAPI('/users');
}

async function getCustomers() {
    return fetchAPI('/customers');
}

async function getRentals() {
    return fetchAPI('/rentals');
}

// Customers API
async function getCustomerSales(customerId) {
    return fetchAPI(`/customers/${customerId}/sales`);
}

async function getCustomerRentals(customerId) {
    return fetchAPI(`/customers/${customerId}/rentals`);
}

async function getCustomerTestDrives(customerId) {
    return fetchAPI(`/customers/${customerId}/testdrives`);
}

// Additional API functions for FIX-3
async function getCustomerByUserId(userId) {
    const customers = await fetchAPI('/customers');
    return customers.find(c => c.user_id === userId);
}

async function getEmployees() {
    return fetchAPI('/employees');
}

async function updateCustomer(customerId, data) {
    return fetchAPI(`/customers/${customerId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${type === 'error' ? '#c8102e' : type === 'success' ? '#2d6a4f' : '#403d3e'};
        color: #fffcd0;
        border-radius: 4px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Balance display update function
async function updateBalanceDisplay() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    
    try {
        const customer = await getCustomerByUserId(user.id);
        if (customer) {
            const balanceDisplay = document.getElementById('balanceDisplay');
            if (balanceDisplay) {
                balanceDisplay.textContent = `Баланс: ${formatPrice(customer.balance)} COIN`;
                balanceDisplay.style.display = 'inline';
            }
        }
    } catch (error) {
        console.error('Error updating balance display:', error);
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}
