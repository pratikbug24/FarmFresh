// Modern Fruits Shop JavaScript

// Product Data
const products = [
    {
        id: 1,
        name: "Fresh Apples",
        category: "fruits",
        price: 120,
        originalPrice: 150,
        image: "apple.png",
        description: "Crisp and sweet apples, rich in fiber and vitamin C. Perfect for snacking or baking.",
        badge: "Fresh",
        inStock: true,
        rating: 4.5,
        unit: "kg"
    },
    {
        id: 2,
        name: "Ripe Tomatoes",
        category: "vegetables",
        price: 50,
        originalPrice: 60,
        image: "tomato.png",
        description: "Juicy and flavorful tomatoes, perfect for cooking and salads. Rich in antioxidants.",
        badge: "Organic",
        inStock: true,
        rating: 4.3,
        unit: "kg"
    },
    {
        id: 3,
        name: "Fresh Cucumbers",
        category: "vegetables",
        price: 40,
        originalPrice: 50,
        image: "cucumber.png",
        description: "Crisp and refreshing cucumbers, low in calories and high in water content.",
        badge: "Local",
        inStock: true,
        rating: 4.2,
        unit: "kg"
    },
    {
        id: 4,
        name: "Sweet Oranges",
        category: "fruits",
        price: 80,
        originalPrice: 100,
        image: "apple.png", // Using apple image as placeholder
        description: "Sweet and juicy oranges packed with vitamin C and natural sugars.",
        badge: "Vitamin C",
        inStock: true,
        rating: 4.6,
        unit: "kg"
    },
    {
        id: 5,
        name: "Fresh Bananas",
        category: "fruits",
        price: 60,
        originalPrice: 70,
        image: "apple.png", // Using apple image as placeholder
        description: "Ripe bananas rich in potassium and natural energy. Great for smoothies.",
        badge: "Energy",
        inStock: true,
        rating: 4.4,
        unit: "dozen"
    },
    {
        id: 6,
        name: "Green Spinach",
        category: "vegetables",
        price: 30,
        originalPrice: 40,
        image: "cucumber.png", // Using cucumber image as placeholder
        description: "Fresh spinach leaves packed with iron and vitamins. Perfect for salads.",
        badge: "Iron Rich",
        inStock: true,
        rating: 4.1,
        unit: "bunch"
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    updateCartUI();
    initializeEventListeners();
});

// Event Listeners
function initializeEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(searchProducts, 300));
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Render Products
function renderProducts(productsToRender) {
    if (!productsContainer) return;
    
    productsContainer.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No products found matching your criteria.
                </div>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    // Add fade-in animation
    productsContainer.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
}

// Create Product Card
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6 col-sm-12';
    
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    col.innerHTML = `
        <div class="product-card shadow-hover">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="img-fluid">
                <div class="product-badge">${product.badge}</div>
                ${discount > 0 ? `<div class="product-badge" style="top: 10px; right: 10px; background: var(--danger-color);">${discount}% OFF</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="d-flex align-items-center mb-2">
                    <div class="product-price">₹${product.price}/${product.unit}</div>
                    ${product.originalPrice > product.price ? `<small class="text-muted ms-2"><del>₹${product.originalPrice}</del></small>` : ''}
                </div>
                <div class="d-flex align-items-center mb-3">
                    <div class="rating">
                        ${generateStars(product.rating)}
                    </div>
                    <small class="text-muted ms-2">(${product.rating})</small>
                </div>
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" id="qty-${product.id}" value="1" min="1" max="10">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn btn-success flex-fill" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
                <button class="btn btn-outline-success w-100 mt-2" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye me-2"></i>View Details
                </button>
            </div>
        </div>
    `;
    
    return col;
}

// Generate Star Rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }
    
    return stars;
}

// Quantity Management
function changeQuantity(productId, change) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    if (!qtyInput) return;
    
    let currentQty = parseInt(qtyInput.value);
    let newQty = currentQty + change;
    
    if (newQty < 1) newQty = 1;
    if (newQty > 10) newQty = 10;
    
    qtyInput.value = newQty;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    if (!product || !qtyInput) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    // Reset quantity input
    qtyInput.value = 1;
    
    // Update UI
    updateCartUI();
    saveCart();
    showToast(`${product.name} added to cart!`, 'success');
    
    // Add animation to cart button
    const cartButton = document.querySelector('[data-bs-target="#cartModal"]');
    cartButton.classList.add('animate__animated', 'animate__pulse');
    setTimeout(() => {
        cartButton.classList.remove('animate__animated', 'animate__pulse');
    }, 1000);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
    showToast('Item removed from cart', 'info');
}

// Update Cart Quantity
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartUI();
            saveCart();
        }
    }
}

// Update Cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update cart modal
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">₹${item.price}/${item.unit}</div>
                <div class="cart-item-quantity">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="fw-bold">Total: ₹${itemTotal.toFixed(2)}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Search Products
function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    let filteredProducts = products;
    
    // Filter by category
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts(filteredProducts);
}

// Filter Products
function filterProducts() {
    searchProducts(); // Reuse search function as it handles both search and filter
}

// View Product Details
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const modalTitle = document.getElementById('productModalTitle');
    const modalBody = document.getElementById('productModalBody');
    
    modalTitle.textContent = product.name;
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" alt="${product.name}" class="img-fluid rounded">
            </div>
            <div class="col-md-6">
                <h4>${product.name}</h4>
                <div class="mb-3">
                    ${generateStars(product.rating)}
                    <span class="ms-2">(${product.rating})</span>
                </div>
                <p class="text-muted">${product.description}</p>
                <div class="mb-3">
                    <span class="h4 text-success">₹${product.price}/${product.unit}</span>
                    ${product.originalPrice > product.price ? `<span class="text-muted ms-2"><del>₹${product.originalPrice}</del></span>` : ''}
                </div>
                <div class="mb-3">
                    <span class="badge bg-success">${product.badge}</span>
                    <span class="badge bg-primary ms-2">${product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" id="modal-qty-${product.id}" value="1" min="1" max="10">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn btn-success" onclick="addToCartFromModal(${product.id})">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.show();
}

// Add to Cart from Modal
function addToCartFromModal(productId) {
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`modal-qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    if (!product || !qtyInput) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }
    
    updateCartUI();
    saveCart();
    showToast(`${product.name} added to cart!`, 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Simple checkout simulation
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create custom confirmation modal
    const confirmationHtml = `
        <div class="modal fade" id="checkoutConfirmModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Confirm Your Order</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to proceed with this order?</p>
                        <div class="alert alert-info">
                            <strong>Total Amount: ₹${total.toFixed(2)}</strong>
                        </div>
                        <p class="text-muted">This is a demo checkout. No actual payment will be processed.</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="confirmCheckout()">Confirm Order</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing confirmation modal if any
    const existingModal = document.getElementById('checkoutConfirmModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add confirmation modal to body
    document.body.insertAdjacentHTML('beforeend', confirmationHtml);
    
    // Show confirmation modal
    const confirmModal = new bootstrap.Modal(document.getElementById('checkoutConfirmModal'));
    confirmModal.show();
}

// Confirm Checkout
function confirmCheckout() {
    // Clear cart
    cart = [];
    updateCartUI();
    saveCart();
    
    // Close both modals
    const cartModalInstance = bootstrap.Modal.getInstance(cartModal);
    if (cartModalInstance) {
        cartModalInstance.hide();
    }
    
    const confirmModalInstance = bootstrap.Modal.getInstance(document.getElementById('checkoutConfirmModal'));
    if (confirmModalInstance) {
        confirmModalInstance.hide();
    }
    
    // Remove confirmation modal from DOM
    setTimeout(() => {
        const confirmModal = document.getElementById('checkoutConfirmModal');
        if (confirmModal) {
            confirmModal.remove();
        }
    }, 500);
    
    showToast('Order placed successfully! Thank you for shopping with us.', 'success');
}

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show Toast Notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `
        <div class="toast-body d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'btn btn-success position-fixed';
    scrollBtn.style.cssText = `
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: none;
    `;
    scrollBtn.onclick = scrollToTop;
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
});

// Export functions for global access
window.searchProducts = searchProducts;
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.changeQuantity = changeQuantity;
window.viewProduct = viewProduct;
window.addToCartFromModal = addToCartFromModal;
window.checkout = checkout;
window.confirmCheckout = confirmCheckout;