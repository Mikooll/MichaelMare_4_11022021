const queryString = window.location.search;
const idProducts = queryString.split('?');

/**
 * Requete pour récupérer le produit avec l'id
 */
fetch("http://localhost:3000/api/cameras/" + idProducts[1])
    .then(result => result.json())
    .then(datas => {
        var container = document.querySelector(".container")

        // Création de la vue du produit sélectionné
        var html = "<div class='product__card'>\
        <div class='product__view'><h2>" + datas.name + " </h2>\
        <img class='product__img' src=" + datas.imageUrl + "></img></div>\
        <div class='product__desc'>\
        <p><b>Prix</b> : <span class='product__desc__price'>" + datas.price/100 + "€</span></p>\
        <p class='product__desc__text'> <b>Description</b> : <br>" + datas.description + "</p>\
        <label for='select_lense'><b>Choisissez votre lentille</b> : </label>\
        <select class='lenses' name='lenses' id='select__color'>\
        </select><br>\
        <button class='addToCart'>\
        <b>Ajouter au panier</b><i class='fas fa-cart-arrow-down'></i></button>\
        <p class='confirm__text'></p>\
        </div></div><br>";

        container.innerHTML = html;

        var selectOptions = document.querySelector('.lenses');
        var lenses = "";

        // Loop pour afficher les différentes lentilles spécifiques au produit dans un select
        for (var i = 0; i < datas.lenses.length; i++) {
            lenses += "<option value='" + datas.lenses[i] + "'>" + datas.lenses[i] + "</option>";
            selectOptions.innerHTML = lenses;
        }

        var selectLense = document.querySelector('.lenses');
        var add = document.querySelector(".addToCart");
        var confirm = document.querySelector(".confirm__text");

        // Ajout d'un évènement au click sur le bouton ajouter au panier
        add.addEventListener("click", () => {
            datas.lenseChoice = selectLense.value;
            // Envoie des données au panier
            addToCart(datas);
            confirm.innerHTML = "Le produit a bien été ajouté au panier";

            // Annule le contenu du paragraphe au bout de 3s
            setTimeout(function() {
                confirm.innerHTML= ""
            }, 3000)
        })
    })

/**
 * Permet d'envoyer l'item ajouté au panier à la session
 * pour le récupérer dans la page panier ensuite
 * @param {object} item - objet contenant les caractéristiques du produit
 */
function addToCart(item) {
    // Récupération du contenu de la session
    var cartStorage = sessionStorage.getItem("cartItems");
    let cartItems = [];

    // Création d'un objet cart
    var cart = {
        _id: item._id,
        imageUrl: item.imageUrl,
        name: item.name,
        price: item.price,
        quantity: 1,
        lenseChoice: item.lenseChoice
    }
    // Initialisation d'un booleen définissant si le produit est nouveau ou s'il existe déjà
    var createNewItem = true;

    console.log(sessionStorage.getItem("cartItems"))
    // Création d'une nouvelle session si elle n'existe pas encore
    if (cartStorage === null) {
        createNewItem = false;
        cartItems.push(cart);
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems))
    } else {
        cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
        for(let itm in cartItems) {
            // Si elle existe déjà et que le même produit est déjà présent, ajoute +1 à la quantité (pour éviter des doublons)
            if (item._id == cartItems[itm]._id && item.lenseChoice == cartItems[itm].lenseChoice) {
                createNewItem = false;
                cartItems[itm].quantity++;
            }
        }
    }

    if (createNewItem) {
        cartItems.push(cart);
    }
    // Enregistrement de l'array dans la session
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
}