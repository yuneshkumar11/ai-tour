# 🌍 Smart Tourist Safety Monitoring & Assistance Platform

A comprehensive web-based application that integrates **Google APIs** (Maps, Geolocation, Places, Translation) with **AI features** for real-time risk detection, multilingual communication, and intelligent routing for tourists.

## ✨ Features

- 🔐 **Secure Authentication** - Google OAuth and email/password login
- 🗺️ **Interactive Google Maps** - Real-time location tracking and nearby landmarks
- ⚠️ **AI-Powered Safety Alerts** - Automatic detection of high-risk areas using geofencing
- 🤖 **AI Chatbot Assistant** - Get instant help about nearby facilities and emergency procedures
- 🌐 **Multilingual Translation** - Google Cloud Translation API integration
- 📍 **Incident Reporting** - Report incidents with live location sharing
- 📊 **Admin Dashboard** - Real-time analytics, heatmaps, and predictive risk insights
- 🎨 **Modern UI** - Responsive design with dark/light themes
- 🌍 **Multilingual Interface** - Support for English, Hindi, Chinese, Arabic, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account (for Maps, Translation APIs)
- Firebase account (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-tour
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your API keys:
   - Google Maps API Key
   - Google Translate API Key
   - Firebase configuration
   - Gemini API Key (optional, for AI features)

4. **Run the development server**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
ai-tour/
├── frontend/          # Next.js frontend application
│   ├── app/          # Next.js app router
│   ├── components/   # React components
│   ├── lib/          # Utilities and helpers
│   └── public/       # Static assets
├── backend/          # Node.js Express API
│   ├── routes/       # API routes
│   ├── models/       # Data models
│   ├── services/     # Business logic
│   └── server.js     # Entry point
└── .env.example      # Environment variables template
```

## 🔧 Configuration

### Google APIs Setup

1. **Google Maps JavaScript API**
   - Enable in Google Cloud Console
   - Add API key to `.env` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

2. **Google Cloud Translation API**
   - Enable in Google Cloud Console
   - Add API key to `.env` as `GOOGLE_TRANSLATE_API_KEY`

3. **Google Places API** (optional)
   - Enable for enhanced location features

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password and Google)
3. Create Firestore database
4. Add Firebase config to `.env`

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Maps**: Google Maps JavaScript API
- **Translation**: Google Cloud Translation API
- **Authentication**: Firebase Auth
- **AI/ML**: TensorFlow.js, Gemini API

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth

### Location & Safety
- `GET /api/location/risk-assessment` - Get risk assessment for location
- `POST /api/location/geofence-check` - Check if user is in risk zone
- `GET /api/location/directions` - Get safe route directions

### Translation
- `POST /api/translate` - Translate text

### Incidents
- `POST /api/incidents/report` - Report an incident
- `GET /api/incidents` - Get incident reports (admin)

### Admin
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/heatmap` - Get heatmap data

## 🎯 Usage

1. **Sign Up/Login** - Create an account or login with Google
2. **View Map** - See your location and nearby landmarks
3. **Get Safety Alerts** - Receive automatic alerts in high-risk areas
4. **Use Chatbot** - Ask questions about nearby help centers
5. **Translate** - Translate messages for local communication
6. **Report Incidents** - Share incidents with authorities

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

