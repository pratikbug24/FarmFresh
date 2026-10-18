/**
 * Profile page: displays the signed-in account and lets the user edit it.
 */
(function () {
    'use strict';
  
    const Store = window.FarmFresh;
    const UI = window.FarmFreshUI;
  
    function showAlert(message, type) {
      const host = document.getElementById('profileAlert');
      if (!host) return;
      host.className = `alert alert-${type} alert-dismissible fade show`;
      host.innerHTML = `${UI.escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    }
  
    function initials(name) {
      return String(name || 'FF')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('') || 'FF';
    }
  
    function fill(user) {
      document.getElementById('avatarInitials').textContent = initials(user.name);
      document.getElementById('profileName').textContent = user.name;
      document.getElementById('profileUsername').textContent = user.username;
  
      document.getElementById('name').value = user.name || '';
      document.getElementById('email').value = user.email || '';
      document.getElementById('phone').value = user.phone || '';
      document.getElementById('address').value = user.address || '';
      document.getElementById('username').value = user.username;
    }
  
    function init() {
      const user = Store.currentUser();
      if (!user) {
        sessionStorage.setItem('ff_redirect', 'pages/profile.html');
        location.replace('login.html');
        return;
      }
  
      fill(user);
  
      const form = document.getElementById('profileForm');
      form.addEventListener('reset', () => {
        setTimeout(() => fill(Store.currentUser() || user), 0);
      });
  
      form.addEventListener('submit', (event) => {
        event.preventDefault();
  
        const changes = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          address: document.getElementById('address').value,
        };
  
        if (!changes.name || !changes.email) {
          showAlert('Name and email are required.', 'danger');
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changes.email)) {
          showAlert('Please enter a valid email address.', 'danger');
          return;
        }
  
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (newPassword || confirmPassword) {
          if (newPassword !== confirmPassword) {
            showAlert('New passwords do not match.', 'danger');
            return;
          }
          changes.password = newPassword;
        }
  
        const result = Store.updateProfile(changes);
        if (!result.ok) {
          showAlert(result.error, 'danger');
          return;
        }
  
        fill(result.user);
        form.querySelector('#newPassword').value = '';
        form.querySelector('#confirmPassword').value = '';
        showAlert('Your profile has been updated.', 'success');
        UI.toast('Profile saved successfully.', 'success');
      });
    }
  
    document.addEventListener('farmfresh:ready', init);
    UI.init({ active: '' });
  })();
  