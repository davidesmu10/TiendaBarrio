document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:8080/api';

    // --- DOM Elements ---
    const productCatalog = document.getElementById('product-catalog');
    const productCatalogIndex = document.getElementById('product-catalog-index');
    const categoryFilters = document.getElementById('category-filters');
    const cartCountSpan = document.getElementById('cart-count');

    // --- Global State ---
    let products = [];

    // --- API Functions ---
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            products = await response.json();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${apiBase_url}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    };

    // --- Render Functions ---
    const renderProducts = (productsToRender, container) => {
        if (!container) return;
        container.innerHTML = '';
        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Agregar al Carrito</button>
                </div>
            `;
            container.appendChild(productCard);
        });
    };

    const renderCategories = (categories) => {
        if (!categoryFilters) return;
        categoryFilters.innerHTML = '<button class="category-btn active" data-category-id="all">Todos</button>';
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.dataset.categoryId = category.id;
            button.textContent = category.name;
            categoryFilters.appendChild(button);
        });
    };
    
    // --- Cart Logic ---
    const updateCartCount = () => {
        if (!cartCountSpan) return;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCountSpan.textContent = totalItems;
            cartCountSpan.style.display = 'flex';
        } else {
            cartCountSpan.style.display = 'none';
        }
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id == productId);
        if (!product) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id == productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, quantity: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(`${product.name} fue agregado al carrito.`);
    };

    // --- UI Notifications ---
    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    };

    // --- Event Listeners ---
    document.addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.productId;
            addToCart(productId);
        }
    });

    if (categoryFilters) {
        categoryFilters.addEventListener('click', e => {
            if (e.target.tagName === 'BUTTON') {
                document.querySelector('.category-btn.active').classList.remove('active');
                e.target.classList.add('active');
                const categoryId = e.target.dataset.categoryId;
                const filteredProducts = categoryId === 'all'
                    ? products
                    : products.filter(p => p.categoryId == categoryId);
                renderProducts(filteredProducts, productCatalog);
            }
        });
    }

    // --- Initialization ---
    const init = async () => {
        await fetchProducts();

        if (productCatalog) { // Product Page
            const categories = await fetchCategories();
            renderCategories(categories);
            renderProducts(products, productCatalog);
        }

        if (productCatalogIndex) { // Index Page
            renderProducts(products.slice(0, 4), productCatalogIndex);
        }
        
        updateCartCount();
    };

    init();
});
