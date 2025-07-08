import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  }
  100% {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

const wiggle = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(1deg); }
  50% { transform: rotate(-1deg); }
  75% { transform: rotate(1deg); }
  100% { transform: rotate(0deg); }
`;

const TaskContainer = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme?.border || 'rgba(102, 126, 234, 0.2)'};
  border-radius: 12px;
  margin: 0 0 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: grab;
  position: relative;
  width: 100%;
  overflow: hidden;
  animation: ${slideIn} 0.4s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      ${props => props.theme?.light || 'rgba(102, 126, 234, 0.02)'} 0%, 
      ${props => props.theme?.light.replace('0.1', '0.05') || 'rgba(118, 75, 162, 0.02)'} 100%
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
    height: 3px;
    background: linear-gradient(90deg, 
      ${props => props.theme?.primary || '#667eea'} 0%, 
      ${props => props.theme?.secondary || '#764ba2'} 50%,
      ${props => props.theme?.accent || '#4facfe'} 100%
    );
    border-radius: 12px 12px 0 0;
    z-index: 1;
  }
  
  &:hover {
    border-color: ${props => props.theme?.border.replace('0.2', '0.4') || 'rgba(102, 126, 234, 0.4)'};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme?.light.replace('0.1', '0.2') || 'rgba(102, 126, 234, 0.2)'};
  }
  
  &.dragging {
    opacity: 0.3 !important;
    transform: scale(0.95) !important;
    cursor: grabbing;
  }
  
  &.overlay {
    cursor: grabbing;
    opacity: 0.95 !important;
    transform: rotate(3deg) scale(1.1) !important;
    box-shadow: 
      0 20px 40px ${props => props.theme?.light.replace('0.1', '0.4') || 'rgba(102, 126, 234, 0.4)'} !important,
      0 0 0 1px ${props => props.theme?.primary || '#667eea'} !important;
    border-color: ${props => props.theme?.primary || '#667eea'} !important;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.98) 0%, 
      rgba(255, 255, 255, 0.95) 100%
    ) !important;
    backdrop-filter: blur(25px) !important;
    pointer-events: none !important;
    
    &::before {
      opacity: 0.8;
      background: linear-gradient(135deg, 
        ${props => props.theme?.light.replace('0.1', '0.2') || 'rgba(102, 126, 234, 0.2)'} 0%, 
        ${props => props.theme?.light.replace('0.1', '0.15') || 'rgba(118, 75, 162, 0.15)'} 100%
      ) !important;
    }
    
    &::after {
      height: 4px;
      box-shadow: 0 0 15px ${props => props.theme?.primary || '#667eea'};
      background: linear-gradient(90deg, 
        ${props => props.theme?.primary || '#667eea'} 0%, 
        ${props => props.theme?.secondary || '#764ba2'} 50%,
        ${props => props.theme?.accent || '#4facfe'} 100%
      ) !important;
    }
  }
  
  > * {
    position: relative;
    z-index: 2;
  }
`;

const TaskContent = styled.div`
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
`;

const TaskTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.4;
  background: linear-gradient(135deg, 
    ${props => props.theme?.primary || '#667eea'} 0%, 
    ${props => props.theme?.secondary || '#764ba2'} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '${props => props.theme?.emoji || '📌'}';
    font-size: 14px;
    filter: drop-shadow(0 0 4px ${props => props.theme?.light || 'rgba(102, 126, 234, 0.3)'});
  }
`;

const TaskDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
  font-weight: 500;
  opacity: 0.8;
  
  &::before {
    content: '💭';
    margin-right: 6px;
    font-size: 12px;
    opacity: 0.6;
  }
`;

const TaskActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme?.border || 'rgba(102, 126, 234, 0.1)'};
  opacity: 0;
  transform: translateY(5px);
  transition: all 0.3s ease;
  
  ${TaskContainer}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, 
    ${props => props.theme?.light || 'rgba(102, 126, 234, 0.05)'} 0%, 
    ${props => props.theme?.light.replace('0.1', '0.05') || 'rgba(118, 75, 162, 0.05)'} 100%
  );
  border: 1px solid ${props => props.theme?.border || 'rgba(102, 126, 234, 0.2)'};
  color: ${props => props.theme?.primary || '#667eea'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      ${props => props.theme?.light.replace('0.1', '0.15') || 'rgba(102, 126, 234, 0.1)'}, 
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(135deg, 
      ${props => props.theme?.light.replace('0.1', '0.15') || 'rgba(102, 126, 234, 0.1)'} 0%, 
      ${props => props.theme?.light.replace('0.1', '0.1') || 'rgba(118, 75, 162, 0.1)'} 100%
    );
    border-color: ${props => props.theme?.border.replace('0.2', '0.4') || 'rgba(102, 126, 234, 0.4)'};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme?.light.replace('0.1', '0.2') || 'rgba(102, 126, 234, 0.2)'};
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    animation: ${pulse} 0.3s ease-out;
  }
`;

const DeleteButton = styled(ActionButton)`
  color: #e53e3e;
  border-color: rgba(229, 62, 62, 0.2);
  background: linear-gradient(135deg, 
    rgba(229, 62, 62, 0.05) 0%, 
    rgba(245, 101, 101, 0.05) 100%
  );
  
  &::before {
    background: linear-gradient(90deg, 
      transparent, 
      rgba(229, 62, 62, 0.1), 
      transparent
    );
  }
  
  &:hover {
    background: linear-gradient(135deg, 
      rgba(229, 62, 62, 0.1) 0%, 
      rgba(245, 101, 101, 0.1) 100%
    );
    border-color: rgba(229, 62, 62, 0.4);
    animation: ${wiggle} 0.5s ease-in-out;
  }
`;

const TaskPriority = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.priority) {
      case 'high': return 'linear-gradient(135deg, #e53e3e 0%, #f56565 100%)';
      case 'medium': return 'linear-gradient(135deg, #d69e2e 0%, #f6e05e 100%)';
      case 'low': return 'linear-gradient(135deg, #38a169 0%, #68d391 100%)';
      default: return `linear-gradient(135deg, ${props.theme?.primary || '#667eea'} 0%, ${props.theme?.secondary || '#764ba2'} 100%)`;
    }
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 3;
  
  &:hover {
    transform: scale(1.5);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 16px;
  font-size: 12px;
  color: ${props => props.theme?.primary.replace(')', ', 0.6)') || 'rgba(102, 126, 234, 0.6)'};
  font-weight: 500;
`;

const TaskCreatedAt = styled.span`
  opacity: 0.7;
  
  &::before {
    content: '🕐';
    margin-right: 4px;
  }
`;

const TaskType = styled.span`
  background: linear-gradient(135deg, 
    ${props => props.theme?.light || 'rgba(102, 126, 234, 0.1)'} 0%, 
    ${props => props.theme?.light.replace('0.1', '0.05') || 'rgba(118, 75, 162, 0.1)'} 100%
  );
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid ${props => props.theme?.border || 'rgba(102, 126, 234, 0.2)'};
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
`;

const Task = ({ task, boardId, columnId, onDeleteTask, columnTheme, isOverlay = false }) => {
  const [showActions, setShowActions] = useState(false);

  const sortable = useSortable({
    id: String(task.id),
    data: {
      type: 'task',
      task,
      boardId,
      columnId,
    },
    disabled: isOverlay,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style = isOverlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 9999 : 'auto',
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const confirmed = window.confirm(`Are you sure you want to delete the task "${task.title}"?`);
    
    if (confirmed) {
      console.log('Deleting task:', task.id);
      onDeleteTask(task.id);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getClassName = () => {
    if (isOverlay) return 'overlay';
    if (isDragging) return 'dragging';
    return '';
  };

  return (
    <TaskContainer
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      className={getClassName()}
      onMouseEnter={() => !isOverlay && setShowActions(true)}
      onMouseLeave={() => !isOverlay && setShowActions(false)}
      theme={columnTheme}
    >
      <TaskPriority priority={task.priority || 'normal'} theme={columnTheme} />
      
      <TaskContent>
        <TaskTitle theme={columnTheme}>{task.title}</TaskTitle>
        {task.description && (
          <TaskDescription>{task.description}</TaskDescription>
        )}
        
        {showActions && !isDragging && !isOverlay && (
          <TaskActions theme={columnTheme}>
            <DeleteButton 
              onClick={handleDelete} 
              theme={columnTheme}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              🗑️ Delete
            </DeleteButton>
          </TaskActions>
        )}
      </TaskContent>
      
      <TaskFooter theme={columnTheme}>
        <TaskCreatedAt>{formatDate(task.created_at)}</TaskCreatedAt>
        <TaskType theme={columnTheme}>{task.type || 'Task'}</TaskType>
      </TaskFooter>
    </TaskContainer>
  );
};

export default Task; 