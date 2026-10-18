/**
 * Login and registration form behaviour.
 *
 * Both pages share this file; the page is detected by the form id so the
 * browser only downloads one script.
 */
(function () {
    'use strict';
  
    const Store = window.FarmFresh;
    const UI = window.FarmFreshUI;
  
    function showAlert(message, type) {
      const host = document.getElementById('formAlert');
      if (!host) return;
      host.className = `alert alert-${type} alert-dismissible fade show`;
      host.innerHTML = `${UI.escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    }
  
    function afterAuth(message) {
      UI.toast(message, 'success');
      const redirect = sessionStorage.getItem('ff_redirect');
      sessionStorage.removeItem('ff_redirect');
      setTimeout(() => {
        location.href = redirect ? UI.url(redirect) : UI.url('pages/profile.html');
      }, 700);
    }
  
    function wirePasswordToggle() {
      const toggle = document.getElementById('togglePassword');
      const password = document.getElementById('password');
      if (!toggle || !password) return;
  
      toggle.addEventListener('click', () => {
        const visible = password.type === 'text';
        password.type = visible ? 'password' : 'text';
        toggle.innerHTML = `<i class="fas fa-eye${visible ? '' : '-slash'}"></i>`;
      });
    }
  
    function initLogin() {
      const form = document.getElementById('loginForm');
      if (!form) return;
  
      if (Store.currentUser()) {
        location.replace('profile.html');
        return;
      }
  
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        if (!username || !password) {
          showAlert('Please enter your username and password.', 'danger');
          return;
        }
  
        const result = Store.login(username, password);
        if (!result.ok) {
          showAlert(result.error, 'danger');
          return;
        }
        afterAuth(`Welcome back, ${result.user.name}!`);
      });
    }
  
    function initRegister() {
      const form = document.getElementById('registerForm');
      if (!form) return;
  
      form.addEventListener('submit', (event) => {
        event.preventDefault();
  
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
  
        if (!name || !username || !email || !password || !confirmPassword) {
          showAlert('Please fill in all required fields.', 'danger');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          showAlert('Please enter a valid email address.', 'danger');
          return;
        }
        if (password !== confirmPassword) {
          showAlert('Passwords do not match.', 'danger');
          return;
        }
        if (!terms) {
          showAlert('Please accept the terms to continue.', 'danger');
          return;
        }
  
        const result = Store.register({ name, username, email, phone, password });
        if (!result.ok) {
          showAlert(result.error, 'danger');
          return;
        }
        afterAuth(`Account created. Welcome, ${result.user.name}!`);
      });
    }
  
    document.addEventListener('farmfresh:ready', () => {
      wirePasswordToggle();
      initLogin();
      initRegister();
    });
  
    window.FarmFreshUI.init();
  })();
  