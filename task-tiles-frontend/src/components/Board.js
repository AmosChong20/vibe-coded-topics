import React, { useState } from 'react';
import styled from 'styled-components';
import Column from './Column';

const BoardContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  min-width: 300px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BoardTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const AddColumnButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  min-height: 400px;
`;

const AddColumnForm = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

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

const Board = ({ board, tasks, onCreateColumn, onCreateTask, onDeleteTask }) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');

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
        <AddColumnButton onClick={() => setIsAddingColumn(true)}>
          + Add Column
        </AddColumnButton>
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

      <ColumnsContainer>
        {board.columns.map(column => (
          <Column
            key={column.id}
            column={column}
            boardId={board.id}
            tasks={tasks.filter(task => {
              const taskIdStr = String(task.id);
              return column.taskIds && column.taskIds.includes(taskIdStr);
            }).sort((a, b) => {
              const aIndex = column.taskIds.indexOf(String(a.id));
              const bIndex = column.taskIds.indexOf(String(b.id));
              return aIndex - bIndex;
            })}
            onCreateTask={onCreateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </ColumnsContainer>
    </BoardContainer>
  );
};

export default Board; 