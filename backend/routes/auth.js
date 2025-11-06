const express = require('express');
const router = express.Router();

// Mock user database (in production, use Firebase/Firestore)
const users = [];

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // In production, hash password with bcrypt
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // Hash in production
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
      token: 'mock-jwt-token', // In production, generate real JWT
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Google OAuth callback
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({ error: 'Google authentication data required' });
    }

    // Find or create user
    let user = users.find(u => u.email === email || u.googleId === googleId);
    
    if (!user) {
      user = {
        id: Date.now().toString(),
        email,
        name,
        googleId,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
    }

    res.json({
      message: 'Google authentication successful',
      user: { id: user.id, email: user.email, name: user.name },
      token: 'mock-jwt-token',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

