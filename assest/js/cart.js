/**
 * Standalone cart page. The navbar cart modal and this page share the same
 * store, so edits made here are reflected everywhere via `farmfresh:cart`.
 */
(function () {
    'use strict';
  
    const Store = window.FarmFresh;
    const UI = window.FarmFreshUI;
  
    function render() {
      const host = document.getElementById('cartPageItems');
      const lines = Store.cartLines();
  
      document.getElementById('cartPageCount').textContent = Store.cartCount();
      document.getElementById('cartPageTotal').textContent = Store.money(Store.cartTotal());
  
      if (lines.length === 0) {
        document.getElementById('cartRow').innerHTML = `
          <div class="col-12">
            <div class="card account-card empty-state">
              <i class="fas fa-basket-shopping"></i>
              <h4 class="fw-bold">Your cart is empty</h4>
              <p class="text-muted mb-4">Browse our fresh produce and add your favourites.</p>
              <a href="../index.html" class="btn btn-success">
                <i class="fas fa-store me-2"></i>Start Shopping
              </a>
            </div>
          </div>`;
        return;
      }
  
      host.innerHTML = lines
        .map(
          (line) => `
          <div class="cart-item">
            <img src="${UI.url(line.image)}" alt="${UI.escapeHtml(line.name)}" class="cart-item-image">
            <div class="cart-item-info">
              <div class="cart-item-title">${UI.escapeHtml(line.name)}</div>
              <div class="cart-item-price">₹${line.price}/${UI.escapeHtml(line.unit)}</div>
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
    }
  
    document.addEventListener('farmfresh:ready', () => {
      render();
  
      document.addEventListener('click', (event) => {
        if (event.target.closest('[data-cart-inc], [data-cart-dec], [data-cart-remove]')) {
          setTimeout(render, 0);
        }
      });
  
      document.getElementById('pageCheckoutBtn').addEventListener('click', () => {
        if (Store.cartLines().length === 0) {
          UI.toast('Your cart is empty!', 'error');
          return;
        }
        if (!Store.currentUser()) {
          sessionStorage.setItem('ff_redirect', 'pages/checkout.html');
          UI.toast('Please sign in to continue.', 'info');
          setTimeout(() => location.href = 'login.html', 700);
          return;
        }
        location.href = 'checkout.html';
      });
    });
  
    UI.init({ active: '' });
  })();
  