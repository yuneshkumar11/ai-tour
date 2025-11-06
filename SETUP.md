# 🚀 Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account
- Firebase account (optional, for production)

## Step 1: Install Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Frontend (Next.js, React, etc.)
- Backend (Express, APIs, etc.)

## Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API**
4. Create credentials (API Key)
5. Add to `.env`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
   ```

### Google Cloud Translation API
1. Enable **Cloud Translation API** in Google Cloud Console
2. Create API key (or use the same one if enabled for both services)
3. Add to `.env`:
   ```
   GOOGLE_TRANSLATE_API_KEY=your_key_here
   ```

### Firebase (Optional - for production authentication)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password and Google)
4. Create Firestore database
5. Add Firebase config to `.env`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Gemini API (Optional - for enhanced AI features)
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

## Step 3: Run the Application

### Development Mode (Both Frontend & Backend)

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Run Separately

**Frontend only:**
```bash
cd frontend
npm run dev
```

**Backend only:**
```bash
cd backend
npm run dev
```

## Step 4: Build for Production

```bash
cd frontend
npm run build
npm start
```

## 📝 Notes

- The backend uses in-memory storage for demo purposes. For production, integrate with Firebase Firestore or a database.
- Google Maps will show a warning if API key is not configured - the app will still work but maps won't load.
- Translation API requires billing enabled in Google Cloud (free tier available).
- Authentication is currently using mock storage - integrate Firebase Auth for production.

## 🐛 Troubleshooting

### Maps not loading
- Check that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set correctly
- Verify Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for API errors

### Translation not working
- Ensure `GOOGLE_TRANSLATE_API_KEY` is set
- Verify Cloud Translation API is enabled
- Check that billing is enabled (free tier is available)

### Backend not starting
- Check that port 5000 is not in use
- Verify all backend dependencies are installed
- Check `.env` file exists in backend directory (currently using root `.env`)

### CORS errors
- Ensure `BACKEND_URL` in frontend matches backend URL
- Check backend CORS configuration in `backend/server.js`

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment-specific API keys
- Restrict API keys in Google Cloud Console (HTTP referrers, IP addresses)
- Use Firebase security rules for production database access

