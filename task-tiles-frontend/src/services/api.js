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

export default api; 