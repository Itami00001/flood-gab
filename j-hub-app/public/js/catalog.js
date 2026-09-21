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
                    <button onclick="viewCar(${car.id})">Подробнее</button>
                    <button onclick="quickBuy(${car.id})">Купить</button>
                </div>
            `;
            carGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading cars:', error);
    }
}

function applyFilters() {
    const brand = document.getElementById('brandFilter').value;
    const status = document.getElementById('statusFilter').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

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

function buyCar() {
    alert('Функция покупки в разработке');
}

function rentCar() {
    alert('Функция аренды в разработке');
}

function testDrive() {
    alert('Функция тест-драйва в разработке');
}

function quickBuy(id) {
    alert('Функция быстрой покупки в разработке');
}

async function searchAvailable() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Пожалуйста, выберите даты');
        return;
    }

    try {
        const cars = await getAvailableCars(startDate, endDate);
        const availableCars = document.getElementById('availableCars');
        availableCars.innerHTML = '';

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
                    <button onclick="rentThisCar(${car.id}, '${startDate}', '${endDate}')">Арендовать</button>
                </div>
            `;
            availableCars.appendChild(card);
        });
    } catch (error) {
        console.error('Error searching available cars:', error);
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('carGrid')) {
        loadCars();
    }
});
