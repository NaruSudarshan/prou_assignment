const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, taskController.getTasks);
router.post('/', protect, authorize('Manager'), taskController.createTask);
router.put('/:id', protect, taskController.updateTask);
router.delete('/:id', protect, authorize('Manager'), taskController.deleteTask);
router.post('/:id/comments', protect, taskController.addTaskComment);
router.delete('/:taskId/comments/:commentId', protect, taskController.deleteComment);

module.exports = router;
