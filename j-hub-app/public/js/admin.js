function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tabName}Tab`).classList.add('active');
    event.target.classList.add('active');

    loadTabData(tabName);
}

async function loadTabData(tabName) {
    switch(tabName) {
        case 'users':
            loadUsers();
            break;
        case 'cars':
            loadCars();
            break;
        case 'sales':
            loadSales();
            break;
        case 'rentals':
            loadRentals();
            break;
        case 'testdrives':
            loadTestDrives();
            break;
        case 'statistics':
            loadStatistics();
            break;
    }
}

async function loadUsers() {
    try {
        const users = await getUserBalances();
        const usersTable = document.getElementById('usersTable');
        usersTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Роль</th>
                        <th>Всего потрачено</th>
                        <th>Кол-во покупок</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.full_name}</td>
                            <td>${user.role}</td>
                            <td>${formatPrice(user.total_spent)} ₽</td>
                            <td>${user.sales_count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function loadCars() {
    try {
        const cars = await getCarStats();
        const carsTable = document.getElementById('carsTable');
        carsTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Авто</th>
                        <th>Статус</th>
                        <th>Цена</th>
                        <th>Продажи</th>
                        <th>Аренды</th>
                        <th>Тест-драйвы</th>
                    </tr>
                </thead>
                <tbody>
                    ${cars.map(car => `
                        <tr>
                            <td>${car.id}</td>
                            <td>${car.brand} ${car.model}</td>
                            <td><span class="status ${car.status}">${translateStatus(car.status)}</span></td>
                            <td>${formatPrice(car.price)} ₽</td>
                            <td>${car.sales_count}</td>
                            <td>${car.rentals_count}</td>
                            <td>${car.test_drive_count}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

async function loadSales() {
    try {
        const sales = await getSales();
        const salesTable = document.getElementById('salesTable');
        salesTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата</th>
                        <th>Цена</th>
                        <th>Способ оплаты</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    ${sales.map(sale => `
                        <tr>
                            <td>${sale.id}</td>
                            <td>${new Date(sale.sale_date).toLocaleDateString()}</td>
                            <td>${formatPrice(sale.total_price)} ₽</td>
                            <td>${sale.payment_method}</td>
                            <td><span class="status ${sale.status}">${translateStatus(sale.status)}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading sales:', error);
    }
}

async function loadRentals() {
    try {
        const rentals = await getRentals();
        const rentalsTable = document.getElementById('rentalsTable');
        rentalsTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Начало</th>
                        <th>Конец</th>
                        <th>Цена</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    ${rentals.map(rental => `
                        <tr>
                            <td>${rental.id}</td>
                            <td>${new Date(rental.start_date).toLocaleDateString()}</td>
                            <td>${new Date(rental.end_date).toLocaleDateString()}</td>
                            <td>${formatPrice(rental.total_price)} ₽</td>
                            <td><span class="status ${rental.status}">${translateStatus(rental.status)}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading rentals:', error);
    }
}

async function loadTestDrives() {
    try {
        const testDrives = await getTestDrives();
        const testdrivesTable = document.getElementById('testdrivesTable');
        testdrivesTable.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Клиент</th>
                        <th>Авто</th>
                        <th>Дата</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    ${testDrives.map(td => `
                        <tr>
                            <td>${td.customer?.user?.full_name || 'N/A'}</td>
                            <td>${td.car?.brand} ${td.car?.model}</td>
                            <td>${new Date(td.date).toLocaleDateString()}</td>
                            <td><span class="status ${td.status}">${translateStatus(td.status)}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading test drives:', error);
    }
}

async function loadStatistics() {
    try {
        const stats = await getAdminStats();
        const statisticsContent = document.getElementById('statisticsContent');
        statisticsContent.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Всего пользователей</h3>
                    <p class="stat-number">${stats.total_users}</p>
                </div>
                <div class="stat-card">
                    <h3>Всего авто</h3>
                    <p class="stat-number">${stats.total_cars}</p>
                </div>
                <div class="stat-card">
                    <h3>Завершённых продаж</h3>
                    <p class="stat-number">${stats.completed_sales}</p>
                </div>
                <div class="stat-card">
                    <h3>Завершённых аренд</h3>
                    <p class="stat-number">${stats.completed_rentals}</p>
                </div>
                <div class="stat-card">
                    <h3>Тест-драйвов</h3>
                    <p class="stat-number">${stats.completed_test_drives}</p>
                </div>
                <div class="stat-card">
                    <h3>Общая выручка</h3>
                    <p class="stat-number">${formatPrice(stats.total_revenue)} ₽</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

function translateStatus(status) {
    const statusMap = {
        'available': 'Доступен',
        'sold': 'Продан',
        'rented': 'В аренде',
        'service': 'На обслуживании',
        'pending': 'Ожидание',
        'completed': 'Завершено',
        'active': 'Активен',
        'cancelled': 'Отменено',
        'scheduled': 'Запланирован',
        'done': 'Выполнен'
    };
    return statusMap[status] || status;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTabData('users');
});
