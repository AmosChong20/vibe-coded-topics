const { query } = require('../db/connection');

class Column {
  constructor(data = {}) {
    this.id = data.id;
    this.board_id = data.board_id;
    this.title = data.title;
    this.position = data.position;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.taskIds = data.taskIds || [];
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
    
    if (!data.board_id || !Number.isInteger(Number(data.board_id))) {
      errors.push('Board ID is required and must be a valid integer');
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
  static async findByBoardId(boardId) {
    const result = await query(
      'SELECT * FROM columns WHERE board_id = $1 ORDER BY position ASC',
      [boardId]
    );
    return result.rows.map(column => new Column(column));
  }

  static async findById(id) {
    const result = await query('SELECT * FROM columns WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return new Column(result.rows[0]);
  }

  static async create(boardId, title) {
    const data = { board_id: boardId, title };
    const errors = Column.validateCreateData(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    // Get the next position
    const positionResult = await query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM columns WHERE board_id = $1',
      [boardId]
    );
    const position = positionResult.rows[0].next_position;

    const result = await query(
      'INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3) RETURNING *',
      [boardId, title.trim(), position]
    );
    
    const column = result.rows[0];
    column.taskIds = [];
    return new Column(column);
  }

  static async update(id, data) {
    const errors = Column.validateUpdateData(data);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    const { title } = data;
    const result = await query(
      'UPDATE columns SET title = $1 WHERE id = $2 RETURNING *',
      [title.trim(), id]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Column(result.rows[0]);
  }

  static async delete(id) {
    const result = await query('DELETE FROM columns WHERE id = $1 RETURNING *', [id]);
    return result.rows.length > 0;
  }

  static async exists(id) {
    const result = await query('SELECT id FROM columns WHERE id = $1', [id]);
    return result.rows.length > 0;
  }

  static async updatePositions(columnPositions) {
    // columnPositions is an array of {id, position} objects
    const client = await require('../db/connection').pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const { id, position } of columnPositions) {
        await client.query(
          'UPDATE columns SET position = $1 WHERE id = $2',
          [position, id]
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

  // Instance methods
  async save() {
    if (this.id) {
      return Column.update(this.id, {
        title: this.title
      });
    } else {
      return Column.create(this.board_id, this.title);
    }
  }

  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete column without ID');
    }
    return Column.delete(this.id);
  }

  async getTaskCount() {
    const result = await query(
      'SELECT COUNT(*) as count FROM tasks WHERE column_id = $1',
      [this.id]
    );
    return parseInt(result.rows[0].count);
  }

  async getTasks() {
    const result = await query(
      'SELECT * FROM tasks WHERE column_id = $1 ORDER BY position ASC',
      [this.id]
    );
    return result.rows;
  }

  toJSON() {
    return {
      id: this.id,
      board_id: this.board_id,
      title: this.title,
      position: this.position,
      created_at: this.created_at,
      updated_at: this.updated_at,
      taskIds: this.taskIds
    };
  }
}

module.exports = Column; 