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
