document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const cartView = document.getElementById('cart-view');
    const paymentView = document.getElementById('payment-view');
    const confirmationView = document.getElementById('confirmation-view');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountSpan = document.getElementById('cart-count');

    // Summary Elements
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');

    // Buttons and Forms
    const checkoutButton = document.getElementById('checkout-button');
    const paymentForm = document.getElementById('payment-form');

    const SHIPPING_COST = 5.00;

    // --- Main State ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Core Functions ---

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    };

    const renderCart = () => {
        if (!cartItemsContainer) return;

        // Handle empty cart
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty-msg"><p>Tu carrito está vacío.</p><a href="products.html" class="btn btn-primary">Ver productos</a></div>';
            document.querySelector(".cart-summary").style.display = 'none'; // Hide summary if cart is empty
            return;
        }

        document.querySelector(".cart-summary").style.display = 'block';
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                     <p class="item-total-price">$${(item.price * item.quantity).toFixed(2)}</p>
                     <button class="remove-btn" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        updateSummary();
    };

    const updateSummary = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal + SHIPPING_COST;

        if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
    };

    const updateQuantity = (productId, change) => {
        const item = cart.find(i => i.id == productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id != productId);
        }

        saveCart();
    };

    const removeItem = (productId) => {
        cart = cart.filter(i => i.id != productId);
        saveCart();
    };

    const updateCartCount = () => {
        if (!cartCountSpan) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountSpan.textContent = totalItems;
            cartCountSpan.style.display = 'flex';
        } else {
            cartCountSpan.style.display = 'none';
        }
    };

    const showView = (viewToShow) => {
        cartView.style.display = 'none';
        paymentView.style.display = 'none';
        confirmationView.style.display = 'none';
        viewToShow.style.display = 'block';
        window.scrollTo(0, 0);
    };

    // --- Event Listeners ---

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity-btn')) {
                const id = e.target.dataset.id;
                const change = parseInt(e.target.dataset.change, 10);
                updateQuantity(id, change);
            }
            if (e.target.classList.contains('remove-btn')) {
                const id = e.target.dataset.id;
                removeItem(id);
            }
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            showView(paymentView);
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate payment processing
            console.log('Simulating payment...');
            
            // Clear the cart
            cart = [];
            localStorage.removeItem('cart');
            
            // Show confirmation
            showView(confirmationView);
            updateCartCount(); // Update header count to 0
        });
    }

    // --- Initialization ---
    renderCart();
    updateCartCount();
});
