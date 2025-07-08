import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const modalIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const shine = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%, 
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  min-height: 80px;
  
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
      rgba(102, 126, 234, 0.03) 100%
    );
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 16px 24px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
    min-height: 120px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    gap: 12px;
    min-height: 100px;
  }
`;

const Logo = styled.h1`
  color: white;
  font-size: 32px;
  font-weight: 900;
  margin: 0;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 16px;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 28px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
    gap: 8px;
  }
`;

const LogoIcon = styled.span`
  font-size: 36px;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: rotate(15deg) scale(1.1);
  }
`;

const CreateBoardButton = styled.button`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.25) 0%, 
    rgba(255, 255, 255, 0.15) 100%
  );
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
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
      rgba(255, 255, 255, 0.35) 0%, 
      rgba(255, 255, 255, 0.25) 100%
    );
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    
    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
    animation: ${shine} 0.6s ease-out;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${modalIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 450px;
  max-width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.6) 0%, 
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 20px;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    min-width: 300px;
    padding: 32px;
    border-radius: 16px;
    max-width: 95%;
  }
  
  @media (max-width: 480px) {
    min-width: 280px;
    padding: 24px;
    border-radius: 12px;
    max-width: 90%;
  }
`;

const ModalHeader = styled.h2`
  margin: 0 0 24px 0;
  color: #2d3748;
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 24px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-weight: 500;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: rgba(102, 126, 234, 0.6);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
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

const CreateButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid transparent;

  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6b3fa0 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
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
          <LogoIcon>🎯</LogoIcon>
          Task Tiles
        </Logo>
        <CreateBoardButton onClick={() => setIsModalOpen(true)}>
          ✨ Create Board
        </CreateBoardButton>
      </HeaderContainer>

      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>🚀 Create New Board</ModalHeader>
            <Input
              type="text"
              placeholder="Enter your board title..."
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
                Create Board
              </CreateButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default Header; 