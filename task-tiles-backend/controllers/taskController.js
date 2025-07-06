const Task = require('../models/Task');
const Column = require('../models/Column');

class TaskController {
  // Get all tasks
  static async getAllTasks(req, res) {
    try {
      const tasks = await Task.findAll();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ 
        error: 'Failed to fetch tasks',
        message: error.message 
      });
    }
  }

  // Get a specific task by ID
  static async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const taskId = parseInt(id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ 
        error: 'Failed to fetch task',
        message: error.message 
      });
    }
  }

  // Get tasks by column ID
  static async getTasksByColumnId(req, res) {
    try {
      const { columnId } = req.params;
      const parsedColumnId = parseInt(columnId);
      
      if (isNaN(parsedColumnId)) {
        return res.status(400).json({ error: 'Invalid column ID' });
      }

      // Check if column exists
      const columnExists = await Column.exists(parsedColumnId);
      if (!columnExists) {
        return res.status(404).json({ error: 'Column not found' });
      }

      const tasks = await Task.findByColumnId(parsedColumnId);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks by column:', error);
      res.status(500).json({ 
        error: 'Failed to fetch tasks',
        message: error.message 
      });
    }
  }

  // Create a new task
  static async createTask(req, res) {
    try {
      const { title, description, columnId } = req.body;
      const parsedColumnId = parseInt(columnId);
      
      if (isNaN(parsedColumnId)) {
        return res.status(400).json({ error: 'Invalid column ID' });
      }

      // Check if column exists
      const columnExists = await Column.exists(parsedColumnId);
      if (!columnExists) {
        return res.status(404).json({ error: 'Column not found' });
      }
      
      const newTask = await Task.create(parsedColumnId, title, description);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to create task',
        message: error.message 
      });
    }
  }

  // Update a task
  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const taskId = parseInt(id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

      const updatedTask = await Task.update(taskId, { title, description });
      
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to update task',
        message: error.message 
      });
    }
  }

  // Delete a task
  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const taskId = parseInt(id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

      const deleted = await Task.delete(taskId);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ 
        error: 'Failed to delete task',
        message: error.message 
      });
    }
  }

  // Move task between columns
  static async moveTask(req, res) {
    try {
      const { id } = req.params;
      const { sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = req.body;
      const taskId = parseInt(id);
      
      if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' });
      }

      // Check if task exists
      const taskExists = await Task.exists(taskId);
      if (!taskExists) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const moveData = {
        sourceColumnId: parseInt(sourceColumnId),
        destinationColumnId: parseInt(destinationColumnId),
        sourceIndex: parseInt(sourceIndex),
        destinationIndex: parseInt(destinationIndex)
      };

      await Task.move(taskId, moveData);
      res.json({ success: true });
    } catch (error) {
      console.error('Error moving task:', error);
      
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ 
          error: 'Validation error',
          message: error.message 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to move task',
        message: error.message 
      });
    }
  }

  // Update task positions within a column
  static async updateTaskPositions(req, res) {
    try {
      const { columnId } = req.params;
      const { taskPositions } = req.body;
      const parsedColumnId = parseInt(columnId);
      
      if (isNaN(parsedColumnId)) {
        return res.status(400).json({ error: 'Invalid column ID' });
      }

      if (!Array.isArray(taskPositions)) {
        return res.status(400).json({ error: 'Task positions must be an array' });
      }

      // Validate each position object
      for (const pos of taskPositions) {
        if (!pos.id || !Number.isInteger(pos.position)) {
          return res.status(400).json({ 
            error: 'Each position object must have id and position properties' 
          });
        }
      }

      await Task.updatePositions(parsedColumnId, taskPositions);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating task positions:', error);
      res.status(500).json({ 
        error: 'Failed to update task positions',
        message: error.message 
      });
    }
  }

  // Search tasks
  static async searchTasks(req, res) {
    try {
      const { q: searchTerm } = req.query;
      
      if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ error: 'Search term is required' });
      }

      const tasks = await Task.searchTasks(searchTerm.trim());
      res.json(tasks);
    } catch (error) {
      console.error('Error searching tasks:', error);
      res.status(500).json({ 
        error: 'Failed to search tasks',
        message: error.message 
      });
    }
  }

  // Get tasks in date range
  static async getTasksInDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      const tasks = await Task.getTasksInDateRange(start, end);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks in date range:', error);
      res.status(500).json({ 
        error: 'Failed to fetch tasks in date range',
        message: error.message 
      });
    }
  }
}

module.exports = TaskController; 