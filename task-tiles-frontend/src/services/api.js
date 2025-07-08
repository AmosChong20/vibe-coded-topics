import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

// Enhanced AI Agent Service with Real Actions
const AIAgent = {
  // Parse user intent and extract task details
  parseCreateTaskIntent: (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Extract task title - look for patterns like "create task called X" or "add task X"
    let taskTitle = null;
    let taskDescription = null;
    
    const patterns = [
      /create task called "([^"]+)"/,
      /create task called ([^,\.!?\n]+)/,
      /add task "([^"]+)"/,
      /add task ([^,\.!?\n]+)/,
      /new task "([^"]+)"/,
      /new task ([^,\.!?\n]+)/,
      /make task "([^"]+)"/,
      /make task ([^,\.!?\n]+)/,
      /create "([^"]+)"/,
      /add "([^"]+)"/
    ];
    
    for (const pattern of patterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        taskTitle = match[1].trim();
        break;
      }
    }
    
    // If no specific pattern found, try to extract after key phrases
    if (!taskTitle) {
      const keyPhrases = ['create task', 'add task', 'new task', 'make task', 'create', 'add'];
      for (const phrase of keyPhrases) {
        const index = lowerMessage.indexOf(phrase);
        if (index !== -1) {
          const afterPhrase = message.substring(index + phrase.length).trim();
          if (afterPhrase.length > 0) {
            // Take everything until punctuation or "with description"
            const titleMatch = afterPhrase.match(/^([^,\.!?\n]+?)(?:\s+with description|\s+described as|$)/);
            if (titleMatch) {
              taskTitle = titleMatch[1].trim();
            }
          }
          break;
        }
      }
    }
    
    // Look for description
    const descPatterns = [
      /with description "([^"]+)"/,
      /described as "([^"]+)"/,
      /description: "([^"]+)"/,
      /with description ([^,\.!?\n]+)/,
      /described as ([^,\.!?\n]+)/
    ];
    
    for (const pattern of descPatterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        taskDescription = match[1].trim();
        break;
      }
    }
    
    return { taskTitle, taskDescription };
  },

  // Generate task summary
  generateTaskSummary: (tasks, board) => {
    if (!tasks || tasks.length === 0) {
      return "📋 Your board is currently empty. Ready to add your first task!";
    }
    
    let summary = `📋 **${board.title}** - Task Summary:\n\n`;
    
    // Group tasks by column
    const tasksByColumn = {};
    board.columns.forEach(column => {
      tasksByColumn[column.id] = {
        title: column.title,
        tasks: tasks.filter(task => column.taskIds && column.taskIds.includes(String(task.id)))
      };
    });
    
    // Display tasks by column
    board.columns.forEach(column => {
      const columnTasks = tasksByColumn[column.id].tasks;
      summary += `**${column.title}** (${columnTasks.length} tasks):\n`;
      
      if (columnTasks.length === 0) {
        summary += `  • No tasks yet\n`;
      } else {
        columnTasks.forEach(task => {
          summary += `  • ${task.title}${task.description ? ` - ${task.description.substring(0, 50)}${task.description.length > 50 ? '...' : ''}` : ''}\n`;
        });
      }
      summary += `\n`;
    });
    
    return summary.trim();
  },

  // Generate progress report
  generateProgressReport: (tasks, board) => {
    if (!tasks || tasks.length === 0) {
      return "📊 No tasks to track yet. Create some tasks to see your progress!";
    }
    
    const totalTasks = tasks.length;
    let report = `📊 **Progress Report for ${board.title}**\n\n`;
    
    // Calculate tasks per column
    const tasksByColumn = {};
    board.columns.forEach(column => {
      const columnTasks = tasks.filter(task => column.taskIds && column.taskIds.includes(String(task.id)));
      tasksByColumn[column.title] = columnTasks.length;
    });
    
    report += `**Total Tasks:** ${totalTasks}\n\n`;
    
    // Show distribution
    board.columns.forEach(column => {
      const count = tasksByColumn[column.title] || 0;
      const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
      report += `**${column.title}:** ${count} tasks (${percentage}%)\n`;
    });
    
    // Add motivation
    const completionColumn = board.columns.find(col => 
      col.title.toLowerCase().includes('done') || 
      col.title.toLowerCase().includes('complete') ||
      col.title.toLowerCase().includes('finished')
    );
    
    if (completionColumn) {
      const completedTasks = tasksByColumn[completionColumn.title] || 0;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      report += `\n🎯 **Completion Rate:** ${completionRate}%`;
      
      if (completionRate >= 80) {
        report += ` - Excellent work! 🎉`;
      } else if (completionRate >= 50) {
        report += ` - Good progress! Keep it up! 💪`;
      } else {
        report += ` - Just getting started! You've got this! 🚀`;
      }
    }
    
    return report;
  },

  // Process user message and determine action
  processMessage: async (message, board, tasks, actions) => {
    const lowerMessage = message.toLowerCase();
    
    // Show tasks
    if (lowerMessage.includes('show') || lowerMessage.includes('list') || lowerMessage.includes('view') || lowerMessage.includes('see')) {
      if (lowerMessage.includes('task')) {
        return {
          type: 'info',
          response: AIAgent.generateTaskSummary(tasks, board)
        };
      }
    }
    
    // Progress check
    if (lowerMessage.includes('progress') || lowerMessage.includes('status') || lowerMessage.includes('report')) {
      return {
        type: 'info',
        response: AIAgent.generateProgressReport(tasks, board)
      };
    }
    
    // Create task
    if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new')) {
      if (lowerMessage.includes('task')) {
        const parsed = AIAgent.parseCreateTaskIntent(message);
        
        if (parsed.taskTitle) {
          // Find the first column to add the task to
          const firstColumn = board.columns[0];
          if (firstColumn && actions.onCreateTask) {
            try {
              await actions.onCreateTask(
                board.id, 
                firstColumn.id, 
                parsed.taskTitle, 
                parsed.taskDescription || ''
              );
              
              return {
                type: 'action',
                response: `✅ Successfully created task: "${parsed.taskTitle}"${parsed.taskDescription ? ` with description: "${parsed.taskDescription}"` : ''}\n\nAdded to the "${firstColumn.title}" column. You can drag it to other columns as needed!`
              };
            } catch (error) {
              return {
                type: 'error',
                response: `❌ Sorry, I couldn't create the task. Please try again or use the Add Task button directly.`
              };
            }
          } else {
            return {
              type: 'error',
              response: `❌ No columns available to add tasks. Please create a column first!`
            };
          }
        } else {
          return {
            type: 'info',
            response: `I'd be happy to create a task for you! Please tell me what task you'd like to create. For example:\n• "Create task called 'Review code'"\n• "Add task 'Buy groceries' with description 'Get milk and bread'"\n• "New task 'Team meeting'"`
          };
        }
      }
    }
    
    // Delete task (be careful with this)
    if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
      return {
        type: 'info',
        response: `🗑️ To delete a task, hover over any task card and click the delete button that appears. I can't delete tasks directly for safety reasons, but you can easily do it from the task cards!`
      };
    }
    
    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do') || lowerMessage.includes('commands')) {
      return {
        type: 'info',
        response: `🤖 **Here's what I can do for you:**\n\n**View Information:**\n• "Show me all tasks" - Display all your tasks\n• "What's my progress?" - Get a progress report\n• "List tasks" - See task breakdown by column\n\n**Create Tasks:**\n• "Create task called [title]" - Add a new task\n• "Add task [title] with description [desc]" - Add task with details\n• "New task [title]" - Quick task creation\n\n**Get Help:**\n• "Help" - Show this help message\n• "What can you do?" - See available commands\n\nTry asking me to create a task or show your current tasks!`
      };
    }
    
    // Default response
    const responses = [
      `I'm here to help you manage your tasks! I can show you your current tasks, create new ones, or provide progress reports. What would you like me to do?`,
      `Ready to help! You can ask me to:\n• Show your tasks\n• Create a new task\n• Check your progress\n• Get help with commands\n\nWhat can I help you with?`,
      `I can help you stay organized! Try asking me to "show tasks", "create a task", or "check progress". What would you like to do?`
    ];
    
    return {
      type: 'info',
      response: responses[Math.floor(Math.random() * responses.length)]
    };
  }
};

export const boardsAPI = {
  getBoards: async () => {
    try {
      const response = await api.get('/api/boards');
      return response.data;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  },

  getBoard: async (id) => {
    try {
      const response = await api.get(`/api/boards/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching board:', error);
      throw error;
    }
  },

  createBoard: async (title) => {
    try {
      const response = await api.post('/api/boards', { title });
      return response.data;
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  },

  updateBoard: async (id, data) => {
    try {
      const response = await api.put(`/api/boards/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating board:', error);
      throw error;
    }
  },

  deleteBoard: async (id) => {
    try {
      await api.delete(`/api/boards/${id}`);
    } catch (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  },

  createColumn: async (boardId, title) => {
    try {
      const response = await api.post(`/api/boards/${boardId}/columns`, { title });
      return response.data;
    } catch (error) {
      console.error('Error creating column:', error);
      throw error;
    }
  },

  updateColumn: async (boardId, columnId, data) => {
    try {
      const response = await api.put(`/api/boards/${boardId}/columns/${columnId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating column:', error);
      throw error;
    }
  },

  deleteColumn: async (boardId, columnId) => {
    try {
      await api.delete(`/api/boards/${boardId}/columns/${columnId}`);
    } catch (error) {
      console.error('Error deleting column:', error);
      throw error;
    }
  },
};

export const tasksAPI = {
  getTasks: async () => {
    try {
      const response = await api.get('/api/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getTask: async (id) => {
    try {
      const response = await api.get(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  createTask: async (title, description, columnId, boardId) => {
    try {
      const response = await api.post('/api/tasks', {
        title,
        description,
        columnId,
        boardId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (id, data) => {
    try {
      const response = await api.put(`/api/tasks/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  moveTask: async (taskId, moveData) => {
    try {
      const response = await api.post(`/api/tasks/${taskId}/move`, moveData);
      return response.data;
    } catch (error) {
      console.error('Error moving task:', error);
      throw error;
    }
  },
};

export const aiAgentAPI = {
  chat: async (message, board, tasks, actions) => {
    try {
      // Simulate API delay for realistic experience
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const result = await AIAgent.processMessage(message, board, tasks, actions);
      
      return {
        response: result.response,
        type: result.type,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw error;
    }
  }
};

export default api; 