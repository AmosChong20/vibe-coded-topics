const { ChatAnthropic } = require('@langchain/anthropic');
const { DynamicTool } = require('langchain/tools');
const { AgentExecutor, createReactAgent } = require('langchain/agents');
const { ChatPromptTemplate, MessagesPlaceholder } = require('@langchain/core/prompts');
const { pull } = require('langchain/hub');
const Task = require('../models/Task');
const Board = require('../models/Board');
const Column = require('../models/Column');

// Initialize the Anthropic model
const model = new ChatAnthropic({
  modelName: 'claude-sonnet-4-20250514',
  apiKey: process.env.ANTHROPIC_API_KEY,
  temperature: 0.7,
});

// Define tools for task operations
const createTaskTool = new DynamicTool({
  name: 'create_task',
  description: 'Create a new task in a specific column. Input should be a JSON object with title, description, columnId, and boardId. NOTE: columnId must be a numeric ID, not a column name - use find_column_by_name first if you have a column name.',
  func: async (input) => {
    try {
      const { title, description, columnId, boardId } = JSON.parse(input);
      
      // Validate inputs
      if (!title || !columnId || !boardId) {
        return JSON.stringify({ error: 'Title, columnId, and boardId are required' });
      }

      // Verify column exists and belongs to the board
      const column = await Column.findById(columnId);
      if (!column) {
        return JSON.stringify({ error: 'Column not found' });
      }
      
      if (column.board_id !== parseInt(boardId)) {
        return JSON.stringify({ error: 'Column does not belong to the specified board' });
      }

      // Create the task using the correct method signature
      const task = await Task.create(columnId, title, description || '');

      return JSON.stringify({ 
        success: true, 
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          column_id: task.column_id,
          created_at: task.created_at
        },
        message: `Task "${title}" created successfully in column "${column.title}"!`
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const createTaskByColumnNameTool = new DynamicTool({
  name: 'create_task_by_column_name',
  description: 'Create a new task in a column by specifying the column name. Input should be a JSON object with title, description, columnName, and boardId.',
  func: async (input) => {
    try {
      const { title, description, columnName, boardId } = JSON.parse(input);
      
      // Validate inputs
      if (!title || !columnName || !boardId) {
        return JSON.stringify({ error: 'Title, columnName, and boardId are required' });
      }

      // Find the column by name
      const columns = await Column.findByBoardId(boardId);
      const matchedColumn = columns.find(col => 
        col.title.toLowerCase() === columnName.toLowerCase()
      );
      
      if (!matchedColumn) {
        return JSON.stringify({ 
          error: 'Column not found', 
          availableColumns: columns.map(col => col.title),
          message: `Column "${columnName}" not found. Available columns: ${columns.map(col => col.title).join(', ')}`
        });
      }

      // Create the task using the found column ID
      const task = await Task.create(matchedColumn.id, title, description || '');

      return JSON.stringify({ 
        success: true, 
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          column_id: task.column_id,
          created_at: task.created_at
        },
        message: `Task "${title}" created successfully in column "${matchedColumn.title}"!`
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const getTasksTool = new DynamicTool({
  name: 'get_tasks',
  description: 'Get all tasks from a board or specific column. Input should be a JSON object with boardId and optionally columnId.',
  func: async (input) => {
    try {
      const { boardId, columnId } = JSON.parse(input);
      
      let tasks;
      
      if (columnId) {
        // Get tasks from specific column
        tasks = await Task.findByColumnId(columnId);
      } else {
        // Get all tasks from board
        tasks = await Task.findAll();
        // Filter by board (need to get board's columns first)
        const columns = await Column.findByBoardId(boardId);
        const columnIds = columns.map(col => col.id);
        tasks = tasks.filter(task => columnIds.includes(task.column_id));
      }

      return JSON.stringify({
        success: true,
        tasks: tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          created_at: task.created_at,
          column_id: task.column_id,
          position: task.position
        })),
        count: tasks.length
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const updateTaskTool = new DynamicTool({
  name: 'update_task',
  description: 'Update an existing task. Input should be a JSON object with taskId and the fields to update (title, description).',
  func: async (input) => {
    try {
      const { taskId, ...updates } = JSON.parse(input);
      
      if (!taskId) {
        return JSON.stringify({ error: 'Task ID is required' });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return JSON.stringify({ error: 'Task not found' });
      }

      // Use the correct update method signature
      const updatedTask = await Task.update(taskId, updates);
      if (!updatedTask) {
        return JSON.stringify({ error: 'Failed to update task' });
      }

      return JSON.stringify({
        success: true,
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          description: updatedTask.description,
          column_id: updatedTask.column_id,
          updated_at: updatedTask.updated_at
        },
        message: `Task "${updatedTask.title}" updated successfully!`
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const deleteTaskTool = new DynamicTool({
  name: 'delete_task',
  description: 'Delete a task by ID. Input should be a JSON object with taskId.',
  func: async (input) => {
    try {
      const { taskId } = JSON.parse(input);
      
      if (!taskId) {
        return JSON.stringify({ error: 'Task ID is required' });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return JSON.stringify({ error: 'Task not found' });
      }

      const taskTitle = task.title;

      // Delete the task using the correct method
      const deleted = await Task.delete(taskId);
      if (!deleted) {
        return JSON.stringify({ error: 'Failed to delete task' });
      }

      return JSON.stringify({
        success: true,
        message: `Task "${taskTitle}" deleted successfully!`
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const getColumnsTool = new DynamicTool({
  name: 'get_columns',
  description: 'Get all columns from a board. Input should be a JSON object with boardId.',
  func: async (input) => {
    try {
      const { boardId } = JSON.parse(input);
      
      if (!boardId) {
        return JSON.stringify({ error: 'Board ID is required' });
      }

      const columns = await Column.findByBoardId(boardId);

      // Get task counts for each column
      const columnsWithTaskInfo = await Promise.all(
        columns.map(async (column) => {
          const tasks = await Task.findByColumnId(column.id);
          return {
            id: column.id,
            title: column.title,
            position: column.position,
            task_count: tasks.length,
            created_at: column.created_at
          };
        })
      );

      return JSON.stringify({
        success: true,
        columns: columnsWithTaskInfo
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const findColumnByNameTool = new DynamicTool({
  name: 'find_column_by_name',
  description: 'Find a column by its name/title. Input should be a JSON object with boardId and columnName.',
  func: async (input) => {
    try {
      const { boardId, columnName } = JSON.parse(input);
      
      if (!boardId || !columnName) {
        return JSON.stringify({ error: 'Board ID and column name are required' });
      }

      const columns = await Column.findByBoardId(boardId);
      
      // Find column by name (case-insensitive)
      const matchedColumn = columns.find(col => 
        col.title.toLowerCase() === columnName.toLowerCase()
      );
      
      if (!matchedColumn) {
        return JSON.stringify({ 
          error: 'Column not found', 
          availableColumns: columns.map(col => col.title),
          message: `Column "${columnName}" not found. Available columns: ${columns.map(col => col.title).join(', ')}`
        });
      }

      return JSON.stringify({
        success: true,
        column: {
          id: matchedColumn.id,
          title: matchedColumn.title,
          position: matchedColumn.position
        }
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const moveTaskTool = new DynamicTool({
  name: 'move_task',
  description: 'Move a task from one column to another. Input should be a JSON object with taskId, sourceColumnId, and destinationColumnId.',
  func: async (input) => {
    try {
      const { taskId, sourceColumnId, destinationColumnId } = JSON.parse(input);
      
      if (!taskId || !sourceColumnId || !destinationColumnId) {
        return JSON.stringify({ error: 'Task ID, source column ID, and destination column ID are required' });
      }

      // Get the task to verify it exists and get its current position
      const task = await Task.findById(taskId);
      if (!task) {
        return JSON.stringify({ error: 'Task not found' });
      }

      // Verify columns exist
      const sourceColumn = await Column.findById(sourceColumnId);
      const destinationColumn = await Column.findById(destinationColumnId);
      
      if (!sourceColumn) {
        return JSON.stringify({ error: 'Source column not found' });
      }
      
      if (!destinationColumn) {
        return JSON.stringify({ error: 'Destination column not found' });
      }

      // Get tasks in destination column to calculate destination position
      const destinationTasks = await Task.findByColumnId(destinationColumnId);
      const destinationIndex = destinationTasks.length; // Add to end of column

      // Use the existing Task.move method
      const moveData = {
        sourceColumnId: parseInt(sourceColumnId),
        destinationColumnId: parseInt(destinationColumnId),
        sourceIndex: task.position,
        destinationIndex: destinationIndex
      };

      await Task.move(taskId, moveData);

      return JSON.stringify({
        success: true,
        message: `Task "${task.title}" moved from "${sourceColumn.title}" to "${destinationColumn.title}" successfully!`
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const moveTaskByColumnNameTool = new DynamicTool({
  name: 'move_task_by_column_name',
  description: 'Move a task to a column by specifying column names. Input should be a JSON object with taskId, sourceColumnName, destinationColumnName, and boardId.',
  func: async (input) => {
    try {
      const { taskId, sourceColumnName, destinationColumnName, boardId } = JSON.parse(input);
      
      if (!taskId || !sourceColumnName || !destinationColumnName || !boardId) {
        return JSON.stringify({ error: 'Task ID, source column name, destination column name, and board ID are required' });
      }

      // Get the task to verify it exists
      const task = await Task.findById(taskId);
      if (!task) {
        return JSON.stringify({ error: 'Task not found' });
      }

      // Find columns by name
      const columns = await Column.findByBoardId(boardId);
      const sourceColumn = columns.find(col => 
        col.title.toLowerCase() === sourceColumnName.toLowerCase()
      );
      const destinationColumn = columns.find(col => 
        col.title.toLowerCase() === destinationColumnName.toLowerCase()
      );
      
      if (!sourceColumn) {
        return JSON.stringify({ 
          error: 'Source column not found', 
          availableColumns: columns.map(col => col.title),
          message: `Source column "${sourceColumnName}" not found. Available columns: ${columns.map(col => col.title).join(', ')}`
        });
      }
      
      if (!destinationColumn) {
        return JSON.stringify({ 
          error: 'Destination column not found', 
          availableColumns: columns.map(col => col.title),
          message: `Destination column "${destinationColumnName}" not found. Available columns: ${columns.map(col => col.title).join(', ')}`
        });
      }

      // Get tasks in destination column to calculate destination position
      const destinationTasks = await Task.findByColumnId(destinationColumn.id);
      const destinationIndex = destinationTasks.length; // Add to end of column

      // Use the existing Task.move method
      const moveData = {
        sourceColumnId: sourceColumn.id,
        destinationColumnId: destinationColumn.id,
        sourceIndex: task.position,
        destinationIndex: destinationIndex
      };

      await Task.move(taskId, moveData);

      return JSON.stringify({
        success: true,
        message: `Task "${task.title}" moved from "${sourceColumn.title}" to "${destinationColumn.title}" successfully!`
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

const findTaskByNameTool = new DynamicTool({
  name: 'find_task_by_name',
  description: 'Find tasks by their title/name. Input should be a JSON object with boardId and taskName.',
  func: async (input) => {
    try {
      const { boardId, taskName } = JSON.parse(input);
      
      if (!boardId || !taskName) {
        return JSON.stringify({ error: 'Board ID and task name are required' });
      }

      // Get all tasks from the board
      const columns = await Column.findByBoardId(boardId);
      const columnIds = columns.map(col => col.id);
      
      let allTasks = [];
      for (const columnId of columnIds) {
        const tasks = await Task.findByColumnId(columnId);
        allTasks = allTasks.concat(tasks);
      }

      // Find tasks that match the name (case-insensitive partial match)
      const matchingTasks = allTasks.filter(task => 
        task.title.toLowerCase().includes(taskName.toLowerCase())
      );

      if (matchingTasks.length === 0) {
        return JSON.stringify({ 
          error: 'No tasks found',
          message: `No tasks found with name containing "${taskName}"`
        });
      }

      // Get column information for each task
      const tasksWithColumns = await Promise.all(
        matchingTasks.map(async (task) => {
          const column = columns.find(col => col.id === task.column_id);
          return {
            id: task.id,
            title: task.title,
            description: task.description,
            column_id: task.column_id,
            column_name: column ? column.title : 'Unknown',
            position: task.position,
            created_at: task.created_at
          };
        })
      );

      return JSON.stringify({
        success: true,
        tasks: tasksWithColumns,
        count: tasksWithColumns.length
      });
    } catch (error) {
      return JSON.stringify({ error: error.message });
    }
  },
});

// Create the agent
const tools = [createTaskTool, createTaskByColumnNameTool, getTasksTool, updateTaskTool, deleteTaskTool, getColumnsTool, findColumnByNameTool, moveTaskTool, moveTaskByColumnNameTool, findTaskByNameTool];

// AI Agent endpoint
const chatWithAgent = async (req, res) => {
  try {
    const { message, boardId } = req.body;

    if (!message || !boardId) {
      return res.status(400).json({ error: 'Message and boardId are required' });
    }

    // Verify board exists
    const board = await Board.findByPk(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    // Create a simple prompt template for React agent
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are a helpful task management assistant for a Kanban board application. You can help users manage their tasks efficiently across different columns.

## Your capabilities:

1. **View tasks and columns**: Show tasks from the board or specific columns, and display available columns
2. **Create tasks**: Add new tasks to any column with titles and descriptions  
3. **Update tasks**: Modify existing tasks (change title, description, or other details)
4. **Move tasks**: Move tasks between columns (from To Do to In Progress, etc.)
5. **Delete tasks**: Remove tasks from the board when no longer needed

## How to interact with users:

- When users ask to create tasks but don't specify a column, first show available columns and ask which one they prefer
- When users mention tasks by name/title, search for them first to get the exact task ID
- When users ask to move tasks, identify the source and destination columns clearly
- Present information in a clean, organized way
- Be proactive - if a user asks about a task, also show related information like what column it's in
- Always confirm destructive actions (like deleting tasks) before executing

## Current board context:
- Board ID: ${boardId}
- Available tools: create_task, create_task_by_column_name, get_tasks, update_task, move_task, move_task_by_column_name, delete_task, get_columns, find_column_by_name, find_task_by_name

## Guidelines:
- **For creating tasks**: Use create_task_by_column_name when users mention column names (like "add task to Done column"). This is the preferred method for most task creation requests
- **For moving tasks**: Use move_task_by_column_name when users mention column names (like "move task to In Progress"). This is the preferred method for most task moving requests
- **For finding tasks**: Use find_task_by_name when users mention task names (like "find the login bug task")
- **For updating/deleting tasks**: Find the task first using find_task_by_name, then use the task ID
- **Always be explicit about which column**: When users don't specify a column, show available columns and ask for clarification
- **For moving tasks by name**: First use find_task_by_name to get the task ID, then find the current column, then use move_task_by_column_name
- Present results in a user-friendly format with clear confirmation messages

You have access to the following tools:
{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question`],
      ['human', '{input}'],
      new MessagesPlaceholder({ variableName: 'agent_scratchpad' }),
    ]);

    // Create agent
    const agent = await createReactAgent({
      llm: model,
      tools,
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
      maxIterations: 5,
    });

    // Execute the agent
    const result = await agentExecutor.invoke({
      input: message,
    });

    res.json({
      success: true,
      response: result.output,
      boardId: boardId
    });

  } catch (error) {
    console.error('AI Agent error:', error);
    res.status(500).json({ 
      error: 'Failed to process your request. Please try again.',
      details: error.message 
    });
  }
};

// Get conversation history (simple implementation)
const getConversationHistory = async (req, res) => {
  try {
    const { boardId } = req.params;
    
    // For now, return empty history - could be extended to store conversation history
    res.json({
      success: true,
      history: [],
      boardId: boardId
    });
  } catch (error) {
    console.error('Error getting conversation history:', error);
    res.status(500).json({ error: 'Failed to get conversation history' });
  }
};

module.exports = {
  chatWithAgent,
  getConversationHistory
}; 