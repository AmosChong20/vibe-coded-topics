const { query } = require('../db/connection');

class Board {
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.columns = data.columns || [];
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

  // Database operations
  static async findAll() {
    const boardsResult = await query('SELECT * FROM boards ORDER BY created_at DESC');
    const boards = boardsResult.rows;

    // Get columns for each board
    for (const board of boards) {
      const columnsResult = await query(
        'SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC',
        [board.id]
      );
      board.columns = columnsResult.rows;

      // Get tasks for each column
      for (const column of board.columns) {
        const tasksResult = await query(
          'SELECT * FROM tasks WHERE column_id = $1 ORDER BY position ASC',
          [column.id]
        );
        column.taskIds = tasksResult.rows.map(task => task.id.toString());
      }
    }

    return boards.map(board => new Board(board));
  }

  static async findById(id) {
    const boardResult = await query('SELECT * FROM boards WHERE id = $1', [id]);
    if (boardResult.rows.length === 0) {
      return null;
    }
    
    const board = boardResult.rows[0];
    
    // Get columns
    const columnsResult = await query(
      'SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC',
      [board.id]
    );
    board.columns = columnsResult.rows;

    // Get tasks for each column
    for (const column of board.columns) {
      const tasksResult = await query(
        'SELECT * FROM tasks WHERE column_id = $1 ORDER BY position ASC',
        [column.id]
      );
      column.taskIds = tasksResult.rows.map(task => task.id.toString());
    }

    return new Board(board);
  }

  static async create(data) {
    const errors = Board.validateCreateData(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const result = await query(
      'INSERT INTO boards (title, description) VALUES ($1, $2) RETURNING *',
      [data.title.trim(), data.description || '']
    );
    
    const board = result.rows[0];
    board.columns = [];
    return new Board(board);
  }

  static async update(id, data) {
    const errors = Board.validateUpdateData(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const { title, description } = data;
    const result = await query(
      'UPDATE boards SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title.trim(), description || '', id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Board(result.rows[0]);
  }

  static async delete(id) {
    const result = await query('DELETE FROM boards WHERE id = $1 RETURNING *', [id]);
    return result.rows.length > 0;
  }

  static async exists(id) {
    const result = await query('SELECT id FROM boards WHERE id = $1', [id]);
    return result.rows.length > 0;
  }

  // Instance methods
  async save() {
    if (this.id) {
      return Board.update(this.id, {
        title: this.title,
        description: this.description
      });
    } else {
      return Board.create({
        title: this.title,
        description: this.description
      });
    }
  }

  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete board without ID');
    }
    return Board.delete(this.id);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      created_at: this.created_at,
      updated_at: this.updated_at,
      columns: this.columns
    };
  }
}

module.exports = Board; 