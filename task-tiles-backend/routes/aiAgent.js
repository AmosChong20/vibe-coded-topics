const express = require('express');
const router = express.Router();
const { chatWithAgent, getConversationHistory } = require('../controllers/aiAgentController');

// Chat with AI agent
router.post('/chat', chatWithAgent);

// Get conversation history
router.get('/history/:boardId', getConversationHistory);

module.exports = router; 