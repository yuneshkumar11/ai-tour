const express = require('express');
const router = express.Router();

// Mock incidents database (in production, use Firestore)
const incidents = [];

// Report incident
router.post('/report', (req, res) => {
  try {
    const { userId, location, message, type, severity } = req.body;

    if (!location || !message) {
      return res.status(400).json({ error: 'Location and message are required' });
    }

    const incident = {
      id: Date.now().toString(),
      userId: userId || 'anonymous',
      location,
      message,
      type: type || 'general',
      severity: severity || 'medium',
      status: 'reported',
      timestamp: new Date().toISOString(),
    };

    incidents.push(incident);

    res.status(201).json({
      message: 'Incident reported successfully',
      incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get incidents (admin only)
router.get('/', (req, res) => {
  try {
    const { limit = 50, status } = req.query;

    let filteredIncidents = [...incidents].reverse();

    if (status) {
      filteredIncidents = filteredIncidents.filter(i => i.status === status);
    }

    filteredIncidents = filteredIncidents.slice(0, parseInt(limit));

    res.json({
      incidents: filteredIncidents,
      total: incidents.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get incident by ID
router.get('/:id', (req, res) => {
  try {
    const incident = incidents.find(i => i.id === req.params.id);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json({ incident });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update incident status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const incident = incidents.find(i => i.id === req.params.id);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    incident.status = status;
    incident.updatedAt = new Date().toISOString();

    res.json({
      message: 'Incident status updated',
      incident,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

