# Sign2GPT Frontend

React-based frontend for the Sign2GPT Learning Platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── PrivateRoute.js  # Protected route wrapper
│
├── pages/              # Page components
│   ├── Login.js        # Login page
│   ├── Signup.js       # Registration page
│   ├── VerifyEmail.js  # Email verification page
│   ├── Home.js         # Levels dashboard
│   ├── LevelPage.js    # Word cards & video upload
│   ├── Auth.css        # Auth pages styling
│   ├── Home.css        # Home page styling
│   └── LevelPage.css   # Level page styling
│
├── services/           # API services
│   └── api.js         # API client & service methods
│
├── App.js             # Main app component & routing
├── App.css            # Global app styles
├── index.js           # React entry point
└── index.css          # Base styles
```

## 🎨 Styling

- Custom CSS (no framework)
- CSS variables for colors
- Mobile-first responsive design
- Smooth animations and transitions

### Brand Colors
```css
--primary: #4F46E5        /* Indigo */
--primary-dark: #4338CA   /* Dark Indigo */
--secondary: #8B5CF6      /* Purple */
--success: #10B981        /* Green */
--error: #EF4444          /* Red */
```

## 🔌 API Integration

The frontend communicates with the backend API via Axios.

### API Base URL
Development: `http://localhost:5000/api` (proxied)
Production: Set via `REACT_APP_API_URL` environment variable

### Services Available
- `authService`: signup, login, verifyEmail
- `levelService`: getLevels, getLevelWords
- `submissionService`: verifySubmission

## 🛡️ Authentication

### Token Storage
JWT token stored in `localStorage`:
```javascript
localStorage.setItem('token', token);
localStorage.getItem('token');
localStorage.removeItem('token');
```

### Protected Routes
Wrap routes with `<PrivateRoute>` component:
```jsx
<Route path="/home" element={
  <PrivateRoute>
    <Home />
  </PrivateRoute>
} />
```

### Auto-Logout
401 responses automatically clear token and redirect to login.

## 📱 Components

### PrivateRoute
Protects routes requiring authentication.
```jsx
import PrivateRoute from './components/PrivateRoute';

<PrivateRoute>
  <ProtectedComponent />
</PrivateRoute>
```

### Toast Notifications
Using `react-hot-toast`:
```javascript
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
toast.loading('Loading...');
```

## 📄 Pages

### Login Page (`/login`)
- Email and password inputs
- Form validation
- Error handling
- Link to signup

### Signup Page (`/signup`)
- Email and password inputs
- Password confirmation
- Password strength validation
- Email format validation
- Link to login

### Verify Email Page (`/verify-email/:token`)
- Automatic verification on mount
- Token from URL parameter
- Auto-redirect on success
- Error handling

### Home Page (`/home`)
- Displays all learning levels
- Level cards with word counts
- Navigation to level pages
- Logout functionality

### Level Page (`/level/:levelId`)
- Grid of word cards
- Embedded YouTube videos
- Video upload for each word
- AI verification results
- Back navigation

## 🔄 State Management

Using React hooks:
- `useState`: Local component state
- `useEffect`: Side effects (API calls, etc.)
- `useNavigate`: Programmatic navigation
- `useParams`: URL parameters

### Example State Pattern
```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getData();
      setData(response.data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

## 🎥 Video Integration

### YouTube Embedding
```javascript
const getYoutubeEmbedUrl = (url) => {
  const videoIdMatch = url.match(/[?&]v=([^&]+)|youtu\.be\/([^&]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] || videoIdMatch[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};
```

### File Upload
```javascript
const [file, setFile] = useState(null);

const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('expectedWord', word);
  
  const response = await submissionService.verifySubmission(file, word);
};
```

## 🚀 Build & Deploy

### Development Build
```bash
npm start
```
Runs on http://localhost:3000 with hot reload.

### Production Build
```bash
npm run build
```
Creates optimized build in `build/` directory.

### Environment Variables

Create `.env` file:
```env
REACT_APP_API_URL=https://your-api-url.com/api
```

## 🧪 Testing

Currently manual testing. To add automated tests:

```bash
npm test
```

### Test Libraries Available
- Jest (included with Create React App)
- React Testing Library (included)

## 📦 Dependencies

### Core
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `react-router-dom`: ^6.23.1

### Utilities
- `axios`: ^1.7.2
- `react-hot-toast`: ^2.4.1

### Development
- `react-scripts`: 5.0.1

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or choose different port when prompted
```

### Proxy Not Working
Check `package.json` has:
```json
"proxy": "http://localhost:5000"
```

### CORS Errors
Ensure backend has CORS enabled and proxy is configured.

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🔧 Development Tips

### Hot Reload
Save files to see changes instantly.

### Browser DevTools
- Console: View logs and errors (F12)
- Network: Monitor API calls
- React DevTools: Inspect components

### Code Style
- Use functional components
- Prefer hooks over classes
- Keep components small and focused
- Extract reusable logic

### Folder Organization
- Components: Reusable UI pieces
- Pages: Route-level components
- Services: API and business logic

## 📚 Learn More

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Create React App](https://create-react-app.dev)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) in the root directory.

## 📄 License

MIT License - See root directory for details.
