const express = require('express');
const TaskController = require('../controllers/taskController');
const { checkDatabase } = require('../middleware/validation');

const router = express.Router();

// Apply database check middleware to all routes
router.use(checkDatabase);

// Task routes
router.get('/', TaskController.getAllTasks);
router.get('/search', TaskController.searchTasks);
router.get('/date-range', TaskController.getTasksInDateRange);
router.get('/column/:columnId', TaskController.getTasksByColumnId);
router.get('/:id', TaskController.getTaskById);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.post('/:id/move', TaskController.moveTask);
router.put('/column/:columnId/positions', TaskController.updateTaskPositions);

module.exports = router; 