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
// requestController.js
const handleTakeToWork = async (req, res) => {
  try {
    const appealId = req.params.id; // Получаем ID обращения из URL

    // Найти обращение
    const appeal = await Request.findByPk(appealId);

    if (!appeal) {
      return res.status(404).send('Обращение не найдено');
    }

    // Обновляем статус обращения на "В работе"
    await Request.update({ status: 'В работе' }, { where: { id: appealId } });

    // Перенаправляем пользователя на страницу решения обращения
    res.redirect(`/appeal_solution/${appealId}`);
  } catch (err) {
    console.error('Ошибка при обработке запроса:', err);
    res.status(500).send('Ошибка сервера');
  }
};
// Получить одно обращение по ID
async function takeOneAppeal(appealId) {
  try {
    const appeal = await Request.findOne({
      where: { id: appealId }
    });

    return appeal;
  } catch (error) {
    console.error("Error fetching appeal:", error);
    throw error;
  }
}

// Открыть страницу для обработки обращения
const openAppealSolutionPage = async (req, res) => {
  try {
    const appealId = req.params.id; // Получаем ID из URL
    const appeal = await Request.findByPk(appealId);

    if (!appeal) {
      return res.status(404).send('Обращение не найдено');
    }

    // Если нужно, можем обновить статус на "В работе"
    await Request.update({ status: 'В работе' }, { where: { id: appealId } });

    // Перенаправляем на страницу с решением обращения
    res.render('appeal_solution', {
      title: 'Решение обращения',
      appeal, // передаем данные обращения
    });
  } catch (err) {
    console.error('Ошибка при открытии страницы решения обращения:', err);
    res.status(500).send('Ошибка сервера');
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
const cancelAllInProgress = async (req, res) => {
  try {
    // Обновляем все обращения, которые находятся "В работе", переводим их в "Отменено"
    const updatedCount = await Request.update(
      { status: 'Отменено', cancellationReason: 'Массовая отмена' }, // Правильное обновление
      { where: { status: 'В работе' } } // Условие выбора записей
    );

    if (updatedCount[0] === 0) {
      return res.status(404).json({ message: 'Нет обращений в работе' });
    }

    res.redirect('/all_appeal'); // Перенаправление на список обращений
  } catch (error) {
    console.error('Ошибка при отмене всех обращений в работе:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRequests,
  takeOneAppeal,
  handleAppeal,
  create_appeal,
  openAppealSolutionPage,
  handleTakeToWork,
  cancelAllInProgress, // Добавляем новую функцию
};
