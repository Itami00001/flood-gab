// FIX-12: Middleware для логирования мутирующих операций, проверено 2026-09-21
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
  // В данном случае user_id может быть в req.body или в заголовках
  const userId = req.body?.user_id || req.headers['x-user-id'] || null;

  // Определяем сущность и action из пути
  const pathParts = req.path.split('/').filter(p => p);
  let entity = 'unknown';
  let action = req.method.toLowerCase();
  let entityId = null;

  if (pathParts.length >= 2 && pathParts[0] === 'api') {
    entity = pathParts[1].replace('s', ''); // cars -> car, sales -> sale, etc.
    if (pathParts.length >= 3 && !isNaN(pathParts[2])) {
      entityId = parseInt(pathParts[2]);
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
      message: `${message}\nRequest Body: ${JSON.stringify(req.body)}\nResponse: ${JSON.stringify(data)}`
    }).catch(err => console.error('Logger error:', err));

    return originalJson(data);
  };

  next();
};

module.exports = loggerMiddleware;