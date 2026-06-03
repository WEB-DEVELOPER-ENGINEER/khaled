const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const ChatSession = require('../models/ChatSession');
const levelsData = require('../../language_letter.json');

// Base URL for Hugging Face Space Chatbot
const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'https://allamxmax-sign-language-chatbot.hf.space';

// --- Validation Middlewares ---

// Validate POST /chat/new-session
const validateNewSession = (req, res, next) => {
  const { user_id } = req.body;
  if (req.body && user_id !== undefined && typeof user_id !== 'string' && user_id !== null) {
    return res.status(422).json({
      detail: [
        {
          loc: ['body', 'user_id'],
          msg: 'Input should be a valid string',
          type: 'string_type',
          input: user_id
        }
      ]
    });
  }
  next();
};

// Validate POST /chat
const validateChat = (req, res, next) => {
  const { session_id, message } = req.body;
  const detail = [];

  if (session_id === undefined) {
    detail.push({
      loc: ['body', 'session_id'],
      msg: 'Field required',
      type: 'missing',
      input: null
    });
  } else if (typeof session_id !== 'string') {
    detail.push({
      loc: ['body', 'session_id'],
      msg: 'Input should be a valid string',
      type: 'string_type',
      input: session_id
    });
  }

  if (message === undefined) {
    detail.push({
      loc: ['body', 'message'],
      msg: 'Field required',
      type: 'missing',
      input: null
    });
  } else if (typeof message !== 'string') {
    detail.push({
      loc: ['body', 'message'],
      msg: 'Input should be a valid string',
      type: 'string_type',
      input: message
    });
  }

  if (detail.length > 0) {
    return res.status(422).json({ detail });
  }
  next();
};

// Validate path parameters (session_id)
const validateSessionId = (req, res, next) => {
  const { session_id } = req.params;
  if (!session_id || typeof session_id !== 'string') {
    return res.status(422).json({
      detail: [
        {
          loc: ['path', 'session_id'],
          msg: 'Input should be a valid string',
          type: 'string_type',
          input: session_id
        }
      ]
    });
  }
  next();
};

// Helper function to search words in levels data for fallback response
const findWordVideo = (message) => {
  if (!message) return null;
  const normalizedMsg = message.toLowerCase();
  
  // Search through all levels in language_letter
  for (const level of Object.keys(levelsData.language_letter || {})) {
    const list = levelsData.language_letter[level];
    for (const item of list) {
      const word = item.word.toLowerCase();
      // Check if word matches message or is contained in it
      if (normalizedMsg.includes(word)) {
        return {
          word: item.word,
          url: item.url,
          level: level
        };
      }
    }
  }
  return null;
};

// --- API Endpoints ---

// @route   GET /
// @desc    Root health check / welcome
router.get('/', (req, res) => {
  res.json("Sign Language Chatbot API is running");
});

// @route   POST /chat/new-session
// @desc    Create new chat session
router.post('/chat/new-session', validateNewSession, async (req, res) => {
  try {
    const { user_id } = req.body;
    let sessionId = null;

    // Try to get session from remote space
    try {
      const response = await axios.post(`${CHATBOT_API_URL}/chat/new-session`, {
        user_id: user_id || null
      }, { timeout: 10000 });

      if (response.data && response.data.session_id) {
        sessionId = response.data.session_id;
      }
    } catch (err) {
      console.warn('Failed to fetch session from remote Chatbot API, generating local ID:', err.message);
    }

    // Fallback: Generate our own session ID if remote call failed
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // Save session in MongoDB
    const chatSession = new ChatSession({
      sessionId,
      userId: user_id || null,
      messages: []
    });
    await chatSession.save();

    res.json({
      success: true,
      session_id: sessionId
    });

  } catch (error) {
    console.error('Error creating new session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session'
    });
  }
});

// @route   POST /chat
// @desc    Send message and get reply
router.post('/chat', validateChat, async (req, res) => {
  try {
    const { session_id, message } = req.body;

    // Retrieve session from MongoDB
    const session = await ChatSession.findOne({ sessionId: session_id });
    if (!session) {
      return res.json({
        success: false,
        session_id,
        reply: null,
        error: 'Session not found'
      });
    }

    // Save user's message
    const userMsg = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    session.messages.push(userMsg);

    let reply = '';
    let errorMsg = null;

    // Try calling the remote Chatbot API
    try {
      const response = await axios.post(`${CHATBOT_API_URL}/chat`, {
        session_id,
        message
      }, { timeout: 25000 });

      if (response.data && response.data.reply) {
        reply = response.data.reply;
      } else {
        throw new Error('Empty reply from remote service');
      }
    } catch (err) {
      console.warn('Remote Chatbot API call failed, running local fallback logic:', err.message);
      
      // Local Smart Fallback: Check if message matches any vocabulary words
      const matched = findWordVideo(message);
      if (matched) {
        if (matched.url) {
          reply = `مرحباً بك! كلمة "${matched.word}" هي جزء من كلمات المستوى ${matched.level}. يمكنك مشاهدة فيديو توضيحي لإشارة هذه الكلمة عبر الرابط التالي: ${matched.url}`;
        } else {
          reply = `مرحباً بك! كلمة "${matched.word}" هي جزء من كلمات المستوى ${matched.level}. لم نجد رابط فيديو مسجل لهذه الكلمة حالياً، ولكن يمكنك التدرب عليها في صفحة الدروس.`;
        }
      } else {
        // General helpful response
        reply = `أهلاً بك! أنا مساعد لغة الإشارة. أواجه حالياً صعوبة في الاتصال بالذكاء الاصطناعي للمحادثات العامة. ومع ذلك، يمكنك الاستفسار مني عن الكلمات التعليمية مثل "go", "drink", "walk", "doctor", "family" وسأقوم بتزويدك بروابط تعلمها!`;
      }
    }

    // Save assistant reply
    const assistantMsg = {
      role: 'assistant',
      content: reply,
      timestamp: new Date().toISOString()
    };
    session.messages.push(assistantMsg);
    await session.save();

    res.json({
      success: true,
      session_id,
      reply,
      error: errorMsg
    });

  } catch (error) {
    console.error('Error in chat request:', error);
    res.json({
      success: false,
      session_id: req.body.session_id,
      reply: null,
      error: 'An internal error occurred while processing your request'
    });
  }
});

// @route   GET /chat/history/:session_id
// @desc    Get session history
router.get('/chat/history/:session_id', validateSessionId, async (req, res) => {
  try {
    const { session_id } = req.params;

    const session = await ChatSession.findOne({ sessionId: session_id });
    if (!session) {
      return res.json({
        success: false,
        session_id,
        messages: null,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      session_id,
      messages: session.messages,
      error: null
    });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.json({
      success: false,
      session_id: req.params.session_id,
      messages: null,
      error: 'Failed to retrieve chat history'
    });
  }
});

// @route   DELETE /chat/history/:session_id
// @desc    Delete session history
router.delete('/chat/history/:session_id', validateSessionId, async (req, res) => {
  try {
    const { session_id } = req.params;

    const session = await ChatSession.findOne({ sessionId: session_id });
    if (!session) {
      return res.json({
        success: false,
        message: null,
        error: 'Session not found'
      });
    }

    // Delete locally
    await ChatSession.deleteOne({ sessionId: session_id });

    // Try deleting remotely
    try {
      await axios.delete(`${CHATBOT_API_URL}/chat/history/${session_id}`, { timeout: 5000 });
    } catch (err) {
      console.warn('Failed to delete history on remote Chatbot API:', err.message);
    }

    res.json({
      success: true,
      message: 'Chat history deleted successfully',
      error: null
    });

  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.json({
      success: false,
      message: null,
      error: 'Failed to delete chat history'
    });
  }
});

module.exports = router;
