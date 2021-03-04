var getItems = sessionStorage.getItem("cartItems");
var items = document.querySelector(".items");
var formSubmit = document.querySelector('.form__contact');
var errorCart = document.querySelector('.errorCart');
var totalPrice = 0;

cartItems = JSON.parse(sessionStorage.getItem('cartItems'));

var confirmationItems = [];

setItems();

function setItems() {
    console.log(getItems);
    var html = "";
     totalPrice = 0;

    if (sessionStorage.getItem("cartItems") != null) {
        for (let itm in cartItems) {
            var price = cartItems[itm].price * cartItems[itm].quantity / 100;
            totalPrice += price;
            console.log(totalPrice);
            console.log(price);
            html += "<li class='cart'><p class='cart__name'>" + cartItems[itm].name + " avec lentille : " + cartItems[itm].lenseChoice + " </p><p class='cart__quantity'> Quantité : </p><p><span class='addItem item" + itm + "'> + </span>" + cartItems[itm].quantity + "<span class='removeItem item" + itm + "'> - </span></p><p class='cart__price'>Prix : " + price + "€</li>"

        }

        html += "<p class='clearCart' onclick='clearCart()'>\
        <a href='./panier.html'>Vider le panier</a>\
        </p><p class='total-price'>Prix Total = " + totalPrice + "€";
    } else {
        html = "<p> Votre panier est vide</p>"
    }

    items.innerHTML = html;
    var addItem = document.querySelectorAll('.addItem');
    var removeItem = document.querySelectorAll('.removeItem');

    for (var i = 0; i < addItem.length; i++) {
        addItem[i].addEventListener("click", function (e) {
            addMoreItem(e, items);
        })
    }

    for (var i = 0; i < removeItem.length; i++) {
        removeItem[i].addEventListener("click", function(e) {
            removeAnItem(e, items)
        })
    }

    formSubmit.addEventListener('submit', function(e) {
        e.preventDefault();
        sendForm();
    })
}

function clearCart() {
    sessionStorage.clear();
}

// Requete POST
// envoie les données de contact et d'id
// renvoie vers "confirmation"
function postOrder(datas) {
    console.log(datas)
    fetch("http://localhost:3000/api/cameras/order", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: datas
        })
        .then(response => {
            return response.json();
        })
        .then(result => {
            console.log(result)
            sessionStorage.setItem('contact', JSON.stringify(result.contact));
            sessionStorage.setItem('orderId', JSON.stringify(result.orderId));
            sessionStorage.setItem('totalPrice', JSON.stringify(totalPrice));
            window.location.replace("./confirmation.html");
        })
}

function sendForm() {
    var contact = {
        firstName: document.querySelector(".firstname").value,
        lastName: document.querySelector(".lastname").value,
        address: document.querySelector(".adress").value,
        city: document.querySelector(".city").value,
        email: document.querySelector(".email").value
    }

    var products = [];
    if (getItems != null) {
        var product = JSON.parse(getItems);
        for (let itm in product) {
            products.push(product[itm]._id);
        }
    };

    var contactDatas = JSON.stringify({
        contact,
        products
    });

    if (getItems != null) {
        postOrder(contactDatas);
    } else {
        errorCart.innerHTML = "Votre panier est vide vous ne pouvez pas confirmer votre achat.";
        errorCart.style.display = "block";
        setTimeout(() => {
            errorCart.style.display = "none";
        }, 2000);
    }
}

function addMoreItem(e, items) {
    items.innerText = "";
    var index = e.target.classList[1].slice(-1);
    cartItems[index].quantity++;
    sessionStorage.setItem("cartItems", JSON.stringify(items))

    var number = JSON.parse(sessionStorage.getItem("cartItems"));
    for (var j = 0; j < number.length; j++) {
        number += number[j].quantity;
    }
    setItems();
}

function removeAnItem(e, items) {
    items.innerText = "";
    var index = e.target.classList[1].slice(-1);
    cartItems[index].quantity--;

    if(cartItems[index].quantity <= 0){
        cartItems.splice(index, 1);
        if(cartItems.length == 0) {
            sessionStorage.clear();
        } else {
            sessionStorage.setItem("cartItems", JSON.stringify(items));
        }
    } else {
        sessionStorage.setItem("cartItems", JSON.stringify(items));
    }
    setItems();
}