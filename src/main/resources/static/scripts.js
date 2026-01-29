document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores de Elementos DOM ---
    const productGrid = document.querySelector('.product-grid:not(#featured-products-container):not(#fresh-products-container)');
    const categoryFilters = document.getElementById('category-filters');
    const cartCountElement = document.getElementById('cart-count');
    const featuredProductsContainer = document.getElementById('featured-products-container');
    const freshProductsContainer = document.getElementById('fresh-products-container');

    let allProducts = [];

    // --- LÓGICA DE CARGA Y RENDERIZADO (VERSIÓN ESTABLE RESTAURADA) ---

    // 1. Cargar todos los productos desde la API
    async function fetchProducts() {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) throw new Error('La respuesta de la red para productos no fue correcta');
            allProducts = await response.json();

            // Lógica para mostrar productos según la página actual
            if (productGrid) { // Página de productos
                displayProducts(allProducts, productGrid);
            }
            if (featuredProductsContainer) { // Página de inicio
                displayProducts(allProducts.slice(0, 4), featuredProductsContainer);
            }
            if (freshProductsContainer) { // Página de inicio
                displayProducts(allProducts.slice(4, 8), freshProductsContainer);
            }
        } catch (error) {
            console.error('Hubo un problema al cargar los productos:', error);
            const container = productGrid || featuredProductsContainer || freshProductsContainer;
            if (container) container.innerHTML = '<p>Error al cargar los productos. Inténtelo más tarde.</p>';
        }
    }

    // 2. Cargar las categorías desde la API (Método Original)
    async function fetchCategories() {
        if (!categoryFilters) return; // Solo se ejecuta si los filtros existen en la página
        try {
            const response = await fetch('/api/categorias');
            if (!response.ok) throw new Error('La respuesta de la red para categorías no fue correcta');
            const categories = await response.json();
            displayCategoryFilters(categories);
        } catch (error) {
            console.error('Hubo un problema al cargar las categorías:', error);
        }
    }

    // 3. Mostrar los productos en un contenedor específico
    function displayProducts(products, container) {
        if (!container) return;
        container.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            // Se usa el nombre de la propiedad correcto "nombre" y "precio"
            productCard.innerHTML = `
                <img src="${product.imagenUrl || 'https://via.placeholder.com/300'}" alt="${product.nombre}">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <div class="product-card-footer">
                    <span class="price">$${product.precio.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Agregar al Carrito</button>
                </div>
            `;
            container.appendChild(productCard);
        });

        // Añadir listeners a los botones del carrito
        addCartButtonListeners(container);
    }

    // 4. Mostrar los filtros de categoría y asignarles eventos
    function displayCategoryFilters(categories) {
        categoryFilters.innerHTML = '<button class="active" data-category-id="all">Todas</button>';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.nombre;
            button.dataset.categoryId = category.id;
            categoryFilters.appendChild(button);
        });

        categoryFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const categoryId = e.target.dataset.categoryId;
                const filtered = categoryId === 'all'
                    ? allProducts
                    : allProducts.filter(p => p.categoria && p.categoria.id.toString() === categoryId);
                
                displayProducts(filtered, productGrid);
            }
        });
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

    // --- INICIALIZACIÓN DE LA APLICACIÓN ---
    function init() {
        fetchProducts();
        fetchCategories();
        updateCartCount();
    }

    init();
});
