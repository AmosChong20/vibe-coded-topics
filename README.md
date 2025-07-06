# Task Tiles - Project Management Application

A modern, Trello-inspired project management application built with React and Express.js. Task Tiles provides an intuitive drag-and-drop interface for managing projects, boards, columns, and tasks.

## 🚀 Features

- **Visual Project Boards**: Create and manage multiple project boards
- **Drag & Drop Interface**: Smooth drag-and-drop functionality for moving tasks between columns
- **Real-time Updates**: Live updates when tasks are moved or created
- **Modern UI**: Clean, responsive design with glass morphism effects
- **RESTful API**: Well-structured backend API with comprehensive endpoints
- **Docker Support**: Containerized application ready for cloud deployment
- **Cross-platform**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

This project follows a modern full-stack architecture:

- **Frontend**: React with styled-components and @hello-pangea/dnd
- **Backend**: Express.js with CORS and security middleware
- **Database**: PostgreSQL with automatic schema management
- **Containerization**: Docker containers for all services including database

## 📁 Project Structure

```
task-tiles/
├── task-tiles-frontend/     # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   └── App.js          # Main application
│   ├── Dockerfile          # Frontend Docker configuration
│   └── README.md           # Frontend documentation
├── task-tiles-backend/      # Express.js backend API
│   ├── server.js           # Main server file
│   ├── Dockerfile          # Backend Docker configuration
│   └── README.md           # Backend documentation
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher) - for local development
- Docker (optional, for containerized deployment)

## 🚀 Quick Start

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-tiles
   ```

2. **Set up PostgreSQL**
   ```bash
   # Option 1: Install PostgreSQL locally and create database
   createdb task_tiles
   
   # Option 2: Use Docker
   docker run --name task-tiles-postgres \
     -e POSTGRES_DB=task_tiles \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 -d postgres:15-alpine
   ```

3. **Start the Backend**
   ```bash
   cd task-tiles-backend
   npm install
   npm run dev
   ```

4. **Start the Frontend** (in a new terminal)
   ```bash
   cd task-tiles-frontend
   npm install
   npm start
   ```

5. **Open the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Option 2: Docker Compose

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-tiles
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Open the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 🐳 Docker Deployment

### Individual Containers

**Backend:**
```bash
cd task-tiles-backend
docker build -t task-tiles-backend .
docker run -p 3001:3001 task-tiles-backend
```

**Frontend:**
```bash
cd task-tiles-frontend
docker build -t task-tiles-frontend .
docker run -p 80:80 task-tiles-frontend
```

### Docker Compose
```bash
docker-compose up --build
```

## ☁️ Cloud Deployment

Both applications are containerized and ready for deployment to any cloud platform:

### AWS
- **ECS**: Deploy using Amazon Elastic Container Service
- **ECR**: Store Docker images in Elastic Container Registry
- **S3 + CloudFront**: Host frontend as static site

### Google Cloud
- **Cloud Run**: Deploy containerized applications
- **Container Registry**: Store Docker images

### Azure
- **Container Instances**: Deploy containers directly
- **App Service**: Deploy web applications

### Heroku
```bash
# Backend
heroku container:push web -a your-backend-app
heroku container:release web -a your-backend-app

# Frontend
heroku container:push web -a your-frontend-app
heroku container:release web -a your-frontend-app
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```
PORT=3001
NODE_ENV=production
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:3001
```

## 📚 API Documentation

### Boards
- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create a new board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board

### Columns
- `POST /api/boards/:id/columns` - Add a column to a board
- `PUT /api/boards/:boardId/columns/:columnId` - Update a column
- `DELETE /api/boards/:boardId/columns/:columnId` - Delete a column

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/:id/move` - Move a task between columns

## 🧪 Testing

**Backend:**
```bash
cd task-tiles-backend
npm test
```

**Frontend:**
```bash
cd task-tiles-frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 3001 are available
2. **API connection**: Verify backend is running before starting frontend
3. **Docker issues**: Check Docker daemon is running
4. **Dependencies**: Delete `node_modules` and reinstall if needed

### Getting Help

- Check individual README files in frontend and backend directories
- Verify all environment variables are set correctly
- Check browser console for error messages
- Ensure Docker containers are running properly

## 🌟 Features Roadmap

- [ ] User authentication and authorization
- [ ] Real-time collaboration with WebSockets
- [ ] Task due dates and reminders
- [ ] File attachments for tasks
- [ ] Advanced task filtering and search
- [ ] Export boards to various formats
- [ ] Mobile app development
- [ ] Database integration (PostgreSQL/MongoDB)

## 🎯 Inspired By

This project is inspired by Trello's intuitive project management interface, implementing core features like:
- Visual project boards
- Drag-and-drop task management
- Column-based workflow organization
- Clean, modern user interface

---

Made with ❤️ for efficient project management
