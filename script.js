document.addEventListener('DOMContentLoaded', () => {
    // Selectores del DOM
    const productContainer = document.getElementById('product-container');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartIcon = document.querySelector('.cart-icon');
    const closeButton = document.querySelector('.close-button');
    const clearCartButton = document.getElementById('clear-cart');
    const contactForm = document.getElementById('contact-form');
    const checkoutButton = document.getElementById('checkout-cart'); 


    // carrito desde localStorage 
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Lista productos ---
    const productos3D = [
        {
            id: 1,
            title: 'Lámpara de Planta',
            price: 45000,
            image: 'img/lampara1.jpg'
        },
        {
            id: 2,
            title: 'Lámpara de Bonsai',
            price: 45000,
            image: 'img/lampara2.jpg'
        },
        {
            id: 3,
            title: 'Lámpara tekai',
            price: 45000,
            image: 'img/lampara3.jpg'
        },
        {
            id: 4,
            title: 'Lámpara Giroide',
            price: 45000.00,
            image: 'img/lampara4.jpg'
        },
        {
            id: 5,
            title: 'Lámpara Rondin',
            price: 40000,
            image: 'img/lampara5.jpg'
        },
        {
            id: 6,
            title: 'Lámpara de Luna',
            price: 48000,
            image: 'img/lampara6.jpg'
        },
        {
            id: 7,
            title: 'Lámpara Pipa',
            price: 43000,
            image: 'img/lampara7.jpg'
        },
        {
            id: 8,
            title: 'Lámpara Aruba',
            price: 40000,
            image: 'img/lampara8.jpg'
        },
        {
            id: 9,
            title: 'Lámpara Lab',
            price: 45000,
            image: 'img/lampara9.jpg'
        },
        {
            id: 10,
            title: 'Lámpara Costal',
            price: 35000,
            image: 'img/lampara10.jpg'
        },
        {
            id: 11,
            title: 'Lámpara Viv',
            price: 37000.00,
            image: 'img/lampara11.jpg'
        }
    ];

    // ---MOSTRAR PRODUCTOS ---
    function displayProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">Agregar al Carrito</button>
            `;
            productContainer.appendChild(productCard);
        });
    }

    // --- LÓGICA DEL CARRITO DE COMPRAS ---
    productContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productData = e.target.dataset;
            addToCart(productData);
        }
    });

    function addToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ id: product.id, title: product.title, price: parseFloat(product.price), quantity: 1 });
        }
        updateCart();
    }
    
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <span>${item.title} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
            totalItems += item.quantity;
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = totalItems;
    }

    cartItemsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('remove-from-cart')) {
            const productId = e.target.dataset.id;
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }
    });

    clearCartButton.addEventListener('click', () => {
        cart = [];
        updateCart();
    });
    
    // --- MANEJO DEL MODAL DEL CARRITO ---
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    closeButton.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // --- FORMULARIO DE CONTACTO ---
    contactForm.addEventListener('submit', function(e) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const formMessage = document.getElementById('form-message');

        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            e.preventDefault();
            formMessage.textContent = 'Todos los campos son obligatorios.';
            formMessage.style.color = 'red';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault();
            formMessage.textContent = 'Por favor, introduce un correo electrónico válido.';
            formMessage.style.color = 'red';
            return;
        }
        
        formMessage.textContent = '¡Gracias por tu mensaje! Enviando...';
        formMessage.style.color = 'green';
    });

    // --- FINALIZAR COMPRA ---
checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío. ¡Añade algunos productos antes de finalizar la compra!");
        return;
    }

    // Mensaje de éxito
    alert("¡Gracias por tu compra! ");

    // Vaciar el carrito y cerrar el modal
    cart = [];
    updateCart();
    cartModal.style.display = 'none';
});

    // --- CARGA INICIAL ---
    displayProducts(productos3D); // Mostramos nuestros productos locales
    updateCartUI(); // Actualizamos la UI del carrito por si había algo guardado
});