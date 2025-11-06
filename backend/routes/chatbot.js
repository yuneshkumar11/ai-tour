const express = require('express');
const router = express.Router();
const axios = require('axios');

// AI Chatbot responses
const chatbotKnowledge = {
  hospitals: 'You can find nearby hospitals using the map. In case of emergency, call the local emergency number.',
  police: 'For police assistance, look for police stations on the map or call the local emergency number.',
  embassy: 'For embassy assistance, check the map for your country\'s embassy location.',
  safe: 'Stay in well-lit areas, avoid isolated places, especially at night.',
  emergency: 'In case of emergency, call the local emergency number. Your location will be shared if you report an incident.',
};

// Get AI chatbot response
router.post('/', async (req, res) => {
  try {
    const { message, location, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();

    // Simple keyword matching (in production, use Gemini/GPT API)
    let response = '';
    let suggestedActions = [];

    if (lowerMessage.includes('hospital') || lowerMessage.includes('medical')) {
      response = chatbotKnowledge.hospitals;
      suggestedActions = ['Find Nearby Hospitals', 'Report Medical Emergency'];
    } else if (lowerMessage.includes('police') || lowerMessage.includes('help')) {
      response = chatbotKnowledge.police;
      suggestedActions = ['Find Police Station', 'Report Incident'];
    } else if (lowerMessage.includes('embassy') || lowerMessage.includes('consulate')) {
      response = chatbotKnowledge.embassy;
      suggestedActions = ['Find Embassy'];
    } else if (lowerMessage.includes('safe') || lowerMessage.includes('safety')) {
      response = chatbotKnowledge.safe;
      suggestedActions = ['Check Risk Assessment', 'Get Safe Route'];
    } else if (lowerMessage.includes('emergency')) {
      response = chatbotKnowledge.emergency;
      suggestedActions = ['Report Emergency', 'Call Emergency Services'];
    } else {
      // Use AI API if configured
      if (process.env.GEMINI_API_KEY) {
        try {
          const aiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              contents: [{
                parts: [{
                  text: `You are a helpful tourist safety assistant. Answer this question: ${message}. Keep response brief and helpful.`
                }]
              }]
            }
          );

          response = aiResponse.data.candidates[0]?.content?.parts[0]?.text || 'I can help you with safety information, hospitals, police, embassy locations, and emergency procedures.';
        } catch (aiError) {
          response = 'I can help you with safety information, hospitals, police, embassy locations, and emergency procedures. Please ask me about these topics.';
        }
      } else {
        response = 'I can help you with safety information, hospitals, police, embassy locations, and emergency procedures. Please ask me about these topics.';
      }
    }

    res.json({
      response,
      suggestedActions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

