import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu li');
    const sections = document.querySelectorAll('.section');

    const cadastrarVisitanteBtn = document.getElementById('cadastrarVisitante');
    const cancelarCadastroVisitanteBtn = document.getElementById('cancelarCadastro');
    const visitanteForm = document.getElementById('visitanteForm');
    const cadastroVisitanteForm = document.getElementById('cadastroForm');
    const visitanteTabelaBody = document.querySelector("#visitantesTableBody");

    const moradorTabelaBody = document.querySelector("#moradoresTableBody");

    const listaVisitantes = document.getElementById('listaVisitantes');
    const visitantesTableBody = document.querySelector('#visitantesTable tbody');
    const pesquisaInput = document.getElementById('pesquisa');
    const gerarQrCodeBtn = document.getElementById('gerarQrCode');


    // Entregas Elements
    const cadastrarEntregaBtn = document.getElementById('cadastrarEntrega');
    const cadastroEntregaForm = document.getElementById('cadastroEntregaForm');
    const entregaForm = document.getElementById('entregaForm');
    const cancelarCadastroEntregaBtn = document.getElementById('cancelarCadastroEntrega');
    const entregasTableBody = document.querySelector('#entregasTable tbody');
    const pesquisaEntregaInput = document.getElementById('pesquisaEntrega');

    let moradores = [];
    let entregas = [];
    let visitantes = [];

    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const dataEntregaInput = document.getElementById('dataEntrega');
    const horaEntregaInput = document.getElementById('horaEntrega');

   const qrCodeModal = document.getElementById("qrCodeModal");
    const qrCodeImage = document.getElementById("qrCodeImage");
    const closeModal = document.querySelector(".modal-image .close");

    function abrirModalQRCode(base64Image) {
        qrCodeImage.src = `data:image/png;base64,${base64Image}`;
        qrCodeModal.style.display = "flex"; 
    }

    closeModal.onclick = () => {
        qrCodeModal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === qrCodeModal) {
            qrCodeModal.style.display = "none";
        }
    };

    getMoradores();
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

    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    // Function to format time
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        return `${hours}:${minutes}`;
    }

    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;
            showSection(sectionId);
        });
    });


    //#region visitante actions

        cadastrarVisitanteBtn.addEventListener('click', () => {
            cadastroVisitanteForm.style.display = 'block';
        });
    
        cancelarCadastroVisitanteBtn.addEventListener('click', () => {
            cadastroVisitanteForm.style.display = 'none';
            visitanteForm.reset();
        });
    
         async function getVisitantes() {
            try {
                const tokenData = JSON.parse(localStorage.getItem("authData"));
                if (!tokenData || !tokenData.accessToken) {
                    showNotification('Você precisa estar logado para visualizar os visitantes.', 'error');
                    return;
                }
    
                const accessToken = tokenData.accessToken;
    
                const response = await fetch("https://localhost:7100/users/v1/guests/view-all", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
    
                if (!response.ok) {
                    throw new Error("Erro ao buscar visitantes.");
                }
    
                const result = await response.json();
    
                visitantes = Array.isArray(result.data) ? result.data : [];
    
                visitanteTabelaBody.innerHTML = "";
            
               visitantes.forEach((visitante, index) => {
                if (!visitante || typeof visitante !== "object") {
                    console.warn(`Visitante inválido no índice ${index}:`, visitante);
                    return;
                }
    
                console.log("Visitantes recebidas:", result);
    
                const tr = document.createElement("tr");
    
                const tdName = document.createElement("td");
                tdName.textContent = visitante.name;
    
                const tdLastName = document.createElement("td");
                tdLastName.textContent = visitante.lastName;
    
                const tdEmail = document.createElement("td");
                tdEmail.textContent = visitante.email;
        
                const tdAcoes = document.createElement("td");
                tdAcoes.innerHTML = `
                    <button class="editar-btn" data-email="${visitante.email}">Editar</button>
                    <button class="remover-btn" data-email="${visitante.email}">Remover</button>
                    <button class="gerar-qrcode-btn" data-email="${visitante.email}">Gerar QR Code</button>
                `;
    
                tr.appendChild(tdName);
                tr.appendChild(tdLastName);
                tr.appendChild(tdEmail);
                tr.appendChild(tdAcoes);
    
                visitanteTabelaBody.appendChild(tr);
            });
            } catch (error) {
                console.error("Erro ao carregar visitantes:", error);
            }
        }
    
        visitanteTabelaBody.addEventListener("click", async function (e) {
        if (e.target.classList.contains("editar-btn")) {
            try {
                const button = e.target; 
                const email = button.getAttribute("data-email");

                const visitante = visitantes.find(a => a.email === email);

                if (!visitante) {
                    console.error("Erro ao buscar visitante: visitante não encontrado.");
                    showNotification('Erro ao buscar visitante: visitante não encontrado.', 'error');
                    return;
                }

                document.getElementById("nome").value = visitante.name;
                document.getElementById('sobrenome').value = visitante.lastName;
                document.getElementById("email").value = visitante.email;
                document.getElementById("telefone").value = visitante.phone;
                document.getElementById("cep").value = visitante.cep;
                document.getElementById("cepVisitante").value = visitante.cepGuest;
                document.getElementById("cpf").value = visitante.cpf;

                visitanteForm.setAttribute("data-modo", "editar");
                visitanteForm.setAttribute("data-email", visitante.email);
                cadastroVisitanteForm.style.display = "block";
            } catch (err) {
                console.error("Erro ao buscar visitante:", err.message);
                showNotification('Erro ao buscar visitante.', 'error');
            }
        }

        if (e.target.classList.contains("remover-btn")) {
            const button = e.target;
            const email = button.getAttribute("data-email");

            const tokenData = JSON.parse(localStorage.getItem("authData"));
            if (!tokenData || !tokenData.accessToken) {
                showNotification('Você precisa estar logado para excluir um visitante.', 'error');
                return;
            }

            try {
                const response = await fetch(`https://localhost:7100/users/v1/guests/exclude/${email}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${tokenData.accessToken}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao excluir visitante.");
                }

                showNotification("Visitante excluído com sucesso!", 'success');
                getVisitantes(); 

            } catch (error) {
                console.error("Erro ao excluir visitante:", error);
                showNotification('Erro ao excluir visitante', 'error');
            }
        }

        if (e.target.classList.contains("gerar-qrcode-btn")) {
            const button = e.target;
            const email = button.getAttribute("data-email");

            const tokenData = JSON.parse(localStorage.getItem("authData"));
            if (!tokenData || !tokenData.accessToken) {
                showNotification('Você precisa estar logado para gerar o QR Code do visitante.', 'error');
                return;
            }

            try {
                const response = await fetch(`https://localhost:7100/users/v1/guests/${email}/new-qrcode`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${tokenData.accessToken}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erro ao gerar o QR code.");
                }

                const result = await response.json();
                abrirModalQRCode(result.data); 

            } catch (error) {
                console.error("Erro ao gerar o QR code:", error);
                showNotification('Erro ao gerar o QR code.', 'error');
            }
        }
    });

    
        getVisitantes();
    
    
        cadastroVisitanteForm.addEventListener("submit", async function (e) {
        e.preventDefault();
    
        const tokenData = JSON.parse(localStorage.getItem("authData"));
        if (!tokenData || !tokenData.accessToken) {
            showNotification('Você precisa estar logado para cadastrar um visitante.', 'error');
            return;
        }
    
        const accessToken = tokenData.accessToken;
    
        const nome = document.getElementById("nome").value;
        const sobrenome = document.getElementById('sobrenome').value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value.replace(/\D/g, '');
        const cep = document.getElementById("cep").value.replace(/\D/g, '');
        const cepVisitante = document.getElementById("cepVisitante").value.replace(/\D/g, '');
        const cpf = document.getElementById("cpf").value.replace(/\D/g, '');
    
        let visitanteData = {
            id: uuidv4(),
            name: nome,
            lastName: sobrenome,
            email: email,
            phone: telefone,
            cep: cep,
            cepGuest: cepVisitante,
            cpf: cpf,
        };
    
        try {
            let url = "https://localhost:7100/users/v1/guests/register";
            let method = "POST";
    
            const modo = visitanteForm.getAttribute("data-modo");
    
                if (modo === "editar") {
                const emailOriginal = visitanteForm.getAttribute("data-email");
                visitanteData.email = emailOriginal;
                url = `https://localhost:7100/users/v1/guests/update/${emailOriginal}`;
                method = "PUT";
            }
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(visitanteData)
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
                    showNotification('Visitante atualizado com sucesso!', 'success');
                    break;
    
                default:
                    showNotification('Visitante cadastrado com sucesso!', 'success');
                    break;
            }
         
            visitanteForm.reset();
            visitanteForm.removeAttribute("data-modo");
            visitanteForm.removeAttribute("data-email");
            cadastroVisitanteForm.style.display = "none";
            getVisitantes(); 
        } catch (error) {
            console.error("Erro:", error);
            showNotification('Erro ao processar o visitante', 'error');
        }
    });
    //#endregion
    
    //#region morador actions
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

            tr.appendChild(tdNome);
            tr.appendChild(tdSobrenome);
            tr.appendChild(tdEmail);
            tr.appendChild(tdApartamento);

            moradorTabelaBody.appendChild(tr);
        });
        } catch (error) {
            console.error("Erro ao carregar moradores:", error);
        }
    }

    //#endregion

    //#region entrega actions
        cadastrarEntregaBtn.addEventListener('click', () => {
            cadastroEntregaForm.style.display = 'block';
        });
    
        cancelarCadastroEntregaBtn.addEventListener('click', () => {
            cadastroEntregaForm.style.display = 'none';
            entregaForm.reset();
        });
    
        getEntregas();
    
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

        atualizarTabelaEntregas(resultadosPesquisa);
    });

    // Function to show notification messages
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

        URL.revokeObjectURL(url);
    });

    // Adiciona funcionalidade ao botão "Sair"
    const sairBtn = document.querySelector('.menu li[data-section="sair"]');
    sairBtn.addEventListener('click', function(event) {
        event.preventDefault();
        showConfirmationModal('Tem certeza que deseja sair?', () => {
            showNotification('Você saiu do sistema.', 'info'); // Exibe uma notificação
            window.location.href = '../login/login.html';
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
async function buscarDadosPorteiro() {
const tokenData = JSON.parse(localStorage.getItem("authData"));

    if (!tokenData || !tokenData.doormanToken || !tokenData.accessToken) {
        showNotification("Dados de autenticação não encontrados. Faça login novamente.", "error");
        return;
    }

    const porteiroLogado = tokenData.doormanToken.id;
    const accessToken = tokenData.accessToken;

    const url = `https://localhost:7100/users/v1/doorman/view/${porteiroLogado}`;

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

        const porteiroData = await response.json();
        console.log("Dados do porteiro:", porteiroData);
        return porteiroData;

    } catch (err) {
        console.error("Erro ao buscar dados do porteiro:", err);
        return null;
    }
}

const userNameSpan = document.getElementById("user-name");


reloadDoorman();

async function reloadDoorman(){
    const porteiroData = await buscarDadosPorteiro();

    if (porteiroData && userNameSpan) {
        userNameSpan.textContent = `Olá, ${porteiroData.name}!`;
    } else {
        console.warn("Não foi possível exibir o nome do usuário.");
    }
}
//#endregion