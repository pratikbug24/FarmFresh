/**
 * Shared chrome for every page: navigation bar, cart modal and toast host.
 *
 * Pages opt in by adding `<div id="site-nav"></div>` where the navbar should
 * appear. Everything else (cart modal, toasts) is appended to <body>.
 *
 * Because pages live either at the site root or inside /pages/, link targets
 * are resolved through `root()`, which returns '../' for nested pages.
 */
(function () {
  'use strict';

  const Store = window.FarmFresh;

  function root() {
    return location.pathname.replace(/\\/g, '/').includes('/pages/') ? '../' : '';
  }

  const NAV_LINKS = [
    { label: 'Home', href: 'index.html' },
    { label: 'Products', href: 'index.html#products' },
    { label: 'About', href: 'pages/about.html' },
    { label: 'Contact', href: 'pages/contact.html' },
  ];

  function url(target) {
    // Anchors that already point at the root page keep working from /pages/.
    return root() + target;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }

  /* ------------------------------------------------------------- navbar */

  function navbarHtml(active) {
    const user = Store.currentUser();

    const links = NAV_LINKS.map((link) => {
      const isActive = link.label === active ? ' active' : '';
      return `<li class="nav-item">
          <a class="nav-link${isActive}" href="${url(link.href)}">${link.label}</a>
        </li>`;
    }).join('');

    const authArea = user
      ? `<div class="dropdown">
            <button class="btn btn-success dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
              <i class="fas fa-user-circle me-2"></i>${escapeHtml(user.name || user.username)}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow">
              <li><a class="dropdown-item" href="${url('pages/profile.html')}"><i class="fas fa-id-card me-2"></i>My Profile</a></li>
              <li><a class="dropdown-item" href="${url('pages/orders.html')}"><i class="fas fa-receipt me-2"></i>Order History</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><button class="dropdown-item text-danger" type="button" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</button></li>
            </ul>
          </div>`
      : `<a href="${url('pages/login.html')}" class="btn btn-outline-success me-2">Login</a>
         <a href="${url('pages/register.html')}" class="btn btn-success">Sign Up</a>`;

    return `
      <nav class="navbar navbar-expand-lg navbar-light fixed-top modern-nav">
        <div class="container">
          <a class="navbar-brand" href="${url('index.html')}">
            <i class="fas fa-leaf text-success me-2"></i>
            <span class="brand-text">FarmFresh Foods</span>
          </a>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">${links}</ul>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-outline-success position-relative" type="button" data-bs-toggle="modal" data-bs-target="#cartModal" aria-label="Open cart">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count badge bg-danger">0</span>
              </button>
              ${authArea}
            </div>
          </div>
        </div>
      </nav>`;
  }

  /* --------------------------------------------------------- cart modal */

  function cartModalHtml() {
    return `
      <div class="modal fade" id="cartModal" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-shopping-cart me-2"></i>Shopping Cart</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div id="cartItems"></div>
            </div>
            <div class="modal-footer d-block">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Total:</h5>
                <h5 class="mb-0 text-success">₹<span id="cartTotal">0.00</span></h5>
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-secondary flex-fill" data-bs-dismiss="modal">Continue Shopping</button>
                <button type="button" class="btn btn-success flex-fill" id="checkoutBtn">
                  <i class="fas fa-credit-card me-2"></i>Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderCart() {
    const host = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const badge = document.querySelector('.cart-count');
    if (!host) return;

    const lines = Store.cartLines();
    const count = Store.cartCount();

    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }

    if (lines.length === 0) {
      host.innerHTML = `
        <div class="text-center text-muted py-4">
          <i class="fas fa-basket-shopping fa-3x mb-3 opacity-25"></i>
          <p class="mb-0">Your cart is empty</p>
        </div>`;
      if (totalEl) totalEl.textContent = '0.00';
      return;
    }

    host.innerHTML = lines
      .map(
        (line) => `
        <div class="cart-item">
          <img src="${url(line.image)}" alt="${escapeHtml(line.name)}" class="cart-item-image">
          <div class="cart-item-info">
            <div class="cart-item-title">${escapeHtml(line.name)}</div>
            <div class="cart-item-price">₹${line.price}/${escapeHtml(line.unit)}</div>
            <div class="cart-item-quantity">
              <button class="btn btn-sm btn-outline-secondary" type="button" data-cart-dec="${line.id}" aria-label="Decrease quantity">
                <i class="fas fa-minus"></i>
              </button>
              <span class="mx-2 fw-semibold">${line.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary" type="button" data-cart-inc="${line.id}" aria-label="Increase quantity">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="fw-bold">Subtotal: ₹${Store.money(line.lineTotal)}</div>
          </div>
          <button class="cart-item-remove" type="button" data-cart-remove="${line.id}" title="Remove item">
            <i class="fas fa-trash"></i>
          </button>
        </div>`
      )
      .join('');

    if (totalEl) totalEl.textContent = Store.money(Store.cartTotal());
  }

  /* ------------------------------------------------------------- toasts */

  function toast(message, type = 'info') {
    let host = document.querySelector('.toast-container');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-container';
      document.body.appendChild(host);
    }

    const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    const el = document.createElement('div');
    el.className = `toast toast-${type} show`;
    el.setAttribute('role', 'status');
    el.innerHTML = `
      <div class="toast-body d-flex align-items-center">
        <i class="fas fa-${icon} me-2"></i>
        <span class="flex-grow-1">${escapeHtml(message)}</span>
        <button type="button" class="btn-close ms-2" aria-label="Close"></button>
      </div>`;

    el.querySelector('.btn-close').addEventListener('click', () => el.remove());
    host.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  /* --------------------------------------------------------------- init */

  function init(options = {}) {
    const navHost = document.getElementById('site-nav');
    if (navHost) navHost.innerHTML = navbarHtml(options.active || '');

    document.body.insertAdjacentHTML('beforeend', cartModalHtml());

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Store.logout();
        toast('You have been signed out.', 'info');
        setTimeout(() => {
          location.href = url('index.html');
        }, 600);
      });
    }

    document.addEventListener('click', (event) => {
      const inc = event.target.closest('[data-cart-inc]');
      const dec = event.target.closest('[data-cart-dec]');
      const remove = event.target.closest('[data-cart-remove]');

      if (inc) {
        const id = Number(inc.dataset.cartInc);
        const line = Store.getCart().find((row) => row.id === id);
        Store.setQuantity(id, (line ? line.quantity : 0) + 1);
        renderCart();
      } else if (dec) {
        const id = Number(dec.dataset.cartDec);
        const line = Store.getCart().find((row) => row.id === id);
        Store.setQuantity(id, (line ? line.quantity : 0) - 1);
        renderCart();
      } else if (remove) {
        Store.removeFromCart(Number(remove.dataset.cartRemove));
        renderCart();
        toast('Item removed from cart', 'info');
      }
    });

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (Store.cartLines().length === 0) {
          toast('Your cart is empty!', 'error');
          return;
        }
        if (!Store.currentUser()) {
          toast('Please sign in to continue.', 'info');
          sessionStorage.setItem('ff_redirect', 'pages/checkout.html');
          setTimeout(() => {
            location.href = url('pages/login.html');
          }, 700);
          return;
        }
        location.href = url('pages/checkout.html');
      });
    }

    renderCart();
    document.dispatchEvent(new CustomEvent('farmfresh:ready'));
  }

  window.FarmFreshUI = { init, renderCart, toast, url, root, escapeHtml };
})();
