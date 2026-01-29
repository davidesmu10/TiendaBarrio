document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores de Elementos DOM ---
    const productGrid = document.querySelector('.product-grid');
    const categoryFilters = document.getElementById('category-filters');
    const cartCountElement = document.getElementById('cart-count');
    const featuredProductsContainer = document.getElementById('featured-products-container');
    const freshProductsContainer = document.getElementById('fresh-products-container');

    let allProducts = [];

    // --- LÓGICA DE CARGA Y RENDERIZADO ---

    // 1. Cargar todos los productos desde la API
    async function fetchProductsAndCategories() {
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

            // ¡NUEVA LÓGICA! Extraer categorías de los productos cargados
            if (categoryFilters) {
                extractAndDisplayCategories(allProducts);
            }

        } catch (error) {
            console.error('Hubo un problema al cargar los productos:', error);
            if(productGrid) productGrid.innerHTML = '<p>No se pudieron cargar los productos. Inténtalo más tarde.</p>';
        }
    }

    // 2. Extraer y mostrar categorías a partir de la lista de productos
    function extractAndDisplayCategories(products) {
        // Usamos un Map para asegurar que cada categoría sea única por su ID
        const categoriesMap = new Map();
        products.forEach(product => {
            if (product.category) { // Asegurarse de que el producto tiene categoría
                categoriesMap.set(product.category.id, product.category);
            }
        });
        const uniqueCategories = Array.from(categoriesMap.values());
        
        displayCategories(uniqueCategories);
    }

    // 3. Mostrar los productos en un contenedor
    function displayProducts(products, container) {
        if (!container) return; // Si el contenedor no existe en la página, no hacer nada
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
                const productId = e.target.dataset.productId;
                addToCart(productId);
            });
        });
    }

    // 4. Mostrar los botones de filtro de categoría
    function displayCategories(categories) {
        if (!categoryFilters) return;
        categoryFilters.innerHTML = '<button class="active" data-category-id="all">Todas</button>';
        
        // Ordenar categorías alfabéticamente por nombre
        categories.sort((a, b) => a.name.localeCompare(b.name));

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
                    : allProducts.filter(p => p.category && p.category.id.toString() === categoryId);
                
                displayProducts(filteredProducts, productGrid);
            }
        });
    }

    // --- LÓGICA DEL CARRITO ---

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
    fetchProductsAndCategories(); // Única llamada para cargar todo
    updateCartCount();
});
