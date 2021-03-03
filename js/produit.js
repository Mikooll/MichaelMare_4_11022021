const queryString = window.location.search;
const idProducts = queryString.split('?');


fetch("http://localhost:3000/api/cameras/" + idProducts[1])
    .then(result => result.json())
    .then(datas => {
        var container = document.querySelector(".container")

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

        for (var i = 0; i < datas.lenses.length; i++) {
            lenses += "<option value='" + datas.lenses[i] + "'>" + datas.lenses[i] + "</option>";
            selectOptions.innerHTML = lenses;
        }

        var selectLense = document.querySelector('.lenses');
        var add = document.querySelector(".addToCart");
        var confirm = document.querySelector(".confirm__text");

        add.addEventListener("click", () => {
            datas.lenseChoice = selectLense.value;
            addToCart(datas);
            confirm.innerHTML = "Le produit a bien été ajouté au panier";
            setTimeout(function() {
                confirm.innerHTML= ""
            }, 3000)
        })
    })

function addToCart(item) {
    var cartStorage = sessionStorage.getItem("cartItems");
    let cartItems = [];

    var cart = {
        _id: item._id,
        imageUrl: item.imageUrl,
        name: item.name,
        price: item.price,
        quantity: 1,
        lenseChoice: item.lenseChoice
    }
    var createNewItem = true;

    console.log(sessionStorage.getItem("cartItems"))
    if (cartStorage === null) {
        createNewItem = false;
        cartItems.push(cart);
        sessionStorage.setItem("cartItems", JSON.stringify(cartItems))
    } else {
        cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
        for(let itm in cartItems) {
            if (item._id == cartItems[itm]._id && item.lenseChoice == cartItems[itm].lenseChoice) {
                createNewItem = false;
                cartItems[itm].quantity++;
            }
        }
    }

    if (createNewItem) {
        cartItems.push(cart);
    }

    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
}