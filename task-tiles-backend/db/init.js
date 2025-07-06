const fs = require('fs');
const path = require('path');
const { query } = require('./connection');

// Read and execute the schema file
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await query(schema);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Check if database is initialized
const checkDatabaseConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('Database connection verified:', result.rows[0].current_time);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Check if tables exist
const checkTablesExist = async () => {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('boards', 'columns', 'tasks')
    `);
    
    const tables = result.rows.map(row => row.table_name);
    const requiredTables = ['boards', 'columns', 'tasks'];
    
    return requiredTables.every(table => tables.includes(table));
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
};

// Initialize database if needed
const initializeDatabaseIfNeeded = async () => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to database');
    }

    const tablesExist = await checkTablesExist();
    if (!tablesExist) {
      console.log('Tables not found, initializing database...');
      await initializeDatabase();
    } else {
      console.log('Database tables already exist');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  checkDatabaseConnection,
  checkTablesExist,
  initializeDatabaseIfNeeded
}; 