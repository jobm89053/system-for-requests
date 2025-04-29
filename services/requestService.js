const { Request } = require('../models');
const { Op } = require('sequelize');

// Получение всех обращений с фильтрацией и пагинацией
const getAllRequests = async ({ date, startDate, endDate, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (date) {
    whereClause.createdAt = {
      [Op.between]: [
        new Date(date).setHours(0, 0, 0, 0),
        new Date(date).setHours(23, 59, 59, 999),
      ],
    };
  } else if (startDate && endDate) {
    whereClause.createdAt = {
      [Op.between]: [new Date(startDate), new Date(`${endDate}T23:59:59`)],
    };
  }

  const { rows: appeals, count } = await Request.findAndCountAll({
    where: whereClause,
    attributes: ['id', 'topic', 'text', 'status', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset),
  });

  return {
    appeals,
    count,
    totalPages: Math.ceil(count / limit),
  };
};

// Получение одного обращения по ID
const getAppealById = async (appealId) => {
  const appeal = await Request.findByPk(appealId);
  if (!appeal) throw new Error('Обращение не найдено');
  return appeal;
};

// Обновление статуса обращения
const updateAppealStatus = async (appealId, status, cancellationReason = null) => {
  const appeal = await Request.findByPk(appealId);
  if (!appeal) throw new Error('Обращение не найдено');
  await appeal.update({ status, ...(cancellationReason && { cancellationReason }) });
  return appeal;
};

// Создание нового обращения
const createAppeal = async ({ topic, text }) => {
  if (!topic || !text) throw new Error('Тема и текст обязательны');
  return await Request.create({ topic, text });
};

// Отмена всех обращений со статусом "В работе"
const cancelAllInProgress = async () => {
  const [updatedCount] = await Request.update(
    { status: 'Отменено', cancellationReason: 'Массовая отмена' },
    { where: { status: 'В работе' } }
  );
  if (updatedCount === 0) throw new Error('Нет обращений в работе');
  return updatedCount;
};

module.exports = {
  getAllRequests,
  getAppealById,
  updateAppealStatus,
  createAppeal,
  cancelAllInProgress,
};