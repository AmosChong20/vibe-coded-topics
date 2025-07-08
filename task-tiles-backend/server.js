const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import database initialization
const { initializeDatabaseIfNeeded } = require('./db/init');
const { closePool } = require('./db/connection');

// Import middleware
const { 
  setDatabaseStatus, 
  validateRequestBody,
  validateContentType,
  sanitizeInputs,
  logRequest,
  errorHandler,
  notFoundHandler
} = require('./middleware/validation');

// Import routes
const boardRoutes = require('./routes/boardRoutes');
const columnRoutes = require('./routes/columnRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiAgentRoutes = require('./routes/aiAgent');

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());

// Custom middleware
app.use(logRequest);
app.use(validateContentType);
app.use(validateRequestBody);
app.use(sanitizeInputs);

// Initialize database on startup
const initializeApp = async () => {
  try {
    console.log('Initializing application...');
    await initializeDatabaseIfNeeded();
    setDatabaseStatus(true);
    console.log('✅ Application initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    process.exit(1);
  }
};

// API Routes
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai-agent', aiAgentRoutes);

// Legacy column routes (maintain backward compatibility)
app.use('/api/boards/:id/columns', (req, res, next) => {
  req.url = `/board/${req.params.id}`;
  columnRoutes(req, res, next);
});

app.use('/api/boards/:boardId/columns/:columnId', (req, res, next) => {
  req.url = `/${req.params.columnId}`;
  columnRoutes(req, res, next);
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStatus = require('./middleware/validation').checkDatabase.name;
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      database: 'error',
      message: error.message
    });
  }
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Task Tiles API',
    version: '1.0.0',
    description: 'RESTful API for Task Tiles project management application',
    endpoints: {
      boards: {
        'GET /api/boards': 'Get all boards',
        'GET /api/boards/:id': 'Get a specific board',
        'POST /api/boards': 'Create a new board',
        'PUT /api/boards/:id': 'Update a board',
        'DELETE /api/boards/:id': 'Delete a board'
      },
      columns: {
        'GET /api/columns/board/:boardId': 'Get columns for a board',
        'GET /api/columns/:id': 'Get a specific column',
        'POST /api/columns/board/:id': 'Create a new column',
        'PUT /api/columns/:columnId': 'Update a column',
        'DELETE /api/columns/:columnId': 'Delete a column'
      },
      tasks: {
        'GET /api/tasks': 'Get all tasks',
        'GET /api/tasks/:id': 'Get a specific task',
        'POST /api/tasks': 'Create a new task',
        'PUT /api/tasks/:id': 'Update a task',
        'DELETE /api/tasks/:id': 'Delete a task',
        'POST /api/tasks/:id/move': 'Move a task between columns'
      },
      aiAgent: {
        'POST /api/ai-agent/chat': 'Chat with AI agent for task management',
        'GET /api/ai-agent/history/:boardId': 'Get conversation history for a board'
      }
    },
    documentation: 'https://github.com/your-repo/task-tiles-backend'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);
app.use(notFoundHandler);

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n📡 Received ${signal}. Shutting down gracefully...`);
  try {
    await closePool();
    console.log('✅ Database connections closed');
    console.log('👋 Server shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    await initializeApp();
    
    const server = app.listen(PORT, () => {
      console.log('🚀 Task Tiles Backend Server');
      console.log('================================');
      console.log(`📍 Server running on port ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api`);
      console.log(`🗄️  Database: Connected`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('================================');
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
if (require.main === module) {
  startServer();
}

module.exports = app; 