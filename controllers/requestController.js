const requestService = require('../services/requestService');

// Получение всех обращений
const getAllRequests = async (req, res) => {
  try {
    const { date, startDate, endDate, page = 1, limit = 10 } = req.query;
    const { appeals, count, totalPages } = await requestService.getAllRequests({
      date,
      startDate,
      endDate,
      page,
      limit,
    });

    res.render('all_appeal', {
      title: 'system-for-handling-requests',
      appeals,
      currentDate: date || '',
      currentStartDate: startDate || '',
      currentEndDate: endDate || '',
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.error('Ошибка при получении обращений:', error);
    res.status(500).json({ error: error.message });
  }
};

// Создание нового обращения
const create_appeal = async (req, res) => {
  try {
    const { topic, text } = req.body;
    if (!topic || !text) return res.status(400).json({ error: 'Тема и текст обязательны' });

    await requestService.createAppeal({ topic, text });
    res.redirect('/all_appeal');
  } catch (error) {
    console.error('Ошибка при создании обращения:', error);
    res.status(500).json({ error: error.message });
  }
};

// Страница решения обращения
const openAppealSolutionPage = async (req, res) => {
  try {
    const appealId = req.params.id;
    const appeal = await requestService.getAppealById(appealId);

    await appeal.update({ status: 'В работе' });
    res.render('appeal_solution', { title: 'Решение обращения', appeal });
  } catch (error) {
    console.error('Ошибка при открытии страницы решения обращения:', error);
    res.status(500).send('Ошибка сервера');
  }
};

// Взятие обращения в работу
const handleTakeToWork = async (req, res) => {
  try {
    const appealId = req.params.id;
    await requestService.updateAppealStatus(appealId, 'В работе');
    res.redirect(`/all_appeal/${appealId}/solution`);
  } catch (error) {
    console.error('Ошибка при взятии обращения в работу:', error);
    res.status(500).send('Ошибка сервера');
  }
};

// Завершение обращения
const handleAppeal = async (req, res) => {
  try {
    const appealId = req.params.id;
    const { action, response } = req.body;

    // Проверка существования обращения
    const appeal = await requestService.getAppealById(appealId);
    if (!appeal) {
      return res.status(404).send('Обращение не найдено');
    }

    // Обработка действий
    if (action === 'complete') {
      // Завершение обращения
      await requestService.updateAppealStatus(appealId, 'Завершено');
    } else if (action === 'cancel') {
      // Отмена обращения
      if (!response) {
        return res.status(400).json({ error: 'Причина отмены обязательна' });
      }
      await requestService.updateAppealStatus(appealId, 'Отменено', response);
    } else {
      return res.status(400).json({ error: 'Неверное действие' });
    }

    // Перенаправление пользователя на страницу со всеми обращениями
    res.redirect('/all_appeal');
  } catch (error) {
    console.error('Ошибка при завершении/отмене обращения:', error);
    res.status(500).send('Ошибка сервера');
  }
};


// Отмена всех обращений "В работе"
const cancelAllInProgress = async (req, res) => {
  try {
    await requestService.cancelAllInProgress();
    res.redirect('/all_appeal');
  } catch (error) {
    console.error('Ошибка при отмене всех обращений в работе:', error);
    res.status(500).json({ error: error.message });
  }
};

// Детали обращения
const getAppealDetails = async (req, res) => {
  try {
    const appealId = req.params.appeal_id;
    const appeal = await requestService.getAppealById(appealId);

    // Форматирование дат
    const formattedCreatedAt = appeal.createdAt.toISOString().slice(0, 19).replace('T', ' ');
    const formattedUpdatedAt = appeal.updatedAt.toISOString().slice(0, 19).replace('T', ' ');

    res.render('appeal_details', {
      appeal: { ...appeal.toJSON(), createdAt: formattedCreatedAt, updatedAt: formattedUpdatedAt },
    });
  } catch (error) {
    console.error('Ошибка при получении деталей обращения:', error);
    res.status(500).send('Ошибка сервера');
  }
};


module.exports = {
  getAllRequests,
  create_appeal,
  openAppealSolutionPage,
  handleTakeToWork,
  handleAppeal,
  cancelAllInProgress,
  getAppealDetails, 
};