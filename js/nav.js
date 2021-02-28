fetch("http://localhost:3000/api/cameras")
    .then((response) => response.json())
    .then((datas) => {
        var nav = document.querySelector(".dropdown-content");
        var navContent = "";

        for (var i = 0; i < datas.length; i++) {
            navContent += "<a href='produit.html?" + datas[i]._id + "'>" + datas[i].name + "</a>"
        }
        nav.innerHTML = navContent;
    })
    .catch (e => {
        console.log(e)
    })