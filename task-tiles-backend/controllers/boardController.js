const Board = require('../models/Board');

class BoardController {
  // Get all boards
  static async getAllBoards(req, res) {
    try {
      const boards = await Board.findAll();
      res.json(boards);
    } catch (error) {
      console.error('Error fetching boards:', error);
      res.status(500).json({ 
        error: 'Failed to fetch boards',
        message: error.message 
      });
    }
  }

  // Get a specific board by ID
  static async getBoardById(req, res) {
    try {
      const { id } = req.params;
      const boardId = parseInt(id);
      
      if (isNaN(boardId)) {
        return res.status(400).json({ error: 'Invalid board ID' });
      }

      const board = await Board.findById(boardId);
      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }
      
      res.json(board);
    } catch (error) {
      console.error('Error fetching board:', error);
      res.status(500).json({ 
        error: 'Failed to fetch board',
        message: error.message 
      });
    }
  }

  // Create a new board
  static async createBoard(req, res) {
    try {
      const { title, description } = req.body;
      
      const newBoard = await Board.create({ title, description });
      res.status(201).json(newBoard);
    } catch (error) {
      console.error('Error creating board:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to create board',
        message: error.message 
      });
    }
  }

  // Update a board
  static async updateBoard(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const boardId = parseInt(id);
      
      if (isNaN(boardId)) {
        return res.status(400).json({ error: 'Invalid board ID' });
      }

      const updatedBoard = await Board.update(boardId, { title, description });
      
      if (!updatedBoard) {
        return res.status(404).json({ error: 'Board not found' });
      }
      
      res.json(updatedBoard);
    } catch (error) {
      console.error('Error updating board:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to update board',
        message: error.message 
      });
    }
  }

  // Delete a board
  static async deleteBoard(req, res) {
    try {
      const { id } = req.params;
      const boardId = parseInt(id);
      
      if (isNaN(boardId)) {
        return res.status(400).json({ error: 'Invalid board ID' });
      }

      const deleted = await Board.delete(boardId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Board not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting board:', error);
      res.status(500).json({ 
        error: 'Failed to delete board',
        message: error.message 
      });
    }
  }

  // Check if a board exists
  static async checkBoardExists(req, res) {
    try {
      const { id } = req.params;
      const boardId = parseInt(id);
      
      if (isNaN(boardId)) {
        return res.status(400).json({ error: 'Invalid board ID' });
      }

      const exists = await Board.exists(boardId);
      res.json({ exists });
    } catch (error) {
      console.error('Error checking board existence:', error);
      res.status(500).json({ 
        error: 'Failed to check board existence',
        message: error.message 
      });
    }
  }
}

module.exports = BoardController; 