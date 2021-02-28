const queryString = window.location.search;
const idProducts = queryString.split('?');


fetch("http://localhost:3000/api/cameras/" + idProducts[1])
    .then(result => result.json())
    .then(datas => {
        var container = document.querySelector(".container")

        var html = "<div class='product__card'>\
        <p> Nom : " + datas.name + " </p>\
        <p>Prix : " + datas.price + "</p>\
        <img class='product__img' src=" + datas.imageUrl + "></img>\
        <p>" + datas.description + "</p>\
        <label for='select_lense'>Choisissez votre lentille</label>\
        <select class='lenses' name='lenses' id='select__color'>\
        </select>\
        </div><br>\
        <button class='addToCart'>\
        <b>Ajouter au panier</b><i class='fas fa-cart-arrow-down'></i></button>";

        container.innerHTML = html;

        var selectOptions = document.querySelector('.lenses');
        var lenses = "";

        for (var i = 0; i < datas.lenses.length; i++) {
            lenses += "<option value='" + datas.lenses[i] + "'>" + datas.lenses[i] + "</option>";
            selectOptions.innerHTML = lenses;
        }

        var selectLense = document.querySelector('.lenses')
        var add = document.querySelector(".addToCart")

        add.addEventListener("click", () => {
            datas.lenseChoice = selectLense.value;
            addToCart(datas)
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