const express = require('express');
const router = express.Router();
const { Request } = require('../models'); 

// Получить одно обращение по ID
router.get('/appeal_details/:appeal_id', async (req, res, next) => {
  try {
    const appealId = parseInt(req.params.appeal_id, 10);

    // Проверяем, является ли ID числом
    if (isNaN(appealId)) {
      console.error(`Некорректный ID обращения: ${req.params.appeal_id}`);
      return res.status(400).render('400', { title: 'Ошибка 400: Некорректный ID' });
    }

    // Ищем обращение по ID
    const appeal = await Request.findByPk(appealId);

    if (!appeal) {
      console.warn(`Обращение с ID ${appealId} не найдено`);
      return res.status(404).render('404', { title: 'Ошибка 404: Обращение не найдено' });
    }

    res.render('appeal_detail', {
      title: 'Детали обращения',
      appeal,
    });
  } catch (err) {
    console.error('Ошибка при получении обращения:', err);
    next(err);
  }
});

module.exports = router;
