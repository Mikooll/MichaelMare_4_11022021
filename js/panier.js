var getItems = sessionStorage.getItem("cartItems");
var items = document.querySelector(".items");
var formSubmit = document.querySelector('.form__contact');
var errorCart = document.querySelector('.errorCart');
var totalPrice = 0;

cartItems = JSON.parse(sessionStorage.getItem('cartItems'));

var confirmationItems = [];

setItems();

/**
 * Fonction permettant de récupérer le contenu du panier mis en session
 */
function setItems() {
    console.log(getItems);
    var html = "";
     totalPrice = 0;

    if (sessionStorage.getItem("cartItems") != null) {
        for (let itm in cartItems) {
            var price = cartItems[itm].price * cartItems[itm].quantity / 100;
            // Affichage du prix total des différents produits ajoutés au panier
            totalPrice += price;
            console.log(totalPrice);
            console.log(price);
            // Mise en forme de la page
            html += "<li class='cart'><p class='cart__name'>" + cartItems[itm].name 
                + " avec lentille : " + cartItems[itm].lenseChoice + " </p><p class='cart__quantity'> Quantité : </p><p><span class='addItem item" 
                + itm + "'> + </span>" + cartItems[itm].quantity + "<span class='removeItem item" 
                + itm + "'> - </span></p><p class='cart__price'>Prix : " + price + "€</li>"
        }
        // Création du bouton de suppression du contenu du panier
        html += "<p class='clearCart' onclick='clearCart()'>\
        <a href='./panier.html'>Vider le panier</a>\
        </p><p class='total-price'>Prix Total = " + totalPrice + "€";
    } else {
        html = "<p> Votre panier est vide</p>"
    }

    items.innerHTML = html;
    var addItem = document.querySelectorAll('.addItem');
    var removeItem = document.querySelectorAll('.removeItem');

    // Ajout d'un évènement au clic sur le bouton +
    // et appelle la fonction d'ajout d'un item
    for (var i = 0; i < addItem.length; i++) {
        addItem[i].addEventListener("click", function (e) {
            addMoreItem(e, items);
        })
    }

    // Ajout d'un évènement au clic sur le bouton -
    // et appelle la fonction de suppression d'un item
    for (var i = 0; i < removeItem.length; i++) {
        removeItem[i].addEventListener("click", function(e) {
            removeAnItem(e, items)
        })
    }

    // Ajout d'un évènement de submit du formulaire
    // et appel de la fonction d'envoi du formulaire
    formSubmit.addEventListener('submit', function(e) {
        e.preventDefault();
        sendForm();
    })
}

// Vide tout le contenu de la session
function clearCart() {
    sessionStorage.clear();
}

/** 
 * Requete POST
 * envoie les données de contact et d'id
 * renvoie vers "confirmation"
 */ 
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
            // Mise en session des données de contact
            // de l'id
            // et du prix total
            sessionStorage.setItem('contact', JSON.stringify(result.contact));
            sessionStorage.setItem('orderId', JSON.stringify(result.orderId));
            sessionStorage.setItem('totalPrice', JSON.stringify(totalPrice));

            // Renvoie vers la page de confirmation
            window.location.replace("./confirmation.html");
        })
}

/**
 * Fonction d'envoi du contenu du formulaire
 * et des différentes données de produit
 */
function sendForm() {
    var contact = {
        firstName: document.querySelector(".firstname").value,
        lastName: document.querySelector(".lastname").value,
        address: document.querySelector(".adress").value,
        city: document.querySelector(".city").value,
        email: document.querySelector(".email").value
    }

    // Renvoie l'id de la commande
    var products = [];
    if (getItems != null) {
        var product = JSON.parse(getItems);
        for (let itm in product) {
            products.push(product[itm]._id);
        }
    };

    // Stringification des 2 données
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

/**
 * Function d'ajout d'un item
 * @param {object} e - contentenu de l'évènement
 * @param {string} items - contenu de la liste
 */
function addMoreItem(e, items) {
    // On supprime le contenu de la liste pour la réécrire à l'appel de setItems
    items.innerText = "";

    // On récupère le numéro de l'item dans la class
    var index = e.target.classList[1].slice(-1);

    // et on ajoute +1 à la quantité du produit
    cartItems[index].quantity++;

    // On l'enregistre ensuite en session
    sessionStorage.setItem("cartItems", JSON.stringify(items));

    // Appel de la fonction d'affichage du contenu du panier
    setItems();
}

/**
 * Fonction de suppression d'un item
 * @param {object} e 
 * @param {string} items 
 */
function removeAnItem(e, items) {
    // On supprime le contenu de la liste pour la réécrire à l'appel de setItems
    items.innerText = "";
    // On récupère le numéro de l'item dans la class
    var index = e.target.classList[1].slice(-1);

    // et on enleve 1 à la quantité du produit
    cartItems[index].quantity--;

    // Si l'un des item est inférieur à 0 on le supprime
    if(cartItems[index].quantity <= 0){
        cartItems.splice(index, 1);
        // Si le panier est vide, on vide la session
        if(cartItems.length == 0) {
            sessionStorage.clear();
        } else {
            // Sinon on enregistre la modifification en session
            sessionStorage.setItem("cartItems", JSON.stringify(items));
        }
    } else {
        // Sinon on enregistre la modifification en session
        sessionStorage.setItem("cartItems", JSON.stringify(items));
    }
    // Appel de la fonction d'affichage du contenu du panier
    setItems();
}