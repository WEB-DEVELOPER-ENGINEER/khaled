const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const levelsData = require('../../language_letter.json');

// @route   GET /api/levels
// @desc    Get all levels
router.get('/', protect, (req, res) => {
  try {
    const levels = Object.keys(levelsData.language_letter).map(levelKey => ({
      id: levelKey,
      name: levelKey,
      wordCount: levelsData.language_letter[levelKey].length
    }));

    res.json({
      success: true,
      levels
    });
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching levels'
    });
  }
});

// @route   GET /api/levels/:levelId
// @desc    Get words for a specific level
router.get('/:levelId', protect, (req, res) => {
  try {
    const { levelId } = req.params;
    const words = levelsData.language_letter[levelId];

    if (!words) {
      return res.status(404).json({
        success: false,
        message: 'Level not found'
      });
    }

    res.json({
      success: true,
      level: levelId,
      words
    });
  } catch (error) {
    console.error('Error fetching level words:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching level words'
    });
  }
});

module.exports = router;
