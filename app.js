// Product data
const products = [
    {
        "id": 1,
        "name": "Premium Whey Protein Powder",
        "price": 49.99,
        "category": "Protein",
        "description": "High-quality whey protein isolate with 25g protein per serving. Available in vanilla, chocolate, and strawberry flavors.",
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 2,
        "name": "Creatine Monohydrate",
        "price": 24.99,
        "category": "Performance",
        "description": "Pure creatine monohydrate powder to enhance strength, power, and muscle growth. Unflavored, 300g container.",
        "image": "https://images.unsplash.com/photo-1544991875-5dc1b05f607d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 3,
        "name": "Pre-Workout Complex",
        "price": 39.99,
        "category": "Performance",
        "description": "Energy-boosting pre-workout formula with caffeine, beta-alanine, and nitric oxide boosters. Fruit punch flavor.",
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 4,
        "name": "BCAA Recovery Powder",
        "price": 29.99,
        "category": "Recovery",
        "description": "Branch-chain amino acids in 2:1:1 ratio to support muscle recovery and reduce fatigue. Tropical flavor.",
        "image": "https://images.unsplash.com/photo-1544991875-5dc1b05f607d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 5,
        "name": "Daily Multivitamin",
        "price": 19.99,
        "category": "Vitamins",
        "description": "Complete daily vitamin and mineral complex with 23 essential nutrients. 60 tablets per bottle.",
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 6,
        "name": "Omega-3 Fish Oil",
        "price": 27.99,
        "category": "Vitamins",
        "description": "High-potency omega-3 fatty acids from wild-caught fish. 1000mg EPA/DHA per serving, 120 capsules.",
        "image": "https://images.unsplash.com/photo-1544991875-5dc1b05f607d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 7,
        "name": "Vitamin D3 + K2",
        "price": 22.99,
        "category": "Vitamins",
        "description": "Vitamin D3 5000 IU with K2 for optimal calcium absorption and bone health. 90 vegetarian capsules.",
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 8,
        "name": "Mass Gainer Protein",
        "price": 59.99,
        "category": "Protein",
        "description": "High-calorie protein powder with 50g protein and complex carbs for lean muscle growth. Chocolate flavor.",
        "image": "https://images.unsplash.com/photo-1544991875-5dc1b05f607d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 9,
        "name": "Magnesium Glycinate",
        "price": 18.99,
        "category": "Vitamins",
        "description": "Highly absorbable magnesium glycinate for muscle relaxation and better sleep. 400mg per capsule, 120 count.",
        "image": "https://images.unsplash.com/photo-1544991875-5dc1b05f607d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
        "id": 10,
        "name": "Post-Workout Recovery",
        "price": 34.99,
        "category": "Recovery",
        "description": "Complete post-workout formula with protein, carbs, and electrolytes for optimal recovery. Mixed berry flavor.",
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
];

// Global state
let currentUser = null;
let cart = [];
let currentFilter = 'All';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    loadUserSession();
    loadCart();
    displayProducts();
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

// Page navigation - Fixed function
window.showPage = function(pageId) {
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
        }
    } else {
        console.error('Page not found:', pageId + 'Page');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
};

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

// Logout function - Made global
window.logout = function() {
    currentUser = null;
    localStorage.removeItem('supplementStore_currentUser');
    updateUserInterface();
    showPage('home');
    console.log('User logged out');
};

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

// Product display and filtering - Fixed function
function displayProducts(productsToShow = products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.error('Products grid not found');
        return;
    }
    
    console.log('Displaying products:', productsToShow.length);
    
    productsGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Fixed filter function - Made global
window.filterProducts = function(category) {
    console.log('Filtering products by category:', category);
    currentFilter = category;
    
    // Update filter button states
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === category) {
            btn.classList.add('active');
        }
    });
    
    // Filter and display products
    const filteredProducts = category === 'All' 
        ? products 
        : products.filter(product => product.category === category);
    
    console.log('Filtered products count:', filteredProducts.length);
    displayProducts(filteredProducts);
};

// Shopping cart functionality - Made global functions
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    console.log('Added to cart:', product.name);
    
    // Show feedback
    const button = event.target;
    const originalText = button.textContent;
    const originalColor = button.style.backgroundColor;
    
    button.textContent = 'Added!';
    button.style.backgroundColor = '#1e7e34';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalColor || '#28a745';
    }, 1000);
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
    console.log('Removed from cart:', productId);
};

window.updateQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartCount();
        displayCartItems();
    }
};

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
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
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
    
    cartTotalElement.textContent = calculateCartTotal().toFixed(2);
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

// Order completion - Made global
window.completeOrder = function() {
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
    
    // Get form data
    const orderData = {
        id: Date.now(),
        userId: currentUser.id,
        items: [...cart],
        total: calculateCartTotal(),
        shipping: {
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
    alert(`Order placed successfully! Order ID: ${orderData.id}\n\nNote: This is a demo order. Payment integration is required to process real payments.`);
    
    // Redirect to account page
    showPage('account');
};

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
                <span>$${order.total.toFixed(2)}</span>
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
        </div>
    `).join('');
}

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

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

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Handle navigation for mobile
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-open');
}

// Add mobile styles for navigation
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-links.mobile-open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--color-surface);
            border: 1px solid var(--color-border);
            padding: var(--space-16);
            box-shadow: var(--shadow-lg);
        }
    }
`;
document.head.appendChild(style);