const express = require('express');
const router = express.Router();
const { Request } = require('../models'); // Импортируем модель Sequelize

// Получить одно обращение по ID
router.get('/:appeal_id', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;
    const appeal = await Request.findOne({ where: { id: appealId } });

    if (!appeal) {
      return res.status(404).render('404', { title: 'Обращение не найдено' });
    }

    res.render('appeal_solution', { appeal });
  } catch (err) {
    console.error('Ошибка при загрузке обращения:', err);
    next(err);
  }
});

// Обработать обращение (завершить, отменить или принять в работу)
router.post('/:appeal_id/handle', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;
    const { response, action } = req.body;

    if (action === 'complete') {
      await Request.update({ status: 'Завершено', solution: response }, { where: { id: appealId } });
    } else if (action === 'cancel') {
      await Request.update({ status: 'Отменено', cancellationReason: response }, { where: { id: appealId } });
    } else if (action === 'take_to_work') {
      await Request.update({ status: 'В работе' }, { where: { id: appealId } });
    }

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при обработке обращения:', err);
    next(err);
  }
});

// Принять обращение в работу отдельно
router.post('/:appeal_id/take_to_work', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;
    await Request.update({ status: 'В работе' }, { where: { id: appealId } });
    res.redirect(`/appeal_solution/${appealId}`);
  } catch (err) {
    console.error('Ошибка при изменении статуса:', err);
    next(err);
  }
});

module.exports = router;
