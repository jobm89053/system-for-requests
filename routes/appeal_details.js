const express = require('express');
const { Request } = require('../models');
const router = express.Router();

// Получить обращение по ID
router.get('/:id', async (req, res) => {
  try {
    const appealId = parseInt(req.params.id, 10); // Получаем ID из параметров URL

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

    // Отправка данных обращения в шаблон
    res.render('appeal_detail', { appeal });
  } catch (error) {
    console.error('Ошибка при получении данных обращения:', error);
    res.status(500).render('500', { title: 'Ошибка сервера' });
  }
});

module.exports = router;