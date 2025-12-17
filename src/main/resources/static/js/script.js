document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartCountEl = document.getElementById('cart-count');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountEl) {
            cartCountEl.textContent = totalItems;
        }
    }

    async function fetchProducts() {
        try {
            const response = await fetch('/api/productos');
            const products = await response.json();

            if (productList) {
                productList.innerHTML = '';
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <img src="${product.imagenUrl || '/images/default.jpg'}" alt="${product.nombre}">
                        <h3>${product.nombre}</h3>
                        <p>${product.descripcion}</p>
                        <p class="price">$${product.precio.toFixed(2)}</p>
                        <button class="btn add-to-cart" data-id="${product.id}" data-nombre="${product.nombre}" data-precio="${product.precio}" data-imagen-url="${product.imagenUrl || '/images/default.jpg'}">Añadir al Carrito</button>
                    `;
                    productList.appendChild(productCard);
                });
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            if (productList) {
                productList.innerHTML = '<p>No se pudieron cargar los productos.</p>';
            }
        }
    }

    function addToCart(product) {
        const existingItem = cart.find(item => item.id == product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        // Efecto visual rápido
        const cartIcon = document.querySelector('.cart-icon');
        if(cartIcon) {
            cartIcon.classList.add('shake');
            setTimeout(() => cartIcon.classList.remove('shake'), 500);
        }
    }

    if (productList) {
        productList.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productData = {
                    id: e.target.dataset.id,
                    nombre: e.target.dataset.nombre,
                    precio: parseFloat(e.target.dataset.precio),
                    imagenUrl: e.target.dataset.imagenUrl
                };
                addToCart(productData);
            }
        });
    }

    // Carga inicial
    fetchProducts();
    updateCartCount();
});
