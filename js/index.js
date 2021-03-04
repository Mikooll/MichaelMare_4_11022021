/**
 * Requète GET pour récupérer le contenu de l'API
 */
fetch("http://localhost:3000/api/cameras")
    .then((response) => response.json())
    .then((datas) => {
        var product = document.querySelector(".products");
        var html = "";

        // Affichage des différents objets et de leurs caractéristiques
        for (var i = 0; i < datas.length; i++) {
            console.log(datas[i])
            html += "<div class='products__card'><a href='./produit.html?" + datas[i]._id + "'><h2 class='products__title'>" + datas[i].name + " </h2>\
            <p class='products__price'>" + datas[i].price/100 + "€</p>\
            <img class='products__img' src=" + datas[i].imageUrl + "></img>\
            <p class='products__description'>" + datas[i].description + "</p>";

            html += "</a></div><br>";
        }
        product.innerHTML = html;

    })
    .catch(e => {
        console.log(e)
    })