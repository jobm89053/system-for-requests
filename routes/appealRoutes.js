const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Главная страница со всеми обращениями
router.get('/', requestController.getAllRequests);

// Фильтрация обращений
router.get('/filter', requestController.getAllRequests);

// Страница создания обращения
router.get('/create', (req, res) => {
  res.render('create_appeal', { title: 'Создать обращение' });
});

// Создание нового обращения
router.post('/create', requestController.create_appeal);

// Страница решения обращения
router.get('/:id/solution', requestController.openAppealSolutionPage);

// Взятие обращения в работу
router.post('/:id/take_to_work', requestController.handleTakeToWork);

// Отмена обращения
//router.post('/:id/cancel', requestController.cancelAppeal);

// Завершение обращения
router.post('/:id/handle', requestController.handleAppeal);

// Отмена всех обращений "В работе"
router.post('/cancel_all_in_progress', requestController.cancelAllInProgress);

// Детали обращения
router.get('/appeal_detail/:appeal_id', requestController.getAppealDetails);

module.exports = router;