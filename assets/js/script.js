const appState = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    products: [],
    total: 0,
    firstName: "",
    lastName: "",
    paymentMethod: ""
};

function initializeApp() {
    loadProducts();
    displayProducts();
    getUserInformation();
}

function loadProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            appState.products = data;
            displayProducts();
        })
        .catch(error => {
            console.error('Error al recuperar productos:', error);
        });
}

function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    appState.products.forEach(product => {
        const li = document.createElement('li');
        li.innerHTML = `${product.title} - $${product.price} <button onclick="addToCart(${product.id})">Agregar al Carrito</button>`;
        productList.appendChild(li);
    });

    updateTotalElement();
}

function getUserInformation() {
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', function (event) {
        event.preventDefault();
        appState.firstName = userForm.elements['firstName'].value;
        appState.lastName = userForm.elements['lastName'].value;
        appState.paymentMethod = userForm.elements['paymentMethod'].value;

        if (appState.firstName && appState.lastName) {
            showMessage(`¡Hola, ${appState.firstName} ${appState.lastName}! Bienvenido a nuestra tienda.`);
            completePurchase();
        } else {
            showMessage('Nombre y apellido son requeridos. Recargue la página para intentar nuevamente.', true);
        }
    });
}

function displayCart() {
    const cartDiv = document.getElementById('cartItems');
    cartDiv.innerHTML = '';

    if (appState.cart.length === 0) {
        cartDiv.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        appState.cart.forEach(item => {
            const p = document.createElement('p');
            p.innerHTML = `${item.name} - Cantidad: ${item.quantity} - Subtotal: $${item.subtotal} <button onclick="removeFromCart(${item.id})">Eliminar</button>`;
            cartDiv.appendChild(p);
        });
    }

    updateTotalElement();
    updateLocalStorage();
}

function addToCart(productId) {
    const productToAdd = appState.products.find(product => product.id === productId);

    if (productToAdd) {
        const existingCartItem = appState.cart.find(item => item.id === productId);

        if (existingCartItem) {
            existingCartItem.quantity++;
            existingCartItem.subtotal = existingCartItem.quantity * productToAdd.price;
        } else {
            const newItem = {
                id: productToAdd.id,
                name: productToAdd.title,
                price: productToAdd.price,
                quantity: 1,
                subtotal: productToAdd.price,
            };
            appState.cart.push(newItem);
        }

        displayCart();
    }
}

function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    displayCart();
}

function updateTotalElement() {
    appState.total = appState.cart.reduce((acc, item) => acc + item.subtotal, 0);
    const totalElement = document.getElementById('total');
    totalElement.textContent = `Total: $${appState.total.toFixed(2)}`;
}

function completePurchase() {
    if (appState.cart.length === 0) {
        showMessage('El carrito está vacío. Agregue productos antes de finalizar la compra.', true);
        return;
    }

    const ticketDiv = document.getElementById('ticket');
    const randomCuit = generateRandomCuit();
    const randomAddress = generateRandomAddress();
    const currentDate = new Date().toLocaleDateString();

    let ticketContent = `¡Compra exitosa, ${appState.firstName} ${appState.lastName}!\n\n`;
    ticketContent += `C.U.I.T. Nro: ${randomCuit}\n\n`;
    ticketContent += `Dirección: ${randomAddress}\n\n`;
    ticketContent += 'IVA RESPONSABLE INSCRIPTO\n\n';
    ticketContent += `Fecha de compra: ${currentDate}\n\n`;

    if (appState.paymentMethod.toLowerCase() === 'tarjeta') {
        const cardNumber = '************' + generateRandomCardNumber();
        ticketContent += `Card: ${cardNumber}\n\n`;
    }

    ticketContent += 'Detalles de la compra:\n';

    appState.cart.forEach(item => {
        ticketContent += `${item.name} - Precio: $${item.price} - Cantidad: ${item.quantity} - Subtotal: $${item.subtotal}\n`;
    });

    ticketContent += `\nTotal: $${appState.total.toFixed(2)}`;

    ticketDiv.textContent = ticketContent;

    const cartItemsDiv = document.getElementById('cartItems');
    cartItemsDiv.style.display = 'none';

    appState.cart = [];
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
    localStorage.setItem('cart', JSON.stringify(appState.cart));
}

function showMessage(message, isError = false) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.style.color = isError ? '#ff5555' : '#4CAF50';

    setTimeout(() => {
        messageBox.textContent = '';
    }, 3000);
}

document.addEventListener('DOMContentLoaded', initializeApp);
