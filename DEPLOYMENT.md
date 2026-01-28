# Deployment Guide for Font Upload & Authentication

## Prerequisites
- Node.js 18 or higher
- npm

## Quick Start (Development)

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
# or
npm run dev
```

3. Access the application:
- Main app: http://localhost:8080/design.html
- Test page: http://localhost:8080/test-font-auth.html
- Homepage: http://localhost:8080/

## Environment Variables

Create a `.env` file for production:

```bash
# Server Configuration
PORT=8080
NODE_ENV=production

# Session Secret (CHANGE THIS!)
SESSION_SECRET=your-very-secure-random-secret-key-here

# Optional: Database configuration for future use
# DATABASE_URL=postgresql://user:pass@host:port/db
```

## Production Deployment

### Option 1: Traditional Server (PM2)

1. Install PM2:
```bash
npm install -g pm2
```

2. Start with PM2:
```bash
pm2 start server.js --name trafficsign-server
pm2 save
pm2 startup
```

3. Monitor:
```bash
pm2 status
pm2 logs trafficsign-server
```

### Option 2: Docker

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
```

2. Build and run:
```bash
docker build -t trafficsign .
docker run -p 8080:8080 -v $(pwd)/server_data:/app/server_data trafficsign
```

### Option 3: Google Cloud App Engine

The existing `app.yaml` needs to be updated for Node.js:

```yaml
runtime: nodejs22
service: default

instance_class: F1
automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 3

handlers:
- url: /api/.*
  script: auto
  secure: always

- url: /.*
  static_dir: .
  secure: always
```

Deploy:
```bash
gcloud app deploy
```

### Option 4: Heroku

1. Create `Procfile`:
```
web: node server.js
```

2. Deploy:
```bash
heroku create your-app-name
git push heroku main
```

## Security Checklist for Production

- [ ] Change SESSION_SECRET to a secure random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set secure cookie options (already configured)
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Configure backups for server_data/
- [ ] Review CORS settings
- [ ] Implement CSRF protection
- [ ] Add input validation middleware

## File Structure

```
TrafficSign/
├── server.js                 # Backend server
├── server_data/              # Data directory (gitignored)
│   ├── users.json           # User accounts
│   ├── fonts_meta.json      # Font metadata
│   └── fonts/               # Uploaded font files
├── js/
│   ├── modal/
│   │   ├── md-auth.js       # Authentication modal
│   │   └── md-font.js       # Font management (updated)
│   ├── sidebar/
│   │   └── sb-settings.js   # Settings panel (updated)
│   └── preload.js           # App initialization (updated)
├── test-font-auth.html       # Testing interface
└── FONT_UPLOAD_DOCS.md       # Detailed documentation
```

## Backup and Recovery

### Backup
```bash
# Backup user data and fonts
tar -czf backup-$(date +%Y%m%d).tar.gz server_data/
```

### Restore
```bash
tar -xzf backup-20260127.tar.gz
```

## Troubleshooting

### Server won't start
- Check if port 8080 is available
- Verify Node.js version (18+)
- Check npm install completed successfully

### Fonts not persisting
- Verify server_data/ directory exists and is writable
- Check server logs for errors
- Ensure authentication is working

### Authentication issues
- Clear browser cookies
- Check session secret is set
- Verify server_data/users.json exists

### Upload failures
- Check file size limits (10MB default)
- Verify file type is supported (.ttf, .otf, .woff, .woff2)
- Check disk space
- Review server logs

## Monitoring

Add logging middleware for production:

```javascript
// Add to server.js after other middleware
const morgan = require('morgan');
app.use(morgan('combined'));
```

## Performance Optimization

1. Enable compression:
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. Add caching headers for static files
3. Consider using a CDN for static assets
4. Implement database instead of JSON files for better performance

## Support

For issues or questions:
- Check FONT_UPLOAD_DOCS.md for detailed documentation
- Review server logs in production
- Test with test-font-auth.html page
