const express = require('express');
const logController = require('../../controllers/logController');
const router = express.Router();

router.route('/addLog').post(logController.addLog);
router.route('/getAllLog').post(logController.getAllLog);
router.route('/deleteLog').post(logController.deleteLog);
router.route('/updateLog').post(logController.updateLog);
router.route('/searchLog').post(logController.searchLog);


module.exports = router;