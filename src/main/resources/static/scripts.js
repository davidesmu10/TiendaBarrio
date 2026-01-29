document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.getElementById('cart-count');
    const productGrid = document.querySelector('.product-grid');
    const categoryFilters = document.getElementById('category-filters');
    const featuredProductsContainer = document.getElementById('featured-products-container');
    const freshProductsContainer = document.getElementById('fresh-products-container');

    let allProducts = [];

    // --- Cargar y mostrar productos y categorías ---
    async function fetchProducts() {
        try {
            // Usar la ruta correcta de la API
            const response = await fetch('/api/productos');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const products = await response.json();
            allProducts = products;

            // Cargar productos en la página de "Productos"
            if (productGrid) {
                displayProducts(allProducts, productGrid);
            }
            // Cargar productos en la página de "Inicio"
            if (featuredProductsContainer) {
                displayProducts(products.slice(0, 4), featuredProductsContainer);
            }
            if (freshProductsContainer) {
                displayProducts(products.slice(4, 8), freshProductsContainer);
            }

        } catch (error) {
            console.error("Error al cargar los productos:", error);
            if (productGrid) productGrid.innerHTML = '<p>No se pudieron cargar los productos. Inténtalo de nuevo más tarde.</p>';
        }
    }

    async function fetchCategories() {
        // Solo ejecutar si estamos en la página de productos
        if (!categoryFilters) return;
        try {
            // Usar la ruta correcta de la API
            const response = await fetch('/api/categorias');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const categories = await response.json();
            displayCategories(categories);
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
        }
    }

    function displayProducts(products, container) {
        if (!container) return;
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

        // Añadir listeners a los botones "Agregar al Carrito"
        container.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const productToAdd = allProducts.find(p => p.id.toString() === productId);
                if (productToAdd) {
                    addToCart(productToAdd);
                }
            });
        });
    }

    function displayCategories(categories) {
        categoryFilters.innerHTML = '<button class="active" data-category-id="all">Todas</button>';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.setAttribute('data-category-id', category.id);
            categoryFilters.appendChild(button);
        });

        // Manejar clics en los filtros de categoría
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const categoryId = e.target.getAttribute('data-category-id');
                document.querySelectorAll('#category-filters button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                const filteredProducts = categoryId === 'all'
                    ? allProducts
                    : allProducts.filter(p => p.category.id.toString() === categoryId);
                
                displayProducts(filteredProducts, productGrid);
            }
        });
    }

    // --- Lógica del Carrito (compatible con cart.js) ---
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === product.id);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${product.name} ha sido añadido al carrito.`);
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

    // --- Inicialización ---
    fetchProducts();
    fetchCategories();
    updateCartCount();
});
