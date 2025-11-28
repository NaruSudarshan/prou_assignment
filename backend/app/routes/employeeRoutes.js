const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, employeeController.getEmployees);
router.post('/', protect, authorize('Manager'), employeeController.createEmployee);
router.put('/:id', protect, authorize('Manager'), employeeController.updateEmployee);
router.delete('/:id', protect, authorize('Manager'), employeeController.deleteEmployee);

module.exports = router;
