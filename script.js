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

    // Inicializamos el carrito desde localStorage o como un array vacío
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- 1. OBTENER Y MOSTRAR PRODUCTOS (FETCH API) ---
    async function fetchProducts() {
        try {
            // Usamos la API de "Fake Store" como ejemplo.
            const response = await fetch('https://fakestoreapi.com/products');
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error al cargar los productos:', error);
            productContainer.innerHTML = '<p>No se pudieron cargar los productos. Intenta de nuevo más tarde.</p>';
        }
    }

    function displayProducts(products) {
        productContainer.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            // SEO y Accesibilidad: Usamos alt en las imágenes
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">Agregar al Carrito</button>
            `;
            productContainer.appendChild(productCard);
        });
    }

    // --- 2. LÓGICA DEL CARRITO DE COMPRAS ---

    // Evento para agregar productos al carrito
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
    
    // Actualiza localStorage y la UI del carrito
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    // Actualiza la interfaz del carrito (contador, modal, total)
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

    // Evento para eliminar productos del carrito
    cartItemsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('remove-from-cart')) {
            const productId = e.target.dataset.id;
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }
    });

    // Vaciar todo el carrito
    clearCartButton.addEventListener('click', () => {
        cart = [];
        updateCart();
    });
    
    // --- 3. MANEJO DEL MODAL DEL CARRITO ---
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

    // --- 4. VALIDACIÓN DEL FORMULARIO DE CONTACTO ---
    contactForm.addEventListener('submit', function(e) {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const formMessage = document.getElementById('form-message');

        if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
            e.preventDefault(); // Detiene el envío del formulario
            formMessage.textContent = 'Todos los campos son obligatorios.';
            formMessage.style.color = 'red';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            e.preventDefault(); // Detiene el envío
            formMessage.textContent = 'Por favor, introduce un correo electrónico válido.';
            formMessage.style.color = 'red';
            return;
        }
        
        // Si todo es válido, el formulario se enviará a Formspree
        formMessage.textContent = '¡Gracias por tu mensaje! Enviando...';
        formMessage.style.color = 'green';
    });

    // --- CARGA INICIAL ---
    fetchProducts();
    updateCartUI();
});