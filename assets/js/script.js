let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products;
let total = 0;
let firstName, lastName, paymentMethod;

function initializeApp() {
    loadProducts();
    displayProducts();
    getUserInformation();
}

function loadProducts() {
    products = [
        { "id": 1, "name": "Yerba Playadito", "price": 1500 },
        { "id": 2, "name": "Pepitos", "price": 850 },
        { "id": 3, "name": "Champagne", "price": 3000 }
    ];
}

function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.name} - $${product.price} <button onclick="addToCart(${product.id})">Agregar al Carrito</button>`;
        productList.appendChild(li);
    });

    updateTotal();
}

function getUserInformation() {
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', function (event) {
        event.preventDefault();
        firstName = userForm.elements['firstName'].value;
        lastName = userForm.elements['lastName'].value;
        paymentMethod = userForm.elements['paymentMethod'].value;

        if (firstName && lastName) {
            alert(`¡Hola, ${firstName} ${lastName}! Bienvenido a nuestra tienda.`);
            completePurchase();
        } else {
            alert('Nombre y apellido son requeridos. Recargue la página para intentar nuevamente.');
        }
    });
}

function displayCart() {
    const cartDiv = document.getElementById('cartItems');
    cartDiv.innerHTML = '';

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            const p = document.createElement('p');
            p.innerHTML = `${item.name} - Cantidad: ${item.quantity} - Subtotal: $${item.subtotal} <button onclick="removeFromCart(${item.id})">Eliminar</button>`;
            cartDiv.appendChild(p);
        });
    }

    updateTotal();
    updateLocalStorage();
}

function addToCart(productId) {
    const productToAdd = products.find(product => product.id === productId);

    if (productToAdd) {
        const existingCartItem = cart.find(item => item.id === productId);

        if (existingCartItem) {
            existingCartItem.quantity++;
            existingCartItem.subtotal = existingCartItem.quantity * productToAdd.price;
        } else {
            const newItem = {
                id: productToAdd.id,
                name: productToAdd.name,
                price: productToAdd.price,
                quantity: 1,
                subtotal: productToAdd.price,
            };
            cart.push(newItem);
        }

        displayCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    displayCart();
}

function updateTotal() {
    total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const totalElement = document.getElementById('total');
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

function completePurchase() {
    if (cart.length === 0) {
        alert('El carrito está vacío. Agregue productos antes de finalizar la compra.');
        return;
    }

    const ticketDiv = document.getElementById('ticket');
    const randomCuit = generateRandomCuit();
    const randomAddress = generateRandomAddress();
    const currentDate = new Date().toLocaleDateString();

    let ticketContent = `¡Compra exitosa, ${firstName} ${lastName}!\n\n`;
    ticketContent += `C.U.I.T. Nro: ${randomCuit}\n\n`;
    ticketContent += `Dirección: ${randomAddress}\n\n`;
    ticketContent += 'IVA RESPONSABLE INSCRIPTO\n\n';
    ticketContent += `Fecha de compra: ${currentDate}\n\n`;

    if (paymentMethod.toLowerCase() === 'tarjeta') {
        const cardNumber = '************' + generateRandomCardNumber();
        ticketContent += `Card: ${cardNumber}\n\n`;
    }

    ticketContent += 'Detalles de la compra:\n';

    cart.forEach(item => {
        ticketContent += `${item.name} - Precio: $${item.price} - Cantidad: ${item.quantity} - Subtotal: $${item.subtotal}\n`;
    });

    ticketContent += `\nTotal: $${total.toFixed(2)}`;

    ticketDiv.textContent = ticketContent;

    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.style.display = 'none';

    cart = [];
    displayCart();
}

function generateRandomCuit() {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    const randomDigit = Math.floor(Math.random() * 10);
    const cuit = String(randomNumber);
    return `${cuit.substr(0, 2)}-${cuit.substr(2, 6)}-${cuit.substr(8)}${randomDigit}`;
}

function generateRandomAddress() {
    const randomNumbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 1000));
    return `${randomNumbers[0]}, ${randomNumbers[1]}, ${randomNumbers[2]}`;
}

function generateRandomCardNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}

function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', initializeApp);