# Font Upload & Authentication System

## Overview
This implementation adds a backend server with authentication and persistent font storage to the TrafficSign application.

## Features Implemented

### 1. Backend Server (Node.js/Express)
- **Location**: `server.js`
- **Port**: 8080 (configurable via PORT environment variable)
- **Data Storage**: File-based (JSON files for metadata, file system for fonts)
- **Session Management**: express-session with cookie-based authentication

### 2. Authentication System

#### Endpoints
- `POST /api/register` - Register new user
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ "success": true, "username": "string" }`
  - Validation: username >= 3 chars, password >= 6 chars

- `POST /api/login` - Login existing user
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ "success": true, "username": "string" }`
  - Sets session cookie

- `POST /api/logout` - Logout current user
  - Returns: `{ "success": true }`
  - Destroys session

- `GET /api/auth/status` - Check authentication status
  - Returns: `{ "authenticated": boolean, "username": "string" }`

#### Security
- Passwords are hashed using SHA-256
- Session-based authentication with httpOnly cookies
- CORS enabled for local development
- User data stored in `server_data/users.json`

### 3. Font Management System

#### Endpoints
- `POST /api/fonts` - Upload multiple fonts (requires authentication)
  - Form data with `fonts` field (supports multiple files)
  - Accepts: .ttf, .otf, .woff, .woff2
  - Max file size: 10MB per file
  - Returns: Array of uploaded font metadata

- `GET /api/fonts` - List user's uploaded fonts (requires authentication)
  - Returns: Array of font metadata for current user

- `GET /api/fonts/:id` - Download specific font (requires authentication)
  - Returns: Font file as binary data

- `DELETE /api/fonts/:id` - Delete font (requires authentication)
  - Returns: `{ "success": true }`

#### Storage
- Font files stored in `server_data/fonts/`
- Font metadata stored in `server_data/fonts_meta.json`
- Each font has unique ID, stored with user association
- Only owner can access/delete their fonts

### 4. Frontend Updates

#### New Modal: md-auth.js
- Login/Register modal with tabbed interface
- Username and password validation
- Session management
- Integration with AuthManager

#### Updated: md-font.js
- Multiple file upload support (`multiple` attribute on file inputs)
- Server integration for font upload
- Automatic font loading from server on initialization
- Fallback to localStorage if not authenticated
- Handles both Chinese and English font uploads

#### Updated: sb-settings.js
- Added "Account & Fonts" section
- Login/Register button
- Logout button with username display
- "Manage Chinese Fonts" button
- "Manage English Fonts" button
- Dynamic UI based on authentication status

#### Updated: preload.js
- Initialize AuthManager before other components
- Load fonts from server after authentication check

### 5. Configuration Updates

#### package.json
- Added dependencies:
  - express: ^4.18.2
  - express-session: ^1.17.3
  - multer: ^1.4.5-lts.1
  - cors: ^2.8.5
- Updated start script to run Node.js server

#### .gitignore
- Added `server_data/` to ignore uploaded fonts and user data

## Testing

### Manual Testing Performed
✅ User registration with validation
✅ User login with session persistence
✅ User logout
✅ Multiple font file upload (tested with 2 files)
✅ Font listing (shows only user's fonts)
✅ Font deletion
✅ Font persistence across sessions
✅ Authentication state management

### Test Results
All API endpoints tested and working correctly:
- Registration: ✅ Success
- Login: ✅ Success
- Logout: ✅ Success
- Upload fonts: ✅ Success (multiple files)
- List fonts: ✅ Success (user-specific)
- Delete fonts: ✅ Success
- Download fonts: ✅ Success

## Usage

### Starting the Server
```bash
npm install
npm start
# Server runs on http://localhost:8080
```

### Testing the System
1. Navigate to http://localhost:8080/test-font-auth.html
2. Click "Login / Register"
3. Register a new account
4. Upload multiple font files
5. View uploaded fonts
6. Test persistence by refreshing
7. Logout and verify user-specific data

### Using in the Application
1. Navigate to http://localhost:8080/design.html
2. Open Settings panel (gear icon)
3. Scroll to "Account & Fonts" section
4. Click "Login / Register" if not logged in
5. After login, click "Manage Chinese Fonts" or "Manage English Fonts"
6. Select multiple font files to upload
7. Fonts are saved to server and persist across sessions

## Data Structure

### User Data (server_data/users.json)
```json
{
  "username": {
    "passwordHash": "sha256-hash",
    "createdAt": "ISO-8601-timestamp"
  }
}
```

### Font Metadata (server_data/fonts_meta.json)
```json
[
  {
    "id": "unique-id",
    "userId": "username",
    "originalName": "font.ttf",
    "filename": "stored-filename.ttf",
    "size": 12345,
    "uploadedAt": "ISO-8601-timestamp"
  }
]
```

## Future Enhancements

Potential improvements for production:
1. Use a proper database (PostgreSQL, MongoDB)
2. Implement JWT tokens instead of sessions
3. Add password reset functionality
4. Add email verification
5. Implement rate limiting
6. Add file type validation beyond extension
7. Implement font preview before upload
8. Add bulk font operations
9. Implement font sharing between users
10. Add font categories/tags

## Security Notes

**Important**: This implementation is suitable for development/demo purposes. For production:
- Use a secure session secret (environment variable)
- Implement HTTPS
- Use bcrypt instead of SHA-256 for passwords
- Add CSRF protection
- Implement rate limiting
- Add input sanitization
- Use a proper database with prepared statements
- Implement proper logging and monitoring
- Add backup and recovery mechanisms
