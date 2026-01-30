document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSummary = document.getElementById('cart-summary');
    const cartCountElement = document.getElementById('cart-count');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }

        if (!cartItemsContainer) return; // Salir si no estamos en la página del carrito

        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.style.display = 'block';
            if (cartItemsContainer) cartItemsContainer.style.display = 'none';
            if (cartSummary) cartSummary.style.display = 'none';
        } else {
            if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            if (cartItemsContainer) cartItemsContainer.style.display = 'grid';
            if (cartSummary) cartSummary.style.display = 'block';

            cartItemsContainer.innerHTML = '';

            cart.forEach(item => {
                // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
                // Usamos los nombres de propiedad en inglés (name, price, image) que ahora guarda scripts.js
                // Añadimos una defensa (||) por si aún quedan items viejos en el localStorage.
                const itemName = item.name || item.nombre; // Lee 'name', si no existe, lee 'nombre'
                const itemPrice = item.price || item.precio; // Lee 'price', si no existe, lee 'precio'
                const itemImage = item.image || item.imagenUrl || 'https://placehold.co/100'; // Lee 'image', y así sucesivamente

                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${itemImage}" alt="${itemName}">
                    <div class="item-details">
                        <h3>${itemName}</h3>
                    </div>
                    <div class="item-quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-change="1">+</button>
                    </div>
                    <p class="item-subtotal">$${(itemPrice * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn" data-id="${item.id}" title="Eliminar producto">&#10006;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            const total = cart.reduce((sum, item) => {
                const itemPrice = item.price || item.precio; // Asegurarse de usar el precio correcto también en el total
                return sum + itemPrice * item.quantity;
            }, 0);
            
            if (cartTotalElement) {
                cartTotalElement.textContent = `$${total.toFixed(2)}`;
            }

            addEventListeners();
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

    renderCart();
});
