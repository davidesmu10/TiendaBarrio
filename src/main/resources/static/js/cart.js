document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const cartCountEl = document.getElementById('cart-count');
    const checkoutForm = document.getElementById('checkout-form');
    const shippingCost = 3000; // Costo de envío fijo

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            if(document.getElementById('cart-summary')) document.getElementById('cart-summary').style.display = 'none';
            if(document.getElementById('checkout-form-container')) document.getElementById('checkout-form-container').style.display = 'none';
            return;
        }
        if(document.getElementById('cart-summary')) document.getElementById('cart-summary').style.display = 'block';
        if(document.getElementById('checkout-form-container')) document.getElementById('checkout-form-container').style.display = 'block';

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Precio: $${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-change" data-id="${item.id}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-change" data-id="${item.id}" data-change="1">+</button>
                </div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        updateTotals();
    }

    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal > 0 ? subtotal + shippingCost : 0;

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        if(document.getElementById('shipping')){
            document.getElementById('shipping').textContent = subtotal > 30000 ? 'Gratis' : `$${shippingCost.toFixed(2)}`;
        }

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
        updateTotals();
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCartAndRerender();
        alert(`${product.name} ha sido añadido al carrito.`);
    }

    if(cartItemsContainer){
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
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if(confirm('¿Desea aprobar la compra?')){
                alert('Compra aprobada');
                 // Simulate a successful order
                 localStorage.removeItem('cart');
                 window.location.href = 'confirmation.html';

            }else{
                alert('Compra cancelada');
            }
        });
    }

    // Event listener for add to cart buttons on product page
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productId = productCard.dataset.productId;
            // We need to get the full product details from the products.js data
            // This requires a way to access that data here.
            // For now, I'll assume a global `products` variable is available, which is not ideal.
            // A better approach would be to fetch from an API or have the data in a shared module.
            fetch('/products.js') // A bit of a hack to get the products array
                .then(response => response.text())
                .then(text => {
                    // This is tricky because it's not JSON, it's JS code.
                    // A better solution is needed here, but for now we can try to extract the array.
                    const productsArrayStr = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
                    const products = eval(productsArrayStr);
                    const product = products.find(p => p.id == productId);
                    if (product) {
                        addToCart(product);
                    }
                });
        });
    });


    // Initial Load
    renderCart();
    updateCartCount();
});