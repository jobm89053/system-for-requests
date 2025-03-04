const express = require('express');
const router = express.Router();
const { Request } = require('../models');
const { Op } = require('sequelize');

router.get('/all_appeal', async (req, res, next) => {
  try {
    const { date, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ error: 'Некорректные параметры пагинации' });
    }

    const whereClause = {};

    if (date) {
      whereClause.createdAt = {
        [Op.like]: `%${date}%`,
      };
    }

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate + 'T23:59:59')],
      };
    }

    const { rows: appeals, count } = await Request.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'topic', 'text', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

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

router.get('/appeal_detail/:appeal_id', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;
    const appeal = await Request.findByPk(appealId);

    if (!appeal) {
      return res.status(404).send('Обращение не найдено');
    }

    res.render('appeal_detail', {
      title: 'Детали обращения',
      appeal,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
