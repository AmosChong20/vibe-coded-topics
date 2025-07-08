# Task Tiles Frontend

A stunning React frontend for **Task Tiles** - an intelligent Kanban board application with AI-powered task management. Features modern glass morphism design, smooth drag-and-drop interactions, and an integrated AI assistant for natural language task management.

![Task Tiles](https://img.shields.io/badge/Task%20Tiles-AI%20Powered-blue)
![React](https://img.shields.io/badge/React-v19+-61dafb)
![TypeScript](https://img.shields.io/badge/Styled_Components-6.1+-ff69b4)
![DnD Kit](https://img.shields.io/badge/DnD_Kit-6.3+-green)

## ✨ Features

### 🎨 Modern UI/UX Design
- **Glass Morphism Interface**: Translucent cards with beautiful blur effects
- **Gradient Backgrounds**: Dynamic color gradients that adapt to content
- **Smooth Animations**: CSS transitions and hover effects throughout
- **Responsive Design**: Mobile-first approach that works on all devices
- **Dark Mode Ready**: Beautiful contrast and accessibility considerations
- **Micro-interactions**: Delightful feedback for every user action

### 🎯 Kanban Board Functionality
- **Intuitive Drag & Drop**: Powered by @dnd-kit for smooth task movement
- **Real-time Updates**: Live synchronization with backend changes
- **Multiple Boards**: Create and manage multiple project boards
- **Customizable Columns**: Add, edit, and organize workflow columns
- **Task Management**: Create, edit, and delete tasks with rich descriptions
- **Visual Feedback**: Clear indicators for drop zones and interactions

### 🤖 AI-Powered Assistant
- **Natural Language Interface**: Chat with AI using plain English
- **Contextual Understanding**: AI knows your board structure and tasks
- **Smart Task Creation**: "Create task called 'Review code' in Done column"
- **Intelligent Task Management**: "Move the login task to In Progress"
- **Progress Insights**: "What's my progress?" for project overview
- **Interactive Chat UI**: Beautiful chat interface with typing indicators
- **Quick Actions**: Pre-built commands for common operations

### 📱 Performance & Accessibility
- **Optimized Rendering**: Efficient React rendering with proper state management
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Progressive Enhancement**: Works even if JavaScript is disabled
- **Bundle Optimization**: Code splitting and lazy loading
- **Error Boundaries**: Graceful error handling and recovery

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn**
- **Task Tiles Backend** running on port 3001

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd task-tiles-frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm start
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend API Configuration
REACT_APP_API_URL=http://localhost:3001

# Optional: Enable development features
REACT_APP_DEV_MODE=true
REACT_APP_DEBUG_LOGS=true
```

## 🏗️ Architecture

### Component Structure
```
src/
├── 📁 components/
│   ├── 🏠 App.js                    # Main application component
│   ├── 📋 Board.js                 # Board container with columns
│   ├── 📋 Column.js                # Individual column component
│   ├── ✅ Task.js                  # Task card component
│   ├── 🎯 Header.js                # Application header
│   └── 🤖 BoardAIAgent.js          # AI assistant chat interface
├── 📁 services/
│   └── 🔌 api.js                   # API service layer & AI agent logic
├── 📁 hooks/                       # Custom React hooks
├── 📁 utils/                       # Utility functions
├── 📁 constants/                   # Application constants
├── 🎨 App.css                      # Global styles
└── 🚀 index.js                     # Application entry point
```

### State Management
- **React State**: Local component state for UI interactions
- **Context API**: Board and task data sharing across components
- **Custom Hooks**: Reusable state logic for API calls and local storage
- **Optimistic Updates**: Immediate UI feedback with rollback on errors

### Styling Architecture
- **Styled Components**: CSS-in-JS for component-scoped styling
- **Theme System**: Consistent color schemes and spacing
- **Design Tokens**: Reusable design values (colors, fonts, spacing)
- **Animation Library**: Custom keyframes and transition utilities
- **Responsive Mixins**: Breakpoint management utilities

## 🎨 Design System

### Color Palette
```css
/* Primary Gradients */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
--warning-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--error-gradient: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);

/* Glass Morphism */
--glass-bg: rgba(255, 255, 255, 0.25);
--glass-border: rgba(255, 255, 255, 0.18);
--glass-blur: blur(20px);
```

### Typography
```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Scales */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
```

### Spacing System
```css
/* Spacing Scale (based on 4px grid) */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
--space-12: 3rem;       /* 48px */
--space-16: 4rem;       /* 64px */
```

## 🤖 AI Assistant Features

The AI assistant provides an intuitive natural language interface for task management:

### Core Capabilities
```javascript
// Task Creation
"Create task called 'Fix login bug' in the To Do column"
"Add task 'Review PR #123' with description 'Security review needed'"
"New task 'Team standup meeting'"

// Task Management  
"Move the login task to In Progress"
"Show me all tasks in Done column"
"What tasks are pending?"

// Progress Tracking
"What's my progress on this board?"
"How many tasks are completed?"
"Show me a summary of all tasks"

// Help & Discovery
"What can you help me with?"
"Show me available commands"
"Help me organize my tasks"
```

### AI Interface Components

#### Chat Interface
- **Message History**: Persistent conversation with timestamps
- **Typing Indicators**: Real-time typing animations
- **Message Types**: Info, success, error, and action messages
- **Quick Actions**: Pre-built command buttons
- **Copy Messages**: Easy copying of AI responses

#### Smart Suggestions
- **Contextual Commands**: Suggestions based on board state
- **Auto-completion**: Intelligent text completion
- **Error Recovery**: Helpful suggestions when commands fail
- **Learning**: AI adapts to your usage patterns

## 📱 Responsive Design

### Breakpoint System
```css
/* Mobile First Approach */
--mobile: 320px;      /* Small phones */
--mobile-lg: 480px;   /* Large phones */
--tablet: 768px;      /* Tablets */
--desktop: 1024px;    /* Small desktops */
--desktop-lg: 1440px; /* Large desktops */
--desktop-xl: 1920px; /* Extra large screens */
```

### Adaptive Features
- **Touch-Friendly**: Large tap targets on mobile devices
- **Gesture Support**: Swipe gestures for mobile interactions
- **Collapsible UI**: Sidebar collapse on smaller screens
- **Responsive Typography**: Fluid font scaling
- **Optimized Images**: WebP format with fallbacks
- **Progressive Enhancement**: Core functionality works everywhere

## 🔧 Development

### Available Scripts

```bash
# Development
npm start              # Start development server (hot reload)
npm run dev            # Alias for npm start

# Building
npm run build          # Create optimized production build
npm run build:analyze  # Build with bundle analysis

# Testing
npm test               # Run test suite in watch mode
npm run test:ci        # Run tests once (CI mode)
npm run test:coverage  # Generate coverage reports

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues automatically
npm run format         # Format code with Prettier
npm run type-check     # TypeScript type checking

# Dependencies
npm run deps:check     # Check for outdated dependencies
npm run deps:update    # Update dependencies safely
```

### Development Workflow

1. **Local Development**
   ```bash
   npm start
   # App runs on http://localhost:3000
   # Connects to backend on http://localhost:3001
   ```

2. **Environment Setup**
   ```bash
   # Development
   REACT_APP_API_URL=http://localhost:3001
   
   # Staging
   REACT_APP_API_URL=https://staging-api.task-tiles.com
   
   # Production  
   REACT_APP_API_URL=https://api.task-tiles.com
   ```

3. **Code Standards**
   - **ESLint**: Enforced code quality rules
   - **Prettier**: Automatic code formatting
   - **Husky**: Pre-commit hooks for quality checks
   - **Conventional Commits**: Standardized commit messages

### Adding New Features

1. **New Component**
   ```bash
   # Create component directory
   mkdir src/components/NewComponent
   
   # Create component files
   touch src/components/NewComponent/index.js
   touch src/components/NewComponent/NewComponent.js
   touch src/components/NewComponent/NewComponent.styles.js
   ```

2. **Styled Components Pattern**
   ```javascript
   import styled from 'styled-components';
   
   const ComponentContainer = styled.div`
     /* Base styles */
     background: var(--glass-bg);
     backdrop-filter: var(--glass-blur);
     border-radius: 16px;
     
     /* Responsive styles */
     @media (max-width: 768px) {
       padding: var(--space-4);
     }
   `;
   ```

3. **API Integration**
   ```javascript
   import { apiClient } from '../services/api';
   
   const useNewFeature = () => {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(false);
     
     const fetchData = async () => {
       setLoading(true);
       try {
         const result = await apiClient.get('/endpoint');
         setData(result.data);
       } catch (error) {
         console.error('Error:', error);
       } finally {
         setLoading(false);
       }
     };
     
     return { data, loading, fetchData };
   };
   ```

## 🐳 Docker Deployment

### Development Container
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Container
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Commands
```bash
# Development
docker build -t task-tiles-frontend:dev .
docker run -p 3000:3000 task-tiles-frontend:dev

# Production
docker build -t task-tiles-frontend:prod -f Dockerfile.prod .
docker run -p 80:80 task-tiles-frontend:prod

# With environment variables
docker run -p 3000:3000 \
  -e REACT_APP_API_URL=https://your-api.com \
  task-tiles-frontend:dev
```

## ☁️ Cloud Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Environment variables
vercel env add REACT_APP_API_URL production
```

### Netlify
```bash
# Build settings
Build command: npm run build
Publish directory: build
Environment variables: REACT_APP_API_URL
```

### AWS S3 + CloudFront
```bash
# Build and upload
npm run build
aws s3 sync build/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Google Cloud Storage
```bash
# Build and deploy
npm run build
gcloud storage cp -r build/* gs://your-bucket-name/
```

## 🧪 Testing

### Testing Stack
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW**: API mocking for integration tests
- **Cypress**: End-to-end testing framework

### Test Categories

#### Unit Tests
```javascript
// Component testing
import { render, screen } from '@testing-library/react';
import Task from './Task';

test('renders task title', () => {
  render(<Task title="Test Task" />);
  expect(screen.getByText('Test Task')).toBeInTheDocument();
});
```

#### Integration Tests
```javascript
// API integration testing
import { server } from '../mocks/server';
import { rest } from 'msw';

test('creates new task', async () => {
  server.use(
    rest.post('/api/tasks', (req, res, ctx) => {
      return res(ctx.json({ id: 1, title: 'New Task' }));
    })
  );
  
  // Test implementation
});
```

#### E2E Tests
```javascript
// Cypress end-to-end testing
describe('Task Management', () => {
  it('should create and move tasks', () => {
    cy.visit('/');
    cy.get('[data-testid="add-task"]').click();
    cy.type('New Task');
    cy.get('[data-testid="save-task"]').click();
    // More test steps...
  });
});
```

## 📊 Performance Optimization

### Bundle Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Tree Shaking**: Remove unused code automatically
- **Dynamic Imports**: Lazy load components and utilities
- **Bundle Analysis**: Regular bundle size monitoring

### Runtime Performance
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Optimize expensive calculations
- **Virtualization**: Handle large lists efficiently
- **Image Optimization**: WebP, lazy loading, responsive images

### Caching Strategy
- **Service Worker**: Cache static assets and API responses
- **Browser Storage**: Persist user preferences and draft data
- **CDN**: Serve static assets from global edge locations
- **API Caching**: Intelligent cache invalidation

## 🛡️ Security & Best Practices

### Security Measures
- **Content Security Policy**: Prevent XSS attacks
- **Input Sanitization**: Clean user input before rendering
- **HTTPS Only**: Force secure connections in production
- **Environment Variables**: Keep sensitive data out of builds

### Accessibility
- **WCAG 2.1 AA**: Meet accessibility guidelines
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Color Contrast**: Sufficient contrast ratios

### SEO Optimization
- **Meta Tags**: Proper page titles and descriptions
- **Structured Data**: Schema.org markup
- **Open Graph**: Social media sharing optimization
- **Sitemap**: XML sitemap generation

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Write tests for new functionality
5. Run the test suite: `npm test`
6. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
7. Push to your branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Coding Standards
- **ES6+**: Use modern JavaScript features
- **Functional Components**: Prefer hooks over class components
- **TypeScript**: Type your props and state
- **Styled Components**: Use CSS-in-JS for styling
- **Accessibility**: Include ARIA labels and proper semantic HTML

### Pull Request Guidelines
- Include tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow the existing code style
- Include screenshots for UI changes

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built with ❤️ for modern project management**

*Experience the future of task management with AI-powered assistance, beautiful interfaces, and intuitive interactions.*
