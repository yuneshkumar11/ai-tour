const express = require('express');
const router = express.Router();
const { Translate } = require('@google-cloud/translate').v2;

// Initialize Translation client (in production, use service account)
let translateClient = null;

try {
  if (process.env.GOOGLE_TRANSLATE_API_KEY) {
    translateClient = new Translate({
      key: process.env.GOOGLE_TRANSLATE_API_KEY,
    });
  }
} catch (error) {
  console.warn('Google Translate API not configured:', error.message);
}

// Translate text
router.post('/', async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const target = targetLanguage || 'en';

    if (translateClient) {
      // Use Google Cloud Translation API
      const [translation] = await translateClient.translate(text, target);
      res.json({
        originalText: text,
        translatedText: translation,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage: target,
      });
    } else {
      // Mock translation for development
      res.json({
        originalText: text,
        translatedText: `[Translated to ${target}]: ${text}`,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage: target,
        note: 'Mock translation - configure Google Translate API for real translations',
      });
    }
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Detect language
router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (translateClient) {
      const [detection] = await translateClient.detect(text);
      res.json({
        text,
        language: detection.language,
        confidence: detection.confidence,
      });
    } else {
      // Mock detection
      res.json({
        text,
        language: 'en',
        confidence: 0.9,
        note: 'Mock detection - configure Google Translate API',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get supported languages
router.get('/languages', async (req, res) => {
  try {
    if (translateClient) {
      const [languages] = await translateClient.getLanguages();
      res.json({ languages });
    } else {
      // Mock languages list
      res.json({
        languages: [
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Spanish' },
          { code: 'fr', name: 'French' },
          { code: 'de', name: 'German' },
          { code: 'hi', name: 'Hindi' },
          { code: 'zh', name: 'Chinese' },
          { code: 'ar', name: 'Arabic' },
          { code: 'ja', name: 'Japanese' },
        ],
        note: 'Mock list - configure Google Translate API for full list',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

