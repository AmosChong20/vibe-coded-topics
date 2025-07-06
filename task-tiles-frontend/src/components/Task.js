import React, { useState } from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Clean container with no padding to eliminate offset
const TaskContainer = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 0 0 8px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: grab;
  position: relative;
  width: 100%;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &.dragging {
    cursor: grabbing;
    opacity: 0.5;
  }
`;

// All visual styling and spacing is handled here
const TaskContent = styled.div`
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
`;

const TaskTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
`;

const TaskDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
`;

const TaskActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;

const DeleteButton = styled(ActionButton)`
  color: #e74c3c;
  
  &:hover {
    background: #ffeaea;
    color: #c0392b;
  }
`;

const Task = ({ task, boardId, columnId, onDeleteTask }) => {
  const [showActions, setShowActions] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(task.id),
    data: {
      type: 'task',
      task,
      boardId,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.id);
    }
  };

  return (
    <TaskContainer
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'dragging' : ''}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <TaskContent>
        <TaskTitle>{task.title}</TaskTitle>
        {task.description && (
          <TaskDescription>{task.description}</TaskDescription>
        )}
        
        {showActions && (
          <TaskActions>
            <DeleteButton onClick={handleDelete}>
              Delete
            </DeleteButton>
          </TaskActions>
        )}
      </TaskContent>
    </TaskContainer>
  );
};

export default Task; 