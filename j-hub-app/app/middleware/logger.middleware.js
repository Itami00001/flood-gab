// FIX-12: Middleware для логирования мутирующих операций, проверено 2026-09-23
const db = require("../models");
const Log = db.log;

const loggerMiddleware = async (req, res, next) => {
  // Логируем только мутирующие операции
  if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
    return next();
  }

  // Пропускаем логирование для endpoints аутентификации
  if (req.path.includes('/login') || req.path.includes('/register')) {
    return next();
  }

  // Получаем user_id из токена/сессии, если доступно
  const userId = req.body?.user_id || req.headers['x-user-id'] || null;

  // Определяем сущность и action из пути
  // req.path будет в формате /testdrives, /sales, /cars, /rentals и т.д.
  const pathParts = req.path.split('/').filter(p => p);
  let entity = 'unknown';
  let action = req.method.toLowerCase();
  let entityId = null;

  if (pathParts.length >= 1) {
    // First part is the entity (e.g., testdrives, sales, cars, rentals, users, customers, employees)
    const entityMap = {
      'testdrives': 'testdrive',
      'sales': 'sale',
      'cars': 'car',
      'rentals': 'rental',
      'users': 'user',
      'customers': 'customer',
      'employees': 'employee',
      'admin': 'admin'
    };
    entity = entityMap[pathParts[0]] || pathParts[0].replace('s', '');
    
    // Check if second part is an ID
    if (pathParts.length >= 2 && !isNaN(pathParts[1])) {
      entityId = parseInt(pathParts[1]);
    }
  }

  // Сохраняем оригинальный res.json для перехвата ответа
  const originalJson = res.json.bind(res);
  
  res.json = function(data) {
    // Логируем после отправки ответа
    const level = res.statusCode >= 400 ? 'error' : res.statusCode >= 300 ? 'warn' : 'info';
    const message = `${req.method} ${req.path} - Status: ${res.statusCode}`;
    
    Log.create({
      level,
      action,
      entity,
      entity_id: entityId,
      user_id: userId,
      message: `${message}\nRequest Body: ${JSON.stringify(req.body)}\nResponse: ${JSON.stringify(data)}`,
      created_at: new Date() // Explicitly set created_at
    }).catch(err => console.error('Logger error:', err));

    return originalJson(data);
  };

  next();
};

module.exports = loggerMiddleware;