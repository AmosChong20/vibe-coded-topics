# Task Tiles Backend

A RESTful API backend for the Task Tiles project management application, built with Express.js. This backend provides endpoints for managing boards, columns, and tasks in a Trello-inspired interface.

## Features

- **Boards Management**: Create, read, update, and delete project boards
- **Columns Management**: Add and manage columns within boards
- **Tasks Management**: Create, update, delete, and move tasks between columns
- **Drag & Drop Support**: API endpoints for moving tasks between columns
- **PostgreSQL Database**: Persistent data storage with full ACID compliance
- **Database Migrations**: Automatic schema initialization and sample data
- **MVC Architecture**: Clean Model-View-Controller structure for maintainability
- **Input Validation**: Comprehensive validation and sanitization
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **CORS Support**: Configured for cross-origin requests
- **Security**: Includes helmet for security headers
- **Logging**: Request logging with morgan
- **Health Check**: `/health` endpoint for monitoring

## Architecture

This backend follows the **Model-View-Controller (MVC)** pattern:

- **Models** (`models/`): Handle data operations, validation, and business logic
- **Controllers** (`controllers/`): Handle HTTP requests and coordinate between models and routes  
- **Routes** (`routes/`): Define API endpoints and connect them to controllers
- **Middleware** (`middleware/`): Handle cross-cutting concerns like validation and logging

### Benefits of MVC Architecture
- **Separation of Concerns**: Each component has a single responsibility
- **Maintainability**: Easy to modify and extend individual components
- **Testability**: Isolated components for unit testing
- **Reusability**: Models and middleware can be reused across controllers
- **Scalability**: Clean structure supports growing applications

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher) or Docker for containerized setup

## Installation Steps

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd task-tiles-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install nodemon for development (optional):
   ```bash
   npm install -g nodemon
   ```

## Configuration

The application uses the following environment variables:

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (default: task_tiles)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)

You can create a `.env` file in the root directory:
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_tiles
DB_USER=postgres
DB_PASSWORD=postgres
```

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database named `task_tiles`:
   ```bash
   createdb task_tiles
   ```
3. The application will automatically create tables on first run

### Option 2: Docker PostgreSQL

```bash
docker run --name task-tiles-postgres \
  -e POSTGRES_DB=task_tiles \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Database Commands
```bash
# Reset database (recreate tables and sample data)
npm run db:reset
```

The server will start on `http://localhost:3001`

## API Endpoints

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get a specific board
- `POST /api/boards` - Create a new board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board

### Columns
- `POST /api/boards/:id/columns` - Add a column to a board
- `PUT /api/boards/:boardId/columns/:columnId` - Update a column
- `DELETE /api/boards/:boardId/columns/:columnId` - Delete a column

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/:id/move` - Move a task between columns

### Health Check
- `GET /health` - Health check endpoint

## Docker Setup

### Build Docker Image
```bash
docker build -t task-tiles-backend .
```

### Run Docker Container
```bash
docker run -p 3001:3001 task-tiles-backend
```

### Run with Environment Variables
```bash
docker run -p 3001:3001 -e PORT=3001 -e NODE_ENV=production task-tiles-backend
```

## Cloud Deployment

This application is containerized and ready for deployment to any cloud platform that supports Docker containers.

### AWS ECS
1. Build and push image to ECR
2. Create ECS task definition
3. Deploy to ECS cluster

### Google Cloud Run
```bash
gcloud run deploy task-tiles-backend --image gcr.io/PROJECT_ID/task-tiles-backend --platform managed
```

### Azure Container Instances
```bash
az container create --resource-group myResourceGroup --name task-tiles-backend --image task-tiles-backend
```

### Heroku
```bash
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

## Development

### Project Structure
```
task-tiles-backend/
├── models/             # Data models (MVC Model layer)
│   ├── Board.js        # Board model with validation & business logic
│   ├── Column.js       # Column model with validation & business logic
│   ├── Task.js         # Task model with validation & business logic
│   └── index.js        # Model exports
├── controllers/        # Request handlers (MVC Controller layer)
│   ├── boardController.js    # Board HTTP request handlers
│   ├── columnController.js   # Column HTTP request handlers
│   └── taskController.js     # Task HTTP request handlers
├── routes/             # API route definitions
│   ├── boardRoutes.js        # Board endpoint definitions
│   ├── columnRoutes.js       # Column endpoint definitions
│   └── taskRoutes.js         # Task endpoint definitions
├── middleware/         # Custom middleware functions
│   └── validation.js         # Validation, logging, error handling
├── db/                 # Database layer
│   ├── connection.js   # PostgreSQL connection pool
│   ├── schema.sql      # Database schema and migrations
│   └── init.js         # Database initialization
├── server.js          # Main application entry point
├── package.json       # Dependencies and scripts
├── Dockerfile         # Docker configuration
└── README.md         # This file
```

### Adding New Features

1. Add new routes in `server.js`
2. Implement endpoint logic
3. Test with your frontend or API client
4. Update API documentation in this README

### Data Structure

The application uses the following data structure:

```javascript
// Board
{
  id: string,
  title: string,
  columns: Column[]
}

// Column
{
  id: string,
  title: string,
  taskIds: string[]
}

// Task
{
  id: string,
  title: string,
  description: string
}
```

## Testing

You can test the API endpoints using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

Example curl command:
```bash
curl -X GET http://localhost:3001/api/boards
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 