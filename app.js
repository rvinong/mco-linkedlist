class Node {
    constructor(data) {
        this.data = data;
        this.next = null; 
    }
}

class LinkedList {
    constructor() {
        this.head = null; 
        this.tail = null; 
    }

    add(data) {
        const newNode = new Node(data);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
}

let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let productList = new LinkedList(); 
let cart = new LinkedList(); 


const productsData = [
    { "id": 1, "name": "CPE ID LACE V1", "price": 75, "image": "image/1.png" },
    { "id": 2, "name": "ICPEP ORG SHIRT", "price": 450, "image": "image/2.png" },
    { "id": 3, "name": "ICPEP ORG SHIRT", "price": 450, "image": "image/3.png" },
    { "id": 4, "name": "CPE ID LACE V2", "price": 75, "image": "image/4.png" },
    { "id": 5, "name": "CPE STICKERS", "price": 150, "image": "image/5.png" },
    { "id": 6, "name": "ICPEP ORG SHIRT", "price": 450, "image": "image/6.png" },
    { "id": 7, "name": "CPE T-SHIRT", "price": 250, "image": "image/7.png" },
    { "id": 8, "name": "ICPEP TOTE BAGS", "price": 150, "image": "image/8.png" }

];


productsData.forEach(product => productList.add(product));


const initApp = () => {

    addDataToHTML();

    
    if (localStorage.getItem('cart')) {
        const cartData = JSON.parse(localStorage.getItem('cart'));
        cartData.forEach(item => cart.add(item));
        addToCartHTML();
    }
};


iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});


closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});


const addDataToHTML = () => {

    listProductHTML.innerHTML = '';

    
    const products = productList.toArray();
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">₱${product.price}</div>
            <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};


listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});


const addToCart = (product_id) => {
    let positionThisProductInCart = cart.toArray().findIndex((item) => item.product_id == product_id);
    if (positionThisProductInCart < 0) {
        cart.add({
            product_id: product_id,
            quantity: 1
        });
    } else {
        let cartItem = cart.toArray()[positionThisProductInCart];
        cartItem.quantity += 1;
    }
    addToCartHTML();
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart.toArray())); 
};


const calculateTotal = () => {
    const cartItems = cart.toArray();
    let total = 0;
    cartItems.forEach(item => {
        const product = productList.toArray().find(p => p.id == item.product_id);
        if (product) {
            total += product.price * item.quantity;
        }
    });
    return total;
};

const addToCartHTML = () => {
    listCartHTML.innerHTML = ''; 
    const cartItems = cart.toArray();
    cartItems.forEach(item => {
        const product = productList.toArray().find(p => p.id == item.product_id);
        if (product) {
            let cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">₱${product.price}</div>
                <div class="quantity">Quantity: ${item.quantity}</div>
                <button class="increase">+</button>
                <button class="decrease">-</button>
                <button class="remove">Remove</button>
            `;
            listCartHTML.appendChild(cartItem);

            cartItem.querySelector('.increase').addEventListener('click', () => {
                addToCart(product.id);
            });

            cartItem.querySelector('.decrease').addEventListener('click', () => {
                decreaseQuantity(product.id);
            });

            cartItem.querySelector('.remove').addEventListener('click', () => {
                removeFromCart(product.id);
            });
        }
    });

    // Calculate and display the total
    const totalAmount = calculateTotal();
    let totalDiv = document.createElement('div');
    totalDiv.classList.add('total');
    totalDiv.innerHTML = `<h2>Total: ₱${totalAmount}</h2>`;
    listCartHTML.appendChild(totalDiv);
};


const decreaseQuantity = (product_id) => {
    let positionThisProductInCart = cart.toArray().findIndex((item) => item.product_id == product_id);
    if (positionThisProductInCart >= 0) {
        let cartItem = cart.toArray()[positionThisProductInCart];
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            removeFromCart(product_id);
        }
        addToCartHTML();
        updateCartCount();
        localStorage.setItem('cart', JSON.stringify(cart.toArray()));
    }
};


const removeFromCart = (product_id) => {
    let current = cart.head;
    let previous = null;
    while (current) {
        if (current.data.product_id == product_id) {
            if (previous) {
                previous.next = current.next;
            } else {
                cart.head = current.next;
            }
            if (current === cart.tail) {
                cart.tail = previous;
            }
            break;
        }
        previous = current;
        current = current.next;
    }
    addToCartHTML();
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart.toArray()));
};


const updateCartCount = () => {
    iconCartSpan.innerText = cart.toArray().reduce((total, item) => total + item.quantity, 0);
};

initApp();