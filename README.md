# Sign2GPT Learning Platform

A complete full-stack sign language learning platform with authentication, email verification, and AI-powered video analysis.

## 🚀 Features

### Authentication
- ✅ User registration with email and password
- ✅ Email verification system
- ✅ Secure login with JWT tokens
- ✅ Protected routes requiring authentication
- ✅ Beautiful toast notifications for all user actions

### Learning Platform
- ✅ Multiple learning levels (A1, A2, B1, B2, C1, C2)
- ✅ Interactive word cards with embedded YouTube videos
- ✅ Video upload for sign language practice
- ✅ AI-powered verification using Sign2GPT model
- ✅ Real-time feedback on submissions
- ✅ Confidence scores for predictions

### UI/UX
- ✅ Modern, responsive design
- ✅ Gradient backgrounds with unified brand colors
- ✅ Smooth animations and transitions
- ✅ Loading states for all async operations
- ✅ Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for email verification
- Express FileUpload for video handling
- Axios for AI API integration

### Frontend
- React 18
- React Router for navigation
- React Hot Toast for notifications
- Axios for API calls
- Modern CSS with animations

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email sending) or other SMTP server

### Step 1: Clone and Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sign2gpt

# JWT Configuration (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=Sign2GPT <noreply@sign2gpt.com>

# Frontend URL
FRONTEND_URL=http://localhost:3000

# AI Model API
AI_API_URL=https://ahmedmoasd-sign2gpt.hf.space
```

### Step 3: Gmail Setup (for email verification)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the generated password
   - Use this as `EMAIL_PASSWORD` in .env

### Step 4: Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

## 🚀 Running the Application

### Development Mode

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

Or run both concurrently:

```bash
npm run dev:full
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📱 Usage Guide

### 1. Sign Up
- Navigate to http://localhost:3000
- Click "Sign up" link
- Enter your email and password (min 6 characters)
- Submit the form
- Check your email for verification link

### 2. Verify Email
- Open the verification email
- Click the verification link
- You'll be automatically logged in and redirected to the home page

### 3. Choose a Level
- On the home page, you'll see all available levels (A1-C2)
- Click on any level card to view its words

### 4. Practice Sign Language
- Each word card displays:
  - The word name
  - An embedded YouTube video demonstrating the sign
  - A video upload section

### 5. Submit Your Recording
- Watch the demonstration video
- Record yourself performing the sign
- Click "Choose Video to Upload" and select your recording
- Click "Submit Recording"
- The AI will analyze your video and provide feedback:
  - ✅ Green notification: Correct match
  - ❌ Red notification: Incorrect or no match
  - Confidence score and predicted word

## 🏗️ Project Structure

```
sign2gpt-platform/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   └── User.js               # User model with encryption
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── levels.js             # Learning levels routes
│   │   └── submissions.js        # Video submission & AI verification
│   ├── utils/
│   │   └── sendEmail.js          # Email sending utility
│   └── server.js                 # Express server setup
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js   # Protected route wrapper
│   │   ├── pages/
│   │   │   ├── Login.js          # Login page
│   │   │   ├── Signup.js         # Registration page
│   │   │   ├── VerifyEmail.js    # Email verification page
│   │   │   ├── Home.js           # Levels dashboard
│   │   │   ├── LevelPage.js      # Word cards & submission
│   │   │   └── *.css             # Page styles
│   │   ├── services/
│   │   │   └── api.js            # API client & services
│   │   ├── App.js                # Main app component
│   │   └── index.js              # React entry point
│   └── package.json
├── language_letter.json          # Learning data (words & videos)
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Brand Colors

The platform uses a cohesive color scheme:

- **Primary**: `#4F46E5` (Indigo)
- **Primary Dark**: `#4338CA`
- **Secondary**: `#8B5CF6` (Purple)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)
- **Background Gradient**: `#667eea` to `#764ba2`

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Email verification required before login
- Token expiration (7 days default)
- Secure file upload handling
- Environment variables for sensitive data

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify/:token` - Verify email

### Levels (Protected)
- `GET /api/levels` - Get all learning levels
- `GET /api/levels/:levelId` - Get words for a specific level

### Submissions (Protected)
- `POST /api/submissions/verify` - Upload and verify video

## 🤖 AI Integration

The platform integrates with the Sign2GPT AI model:
- **API**: https://ahmedmoasd-sign2gpt.hf.space
- **Endpoint**: `/predict`
- **Method**: POST with video file
- **Response**: Top 5 predictions with confidence scores

## 🐛 Troubleshooting

### Email Not Sending
- Verify Gmail App Password is correct
- Check if 2FA is enabled on Gmail
- Ensure EMAIL_USER and EMAIL_PASSWORD are set in .env
- Check firewall/antivirus blocking port 587

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity (if using Atlas)

### Video Upload Fails
- Check file size (max 50MB)
- Verify AI_API_URL is accessible
- Check network connection
- Ensure video format is supported (.mp4, .avi, .mov, .webm)

### Authentication Issues
- Clear browser localStorage
- Verify JWT_SECRET is set in .env
- Check token hasn't expired
- Ensure email is verified

## 📝 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub.
