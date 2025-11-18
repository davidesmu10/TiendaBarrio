const products = [
    {
        id: 1,
        name: 'Laptop Gamer Pro',
        price: 1299.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=1',
        category: 'Electrónica',
        rating: 4.8,
        description: 'Potente laptop para gaming con procesador de última generación y tarjeta gráfica dedicada.'
    },
    {
        id: 2,
        name: 'Smartphone X',
        price: 799.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=2',
        category: 'Electrónica',
        rating: 4.5,
        description: 'El último smartphone con una cámara increíble y una pantalla OLED vibrante.'
    },
    {
        id: 3,
        name: 'Audífonos Inalámbricos',
        price: 149.99,
        stock: 'agotado',
        image: 'https://placeimg.com/640/480/tech?id=3',
        category: 'Accesorios',
        rating: 4.2,
        description: 'Audífonos con cancelación de ruido y una batería de larga duración.'
    },
    {
        id: 4,
        name: 'Teclado Mecánico RGB',
        price: 89.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=4',
        category: 'Accesorios',
        rating: 4.9,
        description: 'Teclado mecánico con interruptores personalizables y retroiluminación RGB.'
    },
    {
        id: 5,
        name: 'Monitor Curvo 27"',
        price: 349.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=5',
        category: 'Electrónica',
        rating: 4.6,
        description: 'Monitor curvo para una experiencia de visualización inmersiva.'
    },
    {
        id: 6,
        name: 'Silla Ergonómica de Oficina',
        price: 249.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/arch?id=6',
        category: 'Muebles',
        rating: 4.7,
        description: 'Silla de oficina ergonómica para mantener una buena postura durante todo el día.'
    },
    {
        id: 7,
        name: 'Mochila para Laptop',
        price: 49.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=7',
        category: 'Accesorios',
        rating: 4.4,
        description: 'Mochila resistente al agua con compartimentos para todos tus dispositivos.'
    },
    {
        id: 8,
        name: 'Cafetera de Goteo Programable',
        price: 59.99,
        stock: 'agotado',
        image: 'https://placeimg.com/640/480/any?id=8',
        category: 'Hogar',
        rating: 4.1,
        description: 'Prepara tu café antes de despertar con esta cafetera programable.'
    },
    {
        id: 9,
        name: 'Libro de Ciencia Ficción',
        price: 15.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=9',
        category: 'Libros',
        rating: 4.9,
        description: 'La última novela de tu autor de ciencia ficción favorito.'
    },
    {
        id: 10,
        name: 'Juego de Mesa Estratégico',
        price: 39.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=10',
        category: 'Juegos',
        rating: 4.8,
        description: 'Un juego de mesa que pondrá a prueba tu pensamiento estratégico.'
    },
    {
        id: 11,
        name: 'Cámara de Seguridad Inteligente',
        price: 129.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=11',
        category: 'Seguridad',
        rating: 4.3,
        description: 'Vigila tu hogar desde cualquier lugar con esta cámara de seguridad inteligente.'
    },
    {
        id: 12,
        name: 'Robot Aspirador',
        price: 299.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=12',
        category: 'Hogar',
        rating: 4.7,
        description: 'Mantén tus suelos limpios sin esfuerzo con este robot aspirador.'
    },
    {
        id: 13,
        name: 'Botella de Agua Inteligente',
        price: 29.99,
        stock: 'agotado',
        image: 'https://placeimg.com/640/480/any?id=13',
        category: 'Deportes',
        rating: 4.0,
        description: 'Esta botella de agua te recuerda cuándo es el momento de hidratarte.'
    },
    {
        id: 14,
        name: 'Set de Mancuernas Ajustables',
        price: 199.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=14',
        category: 'Deportes',
        rating: 4.6,
        description: 'Ahorra espacio con este set de mancuernas ajustables.'
    },
    {
        id: 15,
        name: 'Licuadora de Alta Potencia',
        price: 89.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/any?id=15',
        category: 'Hogar',
        rating: 4.5,
        description: 'Prepara batidos y sopas en segundos con esta licuadora de alta potencia.'
    },
    {
        id: 16,
        name: 'Proyector Portátil',
        price: 179.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=16',
        category: 'Electrónica',
        rating: 4.2,
        description: 'Convierte cualquier habitación en un cine en casa con este proyector portátil.'
    },
    {
        id: 17,
        name: 'Altavoz Bluetooth Resistente al Agua',
        price: 49.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=17',
        category: 'Accesorios',
        rating: 4.7,
        description: 'Lleva tu música a todas partes con este altavoz Bluetooth resistente al agua.'
    },
    {
        id: 18,
        name: 'Tableta Gráfica para Dibujo',
        price: 99.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=18',
        category: 'Accesorios',
        rating: 4.4,
        description: 'Da rienda suelta a tu creatividad con esta tableta gráfica para dibujo.'
    },
    {
        id: 19,
        name: 'Cargador Inalámbrico Rápido',
        price: 39.99,
        stock: 'agotado',
        image: 'https://placeimg.com/640/480/tech?id=19',
        category: 'Accesorios',
        rating: 4.1,
        description: 'Carga tus dispositivos compatibles de forma rápida y sin cables.'
    },
    {
        id: 20,
        name: 'Auriculares de Diadema con Micrófono',
        price: 79.99,
        stock: 'visible',
        image: 'https://placeimg.com/640/480/tech?id=20',
        category: 'Accesorios',
        rating: 4.5,
        description: 'Ideales para reuniones en línea y para escuchar música con una calidad de sonido superior.'
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
