document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores de Elementos DOM ---
    const productGrid = document.querySelector('.product-grid');
    const categoryFilters = document.getElementById('category-filters');
    const cartCountElement = document.getElementById('cart-count');
    const featuredProductsContainer = document.getElementById('featured-products-container');
    const freshProductsContainer = document.getElementById('fresh-products-container');

    let allProducts = [];

    // --- CARGA DE DATOS (Estilo Original) ---

    // 1. Cargar todos los productos desde la API
    async function fetchProducts() {
        try {
            const response = await fetch('/api/productos');
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            allProducts = await response.json();
            
            // Decide qué productos mostrar y dónde
            if (productGrid && !featuredProductsContainer) { // Solo en la página de productos
                displayProducts(allProducts, productGrid);
            }
            if (featuredProductsContainer) { // Solo en la página de inicio
                displayProducts(allProducts.slice(0, 4), featuredProductsContainer);
            }
            if (freshProductsContainer) { // Solo en la página de inicio
                displayProducts(allProducts.slice(4, 8), freshProductsContainer);
            }
        } catch (error) {
            console.error('Hubo un problema al cargar los productos:', error);
            if(productGrid) productGrid.innerHTML = '<p>No se pudieron cargar los productos. Inténtalo más tarde.</p>';
        }
    }

    // 2. Cargar todas las categorías desde la API
    async function fetchCategories() {
        if (!categoryFilters) return; // Solo se ejecuta en la página de productos
        try {
            const response = await fetch('/api/categorias');
            if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            const categories = await response.json();
            displayCategories(categories);
        } catch (error) {
            console.error('Hubo un problema al cargar las categorías:', error);
        }
    }

    // --- RENDERIZADO Y FILTRADO ---

    // 3. Mostrar los productos en un contenedor
    function displayProducts(products, container) {
        container.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.imageUrl || 'https://via.placeholder.com/300'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-card-footer">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Agregar al Carrito</button>
                </div>
            `;
            container.appendChild(productCard);
        });

        // Añadir listeners a los botones "Agregar al Carrito" recién creados
        container.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            });
        });
    }

    // 4. Mostrar los botones de filtro de categoría
    function displayCategories(categories) {
        categoryFilters.innerHTML = '<button class="active" data-category-id="all">Todas</button>';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.dataset.categoryId = category.id;
            categoryFilters.appendChild(button);
        });

        // Configurar el listener para los filtros
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                const categoryId = e.target.dataset.categoryId;
                const filteredProducts = categoryId === 'all'
                    ? allProducts
                    : allProducts.filter(p => p.category.id.toString() === categoryId);
                
                displayProducts(filteredProducts, productGrid);
            }
        });
    }

    // --- LÓGICA DEL CARRITO (Conservada) ---

    function addToCart(productId) {
        const productToAdd = allProducts.find(p => p.id.toString() === productId);
        if (!productToAdd) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === productToAdd.id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ ...productToAdd, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${productToAdd.name} fue añadido al carrito.`);
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

    // --- INICIALIZACIÓN ---
    fetchProducts();
    fetchCategories();
    updateCartCount();
});
