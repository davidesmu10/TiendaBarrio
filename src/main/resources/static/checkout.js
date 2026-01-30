document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const cartCountElement = document.getElementById('cart-count');

    // Actualizar el contador del carrito en el header
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir el envío real del formulario

        // Aquí se podría añadir una lógica para procesar el pago real con una pasarela
        // Por ahora, simulamos que el proceso fue exitoso.

        // 1. Guardar la información del pedido (opcional, para un futuro historial)
        const formData = new FormData(checkoutForm);
        const orderDetails = {
            customer: {
                name: formData.get('name'),
                address: formData.get('address'),
                city: formData.get('city'),
                zip: formData.get('zip'),
            },
            paymentMethod: formData.get('payment-method'),
            items: JSON.parse(localStorage.getItem('cart'))
        };
        console.log("Pedido realizado:", orderDetails);

        // 2. Limpiar el carrito
        localStorage.removeItem('cart');

        // 3. Redirigir a la página de agradecimiento
        window.location.href = 'thank-you.html';
    });

    // Cargar el contador al iniciar la página
    updateCartCount();
});
