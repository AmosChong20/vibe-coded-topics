import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import Task from './Task';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bounce = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }
  100% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
`;

// Color themes for columns
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

const ColumnContainer = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  min-width: 280px;
  max-width: 360px;
  flex: 0 0 auto;
  height: calc(100vh - 280px);
  max-height: calc(100vh - 280px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.border};
  animation: ${slideIn} 0.5s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      ${props => props.theme.light} 0%, 
      ${props => props.theme.light.replace('0.1', '0.05')} 100%
    );
    pointer-events: none;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${props => props.theme.primary} 0%, 
      ${props => props.theme.secondary} 50%,
      ${props => props.theme.accent} 100%
    );
    border-radius: 16px 16px 0 0;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px ${props => props.theme.light.replace('0.1', '0.2')};
    border-color: ${props => props.theme.border.replace('0.2', '0.4')};
  }
  
  > * {
    position: relative;
    z-index: 2;
  }
  
  &.drag-over {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.98) 0%, 
      rgba(255, 255, 255, 0.95) 100%
    );
    border-color: ${props => props.theme.border.replace('0.2', '0.6')};
    transform: scale(1.02);
    box-shadow: 0 12px 40px ${props => props.theme.light.replace('0.1', '0.3')};
    
    &::after {
      box-shadow: 0 0 20px ${props => props.theme.primary};
    }
  }
  
  @media (max-width: 768px) {
    min-width: 250px;
    max-width: 300px;
    padding: 16px;
    border-radius: 12px;
    height: calc(100vh - 220px);
    max-height: calc(100vh - 220px);
  }
  
  @media (max-width: 480px) {
    min-width: 200px;
    max-width: 280px;
    padding: 12px;
    border-radius: 10px;
    height: calc(100vh - 200px);
    max-height: calc(100vh - 200px);
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 0;
  border-bottom: 2px solid ${props => props.theme.border};
  flex-shrink: 0;
`;

const ColumnTitle = styled.h3`
  color: #2d3748;
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, 
    ${props => props.theme.primary} 0%, 
    ${props => props.theme.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '${props => props.theme.emoji}';
    font-size: 18px;
    filter: drop-shadow(0 0 4px ${props => props.theme.light});
  }
`;

const TaskCount = styled.span`
  color: ${props => props.theme.primary};
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(135deg, 
    ${props => props.theme.light} 0%, 
    ${props => props.theme.light.replace('0.1', '0.05')} 100%
  );
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.border};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  animation: ${bounce} 2s ease-in-out infinite;
`;

const AddTaskButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, 
    ${props => props.theme.light} 0%, 
    ${props => props.theme.light.replace('0.1', '0.05')} 100%
  );
  color: ${props => props.theme.primary};
  border: 2px dashed ${props => props.theme.border};
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      ${props => props.theme.light.replace('0.1', '0.15')}, 
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    border-color: ${props => props.theme.primary};
    background: linear-gradient(135deg, 
      ${props => props.theme.light.replace('0.1', '0.15')} 0%, 
      ${props => props.theme.light.replace('0.1', '0.1')} 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.light.replace('0.1', '0.2')};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    animation: ${pulse} 0.3s ease-out;
  }
`;

const TaskList = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  border-radius: 12px;
  padding: 8px;
  transition: all 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  
  /* Ensure scrollbar is visible and functional */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.light};
    border-radius: 10px;
    margin: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary};
    border-radius: 10px;
    border: 2px solid transparent;
    background-clip: content-box;
    
    &:hover {
      background: ${props => props.theme.secondary};
      background-clip: content-box;
    }
  }
  
  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.primary} ${props => props.theme.light};
  
  &.drag-over {
    background: linear-gradient(135deg, 
      ${props => props.theme.light.replace('0.1', '0.15')} 0%, 
      ${props => props.theme.light.replace('0.1', '0.1')} 100%
    );
    border: 2px dashed ${props => props.theme.border.replace('0.2', '0.4')};
    transform: scale(1.02);
    box-shadow: 0 4px 12px ${props => props.theme.light.replace('0.1', '0.2')};
  }
`;

const AddTaskForm = styled.div`
  background: linear-gradient(135deg, 
    ${props => props.theme.light} 0%, 
    ${props => props.theme.light.replace('0.1', '0.05')} 100%
  );
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 2px solid ${props => props.theme.border};
  animation: ${slideIn} 0.3s ease-out;
  box-shadow: 0 4px 12px ${props => props.theme.light.replace('0.1', '0.1')};
  flex-shrink: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.light};
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: ${props => props.theme.primary.replace(')', ', 0.6)')};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.light};
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: ${props => props.theme.primary.replace(')', ', 0.6)')};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, 
    ${props => props.theme.primary} 0%, 
    ${props => props.theme.secondary} 100%
  );
  color: white;
  border: 2px solid transparent;

  &:hover {
    background: linear-gradient(135deg, 
      ${props => props.theme.primary} 0%, 
      ${props => props.theme.accent} 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.light.replace('0.1', '0.4')};
  }

  &:disabled {
    background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const CancelButton = styled(Button)`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  color: #4a5568;
  border: 2px solid #e2e8f0;

  &:hover {
    background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${props => props.theme.primary.replace(')', ', 0.6)')};
  font-style: italic;
  font-weight: 500;
  padding: 32px 20px;
  background: linear-gradient(135deg, 
    ${props => props.theme.light} 0%, 
    ${props => props.theme.light.replace('0.1', '0.05')} 100%
  );
  border-radius: 12px;
  border: 2px dashed ${props => props.theme.border};
  
  &::before {
    content: '${props => props.theme.emoji}';
    display: block;
    font-size: 32px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;

const Column = ({ column, boardId, tasks, onCreateTask, onDeleteTask, columnIndex = 0 }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  
  const theme = getColumnTheme(columnIndex);

  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
    data: {
      boardId,
      columnId: column.id,
      type: 'column',
    },
  });

  // Debug logging for drop events
  React.useEffect(() => {
    if (isOver) {
      console.log('Task hovering over column:', column.id, { boardId, columnId: column.id });
    }
  }, [isOver, column.id, boardId]);

  // Also log the drop zone setup
  React.useEffect(() => {
    console.log('Column drop zone setup:', {
      columnId: column.id,
      dropZoneId: column.id,
      boardId,
      type: 'column'
    });
  }, [column.id, boardId]);

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onCreateTask(boardId, column.id, taskTitle.trim(), taskDescription.trim());
      setTaskTitle('');
      setTaskDescription('');
      setIsAddingTask(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleAddTask();
    }
  };

  return (
    <ColumnContainer 
      ref={setNodeRef}
      theme={theme}
      className={isOver ? 'drag-over' : ''}
    >
      <ColumnHeader theme={theme}>
        <ColumnTitle theme={theme}>{column.title}</ColumnTitle>
        <TaskCount theme={theme}>{tasks.length} tasks</TaskCount>
      </ColumnHeader>

      <AddTaskButton theme={theme} onClick={() => setIsAddingTask(true)}>
        ➕ Add Task
      </AddTaskButton>

      {isAddingTask && (
        <AddTaskForm theme={theme}>
          <Input
            theme={theme}
            type="text"
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <TextArea
            theme={theme}
            placeholder="Task description (optional)..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <ButtonGroup>
            <CancelButton onClick={() => setIsAddingTask(false)}>
              Cancel
            </CancelButton>
            <SaveButton
              theme={theme}
              onClick={handleAddTask}
              disabled={!taskTitle.trim()}
            >
              Add Task
            </SaveButton>
          </ButtonGroup>
        </AddTaskForm>
      )}

      <TaskList
        theme={theme}
      >
        {tasks.length === 0 ? (
          <EmptyState theme={theme}>
            Ready for your first task
          </EmptyState>
        ) : (
          tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              boardId={boardId}
              columnId={column.id}
              onDeleteTask={onDeleteTask}
              columnTheme={theme}
            />
          ))
        )}
      </TaskList>
    </ColumnContainer>
  );
};

export default Column; 