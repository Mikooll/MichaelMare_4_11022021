var getContact = JSON.parse(sessionStorage.getItem("contact"));
var getTotalPrice = JSON.parse(sessionStorage.getItem("totalPrice"));
var getOrderId = JSON.parse(sessionStorage.getItem("orderId"));
var idSplit = getOrderId.split("-");
var idToShow = idSplit[0];

console.log(sessionStorage.getItem("contact"));
console.log(getTotalPrice)
console.log(getOrderId)

var idProduct = document.querySelector('.idProduct')
var firstname = document.querySelector('.firstName');
var lastName = document.querySelector('.name');
var address = document.querySelector('.adress');
var city = document.querySelector(".city");
var email = document.querySelector(".email");
var totalPrice = document.querySelector('.totalPrice');

// Mise en forme de la page de confirmation 
// en fonction du contenu des différentes sessions
idProduct.innerHTML = idToShow;
firstname.innerHTML = getContact.firstName;
lastName.innerHTML = getContact.lastName;
address.innerHTML = getContact.address;
city.innerHTML = getContact.city;
email.innerHTML = getContact.email;
totalPrice.innerHTML = getTotalPrice + "€";

// Vidage de la session
sessionStorage.clear();
