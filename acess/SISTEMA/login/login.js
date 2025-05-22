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

document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = "../../FRONTEND/layout1_view_site/index.html";
});

// Evento de login para Administrador
const loginForm = document.getElementById('signinForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!email || !password) {
            alert('Preencha todos os campos');
            return;
        }

        const loginData = {
            email: email,
            password: password
        };

        fetch('https://localhost:7061/identity/v1/login-administrator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Falha no login');
                    });
                }
                return response.json();
            })
            .then(data => {
                const token = data.data?.accessToken;
                const administratorToken = data.data?.administratorToken;

                if (!token || !administratorToken) {
                    throw new Error('Token ou administrador não encontrado');
                }

                // Verificar se o administrador tem permissão de FullAccess
                const hasFullAccess = administratorToken.claims.some(claim => claim.type === 'Permission' && claim.value === 'FullAccess');
                if (!hasFullAccess) {
                    throw new Error('Você não tem permissão de acesso total');
                }

                // Se tiver permissão, salvar o token e redirecionar
                localStorage.setItem("authData", JSON.stringify(data.data));
                showNotification('Login realizado com sucesso!');

                // Redireciona após login bem-sucedido
                window.location.href = "../administrador/adm.html";
            })
            .catch(error => {
                console.error(error);
                showNotification(`Erro ao realizar o login: ${error.message}`);
            });
    });
} else {
    console.error("Formulário de login não encontrado!");
}

// Evento de login para Porteiro
const porteiroForm = document.getElementById('signupForm');
if (porteiroForm) {
    porteiroForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
            alert('Preencha todos os campos');
            return;
        }

        const porteiroData = {
            email: email,
            password: password
        };

        fetch('https://localhost:7061/identity/v1/login-doorman', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(porteiroData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || 'Falha no login');
                    });
                }
                return response.json();
            })
            .then(data => {
                const token = data.data?.accessToken;
                const porteiroToken = data.data?.doormanToken;

                if (!token || !porteiroToken) {
                    throw new Error('Token ou porteiro não encontrado');
                }

                // Verificar se o porteiro tem permissão de LimitedAccess
                const hasLimitedAccess = porteiroToken.claims.some(claim => claim.type === 'Permission' && claim.value === 'LimitedAccess');
                if (!hasLimitedAccess) {
                    throw new Error('Você não tem permissão de acesso limitado');
                }

                // Se tiver permissão, salvar o token e redirecionar
                localStorage.setItem("authData", JSON.stringify(data.data));
                showNotification('Login realizado com sucesso!');

                // Redireciona após login bem-sucedido
                window.location.href = "../portaria/portaria.html";
            })
            .catch(error => {
                console.error(error);
                showNotification(`Erro ao realizar o login: ${error.message}`);
            });
    });
} else {
    console.error("Formulário de login não encontrado!");
}


function showNotification(message, type) {
    const notification = document.getElementById("notification");

    // Limpa classes anteriores
    notification.classList.remove("hidden", "success", "error");

    // Define o conteúdo e adiciona a classe apropriada
    notification.textContent = message;
    notification.classList.add(type); // "success" ou "error"

    // Esconde depois de 3 segundos
    setTimeout(() => {
        notification.classList.add("hidden");
    }, 3000);
}

