const express = require('express');
const router = express.Router();
const { Request } = require('../models');
const requestController = require('../controllers/requestController');

// Показываем страницу для решения
router.get('/:id', requestController.openAppealSolutionPage);

// Обработать запрос на взятие в работу и перенаправить на страницу решения
router.post('/:id/take_to_work', requestController.handleTakeToWork);

module.exports = router;