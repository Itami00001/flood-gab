let activeTab = 'users';
let refreshInterval = null;

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tabName}Tab`).classList.add('active');
    event.target.classList.add('active');

    activeTab = tabName;
    loadTabData(tabName);
    
    // Restart auto-refresh for new active tab
    startAutoRefresh();
}

function startAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    // FIX-14: Автообновление активной вкладки каждые 15 секунд, проверено 2026-09-22
    refreshInterval = setInterval(() => {
        loadTabData(activeTab);
    }, 15000);
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
        case 'logs':
            loadLogs();
            break;
    }
}

async function loadUsers() {
    // FIX-5: Вкладка Пользователи с балансом и пополнением, сделано, проверено 2026-09-21
    try {
        const users = await getUsers();
        const customers = await getCustomers();
        
        const usersTable = document.getElementById('usersTable');
        let html = `<button onclick="loadUsers()" style="margin-bottom: 1rem; padding: 0.5rem 1rem; background-color: #c8102e; color: #fffcd0; border: none; border-radius: 4px; cursor: pointer;">Обновить</button>`;
        
        html += `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Full Name</th>
                        <th>Role</th>
                        <th>Balance</th>
                        <th>Topup</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        users.forEach((user, index) => {
            const customer = customers.find(c => c.user_id === user.id);
            const balance = customer ? customer.balance : 0;
            const customerId = customer ? customer.id : null;
            
            html += `
                <tr class="${index % 2 === 0 ? 'even-row' : ''}">
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.full_name}</td>
                    <td>${user.role}</td>
                    <td>${formatPrice(balance)} ₽</td>
                    <td>
                        ${customerId ? `
                            <input type="number" id="topup-${customerId}" placeholder="Сумма" style="width: 80px; padding: 0.25rem; margin-right: 0.5rem;">
                            <button onclick="topupBalance(${customerId})" style="padding: 0.25rem 0.5rem; background-color: #c8102e; color: #fffcd0; border: none; border-radius: 4px; cursor: pointer;">Пополнить</button>
                        ` : '-'}
                    </td>
                </tr>
            `;
        });
        
        html += `</tbody></table>`;
        usersTable.innerHTML = html;
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function topupBalance(customerId) {
    const amountInput = document.getElementById(`topup-${customerId}`);
    const amount = parseFloat(amountInput.value);
    
    if (!amount || amount <= 0) {
        showToast('Введите корректную сумму', 'error');
        return;
    }
    
    try {
        await topupUserBalance(customerId, amount);
        showToast('Баланс успешно пополнен!', 'success');
        loadUsers();
    } catch (error) {
        console.error('Error topping up balance:', error);
        showToast('Ошибка при пополнении баланса', 'error');
    }
}

async function loadCars() {
    // FIX-5: Вкладка Авто с кнопкой обновления и подсветкой чётных строк, сделано, проверено 2026-09-21
    try {
        const cars = await getCarStats();
        const carsTable = document.getElementById('carsTable');
        let html = `<button onclick="loadCars()" style="margin-bottom: 1rem; padding: 0.5rem 1rem; background-color: #c8102e; color: #fffcd0; border: none; border-radius: 4px; cursor: pointer;">Обновить</button>`;
        
        html += `
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
                    ${cars.map((car, index) => `
                        <tr class="${index % 2 === 0 ? 'even-row' : ''}">
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
        carsTable.innerHTML = html;
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

async function loadSales() {
    // FIX-5: Вкладка Продажи с кнопкой обновления и подсветкой чётных строк, сделано, проверено 2026-09-21
    try {
        const sales = await getSales();
        const salesTable = document.getElementById('salesTable');
        let html = `<button onclick="loadSales()" style="margin-bottom: 1rem; padding: 0.5rem 1rem; background-color: #c8102e; color: #fffcd0; border: none; border-radius: 4px; cursor: pointer;">Обновить</button>`;
        
        html += `
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
                    ${sales.map((sale, index) => `
                        <tr class="${index % 2 === 0 ? 'even-row' : ''}">
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
        salesTable.innerHTML = html;
    } catch (error) {
        console.error('Error loading sales:', error);
    }
}

async function loadRentals() {
    // FIX-11: Полная таблица аренд со связями, проверено 2026-09-21
    try {
        const rentals = await getRentals();
        const rentalsTable = document.getElementById('rentalsTable');
        let html = `<button onclick="loadRentals()" style="margin-bottom: 1rem; padding: 0.5rem 1rem; background-color: #c8102e; color: #fffcd0; border: none; border-radius: 4px; cursor: pointer;">Обновить</button>`;
        
        html += `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Авто</th>
                        <th>Клиент</th>
                        <th>Менеджер</th>
                        <th>Дата начала</th>
                        <th>Дата конца</th>
                        <th>Стоимость</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    ${rentals.map((rental, index) => `
                        <tr class="${index % 2 === 0 ? 'even-row' : ''}">
                            <td>${rental.id}</td>
                            <td>${rental.car?.brand} ${rental.car?.model}</td>
                            <td>${rental.customer?.user?.full_name || 'N/A'}</td>
                            <td>${rental.employee?.user?.full_name || 'N/A'}</td>
                            <td>${new Date(rental.start_date).toLocaleDateString()}</td>
                            <td>${new Date(rental.end_date).toLocaleDateString()}</td>
                            <td>${formatPrice(rental.total_price)} ₽</td>
                            <td><span class="status ${rental.status}">${translateStatus(rental.status)}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        rentalsTable.innerHTML = html;
    } catch (error) {
        console.error('Error loading rentals:', error);
    }
}

async function loadTestDrives() {
    // FIX-11: Полная таблица тест-драйвов со связями, проверено 2026-09-21
    try {
        const testDrives = await getTestDrives();
        const testdrivesTable = document.getElementById('testdrivesTable');
        let html = `<button onclick="loadTestDrives()" style="margin-bottom: 1rem; padding: 0.5rem 1rem; background-color: #c8102e; color: #fffcd0; border: none; border-radius: 4px; cursor: pointer;">Обновить</button>`;
        
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Клиент</th>
                        <th>Авто</th>
                        <th>Менеджер</th>
                        <th>Дата</th>
                        <th>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    ${testDrives.map((td, index) => `
                        <tr class="${index % 2 === 0 ? 'even-row' : ''}">
                            <td>${td.customer?.user?.full_name || 'N/A'}</td>
                            <td>${td.car?.brand} ${td.car?.model}</td>
                            <td>${td.employee?.user?.full_name || 'N/A'}</td>
                            <td>${new Date(td.date).toLocaleString()}</td>
                            <td><span class="status ${td.status}">${translateStatus(td.status)}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        testdrivesTable.innerHTML = html;
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

// FIX-12: Вкладка Логи с фильтром по уровню, проверено 2026-09-21
async function loadLogs() {
    try {
        const levelFilter = document.getElementById('logLevelFilter')?.value || '';
        const logs = await getLogs(levelFilter);
        const logsTable = document.getElementById('logsTable');
        
        let html = `<button onclick="loadLogs()" style="margin-bottom: 1rem; padding: 0.5rem 1rem; background-color: #c8102e; color: #fffcd0; border: none; border-radius: 4px; cursor: pointer;">Обновить</button>`;
        
        html += `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Уровень</th>
                        <th>Action</th>
                        <th>Сущность</th>
                        <th>ID сущности</th>
                        <th>User ID</th>
                        <th>Сообщение</th>
                        <th>Дата</th>
                    </tr>
                </thead>
                <tbody>
                    ${logs.map((log, index) => `
                        <tr class="${index % 2 === 0 ? 'even-row' : ''}">
                            <td>${log.id}</td>
                            <td><span class="status ${log.level}">${log.level.toUpperCase()}</span></td>
                            <td>${log.action}</td>
                            <td>${log.entity}</td>
                            <td>${log.entity_id || '-'}</td>
                            <td>${log.user_id || '-'}</td>
                            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${log.message || '-'}</td>
                            <td>${new Date(log.created_at).toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        logsTable.innerHTML = html;
    } catch (error) {
        console.error('Error loading logs:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTabData('users');
    startAutoRefresh();
});
