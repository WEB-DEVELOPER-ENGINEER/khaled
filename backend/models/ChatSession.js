const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant', 'system']
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    default: () => new Date().toISOString()
  }
}, { _id: false });

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    default: null
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ChatSession', ChatSessionSchema);
