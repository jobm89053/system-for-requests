const express = require('express');
const router = express.Router();
const { Request } = require('../models'); // Импортируем модель Sequelize
const { Op } = require('sequelize');

// Получить все обращения с фильтрацией и пагинацией
router.get('/all_appeal', async (req, res, next) => {
  try {
    const { date, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Проверка на валидность параметров пагинации
    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ error: 'Некорректные параметры пагинации' });
    }

    // Условия для фильтрации
    const whereClause = {};

    if (date) {
      whereClause.createdAt = {
        [Op.like]: `%${date}%`, // Фильтрация по конкретной дате
      };
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59')], // Фильтрация по диапазону дат
      };
    }

    // Получаем обращения с учётом фильтрации и пагинации
    const { rows: appeals, count } = await Request.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'topic', 'text', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Отправляем данные в представление
    res.render('all_appeal', {
      title: 'system-for-handling-requests',
      appeals,
      currentDate: date || '',
      currentStartDate: startDate || '',
      currentEndDate: endDate || '',
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Взять обращение в работу
router.post('/appeal_solution/:appeal_id/take_to_work', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;

    // Обновляем статус обращения на "В работе"
    await Request.update(
      { status: 'В работе' },
      { where: { id: appealId } }
    );

    res.redirect(`/appeal_solution/${appealId}`);
  } catch (err) {
    console.error('Ошибка при взятии обращения в работу:', err);
    next(err);
  }
});

// Завершить обращение
router.post('/appeal_solution/:appeal_id/complete', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;
    const { solution } = req.body;
    

    // Обновляем статус обращения на "Завершено" и добавляем решение
    await Request.update(
      { status: 'Завершено', solution },
      { where: { id: appealId } }
    );

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при завершении обращения:', err);
    next(err);
  }
});

// Отменить обращение
router.post('/appeal_solution/:appeal_id/cancel', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;
    const { cancellationReason } = req.body;

    // Обновляем статус обращения на "Отменено" и добавляем причину отмены
    await Request.update(
      { status: 'Отменено', cancellationReason },
      { where: { id: appealId } }
    );

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при отмене обращения:', err);
    next(err);
  }
});

// Отменить все обращения в статусе "В работе"
router.post('/cancel_all_in_progress', async (req, res, next) => {
  try {
    // Обновляем статус всех обращений в статусе "В работе" на "Отменено"
    await Request.update(
      { status: 'Отменено', cancellationReason: 'Массовая отмена' },
      { where: { status: 'В работе' } }
    );

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при отмене обращений:', err);
    next(err);
  }
});

// Получить одно обращение по ID
router.get('/appeal_detail/:appeal_id', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;

    // Ищем обращение по ID
    const appeal = await Request.findByPk(appealId);

    if (appeal) {
      res.render('appeal_detail', {
        title: 'Детали обращения',
        appeal,
      });
    } else {
      res.status(404).send('Обращение не найдено');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;