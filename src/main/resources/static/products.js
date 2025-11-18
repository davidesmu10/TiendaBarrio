const products = [
    {
        id: 1,
        name: 'Leche Alquería',
        price: 2800,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=1',
        category: 'Lácteos y Huevos',
        rating: 4.5,
        description: 'Bolsa de Leche Entera Alquería de 1 litro.'
    },
    {
        id: 2,
        name: 'Huevos AA',
        price: 6000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=2',
        category: 'Lácteos y Huevos',
        rating: 4.8,
        description: 'Canasta de 30 huevos AA.'
    },
    {
        id: 3,
        name: 'Pan Rollo',
        price: 1500,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=3',
        category: 'Panadería',
        rating: 4.2,
        description: 'Bolsa de 6 panes rollo frescos.'
    },
    {
        id: 4,
        name: 'Queso Campesino',
        price: 7000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=4',
        category: 'Lácteos y Huevos',
        rating: 4.9,
        description: 'Bloque de 500g de queso campesino fresco.'
    },
    {
        id: 5,
        name: 'Salchichón Cervecero',
        price: 9000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=5',
        category: 'Carnes y embutidos',
        rating: 4.6,
        description: 'Salchichón cervecero Zenu de 500g.'
    },
    {
        id: 6,
        name: 'Arroz Diana',
        price: 4500,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=6',
        category: 'Abarrotes',
        rating: 4.7,
        description: 'Bolsa de 1kg de Arroz Diana.'
    },
    {
        id: 7,
        name: 'Frijol Cargamanto',
        price: 5500,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=7',
        category: 'Abarrotes',
        rating: 4.4,
        description: 'Bolsa de 500g de frijol cargamanto.'
    },
    {
        id: 8,
        name: 'Panela',
        price: 3000,
        stock: 'agotado',
        image: 'https://placeimg.com/640/480/any?id=8',
        category: 'Abarrotes',
        rating: 4.1,
        description: 'Bloque de 500g de panela.'
    },
    {
        id: 9,
        name: 'Sal Refisal',
        price: 1200,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=9',
        category: 'Abarrotes',
        rating: 4.9,
        description: 'Bolsa de 500g de sal Refisal.'
    },
    {
        id: 10,
        name: 'Aceite Premier',
        price: 8000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=10',
        category: 'Abarrotes',
        rating: 4.8,
        description: 'Botella de 1 litro de aceite Premier.'
    },
    {
        id: 11,
        name: 'Café Sello Rojo',
        price: 10000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=11',
        category: 'Abarrotes',
        rating: 4.3,
        description: 'Bolsa de 500g de café Sello Rojo molido.'
    },
    {
        id: 12,
        name: 'Galletas Saltín Noel',
        price: 3500,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=12',
        category: 'Abarrotes',
        rating: 4.7,
        description: 'Taco de 3 galletas Saltín Noel.'
    },
    {
        id: 13,
        name: 'Pony Malta',
        price: 2500,
        stock: 'agotado',
        image: 'https://placeimg.com/640/480/any?id=13',
        category: 'Bebidas',
        rating: 4.0,
        description: 'Botella de 330ml de Pony Malta.'
    },
    {
        id: 14,
        name: 'Cerveza Águila',
        price: 3000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=14',
        category: 'Bebidas',
        rating: 4.6,
        description: 'Botella de 330ml de cerveza Águila.'
    },
    {
        id: 15,
        name: 'Agua Cristal',
        price: 2000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=15',
        category: 'Bebidas',
        rating: 4.5,
        description: 'Botella de 600ml de agua Cristal sin gas.'
    },
    {
        id: 16,
        name: 'Plátano Hartón',
        price: 1500,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=16',
        category: 'Frutas y verduras',
        rating: 4.2,
        description: 'Un plátano hartón verde.'
    },
    {
        id: 17,
        name: 'Tomate Chonto',
        price: 2000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=17',
        category: 'Frutas y verduras',
        rating: 4.7,
        description: 'Una libra de tomate chonto.'
    },
    {
        id: 18,
        name: 'Pechuga de Pollo',
        price: 12000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=18',
        category: 'Carnes y embutidos',
        rating: 4.4,
        description: 'Una pechuga de pollo sin piel y sin hueso.'
    },
    {
        id: 19,
        name: 'Carne para Sudar',
        price: 15000,
        stock: 'agotado',
        image: 'https://placeimg.com/640/480/any?id=19',
        category: 'Carnes y embutidos',
        rating: 4.1,
        description: 'Una libra de carne de res para sudar.'
    },
    {
        id: 20,
        name: 'Bocadillo Veleño',
        price: 1000,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=20',
        category: 'Dulces',
        rating: 4.5,
        description: 'Un bocadillo veleño individual.'
    }
];

function displayProducts(productsToDisplay) {
    const productCatalog = document.getElementById('product-catalog');
    productCatalog.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <p>Stock: ${product.stock}</p>
            <button onclick="location.href='product.html?id=${product.id}'">Ver Detalles</button>
        `;

        productCatalog.appendChild(productCard);
    });
}

function getProductById(id) {
    return products.find(product => product.id === id);
}

// Para la página de detalles del producto
if (window.location.pathname.endsWith('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = getProductById(productId);

    if (product) {
        document.getElementById('product-image').src = product.image;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('product-stock').textContent = `Stock: ${product.stock}`;
        document.getElementById('product-category').textContent = `Categoría: ${product.category}`;
        document.getElementById('product-rating').textContent = `Rating: ${product.rating}`;
    }
} else {
    displayProducts(products);
}
