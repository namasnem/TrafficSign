/**
 * server.js - Backend server for TrafficSign application
 * Provides font upload/storage and simple authentication
 */

const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Directories for storing data
const DATA_DIR = path.join(__dirname, 'server_data');
const FONTS_DIR = path.join(DATA_DIR, 'fonts');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const FONTS_META_FILE = path.join(DATA_DIR, 'fonts_meta.json');

// Initialize data directories
async function initializeDirectories() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(FONTS_DIR, { recursive: true });
    
    // Initialize users file if it doesn't exist
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify({}));
    }
    
    // Initialize fonts metadata file if it doesn't exist
    try {
      await fs.access(FONTS_META_FILE);
    } catch {
      await fs.writeFile(FONTS_META_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing directories:', error);
  }
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET environment variable is required in production');
    }
    console.warn('⚠️  WARNING: Using default session secret for development only');
    return 'traffic-sign-secret-key-change-in-production';
  })(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use('/server_data', (req, res) => {
  res.status(403).send('Forbidden');
});
app.use(express.static('.'));

// Configure multer for font uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, FONTS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.ttf', '.otf', '.woff', '.woff2'];
    const allowedMimeTypes = [
      'font/ttf',
      'font/otf', 
      'font/woff',
      'font/woff2',
      'application/x-font-ttf',
      'application/x-font-otf',
      'application/font-woff',
      'application/font-woff2',
      'application/octet-stream' // Browsers sometimes use this for fonts
    ];
    
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    
    if (allowedTypes.includes(ext) && allowedMimeTypes.includes(mimeType)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} are allowed. Received: ${ext} (${mimeType})`));
    }
  }
});

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
}

// Helper functions
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

async function readFontsMeta() {
  try {
    const data = await fs.readFile(FONTS_META_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeFontsMeta(fonts) {
  await fs.writeFile(FONTS_META_FILE, JSON.stringify(fonts, null, 2));
}

function hashPassword(password) {
  // NOTE: SHA-256 is used for simplicity in this demo/development version.
  // For production, use bcrypt or argon2 for secure password hashing:
  // const bcrypt = require('bcrypt');
  // return bcrypt.hash(password, 10);
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const password = req.body.password;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({ error: 'Username must be at least 3 characters, password at least 6 characters' });
    }
    
    const users = await readUsers();
    
    if (users[username]) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    users[username] = {
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    
    await writeUsers(users);
    
    req.session.userId = username;
    req.session.save((sessionError) => {
      if (sessionError) {
        console.error('Session save error during registration:', sessionError);
        return res.status(500).json({ error: 'Registration failed' });
      }

      res.json({ success: true, username });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const password = req.body.password;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const users = await readUsers();
    const user = users[username];
    
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    req.session.userId = username;
    req.session.save((sessionError) => {
      if (sessionError) {
        console.error('Session save error during login:', sessionError);
        return res.status(500).json({ error: 'Login failed' });
      }

      res.json({ success: true, username });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

app.get('/api/auth/status', (req, res) => {
  if (req.session && req.session.userId) {
    res.json({ authenticated: true, username: req.session.userId });
  } else {
    res.json({ authenticated: false });
  }
});

// Font management routes
app.post('/api/fonts', requireAuth, upload.array('fonts', 10), async (req, res) => {
  try {
    const userId = req.session.userId;
    const fonts = await readFontsMeta();
    const uploadedFonts = [];
    
    for (const file of req.files) {
      const fontMeta = {
        id: crypto.randomBytes(8).toString('hex'),
        userId: userId,
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };
      
      fonts.push(fontMeta);
      uploadedFonts.push(fontMeta);
    }
    
    await writeFontsMeta(fonts);
    res.json({ success: true, fonts: uploadedFonts });
  } catch (error) {
    console.error('Font upload error:', error);
    res.status(500).json({ error: 'Font upload failed' });
  }
});

app.get('/api/fonts', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const fonts = await readFontsMeta();
    const userFonts = fonts.filter(font => font.userId === userId);
    res.json(userFonts);
  } catch (error) {
    console.error('Error fetching fonts:', error);
    res.status(500).json({ error: 'Failed to fetch fonts' });
  }
});

app.get('/api/fonts/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const fontId = req.params.id;
    const fonts = await readFontsMeta();
    const font = fonts.find(f => f.id === fontId && f.userId === userId);
    
    if (!font) {
      return res.status(404).json({ error: 'Font not found' });
    }
    
    const fontPath = path.join(FONTS_DIR, font.filename);
    res.sendFile(fontPath);
  } catch (error) {
    console.error('Error downloading font:', error);
    res.status(500).json({ error: 'Failed to download font' });
  }
});

app.delete('/api/fonts/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const fontId = req.params.id;
    const fonts = await readFontsMeta();
    const fontIndex = fonts.findIndex(f => f.id === fontId && f.userId === userId);
    
    if (fontIndex === -1) {
      return res.status(404).json({ error: 'Font not found' });
    }
    
    const font = fonts[fontIndex];
    const fontPath = path.join(FONTS_DIR, font.filename);
    
    // Delete the file
    try {
      await fs.unlink(fontPath);
    } catch (error) {
      console.warn('Font file not found:', fontPath);
    }
    
    // Remove from metadata
    fonts.splice(fontIndex, 1);
    await writeFontsMeta(fonts);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting font:', error);
    res.status(500).json({ error: 'Failed to delete font' });
  }
});

// Start server
async function startServer() {
  await initializeDirectories();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

module.exports = app;
