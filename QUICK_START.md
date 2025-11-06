# ⚡ Quick Start Guide

## 🎯 What's Been Built

A complete **Smart Tourist Safety Monitoring & Assistance Platform** with:

✅ **Authentication** - Login/Register with email or Google  
✅ **Interactive Maps** - Real-time Google Maps with location tracking  
✅ **AI Safety Alerts** - Automatic risk detection and geofencing  
✅ **AI Chatbot** - Safety assistant for emergency help  
✅ **Translation** - Google Cloud Translation API integration  
✅ **Incident Reporting** - Report incidents with location sharing  
✅ **Admin Dashboard** - Analytics, heatmaps, and predictive risk  
✅ **Modern UI** - Responsive design with dark/light themes  
✅ **Multilingual** - Support for multiple languages  

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure API Keys
```bash
cp .env.example .env
# Edit .env and add your Google Maps API key (minimum required)
```

**Minimum Required:**
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Get from [Google Cloud Console](https://console.cloud.google.com/)

**Optional (for full features):**
- `GOOGLE_TRANSLATE_API_KEY` - For translation features
- `GEMINI_API_KEY` - For enhanced AI chatbot
- Firebase config - For production authentication

### 3. Run the App
```bash
npm run dev
```

Visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 How to Use

1. **Sign Up/Login** - Create an account or use Google login
2. **View Map** - See your location and nearby areas
3. **Get Alerts** - Automatic safety alerts in risk zones
4. **Chat with AI** - Ask about hospitals, police, embassies
5. **Translate** - Translate text to communicate with locals
6. **Report Incidents** - Share incidents with authorities

## 🎨 Features Overview

### 🗺️ Interactive Map
- Real-time location tracking
- Nearby landmarks
- Risk zone visualization
- Safe route recommendations

### ⚠️ Safety Alerts
- Automatic geofencing detection
- AI-powered risk scoring
- Time-based risk factors
- Personalized recommendations

### 🤖 AI Chatbot
- 24/7 safety assistance
- Information about hospitals, police, embassies
- Emergency procedure guidance
- Suggested actions

### 🌐 Translation
- Real-time text translation
- Multiple language support
- Text-to-speech
- Auto-detect source language

### 🚨 Incident Reporting
- Quick incident submission
- Location sharing
- Multiple incident types
- Severity levels

### 📊 Admin Dashboard
- Real-time analytics
- User activity tracking
- Incident reports
- Heatmap visualization
- Predictive risk analytics

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Maps**: Google Maps JavaScript API
- **Translation**: Google Cloud Translation API
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## 📝 Notes

- Backend uses in-memory storage for demo (ready for Firebase integration)
- Maps show warning without API key but app still works
- Translation requires Google Cloud billing (free tier available)
- All features work in demo mode without API keys (with mock data)

## 🆘 Need Help?

See `SETUP.md` for detailed setup instructions and troubleshooting.

