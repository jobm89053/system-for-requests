const { Request } = require('../models');
const { Op } = require('sequelize');

const  getAllRequests = async (req, res) => {
  try {
    const { date, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ error: 'Некорректные параметры пагинации' });
    }

    const whereClause = {};
    if (date) {
      whereClause.createdAt = { 
        [Op.between]: [new Date(date).setHours(0, 0, 0, 0), new Date(date).setHours(23, 59, 59, 999)] 
      };
    } else if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(`${startDate}T00:00:00`), new Date(`${endDate}T23:59:59`)],
      };
    }

    const { rows: appeals, count } = await Request.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'topic', 'text', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalPages = Math.ceil(count / limit); 

    res.render('all_appeal', {
      appeals,
      currentDate: date || '',
      currentStartDate: startDate || '',
      currentEndDate: endDate || '',
      currentPage: parseInt(page),
      totalPages: totalPages, 
    });
  } catch (error) {
    console.error('Ошибка при получении обращений:', error);
    res.status(500).json({ error: error.message });
  }
};

const handleTakeToWork = async (req, res) => {
  try {
    const appealId = req.params.id;
    const appeal = await Request.findByPk(appealId);

    if (!appeal) return res.status(404).send('Обращение не найдено');

    await appeal.update({ status: 'В работе' });
    res.redirect(`/appeal_solution/${appealId}`);
  } catch (error) {
    console.error('Ошибка при взятии обращения в работу:', error);
    res.status(500).send('Ошибка сервера');
  }
};

const openAppealSolutionPage = async (req, res) => {
  try {
    const appealId = req.params.id;
    const appeal = await Request.findByPk(appealId);

    if (!appeal) return res.status(404).send('Обращение не найдено');

    await appeal.update({ status: 'В работе' });
    res.render('appeal_solution', { title: 'Решение обращения', appeal });
  } catch (error) {
    console.error('Ошибка при открытии страницы решения обращения:', error);
    res.status(500).send('Ошибка сервера');
  }
};

const create_appeal = async (req, res) => {
  try {
    const { topic, text } = req.body;
    if (!topic || !text) return res.status(400).json({ error: 'Тема и текст обязательны' });

    await Request.create({ topic, text });
    res.status(201).redirect('/all_appeal');
  } catch (error) {
    console.error('Ошибка при создании обращения:', error);
    res.status(500).json({ error: error.message });
  }
};

const cancelAllInProgress = async (req, res, next) => {
  try {
    const [updatedCount] = await Request.update(
      { status: 'Отменено', cancellationReason: 'Массовая отмена' },
      { where: { status: 'В работе' } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Нет обращений в работе' });
    }

    res.redirect('/all_appeal');
  } catch (error) {
    console.error('Ошибка при отмене всех обращений в работе:', error);
    next(error);
  }
};

const cancelAppeal = async (req, res) => {
  try {
    const appealId = req.params.id;
    const { response } = req.body;  

    if (!response) {
      return res.status(400).json({ error: 'Причина отмены или решение обязательно' });
    }

    const [updatedCount] = await Request.sequelize.query(
      'UPDATE requests SET status = "Отменено", cancellationReason = ? WHERE id = ?',
      {
        replacements: [response, appealId],
        type: Request.sequelize.QueryTypes.UPDATE,
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Обращение не найдено или уже отменено' });
    }

    res.redirect('/all_appeal');  
  } catch (error) {
    console.error('Ошибка при отмене обращения:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRequests,
  handleTakeToWork,
  //handleAppeal,
  create_appeal,
  openAppealSolutionPage,
  cancelAllInProgress,
  cancelAppeal, 
};
