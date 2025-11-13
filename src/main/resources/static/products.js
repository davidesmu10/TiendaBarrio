const products = [
    {
        id: 1,
        name: 'Product 1',
        price: 19.99,
        stock: 'visible',
        image: 'https://via.placeholder.com/200',
        category: 'Category 1',
        rating: 4.5
    },
    {
        id: 2,
        name: 'Product 2',
        price: 29.99,
        stock: 'agotado',
        image: 'https://via.placeholder.com/200',
        category: 'Category 2',
        rating: 3.8
    },
    {
        id: 3,
        name: 'Product 3',
        price: 9.99,
        stock: 'visible',
        image: 'https://via.placeholder.com/200',
        category: 'Category 1',
        rating: 5.0
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
            <button onclick="location.href='product.html?id=${product.id}'">Pedir Ahora</button>
        `;

        productCatalog.appendChild(productCard);
    });
}

displayProducts(products);