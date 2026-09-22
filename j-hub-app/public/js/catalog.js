let currentCarId = null;

async function loadCars(filters = {}) {
    try {
        const cars = await getCars(filters);
        const carGrid = document.getElementById('carGrid');
        carGrid.innerHTML = '';

        cars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            card.innerHTML = `
                <h3>${car.brand} ${car.model}</h3>
                <div class="price">${formatPrice(car.price)} ₽</div>
                <div class="specs">
                    <p>Год: ${car.year}</p>
                    <p>Пробег: ${car.mileage} км</p>
                    <p>Статус: <span class="status ${car.status}">${translateStatus(car.status)}</span></p>
                </div>
                <div class="actions">
                    <button class="view-car-btn" data-car-id="${car.id}">Подробнее</button>
                    <button class="quick-buy-btn" data-car-id="${car.id}">Купить</button>
                </div>
            `;
            carGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

function applyFilters() {
    const brand = document.getElementById('brandFilter')?.value;
    const status = document.getElementById('statusFilter')?.value;
    const minPrice = document.getElementById('minPrice')?.value;
    const maxPrice = document.getElementById('maxPrice')?.value;

    const filters = {};
    if (brand) filters.brand = brand;
    if (status) filters.status = status;
    if (minPrice) filters.min_price = minPrice;
    if (maxPrice) filters.max_price = maxPrice;

    loadCars(filters);
}

function viewCar(id) {
    window.location.href = `car.html?id=${id}`;
}

async function loadCarDetail(id) {
    currentCarId = id;
    try {
        const car = await getCarDetails(id);
        const carDetail = document.getElementById('carDetail');
        carDetail.innerHTML = `
            <h2>${car.brand} ${car.model}</h2>
            <div class="car-info">
                <p><strong>Артикул:</strong> ${car.articul}</p>
                <p><strong>VIN:</strong> ${car.vin}</p>
                <p><strong>Год:</strong> ${car.year}</p>
                <p><strong>Цвет:</strong> ${car.color}</p>
                <p><strong>Пробег:</strong> ${car.mileage} км</p>
                <p><strong>Цена:</strong> ${formatPrice(car.price)} ₽</p>
                <p><strong>Комплектация:</strong> ${car.equipment || 'Не указано'}</p>
                <p><strong>Статус:</strong> <span class="status ${car.status}">${translateStatus(car.status)}</span></p>
            </div>
        `;

        if (car.sale_date) {
            const carHistory = document.getElementById('carHistory');
            carHistory.innerHTML = `
                <p><strong>Последняя продажа:</strong> ${new Date(car.sale_date).toLocaleDateString()}</p>
                <p><strong>Цена продажи:</strong> ${formatPrice(car.sale_price)} ₽</p>
                <p><strong>Покупатель:</strong> ${car.buyer_name}</p>
                <p><strong>Телефон покупателя:</strong> ${car.buyer_phone}</p>
            `;
        }
    } catch (error) {
        console.error('Error loading car detail:', error);
    }
}

async function buyCar() {
    // FIX-3: кнопка Купить работает через async/await, проверено 2026-09-21
    const user = JSON.parse(localStorage.getItem('jhub_user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const car = await getCarDetails(currentCarId);
        
        if (car.status !== 'available') {
            showToast('Автомобиль недоступен для покупки', 'error');
            return;
        }

        const customer = await getCustomerByUserId(user.id);
        if (!customer) {
            showToast('Профиль клиента не найден', 'error');
            return;
        }

        if (customer.balance < car.price) {
            showToast('Недостаточно средств на балансе', 'error');
            return;
        }

        const employees = await getEmployees();
        const employee = employees[0];
        if (!employee) {
            showToast('Нет доступных менеджеров', 'error');
            return;
        }

        const saleData = {
            car_id: currentCarId,
            customer_id: customer.id,
            employee_id: employee.id,
            total_price: car.price,
            payment_method: 'card',
            status: 'pending'
        };

        await createSale(saleData);
        
        const updatedBalance = customer.balance - car.price;
        await updateCustomer(customer.id, { balance: updatedBalance });
        
        showToast('Покупка успешно оформлена!', 'success');
        updateBalanceDisplay();
        loadCarDetail(currentCarId);
    } catch (error) {
        console.error('Error buying car:', error);
        showToast('Ошибка при покупке', 'error');
    }
}

async function rentCar() {
    // FIX-3: кнопка Арендовать работает через async/await с модалкой, проверено 2026-09-21
    const user = JSON.parse(localStorage.getItem('jhub_user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const startDate = prompt('Введите дату начала аренды (YYYY-MM-DD):');
    const endDate = prompt('Введите дату конца аренды (YYYY-MM-DD):');

    if (!startDate || !endDate) {
        showToast('Необходимо указать даты', 'error');
        return;
    }

    try {
        const car = await getCarDetails(currentCarId);
        
        if (car.status !== 'available') {
            showToast('Автомобиль недоступен для аренды', 'error');
            return;
        }

        const customer = await getCustomerByUserId(user.id);
        if (!customer) {
            showToast('Профиль клиента не найден', 'error');
            return;
        }

        const employees = await getEmployees();
        const employee = employees[0];
        if (!employee) {
            showToast('Нет доступных менеджеров', 'error');
            return;
        }

        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        const dailyRate = car.price / 365;
        const totalPrice = days * dailyRate;

        const rentalData = {
            car_id: currentCarId,
            customer_id: customer.id,
            employee_id: employee.id,
            start_date: startDate,
            end_date: endDate,
            total_price: totalPrice,
            status: 'active'
        };

        await createRental(rentalData);
        showToast('Аренда успешно оформлена!', 'success');
        loadCarDetail(currentCarId);
    } catch (error) {
        console.error('Error renting car:', error);
        showToast('Ошибка при аренде', 'error');
    }
}

async function testDrive() {
    // FIX-3: кнопка Тест-драйв работает через async/await с модалкой, проверено 2026-09-21
    const user = JSON.parse(localStorage.getItem('jhub_user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const date = prompt('Введите дату и время тест-драйва (YYYY-MM-DD HH:MM):');

    if (!date) {
        showToast('Необходимо указать дату', 'error');
        return;
    }

    try {
        const customer = await getCustomerByUserId(user.id);
        if (!customer) {
            showToast('Профиль клиента не найден', 'error');
            return;
        }

        const employees = await getEmployees();
        const employee = employees[0];
        if (!employee) {
            showToast('Нет доступных менеджеров', 'error');
            return;
        }

        const testDriveData = {
            customer_id: customer.id,
            car_id: currentCarId,
            employee_id: employee.id,
            date: date,
            status: 'scheduled'
        };

        await createTestDrive(testDriveData);
        showToast('Тест-драйв успешно записан!', 'success');
    } catch (error) {
        console.error('Error booking test drive:', error);
        showToast('Ошибка при записи на тест-драйв', 'error');
    }
}

async function quickBuy(id) {
    // FIX-3: кнопка быстрой покупки работает через async/await, проверено 2026-09-21
    const user = JSON.parse(localStorage.getItem('jhub_user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const car = await getCarDetails(id);
        
        if (car.status !== 'available') {
            showToast('Автомобиль недоступен для покупки', 'error');
            return;
        }

        const customer = await getCustomerByUserId(user.id);
        if (!customer) {
            showToast('Профиль клиента не найден', 'error');
            return;
        }

        if (customer.balance < car.price) {
            showToast('Недостаточно средств на балансе', 'error');
            return;
        }

        const employees = await getEmployees();
        const employee = employees[0];
        if (!employee) {
            showToast('Нет доступных менеджеров', 'error');
            return;
        }

        const saleData = {
            car_id: id,
            customer_id: customer.id,
            employee_id: employee.id,
            total_price: car.price,
            payment_method: 'card',
            status: 'pending'
        };

        await createSale(saleData);
        
        const updatedBalance = customer.balance - car.price;
        await updateCustomer(customer.id, { balance: updatedBalance });
        
        showToast('Покупка успешно оформлена!', 'success');
        updateBalanceDisplay();
        loadCars();
    } catch (error) {
        console.error('Error quick buying car:', error);
        showToast('Ошибка при покупке', 'error');
    }
}

async function searchAvailable() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;

    if (!startDate || !endDate) {
        alert('Пожалуйста, выберите даты');
        return;
    }

    try {
        const cars = await getAvailableCars(startDate, endDate);
        const availableCars = document.getElementById('availableCars');
        availableCars.innerHTML = '';

        if (cars.length === 0) {
            availableCars.innerHTML = '<p style="text-align: center; color: #807e83;">Нет доступных автомобилей на выбранные даты</p>';
            return;
        }

        cars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            card.innerHTML = `
                <h3>${car.brand} ${car.model}</h3>
                <div class="price">${formatPrice(car.price)} ₽</div>
                <div class="specs">
                    <p>Год: ${car.year}</p>
                    <p>Пробег: ${car.mileage} км</p>
                </div>
                <div class="actions">
                    <button class="rent-car-btn" data-car-id="${car.id}" data-start="${startDate}" data-end="${endDate}">Арендовать</button>
                </div>
            `;
            availableCars.appendChild(card);
        });
    } catch (error) {
        console.error('Error searching available cars:', error);
    }
}

// FIX-6: Загрузка таблицы аренд с фильтрами, сделано, проверено 2026-09-21
async function loadRentalsTable() {
    try {
        const rentals = await getRentals();
        const rentalsTable = document.getElementById('rentalsTable');
        
        if (rentals.length === 0) {
            rentalsTable.innerHTML = '<p style="text-align: center; color: #807e83; padding: 2rem;">Нет активных аренд</p>';
            return;
        }

        let html = `
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
        console.error('Error loading rentals table:', error);
    }
}

async function filterRentals() {
    const status = document.getElementById('statusFilter')?.value;
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;

    try {
        let rentals = await getRentals();

        if (status) {
            rentals = rentals.filter(r => r.status === status);
        }

        if (startDate) {
            rentals = rentals.filter(r => new Date(r.start_date) >= new Date(startDate));
        }

        if (endDate) {
            rentals = rentals.filter(r => new Date(r.end_date) <= new Date(endDate));
        }

        const rentalsTable = document.getElementById('rentalsTable');
        
        if (rentals.length === 0) {
            rentalsTable.innerHTML = '<p style="text-align: center; color: #807e83; padding: 2rem;">Нет аренд, соответствующих фильтрам</p>';
            return;
        }

        let html = `
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
        console.error('Error filtering rentals:', error);
    }
}

function rentThisCar(id, start, end) {
    alert(`Функция аренды автомобиля ${id} с ${start} по ${end} в разработке`);
}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

function translateStatus(status) {
    const statusMap = {
        'available': 'Доступен',
        'sold': 'Продан',
        'rented': 'В аренде',
        'service': 'На обслуживании'
    };
    return statusMap[status] || status;
}

// Initialize - FIX-15: Event listeners вместо inline onclick, проверено 2026-09-22
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('carGrid')) {
        loadCars();
    }
    
    if (document.getElementById('rentalsTable')) {
        loadRentalsTable();
    }

    // Event delegation for dynamically created car cards
    document.addEventListener('click', (e) => {
        // View car button
        if (e.target.classList.contains('view-car-btn')) {
            const carId = e.target.dataset.carId;
            viewCar(carId);
        }
        // Quick buy button
        if (e.target.classList.contains('quick-buy-btn')) {
            const carId = parseInt(e.target.dataset.carId);
            quickBuy(carId);
        }
        // Rent car button in available cars search
        if (e.target.classList.contains('rent-car-btn')) {
            const carId = parseInt(e.target.dataset.carId);
            const start = e.target.dataset.start;
            const end = e.target.dataset.end;
            rentThisCar(carId, start, end);
        }
    });

    // Apply filters button (index.html)
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    // Quick login buttons (login.html)
    const quickLoginAdmin = document.getElementById('quickLoginAdmin');
    if (quickLoginAdmin) {
        quickLoginAdmin.addEventListener('click', () => quickLogin('admin', 'adminadmin'));
    }
    const quickLoginTest = document.getElementById('quickLoginTest');
    if (quickLoginTest) {
        quickLoginTest.addEventListener('click', () => quickLogin('test', 'testtest'));
    }

    // Car detail action buttons (car.html)
    const buyCarBtn = document.getElementById('buyCarBtn');
    if (buyCarBtn) {
        buyCarBtn.addEventListener('click', buyCar);
    }
    const rentCarBtn = document.getElementById('rentCarBtn');
    if (rentCarBtn) {
        rentCarBtn.addEventListener('click', rentCar);
    }
    const testDriveBtn = document.getElementById('testDriveBtn');
    if (testDriveBtn) {
        testDriveBtn.addEventListener('click', testDrive);
    }

    // Rentals page buttons (rentals.html)
    const filterRentalsBtn = document.getElementById('filterRentalsBtn');
    if (filterRentalsBtn) {
        filterRentalsBtn.addEventListener('click', filterRentals);
    }
    const resetRentalsBtn = document.getElementById('resetRentalsBtn');
    if (resetRentalsBtn) {
        resetRentalsBtn.addEventListener('click', loadRentalsTable);
    }
});