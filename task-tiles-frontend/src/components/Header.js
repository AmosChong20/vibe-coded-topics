import React, { useState } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const LogoIcon = styled.span`
  margin-right: 10px;
  font-size: 32px;
`;

const CreateBoardButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  min-width: 400px;
  max-width: 90%;
`;

const ModalHeader = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const CancelButton = styled(Button)`
  background: #f0f0f0;
  color: #666;

  &:hover {
    background: #e0e0e0;
  }
`;

const CreateButton = styled(Button)`
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

const Header = ({ onCreateBoard }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');

  const handleCreateBoard = () => {
    if (boardTitle.trim()) {
      onCreateBoard(boardTitle.trim());
      setBoardTitle('');
      setIsModalOpen(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreateBoard();
    }
  };

  return (
    <>
      <HeaderContainer>
        <Logo>
          <LogoIcon>📋</LogoIcon>
          Task Tiles
        </Logo>
        <CreateBoardButton onClick={() => setIsModalOpen(true)}>
          + Create Board
        </CreateBoardButton>
      </HeaderContainer>

      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>Create New Board</ModalHeader>
            <Input
              type="text"
              placeholder="Enter board title..."
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <ButtonGroup>
              <CancelButton onClick={() => setIsModalOpen(false)}>
                Cancel
              </CancelButton>
              <CreateButton
                onClick={handleCreateBoard}
                disabled={!boardTitle.trim()}
              >
                Create
              </CreateButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Header; 