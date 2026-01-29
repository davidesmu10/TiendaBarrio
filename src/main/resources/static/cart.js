document.addEventListener('DOMContentLoaded', () => {
    const cartView = document.getElementById('cart-view');
    const paymentView = document.getElementById('payment-view');
    const confirmationView = document.getElementById('confirmation-view');
    const cartItemsContainer = document.querySelector('.cart-items');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    const checkoutButton = document.getElementById('checkout-button');
    const paymentForm = document.getElementById('payment-form');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-from-cart" data-index="${index}">Eliminar</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                subtotal += item.price;
            });
        }

        const shipping = 5.00;
        const total = subtotal + shipping;
        summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
        localStorage.setItem('cart', JSON.stringify(cart));

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                cartView.style.display = 'none';
                paymentView.style.display = 'block';
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.removeItem('cart');
            paymentView.style.display = 'none';
            confirmationView.style.display = 'block';
        });
    }

    updateCart();
});