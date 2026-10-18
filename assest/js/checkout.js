/**
 * Checkout page: shows the cart summary and records an order.
 */
(function () {
    'use strict';
  
    const Store = window.FarmFresh;
    const UI = window.FarmFreshUI;
  
    function showAlert(message, type) {
      const host = document.getElementById('checkoutAlert');
      if (!host) return;
      host.className = `alert alert-${type} alert-dismissible fade show`;
      host.innerHTML = `${UI.escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    }
  
    function renderSummary() {
      const host = document.getElementById('summaryItems');
      const lines = Store.cartLines();
  
      if (lines.length === 0) {
        host.innerHTML = '<p class="text-muted mb-0">Your cart is empty.</p>';
        document.getElementById('summaryTotal').textContent = '0.00';
        return;
      }
  
      host.innerHTML = lines
        .map(
          (line) => `
          <div class="summary-row">
            <span>${UI.escapeHtml(line.name)} <span class="text-muted">× ${line.quantity}</span></span>
            <span>₹${Store.money(line.lineTotal)}</span>
          </div>`
        )
        .join('');
  
      document.getElementById('summaryTotal').textContent = Store.money(Store.cartTotal());
    }
  
    function init() {
      const user = Store.currentUser();
      if (!user) {
        sessionStorage.setItem('ff_redirect', 'pages/checkout.html');
        location.replace('login.html');
        return;
      }
  
      if (Store.cartLines().length === 0) {
        document.getElementById('checkoutRow').innerHTML = `
          <div class="col-12">
            <div class="card account-card empty-state">
              <i class="fas fa-basket-shopping"></i>
              <h4 class="fw-bold">Your cart is empty</h4>
              <p class="text-muted mb-4">Add some fresh produce before checking out.</p>
              <a href="../index.html" class="btn btn-success">
                <i class="fas fa-store me-2"></i>Start Shopping
              </a>
            </div>
          </div>`;
        return;
      }
  
      document.getElementById('name').value = user.name || '';
      document.getElementById('phone').value = user.phone || '';
      document.getElementById('address').value = user.address || '';
      renderSummary();
  
      document.querySelectorAll('.payment-option').forEach((option) => {
        option.addEventListener('click', () => {
          document.querySelectorAll('.payment-option').forEach((el) => el.classList.remove('selected'));
          option.classList.add('selected');
          option.querySelector('input').checked = true;
        });
      });
  
      document.getElementById('checkoutForm').addEventListener('submit', (event) => {
        event.preventDefault();
  
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const name = document.getElementById('name').value;
        const notes = document.getElementById('notes').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  
        if (!name || !phone || !address) {
          showAlert('Please complete your name, phone and delivery address.', 'danger');
          return;
        }
  
        const result = Store.placeOrder({ address, paymentMethod, notes });
        if (!result.ok) {
          showAlert(result.error, 'danger');
          return;
        }
  
        // Remember the latest delivery details for next time.
        Store.updateProfile({ address, phone, name });
  
        document.getElementById('successOrderId').textContent = result.order.id;
        new bootstrap.Modal(document.getElementById('successModal')).show();
        UI.renderCart();
      });
    }
  
    document.addEventListener('farmfresh:ready', init);
    UI.init();
  })();
  