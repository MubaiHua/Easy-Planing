const express = require('express');
const taskController = require('../../controllers/taskController');
const router = express.Router();

router.route('/addTask').post(taskController.addTask);
router.route('/getAllTask').post(taskController.getAllTask);
router.route('/getUserTask').post(taskController.getUserTask);
router.route('/updateTask').post(taskController.updateTask);
router.route('/deleteTask').post(taskController.deleteTask);

module.exports = router;