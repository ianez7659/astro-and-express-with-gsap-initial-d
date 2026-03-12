# Initial D Web Application - Project Description

## Overview
A full-stack web application featuring a modern authentication system, user profile management, and immersive GSAP animations. Built with Astro and Express.js, deployed on Vercel with Supabase database integration.

**Live Demo:** [`https://astro-and-express-with-gsap-initial.vercel.app/`](https://astro-and-express-with-gsap-initial.vercel.app/)

## Demo Account

- **Email**: `demo@example.com`
- **Password**: `demo1234`

## Key Features

### Authentication & Security
- **JWT-based authentication system** with secure token management
- **Password hashing** using bcryptjs for enhanced security
- **Session timeout management** with automatic logout functionality
- **Password reset flow** with email token verification
- **Protected route middleware** ensuring secure page access

### User Management
- **User registration and login** with form validation
- **Profile management** including name, phone, address, and profile picture
- **Base64 image upload** for profile pictures stored in database
- **Real-time profile updates** with immediate UI feedback

### User Interface & Experience
- **GSAP-powered animations**:
  - Sophisticated intro sequence with character-by-character text reveals
  - Smooth page transitions with fade and slide effects
  - Light dot effects and white flash transitions
  - Coordinated audio playback synchronized with animations
- **Responsive design** optimized for both mobile and desktop viewports
- **Modern UI** built with Tailwind CSS utility classes
- **Accessible navigation** with consistent back button placement

### Technical Architecture
- **Frontend**: Astro framework with TypeScript for type safety
- **Backend**: Express.js RESTful API with serverless function compatibility
- **Database**: Supabase (PostgreSQL) for persistent data storage
- **Deployment**: Vercel serverless functions for scalable hosting
- **State Management**: Session storage for client-side token management
- **CORS configuration** for secure cross-origin requests

## Technical Stack

**Frontend:**
- Astro 5.7+
- TypeScript
- Tailwind CSS 3.4+
- GSAP 3.14+ (GreenSock Animation Platform)

**Backend:**
- Express.js 4.18+
- JSON Web Tokens (JWT)
- bcryptjs 2.4+
- Supabase Client SDK 2.39+

**DevOps:**
- Vercel deployment
- Environment variable management
- Serverless function architecture

## Project Structure
```
/
├── client/               # Astro frontend application
│   ├── src/
│   │   ├── pages/        # Route pages (dashboard, user, contact, etc.)
│   │   ├── components/   # Reusable Astro components
│   │   ├── layout/       # Layout components with protected routes
│   │   ├── services/     # API service layer (TypeScript)
│   │   ├── scripts/      # GSAP animations & client-side handlers (TypeScript)
│   │   └── styles/       # Global CSS styles
│   └── public/           # Static assets (images, audio, etc.)
├── server/               # Express backend API
│   └── app.js            # RESTful API endpoints (Supabase integration)
├── api/                  # Vercel serverless functions
│   └── index.js          # Serverless entry (subset of Express API)
└── vercel.json           # Vercel deployment configuration
```

## Core Functionality

### API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication
- `GET /api/user/profile` - Retrieve user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/profile-picture` - Upload profile picture
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Pages
- **Main Page** (`/`) - Landing page with login section and intro animation
- **Signup** (`/signup`) - User registration form
- **Dashboard** (`/dashboard`) - Protected user dashboard with navigation
- **User Profile** (`/user`) - Editable profile management page
- **Contact** (`/contact`) - Contact form page
- **Forgot Password** (`/forgot`) - Password reset request
- **Reset Password** (`/reset`) - Password reset with token

## Key Achievements
- Implemented secure authentication flow with JWT tokens and session management
- Migrated from in-memory data storage to persistent Supabase database
- Created smooth, professional animations using GSAP timeline sequences
- Developed responsive UI components with mobile-first approach
- Configured Vercel deployment with serverless functions and environment variables
- Built reusable component architecture for maintainable codebase

## Development Highlights
- **Database Migration**: Successfully migrated from temporary in-memory storage to production-ready Supabase PostgreSQL database
- **Animation System**: Implemented complex GSAP animation sequences with precise timing control and audio synchronization
- **State Management**: Created centralized audio management system to prevent overlapping audio playback across page transitions
- **Security**: Implemented middleware for protected routes and token validation
- **Deployment**: Configured Vercel for seamless deployment with proper environment variable handling

