const express = require('express');
const { chatWithGemini } = require('../controllers/chatbot.controller');

const router = express.Router();

router.post('/chat', chatWithGemini);

module.exports = router;
