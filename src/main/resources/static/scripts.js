document.addEventListener('DOMContentLoaded', () => {
    const state = {
        products: [],
        cart: JSON.parse(localStorage.getItem('tiendaBarrioCart')) || [],
    };

    const productCatalog = document.getElementById('product-catalog');
    const productCatalogIndex = document.getElementById('product-catalog-index');
    const cartCount = document.getElementById('cart-count');

    const init = async () => {
        await fetchProducts();
        updateCartCount();

        const path = window.location.pathname;
        if (path.endsWith('products.html')) {
            renderProducts(productCatalog, state.products);
        }
        if (path.includes('index.html') || path === '/') {
            renderProducts(productCatalogIndex, state.products.slice(0, 4));
        }

        document.body.addEventListener('click', handleDelegatedEvents);
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            state.products = await response.json();
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
    };

    const renderProducts = (container, products) => {
        if (!container) return;
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image-container">
                     <img src="${product.imagenUrl || 'https://placehold.co/600x400/F0F2EF/386641?text=Producto'}" alt="${product.nombre}">
                </div>
                <div class="product-info">
                    <h3>${product.nombre || 'Nombre no disponible'}</h3>
                    <p class="price">$${(product.precio || 0).toFixed(2)}</p>
                    <button class="btn btn-primary" data-action="add-to-cart" data-product-id="${product.id}">Añadir al Carrito</button>
                </div>
            </div>
        `).join('');
    };

    const handleDelegatedEvents = (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const { action, productId } = target.dataset;

        if (action === 'add-to-cart') {
            addToCart(productId);
        }
    };

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

    const updateCartCount = () => {
        if (!cartCount) return;
        const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    };

    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'notification show';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    };

    init();
});