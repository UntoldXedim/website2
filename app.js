// E-commerce Application Logic
class ECommerceApp {
    constructor() {
        // Product data
        this.productData = {
            name: "Retatrutide Vial",
            category: "Premium Supplement",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            description: "Our premium Retatrutide vials are manufactured to the highest standards and third-party tested for purity and potency. Each vial contains pharmaceutical-grade Retatrutide in precise dosages to ensure consistent and reliable results.",
            disclaimer: "This product is intended for research purposes only and is not intended for human consumption. It has not been evaluated by the FDA and is not intended to diagnose, treat, cure, or prevent any disease."
        };

        // Initial stock data
        this.dosages = [
            {id: 1, dosage: "5mg", price: 24.99, stock: 15},
            {id: 2, dosage: "10mg", price: 39.99, stock: 23},
            {id: 3, dosage: "15mg", price: 54.99, stock: 8},
            {id: 4, dosage: "20mg", price: 69.99, stock: 0},
            {id: 5, dosage: "30mg", price: 74.99, stock: 12},
            {id: 6, dosage: "60mg", price: 99.99, stock: 5}
        ];

        // App state - Initialize with logged out state
        this.currentView = 'home';
        this.currentUser = null; // Important: Start as null (not logged in)
        this.selectedDosage = null;
        this.cart = [];
        this.orders = [];
        this.shippingThreshold = 75.00;

        this.init();
    }

    init() {
        // Ensure DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        // Force initial logged-out state
        this.currentUser = null;
        
        // Setup everything in the correct order
        this.setupEventListeners();
        this.populateDosageOptions();
        this.updateCartDisplay();
        
        // CRITICAL: Ensure proper initial auth state (logged out)
        this.updateAuthDisplay();
        
        // Show home view and hide all others
        this.showView('home');
        
        console.log('App initialized - should show Login/Sign Up buttons only');
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation links
        this.setupNavigationLinks();
        
        // Authentication buttons
        this.setupAuthButtons();
        
        // Product buttons
        this.setupProductButtons();
        
        // Cart buttons
        this.setupCartButtons();
        
        // Checkout buttons
        this.setupCheckoutButtons();
        
        // Modal buttons
        this.setupModalButtons();
    }

    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            // Remove any existing listeners to prevent duplicates
            link.removeEventListener('click', this.handleNavClick);
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const view = e.target.dataset.view;
                if (view) {
                    console.log('Navigation clicked:', view);
                    this.showView(view);
                }
            });
        });
    }

    setupAuthButtons() {
        // Get buttons
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const accountBtn = document.getElementById('accountBtn');

        // Remove existing listeners and add new ones
        if (loginBtn) {
            loginBtn.replaceWith(loginBtn.cloneNode(true));
            const newLoginBtn = document.getElementById('loginBtn');
            newLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Login button clicked');
                this.showView('auth');
                this.showAuthForm('login');
            });
        }

        if (signupBtn) {
            signupBtn.replaceWith(signupBtn.cloneNode(true));
            const newSignupBtn = document.getElementById('signupBtn');
            newSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Signup button clicked');
                this.showView('auth');
                this.showAuthForm('signup');
            });
        }

        if (logoutBtn) {
            logoutBtn.replaceWith(logoutBtn.cloneNode(true));
            const newLogoutBtn = document.getElementById('logoutBtn');
            newLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Logout button clicked');
                this.logout();
            });
        }

        if (accountBtn) {
            accountBtn.replaceWith(accountBtn.cloneNode(true));
            const newAccountBtn = document.getElementById('accountBtn');
            newAccountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Account button clicked');
                this.showView('account');
                this.loadAccountData();
            });
        }

        // Auth form switches
        this.setupAuthFormSwitches();
        
        // Auth form submissions
        this.setupAuthFormSubmissions();
    }

    setupAuthFormSwitches() {
        const showSignupBtn = document.getElementById('showSignupBtn');
        const showLoginBtn = document.getElementById('showLoginBtn');

        if (showSignupBtn) {
            showSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Switch to signup clicked');
                this.showAuthForm('signup');
            });
        }

        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Switch to login clicked');
                this.showAuthForm('login');
            });
        }
    }

    setupAuthFormSubmissions() {
        const loginForm = document.getElementById('loginFormElement');
        const signupForm = document.getElementById('signupFormElement');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Login form submitted');
                this.handleLogin();
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Signup form submitted');
                this.handleSignup();
            });
        }
    }

    setupProductButtons() {
        const shopNowBtn = document.getElementById('shopNowBtn');
        const viewDetailsBtn = document.getElementById('viewDetailsBtn');
        const backToHomeBtn = document.getElementById('backToHomeBtn');
        const addToCartBtn = document.getElementById('addToCartBtn');

        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('product');
            });
        }

        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('product');
            });
        }

        if (backToHomeBtn) {
            backToHomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('home');
            });
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart();
            });
        }
    }

    setupCartButtons() {
        const cartButton = document.getElementById('cartButton');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const continueShopping = document.getElementById('continueShopping');

        if (cartButton) {
            cartButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('cart');
                this.updateCartView();
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.currentUser) {
                    this.showView('auth');
                    this.showAuthForm('login');
                    return;
                }
                this.showView('checkout');
                this.updateCheckoutView();
            });
        }

        if (continueShopping) {
            continueShopping.addEventListener('click', (e) => {
                e.preventDefault();
                this.showView('home');
            });
        }
    }

    setupCheckoutButtons() {
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.completeOrder();
            });
        }
    }

    setupModalButtons() {
        const closeSuccessModal = document.getElementById('closeSuccessModal');
        const modalOverlay = document.querySelector('.modal-overlay');

        if (closeSuccessModal) {
            closeSuccessModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSuccessModal();
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSuccessModal();
            });
        }
    }

    // View Management
    showView(viewName) {
        console.log('Showing view:', viewName);
        
        // Hide all views first
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(`${viewName}View`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        } else {
            console.error('View not found:', viewName);
        }

        // Update navigation state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-view="${viewName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Authentication
    showAuthForm(formType) {
        console.log('Showing auth form:', formType);
        
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (formType === 'login') {
            if (loginForm) loginForm.classList.remove('hidden');
            if (signupForm) signupForm.classList.add('hidden');
        } else {
            if (loginForm) loginForm.classList.add('hidden');
            if (signupForm) signupForm.classList.remove('hidden');
        }
    }

    handleLogin() {
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!emailInput || !passwordInput) {
            console.error('Login form inputs not found');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        console.log('Login attempt:', email);

        // Simple validation (in real app, this would be server-side)
        if (email && password) {
            this.currentUser = {
                email: email,
                name: email.split('@')[0] // Simple name derivation
            };
            
            console.log('User logged in:', this.currentUser);
            
            this.updateAuthDisplay();
            this.showView('home');
            this.clearAuthForms();
        } else {
            console.log('Login validation failed');
        }
    }

    handleSignup() {
        const nameInput = document.getElementById('signupName');
        const emailInput = document.getElementById('signupEmail');
        const passwordInput = document.getElementById('signupPassword');

        if (!nameInput || !emailInput || !passwordInput) {
            console.error('Signup form inputs not found');
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        console.log('Signup attempt:', name, email);

        // Simple validation
        if (name && email && password) {
            this.currentUser = {
                email: email,
                name: name
            };
            
            console.log('User signed up:', this.currentUser);
            
            this.updateAuthDisplay();
            this.showView('home');
            this.clearAuthForms();
        } else {
            console.log('Signup validation failed');
        }
    }

    logout() {
        console.log('User logging out');
        this.currentUser = null;
        this.updateAuthDisplay();
        this.showView('home');
    }

    updateAuthDisplay() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const welcomeMessage = document.getElementById('welcomeMessage');

        console.log('Updating auth display, currentUser:', this.currentUser);

        if (this.currentUser) {
            // User is logged in - hide Login/Sign Up, show user menu
            console.log('Showing logged in state');
            if (authButtons) {
                authButtons.classList.add('hidden');
                console.log('Hidden auth buttons');
            }
            if (userMenu) {
                userMenu.classList.remove('hidden');
                console.log('Showing user menu');
            }
            
            // Update welcome message
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${this.currentUser.name}!`;
                console.log('Updated welcome message');
            }
        } else {
            // User is not logged in - show Login/Sign Up, hide user menu
            console.log('Showing logged out state');
            if (authButtons) {
                authButtons.classList.remove('hidden');
                console.log('Showing auth buttons');
            }
            if (userMenu) {
                userMenu.classList.add('hidden');
                console.log('Hidden user menu');
            }
        }
    }

    clearAuthForms() {
        const loginForm = document.getElementById('loginFormElement');
        const signupForm = document.getElementById('signupFormElement');
        if (loginForm) loginForm.reset();
        if (signupForm) signupForm.reset();
    }

    // Product Management
    populateDosageOptions() {
        const container = document.getElementById('dosageOptions');
        if (!container) return;

        container.innerHTML = '';

        this.dosages.forEach(dosage => {
            const option = document.createElement('div');
            option.className = `dosage-option ${dosage.stock === 0 ? 'out-of-stock' : ''}`;
            option.dataset.dosageId = dosage.id;

            option.innerHTML = `
                <div class="dosage-label">${dosage.dosage}</div>
                <div class="dosage-price">$${dosage.price.toFixed(2)}</div>
                <div class="dosage-stock ${dosage.stock === 0 ? 'out-of-stock' : ''}">
                    ${dosage.stock === 0 ? 'Out of Stock' : 'In Stock'}
                </div>
            `;

            if (dosage.stock > 0) {
                option.addEventListener('click', () => {
                    this.selectDosage(dosage.id);
                });
            }

            container.appendChild(option);
        });
    }

    selectDosage(dosageId) {
        // Remove previous selection
        document.querySelectorAll('.dosage-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        const option = document.querySelector(`[data-dosage-id="${dosageId}"]`);
        if (option) {
            option.classList.add('selected');
        }

        // Update selected dosage
        this.selectedDosage = this.dosages.find(d => d.id === dosageId);

        // Show selected dosage info
        this.updateSelectedDosageDisplay();
    }

    updateSelectedDosageDisplay() {
        const container = document.getElementById('selectedDosage');
        const priceElement = document.getElementById('selectedPrice');
        const stockElement = document.getElementById('stockStatus');
        const addButton = document.getElementById('addToCartBtn');

        if (this.selectedDosage && container && priceElement && stockElement && addButton) {
            container.classList.remove('hidden');
            priceElement.textContent = `$${this.selectedDosage.price.toFixed(2)}`;
            
            if (this.selectedDosage.stock > 0) {
                stockElement.textContent = 'In Stock';
                stockElement.className = 'stock-status in-stock';
                addButton.disabled = false;
            } else {
                stockElement.textContent = 'Out of Stock';
                stockElement.className = 'stock-status out-of-stock';
                addButton.disabled = true;
            }
        }
    }

    // Cart Management
    addToCart() {
        if (!this.selectedDosage || this.selectedDosage.stock === 0) return;

        // Check if item already in cart
        const existingItem = this.cart.find(item => item.id === this.selectedDosage.id);

        if (existingItem) {
            if (existingItem.quantity < this.selectedDosage.stock) {
                existingItem.quantity++;
            }
        } else {
            this.cart.push({
                id: this.selectedDosage.id,
                dosage: this.selectedDosage.dosage,
                price: this.selectedDosage.price,
                quantity: 1,
                name: this.productData.name,
                image: this.productData.image
            });
        }

        // Update stock
        this.selectedDosage.stock--;

        // Update displays
        this.updateCartDisplay();
        this.populateDosageOptions();
        this.updateSelectedDosageDisplay();
    }

    removeFromCart(itemId) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;

        const item = this.cart[itemIndex];
        
        // Restore stock
        const dosage = this.dosages.find(d => d.id === itemId);
        if (dosage) {
            dosage.stock += item.quantity;
        }

        // Remove from cart
        this.cart.splice(itemIndex, 1);

        // Update displays
        this.updateCartDisplay();
        this.updateCartView();
        this.populateDosageOptions();
        this.updateSelectedDosageDisplay();
    }

    updateCartQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        const dosage = this.dosages.find(d => d.id === itemId);
        
        if (!item || !dosage) return;

        const difference = newQuantity - item.quantity;
        
        // Check stock availability
        if (difference > 0 && difference > dosage.stock) {
            return; // Not enough stock
        }

        if (newQuantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        // Update quantities
        item.quantity = newQuantity;
        dosage.stock -= difference;

        // Update displays
        this.updateCartDisplay();
        this.updateCartView();
        this.populateDosageOptions();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateCartView() {
        const container = document.getElementById('cartItems');
        const subtotalElement = document.getElementById('cartSubtotal');
        const shippingElement = document.getElementById('shippingCost');
        const totalElement = document.getElementById('cartTotal');

        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started</p>
                </div>
            `;
            if (subtotalElement) subtotalElement.textContent = '$0.00';
            if (shippingElement) shippingElement.textContent = '$0.00';
            if (totalElement) totalElement.textContent = '$0.00';
            return;
        }

        container.innerHTML = '';

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-dosage">${item.dosage}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="app.updateCartQuantity(${item.id}, parseInt(this.value))" min="1">
                        <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-item" onclick="app.removeFromCart(${item.id})">🗑️</button>
                </div>
            `;
            container.appendChild(cartItem);
        });

        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= this.shippingThreshold ? 0 : 10;
        const total = subtotal + shipping;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Checkout
    updateCheckoutView() {
        const container = document.getElementById('checkoutItems');
        const subtotalElement = document.getElementById('checkoutSubtotal');
        const shippingElement = document.getElementById('checkoutShipping');
        const totalElement = document.getElementById('checkoutTotal');

        // Populate shipping form with user data
        if (this.currentUser) {
            const shippingName = document.getElementById('shippingName');
            if (shippingName) {
                shippingName.value = this.currentUser.name;
            }
        }

        // Show order items
        if (container) {
            container.innerHTML = '';
            this.cart.forEach(item => {
                const checkoutItem = document.createElement('div');
                checkoutItem.className = 'checkout-item';
                checkoutItem.innerHTML = `
                    <span>${item.name} (${item.dosage}) x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                container.appendChild(checkoutItem);
            });
        }

        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= this.shippingThreshold ? 0 : 10;
        const total = subtotal + shipping;

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    completeOrder() {
        if (!this.currentUser || this.cart.length === 0) return;

        // Get shipping info
        const shippingInfo = {
            name: document.getElementById('shippingName')?.value || '',
            address: document.getElementById('shippingAddress')?.value || '',
            city: document.getElementById('shippingCity')?.value || '',
            state: document.getElementById('shippingState')?.value || '',
            zip: document.getElementById('shippingZip')?.value || ''
        };

        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= this.shippingThreshold ? 0 : 10;
        const total = subtotal + shipping;

        // Create order
        const order = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            items: [...this.cart],
            shipping: shippingInfo,
            subtotal: subtotal,
            shippingCost: shipping,
            total: total,
            status: 'Completed'
        };

        // Add to orders
        this.orders.push(order);

        // Clear cart
        this.cart = [];

        // Update displays
        this.updateCartDisplay();

        // Show success modal
        this.showSuccessModal();

        // Reset form
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.reset();
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.showView('home');
    }

    // Account Management
    loadAccountData() {
        if (!this.currentUser) {
            this.showView('auth');
            return;
        }

        // Update account info
        const accountName = document.getElementById('accountName');
        const accountEmail = document.getElementById('accountEmail');
        
        if (accountName) accountName.textContent = this.currentUser.name;
        if (accountEmail) accountEmail.textContent = this.currentUser.email;

        // Update order history
        const container = document.getElementById('orderHistory');
        
        if (!container) return;

        if (this.orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No orders yet</h3>
                    <p>Your order history will appear here</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        this.orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            orderElement.innerHTML = `
                <div class="order-header">
                    <span class="order-id">Order #${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => 
                        `<div class="order-item-detail">${item.name} (${item.dosage}) x${item.quantity}</div>`
                    ).join('')}
                </div>
                <div class="order-total">Total: $${order.total.toFixed(2)}</div>
            `;
            container.appendChild(orderElement);
        });
    }
}

// Initialize the application
const app = new ECommerceApp();
window.app = app; // Make globally available for onclick handlers

console.log('App script loaded, app initialized');