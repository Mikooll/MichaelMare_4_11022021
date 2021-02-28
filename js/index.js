fetch("http://localhost:3000/api/cameras")
    .then((response) => response.json())
    .then((datas) => {
        var product = document.querySelector(".products");
        var html = "";

        for (var i = 0; i < datas.length; i++) {
            console.log(datas[i])
            html += "<div class='products__card'><a href='./produit.html?" + datas[i]._id + "'><p> Nom : " + datas[i].name + " </p>\
        <p>Prix : " + datas[i].price + "</p>\
        <img class='products__img' src=" + datas[i].imageUrl + "></img>\
        <p>" + datas[i].description + "</p>";

            html += "</a></div><br>";
        }
        product.innerHTML = html;

    })
    .catch(e => {
        console.log(e)
    })