const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { protect } = require('../middleware/auth');

// @route   POST /api/submissions/verify
// @desc    Upload video and verify with AI
router.post('/verify', protect, async (req, res) => {
  let tempFileCleaned = false;

  try {
    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file'
      });
    }

    const { expectedWord } = req.body;
    if (!expectedWord) {
      return res.status(400).json({
        success: false,
        message: 'Expected word is required'
      });
    }

    const videoFile = req.files.video;

    // Create form data to send to AI API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(videoFile.tempFilePath), {
      filename: videoFile.name,
      contentType: videoFile.mimetype
    });

    // Send to AI API
    const aiResponse = await axios.post(
      `${process.env.AI_API_URL}/predict?top_k=5`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    // Clean up temp file
    if (fs.existsSync(videoFile.tempFilePath)) {
      fs.unlinkSync(videoFile.tempFilePath);
    }
    tempFileCleaned = true;

    // Log raw AI response for debugging
    console.log('AI API raw response:', JSON.stringify(aiResponse.data, null, 2));

    // Extract predictions — handle multiple possible response shapes
    const predictions = aiResponse.data.predictions || aiResponse.data.results || [];

    // Helper to get the class/label name from a prediction object
    const getPredictionName = (pred) => {
      if (!pred) return '';
      return pred.class_name || pred.className || pred.label || pred.class || pred.word || '';
    };
    
    // Check if expected word is in predictions
    const isMatch = predictions.some(pred => {
      const name = getPredictionName(pred);
      return name && name.toLowerCase() === expectedWord.toLowerCase();
    });

    const topPrediction = predictions[0];

    res.json({
      success: true,
      isMatch,
      expectedWord,
      predictedWord: getPredictionName(topPrediction) || undefined,
      confidence: topPrediction?.confidence || topPrediction?.score || undefined,
      allPredictions: predictions
    });

  } catch (error) {
    console.error('Submission verification error:', error);
    
    // Clean up temp file if it hasn't been cleaned yet
    if (!tempFileCleaned && req.files && req.files.video && req.files.video.tempFilePath) {
      try {
        if (fs.existsSync(req.files.video.tempFilePath)) {
          fs.unlinkSync(req.files.video.tempFilePath);
        }
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Error verifying submission. Please try again.'
    });
  }
});

// @route   GET /api/submissions/classes
// @desc    Get list of all supported sign language classes from AI model
router.get('/classes', protect, async (req, res) => {
  try {
    const response = await axios.get(`${process.env.AI_API_URL}/classes`, {
      timeout: 10000
    });
    
    res.json({
      success: true,
      classes: response.data
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching classes from AI service'
    });
  }
});

// @route   POST /api/submissions/predict
// @desc    Free-form translation: Upload video and get English prediction (No expected word required)
router.post('/predict', protect, async (req, res) => {
  let tempFileCleaned = false;

  try {
    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file'
      });
    }

    const videoFile = req.files.video;
    const topK = req.query.top_k || 5;

    const formData = new FormData();
    formData.append('file', fs.createReadStream(videoFile.tempFilePath), {
      filename: videoFile.name,
      contentType: videoFile.mimetype
    });

    const aiResponse = await axios.post(
      `${process.env.AI_API_URL}/predict?top_k=${topK}`,
      formData,
      {
        headers: { ...formData.getHeaders() },
        timeout: 60000
      }
    );

    if (fs.existsSync(videoFile.tempFilePath)) {
      fs.unlinkSync(videoFile.tempFilePath);
    }
    tempFileCleaned = true;

    res.json({
      success: true,
      predictions: aiResponse.data.predictions || aiResponse.data.results || aiResponse.data
    });

  } catch (error) {
    console.error('Prediction error:', error);
    if (!tempFileCleaned && req.files?.video?.tempFilePath) {
      try {
        if (fs.existsSync(req.files.video.tempFilePath)) fs.unlinkSync(req.files.video.tempFilePath);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Error processing prediction. Please try again.'
    });
  }
});

// @route   POST /api/submissions/predict-ar
// @desc    Free-form translation: Upload video and get English + Arabic predictions
router.post('/predict-ar', protect, async (req, res) => {
  let tempFileCleaned = false;

  try {
    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a video file'
      });
    }

    const videoFile = req.files.video;
    const topK = req.query.top_k || 5;

    const formData = new FormData();
    formData.append('file', fs.createReadStream(videoFile.tempFilePath), {
      filename: videoFile.name,
      contentType: videoFile.mimetype
    });

    const aiResponse = await axios.post(
      `${process.env.AI_API_URL}/predict_ar?top_k=${topK}`,
      formData,
      {
        headers: { ...formData.getHeaders() },
        timeout: 60000
      }
    );

    if (fs.existsSync(videoFile.tempFilePath)) {
      fs.unlinkSync(videoFile.tempFilePath);
    }
    tempFileCleaned = true;

    res.json({
      success: true,
      predictions: aiResponse.data.predictions || aiResponse.data.results || aiResponse.data
    });

  } catch (error) {
    console.error('Arabic prediction error:', error);
    if (!tempFileCleaned && req.files?.video?.tempFilePath) {
      try {
        if (fs.existsSync(req.files.video.tempFilePath)) fs.unlinkSync(req.files.video.tempFilePath);
      } catch (e) {
        console.error('Error deleting temp file:', e);
      }
    }
    res.status(500).json({
      success: false,
      message: 'Error processing Arabic prediction. Please try again.'
    });
  }
});

module.exports = router;
