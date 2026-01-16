const SHIPPING_COST = 3000;
const FREE_SHIPPING_THRESHOLD = 30000;

// Funciones globales para ser accedidas desde products.js
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCartAndNotify(product.name);
}

function saveCartAndNotify(productName) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${productName} ha sido añadido al carrito.`);
}

function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    if (window.location.pathname.endsWith('cart.html')) {
        renderCartPage();
    }
});

function renderCartPage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        showEmptyCartMessage();
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image || 'https://placehold.co/100x100?text=Producto'}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="price">Precio: $${item.price.toLocaleString('es-CO')}</p>
                <p>Subtotal: $${(item.price * item.quantity).toLocaleString('es-CO')}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-change" data-id="${item.id}" data-change="-1">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-change" data-id="${item.id}" data-change="1">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">Eliminar</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    showCartControls();
    addEventListeners();
    updateTotals();
}

function showEmptyCartMessage() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    cartItemsContainer.innerHTML = '<div class="empty-cart-message"><h3>Tu carrito está vacío</h3><p>¡Añade algunos productos para empezar!</p><a href="products.html" class="btn">Ver Productos</a></div>';
    document.getElementById('cart-summary').style.display = 'none';
    document.getElementById('checkout-form-container').style.display = 'none';
}

function showCartControls() {
    document.getElementById('cart-summary').style.display = 'block';
    document.getElementById('checkout-form-container').style.display = 'block';
}

function addEventListeners() {
    document.querySelectorAll('.quantity-change').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const change = parseInt(e.target.dataset.change);
            changeQuantity(id, change);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removeItem(id);
        });
    });

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
}

function changeQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}

function removeItem(productId) {
    cart = cart.filter(i => i.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`;
    document.getElementById('total').textContent = `$${total.toLocaleString('es-CO')}`;
}

async function handleCheckout(e) {
    e.preventDefault();
    const customerName = document.getElementById('customer-name').value;
    const customerAddress = document.getElementById('customer-address').value;
    
    if (!customerName || !customerAddress) {
        Swal.fire('Error', 'Por favor completa tu nombre y dirección.', 'error');
        return;
    }

    // Simulación de pasarela de pago con SweetAlert2
    const { value: paymentMethod } = await Swal.fire({
        title: 'Selecciona un método de pago',
        input: 'radio',
        inputOptions: {
            'credit-card': 'Tarjeta de Crédito',
            'pse': 'PSE - Transferencia Bancaria',
            'cash': 'Efectivo contra entrega'
        },
        inputValidator: (value) => !value && '¡Necesitas elegir un método de pago!',
        confirmButtonText: 'Continuar &rarr;',
        customClass: { popup: 'payment-popup' }
    });

    if (paymentMethod) {
        Swal.fire({
            title: 'Procesando tu pago...',
            text: 'Esto puede tardar unos segundos.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        setTimeout(() => {
            Swal.fire({
                icon: 'success',
                title: '¡Pago Aprobado!',
                text: `Gracias por tu compra, ${customerName}. Tu pedido será enviado a ${customerAddress}.`,
                confirmButtonText: '¡Genial!'
            }).then(() => {
                cart = [];
                localStorage.removeItem('cart');
                document.getElementById('order-confirmation').classList.remove('hidden');
                document.getElementById('cart-items-container').style.display = 'none';
                document.getElementById('cart-summary').style.display = 'none';
                document.getElementById('checkout-form-container').style.display = 'none';
                updateCartCount();
            });
        }, 2000);
    }
}