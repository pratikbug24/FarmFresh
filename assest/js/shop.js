/**
 * Home page: product grid, search, category filter and product details modal.
 */
(function () {
  'use strict';

  const Store = window.FarmFresh;
  const UI = window.FarmFreshUI;

  let visible = window.PRODUCTS.slice();

  function stars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    let out = '';
    for (let i = 0; i < full; i += 1) out += '<i class="fas fa-star text-warning"></i>';
    if (half) out += '<i class="fas fa-star-half-alt text-warning"></i>';
    for (let i = 0; i < 5 - Math.ceil(rating); i += 1) out += '<i class="far fa-star text-warning"></i>';
    return out;
  }

  function cardHtml(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const image = UI.root() + product.image;

    return `
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="product-card shadow-hover">
          <div class="product-image">
            <img src="${image}" alt="${UI.escapeHtml(product.name)}" class="img-fluid">
            <div class="product-badge">${UI.escapeHtml(product.badge)}</div>
            ${discount > 0 ? `<div class="product-badge badge-discount">${discount}% OFF</div>` : ''}
          </div>
          <div class="product-info">
            <h3 class="product-title">${UI.escapeHtml(product.name)}</h3>
            <p class="product-description">${UI.escapeHtml(product.description)}</p>
            <div class="d-flex align-items-center mb-2">
              <div class="product-price">₹${product.price}/${UI.escapeHtml(product.unit)}</div>
              ${product.originalPrice > product.price ? `<small class="text-muted ms-2"><del>₹${product.originalPrice}</del></small>` : ''}
            </div>
            <div class="d-flex align-items-center mb-3">
              <div class="rating">${stars(product.rating)}</div>
              <small class="text-muted ms-2">(${product.rating})</small>
            </div>
            <div class="product-actions">
              <div class="quantity-selector">
                <button class="quantity-btn" type="button" data-qty-dec="${product.id}" aria-label="Decrease quantity">
                  <i class="fas fa-minus"></i>
                </button>
                <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="10">
                <button class="quantity-btn" type="button" data-qty-inc="${product.id}" aria-label="Increase quantity">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <button class="btn btn-success flex-fill" type="button" data-add="${product.id}">
                <i class="fas fa-cart-plus me-2"></i>Add to Cart
              </button>
            </div>
            <button class="btn btn-outline-success w-100 mt-2" type="button" data-view="${product.id}">
              <i class="fas fa-eye me-2"></i>View Details
            </button>
          </div>
        </div>
      </div>`;
  }

  function render() {
    const host = document.getElementById('productsContainer');
    if (!host) return;

    if (visible.length === 0) {
      host.innerHTML = `
        <div class="col-12 text-center">
          <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>No products found matching your criteria.
          </div>
        </div>`;
      return;
    }

    host.innerHTML = visible.map(cardHtml).join('');
    host.querySelectorAll('.product-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.08}s`;
      card.classList.add('fade-in-up');
    });
  }

  function activeCategory() {
    const active = document.querySelector('.shop-filter button.is-active');
    return active ? active.dataset.category : 'all';
  }

  function setCategory(value) {
    document.querySelectorAll('.shop-filter button').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.category === value);
    });
    applyFilters();
  }

  function applyFilters() {
    const search = document.getElementById('searchInput');
    const term = (search ? search.value : '').toLowerCase().trim();
    const category = activeCategory();

    visible = window.PRODUCTS.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category;
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });

    render();
  }

  function viewProduct(id) {
    const product = Store.productById(id);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = product.name;
    document.getElementById('productModalBody').innerHTML = `
      <div class="row">
        <div class="col-md-6 mb-3 mb-md-0">
          <img src="${UI.root() + product.image}" alt="${UI.escapeHtml(product.name)}" class="img-fluid rounded">
        </div>
        <div class="col-md-6">
          <h4>${UI.escapeHtml(product.name)}</h4>
          <div class="mb-3">${stars(product.rating)}<span class="ms-2">(${product.rating})</span></div>
          <p class="text-muted">${UI.escapeHtml(product.description)}</p>
          <div class="mb-3">
            <span class="h4 text-success">₹${product.price}/${UI.escapeHtml(product.unit)}</span>
            ${product.originalPrice > product.price ? `<span class="text-muted ms-2"><del>₹${product.originalPrice}</del></span>` : ''}
          </div>
          <div class="mb-3">
            <span class="badge bg-success">${UI.escapeHtml(product.badge)}</span>
            <span class="badge bg-primary ms-2">${product.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
          <button class="btn btn-success" type="button" data-add="${product.id}" data-dismiss-modal="productModal">
            <i class="fas fa-cart-plus me-2"></i>Add to Cart
          </button>
        </div>
      </div>`;

    new bootstrap.Modal(document.getElementById('productModal')).show();
  }

  function init() {
    render();

    document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 250));

    document.querySelectorAll('.shop-filter button').forEach((button) => {
      button.addEventListener('click', () => setCategory(button.dataset.category));
    });

    document.querySelectorAll('.cat-tile[data-category]').forEach((tile) => {
      tile.addEventListener('click', () => setCategory(tile.dataset.category));
    });

    document.getElementById('productsContainer').addEventListener('click', (event) => {
      const inc = event.target.closest('[data-qty-inc]');
      const dec = event.target.closest('[data-qty-dec]');
      const add = event.target.closest('[data-add]');
      const view = event.target.closest('[data-view]');

      if (inc || dec) {
        const id = Number((inc || dec).dataset[inc ? 'qtyInc' : 'qtyDec']);
        const input = document.getElementById(`qty-${id}`);
        let value = parseInt(input.value, 10) + (inc ? 1 : -1);
        value = Math.min(10, Math.max(1, value));
        input.value = value;
      } else if (add) {
        const id = Number(add.dataset.add);
        const input = document.getElementById(`qty-${id}`);
        const quantity = input ? parseInt(input.value, 10) : 1;
        const result = Store.addToCart(id, quantity);
        if (result.ok) {
          if (input) input.value = 1;
          UI.renderCart();
          UI.toast(`${result.product.name} added to cart!`, 'success');
        }
      } else if (view) {
        viewProduct(Number(view.dataset.view));
      }
    });

    document.getElementById('productModalBody').addEventListener('click', (event) => {
      const add = event.target.closest('[data-add]');
      if (!add) return;
      const result = Store.addToCart(Number(add.dataset.add), 1);
      if (result.ok) {
        UI.renderCart();
        UI.toast(`${result.product.name} added to cart!`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
      }
    });
  }

  function debounce(func, wait) {
    let timer;
    return function debounced(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), wait);
    };
  }

  document.addEventListener('farmfresh:ready', init);
  UI.init({ active: 'Home' });
})();
