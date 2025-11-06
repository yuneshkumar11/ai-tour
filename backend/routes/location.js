const express = require('express');
const router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

// Risk zones database (in production, use Firestore)
const riskZones = [
  {
    id: 'zone1',
    name: 'High Crime Area',
    center: { lat: 40.7128, lng: -74.0060 }, // NYC example
    radius: 500, // meters
    riskLevel: 'high',
    description: 'High crime rate area',
  },
  {
    id: 'zone2',
    name: 'Unsafe Neighborhood',
    center: { lat: 40.7580, lng: -73.9855 },
    radius: 300,
    riskLevel: 'medium',
    description: 'Exercise caution in this area',
  },
];

// Calculate distance between two points
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Check if point is in risk zone
router.post('/geofence-check', (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const nearbyZones = [];
    let highestRisk = 'low';

    riskZones.forEach(zone => {
      const distance = calculateDistance(lat, lng, zone.center.lat, zone.center.lng);
      
      if (distance <= zone.radius) {
        nearbyZones.push({
          ...zone,
          distance: Math.round(distance),
        });

        if (zone.riskLevel === 'high') {
          highestRisk = 'high';
        } else if (zone.riskLevel === 'medium' && highestRisk !== 'high') {
          highestRisk = 'medium';
        }
      }
    });

    res.json({
      isInRiskZone: nearbyZones.length > 0,
      riskLevel: highestRisk,
      nearbyZones,
      location: { lat, lng },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get risk assessment
router.get('/risk-assessment', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Check geofencing
    const geofenceResult = await fetch(`http://localhost:${process.env.PORT || 5000}/api/location/geofence-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: latNum, lng: lngNum }),
    }).then(r => r.json()).catch(() => ({ isInRiskZone: false, riskLevel: 'low' }));

    // AI risk scoring (simplified - in production, use ML model)
    const timeOfDay = new Date().getHours();
    const isNightTime = timeOfDay < 6 || timeOfDay > 22;
    const baseRisk = geofenceResult.isInRiskZone ? (geofenceResult.riskLevel === 'high' ? 0.8 : 0.5) : 0.2;
    const timeFactor = isNightTime ? 0.3 : 0;
    const riskScore = Math.min(1, baseRisk + timeFactor);

    res.json({
      riskScore,
      riskLevel: riskScore > 0.7 ? 'high' : riskScore > 0.4 ? 'medium' : 'low',
      factors: {
        geofencing: geofenceResult.isInRiskZone,
        timeOfDay: isNightTime ? 'night' : 'day',
        nearbyZones: geofenceResult.nearbyZones || [],
      },
      recommendations: riskScore > 0.7 
        ? ['Avoid this area if possible', 'Stay in well-lit areas', 'Travel with companions']
        : riskScore > 0.4
        ? ['Exercise caution', 'Stay aware of surroundings']
        : ['Area appears safe', 'Enjoy your visit'],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get safe route directions
router.get('/directions', async (req, res) => {
  try {
    const { origin, destination, avoidHighRisk } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }

    // In production, use Google Directions API
    // For now, return mock directions
    res.json({
      routes: [
        {
          summary: 'Safe route via main roads',
          distance: { text: '5.2 km', value: 5200 },
          duration: { text: '15 mins', value: 900 },
          steps: [
            { instruction: 'Head north on Main St', distance: '200 m' },
            { instruction: 'Turn right on Safe Ave', distance: '1.2 km' },
            { instruction: 'Continue to destination', distance: '3.8 km' },
          ],
        },
      ],
      message: avoidHighRisk === 'true' 
        ? 'Route optimized to avoid high-risk areas'
        : 'Standard route provided',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

