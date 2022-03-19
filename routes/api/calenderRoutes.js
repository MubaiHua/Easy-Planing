const express = require('express');
const calenderController = require('../../controllers/calenderControllers');
const router = express.Router();


router.route('/update').post(calenderController.updateAvailability);
router.route('/getUser').post(calenderController.getUserAvailability);
router.route('/getAll').post(calenderController.getAll);

module.exports = router;