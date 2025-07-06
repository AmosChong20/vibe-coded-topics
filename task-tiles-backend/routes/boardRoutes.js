const express = require('express');
const BoardController = require('../controllers/boardController');
const { checkDatabase } = require('../middleware/validation');

const router = express.Router();

// Apply database check middleware to all routes
router.use(checkDatabase);

// Board routes
router.get('/', BoardController.getAllBoards);
router.get('/:id', BoardController.getBoardById);
router.post('/', BoardController.createBoard);
router.put('/:id', BoardController.updateBoard);
router.delete('/:id', BoardController.deleteBoard);
router.head('/:id', BoardController.checkBoardExists);

module.exports = router; 