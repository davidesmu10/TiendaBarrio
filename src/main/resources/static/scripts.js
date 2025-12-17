document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const categoryContainer = document.getElementById('category-container');
    const searchInput = document.getElementById('search-input');
    let allProducts = [];

    // Función para renderizar productos en la cuadrícula
    const renderProducts = (products) => {
        productGrid.innerHTML = ''; // Limpiar la cuadrícula
        if (products.length === 0) {
            productGrid.innerHTML = '<p>No se encontraron productos.</p>';
            return;
        }
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.imagenUrl || 'https://source.unsplash.com/300x300/?food'}" alt="${product.nombre}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.nombre}</h3>
                    <span class="product-category">${product.categoria ? product.categoria.nombre : 'Sin categoría'}</span>
                    <p>${product.descripcion || 'Descripción no disponible.'}</p>
                    <div class="product-footer">
                        <span class="product-price">$${product.precio.toFixed(2)}</span>
                        <button class="add-to-cart-btn" data-id="${product.id}">Agregar</button>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    };

    // Función para obtener y mostrar categorías
    const renderCategories = (products) => {
        const categories = [...new Set(products.map(p => p.categoria.nombre))];
        categoryContainer.innerHTML = '<div class="category-chip active" data-category="all">Todos</div>';
        categories.forEach(category => {
            const chip = document.createElement('div');
            chip.className = 'category-chip';
            chip.textContent = category;
            chip.dataset.category = category;
            categoryContainer.appendChild(chip);
        });
    };

    // Cargar productos desde la API
    fetch('/api/productos')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            allProducts = products;
            renderProducts(allProducts);
            renderCategories(allProducts);
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
            productGrid.innerHTML = '<p class="error-message">Error al cargar los productos. Por favor, intenta de nuevo más tarde.</p>';
        });

    // Manejar filtros de categoría
    categoryContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-chip')) {
            document.querySelectorAll('.category-chip').forEach(chip => chip.classList.remove('active'));
            e.target.classList.add('active');

            const selectedCategory = e.target.dataset.category;
            const filteredProducts = selectedCategory === 'all' 
                ? allProducts 
                : allProducts.filter(p => p.categoria.nombre === selectedCategory);
            
            renderProducts(filteredProducts);
        }
    });
    
    // Manejar búsqueda
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = allProducts.filter(p => 
            p.nombre.toLowerCase().includes(searchTerm) ||
            p.descripcion.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
        // Reset category filter when searching
        document.querySelectorAll('.category-chip').forEach(chip => chip.classList.remove('active'));
        document.querySelector('.category-chip[data-category="all"]').classList.add('active');
    });

});
