const express = require('express');
const router = express.Router();
const { Request } = require('../models');

router.get('/:appeal_id', async (req, res, next) => {
  try {
    const appealId = parseInt(req.params.appeal_id, 10);

    if (isNaN(appealId)) {
      return res.status(400).send('Неверный ID обращения');
    }

    const appeal = await Request.findOne({ where: { id: appealId } });

    if (!appeal) {
      return res.status(404).send('Обращение не найдено');
    }
    const formattedCreatedAt = appeal.createdAt ? appeal.createdAt.toISOString().slice(0, 19).replace('T', ' ') : null;
    const formattedUpdatedAt = appeal.updatedAt ? appeal.updatedAt.toISOString().slice(0, 19).replace('T', ' ') : null;

  
    const appealResponse = {
      ...appeal.toJSON(),  
      createdAt: formattedCreatedAt,  
      updatedAt: formattedUpdatedAt,  
    };

    res.render('appeal_details', { appeal: appealResponse });
    
  } catch (err) {
    console.error('Ошибка при получении данных обращения:', err);
    next(err); 
  }
});

module.exports = router;