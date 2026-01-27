/**
 * md-auth.js - Authentication Modal
 * Handles login/register UI and authentication state
 */

import { ModalUtils } from './mdGeneral.js';
import { GeneralHandler } from '../sidebar/sbGeneral.js';
import { i18n } from '../i18n/i18n.js';

const AuthManager = {
  isAuthenticated: false,
  currentUser: null,
  apiBaseUrl: window.location.origin,
  
  /**
   * Initialize authentication system
   */
  initialize: async function () {
    await AuthManager.checkAuthStatus();
  },
  
  /**
   * Check current authentication status
   */
  checkAuthStatus: async function () {
    try {
      const response = await fetch(`${AuthManager.apiBaseUrl}/api/auth/status`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        AuthManager.isAuthenticated = true;
        AuthManager.currentUser = data.username;
      } else {
        AuthManager.isAuthenticated = false;
        AuthManager.currentUser = null;
      }
      
      return data.authenticated;
    } catch (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
  },
  
  /**
   * Show login modal
   */
  showLoginModal: function () {
    const modalId = 'auth-modal';
    const { modal, modalContent } = ModalUtils.createModal(modalId, 'Login / Register');
    
    // Tab container
    const tabContainer = document.createElement('div');
    tabContainer.className = 'auth-tabs';
    tabContainer.style.display = 'flex';
    tabContainer.style.marginBottom = '20px';
    tabContainer.style.borderBottom = '2px solid #333';
    
    const loginTab = document.createElement('button');
    loginTab.textContent = 'Login';
    loginTab.className = 'auth-tab active';
    loginTab.style.flex = '1';
    loginTab.style.padding = '10px';
    loginTab.style.background = 'none';
    loginTab.style.border = 'none';
    loginTab.style.color = '#fff';
    loginTab.style.cursor = 'pointer';
    loginTab.style.borderBottom = '2px solid #4CAF50';
    
    const registerTab = document.createElement('button');
    registerTab.textContent = 'Register';
    registerTab.className = 'auth-tab';
    registerTab.style.flex = '1';
    registerTab.style.padding = '10px';
    registerTab.style.background = 'none';
    registerTab.style.border = 'none';
    registerTab.style.color = '#999';
    registerTab.style.cursor = 'pointer';
    
    tabContainer.appendChild(loginTab);
    tabContainer.appendChild(registerTab);
    
    // Login form
    const loginForm = document.createElement('div');
    loginForm.className = 'auth-form';
    loginForm.id = 'login-form';
    
    const loginInfo = ModalUtils.createInfoText('Login to save and access your uploaded fonts.');
    
    const usernameGroup = document.createElement('div');
    usernameGroup.className = 'input-group';
    usernameGroup.style.marginBottom = '15px';
    
    const usernameLabel = document.createElement('label');
    usernameLabel.textContent = 'Username';
    usernameLabel.style.display = 'block';
    usernameLabel.style.marginBottom = '5px';
    usernameLabel.style.color = '#ccc';
    
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'login-username';
    usernameInput.placeholder = 'Enter username';
    usernameInput.style.width = '100%';
    usernameInput.style.padding = '10px';
    usernameInput.style.background = '#2a2a2a';
    usernameInput.style.border = '1px solid #444';
    usernameInput.style.borderRadius = '4px';
    usernameInput.style.color = '#fff';
    
    usernameGroup.appendChild(usernameLabel);
    usernameGroup.appendChild(usernameInput);
    
    const passwordGroup = document.createElement('div');
    passwordGroup.className = 'input-group';
    passwordGroup.style.marginBottom = '15px';
    
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Password';
    passwordLabel.style.display = 'block';
    passwordLabel.style.marginBottom = '5px';
    passwordLabel.style.color = '#ccc';
    
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'login-password';
    passwordInput.placeholder = 'Enter password';
    passwordInput.style.width = '100%';
    passwordInput.style.padding = '10px';
    passwordInput.style.background = '#2a2a2a';
    passwordInput.style.border = '1px solid #444';
    passwordInput.style.borderRadius = '4px';
    passwordInput.style.color = '#fff';
    
    passwordGroup.appendChild(passwordLabel);
    passwordGroup.appendChild(passwordInput);
    
    loginForm.appendChild(loginInfo);
    loginForm.appendChild(usernameGroup);
    loginForm.appendChild(passwordGroup);
    
    // Register form
    const registerForm = document.createElement('div');
    registerForm.className = 'auth-form';
    registerForm.id = 'register-form';
    registerForm.style.display = 'none';
    
    const registerInfo = ModalUtils.createInfoText('Create an account to save fonts to the server.');
    
    const regUsernameGroup = usernameGroup.cloneNode(true);
    const regUsernameInput = regUsernameGroup.querySelector('input');
    regUsernameInput.id = 'register-username';
    
    const regPasswordGroup = passwordGroup.cloneNode(true);
    const regPasswordInput = regPasswordGroup.querySelector('input');
    regPasswordInput.id = 'register-password';
    
    const confirmPasswordGroup = passwordGroup.cloneNode(true);
    const confirmPasswordLabel = confirmPasswordGroup.querySelector('label');
    confirmPasswordLabel.textContent = 'Confirm Password';
    const confirmPasswordInput = confirmPasswordGroup.querySelector('input');
    confirmPasswordInput.id = 'register-confirm-password';
    confirmPasswordInput.placeholder = 'Confirm password';
    
    registerForm.appendChild(registerInfo);
    registerForm.appendChild(regUsernameGroup);
    registerForm.appendChild(regPasswordGroup);
    registerForm.appendChild(confirmPasswordGroup);
    
    // Tab switching
    loginTab.onclick = () => {
      loginTab.style.color = '#fff';
      loginTab.style.borderBottom = '2px solid #4CAF50';
      registerTab.style.color = '#999';
      registerTab.style.borderBottom = 'none';
      loginForm.style.display = 'block';
      registerForm.style.display = 'none';
    };
    
    registerTab.onclick = () => {
      registerTab.style.color = '#fff';
      registerTab.style.borderBottom = '2px solid #4CAF50';
      loginTab.style.color = '#999';
      loginTab.style.borderBottom = 'none';
      registerForm.style.display = 'block';
      loginForm.style.display = 'none';
    };
    
    // Buttons
    const loginButton = ModalUtils.createButton('Login', 'login-button', async () => {
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      
      if (!username || !password) {
        AuthManager.showMessage('Please enter username and password', 'warning');
        return;
      }
      
      const success = await AuthManager.login(username, password);
      if (success) {
        ModalUtils.removeModal(modalId);
        AuthManager.showMessage('Login successful!', 'success');
      }
    });
    
    const registerButton = ModalUtils.createButton('Register', 'register-button', async () => {
      const username = document.getElementById('register-username').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      if (!username || !password || !confirmPassword) {
        AuthManager.showMessage('Please fill in all fields', 'warning');
        return;
      }
      
      if (password !== confirmPassword) {
        AuthManager.showMessage('Passwords do not match', 'warning');
        return;
      }
      
      const success = await AuthManager.register(username, password);
      if (success) {
        ModalUtils.removeModal(modalId);
        AuthManager.showMessage('Registration successful!', 'success');
      }
    });
    
    loginForm.appendChild(ModalUtils.createButtonsContainer([loginButton]));
    registerForm.appendChild(ModalUtils.createButtonsContainer([registerButton]));
    
    modalContent.appendChild(tabContainer);
    modalContent.appendChild(loginForm);
    modalContent.appendChild(registerForm);
    
    ModalUtils.showModal(modal);
  },
  
  /**
   * Login with username and password
   */
  login: async function (username, password) {
    try {
      const response = await fetch(`${AuthManager.apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        AuthManager.isAuthenticated = true;
        AuthManager.currentUser = username;
        return true;
      } else {
        AuthManager.showMessage(data.error || 'Login failed', 'error');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      AuthManager.showMessage('Login failed. Please check your connection.', 'error');
      return false;
    }
  },
  
  /**
   * Register new user
   */
  register: async function (username, password) {
    try {
      const response = await fetch(`${AuthManager.apiBaseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        AuthManager.isAuthenticated = true;
        AuthManager.currentUser = username;
        return true;
      } else {
        AuthManager.showMessage(data.error || 'Registration failed', 'error');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      AuthManager.showMessage('Registration failed. Please check your connection.', 'error');
      return false;
    }
  },
  
  /**
   * Logout
   */
  logout: async function () {
    try {
      const response = await fetch(`${AuthManager.apiBaseUrl}/api/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        AuthManager.isAuthenticated = false;
        AuthManager.currentUser = null;
        AuthManager.showMessage('Logged out successfully', 'success');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },
  
  /**
   * Show message to user
   */
  showMessage: function (message, type = 'info') {
    if (GeneralHandler && GeneralHandler.showToast) {
      GeneralHandler.showToast(message, type, 3000);
    } else {
      alert(message);
    }
  },
  
  /**
   * Check if user is authenticated
   */
  isUserAuthenticated: function () {
    return AuthManager.isAuthenticated;
  },
  
  /**
   * Get current username
   */
  getCurrentUser: function () {
    return AuthManager.currentUser;
  }
};

export { AuthManager };
