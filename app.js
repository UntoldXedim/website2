// Product data - Single product with multiple dosages
const productDosages = [
    { id: 1, dosage: "5mg", price: 24.99, stock: 15 },
    { id: 2, dosage: "10mg", price: 39.99, stock: 23 },
    { id: 3, dosage: "15mg", price: 54.99, stock: 8 },
    { id: 4, dosage: "20mg", price: 69.99, stock: 0 }, // Out of stock example
    { id: 5, dosage: "30mg", price: 74.99, stock: 12 },
    { id: 6, dosage: "60mg", price: 99.99, stock: 5 }
];

const productInfo = {
    name: "Retatrutide Vial",
    category: "Premium Supplement",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "Our premium Retatrutide vials are manufactured to the highest standards and third-party tested for purity and potency. Each vial contains pharmaceutical-grade Retatrutide in precise dosages to ensure consistent and reliable results.",
    disclaimer: "This product is intended for research purposes only and is not intended for human consumption. It has not been evaluated by the FDA and is not intended to diagnose, treat, cure, or prevent any disease."
};

// Global state
let currentUser = null;
let cart = [];
let selectedDosage = null;
const shippingThreshold = 75.00;

// Make functions globally available
window.showPage = showPage;
window.showProductDetails = showProductDetails;
window.selectDosage = selectDosage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.logout = logout;
window.completeOrder = completeOrder;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    loadUserSession();
    loadCart();
    displaySingleProduct();
    updateCartCount();
    updateUserInterface();
    setupEventListeners();
    console.log('App initialized successfully');
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
}

// Page navigation function
function showPage(pageId) {
    console.log('Navigating to page:', pageId);

    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show the selected page
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Page shown:', pageId);

        // Update page-specific content
        if (pageId === 'account') {
            if (!currentUser) {
                showPage('login');
                return;
            }
            displayAccountInfo();
        } else if (pageId === 'checkout') {
            displayCartItems();
        } else if (pageId === 'productDetails') {
            displayProductDetails();
        }
    } else {
        console.error('Page not found:', pageId + 'Page');
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Product display functions
function displaySingleProduct() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        return;
    }

    const minPrice = Math.min(...productDosages.map(d => d.price));
    const maxPrice = Math.max(...productDosages.map(d => d.price));

    productsGrid.innerHTML = `
        <div class="product-card single-product-card" onclick="showProductDetails()">
            <img src="${productInfo.image}" alt="${productInfo.name}" class="product-image">
            <div class="product-content">
                <div class="product-category">${productInfo.category}</div>
                <h3 class="product-name">${productInfo.name}</h3>
                <div class="product-dosage">Multiple Dosages Available</div>
                <div class="product-price-range">$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}</div>
                <p class="product-description">High-quality Retatrutide vials available in various dosages to meet your specific needs.</p>
                <button class="btn btn--primary btn--full-width">View Details & Select Dosage</button>
            </div>
        </div>
    `;
}

function showProductDetails() {
    showPage('productDetails');
}

function displayProductDetails() {
    const dosageOptions = document.getElementById('dosageOptions');
    if (!dosageOptions) return;

    dosageOptions.innerHTML = productDosages.map(dosage => `
        <div class="dosage-option ${dosage.stock === 0 ? 'out-of-stock' : ''}" 
             onclick="${dosage.stock > 0 ? `selectDosage(${dosage.id})` : ''}">
            <div class="dosage-info">
                <div class="dosage-label">${dosage.dosage}</div>
                <div class="dosage-price">$${dosage.price.toFixed(2)}</div>
                <div class="stock-indicator ${dosage.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                    ${dosage.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                </div>
            </div>
        </div>
    `).join('');

    // Reset selection
    selectedDosage = null;
    document.getElementById('selectedProductInfo').style.display = 'none';
    document.getElementById('addToCartBtn').disabled = true;
}

function selectDosage(dosageId) {
    selectedDosage = productDosages.find(d => d.id === dosageId);
    if (!selectedDosage || selectedDosage.stock === 0) return;

    // Update UI
    document.querySelectorAll('.dosage-option').forEach(option => {
        option.classList.remove('selected');
    });

    event.currentTarget.classList.add('selected');

    // Show selected product info
    document.getElementById('selectedDosage').textContent = selectedDosage.dosage;
    document.getElementById('selectedPrice').textContent = `$${selectedDosage.price.toFixed(2)}`;

    const stockStatus = document.getElementById('stockStatus');
    stockStatus.innerHTML = `
        <div class="stock-indicator in-stock">
            ✓ In Stock - Ready to Ship
        </div>
    `;

    document.getElementById('selectedProductInfo').style.display = 'block';

    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.disabled = false;
    addToCartBtn.onclick = () => addSelectedToCart();
}

function addSelectedToCart() {
    if (!selectedDosage) return;

    const product = {
        id: selectedDosage.id,
        name: `${productInfo.name} - ${selectedDosage.dosage}`,
        dosage: selectedDosage.dosage,
        price: selectedDosage.price,
        image: productInfo.image,
        category: productInfo.category
    };

    const existingItem = cart.find(item => item.id === selectedDosage.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Update stock
    selectedDosage.stock -= 1;

    saveCart();
    updateCartCount();

    // Show feedback
    const button = document.getElementById('addToCartBtn');
    const originalText = button.textContent;

    button.textContent = 'Added to Cart!';
    button.style.backgroundColor = '#1e7e34';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 1500);

    console.log('Added to cart:', product.name);
}

// User authentication
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('supplementStore_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('supplementStore_currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        showPage('home');
        errorElement.textContent = '';
        console.log('User logged in:', user.name);
    } else {
        errorElement.textContent = 'Invalid email or password';
    }
}

function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const errorElement = document.getElementById('signupError');

    // Validation
    if (password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        return;
    }

    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters long';
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('supplementStore_users') || '[]');
    if (users.find(u => u.email === email)) {
        errorElement.textContent = 'An account with this email already exists';
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('supplementStore_users', JSON.stringify(users));

    // Log in the new user
    currentUser = newUser;
    localStorage.setItem('supplementStore_currentUser', JSON.stringify(currentUser));
    updateUserInterface();
    showPage('home');
    errorElement.textContent = '';
    console.log('User signed up and logged in:', newUser.name);
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('supplementStore_currentUser');
    updateUserInterface();
    showPage('home');
    console.log('User logged out');
}

function loadUserSession() {
    const savedUser = localStorage.getItem('supplementStore_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        console.log('Loaded user session:', currentUser.name);
    }
}

function updateUserInterface() {
    const authLinks = document.getElementById('authLinks');
    const userSection = document.getElementById('userSection');
    const userGreeting = document.getElementById('userGreeting');

    if (currentUser) {
        authLinks.classList.add('hidden');
        userSection.classList.remove('hidden');
        userGreeting.textContent = `Welcome, ${currentUser.name}!`;
    } else {
        authLinks.classList.remove('hidden');
        userSection.classList.add('hidden');
    }
}

// Shopping cart functionality
function addToCart(productId) {
    // This is kept for backward compatibility but not used in the new design
    console.log('Legacy addToCart called');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
    console.log('Removed from cart:', productId);
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    const dosage = productDosages.find(d => d.id === productId);

    if (change > 0) {
        // Adding to cart - check stock
        if (dosage && dosage.stock > 0) {
            item.quantity += change;
            dosage.stock -= change;
        } else {
            alert('Sorry, this item is out of stock.');
            return;
        }
    } else {
        // Removing from cart - restore stock
        item.quantity += change;
        if (dosage) {
            dosage.stock -= change; // change is negative, so this adds back to stock
        }
    }

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartCount();
        displayCartItems();
    }
}

function saveCart() {
    localStorage.setItem('supplementStore_cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('supplementStore_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log('Loaded cart with', cart.length, 'items');
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    if (!cartItemsContainer || !cartTotalElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <button class="btn btn--primary" onclick="showPage('home')">Continue Shopping</button>
            </div>
        `;
        cartTotalElement.textContent = '0.00';
        return;
    }

    const cartTotal = calculateCartTotal();
    const isEligibleForFreeShipping = cartTotal >= shippingThreshold;

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-dosage" style="font-size: var(--font-size-sm); color: #28a745; font-weight: var(--font-weight-medium);">${item.dosage}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="btn btn--sm" onclick="removeFromCart(${item.id})" style="background-color: #dc3545; color: white;">Remove</button>
        </div>
    `).join('');

    cartTotalElement.textContent = cartTotal.toFixed(2);

    // Update shipping notice
    const shippingNotice = document.querySelector('.shipping-notice p');
    if (shippingNotice) {
        if (isEligibleForFreeShipping) {
            shippingNotice.innerHTML = '<strong>✓ You qualify for free shipping!</strong>';
            shippingNotice.style.color = '#28a745';
        } else {
            const amountNeeded = (shippingThreshold - cartTotal).toFixed(2);
            shippingNotice.innerHTML = `<strong>Add $${amountNeeded} more for free shipping!</strong>`;
            shippingNotice.style.color = '#f39c12';
        }
    }
}

// Account management
function displayAccountInfo() {
    const accountDetails = document.getElementById('accountDetails');
    if (!accountDetails || !currentUser) return;

    accountDetails.innerHTML = `
        <div class="account-detail">
            <strong>Name:</strong>
            <span>${currentUser.name}</span>
        </div>
        <div class="account-detail">
            <strong>Email:</strong>
            <span>${currentUser.email}</span>
        </div>
        <div class="account-detail">
            <strong>Member Since:</strong>
            <span>${new Date(currentUser.createdAt).toLocaleDateString()}</span>
        </div>
    `;

    // Also display order history
    displayOrderHistory();
}

// Order completion function
function completeOrder() {
    if (!currentUser) {
        alert('Please log in to complete your order.');
        showPage('login');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Validate shipping form
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const cartTotal = calculateCartTotal();
    const shippingCost = cartTotal >= shippingThreshold ? 0 : 9.99;
    const finalTotal = cartTotal + shippingCost;

    // Get form data
    const orderData = {
        id: Date.now(),
        userId: currentUser.id,
        items: [...cart],
        subtotal: cartTotal,
        shipping: shippingCost,
        total: finalTotal,
        shippingInfo: {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value
        },
        orderDate: new Date().toISOString(),
        status: 'pending'
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('supplementStore_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('supplementStore_orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();

    // Show success message
    let successMessage = `Order placed successfully! Order ID: ${orderData.id}\n\nSubtotal: $${cartTotal.toFixed(2)}`;
    if (shippingCost > 0) {
        successMessage += `\nShipping: $${shippingCost.toFixed(2)}`;
    } else {
        successMessage += `\nShipping: FREE (order over $${shippingThreshold})`;
    }
    successMessage += `\nTotal: $${finalTotal.toFixed(2)}\n\nNote: This is a demo order. Payment integration is required to process real payments.`;

    alert(successMessage);

    // Redirect to account page
    showPage('account');
}

function displayOrderHistory() {
    const orderHistoryElement = document.getElementById('orderHistory');
    if (!orderHistoryElement || !currentUser) return;

    const orders = JSON.parse(localStorage.getItem('supplementStore_orders') || '[]');
    const userOrders = orders.filter(order => order.userId === currentUser.id);

    if (userOrders.length === 0) {
        orderHistoryElement.innerHTML = '<p>No orders yet. <a href="#" onclick="showPage(\'home\')">Start shopping!</a></p>';
        return;
    }

    orderHistoryElement.innerHTML = userOrders.map(order => `
        <div class="order-item" style="border: 1px solid var(--color-border); padding: var(--space-16); margin-bottom: var(--space-16); border-radius: var(--radius-base);">
            <div class="order-header" style="display: flex; justify-content: space-between; margin-bottom: var(--space-12);">
                <strong>Order #${order.id}</strong>
                <span>$${(order.total || order.subtotal).toFixed(2)}</span>
            </div>
            <div class="order-date" style="color: var(--color-text-secondary); margin-bottom: var(--space-8);">
                ${new Date(order.orderDate).toLocaleDateString()}
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
                        ${item.name} x ${item.quantity}
                    </div>
                `).join('')}
            </div>
            ${order.shipping !== undefined ? `
                <div class="order-shipping" style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-8);">
                    ${order.shipping === 0 ? 'Free shipping applied' : `Shipping: $${order.shipping.toFixed(2)}`}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Ensure all functions are available immediately
console.log('All functions loaded and available globally');
