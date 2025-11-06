const express = require('express');
const router = express.Router();

// Mock analytics data (in production, use Firestore aggregations)
const mockAnalytics = {
  totalUsers: 1250,
  activeUsers: 342,
  totalIncidents: 45,
  resolvedIncidents: 38,
  highRiskAlerts: 12,
  avgRiskScore: 0.35,
};

// Get analytics dashboard data
router.get('/analytics', (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;

    // Mock time-series data
    const timeSeriesData = [];
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 1;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 50) + 20,
        incidents: Math.floor(Math.random() * 5),
        alerts: Math.floor(Math.random() * 10),
      });
    }

    res.json({
      ...mockAnalytics,
      timeSeriesData,
      timeframe,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get heatmap data
router.get('/heatmap', (req, res) => {
  try {
    // Mock heatmap data (user density and incidents)
    const heatmapData = [
      { lat: 40.7128, lng: -74.0060, intensity: 0.8, type: 'users' },
      { lat: 40.7580, lng: -73.9855, intensity: 0.6, type: 'users' },
      { lat: 40.7614, lng: -73.9776, intensity: 0.9, type: 'users' },
      { lat: 40.7505, lng: -73.9934, intensity: 0.4, type: 'incidents' },
      { lat: 40.7282, lng: -74.0776, intensity: 0.7, type: 'incidents' },
    ];

    res.json({
      heatmapData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get predictive risk analytics
router.get('/predictive-risk', (req, res) => {
  try {
    const predictiveData = {
      highRiskAreas: [
        { location: { lat: 40.7505, lng: -73.9934 }, riskScore: 0.85, trend: 'increasing' },
        { location: { lat: 40.7282, lng: -74.0776 }, riskScore: 0.72, trend: 'stable' },
      ],
      recommendations: [
        'Increase patrols in Times Square area',
        'Monitor user density in Central Park after dark',
        'Pre-emptive alerts for high-traffic tourist zones',
      ],
      nextHourForecast: {
        avgRiskScore: 0.42,
        expectedAlerts: 3,
        recommendedActions: ['Monitor Zone 2', 'Prepare response team'],
      },
    };

    res.json(predictiveData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

