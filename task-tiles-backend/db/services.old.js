const { query, pool } = require('./connection');

// Board Services
const boardService = {
  // Get all boards with their columns and tasks
  async getAll() {
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

    return boards;
  },

  // Get a specific board
  async getById(id) {
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

    return board;
  },

  // Create a new board
  async create(title, description = '') {
    const result = await query(
      'INSERT INTO boards (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    const board = result.rows[0];
    board.columns = [];
    return board;
  },

  // Update a board
  async update(id, data) {
    const { title, description } = data;
    const result = await query(
      'UPDATE boards SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description || '', id]
    );
    return result.rows[0];
  },

  // Delete a board
  async delete(id) {
    await query('DELETE FROM boards WHERE id = $1', [id]);
  }
};

// Column Services
const columnService = {
  // Create a new column
  async create(boardId, title) {
    // Get the next position
    const positionResult = await query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM columns WHERE board_id = $1',
      [boardId]
    );
    const position = positionResult.rows[0].next_position;

    const result = await query(
      'INSERT INTO columns (board_id, title, position) VALUES ($1, $2, $3) RETURNING *',
      [boardId, title, position]
    );
    const column = result.rows[0];
    column.taskIds = [];
    return column;
  },

  // Update a column
  async update(id, data) {
    const { title } = data;
    const result = await query(
      'UPDATE columns SET title = $1 WHERE id = $2 RETURNING *',
      [title, id]
    );
    return result.rows[0];
  },

  // Delete a column
  async delete(id) {
    await query('DELETE FROM columns WHERE id = $1', [id]);
  }
};

// Task Services
const taskService = {
  // Get all tasks
  async getAll() {
    const result = await query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows;
  },

  // Get a specific task
  async getById(id) {
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Create a new task
  async create(columnId, title, description = '') {
    // Get the next position for this column
    const positionResult = await query(
      'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM tasks WHERE column_id = $1',
      [columnId]
    );
    const position = positionResult.rows[0].next_position;

    const result = await query(
      'INSERT INTO tasks (column_id, title, description, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [columnId, title, description, position]
    );
    return result.rows[0];
  },

  // Update a task
  async update(id, data) {
    const { title, description } = data;
    const result = await query(
      'UPDATE tasks SET title = $1, description = $2 WHERE id = $3 RETURNING *',
      [title, description || '', id]
    );
    return result.rows[0];
  },

  // Delete a task
  async delete(id) {
    await query('DELETE FROM tasks WHERE id = $1', [id]);
  },

  // Move a task to a different column and position
  async move(taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex) {
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
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

module.exports = {
  boardService,
  columnService,
  taskService
}; 