# Task Tiles Frontend

A modern, responsive React frontend for the Task Tiles project management application. Built with React, styled-components, and drag-and-drop functionality inspired by Trello.

## Features

- **Intuitive Interface**: Clean, modern design with glass morphism effects
- **Drag & Drop**: Smooth drag-and-drop functionality for moving tasks between columns
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live updates when tasks are moved or created
- **Modern UI Components**: Styled with styled-components for consistency
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Loading indicators for better user experience

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Task Tiles Backend API running on port 3001

## Installation Steps

1. Clone the repository and navigate to the frontend directory:
   ```bash
   cd task-tiles-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application uses the following environment variables:

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:3001)

You can create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:3001
```

## Running the Application

### Development Mode
```bash
npm start
```

The application will start on `http://localhost:3000`

### Production Build
```bash
npm run build
```

This creates a `build` folder with the production build.

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Project Structure

```
task-tiles-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.js      # Main header with create board functionality
│   │   ├── Board.js       # Board component containing columns
│   │   ├── Column.js      # Column component with drag-drop zones
│   │   └── Task.js        # Individual task tile component
│   ├── services/
│   │   └── api.js         # API service for backend communication
│   ├── App.js             # Main application component
│   ├── App.css            # Global styles
│   └── index.js           # Application entry point
├── package.json           # Dependencies and scripts
├── Dockerfile             # Docker configuration
├── nginx.conf             # Nginx configuration for production
└── README.md              # This file
```

## Components

### Header
- Application title and branding
- Create new board functionality
- Modal for board creation

### Board
- Board title and management
- Add new columns
- Container for columns

### Column
- Column title and task count
- Add new tasks
- Drag-and-drop zone for tasks
- Scrollable task list

### Task
- Task title and description
- Drag handle for reordering
- Delete functionality with confirmation
- Visual feedback during drag operations

## Styling

The application uses a modern design system with:
- **Glass morphism effects**: Translucent backgrounds with blur effects
- **Gradient backgrounds**: Beautiful color gradients
- **Smooth animations**: CSS transitions and hover effects
- **Responsive layout**: Mobile-first design approach
- **Consistent spacing**: Standardized padding and margins

## Docker Setup

### Build Docker Image
```bash
docker build -t task-tiles-frontend .
```

### Run Docker Container
```bash
docker run -p 80:80 task-tiles-frontend
```

### Run with Custom API URL
```bash
docker run -p 80:80 -e REACT_APP_API_URL=https://your-api-domain.com task-tiles-frontend
```

## Cloud Deployment

This application is containerized and ready for deployment to any cloud platform.

### AWS S3 + CloudFront
1. Build the application: `npm run build`
2. Upload `build` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Docker-based Deployment

#### Google Cloud Run
```bash
gcloud run deploy task-tiles-frontend --image gcr.io/PROJECT_ID/task-tiles-frontend --platform managed
```

#### AWS ECS
1. Push image to ECR
2. Create ECS task definition
3. Deploy to ECS cluster

#### Azure Container Instances
```bash
az container create --resource-group myResourceGroup --name task-tiles-frontend --image task-tiles-frontend --ports 80
```

#### Heroku
```bash
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

## API Integration

The frontend communicates with the backend through the API service (`src/services/api.js`):

- **Boards API**: Create, read, update, delete boards
- **Tasks API**: Manage tasks and handle drag-drop operations
- **Error Handling**: Automatic retry and error reporting
- **Request Logging**: Console logging for debugging

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- **Code splitting**: Automatic code splitting with React
- **Image optimization**: Optimized images and icons
- **Caching**: Aggressive caching of static assets
- **Gzip compression**: Enabled in production build
- **Bundle analysis**: Use `npm run build` to analyze bundle size

## Development

### Available Scripts

- `npm start`: Start development server
- `npm run build`: Create production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App (⚠️ irreversible)

### Adding New Features

1. Create new components in `src/components/`
2. Update API service if needed
3. Add new routes or state management
4. Update styling and responsiveness
5. Test on different devices

### Customization

You can customize the application by:
- Modifying colors in styled-components
- Changing the gradient backgrounds
- Adding new animations
- Extending the API service
- Adding new component features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Troubleshooting

### Common Issues

1. **API Connection Failed**: Check if backend is running on port 3001
2. **Drag and Drop Not Working**: Ensure all required dependencies are installed
3. **Styling Issues**: Clear browser cache and check for CSS conflicts
4. **Build Errors**: Delete `node_modules` and reinstall dependencies

### Getting Help

- Check the browser console for error messages
- Verify backend API is accessible
- Ensure all environment variables are set correctly
- Check network connectivity to backend
