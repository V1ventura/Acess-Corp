import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener('DOMContentLoaded', () => {

    const menuItems = document.querySelectorAll('.menu li');
    const sections = document.querySelectorAll('.section');
    const cadastrarAdministradorBtn = document.getElementById('cadastrarAdministrador');
    const pesquisaInput = document.getElementById('pesquisa');

    // Entregas Elements
    const cadastrarEntregaBtn = document.getElementById('cadastrarEntrega');
    const cadastroEntregaForm = document.getElementById('cadastroEntregaForm');
    const entregaForm = document.getElementById('entregaForm');
    const cancelarCadastroEntregaBtn = document.getElementById('cancelarCadastroEntrega');
    const pesquisaEntregaInput = document.getElementById('pesquisaEntrega');

    const cadastrarMoradorBtn = document.getElementById('cadastrarMorador');
    const cancelarCadastroMoradorBtn = document.getElementById('cancelarCadastroMorador');

    const cadastrarPorteiroBtn = document.getElementById('porteiroBtn');
    const cancelarCadastroPorteiroBtn = document.getElementById('cancelarCadastroPorteiro');
    const cadastroPorteiroForm = document.getElementById('cadastroPorteiroForm');
    const porteiroForm = document.getElementById('porteiroForm');

    let entregas = [];
    let administradores = [];
    let moradores = [];
    let porteiros = [];

    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');

    const editProfileLink = document.getElementById('edit-profile');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', (event) => {
            event.preventDefault();
            openEditProfileModal();
        });
    } else {
        console.warn('#edit-profile não encontrado no DOM.');
    }

    // Function to format CPF
    function formatCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove non-numeric characters
        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11); // Truncate to 11 digits
        }
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Add dot after the first 3 digits
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Add dot after the second 3 digits
        cpf = cpf.replace(/(\d{3})(\d{1,2})/, '$1-$2'); // Add hyphen after the last 3 digits
        return cpf;
    }

    cadastrarAdministradorBtn.addEventListener("click", () => {
    document.getElementById("formCadastroAdministrador").style.display = "block"; // mostra o formulário

    
});

    // Function to format phone number
    function formatPhoneNumber(phoneNumber) {
        phoneNumber = phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
        phoneNumber = phoneNumber.replace(/(\d{4})(\d)/, '$1-$2'); // Add hyphen after the first 4 digits
        return phoneNumber;
    }

    // Event listeners for formatting
    cpfInput.addEventListener('input', function () {
        this.value = formatCPF(this.value);
    });

    telefoneInput.addEventListener('input', function () {
        this.value = formatPhoneNumber(this.value);
    });

    function showSection(sectionId) {
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            activeSection.classList.remove('active');
        }
    
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            console.warn('Seção não encontrada:', sectionId);
        }
    }
    

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            showSection(sectionId);
        });
    });

    document.getElementById("cadastrarAdministrador").addEventListener("click", function () {
    document.getElementById("administradorForm").style.display = "block";
});

document.getElementById("cancelarCadastro").addEventListener("click", function () {
    document.getElementById("administradorForm").style.display = "none";
});

document.getElementById("foto").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("previewFoto").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

    //#region Adm-Actions
    const tabelaBody = document.querySelector("#administradorTableBody");

    async function getAdministradores() {
        try {
            const tokenData = JSON.parse(localStorage.getItem("authData"));
            if (!tokenData || !tokenData.accessToken) {
                showNotification('Você precisa estar logado para visualizar um administrador.', 'error');
                return;
            }

            const accessToken = tokenData.accessToken;

            const response = await fetch("https://localhost:7100/users/v1/administrator/view-all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar administradores.");
            }

            const result = await response.json();

            administradores = Array.isArray(result.data) ? result.data : [];

            tabelaBody.innerHTML = "";
        
            administradores.forEach((admin, index) => {
            if (!admin || typeof admin !== "object") {
                console.warn(`Administrador inválido no índice ${index}:`, admin);
                return;
            }

            const tr = document.createElement("tr");

            const tdNome = document.createElement("td");
            tdNome.textContent = admin.name;

            const tdSobrenome = document.createElement("td");
            tdSobrenome.textContent = admin.lastName;

            const tdEmail = document.createElement("td");
            tdEmail.textContent = admin.email;

            const tdApartamento = document.createElement("td");
            tdApartamento.textContent = admin.houseNumber;

            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `
                <button class="editar-btn" data-email="${admin.email}">Editar</button>
                <button class="remover-btn" data-email="${admin.email}">Remover</button>
            `;

            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdEmail);
            tr.appendChild(tdApartamento);
            tr.appendChild(tdAcoes);

            tabelaBody.appendChild(tr);
        });
        } catch (error) {
            console.error("Erro ao carregar administradores:", error);
        }
    }

    tabelaBody.addEventListener("click", async function (e) {
    if (e.target.classList.contains("editar-btn")) {
        try {
            const button = e.target; 
            const email = button.getAttribute("data-email");

            const admin = administradores.find(a => a.email === email);

            if (!admin) {
                console.error("Erro ao buscar administrador: administrador não encontrado.");
                showNotification('Erro ao buscar administrador: administrador não encontrado.', 'error');

                return;
            }

        console.log("Administrador encontrado:", admin);
            // Preenche o formulário com os dados
            document.getElementById("nome").value = admin.name;
            document.getElementById("sobrenome").value = admin.lastName;
            document.getElementById("email").value = admin.email;
            document.getElementById("telefone").value = formatPhoneNumber(admin.phone);
            document.getElementById("cpf").value = formatCPF(admin.cpf);
            document.getElementById("cep").value = admin.cep;
            document.getElementById("apartamento").value = admin.houseNumber;

            document.getElementById("formCadastroAdministrador").setAttribute("data-modo", "editar");
            document.getElementById("formCadastroAdministrador").setAttribute("data-email", admin.email);
            document.getElementById("administradorForm").style.display = "block";
        } catch (err) {
            console.error("Erro ao buscar administrador:", err.message);
            showNotification('Erro ao buscar administrador.', 'error');
        }
    }

       if (e.target.classList.contains("remover-btn")) {
        const button = e.target;
        const email = button.getAttribute("data-email");

        const tokenData = JSON.parse(localStorage.getItem("authData"));
        if (!tokenData || !tokenData.accessToken) {
            showNotification('Você precisa estar logado para excluir um administrador.', 'error');
            return;
        }

        try {
            // var confirmacao = showConfirmationModal("Você tem certeza que deseja excluir este administrador?");
            // if (confirmacao.onConfirm())
            { 
                const response = await fetch(`https://localhost:7100/users/v1/administrator/exclude/${email}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${tokenData.accessToken}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao excluir administrador.");
                }

                showNotification("Administrador excluído com sucesso!", 'success');
                getAdministradores(); // Atualiza a lista
            }

        } catch (error) {
            console.error("Erro ao excluir administrador:", error);
            showNotification('Erro ao excluir administrador', 'error');
        }
    }
});
    
getAdministradores();
getPorteiros();

document.getElementById("formCadastroAdministrador").addEventListener("submit", async function (e) {
    e.preventDefault();

    // Verifica se há token no localStorage
    const tokenData = JSON.parse(localStorage.getItem("authData"));
    if (!tokenData || !tokenData.accessToken) {
        showNotification('Você precisa estar logado para cadastrar um administrador.', 'error');
        return;
    }

    const accessToken = tokenData.accessToken;

    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const telefone = document.getElementById("telefone").value.replace(/\D/g, '');
    const cpf = document.getElementById("cpf").value.replace(/\D/g, '');
    const cep = document.getElementById("cep").value.replace(/\D/g, '');
    const apartamento = document.getElementById("apartamento").value;
    const fotoInput = document.getElementById("foto");

   function convertFileToBase64(fileInput) {
    return new Promise((resolve, reject) => {
        if (!fileInput.files || !fileInput.files[0]) {
            resolve(""); // Sem arquivo, retorna string vazia
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

    let imageBase64 = await convertFileToBase64(fotoInput);

    const imageUpload = imageBase64.split(",")[1]; // mantém só o conteúdo base64

    const adminData = {
        name: nome,
        lastName: sobrenome,
        email: email,
        phone: telefone,
        cpf: cpf,
        cep: cep,
        houseNumber: parseInt(apartamento),
        image: fotoInput.files[0]?.name || "",
        imageUpload: imageUpload,
        password: senha,
    };

    try {
        let url = "https://localhost:7100/users/v1/administrator/register";
        let method = "POST";

        const form = document.getElementById("formCadastroAdministrador");
        const modo = form.getAttribute("data-modo");

               if (modo === "editar") {
            const emailOriginal = form.getAttribute("data-email");
            url = `https://localhost:7100/users/v1/administrator/update/${emailOriginal}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(adminData)
        });

            if (!response.ok) {

                try {
                    const errorData = await response.json();

                    if (errorData.errors) {
                        // Pega todas as mensagens do objeto 'errors' e junta
                        const allMessages = Object.values(errorData.errors).flat();
                        errorMessage = allMessages.join("<br>");
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.title) {
                        errorMessage = errorData.title;
                    }
                } catch (e) {
                    const fallbackText = await response.text().catch(() => null);
                    if (fallbackText) errorMessage = fallbackText;
                }

                showNotification(errorMessage, 'error');


                throw new Error(errorMessage);
            }

        switch (modo) {
            case "editar":
                showNotification('Administrador atualizado com sucesso!', 'success');
                break;

            default:
                showNotification('Administrador cadastrado com sucesso!', 'success');
                break;
        }
     
        form.reset();
        form.removeAttribute("data-modo");
        form.removeAttribute("data-email");
        document.getElementById("previewFoto").src = "";
        document.getElementById("administradorForm").style.display = "none";

        getAdministradores(); 
    } catch (error) {
        console.error("Erro:", error);
        showNotification('Erro ao processar o Administrador', 'error');
    }
});

//#endregion

    document.getElementById('foto').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewFoto').src = e.target.result;
                document.getElementById('uploadIcon').style.display = 'none'; // Hide the icon after upload
            }
            reader.readAsDataURL(file);
        } else {
            // If no file is selected, show the default icon
            document.getElementById('previewFoto').src = '';
            document.getElementById('uploadIcon').style.display = 'block';
        }
    });

    pesquisaInput.addEventListener('input', function () {
        const termoPesquisa = this.value.toLowerCase();
        const filtroOpcao = document.getElementById('filtroOpcao').value;
        const filtroValor = termoPesquisa; 

        let resultadosPesquisa = administradores;

        if (filtroOpcao && filtroValor) {
            resultadosPesquisa = resultadosPesquisa.filter(administradores=> {
                const valorAdministrador = administradores[filtroOpcao]?.toLowerCase() || '';
                return valorAdministrador.includes(filtroValor);
            });
        }

        atualizarTabela(resultadosPesquisa);
    });

    pesquisaEntregaInput.addEventListener('input', function () {
        const termoPesquisa = this.value.toLowerCase();
        const filtroEmpresa = document.getElementById('filtroEmpresa').value.toLowerCase();

        let resultadosPesquisa = entregas;

        if (termoPesquisa) {
            resultadosPesquisa = resultadosPesquisa.filter(entrega =>
                entrega.destinatario.toLowerCase().includes(termoPesquisa)
            );
        }

        if (filtroEmpresa) {
            resultadosPesquisa = resultadosPesquisa.filter(entrega =>
                entrega.empresa.toLowerCase() === filtroEmpresa
            );
        }
    });

  
//#region entrega actions
    cadastrarEntregaBtn.addEventListener('click', () => {
        cadastroEntregaForm.style.display = 'block';
    });

    cancelarCadastroEntregaBtn.addEventListener('click', () => {
        cadastroEntregaForm.style.display = 'none';
        entregaForm.reset();
    });



    const entregaTabelaBody = document.querySelector("#entregasTableBody");
     async function getEntregas() {
        try {
            const tokenData = JSON.parse(localStorage.getItem("authData"));
            if (!tokenData || !tokenData.accessToken) {
                showNotification('Você precisa estar logado para visualizar as entregas.', 'error');
                return;
            }

            const accessToken = tokenData.accessToken;

            const response = await fetch("https://localhost:7100/users/v1/delivery/view-all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar entregas.");
            }

            const result = await response.json();

            entregas = Array.isArray(result.data) ? result.data : [];

            entregaTabelaBody.innerHTML = "";
        
           entregas.forEach((entrega, index) => {
            if (!entrega || typeof entrega !== "object") {
                console.warn(`Entrega inválida no índice ${index}:`, entrega);
                return;
            }

            console.log("Entregas recebidas:", result);

            const tr = document.createElement("tr");

            const tdReceiver = document.createElement("td");
            tdReceiver.textContent = entrega.receiver;

            const tdDeliveryDate = document.createElement("td");
            tdDeliveryDate.textContent = new Date(entrega.deliveryDate).toLocaleString(); // Formata a data

            const tdDeliveredTo = document.createElement("td");
            tdDeliveredTo.textContent = entrega.deliveredTo;

            const tdEnterprise = document.createElement("td");
            tdEnterprise.textContent = entrega.enterprise;

            const tdNumberHouse = document.createElement("td");
            tdNumberHouse.textContent = entrega.numberHouse;

            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `
                <button class="editar-btn" data-id="${entrega.id}">Editar</button>
                <button class="remover-btn" data-id="${entrega.id}">Remover</button>
            `;

            tr.appendChild(tdReceiver);
            tr.appendChild(tdDeliveryDate);
            tr.appendChild(tdDeliveredTo);
            tr.appendChild(tdEnterprise);
            tr.appendChild(tdNumberHouse);
            tr.appendChild(tdAcoes);

            entregaTabelaBody.appendChild(tr);
        });
        } catch (error) {
            console.error("Erro ao carregar entregas:", error);
        }
    }

    entregaTabelaBody.addEventListener("click", async function (e) {
    if (e.target.classList.contains("editar-btn")) {
        try {
            const button = e.target; 
            const id = button.getAttribute("data-id");

            const entrega = entregas.find(a => a.id === id);

            if (!entrega) {
                console.error("Erro ao buscar entrega: entrega não encontrada.");
                showNotification('Erro ao buscar entrega: entrega não encontrada.', 'error');

                return;
            }

            document.getElementById("destinatario").value = entrega.receiver;
            document.getElementById('dataEntrega').value = entrega.deliveryDate;
            document.getElementById("empresa").value = entrega.enterprise;
            document.getElementById("entregador").value = entrega.deliveredTo;
            document.getElementById("cepEntrega").value = entrega.cep;
            document.getElementById("apartamentoEntrega").value = entrega.numberHouse;

            const form = document.getElementById("entregaForm");
            form.setAttribute("data-modo", "editar");
            form.setAttribute("data-id", entrega.id);
            document.getElementById("cadastroEntregaForm").style.display = "block";
        } catch (err) {
            console.error("Erro ao buscar entrega:", err.message);
            showNotification('Erro ao buscar entrega.', 'error');
        }
    }

       if (e.target.classList.contains("remover-btn")) {
        const button = e.target;
        const id = button.getAttribute("data-id");

        const tokenData = JSON.parse(localStorage.getItem("authData"));
        if (!tokenData || !tokenData.accessToken) {
            showNotification('Você precisa estar logado para excluir uma entrega.', 'error');
            return;
        }

        try {
            // var confirmacao = showConfirmationModal("Você tem certeza que deseja excluir este administrador?");
            // if (confirmacao.onConfirm())
                const response = await fetch(`https://localhost:7100/users/v1/delivery/exclude/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${tokenData.accessToken}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao excluir entrega.");
                }

                showNotification("Entrega excluída com sucesso!", 'success');
                getEntregas(); 

        } catch (error) {
            console.error("Erro ao excluir entrega:", error);
            showNotification('Erro ao excluir entrega', 'error');
        }
    }});

    getEntregas();


    document.getElementById("cadastroEntregaForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const tokenData = JSON.parse(localStorage.getItem("authData"));
    if (!tokenData || !tokenData.accessToken) {
        showNotification('Você precisa estar logado para cadastrar uma entrega.', 'error');
        return;
    }

    const accessToken = tokenData.accessToken;

    const data = document.getElementById('dataEntrega').value;
    const destinatario = document.getElementById('destinatario').value;
    const dataEntrega = new Date(data).toISOString();
    const cepEntrega = document.getElementById('cepEntrega').value.replace(/\D/g, '');
    const empresa = document.getElementById('empresa').value;
    const entregador = document.getElementById('entregador').value;
    const apartamento = document.getElementById('apartamentoEntrega').value;

    let entregaData = {
        id: uuidv4(),
        receiver: destinatario,
        deliveryDate: dataEntrega,
        enterprise: empresa,
        deliveredTo: entregador,
        numberHouse: parseInt(apartamento),
        cep: cepEntrega
    };

    try {
        let url = "https://localhost:7100/users/v1/delivery/register";
        let method = "POST";

        const form = document.getElementById("entregaForm");
        const modo = form.getAttribute("data-modo");

            if (modo === "editar") {
            const idOriginal = form.getAttribute("data-id");
            entregaData.id = idOriginal;
            url = `https://localhost:7100/users/v1/delivery/update/${idOriginal}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(entregaData)
        });

       if (!response.ok) {

            try {
                const errorData = await response.json();

                if (errorData.errors) {
                    // Pega todas as mensagens do objeto 'errors' e junta
                    const allMessages = Object.values(errorData.errors).flat();
                    errorMessage = allMessages.join("<br>");
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.title) {
                    errorMessage = errorData.title;
                }
            } catch (e) {
                const fallbackText = await response.text().catch(() => null);
                if (fallbackText) errorMessage = fallbackText;
            }

            showNotification(errorMessage, 'error');


            throw new Error(errorMessage);
        }


        switch (modo) {
            case "editar":
                showNotification('Entrega atualizada com sucesso!', 'success');
                break;

            default:
                showNotification('Entrega cadastrada com sucesso!', 'success');
                break;
        }
     
        form.reset();
        form.removeAttribute("data-modo");
        form.removeAttribute("data-id");
        document.getElementById("cadastroEntregaForm").style.display = "none";
        getEntregas(); 
    } catch (error) {
        console.error("Erro:", error);
        showNotification('Erro ao processar a entrega', 'error');
    }
});
//#endregion
   
//#region notifications
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        });

        notification.appendChild(closeButton);
        document.body.appendChild(notification);

        // Animate the notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove the notification after a delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // Function to show a confirmation modal
    function showConfirmationModal(message, onConfirm) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Confirmação</h2>
                <p>${message}</p>
                <div class="buttons">
                    <button class="cancel">Cancelar</button>
                    <button class="confirm">Confirmar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        modal.querySelector('.confirm').addEventListener('click', () => {
            onConfirm();
            modal.style.display = 'none';
            modal.remove();
        });

        modal.querySelector('.cancel').addEventListener('click', () => {
            modal.style.display = 'none';
            modal.remove();
        });
    }
//#endregion

     cadastrarPorteiroBtn.addEventListener('click', () => {
        cadastroPorteiroForm.style.display = 'block';
    });

    cancelarCadastroPorteiroBtn.addEventListener('click', () => {
        cadastroPorteiroForm.style.display = 'none';
        porteiroForm.reset();
    });

    const porteiroTabelaBody = document.querySelector("#porteiroTableBody");
 async function getPorteiros() {
        try {
            const tokenData = JSON.parse(localStorage.getItem("authData"));
            if (!tokenData || !tokenData.accessToken) {
                showNotification('Você precisa estar logado para visualizar um porteiro.', 'error');
                return;
            }

            const accessToken = tokenData.accessToken;

            const response = await fetch("https://localhost:7100/users/v1/doorman/view-all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar porteiros.");
            }

            const result = await response.json();

            porteiros = Array.isArray(result.data) ? result.data : [];

            porteiroTabelaBody.innerHTML = "";
        
            porteiros.forEach((porteiro, index) => {
            if (!porteiro || typeof porteiro !== "object") {
                console.warn(`Porteiro inválido no índice ${index}:`, porteiro);
                return;
            }

            const tr = document.createElement("tr");

            const tdNome = document.createElement("td");
            tdNome.textContent = porteiro.name;

            const tdSobrenome = document.createElement("td");
            tdSobrenome.textContent = porteiro.lastName;

            const tdEmail = document.createElement("td");
            tdEmail.textContent = porteiro.email;

            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `
                <button class="editar-btn" data-email="${porteiro.email}">Editar</button>
                <button class="remover-btn" data-email="${porteiro.email}">Remover</button>
            `;

            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdEmail);
            tr.appendChild(tdAcoes);

            porteiroTabelaBody.appendChild(tr);
        });
        } catch (error) {
            console.error("Erro ao carregar porteiros:", error);
        }
    }

    porteiroTabelaBody.addEventListener("click", async function (e) {
    if (e.target.classList.contains("editar-btn")) {
        try {
            const button = e.target; 
            const email = button.getAttribute("data-email");

            const porteiro = porteiros.find(a => a.email === email);

            if (!porteiro) {
                console.error("Erro ao buscar porteiro: porteiro não encontrado.");
                showNotification('Erro ao buscar porteiro: porteiro não encontrado.', 'error');

                return;
            }

        console.log("Porteiro encontrado:", porteiro);
            // Preenche o formulário com os dados
            document.getElementById("nomePorteiro").value = porteiro.name;
            document.getElementById("sobrenomePorteiro").value = porteiro.lastName;
            document.getElementById("emailPorteiro").value = porteiro.email;
            document.getElementById("telefonePorteiro").value = formatPhoneNumber(porteiro.phone);
            document.getElementById("cpfPorteiro").value = formatCPF(porteiro.cpf);
            document.getElementById("cepPorteiro").value = porteiro.cep;
            document.getElementById("senhaPorteiro").value = porteiro.password;

            porteiroForm.setAttribute("data-modo", "editar");
            porteiroForm.setAttribute("data-email", porteiro.email);
            cadastroPorteiroForm.style.display = "block";
        } catch (err) {
            console.error("Erro ao buscar porteiro:", err.message);
            showNotification('Erro ao buscar porteiro.', 'error');
        }
    }

       if (e.target.classList.contains("remover-btn")) {
        const button = e.target;
        const email = button.getAttribute("data-email");

        const tokenData = JSON.parse(localStorage.getItem("authData"));
        if (!tokenData || !tokenData.accessToken) {
            showNotification('Você precisa estar logado para excluir um porteiro.', 'error');
            return;
        }

        try {
            // var confirmacao = showConfirmationModal("Você tem certeza que deseja excluir este administrador?");
            // if (confirmacao.onConfirm())
            { 
                const response = await fetch(`https://localhost:7100/users/v1/doorman/exclude/${email}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${tokenData.accessToken}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao excluir porteiros.");
                }

                showNotification("Porteiro excluído com sucesso!", 'success');
                getPorteiros();
            }

        } catch (error) {
            console.error("Erro ao excluir porteiro:", error);
            showNotification('Erro ao excluir porteiro', 'error');
        }
    }
});

 cadastroPorteiroForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const tokenData = JSON.parse(localStorage.getItem("authData"));
    if (!tokenData || !tokenData.accessToken) {
        showNotification('Você precisa estar logado para cadastrar um porteiro.', 'error');
        return;
    }

    const accessToken = tokenData.accessToken;

    const nome = document.getElementById("nomePorteiro").value;
    const sobrenome = document.getElementById("sobrenomePorteiro").value;
    const email = document.getElementById("emailPorteiro").value;
    const telefone = document.getElementById("telefonePorteiro").value.replace(/\D/g, '');
    const cpf = document.getElementById("cpfPorteiro").value.replace(/\D/g, '');
    const cep = document.getElementById("cepPorteiro").value.replace(/\D/g, '');
    const senha = document.getElementById("senhaPorteiro").value;

    const porteiroData = {
        name: nome,
        lastName: sobrenome,
        email: email,
        phone: telefone,
        cpf: cpf,
        cep: cep,
        password: senha
    };

    try {
        let url = "https://localhost:7100/users/v1/doorman/register";
        let method = "POST";

        const form = porteiroForm;
        const modo = form.getAttribute("data-modo");

            if (modo === "editar") {
            const emailOriginal = form.getAttribute("data-email");
            url = `https://localhost:7100/users/v1/doorman/update/${emailOriginal}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(porteiroData)
        });

            if (!response.ok) {

                try {
                    const errorData = await response.json();

                    if (errorData.errors) {
                        const allMessages = Object.values(errorData.errors).flat();
                        errorMessage = allMessages.join("<br>");
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.title) {
                        errorMessage = errorData.title;
                    }
                } catch (e) {
                    const fallbackText = await response.text().catch(() => null);
                    if (fallbackText) errorMessage = fallbackText;
                }

                showNotification(errorMessage, 'error');

                throw new Error(errorMessage);
            }

        switch (modo) {
            case "editar":
                showNotification('Porteiro atualizado com sucesso!', 'success');
                break;

            default:
                showNotification('Porteiro cadastrado com sucesso!', 'success');
                break;
        }
     
        form.reset();
        form.removeAttribute("data-modo");
        form.removeAttribute("data-email");
        document.getElementById("cadastroPorteiroForm").classList.add("hidden");

        getPorteiros(); 
    } catch (error) {
        console.error("Erro:", error);
        showNotification('Erro ao processar o porteiro', 'error');
    }
});

//#region Morador actions
   cadastrarMoradorBtn.addEventListener('click', () => {
        cadastroMoradorForm.style.display = 'block';
    });

    cancelarCadastroMoradorBtn.addEventListener('click', () => {
        cadastroMoradorForm.style.display = 'none';
        moradorForm.reset();
        document.getElementById('previewFotoMorador').src = '';
        document.getElementById('uploadIconMorador').style.display = 'block';
    });

    const moradorTabelaBody = document.querySelector("#moradoresTableBody");
 async function getMoradores() {
        try {
            const tokenData = JSON.parse(localStorage.getItem("authData"));
            if (!tokenData || !tokenData.accessToken) {
                showNotification('Você precisa estar logado para visualizar um morador.', 'error');
                return;
            }

            const accessToken = tokenData.accessToken;

            const response = await fetch("https://localhost:7100/users/v1/residents/view-all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar moradores.");
            }

            const result = await response.json();

            moradores = Array.isArray(result.data) ? result.data : [];

            moradorTabelaBody.innerHTML = "";
        
            moradores.forEach((morador, index) => {
            if (!morador || typeof morador !== "object") {
                console.warn(`Morador inválido no índice ${index}:`, morador);
                return;
            }

            const tr = document.createElement("tr");

            const tdNome = document.createElement("td");
            tdNome.textContent = morador.name;

            const tdSobrenome = document.createElement("td");
            tdSobrenome.textContent = morador.lastName;

            const tdEmail = document.createElement("td");
            tdEmail.textContent = morador.email;

            const tdApartamento = document.createElement("td");
            tdApartamento.textContent = morador.houseNumber;

            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `
                <button class="editar-btn" data-email="${morador.email}">Editar</button>
                <button class="remover-btn" data-email="${morador.email}">Remover</button>
            `;

            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdEmail);
            tr.appendChild(tdApartamento);
            tr.appendChild(tdAcoes);

            moradorTabelaBody.appendChild(tr);
        });
        } catch (error) {
            console.error("Erro ao carregar moradores:", error);
        }
    }

    moradorTabelaBody.addEventListener("click", async function (e) {
    if (e.target.classList.contains("editar-btn")) {
        try {
            const button = e.target; 
            const email = button.getAttribute("data-email");

            const morador = moradores.find(a => a.email === email);

            if (!morador) {
                console.error("Erro ao buscar morador: morador não encontrado.");
                showNotification('Erro ao buscar morador: morador não encontrado.', 'error');

                return;
            }

        console.log("Morador encontrado:", morador);
            // Preenche o formulário com os dados
            document.getElementById("nomeMorador").value = morador.name;
            document.getElementById("sobrenomeMorador").value = morador.lastName;
            document.getElementById("emailMorador").value = morador.email;
            document.getElementById("telefoneMorador").value = formatPhoneNumber(morador.phone);
            document.getElementById("cpfMorador").value = formatCPF(morador.cpf);
            document.getElementById("cepMorador").value = morador.cep;
            document.getElementById("apartamentoMorador").value = morador.houseNumber;

            const form = document.getElementById("moradorForm");
            form.setAttribute("data-modo", "editar");
            form.setAttribute("data-email", morador.email);
            document.getElementById("cadastroMoradorForm").style.display = "block";
        } catch (err) {
            console.error("Erro ao buscar morador:", err.message);
            showNotification('Erro ao buscar morador.', 'error');
        }
    }

       if (e.target.classList.contains("remover-btn")) {
        const button = e.target;
        const email = button.getAttribute("data-email");

        const tokenData = JSON.parse(localStorage.getItem("authData"));
        if (!tokenData || !tokenData.accessToken) {
            showNotification('Você precisa estar logado para excluir um morador.', 'error');
            return;
        }

        try {
            // var confirmacao = showConfirmationModal("Você tem certeza que deseja excluir este administrador?");
            // if (confirmacao.onConfirm())
            { 
                const response = await fetch(`https://localhost:7100/users/v1/residents/exclude/${email}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${tokenData.accessToken}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao excluir morador.");
                }

                showNotification("Morador excluído com sucesso!", 'success');
                getMoradores();
            }

        } catch (error) {
            console.error("Erro ao excluir morador:", error);
            showNotification('Erro ao excluir morador', 'error');
        }
    }
});
    
getMoradores();


    document.getElementById("cadastroMoradorForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const tokenData = JSON.parse(localStorage.getItem("authData"));
    if (!tokenData || !tokenData.accessToken) {
        showNotification('Você precisa estar logado para cadastrar um morador.', 'error');
        return;
    }

    const accessToken = tokenData.accessToken;

    const nome = document.getElementById("nomeMorador").value;
    const sobrenome = document.getElementById("sobrenomeMorador").value;
    const email = document.getElementById("emailMorador").value;
    const telefone = document.getElementById("telefoneMorador").value.replace(/\D/g, '');
    const cpf = document.getElementById("cpfMorador").value.replace(/\D/g, '');
    const cep = document.getElementById("cepMorador").value.replace(/\D/g, '');
    const apartamento = document.getElementById("apartamentoMorador").value;
    const fotoInput = document.getElementById("fotoMorador");

   function convertFileToBase64(fileInput) {
    return new Promise((resolve, reject) => {
        if (!fileInput.files || !fileInput.files[0]) {
            resolve(""); // Sem arquivo, retorna string vazia
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}

    let imageBase64 = await convertFileToBase64(fotoInput);

    const imageUpload = imageBase64.split(",")[1]; 

    const moradorData = {
        name: nome,
        lastName: sobrenome,
        email: email,
        phone: telefone,
        cpf: cpf,
        image: fotoInput.files[0]?.name || "",
        imageUpload: imageUpload,
        cep: cep,
        houseNumber: parseInt(apartamento),
    };

    try {
        let url = "https://localhost:7100/users/v1/residents/register";
        let method = "POST";

        const form = document.getElementById("moradorForm");
        const modo = form.getAttribute("data-modo");

            if (modo === "editar") {
            const emailOriginal = form.getAttribute("data-email");
            url = `https://localhost:7100/users/v1/residents/update/${emailOriginal}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(moradorData)
        });

            if (!response.ok) {

                try {
                    const errorData = await response.json();

                    if (errorData.errors) {
                        const allMessages = Object.values(errorData.errors).flat();
                        errorMessage = allMessages.join("<br>");
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.title) {
                        errorMessage = errorData.title;
                    }
                } catch (e) {
                    const fallbackText = await response.text().catch(() => null);
                    if (fallbackText) errorMessage = fallbackText;
                }

                showNotification(errorMessage, 'error');

                throw new Error(errorMessage);
            }

        switch (modo) {
            case "editar":
                showNotification('Morador atualizado com sucesso!', 'success');
                break;

            default:
                showNotification('Morador cadastrado com sucesso!', 'success');
                break;
        }
     
        form.reset();
        form.removeAttribute("data-modo");
        form.removeAttribute("data-email");
        document.getElementById("previewFotoMorador").src = "";
        document.getElementById("cadastroMoradorForm").style.display = "none";
        getMoradores(); 
    } catch (error) {
        console.error("Erro:", error);
        showNotification('Erro ao processar o Morador', 'error');
    }
});


    document.getElementById('fotoMorador').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewFotoMorador').src = e.target.result;
                document.getElementById('uploadIconMorador').style.display = 'none'; // Hide the icon after upload
            }
            reader.onerror = function (error) {
                console.error('Erro ao ler a imagem:', error);
                showNotification('Erro ao processar a imagem.', 'error');
            };
            reader.readAsDataURL(file);
        } else {
            document.getElementById('previewFotoMorador').src = '';
            document.getElementById('uploadIconMorador').style.display = 'block';
        }
    });
    //#endregion


    pesquisaMoradorInput.addEventListener('input', function () {
        const termoPesquisa = this.value.toLowerCase();
        const filtroOpcao = document.getElementById('filtroMoradorOpcao').value;

        let resultadosPesquisa = moradores;

        if (filtroOpcao && termoPesquisa) {
            resultadosPesquisa = resultadosPesquisa.filter(morador => {
                const valorMorador = morador[filtroOpcao]?.toLowerCase() || '';
                return valorMorador.includes(termoPesquisa);
            });
        }

        atualizarTabelaMoradores(resultadosPesquisa);
    });

    function atualizarTabelaMoradores(moradoresExibidos) {
        moradoresTableBody.innerHTML = '';
        moradoresExibidos.forEach(morador => {
            const isDeleted = morador.dataExclusao !== undefined;
            const row = document.createElement('tr');

            // Aplica estilo se o morador foi excluído
            if (isDeleted) {
                row.classList.add('deleted-row'); // Adicione a classe para indicar exclusão
            }

            row.innerHTML = `
                <td>${morador.nomeMorador}</td>
                <td>${morador.apartamentoMorador}</td>
                <td class="actions">
                    <button class="edit" data-id="${morador.id}"  ${isDeleted ? 'disabled' : ''}>Editar</button>
                    <button class="delete" data-id="${morador.id}" ${isDeleted ? 'disabled' : ''}>${isDeleted ? 'Excluído' : 'Excluir'}</button>
                </td>
            `;
            moradoresTableBody.appendChild(row);
        });
    }

      cadastrarPorteiroBtn.addEventListener('click', () => {
        cadastroPorteiroForm.style.display = 'block';
    });

    cancelarCadastroPorteiroBtn.addEventListener('click', () => {
        cadastroPorteiroForm.style.display = 'none';
        porteiroForm.reset();
    });

    showSection('visitantes');
    atualizarListaVisitantes();
    atualizarListaEntregas();

    async function getPorteiros() {
        try {
            const tokenData = JSON.parse(localStorage.getItem("authData"));
            if (!tokenData || !tokenData.accessToken) {
                showNotification('Você precisa estar logado para visualizar um porteiro.', 'error');
                return;
            }

            const accessToken = tokenData.accessToken;

            const response = await fetch("https://localhost:7100/users/v1/administrator/view-all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar administradores.");
            }

            const result = await response.json();

            administradores = Array.isArray(result.data) ? result.data : [];

            tabelaBody.innerHTML = "";
        
            administradores.forEach((admin, index) => {
            if (!admin || typeof admin !== "object") {
                console.warn(`Administrador inválido no índice ${index}:`, admin);
                return;
            }

            const tr = document.createElement("tr");

            const tdNome = document.createElement("td");
            tdNome.textContent = admin.name;

            const tdSobrenome = document.createElement("td");
            tdSobrenome.textContent = admin.lastName;

            const tdEmail = document.createElement("td");
            tdEmail.textContent = admin.email;

            const tdApartamento = document.createElement("td");
            tdApartamento.textContent = admin.houseNumber;

            const tdAcoes = document.createElement("td");
            tdAcoes.innerHTML = `
                <button class="editar-btn" data-email="${admin.email}">Editar</button>
                <button class="remover-btn" data-email="${admin.email}">Remover</button>
            `;

            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdEmail);
            tr.appendChild(tdApartamento);
            tr.appendChild(tdAcoes);

            tabelaBody.appendChild(tr);
        });
        } catch (error) {
            console.error("Erro ao carregar administradores:", error);
        }
    }  

    porteiroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nomePorteiro').value;
        const sobrenome = document.getElementById('sobrenomePorteiro').value;
        const telefone = document.getElementById('telefonePorteiro').value.trim();
        const email = document.getElementById('emailPorteiro').value.trim();
        const senha = document.getElementById('senhaPorteiro').value;

        if (!nome || !email || !senha || !confirmarSenha) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        const novoPorteiro = {
            id: crypto.randomUUID(),
            nome,
            telefone,
            email,
            senha
        };

        porteiros.push(novoPorteiro);
        localStorage.setItem('porteiros', JSON.stringify(porteiros));

        alert('Porteiro cadastrado com sucesso!');
        porteiroForm.reset();
        cadastroPorteiroForm.style.display = 'none';
    });

    const sairBtn = document.querySelector('.menu li[data-section="sair"]');
    sairBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showConfirmationModal('Tem certeza que deseja sair?', () => {
            // Aqui você pode adicionar a lógica para sair do sistema
            // Por exemplo, redirecionar para a página de login:
            // window.location.href = 'pagina_de_login.html';
            showNotification('Você saiu do sistema.', 'info'); // Exibe uma notificação
        });
    });
});
export const config = {
    stageWidth: 800,
    stageHeight: 600,
};

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    });

    notification.appendChild(closeButton);
    document.body.appendChild(notification);

    // Animate the notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove the notification after a delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function showConfirmationModal(message, onConfirm) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Confirmação</h2>
            <p>${message}</p>
            <div class="buttons">
                <button class="cancel">Cancelar</button>
                <button class="confirm">Confirmar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    modal.querySelector('.confirm').addEventListener('click', () => {
        onConfirm();
        modal.style.display = 'none';
        modal.remove();
    });

    modal.querySelector('.cancel').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });
}


//#region editarPerfil
async function buscarDadosAdministrador() {
    const tokenData = JSON.parse(localStorage.getItem("authData"));

    const administratorToken = tokenData.administratorToken;
    const adminLogado = administratorToken.email;
    const accessToken = tokenData.accessToken;

    let adminData;

    if (!tokenData || !tokenData.administratorToken || !tokenData.accessToken) {
        showNotification("Dados de autenticação não encontrados. Faça login novamente.", "error");
        return;
    }

    const url = `https://localhost:7100/users/v1/administrator/view/${adminLogado}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });

        if (!response.ok) {
            let errorMessage = 'Erro ao buscar dados';
            try {
                const errorData = await response.json();
                if (errorData.errors) {
                    const allMessages = Object.values(errorData.errors).flat();
                    errorMessage = allMessages.join("<br>");
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.title) {
                    errorMessage = errorData.title;
                }
            } catch (e) {
                const fallbackText = await response.text().catch(() => null);
                if (fallbackText) errorMessage = fallbackText;
            }

            showNotification(errorMessage, 'error');
            throw new Error(errorMessage);
        }

        adminData = await response.json();
        console.log("Dados do administrador:", adminData);
        return adminData;

    } catch (err) {
        console.error("Erro ao buscar dados do administrador:", err);
        return null;
    }
}

async function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // só base64
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}


async function openEditProfileModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = 'editProfileModal';

    let adminData = await buscarDadosAdministrador();

    const base64string = adminData.imageUpload;
    const base64Image = `data:image/png;base64,${base64string}`;

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2>Editar Perfil</h2>
            <div style="text-align: center;">
                <img id="edit-profile-pic" src="${base64Image}"}" alt="Foto de Perfil" style="width: 100px; height: 100px; border-radius: 50%; border: 2px solid white; object-fit: cover;">
                <label for="upload-new-photo" style="display: block; margin-top: 10px; cursor: pointer; color: #007bff;">Alterar Foto</label>
                <input type="file" id="upload-new-photo" style="display: none;" accept="image/*">
            </div>
            <div style="margin-top: 20px;">
                <label for="edit-email">Email:</label>
                <input type="email" id="edit-email" value="${adminData.email}"  style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">

                <label for="edit-nome">Nome:</label>
                <input type="text" id="edit-nome" value="${localStorage.getItem('userNome') || ''}" style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">

                <label for="edit-sobrenome">Sobrenome:</label>
                <input type="text" id="edit-sobrenome" value="${localStorage.getItem('userSobrenome') || ''}" style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">

                <label for="edit-cpf">CPF:</label>
                <input type="text" id="edit-cpf" value="${localStorage.getItem('userCPF') || ''}" style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="buttons" style="text-align: right; margin-top: 20px;">
                <button class="cancel" style="padding: 10px 20px; border: none; background-color: #6c757d; color: white; border-radius: 5px; cursor: pointer; margin-right: 10px;">Cancelar</button>
                <button class="save" style="padding: 10px 20px; border: none; background-color: #007bff; color: white; border-radius: 5px; cursor: pointer;">Salvar</button>
            </div>
        </div>
    `;

    modal.querySelector("#edit-nome").value = adminData.name || "";
    modal.querySelector("#edit-sobrenome").value = adminData.lastName || "";
    modal.querySelector("#edit-email").value = adminData.email || "";
    modal.querySelector("#edit-cpf").value = adminData.cpf || ""; 

    const uploadNewPhotoInput = modal.querySelector('#upload-new-photo');
    const profilePicImg = modal.querySelector('#edit-profile-pic');

    uploadNewPhotoInput.addEventListener('change', async function () {
        const file = this.files[0];
        if (file) {
            const base64 = await toBase64(file);
            profilePicImg.src = `data:image/png;base64,${base64}`;
        }
    });


    document.body.appendChild(modal);
    modal.style.display = 'block';
    modal.querySelector('.cancel').addEventListener('click', () => {
        closeEditProfileModal();
    });

    modal.querySelector('.save').addEventListener('click', async () => {
            const uploadInput = modal.querySelector('#upload-new-photo');
    let imageBase64 = adminData.imageUpload;
    let imageName = adminData.image || "";

    if (uploadInput.files.length > 0) {
        imageBase64 = await toBase64(uploadInput.files[0]);
        imageName = uploadInput.files[0].name;
    }

    const adminInput = {
        id: adminData.id,
        identityId: adminData.identityId, 
        name: modal.querySelector("#edit-nome").value,
        lastName: modal.querySelector("#edit-sobrenome").value,
        email: modal.querySelector("#edit-email").value,
        phone: adminData.phone,
        cpf: modal.querySelector("#edit-cpf").value,
        cep: adminData.cep,
        houseNumber: parseInt(adminData.houseNumber),
        image: imageName,
        imageUpload: imageBase64,
        password: adminData.password,
    };

    saveProfileChanges(adminInput);
});

        document.body.appendChild(modal);

}

const userNameSpan = document.getElementById("user-name");
const profilePic = document.getElementById("profile-pic");

// Busca os dados do administrador

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}
reloadAdm();

async function reloadAdm(){
    const adminData = await buscarDadosAdministrador();

    if (adminData && userNameSpan) {
        userNameSpan.textContent = `Olá, ${adminData.name}!`;
        profilePic.src = `data:image/png;base64,${adminData.imageUpload}`;
    } else {
        console.warn("Não foi possível exibir o nome do usuário.");
    }
}

async function saveProfileChanges(adminInput) {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;

        const tokenData = JSON.parse(localStorage.getItem("authData"));
        const accessToken = tokenData.accessToken;

        let url = `https://localhost:7100/users/v1/administrator/update/${adminInput.email}`;
        let method = "PUT";

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(adminInput)
        });

        console.log(adminInput);
            if (!response.ok) {

                try {
                    const errorData = await response.json();

                    if (errorData.errors) {
                        // Pega todas as mensagens do objeto 'errors' e junta
                        const allMessages = Object.values(errorData.errors).flat();
                        errorMessage = allMessages.join("<br>");
                    } else if (errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData.title) {
                        errorMessage = errorData.title;
                    }
                } catch (e) {
                    const fallbackText = await response.text().catch(() => null);
                    if (fallbackText) errorMessage = fallbackText;
                }

                showNotification(errorMessage, 'error');


                throw new Error(errorMessage);
            }

    closeEditProfileModal();
    showNotification('Perfil atualizado com sucesso!', 'success');

reloadAdm();
}
//#endregion