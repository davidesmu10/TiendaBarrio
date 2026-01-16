document.addEventListener('DOMContentLoaded', () => {
    const state = {
        products: [],
        categories: [],
        cart: JSON.parse(localStorage.getItem('tiendaBarrioCart')) || [],
        shippingCost: 5000,
        freeShippingThreshold: 50000,
    };

    // --- ELEMENTOS DEL DOM ---
    const productCatalog = document.getElementById('product-catalog');
    const productCatalogIndex = document.getElementById('product-catalog-index');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const cartCount = document.getElementById('cart-count');
    const cartPage = document.querySelector('.cart-page');

    // --- INICIALIZACIÓN ---
    const init = async () => {
        await fetchProducts();
        updateCartCount();

        const path = window.location.pathname;
        if (path.endsWith('products.html')) {
            renderCategories();
            renderProducts(productCatalog, state.products);
        }
        if (path.includes('index.html') || path === '/') {
            renderProducts(productCatalogIndex, state.products.slice(0, 4));
        }
        if (path.endsWith('cart.html')) {
            renderCartPage();
        }

        document.body.addEventListener('click', handleDelegatedEvents);
    };

    // --- LÓGICA DE DATOS ---
    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const productsData = await response.json();
            state.products = productsData;
            const categories = ['Todos', ...new Set(productsData.map(p => p.categoria.nombre).filter(Boolean))];
            state.categories = categories;
        } catch (error) {
            console.error("Error fetching products:", error);
            const errorMsg = '<p class="error-msg">No se pudieron cargar los productos. Inténtelo más tarde.</p>';
            if (productCatalog) productCatalog.innerHTML = errorMsg;
            if (productCatalogIndex) productCatalogIndex.innerHTML = errorMsg;
        }
    };

    const saveCart = () => {
        localStorage.setItem('tiendaBarrioCart', JSON.stringify(state.cart));
        updateCartCount();
        if (window.location.pathname.endsWith('cart.html')) {
            renderCartPage();
        }
    };

    // --- RENDERIZADO ---
    const formatPrice = (price) => {
        // Asumiendo que precios como 1.2 o 7.0 vienen de la API y deben ser 1.200 o 7.000
        const finalPrice = price * 1000;
        return finalPrice.toLocaleString('es-CO');
    }

    const renderProducts = (container, products) => {
        if (!container) return;
        container.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.categoria.nombre}">
                <div class="product-image-container">
                     <img src="${product.imagenUrl || 'https://placehold.co/600x400/F0F2EF/386641?text=Producto'}" alt="${product.nombre}">
                </div>
                <div class="product-info">
                    <h3>${product.nombre || 'Nombre no disponible'}</h3>
                    <p class="price">$${formatPrice(product.precio || 0)}</p>
                    <button class="btn btn-primary" data-action="add-to-cart" data-product-id="${product.id}">Añadir al Carrito</button>
                </div>
            </div>
        `).join('');
    };

    const renderCategories = () => {
        if (!categoryFiltersContainer) return;
        categoryFiltersContainer.innerHTML = state.categories.map(category =>
            `<button class="category-btn ${category === 'Todos' ? 'active' : ''}" data-action="filter-category" data-category="${category}">${category}</button>`
        ).join('');
    };

    const renderCartPage = () => {
        if (!cartPage) return;
        if (state.cart.length === 0) {
            cartPage.innerHTML = `<div class="empty-cart"><h3>Tu carrito está vacío</h3><p>Los productos que añadas aparecerán aquí.</p><a href="products.html" class="btn btn-primary">Explorar Productos</a></div>`;
            return;
        }

        const subtotal = state.cart.reduce((sum, item) => sum + (item.precio * 1000) * item.quantity, 0);
        const shipping = subtotal >= state.freeShippingThreshold ? 0 : state.shippingCost;
        const total = subtotal + shipping;

        cartPage.innerHTML = `
            <div class="cart-items-list">
                ${state.cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.imagenUrl || 'https://placehold.co/100x100/F0F2EF/386641?text=Producto'}" alt="${item.nombre}">
                        <div class="item-details">
                            <h4>${item.nombre}</h4>
                            <p class="price">$${formatPrice(item.precio || 0)}</p>
                            <p class="subtotal">Subtotal: $${formatPrice((item.precio || 0) * item.quantity)}</p>
                        </div>
                        <div class="item-quantity">
                            <button class="quantity-btn" data-action="decrease-quantity" data-item-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase-quantity" data-item-id="${item.id}">+</button>
                        </div>
                        <button class="remove-btn" data-action="remove-item" data-item-id="${item.id}">&times;</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <h3>Resumen de Compra</h3>
                <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toLocaleString('es-CO')}</span></div>
                <div class="summary-row"><span>Envío</span><span>${shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`}</span></div>
                <div class="summary-row total"><span>Total</span><span>$${total.toLocaleString('es-CO')}</span></div>
                <button class="btn btn-primary btn-block" data-action="checkout">Continuar al Pago</button>
            </div>
        `;
    };

    const renderCheckoutPage = () => {
        if (!cartPage) return;
        document.querySelector('.cart-items-list, .cart-summary').forEach(el => el.style.display = 'none');
        
        const checkoutContainer = document.createElement('div');
        checkoutContainer.className = 'checkout-container';
        const subtotal = state.cart.reduce((sum, item) => sum + (item.precio * 1000) * item.quantity, 0);
        const shipping = subtotal >= state.freeShippingThreshold ? 0 : state.shippingCost;
        const total = subtotal + shipping;

        checkoutContainer.innerHTML = `
            <div class="checkout-header"><button class="back-btn" data-action="back-to-cart">&larr; Volver al carrito</button><h3>Finalizar Compra</h3></div>
            <div class="checkout-content">
                <div class="checkout-form"><h4>Información de Envío</h4><form id="shipping-form"><div class="form-group"><label for="name">Nombre Completo</label><input type="text" id="name" required></div><div class="form-group"><label for="address">Dirección</label><input type="text" id="address" required></div><div class="form-group"><label for="city">Ciudad</label><input type="text" id="city" value="Támesis, Antioquia" required></div><h4>Método de Pago</h4><p>El pago se realiza contra entrega. Nos pondremos en contacto para coordinar.</p><button type="submit" class="btn btn-primary btn-block" data-action="confirm-order">Confirmar Pedido</button></form></div>
                <div class="checkout-summary"><h4>Resumen del Pedido</h4>${state.cart.map(item => `<div class="summary-item"><span>${item.nombre} (x${item.quantity})</span><span>$${formatPrice((item.precio || 0) * item.quantity)}</span></div>`).join('')}<hr><div class="summary-row"><span>Subtotal</span><span>$${subtotal.toLocaleString('es-CO')}</span></div><div class="summary-row"><span>Envío</span><span>${shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`}</span></div><div class="summary-row total"><span>Total</span><span>$${total.toLocaleString('es-CO')}</span></div></div>
            </div>`;
        cartPage.appendChild(checkoutContainer);
    };

    // --- MANEJO DE EVENTOS ---
    const handleDelegatedEvents = (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const { action, productId, itemId, category } = target.dataset;

        switch (action) {
            case 'add-to-cart': addToCart(productId); break;
            case 'increase-quantity': updateQuantity(itemId, 1); break;
            case 'decrease-quantity': updateQuantity(itemId, -1); break;
            case 'remove-item': removeFromCart(itemId); break;
            case 'checkout': renderCheckoutPage(); break;
            case 'back-to-cart': 
                document.querySelector('.checkout-container').remove();
                document.querySelectorAll('.cart-items-list, .cart-summary').forEach(el => el.style.display = 'block');
                break;
            case 'confirm-order': e.preventDefault(); handleOrderConfirmation(); break;
            case 'filter-category':
                document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
                filterProductsByCategory(category);
                break;
        }
    };

    // --- ACCIONES ---
    const addToCart = (productId) => {
        const product = state.products.find(p => p.id == productId);
        if (!product) return;
        const cartItem = state.cart.find(item => item.id == productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            const { id, nombre, precio, imagenUrl } = product;
            state.cart.push({ id, nombre, precio, imagenUrl, quantity: 1 });
        }
        showNotification(`${product.nombre} añadido al carrito.`);
        saveCart();
    };

    const updateQuantity = (itemId, change) => {
        const cartItem = state.cart.find(item => item.id == itemId);
        if (!cartItem) return;
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            state.cart = state.cart.filter(item => item.id != itemId);
        }
        saveCart();
    };

    const removeFromCart = (itemId) => {
        const item = state.cart.find(item => item.id == itemId);
        state.cart = state.cart.filter(i => i.id != itemId);
        if(item) showNotification(`${item.nombre} eliminado del carrito.`, 'error');
        saveCart();
    };

    const handleOrderConfirmation = () => {
        const form = document.getElementById('shipping-form');
        if (form.checkValidity()) {
            cartPage.innerHTML = `<div class="order-confirmation"><h3>¡Gracias por tu compra!</h3><p>Hemos recibido tu pedido y nos pondremos en contacto contigo en breve para coordinar la entrega.</p><a href="index.html" class="btn btn-primary">Volver al Inicio</a></div>`;
            state.cart = [];
            saveCart();
        } else {
            form.reportValidity();
        }
    };

    const filterProductsByCategory = (category) => {
        const productCards = document.querySelectorAll('#product-catalog .product-card');
        productCards.forEach(card => {
            card.style.display = (category === 'Todos' || card.dataset.category === category) ? 'flex' : 'none';
        });
    };

    const updateCartCount = () => {
        if (!cartCount) return;
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    };

    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 500);
            }, 3000);
        }, 10);
    };

    init();
});