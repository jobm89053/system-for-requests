const { Request } = require('../models');
const { Op } = require('sequelize');

// Получить все обращения с фильтрацией и пагинацией
const getAllRequests = async (req, res) => {
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
      // Фильтрация по конкретной дате
      whereClause.createdAt = {
        [Op.like]: `%${date}%`, // Используем LIKE для поиска по дате
      };
    }

    if (startDate && endDate) {
      // Фильтрация по диапазону дат (обе даты включительно)
      whereClause.createdAt = {
        [Op.between]: [
          new Date(startDate + 'T00:00:00'), // Начальная дата с началом дня (00:00:00)
          new Date(endDate + 'T23:59:59'), // Конечная дата с концом дня (23:59:59)
        ],
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
      appeals,
      currentDate: date || '',
      currentStartDate: startDate || '',
      currentEndDate: endDate || '',
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error('Ошибка при получении обращений:', error);
    res.status(500).json({ error: error.message });
  }
};

// Получить одно обращение по ID
const takeOneAppeal = async (req, res) => {
  try {
    const appealId = parseInt(req.params.id, 10); // Преобразуем ID в число

    // Проверка на валидность ID
    if (isNaN(appealId)) {
      return res.status(400).render('400', { title: 'Неверный ID обращения' });
    }

    const appeal = await Request.findByPk(appealId); // Ищем обращение по ID
    
    if (!appeal) {
      return res.status(404).render('404', { title: 'Обращение не найдено' });
    }

    res.render('appeal_detail', { appeal }); // Рендерим страницу с деталями обращения
  } catch (error) {
    console.error('Ошибка при получении обращения:', error);
    res.status(500).render('500', { title: 'Ошибка сервера' });
  }
};

// Обработать обращение
const handleAppeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { response, action } = req.body;

    let updateData = {};

    if (action === 'complete') {
      updateData = { status: 'Завершено', solution: response };
    } else if (action === 'cancel') {
      updateData = { status: 'Отменено', cancellationReason: response };
    } else if (action === 'take_to_work') {
      updateData = { status: 'В работе' };
    } else {
      return res.status(400).json({ error: 'Неверное действие' });
    }

    await Request.update(updateData, { where: { id } });

    res.redirect('/all_appeal');
  } catch (error) {
    console.error('Ошибка при обработке обращения:', error);
    res.status(500).json({ error: error.message });
  }
};

// Создать новое обращение
const create_appeal = async (req, res) => {
  try {
    const { topic, text } = req.body;

    // Проверка на наличие обязательных полей
    if (!topic || !text) {
      return res.status(400).json({ error: 'Тема и текст обращения обязательны' });
    }

    // Создание нового обращения
    await Request.create({ topic, text });

    // Перенаправление на страницу со всеми обращениями
    res.status(201).redirect('/all_appeal');
  } catch (error) {
    console.error('Ошибка при создании обращения:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRequests,
  takeOneAppeal,
  handleAppeal,
  create_appeal, // Добавляем метод в экспорт
};