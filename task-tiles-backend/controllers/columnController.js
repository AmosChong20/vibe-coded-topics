const Column = require('../models/Column');
const Board = require('../models/Board');

class ColumnController {
  // Get columns for a specific board
  static async getColumnsByBoardId(req, res) {
    try {
      const { boardId } = req.params;
      const parsedBoardId = parseInt(boardId);
      
      if (isNaN(parsedBoardId)) {
        return res.status(400).json({ error: 'Invalid board ID' });
      }

      // Check if board exists
      const boardExists = await Board.exists(parsedBoardId);
      if (!boardExists) {
        return res.status(404).json({ error: 'Board not found' });
      }

      const columns = await Column.findByBoardId(parsedBoardId);
      res.json(columns);
    } catch (error) {
      console.error('Error fetching columns:', error);
      res.status(500).json({ 
        error: 'Failed to fetch columns',
        message: error.message 
      });
    }
  }

  // Get a specific column by ID
  static async getColumnById(req, res) {
    try {
      const { id } = req.params;
      const columnId = parseInt(id);
      
      if (isNaN(columnId)) {
        return res.status(400).json({ error: 'Invalid column ID' });
      }

      const column = await Column.findById(columnId);
      if (!column) {
        return res.status(404).json({ error: 'Column not found' });
      }
      
      res.json(column);
    } catch (error) {
      console.error('Error fetching column:', error);
      res.status(500).json({ 
        error: 'Failed to fetch column',
        message: error.message 
      });
    }
  }

  // Create a new column
  static async createColumn(req, res) {
    try {
      const { id: boardId } = req.params;
      const { title } = req.body;
      const parsedBoardId = parseInt(boardId);
      
      if (isNaN(parsedBoardId)) {
        return res.status(400).json({ error: 'Invalid board ID' });
      }

      // Check if board exists
      const boardExists = await Board.exists(parsedBoardId);
      if (!boardExists) {
        return res.status(404).json({ error: 'Board not found' });
      }
      
      const newColumn = await Column.create(parsedBoardId, title);
      res.status(201).json(newColumn);
    } catch (error) {
      console.error('Error creating column:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to create column',
        message: error.message 
      });
    }
  }

  // Update a column
  static async updateColumn(req, res) {
    try {
      const { columnId } = req.params;
      const { title } = req.body;
      const parsedColumnId = parseInt(columnId);
      
      if (isNaN(parsedColumnId)) {
        return res.status(400).json({ error: 'Invalid column ID' });
      }

      const updatedColumn = await Column.update(parsedColumnId, { title });
      
      if (!updatedColumn) {
        return res.status(404).json({ error: 'Column not found' });
      }
      
      res.json(updatedColumn);
    } catch (error) {
      console.error('Error updating column:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to update column',
        message: error.message 
      });
    }
  }

  // Delete a column
  static async deleteColumn(req, res) {
    try {
      const { columnId } = req.params;
      const parsedColumnId = parseInt(columnId);
      
      if (isNaN(parsedColumnId)) {
        return res.status(400).json({ error: 'Invalid column ID' });
      }

      const deleted = await Column.delete(parsedColumnId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Column not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting column:', error);
      res.status(500).json({ 
        error: 'Failed to delete column',
        message: error.message 
      });
    }
  }

  // Update column positions (for reordering)
  static async updateColumnPositions(req, res) {
    try {
      const { columnPositions } = req.body;
      
      if (!Array.isArray(columnPositions)) {
        return res.status(400).json({ error: 'Column positions must be an array' });
      }

      // Validate each position object
      for (const pos of columnPositions) {
        if (!pos.id || !Number.isInteger(pos.position)) {
          return res.status(400).json({ 
            error: 'Each position object must have id and position properties' 
          });
        }
      }

      await Column.updatePositions(columnPositions);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating column positions:', error);
      res.status(500).json({ 
        error: 'Failed to update column positions',
        message: error.message 
      });
    }
  }

  // Get task count for a column
  static async getColumnTaskCount(req, res) {
    try {
      const { id } = req.params;
      const columnId = parseInt(id);
      
      if (isNaN(columnId)) {
        return res.status(400).json({ error: 'Invalid column ID' });
      }

      const column = await Column.findById(columnId);
      if (!column) {
        return res.status(404).json({ error: 'Column not found' });
      }

      const taskCount = await column.getTaskCount();
      res.json({ taskCount });
    } catch (error) {
      console.error('Error getting column task count:', error);
      res.status(500).json({ 
        error: 'Failed to get column task count',
        message: error.message 
      });
    }
  }
}

module.exports = ColumnController; 