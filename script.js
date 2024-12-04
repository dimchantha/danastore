let cart = [];


let currentSlide = 0;
const slides = document.querySelectorAll('.slider-item');
const totalSlides = slides.length;

// Function to move to the next or previous slide
function moveSlide(step) {
    currentSlide += step;

    // Ensure the slide index is within bounds
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;  // Go to the last slide if at the start
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;  // Go to the first slide if at the end
    }

    updateSlidePosition();
}

// Function to update the slide's position
function updateSlidePosition() {
    const sliderContainer = document.getElementById('slider-container');
    const offset = -currentSlide * 100;  // Move the slider by 100% for each slide
    sliderContainer.style.transform = `translateX(${offset}%)`;  // Apply the translation
}

// Auto-change slide every 5 seconds
setInterval(() => {
    moveSlide(1);  // Automatically move to the next slide
}, 5000);  // Change slide every 5 seconds (5000ms)


// On page load, load the cart from localStorage and update the cart preview
window.onload = function() {
    loadCart();        // Load cart data from localStorage
    updateCartPreview(); // Update the cart preview
};

// Load cart data from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart); // Load cart data
    }
}

// Save the cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
}

// Add product to the cart
function addToCart(productId, productName, price) {
    const productIndex = cart.findIndex(item => item.productId === productId);

    if (productIndex !== -1) {
        // If the product is already in the cart, increase its quantity
        cart[productIndex].quantity += 1;
    } else {
        // Otherwise, add it to the cart
        cart.push({ productId, productName, price, quantity: 1 });
    }

    saveCart();        // Save updated cart to localStorage
    updateCartPreview(); // Update the cart preview
}

// Update the cart preview (display in sidebar)
function updateCartPreview() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';  // Clear current items
    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        itemCount += item.quantity;

        // Create list item for each product in the cart
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <img src="image/${item.productId}.png" alt="${item.productName}" style="width: 50px; height: 50px;">
                <span>${item.productName} - $${item.price} x ${item.quantity}</span>
                <button onclick="removeFromCart(${item.productId})">Remove</button>
                <input type="number" value="${item.quantity}" min="1" onchange="changeQuantity(${item.productId}, this.value)">
            </div>
        `;
        cartItemsContainer.appendChild(li);
    });

    // Update the total price and item count
    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
    document.getElementById('cart-count').textContent = itemCount;
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId); // Remove item
    saveCart();        // Save updated cart to localStorage
    updateCartPreview(); // Update the cart preview
}

// Change item quantity in cart
function changeQuantity(productId, newQuantity) {
    const product = cart.find(item => item.productId === productId);
    if (product && newQuantity > 0) {
        product.quantity = parseInt(newQuantity); // Update quantity
        saveCart();        // Save updated cart to localStorage
        updateCartPreview(); // Update the cart preview
    }
}

// Toggle cart sidebar visibility
function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.style.right = cartContainer.style.right === '0px' ? '-300px' : '0px';
}

// Show checkout form
function checkout() {
    document.getElementById('checkout-container').style.display = 'block';
}

// Process the payment and complete the purchase
function processPayment() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('payment-method').value;

    if (!name || !address || !paymentMethod) {
        alert("Please fill in all the required fields.");
        return;
    }

    alert(`Payment successful! \nName: ${name} \nAddress: ${address} \nPayment Method: ${paymentMethod}`);
    
    // Clear the cart after payment
    cart = [];
    saveCart();  // Save empty cart to localStorage
    updateCartPreview(); // Update the cart preview
    toggleCart(); // Close the cart sidebar
}

// Toggle the visibility of the cart sidebar
function toggleCart() {
    const cartContainer = document.getElementById('cart-container');
    const isVisible = cartContainer.style.right === '0px';
    cartContainer.style.right = isVisible ? '-300px' : '0px';
}

// Checkout
function checkout() {
    const checkoutContainer = document.getElementById('checkout-container');
    checkoutContainer.style.display = 'block';

    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    checkoutSubtotal.textContent = subtotal.toFixed(2);
    checkoutTotal.textContent = (subtotal + 2).toFixed(2);  // Add shipping fee
}

// Process payment (mock function)
function processPayment() {
    alert('Payment Successful!');
    cart = [];  // Clear cart
    saveCart();  // Save empty cart
    updateCartPreview(); // Update cart preview

    // Show confirmation modal
    document.getElementById('confirmation-modal').style.display = 'flex';
}

// Close confirmation modal
function closeModal() {
    document.getElementById('confirmation-modal').style.display = 'none';
}
