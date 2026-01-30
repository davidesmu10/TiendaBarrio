document.addEventListener('DOMContentLoaded', () => {
    // Obtener todos los elementos necesarios del DOM
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary'); // <<< ¡ELEMENTO CLAVE QUE FALTABA!
    const cartCountElement = document.getElementById('cart-count');

    // Cargar el carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        // Actualizar el contador de ítems en el header
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }

        // Solo ejecutar la lógica de la página del carrito si estamos en ella
        if (cartItemsContainer) {
            if (cart.length === 0) {
                // Si el carrito está vacío, mostrar mensaje y ocultar el resumen
                if (emptyCartMessage) emptyCartMessage.style.display = 'block';
                if (cartItemsContainer) cartItemsContainer.style.display = 'none';
                if (cartSummary) cartSummary.style.display = 'none'; // <<< LÓGICA CORREGIDA
            } else {
                // Si hay items, ocultar mensaje y mostrar el resumen y los productos
                if (emptyCartMessage) emptyCartMessage.style.display = 'none';
                if (cartItemsContainer) cartItemsContainer.style.display = 'grid';
                if (cartSummary) cartSummary.style.display = 'block'; // <<< LÓGICA CORREGIDA
                
                cartItemsContainer.innerHTML = ''; // Limpiar antes de renderizar

                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    // Usar la imagen correcta guardada en el carrito
                    itemElement.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h3>${item.name}</h3>
                        </div>
                        <div class="item-quantity">
                            <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                        </div>
                        <p class="item-subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
                        <button class="remove-btn" data-id="${item.id}" title="Eliminar producto">&#10006;</button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                });

                // Calcular y mostrar el total
                const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                if (cartTotalElement) {
                    cartTotalElement.textContent = `$${total.toFixed(2)}`;
                }

                // Añadir listeners a los botones de cantidad y eliminar
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
                // Si la cantidad llega a 0, eliminar el producto
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
