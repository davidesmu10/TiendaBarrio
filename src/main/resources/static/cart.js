document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        // Actualizar el contador del header en todas las páginas
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }

        // Lógica específica para la página del carrito
        if (cartItemsContainer) {
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                cartItemsContainer.style.display = 'none';
                cartTotalElement.parentElement.style.display = 'none';
            } else {
                emptyCartMessage.style.display = 'none';
                cartItemsContainer.style.display = 'block';
                cartItemsContainer.innerHTML = ''; // Limpiar antes de renderizar

                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <img src="${item.imagenUrl || 'https://via.placeholder.com/100'}" alt="${item.nombre}">
                        <div class="item-details">
                            <h3>${item.nombre}</h3>
                            <p>Precio: $${item.precio.toFixed(2)}</p>
                        </div>
                        <div class="item-quantity">
                            <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                        </div>
                        <div class="item-subtotal">
                            <p>$${(item.precio * item.quantity).toFixed(2)}</p>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">Eliminar</button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                });

                // Calcular y mostrar el total
                const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
                cartTotalElement.textContent = `$${total.toFixed(2)}`;
                cartTotalElement.parentElement.style.display = 'block';

                // Añadir listeners a los botones
                addEventListeners();
            }
        }
    }

    function addEventListeners() {
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }

    function handleQuantityChange(e) {
        const productId = e.target.dataset.id;
        const change = parseInt(e.target.dataset.change, 10);

        const item = cart.find(i => i.id.toString() === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.id.toString() !== productId);
            }
        }
        updateCartAndRender();
    }

    function handleRemoveItem(e) {
        const productId = e.target.dataset.id;
        cart = cart.filter(i => i.id.toString() !== productId);
        updateCartAndRender();
    }

    function updateCartAndRender() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // Renderizar el carrito al cargar la página
    renderCart();
});
