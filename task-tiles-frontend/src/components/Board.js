import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import BoardAIAgent from './BoardAIAgent';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.2);
  }
  100% {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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

const BoardContainer = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.1) 100%
  );
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  min-width: 320px;
  max-width: 100%;
  width: 100%;
  max-width: min(1200px, calc(100vw - 40px));
  height: fit-content;
  max-height: calc(100vh - 160px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.6s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
      rgba(255, 255, 255, 0.1) 0%, 
      rgba(255, 255, 255, 0.05) 50%,
      rgba(102, 126, 234, 0.05) 100%
    );
    pointer-events: none;
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-2px);
    animation: ${glow} 2s ease-in-out infinite;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 16px;
    max-width: calc(100vw - 24px);
    max-height: calc(100vh - 120px);
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 12px;
    max-width: calc(100vw - 16px);
    max-height: calc(100vh - 100px);
  }
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
    padding-bottom: 12px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 12px;
    padding-bottom: 8px;
    gap: 8px;
  }
`;

const HeaderButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const BoardTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '📋';
    font-size: 24px;
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
    gap: 8px;
    
    &::before {
      font-size: 20px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    gap: 6px;
    
    &::before {
      font-size: 18px;
    }
  }
`;

const HeaderButton = styled.button`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.3) 0%, 
    rgba(255, 255, 255, 0.2) 100%
  );
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.4);
  padding: 12px 20px;
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

  &:hover {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.4) 0%, 
      rgba(255, 255, 255, 0.3) 100%
    );
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    animation: ${pulse} 0.3s ease-out;
  }
`;

const AddColumnButton = styled(HeaderButton)``;

const AIAgentButton = styled(HeaderButton)`
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.4) 0%, 
    rgba(118, 75, 162, 0.3) 100%
  );
  border: 2px solid rgba(102, 126, 234, 0.5);
  
  &::before {
    background: linear-gradient(90deg, 
      transparent, 
      rgba(102, 126, 234, 0.3), 
      transparent
    );
  }
  
  &:hover {
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.5) 0%, 
      rgba(118, 75, 162, 0.4) 100%
    );
    border-color: rgba(102, 126, 234, 0.7);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  }
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 16px;
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
  
  @media (max-width: 768px) {
    gap: 12px;
    padding-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    padding-bottom: 8px;
  }
`;

const AddColumnForm = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ${slideIn} 0.3s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: rgba(102, 126, 234, 0.6);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid transparent;

  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6b3fa0 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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

const Board = ({ board, tasks, onCreateColumn, onCreateTask, onDeleteTask, onRefreshBoard }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);

  const handleAddColumn = () => {
    if (columnTitle.trim()) {
      onCreateColumn(board.id, columnTitle.trim());
      setColumnTitle('');
      setIsAddingColumn(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    }
  };

  return (
    <BoardContainer>
      <BoardHeader>
        <BoardTitle>{board.title}</BoardTitle>
        <HeaderButtonGroup>
          <AIAgentButton onClick={() => setIsAIAgentOpen(!isAIAgentOpen)}>
            🤖 AI Assistant
          </AIAgentButton>
          <AddColumnButton onClick={() => setIsAddingColumn(true)}>
            ➕ Add Column
          </AddColumnButton>
        </HeaderButtonGroup>
      </BoardHeader>

      {isAddingColumn && (
        <AddColumnForm>
          <Input
            type="text"
            placeholder="Enter column title..."
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <ButtonGroup>
            <CancelButton onClick={() => setIsAddingColumn(false)}>
              Cancel
            </CancelButton>
            <SaveButton
              onClick={handleAddColumn}
              disabled={!columnTitle.trim()}
            >
              Add Column
            </SaveButton>
          </ButtonGroup>
        </AddColumnForm>
      )}

      <SortableContext 
        items={tasks.filter(task => 
          board.columns.some(col => 
            col.taskIds && col.taskIds.includes(String(task.id))
          )
        ).map(task => String(task.id))}
        strategy={verticalListSortingStrategy}
      >
        <ColumnsContainer>
          {board.columns.map((column, index) => {
            const columnTasks = tasks.filter(task => {
              const taskIdStr = String(task.id);
              return column.taskIds && column.taskIds.includes(taskIdStr);
            }).sort((a, b) => {
              const aIndex = column.taskIds.indexOf(String(a.id));
              const bIndex = column.taskIds.indexOf(String(b.id));
              return aIndex - bIndex;
            });

            console.log(`Column ${column.title} (${column.id}) tasks:`, columnTasks.length, columnTasks.map(t => t.id));

            return (
              <Column
                key={column.id}
                column={column}
                boardId={board.id}
                columnIndex={index}
                tasks={columnTasks}
                onCreateTask={onCreateTask}
                onDeleteTask={onDeleteTask}
              />
            );
          })}
        </ColumnsContainer>
      </SortableContext>
      
      <BoardAIAgent
        boardId={board.id}
        boardTitle={board.title}
        board={board}
        tasks={tasks}
        onRefreshBoard={onRefreshBoard}
        onCreateTask={onCreateTask}
        onDeleteTask={onDeleteTask}
        isOpen={isAIAgentOpen}
        onToggle={() => setIsAIAgentOpen(!isAIAgentOpen)}
      />
    </BoardContainer>
  );
};

export default Board; 