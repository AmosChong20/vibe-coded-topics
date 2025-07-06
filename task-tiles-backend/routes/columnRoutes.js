const express = require('express');
const ColumnController = require('../controllers/columnController');
const { checkDatabase } = require('../middleware/validation');

const router = express.Router();

// Apply database check middleware to all routes
router.use(checkDatabase);

// Column routes
router.get('/board/:boardId', ColumnController.getColumnsByBoardId);
router.get('/:id', ColumnController.getColumnById);
router.get('/:id/task-count', ColumnController.getColumnTaskCount);
router.post('/board/:id', ColumnController.createColumn);
router.put('/:columnId', ColumnController.updateColumn);
router.delete('/:columnId', ColumnController.deleteColumn);
router.put('/positions', ColumnController.updateColumnPositions);

module.exports = router; 