const express = require('express');
const router = express.Router();
const { Request } = require('../models'); 

router.get('/', function (req, res, next) {
  res.render('create_appeal', { title: 'Создать обращение' });
});

router.post('/', async function (req, res, next) {
  try {
    const { topic, text } = req.body;
    console.log('Данные формы:', { topic, text });

    if (!topic || !text) {
      return res.status(400).json({ error: 'Тема и текст обращения обязательны' });
    }

    const newRequest = await Request.create({ topic, text });

    console.log('Создано обращение:', newRequest.toJSON());

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при создании обращения:', err);
    next(err);
  }
});

module.exports = router;