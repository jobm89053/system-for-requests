const express = require('express');
const router = express.Router();
const { Request } = require('../models'); // Подключаем модель Sequelize

// Форма создания обращения
router.get('/', function (req, res, next) {
  res.render('create_appeal', { title: 'Создать обращение' });
});

// Обработчик создания обращения
router.post('/', async function (req, res, next) {
  try {
    const { topic, text } = req.body;
    console.log('Данные формы:', { topic, text });

    // Проверка на наличие обязательных полей
    if (!topic || !text) {
      return res.status(400).json({ error: 'Тема и текст обращения обязательны' });
    }

    // Создание нового обращения через Sequelize
    const newRequest = await Request.create({ topic, text });

    console.log('Создано обращение:', newRequest.toJSON());

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при создании обращения:', err);
    next(err);
  }
});

module.exports = router;