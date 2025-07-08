# Task Tiles Backend

A powerful REST API backend for **Task Tiles** - an intelligent Kanban board application with AI-powered task management. Built with Express.js, PostgreSQL, and integrated with Claude AI for natural language task management.

![Task Tiles](https://img.shields.io/badge/Task%20Tiles-AI%20Powered-blue)
![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-blue)
![AI](https://img.shields.io/badge/AI-Claude%20Sonnet-purple)

## 🚀 Features

### Core Kanban Functionality
- **Boards Management**: Create, read, update, and delete project boards
- **Columns Management**: Add and manage columns within boards  
- **Tasks Management**: Create, update, delete, and move tasks between columns
- **Drag & Drop API**: Seamless task movement between columns with position management
- **Search & Filtering**: Advanced task search and date-range filtering
- **Bulk Operations**: Update multiple task positions efficiently

### 🤖 AI-Powered Task Management
- **Natural Language Interface**: Chat with AI assistant using plain English
- **Intelligent Task Creation**: "Create task called 'Review code' in Done column"
- **Smart Task Movement**: "Move the login task to In Progress"
- **Task Search**: "Find tasks about bugs"
- **Progress Reports**: "What's my progress?" for project insights
- **Context-Aware**: AI understands your board structure and task relationships

### Technical Excellence
- **MVC Architecture**: Clean Model-View-Controller structure for maintainability
- **PostgreSQL Database**: ACID-compliant transactions with connection pooling
- **Input Validation**: Comprehensive validation and sanitization
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: Helmet for security headers, CORS support, XSS prevention
- **Logging**: Structured request logging with Morgan
- **Health Monitoring**: Comprehensive health check endpoints
- **Database Migrations**: Automatic schema initialization with sample data

## 🏗️ Architecture

### MVC Pattern
```
├── models/             # 🎯 Data Layer (Business Logic)
│   ├── Board.js        # Board operations & validation
│   ├── Column.js       # Column management & relationships  
│   ├── Task.js         # Task CRUD, search, move operations
│   └── index.js        # Model exports
├── controllers/        # 🎮 Control Layer (HTTP Handlers)
│   ├── boardController.js     # Board endpoint handlers
│   ├── columnController.js    # Column endpoint handlers
│   ├── taskController.js      # Task endpoint handlers  
│   └── aiAgentController.js   # AI assistant integration
├── routes/             # 🛣️ Route Definitions
│   ├── boardRoutes.js         # Board API endpoints
│   ├── columnRoutes.js        # Column API endpoints
│   ├── taskRoutes.js          # Task API endpoints
│   └── aiAgent.js            # AI agent endpoints
├── middleware/         # 🔧 Cross-cutting Concerns
│   └── validation.js          # Validation, logging, error handling
└── db/                 # 🗄️ Database Layer
    ├── connection.js          # PostgreSQL connection pool
    ├── schema.sql            # Database schema
    └── init.js               # Database initialization
```

### AI Agent Architecture
- **LangChain Integration**: Powered by LangChain for robust AI workflows
- **Claude Sonnet**: Using Anthropic's Claude AI for natural language understanding
- **Tool-Based Approach**: Modular tools for different task operations
- **Context Awareness**: Maintains board and task context for intelligent responses
- **Error Recovery**: Graceful handling of AI failures with fallback responses

## 📋 Prerequisites

- **Node.js** v16 or higher
- **PostgreSQL** v12 or higher (or Docker)
- **Anthropic API Key** for AI features

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd task-tiles-backend
npm install
```

### 2. Environment Setup
Create a `.env` file:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration  
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_tiles
DB_USER=postgres
DB_PASSWORD=postgres

# AI Configuration (Required for AI features)
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### 3. Database Setup

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL and create database
createdb task_tiles

# Start the server (auto-creates tables)
npm run dev
```

**Option B: Docker PostgreSQL**
```bash
docker run --name task-tiles-postgres \
  -e POSTGRES_DB=task_tiles \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 4. Run the Application
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Reset database (recreate tables + sample data)
npm run db:reset
```

Server starts at: **http://localhost:3001**

## 🔌 API Endpoints

### 📊 Boards API
```http
GET    /api/boards              # Get all boards
GET    /api/boards/:id          # Get specific board with columns & tasks
POST   /api/boards              # Create new board
PUT    /api/boards/:id          # Update board
DELETE /api/boards/:id          # Delete board
```

### 📋 Columns API  
```http
GET    /api/columns/board/:boardId    # Get columns for a board
POST   /api/columns/board/:id         # Create column in board
PUT    /api/columns/:columnId         # Update column
DELETE /api/columns/:columnId         # Delete column
```

### ✅ Tasks API
```http
GET    /api/tasks                     # Get all tasks
GET    /api/tasks/search              # Search tasks by title/description
GET    /api/tasks/column/:columnId    # Get tasks in specific column
POST   /api/tasks                     # Create new task
PUT    /api/tasks/:id                 # Update task
DELETE /api/tasks/:id                 # Delete task
POST   /api/tasks/:id/move            # Move task between columns
```

### 🤖 AI Agent API
```http
POST   /api/ai-agent/chat             # Chat with AI assistant
GET    /api/ai-agent/history/:boardId # Get conversation history
```

### 🔍 Monitoring
```http
GET    /health                        # Health check + system info
GET    /api                          # API documentation
```

## 🤖 AI Assistant Usage

The AI assistant understands natural language commands:

### Task Creation
```
"Create task called 'Fix login bug' in the To Do column"
"Add task 'Review PR #123' with description 'Check security implications'"
"New task 'Team meeting'"
```

### Task Management
```
"Move the login task to In Progress"
"Show me all tasks"
"What's my progress?"
"Find tasks about testing"
```

### Information & Help
```
"What can you do?"
"Help me with task management"
"Show me tasks in the Done column"
```

## 🐳 Docker Deployment

### Build Image
```bash
docker build -t task-tiles-backend .
```

### Run Container
```bash
docker run -p 3001:3001 \
  -e ANTHROPIC_API_KEY=your_key_here \
  -e DB_HOST=your_db_host \
  task-tiles-backend
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      - DB_HOST=postgres
      - ANTHROPIC_API_KEY=your_key_here
    depends_on:
      - postgres
      
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=task_tiles
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## ☁️ Cloud Deployment

### Vercel (Serverless)
```bash
npm install -g vercel
vercel --prod
```

### Heroku
```bash
heroku create task-tiles-backend
heroku addons:create heroku-postgresql:mini
heroku config:set ANTHROPIC_API_KEY=your_key_here
git push heroku main
```

### AWS ECS / Google Cloud Run / Azure
The application is containerized and ready for any cloud platform supporting Docker.

## 🔧 Development

### Project Structure
```
task-tiles-backend/
├── 📁 controllers/     # HTTP request handlers
├── 📁 models/         # Data models & business logic  
├── 📁 routes/         # API endpoint definitions
├── 📁 middleware/     # Validation, logging, auth
├── 📁 db/            # Database connection & schema
├── 📄 server.js      # Application entry point
├── 📄 package.json   # Dependencies & scripts
└── 🐳 Dockerfile     # Container configuration
```

### Available Scripts
```bash
npm start           # Production server
npm run dev         # Development with auto-reload  
npm run db:reset    # Reset database + sample data
npm test           # Run tests (when implemented)
```

### Adding New Features

1. **New Model**: Add to `models/` with validation
2. **New Controller**: Add to `controllers/` with HTTP handlers  
3. **New Routes**: Add to `routes/` and register in `server.js`
4. **AI Tools**: Add new AI tools in `aiAgentController.js`

## 📚 Data Models

### Board
```javascript
{
  id: number,
  title: string,
  created_at: timestamp,
  updated_at: timestamp,
  columns: Column[]
}
```

### Column  
```javascript
{
  id: number,
  board_id: number,
  title: string,
  position: number,
  created_at: timestamp
}
```

### Task
```javascript
{
  id: number,
  column_id: number,
  title: string,
  description: string,
  position: number,
  created_at: timestamp,
  updated_at: timestamp
}
```

## 🧪 Testing

Test the API endpoints:

### Using curl
```bash
# Get all boards
curl http://localhost:3001/api/boards

# Create a new board
curl -X POST http://localhost:3001/api/boards \
  -H "Content-Type: application/json" \
  -d '{"title": "My Project"}'

# Chat with AI
curl -X POST http://localhost:3001/api/ai-agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me all tasks", "boardId": 1}'
```

### Using Postman/Thunder Client
Import the API collection for easy testing of all endpoints.

## 🛡️ Security Features

- **Helmet**: Security headers protection
- **CORS**: Cross-origin request handling  
- **Input Validation**: XSS and injection prevention
- **Sanitization**: HTML tag removal and data cleaning
- **Error Handling**: No sensitive data in error responses
- **Rate Limiting**: (Recommended for production)

## 📊 Performance

- **Connection Pooling**: Efficient PostgreSQL connections
- **Query Optimization**: Indexed database queries
- **Caching**: (Ready for Redis integration)
- **Compression**: Gzip compression enabled
- **Error Recovery**: Graceful degradation of AI features

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`  
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built with ❤️ for modern project management**

*Transform your task management with AI-powered assistance and beautiful, intuitive interfaces.* 