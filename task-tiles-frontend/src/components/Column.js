import React, { useState } from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './Task';

const ColumnContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 15px;
  min-width: 250px;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.8);
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ColumnTitle = styled.h3`
  color: #333;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const TaskCount = styled.span`
  color: #666;
  font-size: 14px;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
`;

const AddTaskButton = styled.button`
  width: 100%;
  background: transparent;
  color: #666;
  border: 2px dashed #ddd;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }
`;

const TaskList = styled.div`
  min-height: 100px;
  position: relative;
  /* Remove max-height and overflow to prevent drag positioning issues */
`;

const AddTaskForm = styled.div`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 2px solid #e0e0e0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 10px;
  box-sizing: border-box;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const SaveButton = styled(Button)`
  background: #667eea;
  color: white;

  &:hover {
    background: #5a6fd8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: #666;

  &:hover {
    background: #e0e0e0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
`;

const Column = ({ column, boardId, tasks, onCreateTask, onDeleteTask }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const { isOver, setNodeRef } = useDroppable({
    id: `${boardId}-${column.id}`,
    data: {
      boardId,
      columnId: column.id,
      type: 'column',
    },
  });

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
    <ColumnContainer>
      <ColumnHeader>
        <ColumnTitle>{column.title}</ColumnTitle>
        <TaskCount>{tasks.length}</TaskCount>
      </ColumnHeader>

      <AddTaskButton onClick={() => setIsAddingTask(true)}>
        + Add Task
      </AddTaskButton>

      {isAddingTask && (
        <AddTaskForm>
          <Input
            type="text"
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <TextArea
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
              onClick={handleAddTask}
              disabled={!taskTitle.trim()}
            >
              Add Task
            </SaveButton>
          </ButtonGroup>
        </AddTaskForm>
      )}

      <SortableContext 
        items={tasks.map(task => String(task.id))}
        strategy={verticalListSortingStrategy}
      >
        <TaskList
          ref={setNodeRef}
          style={{
            backgroundColor: isOver ? '#f0f0f0' : 'transparent',
            transition: 'background-color 0.2s ease'
          }}
        >
          {tasks.length === 0 ? (
            <EmptyState>No tasks yet</EmptyState>
          ) : (
            tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                boardId={boardId}
                columnId={column.id}
                onDeleteTask={onDeleteTask}
              />
            ))
          )}
        </TaskList>
      </SortableContext>
    </ColumnContainer>
  );
};

export default Column; 