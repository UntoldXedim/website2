// Application state and data
const appState = {
    currentUser: null,
    cart: [],
    currentPage: 'home',
    selectedDosage: null,
    quantity: 1,
    appliedCoupon: null,
    ageVerified: false
};

// Product data
const productData = {
    name: "Retatrutide Vial",
    category: "Premium Supplement",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "Our premium Retatrutide vials are manufactured to the highest standards and third-party tested for purity and potency. Each vial contains pharmaceutical-grade Retatrutide in precise dosages to ensure consistent and reliable results.",
    disclaimer: "This product is intended for research purposes only and is not intended for human consumption. It has not been evaluated by the FDA and is not intended to diagnose, treat, cure, or prevent any disease.",
    dosages: [
        {id: 1, dosage: "5mg", price: 24.99, stock: 15},
        {id: 2, dosage: "10mg", price: 39.99, stock: 23},
        {id: 3, dosage: "15mg", price: 54.99, stock: 8},
        {id: 4, dosage: "20mg", price: 69.99, stock: 0},
        {id: 5, dosage: "30mg", price: 74.99, stock: 12},
        {id: 6, dosage: "60mg", price: 99.99, stock: 5}
    ]
};

// Coupons
const coupons = {
    "SAVE100": {discount: 99.96, description: "$99.96 off your order"}
};

const shippingThreshold = 75.00;

// Age verification functions
function handleAgeVerification(approved) {
    const modal = document.getElementById('ageModal');
    if (approved) {
        appState.ageVerified = true;
        if (modal) {
            modal.style.display = 'none';
        }
    } else {
        if (modal) {
            modal.style.display = 'none';
        }
        showPage('ageRestriction');
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
    setupEventListeners();
    loadStoredData();
    checkAgeVerification();
});

function initializeApp() {
    // Load data from localStorage
    const storedProducts = localStorage.getItem('productData');
    if (storedProducts) {
        productData.dosages = JSON.parse(storedProducts);
    } else {
        localStorage.setItem('productData', JSON.stringify(productData.dosages));
    }

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        appState.cart = JSON.parse(storedCart);
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        appState.currentUser = JSON.parse(storedUser);
        updateAuthUI();
    }

    updateCartCount();
    renderDosageOptions();
}

function checkAgeVerification() {
    if (!appState.ageVerified) {
        const modal = document.getElementById('ageModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Age verification with direct onclick assignment as backup
    const ageYesBtn = document.getElementById('ageYes');
    const ageNoBtn = document.getElementById('ageNo');
    
    if (ageYesBtn) {
        ageYesBtn.onclick = function(e) {
            console.log('Age Yes clicked');
            e.preventDefault();
            handleAgeVerification(true);
        };
        ageYesBtn.addEventListener('click', function(e) {
            console.log('Age Yes addEventListener clicked');
            e.preventDefault();
            handleAgeVerification(true);
        });
    }

    if (ageNoBtn) {
        ageNoBtn.onclick = function(e) {
            console.log('Age No clicked');
            e.preventDefault();
            handleAgeVerification(false);
        };
        ageNoBtn.addEventListener('click', function(e) {
            console.log('Age No addEventListener clicked');
            e.preventDefault();
            handleAgeVerification(false);
        });
    }

    // Navigation
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', () => showProductDetails());
    }
    
    const backToHomeBtn = document.getElementById('backToHome');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', () => showPage('home'));
    }
    
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => showPage('cart'));
    }
    
    const accountBtn = document.getElementById('accountBtn');
    if (accountBtn) {
        accountBtn.addEventListener('click', () => showPage('account'));
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    const viewTermsBtn = document.getElementById('viewTerms');
    if (viewTermsBtn) {
        viewTermsBtn.addEventListener('click', () => showPage('terms'));
    }
    
    const backFromTermsBtn = document.getElementById('backFromTerms');
    if (backFromTermsBtn) {
        backFromTermsBtn.addEventListener('click', () => showPage('account'));
    }
    
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => showPage('home'));
    }

    // Product controls
    const decreaseQtyBtn = document.getElementById('decreaseQty');
    if (decreaseQtyBtn) {
        decreaseQtyBtn.addEventListener('click', () => changeQuantity(-1));
    }
    
    const increaseQtyBtn = document.getElementById('increaseQty');
    if (increaseQtyBtn) {
        increaseQtyBtn.addEventListener('click', () => changeQuantity(1));
    }
    
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const newQty = parseInt(this.value);
            if (newQty > 0 && newQty <= getMaxQuantity()) {
                appState.quantity = newQty;
                updatePriceDisplay();
            } else {
                this.value = appState.quantity;
            }
        });
    }
    
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCart);
    }

    // Coupon system
    const applyCouponBtn = document.getElementById('applyCoupon');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    const couponInput = document.getElementById('couponInput');
    if (couponInput) {
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCoupon();
            }
        });
    }

    // Forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }
    
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
}

function loadStoredData() {
    const stored = localStorage.getItem('productData');
    if (stored) {
        productData.dosages = JSON.parse(stored);
        renderDosageOptions();
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    
    if (pageId === 'ageRestriction') {
        document.getElementById('ageRestriction').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    } else {
        document.getElementById('mainApp').classList.remove('hidden');
        
        if (pageId === 'home') {
            document.getElementById('homePage').classList.remove('hidden');
        } else if (pageId === 'product') {
            document.getElementById('productPage').classList.remove('hidden');
        } else if (pageId === 'cart') {
            document.getElementById('cartPage').classList.remove('hidden');
            renderCartPage();
        } else if (pageId === 'checkout') {
            document.getElementById('checkoutPage').classList.remove('hidden');
            renderCheckoutPage();
        } else if (pageId === 'account') {
            document.getElementById('accountPage').classList.remove('hidden');
            updateAccountPage();
        } else if (pageId === 'terms') {
            document.getElementById('termsPage').classList.remove('hidden');
        } else if (pageId === 'orderConfirmation') {
            document.getElementById('orderConfirmationPage').classList.remove('hidden');
        }
    }
    
    appState.currentPage = pageId;
}

function showProductDetails() {
    showPage('product');
    renderDosageOptions();
    updatePriceDisplay();
}

function renderDosageOptions() {
    const container = document.getElementById('dosageOptions');
    if (!container) return;
    
    container.innerHTML = '';

    productData.dosages.forEach(dosage => {
        const option = document.createElement('div');
        option.className = `dosage-option ${dosage.stock === 0 ? 'out-of-stock' : ''}`;
        option.dataset.dosageId = dosage.id;

        option.innerHTML = `
            <div class="dosage-text">${dosage.dosage}</div>
            <div class="dosage-price">$${dosage.price.toFixed(2)}</div>
            <div class="dosage-stock">
                ${dosage.stock === 0 ? 
                    '<span class="out-of-stock-label">Out of Stock</span>' : 
                    `${dosage.stock} in stock`
                }
            </div>
        `;

        if (dosage.stock > 0) {
            option.addEventListener('click', () => selectDosage(dosage));
        }

        container.appendChild(option);
    });

    if (!appState.selectedDosage) {
        const firstAvailable = productData.dosages.find(d => d.stock > 0);
        if (firstAvailable) {
            selectDosage(firstAvailable);
        }
    }
}

function selectDosage(dosage) {
    if (dosage.stock === 0) return;
    
    appState.selectedDosage = dosage;
    
    document.querySelectorAll('.dosage-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    const selectedElement = document.querySelector(`[data-dosage-id="${dosage.id}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }
    
    appState.quantity = 1;
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.value = 1;
        quantityInput.max = dosage.stock;
    }
    
    updatePriceDisplay();
    updateAddToCartButton();
}

function changeQuantity(change) {
    if (!appState.selectedDosage) return;
    
    const newQuantity = appState.quantity + change;
    const maxQuantity = getMaxQuantity();
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
        appState.quantity = newQuantity;
        const quantityInput = document.getElementById('quantityInput');
        if (quantityInput) {
            quantityInput.value = newQuantity;
        }
        updatePriceDisplay();
    }
}

function getMaxQuantity() {
    return appState.selectedDosage ? appState.selectedDosage.stock : 1;
}

function updatePriceDisplay() {
    if (!appState.selectedDosage) return;
    
    const totalPrice = appState.selectedDosage.price * appState.quantity;
    const priceElement = document.getElementById('totalPrice');
    if (priceElement) {
        priceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
}

function updateAddToCartButton() {
    const button = document.getElementById('addToCartBtn');
    if (!button) return;
    
    if (!appState.selectedDosage || appState.selectedDosage.stock === 0) {
        button.disabled = true;
        button.textContent = 'Out of Stock';
    } else {
        button.disabled = false;
        button.textContent = 'Add to Cart';
    }
}

function addToCart() {
    if (!appState.selectedDosage || appState.selectedDosage.stock === 0) return;
    
    const existingItem = appState.cart.find(item => item.dosageId === appState.selectedDosage.id);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + appState.quantity;
        if (newQuantity <= appState.selectedDosage.stock) {
            existingItem.quantity = newQuantity;
        } else {
            alert(`Only ${appState.selectedDosage.stock} items available in stock.`);
            return;
        }
    } else {
        appState.cart.push({
            dosageId: appState.selectedDosage.id,
            dosage: appState.selectedDosage.dosage,
            price: appState.selectedDosage.price,
            quantity: appState.quantity,
            name: productData.name
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(appState.cart));
    updateCartCount();
    
    alert(`Added ${appState.quantity} ${appState.selectedDosage.dosage} to cart!`);
    
    appState.quantity = 1;
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.value = 1;
    }
    updatePriceDisplay();
}

function updateCartCount() {
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function renderCartPage() {
    const container = document.getElementById('cartItems');
    const summaryContainer = document.getElementById('cartSummary');
    
    if (!container || !summaryContainer) return;

    if (appState.cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><h3>Your cart is empty</h3><p>Add some products to get started!</p></div>';
        summaryContainer.innerHTML = '';
        return;
    }

    container.innerHTML = appState.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name} - ${item.dosage}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="btn btn--outline btn--sm" onclick="removeFromCart(${item.dosageId})">Remove</button>
        </div>
    `).join('');

    const subtotal = calculateSubtotal();
    const shipping = subtotal >= shippingThreshold ? 0 : 9.99;
    const total = subtotal + shipping;

    summaryContainer.innerHTML = `
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
        </div>
        ${shipping === 0 ? '<p class="text-success">Free shipping applied!</p>' : 
          `<p class="text-warning">Add $${(shippingThreshold - subtotal).toFixed(2)} more for free shipping</p>`}
        <div class="summary-row total">
            <span>Total:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
        <button class="btn btn--primary btn--full-width" onclick="proceedToCheckout()">Proceed to Checkout</button>
    `;
}

function removeFromCart(dosageId) {
    appState.cart = appState.cart.filter(item => item.dosageId !== dosageId);
    localStorage.setItem('cart', JSON.stringify(appState.cart));
    updateCartCount();
    renderCartPage();
}

function calculateSubtotal() {
    return appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function proceedToCheckout() {
    if (appState.cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    showPage('checkout');
}

function renderCheckoutPage() {
    const container = document.getElementById('orderSummaryItems');
    if (!container) return;
    
    const subtotal = calculateSubtotal();
    const shipping = subtotal >= shippingThreshold ? 0 : 9.99;
    let discount = 0;
    
    if (appState.appliedCoupon) {
        discount = coupons[appState.appliedCoupon].discount;
    }
    
    const total = subtotal + shipping - discount;

    container.innerHTML = `
        ${appState.cart.map(item => `
            <div class="order-item">
                <div>
                    <strong>${item.name} - ${item.dosage}</strong><br>
                    <small>Qty: ${item.quantity}</small>
                </div>
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('')}
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Shipping:</span>
            <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
        </div>
        ${discount > 0 ? `
            <div class="summary-row discount-row">
                <span>Discount (${appState.appliedCoupon}):</span>
                <span>-$${discount.toFixed(2)}</span>
            </div>
        ` : ''}
        <div class="summary-row total">
            <span><strong>Total:</strong></span>
            <span><strong>$${total.toFixed(2)}</strong></span>
        </div>
    `;
}

function applyCoupon() {
    const couponInput = document.getElementById('couponInput');
    const messageEl = document.getElementById('couponMessage');
    
    if (!couponInput || !messageEl) return;
    
    const couponCode = couponInput.value.toUpperCase().trim();
    
    if (!couponCode) {
        messageEl.innerHTML = '<span class="error">Please enter a coupon code</span>';
        return;
    }
    
    if (coupons[couponCode]) {
        appState.appliedCoupon = couponCode;
        messageEl.innerHTML = `<span class="success">Coupon applied: ${coupons[couponCode].description}</span>`;
        renderCheckoutPage();
    } else {
        messageEl.innerHTML = '<span class="error">Invalid coupon code</span>';
        appState.appliedCoupon = null;
    }
}

function placeOrder() {
    if (appState.cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const form = document.getElementById('checkoutForm');
    if (!form || !form.checkValidity()) {
        if (form) form.reportValidity();
        return;
    }

    for (let cartItem of appState.cart) {
        const currentProduct = productData.dosages.find(d => d.id === cartItem.dosageId);
        if (!currentProduct || currentProduct.stock < cartItem.quantity) {
            alert(`Sorry, ${cartItem.dosage} is no longer available in the requested quantity.`);
            return;
        }
    }

    appState.cart.forEach(cartItem => {
        const productIndex = productData.dosages.findIndex(d => d.id === cartItem.dosageId);
        if (productIndex !== -1) {
            productData.dosages[productIndex].stock -= cartItem.quantity;
        }
    });

    localStorage.setItem('productData', JSON.stringify(productData.dosages));

    const orderDetails = {
        items: [...appState.cart],
        subtotal: calculateSubtotal(),
        shipping: calculateSubtotal() >= shippingThreshold ? 0 : 9.99,
        discount: appState.appliedCoupon ? coupons[appState.appliedCoupon].discount : 0,
        coupon: appState.appliedCoupon,
        total: calculateSubtotal() + (calculateSubtotal() >= shippingThreshold ? 0 : 9.99) - (appState.appliedCoupon ? coupons[appState.appliedCoupon].discount : 0)
    };

    appState.cart = [];
    appState.appliedCoupon = null;
    localStorage.setItem('cart', JSON.stringify(appState.cart));
    updateCartCount();

    showOrderConfirmation(orderDetails);
    showPage('orderConfirmation');
}

function showOrderConfirmation(orderDetails) {
    const container = document.getElementById('orderDetails');
    if (!container) return;
    
    container.innerHTML = `
        <div class="order-confirmation-details">
            <h3>Order Details</h3>
            ${orderDetails.items.map(item => `
                <div class="order-item">
                    <span>${item.name} - ${item.dosage} (x${item.quantity})</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
            <hr>
            <div class="order-item">
                <span>Subtotal:</span>
                <span>$${orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div class="order-item">
                <span>Shipping:</span>
                <span>${orderDetails.shipping === 0 ? 'Free' : '$' + orderDetails.shipping.toFixed(2)}</span>
            </div>
            ${orderDetails.discount > 0 ? `
                <div class="order-item discount-row">
                    <span>Discount (${orderDetails.coupon}):</span>
                    <span>-$${orderDetails.discount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="order-item total">
                <strong>Total: $${orderDetails.total.toFixed(2)}</strong>
            </div>
        </div>
    `;
}

function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!emailInput || !passwordInput) return;
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        appState.currentUser = { name: user.name, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
        updateAuthUI();
        alert('Login successful!');
    } else {
        alert('Invalid email or password!');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passwordInput = document.getElementById('signupPassword');
    
    if (!nameInput || !emailInput || !passwordInput) return;
    
    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('User with this email already exists!');
        return;
    }
    
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    appState.currentUser = { name, email };
    localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
    updateAuthUI();
    alert('Account created successfully!');
}

function logout() {
    appState.currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showPage('home');
    alert('Logged out successfully!');
}

function updateAuthUI() {
    const loginSection = document.getElementById('loginSection');
    const userDashboard = document.getElementById('userDashboard');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!loginSection || !userDashboard || !logoutBtn) return;
    
    if (appState.currentUser) {
        loginSection.classList.add('hidden');
        userDashboard.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        
        if (userNameElement) userNameElement.textContent = appState.currentUser.name;
        if (userEmailElement) userEmailElement.textContent = appState.currentUser.email;
    } else {
        loginSection.classList.remove('hidden');
        userDashboard.classList.add('hidden');
        logoutBtn.classList.add('hidden');
    }
}

function updateAccountPage() {
    updateAuthUI();
}

// Global functions for onclick handlers
window.showProductDetails = showProductDetails;
window.removeFromCart = removeFromCart;
window.proceedToCheckout = proceedToCheckout;
