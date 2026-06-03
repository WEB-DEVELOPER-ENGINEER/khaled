# Deployment Guide

## Production Deployment Checklist

### Security
- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS for frontend and backend
- [ ] Configure CORS for specific domains only
- [ ] Use MongoDB Atlas or secured MongoDB instance
- [ ] Enable rate limiting
- [ ] Add helmet.js for security headers

### Environment Variables
Update `.env` for production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sign2gpt
JWT_SECRET=use-strong-random-32-character-string
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=production-email@domain.com
EMAIL_PASSWORD=app-specific-password
EMAIL_FROM=Sign2GPT <noreply@yourdomain.com>
FRONTEND_URL=https://yourdomain.com
AI_API_URL=https://ahmedmoasd-sign2gpt.hf.space
```

## Deployment Options

#### Using PM2 for Process Management

```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start backend/server.js --name sign2gpt-api

# Save PM2 configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

#### Nginx Configuration

```nginx
# Backend proxy
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/sign2gpt/frontend/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```