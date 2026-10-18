/**
 * FarmFresh client-side store.
 *
 * The original project shipped a PHP login page that was later deleted, which
 * left `login.php` / `registraction.php` links pointing at nothing. This module
 * provides a working demo store so the login, register, profile and order
 * history flow runs with plain HTML/JS. The optional PHP backend under
 * `backend/` mirrors the same shape for a real deployment.
 *
 * All state is namespaced under `ff_*` keys in localStorage.
 */
(function () {
    'use strict';
  
    const KEYS = {
      users: 'ff_users',
      session: 'ff_session',
      cart: 'ff_cart',
      orders: 'ff_orders',
    };
  
    function read(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (err) {
        console.warn(`FarmFresh: could not read ${key}`, err);
        return fallback;
      }
    }
  
    function write(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.warn(`FarmFresh: could not write ${key}`, err);
      }
    }
  
    /**
     * Demo-only password digest. Client-side storage can never be truly secure;
     * the PHP backend uses password_hash() for real accounts.
     */
    function digest(text) {
      let hash = 5381;
      for (let i = 0; i < text.length; i += 1) {
        hash = ((hash << 5) + hash) ^ text.charCodeAt(i);
      }
      return `ff1$${(hash >>> 0).toString(16)}`;
    }
  
    function normaliseUsername(value) {
      return String(value || '').trim().toLowerCase();
    }
  
    function money(amount) {
      return Number(amount || 0).toFixed(2);
    }
  
    /* ---------------------------------------------------------------- users */
  
    function getUsers() {
      return read(KEYS.users, []);
    }
  
    function findUser(username) {
      const key = normaliseUsername(username);
      return getUsers().find((user) => user.username === key) || null;
    }
  
    function register({ name, username, email, password, phone }) {
      const key = normaliseUsername(username);
  
      if (!name || !key || !email || !password) {
        return { ok: false, error: 'Please fill in all required fields.' };
      }
      if (key.length < 3) {
        return { ok: false, error: 'Username must be at least 3 characters.' };
      }
      if (password.length < 6) {
        return { ok: false, error: 'Password must be at least 6 characters.' };
      }
      if (findUser(key)) {
        return { ok: false, error: 'That username is already taken.' };
      }
  
      const user = {
        name: String(name).trim(),
        username: key,
        email: String(email).trim().toLowerCase(),
        phone: String(phone || '').trim(),
        address: '',
        passwordHash: digest(password),
        createdAt: new Date().toISOString(),
      };
  
      const users = getUsers();
      users.push(user);
      write(KEYS.users, users);
      write(KEYS.session, key);
  
      return { ok: true, user: publicUser(user) };
    }
  
    function login(username, password) {
      const user = findUser(username);
      if (!user || user.passwordHash !== digest(password)) {
        return { ok: false, error: 'Incorrect username or password.' };
      }
      write(KEYS.session, user.username);
      return { ok: true, user: publicUser(user) };
    }
  
    function logout() {
      localStorage.removeItem(KEYS.session);
    }
  
    function currentUsername() {
      return read(KEYS.session, null);
    }
  
    function currentUser() {
      const username = currentUsername();
      if (!username) return null;
      const user = findUser(username);
      return user ? publicUser(user) : null;
    }
  
    function updateProfile(changes) {
      const username = currentUsername();
      if (!username) return { ok: false, error: 'You are not signed in.' };
  
      const users = getUsers();
      const index = users.findIndex((user) => user.username === username);
      if (index === -1) return { ok: false, error: 'Account not found.' };
  
      const next = { ...users[index] };
      ['name', 'email', 'phone', 'address'].forEach((field) => {
        if (changes[field] !== undefined) next[field] = String(changes[field]).trim();
      });
      if (changes.password) {
        if (changes.password.length < 6) {
          return { ok: false, error: 'New password must be at least 6 characters.' };
        }
        next.passwordHash = digest(changes.password);
      }
  
      users[index] = next;
      write(KEYS.users, users);
      return { ok: true, user: publicUser(next) };
    }
  
    function publicUser(user) {
      const { passwordHash, ...safe } = user;
      return safe;
    }
  
    /* ----------------------------------------------------------------- cart */
  
    function getCart() {
      return read(KEYS.cart, []);
    }
  
    function productById(id) {
      return (window.PRODUCTS || []).find((product) => product.id === Number(id)) || null;
    }
  
    /** Cart rows join the stored id/quantity with live product details. */
    function cartLines() {
      return getCart()
        .map((line) => {
          const product = productById(line.id);
          if (!product) return null;
          return {
            ...product,
            quantity: line.quantity,
            lineTotal: product.price * line.quantity,
          };
        })
        .filter(Boolean);
    }
  
    function addToCart(id, quantity = 1) {
      const product = productById(id);
      if (!product) return { ok: false, error: 'Unknown product.' };
  
      const cart = getCart();
      const existing = cart.find((line) => line.id === product.id);
      const amount = Math.max(1, Number(quantity) || 1);
  
      if (existing) {
        existing.quantity = Math.min(99, existing.quantity + amount);
      } else {
        cart.push({ id: product.id, quantity: amount });
      }
  
      write(KEYS.cart, cart);
      return { ok: true, product };
    }
  
    function setQuantity(id, quantity) {
      let cart = getCart();
      const amount = Number(quantity) || 0;
      if (amount <= 0) {
        cart = cart.filter((line) => line.id !== Number(id));
      } else {
        const line = cart.find((row) => row.id === Number(id));
        if (line) line.quantity = Math.min(99, amount);
      }
      write(KEYS.cart, cart);
    }
  
    function removeFromCart(id) {
      write(
        KEYS.cart,
        getCart().filter((line) => line.id !== Number(id))
      );
    }
  
    function clearCart() {
      write(KEYS.cart, []);
    }
  
    function cartCount() {
      return getCart().reduce((sum, line) => sum + line.quantity, 0);
    }
  
    function cartTotal() {
      return cartLines().reduce((sum, line) => sum + line.lineTotal, 0);
    }
  
    /* --------------------------------------------------------------- orders */
  
    function getOrders() {
      const username = currentUsername();
      if (!username) return [];
      return read(KEYS.orders, [])
        .filter((order) => order.username === username)
        .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
    }
  
    function placeOrder({ address, paymentMethod, notes }) {
      const user = currentUser();
      if (!user) return { ok: false, error: 'Please sign in to place an order.' };
  
      const lines = cartLines();
      if (lines.length === 0) return { ok: false, error: 'Your cart is empty.' };
      if (!address || !String(address).trim()) {
        return { ok: false, error: 'A delivery address is required.' };
      }
  
      const orders = read(KEYS.orders, []);
      const order = {
        id: `FF-${Date.now().toString(36).toUpperCase()}`,
        username: user.username,
        placedAt: new Date().toISOString(),
        status: 'Confirmed',
        paymentMethod: paymentMethod || 'Cash on delivery',
        address: String(address).trim(),
        notes: String(notes || '').trim(),
        total: cartTotal(),
        items: lines.map((line) => ({
          id: line.id,
          name: line.name,
          price: line.price,
          unit: line.unit,
          quantity: line.quantity,
          image: line.image,
        })),
      };
  
      orders.push(order);
      write(KEYS.orders, orders);
      clearCart();
  
      return { ok: true, order };
    }
  
    window.FarmFresh = {
      money,
      digest,
      register,
      login,
      logout,
      currentUser,
      currentUsername,
      updateProfile,
      getCart,
      cartLines,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartTotal,
      getOrders,
      placeOrder,
      productById,
    };
  })();
  