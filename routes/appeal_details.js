// appeal_details.js
const express = require('express');
const router = express.Router();
const { Request } = require('../models');

// Получить обращение по ID с отформатированными датами
router.get('/:appeal_id', async (req, res, next) => {
  try {
    const appealId = parseInt(req.params.appeal_id, 10);

    // Проверка на валидность ID
    if (isNaN(appealId)) {
      return res.status(400).send('Неверный ID обращения');
    }

    // Поиск обращения по ID
    const appeal = await Request.findOne({ where: { id: appealId } });

    // Проверка, если обращение не найдено
    if (!appeal) {
      return res.status(404).send('Обращение не найдено');
    }

    // Форматируем даты для вывода в нужном формате (например, 'yyyy-mm-dd hh:mm:ss')
    const formattedCreatedAt = appeal.createdAt ? appeal.createdAt.toISOString().slice(0, 19).replace('T', ' ') : null;
    const formattedUpdatedAt = appeal.updatedAt ? appeal.updatedAt.toISOString().slice(0, 19).replace('T', ' ') : null;

    // Создаем новый объект для ответа с отформатированными датами
    const appealResponse = {
      ...appeal.toJSON(),  // Сначала берем все поля обращения
      createdAt: formattedCreatedAt,  // Добавляем отформатированную дату создания
      updatedAt: formattedUpdatedAt,  // Добавляем отформатированную дату обновления
    };

    // Отправка данных обращения в шаблон
    res.render('appeal_details', { appeal: appealResponse });
    
  } catch (err) {
    console.error('Ошибка при получении данных обращения:', err);
    next(err); // Передача ошибки в обработчик ошибок
  }
});

module.exports = router;