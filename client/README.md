# Initial D Web Project

A web application project built with Astro and Express.

## 🚀 Project Structure

```
/
├── client/          # Astro frontend
│   ├── src/
│   │   ├── pages/       # Page routing
│   │   ├── components/  # Astro components
│   │   ├── services/    # API services
│   │   ├── layout/      # Layout components
│   │   └── styles/      # Global styles
│   ├── public/      # Static files (images, audio, JS)
│   └── dist/        # Build output directory
├── server/          # Express backend
│   └── app.js       # Express server (serverless compatible)
├── api/             # Vercel serverless functions
│   └── index.js     # Vercel entry point
└── vercel.json      # Vercel deployment configuration
```

## 🛠️ Tech Stack

### Frontend
- **Astro** - Static site generator
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility CSS framework
- **GSAP** - Animation library

### Backend
- **Express.js** - Node.js web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

## 📦 Installation & Setup

### Local Development Setup

1. **Install Dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

2. **Run Development Servers**
   ```bash
   # Client development server (port 4321)
   cd client
   npm run dev
   
   # Server development server (port 3000)
   cd server
   npm run dev
   ```

3. **Production Build**
   ```bash
   # Build client
   cd client
   npm run build
   
   # Preview build
   npm run preview
   ```

## 📄 Main Pages

- `/` - Main page (Login)
- `/signup` - Sign up
- `/dashboard` - Dashboard
- `/user` - User profile
- `/contact` - Contact form
- `/forgot` - Forgot password
- `/reset` - Reset password

## 🔐 Authentication System

- JWT-based authentication
- Session timeout management
- Password hashing (bcryptjs)
- Token verification middleware

## 🎨 Key Features

- User authentication (login/signup)
- Profile management (name, phone, address, profile picture)
- GSAP page transition animations
- GSAP main page intro animation with timing sequences:
  - Text animations with character-by-character reveal
  - Light dot effects and movement
  - White flash transition effect
  - Background image fade-in
  - Logo and button fade-in animations
  - Audio playback integration
- Responsive design (mobile/desktop)
- Session management and timeout

## 📝 Environment Variables

Environment variables needed for local development:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - JWT secret key (default: "my-secret-jwt-secret")

## 🧞 Commands

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview build

### Server
- `npm start` - Start production server
- `npm run dev` - Start development server (nodemon)

## 📚 Key Directories

- `client/src/pages/` - Astro page routing
- `client/src/components/` - Reusable components
- `client/src/services/` - API call services
- `server/app.js` - Express server and API endpoints
- `api/index.js` - Vercel serverless function entry point
