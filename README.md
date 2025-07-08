# Task Tiles - AI-Powered Project Management Assistant

**The future of project management is here.** Task Tiles combines the familiar Kanban board interface with the power of AI to create an intelligent project management assistant that understands natural language and helps you manage tasks effortlessly.

## 🤖 What Makes Task Tiles Special

**Talk to your board.** Instead of clicking through menus, just tell your AI assistant what you want to do:

- *"Create a task called 'Fix login bug' in the Done column"*
- *"Move the user dashboard task to In Progress"*
- *"What's my current progress on this project?"*
- *"Show me all tasks related to authentication"*

**Smart Task Management.** The AI agent understands context, relationships, and your workflow patterns to provide intelligent assistance beyond simple task creation.

## 🚀 Key Features

### 🧠 AI-Powered Task Management
- **Natural Language Processing**: Communicate with your board using everyday language
- **Context-Aware Understanding**: AI remembers your board structure and task relationships
- **Intelligent Task Operations**: Create, move, update, and organize tasks through conversation
- **Smart Column Recognition**: AI maps intuitive column names to your board structure
- **Progress Insights**: Get intelligent summaries of your project status

### 🎯 Modern Project Management
- **Visual Kanban Boards**: Intuitive drag-and-drop interface for visual task management
- **Glass Morphism Design**: Beautiful, modern UI with smooth animations and effects
- **Real-time Updates**: Live synchronization across all interactions
- **Responsive Experience**: Works seamlessly on desktop, tablet, and mobile
- **Dual Interface**: Use traditional drag-and-drop OR AI chat - whatever feels natural

### 🔧 Enterprise-Ready Architecture
- **Claude AI Integration**: Powered by Anthropic's Claude Sonnet for advanced natural language understanding
- **LangChain Framework**: Sophisticated AI workflow management and tool orchestration
- **PostgreSQL Database**: Robust data persistence with connection pooling
- **Docker Containerization**: Production-ready deployment with full containerization
- **RESTful API**: Comprehensive backend API with proper validation and error handling

## 🏗️ Technical Architecture

### Frontend (React + AI Chat)
- **React 18** with hooks and context
- **Styled-components** for dynamic styling
- **@dnd-kit** for drag-and-drop functionality
- **BoardAIAgent** component for natural language interaction
- **Glass morphism design system** with custom gradients and animations

### Backend (Express + AI Agent)
- **Express.js** with MVC architecture
- **Claude AI integration** via Anthropic SDK
- **LangChain** for AI workflow orchestration
- **PostgreSQL** with connection pooling
- **Comprehensive AI tools** for task management operations

### AI Agent Capabilities
- **Advanced NLP**: Understanding context, intent, and complex requests
- **Multi-tool Operations**: Coordinated task creation, updates, and movements
- **Error Handling**: Graceful fallbacks and helpful error messages
- **Board Intelligence**: Understanding of project structure and relationships

## 📁 Project Structure

```
task-tiles/
├── 🎨 task-tiles-frontend/     # React frontend with AI chat interface
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoardAIAgent.js    # AI chat interface
│   │   │   ├── TaskBoard.js       # Main Kanban board
│   │   │   └── TaskCard.js        # Individual task components
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   └── App.js                # Main application
│   └── README.md                 # Frontend documentation
├── 🤖 task-tiles-backend/      # Express.js backend with AI agent
│   ├── controllers/
│   │   └── aiAgentController.js  # AI agent with LangChain integration
│   ├── models/                   # Database models
│   ├── routes/                   # API routes
│   └── README.md                 # Backend documentation
├── 🐳 docker-compose.yml        # Full stack deployment
└── 📚 README.md                 # This file
```

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd task-tiles

# Start everything with Docker
docker-compose up --build

# Open your AI-powered project management assistant
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
```

### Option 2: Local Development

**Prerequisites:**
- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- Anthropic API Key (for Claude AI)

**Setup:**

1. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb task_tiles
   
   # Or use Docker
   docker run --name task-tiles-postgres \
     -e POSTGRES_DB=task_tiles \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 -d postgres:15-alpine
   ```

2. **Backend Setup**
   ```bash
   cd task-tiles-backend
   npm install
   
   # Create .env file with your API key
   echo "ANTHROPIC_API_KEY=your_anthropic_api_key_here" > .env
   echo "PORT=3001" >> .env
   echo "NODE_ENV=development" >> .env
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd task-tiles-frontend
   npm install
   npm start
   ```

4. **Start Managing Projects with AI**
   - Open http://localhost:3000
   - Click on the AI chat icon
   - Start talking to your board: *"Create a task for testing the new feature"*

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
# AI Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_AI_ENABLED=true
```

## 🤖 AI Agent API

### Chat with Your Board
```bash
POST /api/ai-agent/chat
{
  "message": "Create a task for fixing the login bug in the testing column",
  "boardId": "123"
}
```

### Get AI Insights
```bash
GET /api/ai-agent/insights/:boardId
# Returns intelligent analysis of your project progress
```

## 📚 Complete API Documentation

### Traditional REST API
- **Boards**: Full CRUD operations for project boards
- **Columns**: Manage workflow stages (To Do, In Progress, Done, etc.)
- **Tasks**: Complete task lifecycle management
- **Movements**: Track task progress and history

### AI-Powered Endpoints
- **Chat Interface**: Natural language task management
- **Insights**: AI-generated project analysis and recommendations
- **Smart Search**: Context-aware task and project search

*See individual component READMEs for detailed API documentation.*

## 🌟 AI Use Cases

### For Project Managers
- *"Generate a summary of this week's completed tasks"*
- *"What are the bottlenecks in our current sprint?"*
- *"Create tasks for the user onboarding flow"*

### For Developers
- *"Move all testing tasks to done"*
- *"Create a bug fix task for the payment integration"*
- *"Show me all tasks assigned to the authentication module"*

### For Teams
- *"What's our team's progress on the mobile app?"*
- *"Create tasks for the code review process"*
- *"Update the API documentation task to in progress"*

## 🛠️ Advanced Features

### AI Agent Capabilities
- **Multi-step Operations**: Handle complex requests involving multiple tasks
- **Context Memory**: Remember previous conversations and board state
- **Error Recovery**: Intelligent handling of ambiguous requests
- **Learning**: Adapts to your workflow patterns and preferences

### Technical Features
- **Real-time Sync**: Live updates across all interfaces
- **Offline Support**: Continue working without internet connection
- **Performance Optimization**: Efficient rendering and state management
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Deployment Options

### Cloud Platforms
- **AWS ECS**: Container-based deployment with RDS
- **Google Cloud Run**: Serverless container deployment
- **Azure Container Instances**: Quick container deployment
- **Heroku**: Simple git-based deployment

### Self-Hosted
- **Docker Compose**: Full stack deployment
- **Kubernetes**: Production-scale orchestration
- **VPS Deployment**: Traditional server deployment

*See deployment guides in individual component READMEs.*

## 🔮 Roadmap

### AI Enhancements
- [ ] Voice commands and speech recognition
- [ ] Proactive task suggestions based on patterns
- [ ] Integration with calendar and email
- [ ] Multi-language support for global teams

### Platform Features
- [ ] Team collaboration with real-time chat
- [ ] Advanced analytics and reporting
- [ ] Custom AI training on your data
- [ ] Mobile app with full AI integration

### Enterprise Features
- [ ] SSO integration and enterprise auth
- [ ] Advanced permissions and team management
- [ ] Custom AI workflows and automation
- [ ] API rate limiting and monitoring

## 🤝 Contributing

We welcome contributions to make Task Tiles even more intelligent and useful!

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-ai-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing AI feature'`)
4. **Push to the branch** (`git push origin feature/amazing-ai-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and patterns
- Add tests for new AI agent tools and features
- Update documentation for new capabilities
- Test AI interactions thoroughly

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Anthropic** for the Claude AI model that powers our intelligent agent
- **LangChain** for the AI workflow framework
- **React** and **Express.js** communities for the solid foundation
- **PostgreSQL** for reliable data persistence

---

**Ready to revolutionize your project management?** Start talking to your board today!

*Made with ❤️ and 🤖 for the future of intelligent project management*
