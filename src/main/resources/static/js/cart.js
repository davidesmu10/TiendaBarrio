document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const cartCountEl = document.getElementById('cart-count');
    const checkoutForm = document.getElementById('checkout-form');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            document.getElementById('cart-summary').style.display = 'none';
            document.getElementById('checkout-form-container').style.display = 'none';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.imagenUrl}" alt="${item.nombre}">
                <div class="item-details">
                    <h4>${item.nombre}</h4>
                    <p>Precio: $${item.precio.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-change" data-id="${item.id}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-change" data-id="${item.id}" data-change="1">+</button>
                </div>
                <p>$${(item.precio * item.quantity).toFixed(2)}</p>
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        updateTotals();
    }

    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
        const shipping = 5.00; // O una lógica más compleja
        const total = subtotal + shipping;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    function changeQuantity(productId, change) {
        const item = cart.find(i => i.id == productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id != productId);
            }
            saveCartAndRerender();
        }
    }

    function removeItem(productId) {
        cart = cart.filter(i => i.id != productId);
        saveCartAndRerender();
    }

    function saveCartAndRerender() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-change')) {
            const id = e.target.dataset.id;
            const change = parseInt(e.target.dataset.change, 10);
            changeQuantity(id, change);
        }
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            removeItem(id);
        }
    });

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const customerAddress = document.getElementById('customer-address').value;
        const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0) + 5.00;

        const orderData = {
            nombreCliente: customerName,
            direccionCliente: customerAddress,
            total: total,
            // En una app real, aquí irían los detalles del pedido.
        };

        try {
            const response = await fetch('/api/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                // Ocultar carrito y formulario, mostrar confirmación
                document.getElementById('cart-items-container').style.display = 'none';
                document.getElementById('cart-summary').style.display = 'none';
                document.getElementById('checkout-form-container').style.display = 'none';
                document.getElementById('order-confirmation').classList.remove('hidden');

                // Limpiar carrito
                cart = [];
                localStorage.removeItem('cart');
                updateCartCount();
            } else {
                alert('Hubo un problema al procesar tu pedido. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al crear el pedido:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });

    // Carga inicial
    renderCart();
    updateCartCount();
});
