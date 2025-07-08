import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { aiAgentAPI } from '../services/api';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
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

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
`;

const AgentContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  animation: ${fadeIn} 0.3s ease-out;
  padding: 20px;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    align-items: flex-start;
    padding: 10px;
  }
`;

const AgentPanel = styled.div`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.98) 0%, 
    rgba(255, 255, 255, 0.96) 100%
  );
  backdrop-filter: blur(30px);
  border-radius: 24px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.5);
  overflow: hidden;
  animation: ${scaleIn} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 90vh;
    border-radius: 20px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.03) 0%, 
      rgba(118, 75, 162, 0.03) 100%
    );
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
`;

const AgentHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 20px 20px;
  }
`;

const AgentAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: ${glow} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

const AgentInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 4px 0;
    font-size: 20px;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 18px;
    }
  }
  
  .status {
    font-size: 14px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 6px;
    
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4ade80;
      animation: ${pulse} 2s infinite;
    }
  }
  
  .board-title {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

const AgentMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 300px;
  max-height: 500px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(102, 126, 234, 0.05);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    
    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6b3fa0 100%);
    }
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 12px;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${props => props.isUser ? slideInFromRight : slideInFromLeft} 0.3s ease-out;
  
  ${props => props.isUser && `
    flex-direction: row-reverse;
  `}
`;

const MessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border: 2px solid ${props => props.isUser 
    ? 'rgba(255, 255, 255, 0.3)'
    : 'rgba(102, 126, 234, 0.2)'
  };
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
`;

const MessageContent = styled.div`
  flex: 1;
  max-width: 75%;
  
  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const MessageBubble = styled.div`
  padding: 16px 20px;
  border-radius: 20px;
  word-wrap: break-word;
  position: relative;
  white-space: pre-line;
  
  ${props => {
    if (props.isUser) {
      return `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-bottom-right-radius: 8px;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
      `;
    } else {
      // Different styles based on message type
      switch (props.messageType) {
        case 'action':
          return `
            background: linear-gradient(135deg, 
              rgba(34, 197, 94, 0.1) 0%, 
              rgba(22, 163, 74, 0.1) 100%
            );
            color: #065f46;
            border-bottom-left-radius: 8px;
            border: 1px solid rgba(34, 197, 94, 0.2);
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.1);
          `;
        case 'error':
          return `
            background: linear-gradient(135deg, 
              rgba(239, 68, 68, 0.1) 0%, 
              rgba(220, 38, 38, 0.1) 100%
            );
            color: #991b1b;
            border-bottom-left-radius: 8px;
            border: 1px solid rgba(239, 68, 68, 0.2);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
          `;
        default:
          return `
            background: linear-gradient(135deg, 
              rgba(102, 126, 234, 0.08) 0%, 
              rgba(118, 75, 162, 0.08) 100%
            );
            color: #2d3748;
            border-bottom-left-radius: 8px;
            border: 1px solid rgba(102, 126, 234, 0.15);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          `;
      }
    }
  }}
  
  font-size: 15px;
  line-height: 1.5;
  
  &::before {
    content: '';
    position: absolute;
    ${props => {
      if (props.isUser) {
        return `
          right: -8px;
          bottom: 8px;
          border-left: 8px solid #667eea;
          border-bottom: 8px solid transparent;
        `;
      } else {
        let color = 'rgba(102, 126, 234, 0.08)';
        if (props.messageType === 'action') {
          color = 'rgba(34, 197, 94, 0.1)';
        } else if (props.messageType === 'error') {
          color = 'rgba(239, 68, 68, 0.1)';
        }
        return `
          left: -8px;
          bottom: 8px;
          border-right: 8px solid ${color};
          border-bottom: 8px solid transparent;
        `;
      }
    }}
  }
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
  }
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.7;
  
  ${props => props.isUser && `
    justify-content: flex-end;
  `}
`;

const MessageActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${MessageContainer}:hover & {
    opacity: 1;
  }
`;

const MessageActionButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 10px;
  
  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.4);
    transform: scale(1.1);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${slideInFromLeft} 0.3s ease-out;
`;

const TypingBubble = styled.div`
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.08) 0%, 
    rgba(118, 75, 162, 0.08) 100%
  );
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  border-bottom-left-radius: 8px;
  padding: 16px 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    bottom: 8px;
    border-right: 8px solid rgba(102, 126, 234, 0.08);
    border-bottom: 8px solid transparent;
  }
  
  .typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #667eea;
    animation: ${bounce} 1.4s infinite;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    
    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
`;

const TypingText = styled.span`
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  margin-left: 8px;
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 32px;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.05) 0%, 
    rgba(118, 75, 162, 0.05) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin: 20px 0;
  
  .welcome-emoji {
    font-size: 48px;
    margin-bottom: 20px;
    display: block;
    animation: ${bounce} 2s infinite;
  }
  
  .welcome-title {
    font-size: 24px;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 12px;
  }
  
  .welcome-description {
    font-size: 16px;
    color: #4a5568;
    line-height: 1.6;
    margin-bottom: 24px;
  }
  
  .welcome-suggestions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 20px;
  }
  
  @media (max-width: 768px) {
    padding: 32px 24px;
    
    .welcome-emoji {
      font-size: 40px;
    }
    
    .welcome-title {
      font-size: 20px;
    }
    
    .welcome-description {
      font-size: 14px;
    }
  }
`;

const SuggestionButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
`;

const AgentInput = styled.div`
  padding: 24px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 20px;
    gap: 12px;
  }
`;

const InputContainer = styled.div`
  flex: 1;
  position: relative;
`;

const InputField = styled.textarea`
  width: 100%;
  border: 2px solid rgba(102, 126, 234, 0.15);
  border-radius: 16px;
  padding: 16px 20px;
  font-size: 15px;
  resize: none;
  min-height: 50px;
  max-height: 120px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  font-family: inherit;
  color: #2d3748;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: rgba(255, 255, 255, 1);
  }
  
  &::placeholder {
    color: rgba(102, 126, 234, 0.6);
  }
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 14px;
    min-height: 44px;
  }
`;

const InputActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SendButton = styled.button`
  background: ${props => props.disabled 
    ? 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  border: none;
  color: white;
  padding: 0;
  border-radius: 50%;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(0.95);
  }
  
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const QuickActionButton = styled.button`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  font-weight: 500;
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-1px);
  }
`;

const BoardAIAgent = ({ boardId, boardTitle, board, tasks, onRefreshBoard, onCreateTask, onDeleteTask, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  const suggestions = [
    "Show me all tasks",
    "Create task called 'Review project'",
    "What's my progress?",
    "What can you do for me?"
  ];

  const quickActions = [
    { label: "📋 Show Tasks", action: "Show me all tasks" },
    { label: "➕ Quick Task", action: "Create task called 'New Task'" },
    { label: "📊 Progress", action: "What's my progress?" },
    { label: "🔍 Help", action: "What can you do?" }
  ];

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const actions = {
        onCreateTask,
        onDeleteTask,
        onRefreshBoard
      };
      
      const data = await aiAgentAPI.chat(textToSend, board, tasks, actions);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        type: data.type || 'info'
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // If the AI performed actions that might have changed the board, refresh it
      if (data.type === 'action' || data.response.includes('created') || data.response.includes('updated') || data.response.includes('deleted')) {
        setTimeout(() => {
          onRefreshBoard?.();
        }, 500);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle ESC key to close popup
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onToggle]);

  if (!isOpen) return null;

  return (
    <AgentContainer onClick={onToggle}>
      <AgentPanel onClick={(e) => e.stopPropagation()}>
        <AgentHeader>
          <AgentAvatar>🤖</AgentAvatar>
          <AgentInfo>
            <h3>AI Assistant</h3>
            <div className="status">
              <div className="status-dot"></div>
              Online
            </div>
            <div className="board-title">{boardTitle}</div>
          </AgentInfo>
          <HeaderActions>
            <ActionButton onClick={onToggle} title="Close">
              ✕
            </ActionButton>
          </HeaderActions>
        </AgentHeader>

        <AgentMessages>
          {messages.length === 0 ? (
            <WelcomeMessage>
              <span className="welcome-emoji">👋</span>
              <div className="welcome-title">Welcome to Your AI Assistant!</div>
              <div className="welcome-description">
                I'm here to help you manage your tasks efficiently. I can create, update, view, and delete tasks for you.
              </div>
              <div className="welcome-suggestions">
                {suggestions.map((suggestion, index) => (
                  <SuggestionButton
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </SuggestionButton>
                ))}
              </div>
            </WelcomeMessage>
          ) : (
            messages.map(message => (
              <MessageContainer key={message.id} isUser={message.isUser}>
                <MessageAvatar isUser={message.isUser}>
                  {message.isUser ? '👤' : '🤖'}
                </MessageAvatar>
                <MessageContent>
                  <MessageBubble isUser={message.isUser} messageType={message.type}>
                    {message.text}
                  </MessageBubble>
                  <MessageMeta isUser={message.isUser}>
                    <span>{formatTime(message.timestamp)}</span>
                    <MessageActions>
                      <MessageActionButton
                        onClick={() => copyMessage(message.text)}
                        title="Copy message"
                      >
                        📋
                      </MessageActionButton>
                    </MessageActions>
                  </MessageMeta>
                </MessageContent>
              </MessageContainer>
            ))
          )}
          
          {isLoading && (
            <TypingIndicator>
              <MessageAvatar isUser={false}>🤖</MessageAvatar>
              <div>
                <TypingBubble>
                  <div className="typing-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  <TypingText>AI is thinking...</TypingText>
                </TypingBubble>
              </div>
            </TypingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </AgentMessages>

        <AgentInput>
          <InputContainer>
            <QuickActions>
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  disabled={isLoading}
                >
                  {action.label}
                </QuickActionButton>
              ))}
            </QuickActions>
            <InputField
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your tasks..."
              disabled={isLoading}
            />
          </InputContainer>
          <InputActions>
            <SendButton 
              onClick={() => handleSendMessage()} 
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? '⏳' : '🚀'}
            </SendButton>
          </InputActions>
        </AgentInput>
      </AgentPanel>
    </AgentContainer>
  );
};

export default BoardAIAgent; 