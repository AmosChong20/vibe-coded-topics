const { query, pool } = require('../db/connection');

class Task {
  constructor(data = {}) {
    this.id = data.id;
    this.column_id = data.column_id;
    this.title = data.title;
    this.description = data.description;
    this.position = data.position;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Validation methods
  static validateCreateData(data) {
    const errors = [];
    
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('Title is required and must be a non-empty string');
    }
    
    if (data.title && data.title.length > 255) {
      errors.push('Title must be less than 255 characters');
    }
    
    if (!data.column_id || !Number.isInteger(Number(data.column_id))) {
      errors.push('Column ID is required and must be a valid integer');
    }
    
    return errors;
  }

  static validateUpdateData(data) {
    const errors = [];
    
    if (data.title !== undefined) {
      if (typeof data.title !== 'string' || data.title.trim() === '') {
        errors.push('Title must be a non-empty string');
      }
      if (data.title.length > 255) {
        errors.push('Title must be less than 255 characters');
      }
    }
    
    return errors;
  }

  static validateMoveData(data) {
    const errors = [];
    
    if (!data.sourceColumnId || !Number.isInteger(Number(data.sourceColumnId))) {
      errors.push('Source column ID is required and must be a valid integer');
    }
    
    if (!data.destinationColumnId || !Number.isInteger(Number(data.destinationColumnId))) {
      errors.push('Destination column ID is required and must be a valid integer');
    }
    
    if (data.sourceIndex === undefined || !Number.isInteger(Number(data.sourceIndex))) {
      errors.push('Source index is required and must be a valid integer');
    }
    
    if (data.destinationIndex === undefined || !Number.isInteger(Number(data.destinationIndex))) {
      errors.push('Destination index is required and must be a valid integer');
    }
    
    return errors;
  }

  // Database operations
  static async findAll() {
    const result = await query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows.map(task => new Task(task));
  }

  static async findById(id) {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return new Task(result.rows[0]);
  }

  static async findByColumnId(columnId) {
    const result = await query(
      'SELECT * FROM tasks WHERE column_id = $1 ORDER BY position ASC',
      [columnId]
    );
    return result.rows.map(task => new Task(task));
  }

  static async create(columnId, title, description = '') {
    const data = { column_id: columnId, title, description };
    const errors = Task.validateCreateData(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Get the next position for this column
    const positionResult = await query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM tasks WHERE column_id = $1',
      [columnId]
    );
    const position = positionResult.rows[0].next_position;

    const result = await query(
      'INSERT INTO tasks (column_id, title, description, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [columnId, title.trim(), description.trim(), position]
    );
    
    return new Task(result.rows[0]);
  }

  static async update(id, data) {
    const errors = Task.validateUpdateData(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const { title, description } = data;
    const result = await query(
      'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title.trim(), description ? description.trim() : '', id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Task(result.rows[0]);
  }

  static async delete(id) {
    const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows.length > 0;
  }

  static async exists(id) {
    const result = await query('SELECT id FROM tasks WHERE id = $1', [id]);
    return result.rows.length > 0;
  }

  static async move(taskId, moveData) {
    const errors = Task.validateMoveData(moveData);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const { sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } = moveData;
    
    // Start transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Remove task from source column (update positions)
      await client.query(
        'UPDATE tasks SET position = position - 1 WHERE column_id = $1 AND position > $2',
        [sourceColumnId, sourceIndex]
      );

      // Move task to destination column
      await client.query(
        'UPDATE tasks SET column_id = $1, position = $2 WHERE id = $3',
        [destinationColumnId, destinationIndex, taskId]
      );

      // Update positions in destination column
      await client.query(
        'UPDATE tasks SET position = position + 1 WHERE column_id = $1 AND position >= $2 AND id != $3',
        [destinationColumnId, destinationIndex, taskId]
      );

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updatePositions(columnId, taskPositions) {
    // taskPositions is an array of {id, position} objects
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const { id, position } of taskPositions) {
        await client.query(
          'UPDATE tasks SET position = $1 WHERE id = $2 AND column_id = $3',
          [position, id, columnId]
        );
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async getTasksInDateRange(startDate, endDate) {
    const result = await query(
      'SELECT * FROM tasks WHERE created_at >= $1 AND created_at <= $2 ORDER BY created_at DESC',
      [startDate, endDate]
    );
    return result.rows.map(task => new Task(task));
  }

  static async searchTasks(searchTerm) {
    const result = await query(
      'SELECT * FROM tasks WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC',
      [`%${searchTerm}%`]
    );
    return result.rows.map(task => new Task(task));
  }

  // Instance methods
  async save() {
    if (this.id) {
      return Task.update(this.id, {
        title: this.title,
        description: this.description
      });
    } else {
      return Task.create(this.column_id, this.title, this.description);
    }
  }

  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete task without ID');
    }
    return Task.delete(this.id);
  }

  async moveTo(destinationColumnId, destinationIndex) {
    if (!this.id) {
      throw new Error('Cannot move task without ID');
    }
    
    // Get current position
    const currentTask = await Task.findById(this.id);
    if (!currentTask) {
      throw new Error('Task not found');
    }
    
    return Task.move(this.id, {
      sourceColumnId: currentTask.column_id,
      destinationColumnId,
      sourceIndex: currentTask.position,
      destinationIndex
    });
  }

  async getColumn() {
    const Column = require('./Column');
    return Column.findById(this.column_id);
  }

  toJSON() {
    return {
      id: this.id,
      column_id: this.column_id,
      title: this.title,
      description: this.description,
      position: this.position,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Task; 