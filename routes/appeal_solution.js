const express = require('express');
const router = express.Router();
const { Request } = require('../models');
const requestController = require('../controllers/requestController');

router.get('/:id', requestController.openAppealSolutionPage);

router.post('/:id/take_to_work', requestController.handleTakeToWork);

module.exports = router;