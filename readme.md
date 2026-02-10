# Road Sign Factory
 > *"That's the way it is."*
 
## About

Road Sign Factory is a professional web-based application for designing, customizing, and exporting traffic signs. Built with modern web technologies and following Hong Kong TPDM standards, it provides engineers and designers with powerful tools for creating compliant road signage.

🌐 **Website:** [roadsignfactory.hk](https://roadsignfactory.hk/)  
🚀 **Launch App:** [roadsignfactory.hk/design.html](https://roadsignfactory.hk/design.html)  
📖 **Documentation:** [GitHub Repository](https://github.com/namasnem/TrafficSign)

## ⚠️ Development Status

**Version 1.3.1** - This application is in active development with regular feature updates and improvements. While functional and deployed in production, new features are being continuously added.

## ✨ Key Features

- 🎨 **Vector Graphics**: Professional scalable sign design using Fabric.js
- 📝 **Typography**: Transport fonts (Medium/Heavy) with TPDM compliance, plus NotoSansHK and Kai fonts
- 🔧 **Symbol Library**: 30+ comprehensive traffic symbols and glyphs
- 📐 **Precision Tools**: Built-in measurement, grid systems, and snap-to-grid functionality
- 📤 **Multi-Format Export**: SVG, DXF, PNG, and PDF support
- 🖼️ **Posters Gallery**: Download high-quality traffic sign posters
- 📱 **Cross-Platform**: Responsive design works on desktop, tablet, and mobile with touch support
- 🎯 **Standards Compliant**: Hong Kong TPDM guidelines
- 💾 **Save & Load**: Automatic save to browser storage with manual save/load functionality
- 🔐 **Font Upload**: Custom font upload with authentication system
- 🌐 **Internationalization**: Multi-language support (English and Chinese)
- 🎨 **Professional Homepage**: SEO-optimized landing page with interactive demos

## 🏗️ Project Structure

The application uses a professional multi-page structure:

### Main Pages
- **`index.html`** - Professional landing page with SEO optimization
- **`design.html`** - The main sign designer application interface
- **`about.html`** - About page with features and technical information
- **`getting-started.html`** - Step-by-step tutorial and user guide
- **`changelog.html`** - Version history and release notes
- **`posters.html`** - Featured posters gallery for download

### Key Directories
- **`css/`** - Stylesheets for homepage and application
  - `homepage.css` - Landing page styles
  - `style.css` - Application styles
- **`js/`** - JavaScript modules and application logic
  - `homepage.js` - Landing page interactions
  - `main.js` - Application entry point
  - `modal/` - Modal dialogs (authentication, font management)
  - `sidebar/` - Sidebar panels and controls
- **`server_data/`** - Server-side data storage (fonts, user accounts)
- **`tests/`** - Test suite with Jest
- **`docs/`** - Additional documentation

### Build System
- **`webpack.config.js`** - Webpack build configuration
- **`babel.config.json`** - Babel transpilation settings
- **`jest.config.js`** - Jest test configuration
- **`server.js`** - Express backend server for font upload and authentication
## 🚀 Getting Started

### For Users
1. Visit [roadsignfactory.hk](https://roadsignfactory.hk/)
2. Click "Launch Application" to start designing
3. Check out the [Getting Started Guide](https://roadsignfactory.hk/getting-started.html) for tutorials

### For Developers

#### Prerequisites
- Node.js 18 or higher
- npm

#### Installation
```bash
# Clone the repository
git clone https://github.com/namasnem/TrafficSign.git
cd TrafficSign

# Install dependencies
npm install
```

#### Development
```bash
# Start development server (includes backend for font upload)
npm start
# or
npm run dev

# Access the application
# - Main app: http://localhost:8080/design.html
# - Homepage: http://localhost:8080/
# - Test page: http://localhost:8080/test-font-auth.html
```

#### Building
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

#### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📱 Mobile Support

The application includes comprehensive responsive design and touch support:
- Touch-friendly interface optimized for tablets and mobile devices
- Gesture support for drawing, dragging, and manipulation
- Adaptive layout that adjusts to different screen sizes
- Mobile navigation with hamburger menu
- Optimized performance for mobile browsers

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide for various platforms
- **[FONT_UPLOAD_DOCS.md](./FONT_UPLOAD_DOCS.md)** - Font upload and authentication system documentation
- **[SECURITY.md](./SECURITY.md)** - Security policy and vulnerability reporting
- **[docs/HOMEPAGE_SUMMARY.md](./docs/HOMEPAGE_SUMMARY.md)** - Homepage redesign and SEO implementation details
- **[docs/TESTING.md](./docs/TESTING.md)** - Testing guidelines and procedures

## 🎯 Roadmap & Future Goals

### Completed ✅
- [x] Unified input values for x-height and color across all panels
- [x] Professional homepage with SEO optimization
- [x] Touch screen gesture support
- [x] Save and load functionality with localStorage
- [x] Font upload system with authentication
- [x] Multi-language support (English and Chinese)
- [x] Interactive demo section on homepage
- [x] Comprehensive documentation
- [x] Testing infrastructure with Jest

### Planned Features 🔮
- [ ] Enhanced hint system for user inputs
- [ ] Additional language support (beyond English and Chinese)
- [ ] Collaborative editing features
- [ ] More advanced symbol customization
- [ ] Template library expansion
- [ ] Export quality improvements
- [ ] Progressive Web App (PWA) features
- [ ] Offline mode support
- [ ] User accounts and cloud storage
- [ ] API for programmatic sign generation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📧 Contact

For questions, feedback, or support:
- **GitHub Issues**: [Report issues or request features](https://github.com/namasnem/TrafficSign/issues)
- **Email**: enquiry@g1213123.info
- **Threads**: [@ginger_n_1213](https://www.threads.net/@ginger_n_1213)

## ☕ Support the Project

If you find this tool useful, consider supporting its development:

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/default-blue.png)](https://www.buymeacoffee.com/G1213123)

## Legal Disclaimer

### Font Usage
- Font Transport Medium and Transport Heavy is subject to Crown Copyright, and contains public sector information licensed under the Open Government Licence v1.0.
- NotoSansHK fonts are licensed under the SIL Open Font License.
- Kai font (edukai) is licensed under its respective license terms.

### Usage Limitations
- This application is provided for personal, educational, and non-commercial use only.
- Commercial use of this application or any of its components is strictly prohibited without prior written permission.

### Liability Disclaimer
- This software is provided "as is", without warranty of any kind, express or implied.
- The authors or copyright holders shall not be liable for any claim, damages, or other liability arising from the use of the software or any outputs generated by it.
- Users are solely responsible for verifying the accuracy and compliance of any signs created using this tool with relevant local regulations and standards.
- By using this application, you acknowledge and accept these terms and limitations.
