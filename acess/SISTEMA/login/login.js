var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");
var body = document.querySelector("body");

// Alterna entre os formulários de login
btnSignin.addEventListener("click", function () {
   body.className = "sign-in-js"; 
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
});

// Evento de login para Portaria
document.getElementById('submitSignup').addEventListener('click', (event) => {
    event.preventDefault();
    // Aqui futuramente você vai chamar o backend para validar o login
    window.location.href = "../portaria/portaria.html"; // Redireciona para a página da portaria
});

// Evento de login para Administrador
document.getElementById('submitSignin').addEventListener('click', (event) => {
    event.preventDefault();
    // Aqui futuramente você vai chamar o backend para validar o login
    window.location.href = "../administrador/adm.html"; // Redireciona para a página do Administrador
});
