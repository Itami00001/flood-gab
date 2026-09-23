require('dotenv').config();
const db = require("../models");
const bcrypt = require("bcryptjs");

const seed = async () => {
  try {
    console.log("Starting seed...");

    await db.sequelize.sync({ force: true });
    console.log("Database synced.");

    const passwordAdmin = bcrypt.hashSync("adminadmin", 10);
    const passwordTest = bcrypt.hashSync("testtest", 10);

    const adminUser = await db.user.create({
      username: "admin",
      password_hash: passwordAdmin,
      email: "admin@jhub.com",
      full_name: "Admin User",
      role: "admin"
    });

    const testUser = await db.user.create({
      username: "test",
      password_hash: passwordTest,
      email: "test@jhub.com",
      full_name: "Test Client",
      role: "client"
    });

    const employee = await db.employee.create({
      user_id: adminUser.id,
      position: "Manager",
      phone: "+79001234567"
    });

    const customer = await db.customer.create({
      user_id: testUser.id,
      phone: "+79007654321",
      address: "Test Address 123",
      passport_data: "1234 567890",
      balance: 7000000
    });

    const cars = [
      {
        articul: "TOY001",
        brand: "Toyota",
        model: "Camry",
        year: 2022,
        color: "White",
        mileage: 15000,
        price: 2500000,
        status: "available",
        equipment: "Premium package",
        photo_url: "",
        vin: "JTDKN3DU5A000001"
      },
      {
        articul: "NIS001",
        brand: "Nissan",
        model: "Altima",
        year: 2021,
        color: "Black",
        mileage: 25000,
        price: 2200000,
        status: "available",
        equipment: "Sport package",
        photo_url: "",
        vin: "1N4AL3AP4DN000001"
      },
      {
        articul: "HON001",
        brand: "Honda",
        model: "Accord",
        year: 2023,
        color: "Silver",
        mileage: 5000,
        price: 2800000,
        status: "available",
        equipment: "Luxury package",
        photo_url: "",
        vin: "1HGCM82633A000001"
      },
      {
        articul: "MAZ001",
        brand: "Mazda",
        model: "CX-5",
        year: 2022,
        color: "Red",
        mileage: 20000,
        price: 2400000,
        status: "available",
        equipment: "Signature package",
        photo_url: "",
        vin: "JM3KFBCM3K0000001"
      },
      {
        articul: "MIT001",
        brand: "Mitsubishi",
        model: "Outlander",
        year: 2021,
        color: "Blue",
        mileage: 35000,
        price: 2100000,
        status: "available",
        equipment: "SE package",
        photo_url: "",
        vin: "JA4J2AAS5MU000001"
      },
      {
        articul: "SUB001",
        brand: "Subaru",
        model: "Forester",
        year: 2022,
        color: "Green",
        mileage: 18000,
        price: 2600000,
        status: "available",
        equipment: "Touring package",
        photo_url: "",
        vin: "JF2SJABC6NH000001"
      },
      {
        articul: "LEX001",
        brand: "Lexus",
        model: "ES 350",
        year: 2023,
        color: "Pearl White",
        mileage: 8000,
        price: 3500000,
        status: "available",
        equipment: "Ultra Luxury package",
        photo_url: "",
        vin: "JTHBZ1BL2G5000001"
      },
      {
        articul: "INF001",
        brand: "Infiniti",
        model: "Q50",
        year: 2021,
        color: "Black",
        mileage: 30000,
        price: 2900000,
        status: "available",
        equipment: "Red Sport 400",
        photo_url: "",
        vin: "JN1EV1AR5FM000001"
      },
      {
        articul: "ACU001",
        brand: "Acura",
        model: "RDX",
        year: 2022,
        color: "Gray",
        mileage: 22000,
        price: 2700000,
        status: "available",
        equipment: "A-Spec package",
        photo_url: "",
        vin: "5J8TC2H36ML000001"
      },
      {
        articul: "TOY002",
        brand: "Toyota",
        model: "RAV4",
        year: 2023,
        color: "Bronze",
        mileage: 10000,
        price: 3000000,
        status: "available",
        equipment: "Limited package",
        photo_url: "",
        vin: "2T3BF1DV5PW000001"
      }
    ];

    const createdCars = await db.car.bulkCreate(cars);
    console.log("Cars created:", createdCars.length);

    const sale1 = await db.sale.create({
      car_id: createdCars[0].id,
      customer_id: customer.id,
      employee_id: employee.id,
      total_price: 2500000,
      payment_method: "card",
      status: "completed"
    });

    const sale2 = await db.sale.create({
      car_id: createdCars[1].id,
      customer_id: customer.id,
      employee_id: employee.id,
      total_price: 2200000,
      payment_method: "credit",
      status: "completed"
    });

    const sale3 = await db.sale.create({
      car_id: createdCars[2].id,
      customer_id: customer.id,
      employee_id: employee.id,
      total_price: 2800000,
      payment_method: "cash",
      status: "pending"
    });

    console.log("Sales created:", 3);

    const rental1 = await db.rental.create({
      car_id: createdCars[3].id,
      customer_id: customer.id,
      employee_id: employee.id,
      start_date: new Date('2026-01-01'),
      end_date: new Date('2026-01-07'),
      total_price: 50000,
      status: "completed"
    });

    const rental2 = await db.rental.create({
      car_id: createdCars[4].id,
      customer_id: customer.id,
      employee_id: employee.id,
      start_date: new Date('2026-02-01'),
      end_date: new Date('2026-02-05'),
      total_price: 35000,
      status: "completed"
    });

    const rental3 = await db.rental.create({
      car_id: createdCars[5].id,
      customer_id: customer.id,
      employee_id: employee.id,
      start_date: new Date('2026-03-01'),
      end_date: new Date('2026-03-10'),
      total_price: 70000,
      status: "active"
    });

    console.log("Rentals created:", 3);

    const testDrive1 = await db.testDrive.create({
      customer_id: customer.id,
      car_id: createdCars[6].id,
      employee_id: employee.id,
      date: new Date('2024-01-15'),
      status: "done"
    });

    const testDrive2 = await db.testDrive.create({
      customer_id: customer.id,
      car_id: createdCars[7].id,
      employee_id: employee.id,
      date: new Date('2024-02-20'),
      status: "done"
    });

    const testDrive3 = await db.testDrive.create({
      customer_id: customer.id,
      car_id: createdCars[8].id,
      employee_id: employee.id,
      date: new Date('2024-03-25'),
      status: "scheduled"
    });

    const testDrive4 = await db.testDrive.create({
      customer_id: customer.id,
      car_id: createdCars[9].id,
      employee_id: employee.id,
      date: new Date('2024-04-10'),
      status: "scheduled"
    });

    console.log("Test drives created:", 4);

    // Синхронизировать статусы авто с созданными сделками (как делают контроллеры sale/rental):
    // завершённые продажи -> sold, активная аренда -> rented
    await db.car.update({ status: 'sold' }, { where: { id: [createdCars[0].id, createdCars[1].id] } });
    await db.car.update({ status: 'rented' }, { where: { id: createdCars[5].id } });
    console.log("Car statuses synced: 2 sold, 1 rented, rest available");

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error during seed:", error);
    process.exit(1);
  }
};

seed();
