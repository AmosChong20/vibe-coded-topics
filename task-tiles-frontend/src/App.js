import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import styled from 'styled-components';
import Board from './components/Board';
import Header from './components/Header';
import { boardsAPI, tasksAPI } from './services/api';
import './App.css';

const AppContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const MainContent = styled.div`
  padding: 20px;
`;

const BoardsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: white;
  font-size: 18px;
`;

const ErrorMessage = styled.div`
  background: #ff4757;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 20px;
  text-align: center;
`;

function App() {
  const [boards, setBoards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Get data from the active item (task being dragged)
    const activeData = active.data.current;
    
    if (!activeData) return;

    const sourceBoardId = activeData.boardId;
    const sourceColumnId = activeData.columnId;

    // Determine destination based on what was dropped on
    let destinationBoardId, destinationColumnId;
    
    if (over.data.current?.type === 'column') {
      // Dropped on a column
      destinationBoardId = over.data.current.boardId;
      destinationColumnId = over.data.current.columnId;
    } else {
      // Dropped on another task or empty area
      const overData = over.data.current;
      if (overData) {
        destinationBoardId = overData.boardId;
        destinationColumnId = overData.columnId;
      } else {
        // Try to parse column ID from over.id (format: "boardId-columnId")
        const parts = String(overId).split('-');
        if (parts.length === 2) {
          destinationBoardId = parseInt(parts[0]);
          destinationColumnId = parseInt(parts[1]);
        } else {
          return; // Can't determine destination
        }
      }
    }

    // Don't do anything if dropped in the same place
    if (sourceBoardId === destinationBoardId && sourceColumnId === destinationColumnId) {
      return;
    }

    // Store original state for potential rollback
    const originalBoards = [...boards];

    try {
      // Find source and destination indices
      const sourceBoard = boards.find(board => board.id === sourceBoardId);
      const sourceColumn = sourceBoard?.columns.find(col => col.id === sourceColumnId);
      const sourceIndex = sourceColumn?.taskIds.indexOf(String(activeId)) || 0;

      const destinationBoard = boards.find(board => board.id === destinationBoardId);
      const destinationColumn = destinationBoard?.columns.find(col => col.id === destinationColumnId);
      const destinationIndex = destinationColumn?.taskIds.length || 0;

      // Optimistic update for immediate UI feedback
      const optimisticBoards = boards.map(board => {
        if (board.id === sourceBoardId || board.id === destinationBoardId) {
          const newColumns = board.columns.map(column => {
            // Remove from source column
            if (column.id === sourceColumnId) {
              const newTaskIds = [...column.taskIds];
              newTaskIds.splice(sourceIndex, 1);
              return { ...column, taskIds: newTaskIds };
            }
            // Add to destination column
            if (column.id === destinationColumnId) {
              const newTaskIds = [...column.taskIds];
              newTaskIds.splice(destinationIndex, 0, String(activeId));
              return { ...column, taskIds: newTaskIds };
            }
            return column;
          });
          return { ...board, columns: newColumns };
        }
        return board;
      });

      setBoards(optimisticBoards);

      // Make API call
      await tasksAPI.moveTask(parseInt(activeId), {
        sourceBoardId,
        sourceColumnId,
        destinationBoardId,
        destinationColumnId,
        sourceIndex,
        destinationIndex
      });

      // Refresh from API to ensure data consistency
      const refreshedBoards = await boardsAPI.getBoards();
      setBoards(refreshedBoards);

    } catch (err) {
      // Rollback optimistic update on error
      setBoards(originalBoards);
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

  if (loading) {
    return (
      <AppContainer>
        <Header onCreateBoard={handleCreateBoard} />
        <LoadingSpinner>Loading your boards...</LoadingSpinner>
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
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <BoardsContainer>
            {boards.map(board => (
              <Board
                key={board.id}
                board={board}
                tasks={tasks}
                onCreateColumn={handleCreateColumn}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </BoardsContainer>
        </DndContext>
      </MainContent>
    </AppContainer>
  );
}

export default App;
