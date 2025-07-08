import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import styled, { keyframes } from 'styled-components';
import Board from './components/Board';
import Header from './components/Header';
import Task from './components/Task';
import { boardsAPI, tasksAPI } from './services/api';
import './App.css';

// Color themes for columns (copied from Column component)
const getColumnTheme = (index) => {
  const themes = [
    {
      name: 'Ocean',
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#4facfe',
      light: 'rgba(102, 126, 234, 0.1)',
      border: 'rgba(102, 126, 234, 0.2)',
      emoji: '🌊'
    },
    {
      name: 'Sunset',
      primary: '#f093fb',
      secondary: '#f5576c',
      accent: '#ff9a9e',
      light: 'rgba(240, 147, 251, 0.1)',
      border: 'rgba(240, 147, 251, 0.2)',
      emoji: '🌅'
    },
    {
      name: 'Forest',
      primary: '#56ab2f',
      secondary: '#a8e6cf',
      accent: '#4caf50',
      light: 'rgba(86, 171, 47, 0.1)',
      border: 'rgba(86, 171, 47, 0.2)',
      emoji: '🌲'
    },
    {
      name: 'Cosmic',
      primary: '#9c27b0',
      secondary: '#673ab7',
      accent: '#e91e63',
      light: 'rgba(156, 39, 176, 0.1)',
      border: 'rgba(156, 39, 176, 0.2)',
      emoji: '✨'
    },
    {
      name: 'Fire',
      primary: '#ff6b6b',
      secondary: '#ffa726',
      accent: '#ff7043',
      light: 'rgba(255, 107, 107, 0.1)',
      border: 'rgba(255, 107, 107, 0.2)',
      emoji: '🔥'
    },
    {
      name: 'Sky',
      primary: '#00bcd4',
      secondary: '#03a9f4',
      accent: '#2196f3',
      light: 'rgba(0, 188, 212, 0.1)',
      border: 'rgba(0, 188, 212, 0.2)',
      emoji: '☁️'
    }
  ];
  
  return themes[index % themes.length];
};

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const AppContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  height: 100vh;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  position: relative;
  z-index: 1;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 100vw;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const BoardsContainer = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.6s ease-out;
  width: 100%;
  height: 100%;
  
  @media (max-width: 768px) {
    gap: 16px;
    flex-direction: column;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: white;
  font-size: 18px;
  gap: 20px;
`;

const LoadingAnimation = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin: 20px;
  text-align: center;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 0.3s ease-out;
  
  &::before {
    content: '⚠️';
    display: block;
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const EmptyStateIcon = styled.div`
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.6;
`;

const EmptyStateTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const EmptyStateDescription = styled.p`
  font-size: 18px;
  opacity: 0.8;
  max-width: 400px;
  line-height: 1.6;
  margin: 0;
`;

function App() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [activeTaskTheme, setActiveTaskTheme] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [boardsData, tasksData] = await Promise.all([
        boardsAPI.getBoards(),
        tasksAPI.getTasks()
      ]);
      setBoards(boardsData);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const draggedTask = tasks.find(task => String(task.id) === active.id);
    
    if (draggedTask) {
      setActiveTask(draggedTask);
      
      // Find the task's column to get the theme
      const sourceBoard = boards.find(board => 
        board.columns.some(col => col.taskIds.includes(String(draggedTask.id)))
      );
      const sourceColumn = sourceBoard?.columns.find(col => 
        col.taskIds.includes(String(draggedTask.id))
      );
      
      if (sourceColumn) {
        const columnIndex = sourceBoard.columns.indexOf(sourceColumn);
        const theme = getColumnTheme(columnIndex);
        setActiveTaskTheme(theme);
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    // Clear the active task
    setActiveTask(null);
    setActiveTaskTheme(null);
    
    if (!over) {
      return;
    }
    
    const activeTask = tasks.find(task => String(task.id) === active.id);
    if (!activeTask) {
      return;
    }
    
    const overData = over.data.current;
    
    if (!overData) {
      return;
    }
    
    let targetBoardId, targetColumnId;
    
    if (overData.type === 'column') {
      // Dropping directly over a column
      targetBoardId = overData.boardId;
      targetColumnId = overData.columnId;
    } else if (overData.type === 'task') {
      // Dropping over a task within a column
      targetBoardId = overData.boardId;
      targetColumnId = overData.columnId;
    } else {
      return;
    }
    
    // Store original state for rollback
    const originalBoards = [...boards];
    const originalTasks = [...tasks];
    
    // Find source and target columns
    const sourceBoard = boards.find(board => 
      board.columns.some(col => col.taskIds.includes(String(activeTask.id)))
    );
    const sourceColumn = sourceBoard?.columns.find(col => 
      col.taskIds.includes(String(activeTask.id))
    );
    
    const targetBoard = boards.find(board => board.id === targetBoardId);
    const targetColumn = targetBoard?.columns.find(col => col.id === targetColumnId);
    
    if (!sourceColumn || !targetColumn) {
      return;
    }
    
    // Don't move if it's the same position
    if (sourceColumn.id === targetColumn.id) {
      return;
    }
    
    // Optimistic update
    const newBoards = boards.map(board => {
      if (board.id === sourceBoard.id && board.id === targetBoardId) {
        // Moving within the same board
        return {
          ...board,
          columns: board.columns.map(col => {
            if (col.id === sourceColumn.id) {
              return {
                ...col,
                taskIds: col.taskIds.filter(id => id !== String(activeTask.id))
              };
            }
            if (col.id === targetColumnId) {
              return {
                ...col,
                taskIds: [...col.taskIds, String(activeTask.id)]
              };
            }
            return col;
          })
        };
      } else if (board.id === sourceBoard.id) {
        // Removing from source board
        return {
          ...board,
          columns: board.columns.map(col => {
            if (col.id === sourceColumn.id) {
              return {
                ...col,
                taskIds: col.taskIds.filter(id => id !== String(activeTask.id))
              };
            }
            return col;
          })
        };
      } else if (board.id === targetBoardId) {
        // Adding to target board
        return {
          ...board,
          columns: board.columns.map(col => {
            if (col.id === targetColumnId) {
              return {
                ...col,
                taskIds: [...col.taskIds, String(activeTask.id)]
              };
            }
            return col;
          })
        };
      }
      return board;
    });
    
    // Update the task itself
    const updatedTasks = tasks.map(task => 
      task.id === activeTask.id 
        ? { ...task, column_id: targetColumnId, board_id: targetBoardId }
        : task
    );
    
    setBoards(newBoards);
    setTasks(updatedTasks);
    
    try {
      // API call to move task
      await tasksAPI.moveTask(activeTask.id, {
        sourceColumnId: sourceColumn.id,
        destinationColumnId: targetColumnId,
        sourceIndex: sourceColumn.taskIds.indexOf(String(activeTask.id)),
        destinationIndex: targetColumn.taskIds.length
      });
    } catch (err) {
      // Rollback optimistic update on error
      setBoards(originalBoards);
      setTasks(originalTasks);
      setError('Failed to move task. Please try again.');
      console.error('Error moving task:', err);
    }
  };

  const handleCreateBoard = async (title) => {
    try {
      const newBoard = await boardsAPI.createBoard(title);
      setBoards([...boards, newBoard]);
    } catch (err) {
      setError('Failed to create board. Please try again.');
      console.error('Error creating board:', err);
    }
  };

  const handleCreateColumn = async (boardId, title) => {
    try {
      const newColumn = await boardsAPI.createColumn(boardId, title);
      setBoards(boards.map(board => 
        board.id === boardId 
          ? { ...board, columns: [...board.columns, newColumn] }
          : board
      ));
    } catch (err) {
      setError('Failed to create column. Please try again.');
      console.error('Error creating column:', err);
    }
  };

  const handleCreateTask = async (boardId, columnId, title, description) => {
    try {
      const newTask = await tasksAPI.createTask(title, description, columnId, boardId);
      setTasks([...tasks, newTask]);
      // Update the board's column taskIds
      setBoards(boards.map(board => 
        board.id === boardId 
          ? {
              ...board,
              columns: board.columns.map(column =>
                column.id === columnId
                  ? { ...column, taskIds: [...column.taskIds, String(newTask.id)] }
                  : column
              )
            }
          : board
      ));
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      // Remove task from all columns
      setBoards(boards.map(board => ({
        ...board,
        columns: board.columns.map(column => ({
          ...column,
          taskIds: column.taskIds.filter(id => id !== String(taskId))
        }))
      })));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const handleRefreshBoard = async () => {
    try {
      const [boardsData, tasksData] = await Promise.all([
        boardsAPI.getBoards(),
        tasksAPI.getTasks()
      ]);
      setBoards(boardsData);
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to refresh board data. Please try again.');
      console.error('Error refreshing board data:', err);
    }
  };

  if (loading) {
    return (
      <AppContainer>
        <Header onCreateBoard={handleCreateBoard} />
        <LoadingSpinner>
          <LoadingAnimation />
          <LoadingText>✨ Loading your boards...</LoadingText>
        </LoadingSpinner>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Header onCreateBoard={handleCreateBoard} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <MainContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <BoardsContainer>
            {boards.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon>🎯</EmptyStateIcon>
                <EmptyStateTitle>Welcome to Task Tiles!</EmptyStateTitle>
                <EmptyStateDescription>
                  Create your first board to start organizing your tasks in a beautiful, visual way.
                </EmptyStateDescription>
              </EmptyState>
            ) : (
              boards.map(board => (
                <Board
                  key={board.id}
                  board={board}
                  tasks={tasks}
                  onCreateColumn={handleCreateColumn}
                  onCreateTask={handleCreateTask}
                  onDeleteTask={handleDeleteTask}
                  onRefreshBoard={handleRefreshBoard}
                />
              ))
            )}
          </BoardsContainer>
          
          <DragOverlay dropAnimation={null}>
            {activeTask && activeTaskTheme && (
              <Task
                task={activeTask}
                boardId="overlay"
                columnId="overlay"
                onDeleteTask={() => {}}
                columnTheme={activeTaskTheme}
                isOverlay={true}
              />
            )}
          </DragOverlay>
        </DndContext>
      </MainContent>
    </AppContainer>
  );
}

export default App;
