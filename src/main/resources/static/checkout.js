document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');

    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real application, you would integrate with a payment gateway like Stripe or PayPal.
            // For this example, we'll simulate a successful payment.
            alert('Payment successful!');
            
            // Generate and download the invoice
            generateInvoice();

            // Clear the cart
            localStorage.removeItem('cart');

            // Redirect to a confirmation page
            window.location.href = 'confirmation.html';
        });
    }
});

function generateInvoice() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    doc.text('Invoice - Tienda de Barrio', 20, 20);
    let y = 40;

    cart.forEach(item => {
        doc.text(`${item.name} - $${item.price.toFixed(2)}`, 20, y);
        total += item.price;
        y += 10;
    });

    doc.text(`Total: $${total.toFixed(2)}`, 20, y + 10);
    doc.save('invoice.pdf');
}