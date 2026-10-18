/**
 * Order history page: lists every order placed by the signed-in user.
 */
(function () {
    'use strict';
  
    const Store = window.FarmFresh;
    const UI = window.FarmFreshUI;
  
    function formatDate(iso) {
      return new Date(iso).toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  
    function orderHtml(order) {
      const items = order.items
        .map(
          (item) => `
          <div class="order-item">
            <img src="${UI.url(item.image)}" alt="${UI.escapeHtml(item.name)}">
            <div class="flex-grow-1">
              <div class="fw-semibold">${UI.escapeHtml(item.name)}</div>
              <div class="order-meta">₹${item.price} / ${UI.escapeHtml(item.unit)}</div>
            </div>
            <div class="text-end">
              <div class="fw-semibold">× ${item.quantity}</div>
              <div class="order-meta">₹${Store.money(item.price * item.quantity)}</div>
            </div>
          </div>`
        )
        .join('');
  
      return `
        <div class="card order-card">
          <div class="order-header d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <div class="fw-bold">Order ${UI.escapeHtml(order.id)}</div>
              <div class="order-meta"><i class="fas fa-clock me-1"></i>${formatDate(order.placedAt)}</div>
            </div>
            <div class="d-flex align-items-center gap-3">
              <span class="status-badge status-confirmed">
                <i class="fas fa-check-circle me-1"></i>${UI.escapeHtml(order.status)}
              </span>
              <div class="text-end">
                <div class="order-meta">Total</div>
                <div class="fw-bold text-success">₹${Store.money(order.total)}</div>
              </div>
            </div>
          </div>
  
          <div class="order-body">${items}</div>
  
          <div class="order-footer px-4 py-3 bg-light d-flex flex-wrap justify-content-between gap-2">
            <div class="order-meta">
              <i class="fas fa-map-marker-alt me-1"></i>${UI.escapeHtml(order.address)}
            </div>
            <div class="order-meta">
              <i class="fas fa-credit-card me-1"></i>${UI.escapeHtml(order.paymentMethod)}
            </div>
          </div>
        </div>`;
    }
  
    function init() {
      if (!Store.currentUser()) {
        sessionStorage.setItem('ff_redirect', 'pages/orders.html');
        location.replace('login.html');
        return;
      }
  
      const host = document.getElementById('ordersContainer');
      const orders = Store.getOrders();
  
      if (orders.length === 0) {
        host.innerHTML = `
          <div class="card account-card empty-state">
            <i class="fas fa-box-open"></i>
            <h4 class="fw-bold">No orders yet</h4>
            <p class="text-muted mb-4">When you place an order it will appear here.</p>
            <a href="../index.html" class="btn btn-success">
              <i class="fas fa-store me-2"></i>Start Shopping
            </a>
          </div>`;
        return;
      }
  
      host.innerHTML = orders.map(orderHtml).join('');
    }
  
    document.addEventListener('farmfresh:ready', init);
    UI.init();
  })();
  