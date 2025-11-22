# Streak

A minimal, beautifully designed streak tracking application built with React and Firebase.

## Overview

Streak is a web application that helps users build and maintain consistent habits by tracking daily streaks. Users can create custom streaks, log daily check-ins, and earn achievements as they progress.

## Features

- **Authentication**: Secure user registration and login with Firebase Authentication
- **Streak Management**: Create, update, and delete custom streaks
- **Daily Check-in**: Log daily progress with a single tap
- **Real-time Sync**: All changes sync instantly across devices using Firestore
- **Achievement Tracking**: Earn badges based on streak milestones
- **Responsive UI**: Clean, intuitive interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: Tailwind CSS
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 14 or higher
- npm or yarn
- A Firebase project with Authentication and Firestore enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Antxnrx/Streak.git
cd Streak
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Firebase credentials to `.env`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Running Locally

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/        # Reusable UI components
├── screens/          # Page components
├── context/          # React Context providers (Auth, Streaks)
├── services/         # Firebase service functions
├── config/           # Firebase configuration
├── utils/            # Utility functions
└── styles/           # Global styles
```

## Usage

1. Sign up or log in with your email
2. Create a new streak by clicking "New Streak"
3. Check in daily to maintain your streak
4. View your achievements and progress on the Achievements page
5. Manage your streaks from the home dashboard

## Author

Anton Raj Singh

## License

This project is open source and available under the MIT License.
