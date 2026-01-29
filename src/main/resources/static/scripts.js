document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores de Elementos DOM ---
    const productGrid = document.querySelector('.product-grid:not(#featured-products-container):not(#fresh-products-container)');
    const categoryFilters = document.getElementById('category-filters');
    const cartCountElement = document.getElementById('cart-count');
    const featuredProductsContainer = document.getElementById('featured-products-container');
    const freshProductsContainer = document.getElementById('fresh-products-container');

    let allProducts = [];

    // --- LÓGICA PRINCIPAL DE CARGA Y RENDERIZADO ---

    async function initializeApp() {
        await fetchProductsAndProcess();
        updateCartCount();
    }

    async function fetchProductsAndProcess() {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) {
                throw new Error('La respuesta de la red para productos no fue correcta');
            }
            allProducts = await response.json();

            // Procesar y mostrar en la página correcta
            if (productGrid) { // Estamos en la página de productos
                displayProducts(allProducts, productGrid);
                extractAndDisplayCategories(allProducts); // Extraer categorías aquí
            }

            // Procesar para la página de inicio
            if (featuredProductsContainer) {
                displayProducts(allProducts.slice(0, 4), featuredProductsContainer);
            }
            if (freshProductsContainer) {
                displayProducts(allProducts.slice(4, 8), freshProductsContainer);
            }

        } catch (error) {
            console.error('Error fatal al cargar y procesar productos:', error);
            const container = productGrid || featuredProductsContainer || freshProductsContainer;
            if (container) container.innerHTML = '<p>Error al cargar el contenido. Por favor, inténtelo más tarde.</p>';
        }
    }

    function displayProducts(products, container) {
        if (!container) return;
        container.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.imagenUrl || 'https://via.placeholder.com/250'}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion || 'Descripción no disponible'}</p>
                <div class="product-card-footer">
                    <span class="price">$${product.precio.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Agregar</button>
                </div>
            `;
            container.appendChild(productCard);
        });
        addCartButtonListeners(container);
    }

    // --- LÓGICA DE CATEGORÍAS ---

    function extractAndDisplayCategories(products) {
        if (!categoryFilters) return;

        const categoriesMap = new Map();
        products.forEach(product => {
            if (product.categoria) {
                categoriesMap.set(product.categoria.id, product.categoria);
            }
        });
        const uniqueCategories = Array.from(categoriesMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));

        displayCategoryFilters(uniqueCategories);
    }

    function displayCategoryFilters(categories) {
        categoryFilters.innerHTML = '<button class="active" data-category-id="all">Todas</button>';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.nombre;
            button.dataset.categoryId = category.id;
            categoryFilters.appendChild(button);
        });

        categoryFilters.addEventListener('click', handleCategoryFilterClick);
    }

    function handleCategoryFilterClick(e) {
        if (e.target.tagName !== 'BUTTON') return;

        document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const categoryId = e.target.dataset.categoryId;
        const filteredProducts = (categoryId === 'all')
            ? allProducts
            : allProducts.filter(p => p.categoria && p.categoria.id.toString() === categoryId);

        displayProducts(filteredProducts, productGrid);
    }

    // --- LÓGICA DEL CARRITO ---

    function addCartButtonListeners(container) {
        container.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            });
        });
    }

    function addToCart(productId) {
        const product = allProducts.find(p => p.id.toString() === productId);
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${product.nombre} fue añadido al carrito.`);
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    }

    // --- INICIALIZACIÓN DE LA APP ---
    initializeApp();
});
