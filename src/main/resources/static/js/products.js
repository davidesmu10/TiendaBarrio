document.addEventListener('DOMContentLoaded', async () => {
    const productCatalog = document.getElementById('product-catalog');
    const productCatalogIndex = document.getElementById('product-catalog-index');
    let products = [];

    try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        products = await response.json();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
        const errorMsg = "<p>No se pudieron cargar los productos. Inténtalo de nuevo más tarde.</p>";
        if (productCatalog) productCatalog.innerHTML = errorMsg;
        if (productCatalogIndex) productCatalogIndex.innerHTML = errorMsg;
        return;
    }

    // Función para mostrar productos en un contenedor específico
    const displayProducts = (container, productsToDisplay) => {
        if (!container) return;
        container.innerHTML = '';
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image || 'https://placehold.co/600x400?text=Producto'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toLocaleString('es-CO')}</p>
                <button class="btn" onclick='addToCart(${JSON.stringify(product)})'>Añadir al Carrito</button>
            `;
            container.appendChild(productCard);
        });
    };

    // Mostrar todos los productos en la página de productos
    displayProducts(productCatalog, products);

    // Mostrar solo los primeros 4 en la página de inicio
    displayProducts(productCatalogIndex, products.slice(0, 4));
});