import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener('DOMContentLoaded', () => {

    const menuItems = document.querySelectorAll('.menu li');
    const sections = document.querySelectorAll('.section');
    const cadastrarAdministradorBtn = document.getElementById('cadastrarAdministrador');
    const administradorForm = document.getElementById('administradorForm');
    const cancelarCadastroBtn = document.getElementById('cancelarCadastro');
    const listaAdministrador = document.getElementById('listaAdministrador');
    const administradorTableBody = document.querySelector('#administradorTable tbody');
    const pesquisaInput = document.getElementById('pesquisa');
    const gerarQrCodeBtn = document.getElementById('gerarQrCode');
    const administradorSection = document.getElementById("administrador");
    // Entregas Elements
    const cadastrarEntregaBtn = document.getElementById('cadastrarEntrega');
    const cadastroEntregaForm = document.getElementById('cadastroEntregaForm');
    const entregaForm = document.getElementById('entregaForm');
    const cancelarCadastroEntregaBtn = document.getElementById('cancelarCadastroEntrega');
    const entregasTableBody = document.querySelector('#entregasTable tbody');
    const pesquisaEntregaInput = document.getElementById('pesquisaEntrega');

    let entregas = JSON.parse(localStorage.getItem('entregas')) || [];
    let administrador = JSON.parse(localStorage.getItem('administrador')) || [];

    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const dataEntregaInput = document.getElementById('dataEntrega');
    const horaEntregaInput = document.getElementById('horaEntrega');

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

    let administradores = [];

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
            document.getElementById("formCadastroAdministrador").style.display = "block";
        } catch (err) {
            console.error("Erro ao buscar administrador:", err.message);
            showNotification('Erro ao buscar administrador.', 'error');
        }
    }

       if (e.target.classList.contains("remover-btn")) {
        const button = e.target;
        const email = button.getAttribute("data-email");

        var confirmacao = showConfirmationModal("Você tem certeza que deseja excluir este administrador?");
        if (!confirmacao) return;

        const tokenData = JSON.parse(localStorage.getItem("authData"));
        if (!tokenData || !tokenData.accessToken) {
            showNotification('Você precisa estar logado para excluir um administrador.', 'error');
            return;
        }

        try {
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

            alert("Administrador excluído com sucesso!");
            getAdministradores(); // Atualiza a lista
        } catch (error) {
            console.error("Erro ao excluir administrador:", error);
            showNotification('Erro ao excluir administrador', 'error');
        }
    }
});
    
    const observer = new MutationObserver(() => {
        if (administradorSection.classList.contains("active")) {
            getAdministradores();
        }
    });


    observer.observe(administradorSection, { attributes: true, attributeFilter: ["class"] });

    if (administradorSection.classList.contains("active")) {
        getAdministradores();
    }

    console.log(JSON.parse(localStorage.getItem("authData")));

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
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao cadastrar/editar administrador.");
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
        form.classList.add("hidden");

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

        atualizarTabelaEntregas(resultadosPesquisa);
    });

    function atualizarTabela(administradorExibidos) {
        administradorTableBody.innerHTML = '';
        administradorExibidos.forEach(administrador=> {
            const isDeleted = administrador.dataExclusao !== undefined;
            const row = document.createElement('tr');

            // Aplica estilo se o administrador foi excluído
            if (isDeleted) {
                row.classList.add('deleted-row'); // Adicione a classe para indicar exclusão
            }

            row.innerHTML = `
                <td>
                    <span class="view-profile" data-id="${administrador.id}" style="${isDeleted ? 'text-decoration: line-through;' : ''}">${administrador.nome}</span>
                </td>
                <td>${administrador.apartamento}</td>
                <td class="actions">
                    <button class="edit" data-id="${administrador.id}" ${isDeleted ? 'disabled' : ''}>Editar</button>
                    <button class="delete" data-id="${administrador.id}" ${isDeleted ? 'disabled' : ''}>${isDeleted ? 'Excluído' : 'Excluir'}</button>
                    <button class="qrcode" data-id="${administrador.id}" ${isDeleted ? 'disabled' : ''}>QRCode</button>
                </td>
            `;
            administradorTableBody.appendChild(row);
        });
    }

    // Entregas Functions
    cadastrarEntregaBtn.addEventListener('click', () => {
        cadastroEntregaForm.style.display = 'block';
    });

    cancelarCadastroEntregaBtn.addEventListener('click', () => {
        cadastroEntregaForm.style.display = 'none';
        entregaForm.reset();
    });

    entregaForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const destinatario = document.getElementById('destinatario').value;
        const dataEntrega = document.getElementById('dataEntrega').value;
        const horaEntrega = document.getElementById('horaEntrega').value;
        const empresa = document.getElementById('empresa').value;
        const entregador = document.getElementById('entregador').value;
        const apartamento = document.getElementById('apartamentoEntrega').value;

        if (!destinatario || !empresa) {
            alert('Destinatário e Empresa são campos obrigatórios.');
            return;
        }

        salvarEntrega(destinatario, dataEntrega, horaEntrega, empresa, entregador, apartamento);
        cadastroEntregaForm.style.display = 'none';
        entregaForm.reset();

    });

    function salvarEntrega(destinatario, dataEntrega, horaEntrega, empresa, entregador, apartamento) {
        const id = uuidv4();
        const timestamp = new Date().toLocaleString();
        const user = "System"; // Replace with actual user authentication if available
        const novaEntrega = {
            id: id,
            destinatario: destinatario,
            dataEntrega: dataEntrega,
            horaEntrega: horaEntrega,
            empresa: empresa,
            entregador: entregador,
            apartamento: apartamento,
            dataCadastro: timestamp,
            cadastradoPor: user
        };

        entregas.push(novaEntrega);
        localStorage.setItem('entregas', JSON.stringify(entregas));
        atualizarListaEntregas();
        cadastroEntregaForm.style.display = 'none';
        entregaForm.reset();
        showNotification('Entrega cadastrada com sucesso!', 'success');
    }

    function atualizarListaEntregas() {
        atualizarTabelaEntregas(entregas);
    }

    entregasTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete')) {
            const id = event.target.dataset.id;
            showConfirmationModal('Tem certeza que deseja excluir esta entrega?', () => {
                excluirEntrega(id);
            });
        } else if (event.target.classList.contains('edit')) {
            const id = event.target.dataset.id;
            editarEntrega(id);
        }
    });

    function excluirEntrega(id) {
        const timestamp = new Date().toLocaleString();
        const user = "System"; // Replace with actual user authentication if available
        const entrega = entregas.find(entrega => entrega.id === id);
        if (entrega) {
            entrega.dataExclusao = timestamp;
            entrega.excluidoPor = user;
        }
        entregas = entregas.filter(entrega => entrega.id !== id);
        localStorage.setItem('entregas', JSON.stringify(entregas));
        atualizarListaEntregas();
        showNotification('Entrega excluída com sucesso!', 'success');
    }

    function editarEntrega(id) {
        const entrega = entregas.find(entrega => entrega.id === id);
        if (entrega) {
            cadastroEntregaForm.style.display = 'block';
            document.getElementById('destinatario').value = entrega.destinatario;
            document.getElementById('dataEntrega').value = entrega.dataEntrega;
            document.getElementById('horaEntrega').value = entrega.horaEntrega;
            document.getElementById('empresa').value = entrega.empresa;
            document.getElementById('entregador').value = entrega.entregador;
            document.getElementById('apartamentoEntrega').value = entrega.apartamento;

            // Remove the old submit listener
            entregaForm.removeEventListener('submit', handleFormSubmit);

            // Add a new submit listener for editing
            entregaForm.addEventListener('submit', function handleFormSubmit(event) {
                event.preventDefault();
                atualizarEntrega(id);
                // Remove the listener after it's used once
                entregaForm.removeEventListener('submit', handleFormSubmit);
            });

        }
    }

    function atualizarEntrega(id) {
        const destinatario = document.getElementById('destinatario').value;
        const dataEntrega = document.getElementById('dataEntrega').value;
        const horaEntrega = document.getElementById('horaEntrega').value;
        const empresa = document.getElementById('empresa').value;
        const entregador = document.getElementById('entregador').value;
        const apartamento = document.getElementById('apartamentoEntrega').value;
        const timestamp = new Date().toLocaleString();
        const user = "System"; // Replace with actual user authentication if available

        entregas = entregas.map(entrega => {
            if (entrega.id === id) {
                return { ...entrega, destinatario, dataEntrega, horaEntrega, empresa, entregador, apartamento, dataEdicao: timestamp, editadoPor: user };
            }
            return entrega;
        });

        localStorage.setItem('entregas', JSON.stringify(entregas));
        atualizarListaEntregas();
        cadastroEntregaForm.style.display = 'none';
        entregaForm.reset();
        showNotification('Entrega atualizada com sucesso!', 'success');
    }

    function atualizarTabelaEntregas(entregasExibidas) {
        entregasTableBody.innerHTML = '';
        entregasExibidas.forEach(entrega => {
            const isDeleted = entrega.dataExclusao !== undefined;
            const row = document.createElement('tr');

            // Aplica estilo se o entrega foi excluído
            if (isDeleted) {
                row.classList.add('deleted-row'); // Adicione a classe para indicar exclusão
            }

            row.innerHTML = `
                <td>${entrega.destinatario}</td>
                <td>${entrega.dataEntrega}</td>
                <td>${entrega.horaEntrega}</td>
                <td>${entrega.empresa}</td>
                <td>${entrega.entregador}</td>
                <td>${entrega.apartamento}</td>
                <td class="actions">
                    <button class="edit" data-id="${entrega.id}"  ${isDeleted ? 'disabled' : ''}>Editar</button>
                    <button class="delete" data-id="${entrega.id}" ${isDeleted ? 'disabled' : ''}>${isDeleted ? 'Excluído' : 'Excluir'}</button>
                </td>
            `;
            entregasTableBody.appendChild(row);
        });
    }

    gerarQrCodeBtn.addEventListener('click', function() {
        showNotification('QR Code enviado para o WhatsApp!', 'success');
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

    function visualizarPerfil(id) {
        const visitante = visitantes.find(visitante => visitante.id === id);
        if (visitante) {
            // Create a modal or a separate section to display the profile
            const profileModal = document.createElement('div');
            profileModal.classList.add('modal');
            profileModal.innerHTML = `
                <div class="modal-content">
                    <h2>Perfil de Visitante</h2>
                    <img src="${visitante.foto || ''}" alt="Foto do Visitante" style="width: 100px; height: 100px; border-radius: 50%;">
                    <p><strong>Nome:</strong> ${visitante.nome}</p>
                    <p><strong>Email:</strong> ${visitante.email || 'Não informado'}</p>
                    <p><strong>Apartamento:</strong> ${visitante.apartamento}</p>
                    <p><strong>RG:</strong> ${visitante.rg || 'Não informado'}</p>
                    <p><strong>CPF:</strong> ${visitante.cpf || 'Não informado'}</p>
                    <p><strong>Telefone:</strong> ${visitante.telefone || 'Não informado'}</p>
                    <button class="close-modal">Fechar</button>
                </div>
            `;
            document.body.appendChild(profileModal);
            profileModal.style.display = 'block';

            profileModal.querySelector('.close-modal').addEventListener('click', () => {
                profileModal.style.display = 'none';
                profileModal.remove();
            });
        } else {
            showNotification('Visitante não encontrado.', 'error');
        }
    }

    const cadastrarMoradorBtn = document.getElementById('cadastrarMorador');
    const cadastroMoradorForm = document.getElementById('cadastroMoradorForm');
    const moradorForm = document.getElementById('moradorForm');
    const cancelarCadastroMoradorBtn = document.getElementById('cancelarCadastroMorador');
    const moradoresTableBody = document.querySelector('#moradoresTable tbody');
    const pesquisaMoradorInput = document.getElementById('pesquisaMorador');

    let moradores = JSON.parse(localStorage.getItem('moradores')) || [];

    cadastrarMoradorBtn.addEventListener('click', () => {
        cadastroMoradorForm.style.display = 'block';
    });

    cancelarCadastroMoradorBtn.addEventListener('click', () => {
        cadastroMoradorForm.style.display = 'none';
        moradorForm.reset();
        document.getElementById('previewFotoMorador').src = '';
        document.getElementById('uploadIconMorador').style.display = 'block';
    });

    moradorForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const nomeMorador = document.getElementById('nomeMorador').value;
        const emailMorador = document.getElementById('emailMorador').value;
        const apartamentoMorador = document.getElementById('apartamentoMorador').value;
        const rgMorador = document.getElementById('rgMorador').value;
        const cpfMorador = document.getElementById('cpfMorador').value;
        const telefoneMorador = document.getElementById('telefoneMorador').value;
        const dataNascimentoMorador = document.getElementById('dataNascimentoMorador').value;
        const fotoMoradorInput = document.getElementById('fotoMorador').files[0];

        if (!nomeMorador || !apartamentoMorador) {
            showNotification('Nome e Apartamento são campos obrigatórios.', 'error');
            return;
        }

        let fotoMoradorURL = '';
        if (fotoMoradorInput) {
            const reader = new FileReader();
            reader.onloadend = function () {
                fotoMoradorURL = reader.result;
                salvarMorador(nomeMorador, emailMorador, apartamentoMorador, rgMorador, cpfMorador, telefoneMorador, dataNascimentoMorador, fotoMoradorURL);
            }
            reader.onerror = function (error) {
                console.error('Erro ao ler a imagem:', error);
                showNotification('Erro ao processar a imagem.', 'error');
            };
            reader.readAsDataURL(fotoMoradorInput);
        } else {
            salvarMorador(nomeMorador, emailMorador, apartamentoMorador, rgMorador, cpfMorador, telefoneMorador, dataNascimentoMorador, fotoMoradorURL);
        }
    });

    function salvarMorador(nomeMorador, emailMorador, apartamentoMorador, rgMorador, cpfMorador, telefoneMorador, dataNascimentoMorador, fotoMoradorURL) {
        const id = uuidv4();
        const timestamp = new Date().toLocaleString();
        const user = "System"; // Replace with actual user authentication if available
        const novoMorador = {
            id: id,
            nomeMorador: nomeMorador,
            emailMorador: emailMorador,
            apartamentoMorador: apartamentoMorador,
            rgMorador: rgMorador,
            cpfMorador: cpfMorador,
            telefoneMorador: telefoneMorador,
            dataNascimentoMorador: dataNascimentoMorador,
            fotoMorador: fotoMoradorURL,
            dataCadastro: timestamp,
            cadastradoPor: user
        };

        moradores.push(novoMorador);
        localStorage.setItem('moradores', JSON.stringify(moradores));
        atualizarListaMoradores();
        cadastroMoradorForm.style.display = 'none';
        moradorForm.reset();
        document.getElementById('previewFotoMorador').src = '';
        document.getElementById('uploadIconMorador').style.display = 'block';
        showNotification('Morador cadastrado com sucesso!', 'success');
    }

    function atualizarListaMoradores() {
        atualizarTabelaMoradores(moradores);
    }

    moradoresTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete')) {
            const id = event.target.dataset.id;
            showConfirmationModal('Tem certeza que deseja excluir este morador?', () => {
                excluirMorador(id);
            });
        } else if (event.target.classList.contains('edit')) {
            const id = event.target.dataset.id;
            editarMorador(id);
        }
    });

    function excluirMorador(id) {
        const timestamp = new Date().toLocaleString();
        const user = "System"; // Replace with actual user authentication if available
        const morador = moradores.find(morador => morador.id === id);
        if (morador) {
            morador.dataExclusao = timestamp;
            morador.excluidoPor = user;
        }
        moradores = moradores.filter(morador => morador.id !== id);
        localStorage.setItem('moradores', JSON.stringify(moradores));
        atualizarListaMoradores();
        showNotification('Morador excluído com sucesso!', 'success');
    }

    function editarMorador(id) {
        const morador = moradores.find(morador => morador.id === id);
        if (morador) {
            cadastroMoradorForm.style.display = 'block';
            document.getElementById('nomeMorador').value = morador.nomeMorador;
            document.getElementById('emailMorador').value = morador.emailMorador;
            document.getElementById('apartamentoMorador').value = morador.apartamentoMorador;
            document.getElementById('rgMorador').value = morador.rgMorador;
            document.getElementById('cpfMorador').value = morador.cpfMorador;
            document.getElementById('telefoneMorador').value = morador.telefoneMorador;
            document.getElementById('dataNascimentoMorador').value = morador.dataNascimentoMorador;
            document.getElementById('previewFotoMorador').src = morador.fotoMorador || '';
            document.getElementById('uploadIconMorador').style.display = morador.fotoMorador ? 'none' : 'block';

            // Remove the old submit listener
            moradorForm.removeEventListener('submit', handleMoradorFormSubmit);

            // Add a new submit listener for editing
            moradorForm.addEventListener('submit', function handleMoradorFormSubmit(event) {
                event.preventDefault();
                atualizarMorador(id);
                // Remove the listener after it's used once
                moradorForm.removeEventListener('submit', handleMoradorFormSubmit);
            });
        }
    }

    function atualizarMorador(id) {
        const nomeMorador = document.getElementById('nomeMorador').value;
        const emailMorador = document.getElementById('emailMorador').value;
        const apartamentoMorador = document.getElementById('apartamentoMorador').value;
        const rgMorador = document.getElementById('rgMorador').value;
        const cpfMorador = document.getElementById('cpfMorador').value;
        const telefoneMorador = document.getElementById('telefoneMorador').value;
        const dataNascimentoMorador = document.getElementById('dataNascimentoMorador').value;
        const fotoMoradorInput = document.getElementById('fotoMorador');
        const fotoMoradorFile = fotoMoradorInput.files[0];
        const timestamp = new Date().toLocaleString();
        const user = "System"; // Replace with actual user authentication if available

        let fotoMoradorURL = '';
        if (fotoMoradorFile) {
            const reader = new FileReader();
            reader.onloadend = function () {
                fotoMoradorURL = reader.result;
                atualizarMoradorData(id, nomeMorador, emailMorador, apartamentoMorador, rgMorador, cpfMorador, telefoneMorador, dataNascimentoMorador, fotoMoradorURL);
            }
            reader.onerror = function (error) {
                console.error('Erro ao ler a imagem:', error);
                showNotification('Erro ao processar a imagem.', 'error');
            };
            reader.readAsDataURL(fotoMoradorFile);
        } else {
            atualizarMoradorData(id, nomeMorador, emailMorador, apartamentoMorador, rgMorador, cpfMorador, telefoneMorador, dataNascimentoMorador, null);
        }
    }

    function atualizarMoradorData(id, nomeMorador, emailMorador, apartamentoMorador, rgMorador, cpfMorador, telefoneMorador, dataNascimentoMorador, fotoMoradorURL) {
        moradores = moradores.map(morador => {
            if (morador.id === id) {
                return {
                    ...morador,
                    nomeMorador,
                    emailMorador,
                    apartamentoMorador,
                    rgMorador,
                    cpfMorador,
                    telefoneMorador,
                    dataNascimentoMorador,
                    fotoMorador: fotoMoradorURL !== null ? fotoMoradorURL : morador.fotoMorador,
                    dataEdicao: timestamp,
                    editadoPor: user
                };
            }
            return morador;
        });

        localStorage.setItem('moradores', JSON.stringify(moradores));
        atualizarListaMoradores();
        cadastroMoradorForm.style.display = 'none';
        moradorForm.reset();
        document.getElementById('previewFotoMorador').src = '';
        document.getElementById('uploadIconMorador').style.display = 'block';
        showNotification('Morador atualizado com sucesso!', 'success');
    }

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

    showSection('visitantes');
    atualizarListaVisitantes();
    atualizarListaEntregas();

    // Adiciona funcionalidade ao botão "Sair"
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

export { showNotification, showConfirmationModal };

document.addEventListener('DOMContentLoaded', () => {
    const porteiroForm = document.getElementById('porteiroForm');
    const porteiroBtn = document.getElementById('porteiroBtn');
    const cadastroPorteiroForm = document.getElementById('cadastroPorteiroForm');
    const cancelarCadastroPorteiroBtn = document.getElementById('cancelarCadastroPorteiro');
    const perfisContainer = document.getElementById('perfisContainer');

    let porteiros = JSON.parse(localStorage.getItem('porteiros')) || [];

    porteiroBtn.addEventListener('click', () => {
        cadastroPorteiroForm.style.display = 'block';
    });

    cancelarCadastroPorteiroBtn.addEventListener('click', () => {
        cadastroPorteiroForm.style.display = 'none';
        porteiroForm.reset();
    });

    porteiroForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nomePorteiro').value.trim();
        const telefone = document.getElementById('telefonePorteiro').value.trim();
        const email = document.getElementById('emailPorteiro').value.trim();
        const senha = document.getElementById('senhaPorteiro').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

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
        renderizarPorteiros();
    });

    function renderizarPorteiros() {
        perfisContainer.innerHTML = '';
        porteiros.forEach(p => {
            const card = document.createElement('div');
            card.className = 'porteiro-card';
            card.innerHTML = `
                <strong>${p.nome}</strong><br>
                Email: ${p.email}<br>
                Telefone: ${p.telefone}<br>
                <div class="actions">
                    <button data-id="${p.id}" class="delete">Excluir</button>
                </div>
            `;
            card.querySelector('.delete').addEventListener('click', () => {
                excluirPorteiro(p.id);
            });
            perfisContainer.appendChild(card);
        });
    }

    function excluirPorteiro(id) {
        if (confirm('Deseja realmente excluir este porteiro?')) {
            porteiros = porteiros.filter(p => p.id !== id);
            localStorage.setItem('porteiros', JSON.stringify(porteiros));
            renderizarPorteiros();
        }
    }

    renderizarPorteiros();
});

    function updatePasswordStrengthIndicator(password) {
        const strength = checkPasswordStrength(password);
        const indicator = document.getElementById('passwordStrengthIndicator');

        if (!indicator) {
            return;
        }

        switch (strength) {
            case 'muito fraca':
                indicator.style.backgroundColor = 'red';
                break;
            case 'fraca':
                indicator.style.backgroundColor = 'orange';
                break;
            case 'moderada':
                indicator.style.backgroundColor = 'yellow';
                break;
            case 'razoável':
                indicator.style.backgroundColor = 'lightgreen';
                break;
            case 'forte':
                indicator.style.backgroundColor = 'green';
                break;
            default:
                indicator.style.backgroundColor = 'transparent';
        }
    }

    atualizarPerfis();

// Try to get the username from local storage
let username = localStorage.getItem('username') || config.defaultUsername;

// Get the profile picture element
const profilePic = document.getElementById('profile-pic');

// Assume you have the profile picture URL stored in local storage or from a backend
let profilePictureURL = localStorage.getItem('profilePictureURL');

// If there's a profile picture URL, use it. Otherwise, use the default.
if (profilePictureURL) {
    profilePic.src = profilePictureURL;
} else {
    // Use a default avatar image URL
    profilePic.src = "https://static.whatsapp.net/rsrc.php/ym/r/36B424nhiYH.png";
}

// Display the username
const userNameSpan = document.getElementById('user-name');
userNameSpan.textContent = `Olá, ${username}!`;

// Add event listener to the "Edit Profile" link
document.addEventListener('DOMContentLoaded', () => {
    const editProfileLink = document.getElementById('edit-profile');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', (event) => {
            event.preventDefault();
            openEditProfileModal();
        });
    } else {
        console.warn('#edit-profile não encontrado no DOM.');
    }
});


function openEditProfileModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.id = 'editProfileModal'; // Assign an ID to the modal
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <h2>Editar Perfil</h2>
            <div style="text-align: center;">
                <img id="edit-profile-pic" src="${localStorage.getItem('profilePictureURL') || "https://static.whatsapp.net/rsrc.php/ym/r/36B424nhiYH.png"}" alt="Foto de Perfil" style="width: 100px; height: 100px; border-radius: 50%; border: 2px solid white; object-fit: cover;">
                <label for="upload-new-photo" style="display: block; margin-top: 10px; cursor: pointer; color: #007bff;">Alterar Foto</label>
                <input type="file" id="upload-new-photo" style="display: none;" accept="image/*">
            </div>
            <div style="margin-top: 20px;">
                <label for="edit-email">Email:</label>
                <input type="email" id="edit-email" value="${localStorage.getItem('userEmail') || ''}" readonly style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">

                <label for="edit-nome">Nome:</label>
                <input type="text" id="edit-nome" value="${localStorage.getItem('userNome') || ''}" readonly style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">

                <label for="edit-sobrenome">Sobrenome:</label>
                <input type="text" id="edit-sobrenome" value="${localStorage.getItem('userSobrenome') || ''}" readonly style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">

                <label for="edit-cpf">CPF:</label>
                <input type="text" id="edit-cpf" value="${localStorage.getItem('userCPF') || ''}" readonly style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">

                <label for="edit-cargo">Cargo:</label>
                <input type="text" id="edit-cargo" value="${localStorage.getItem('userCargo') || ''}" readonly style="width: 100%; padding: 8px; margin-bottom: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="buttons" style="text-align: right; margin-top: 20px;">
                <button class="cancel" style="padding: 10px 20px; border: none; background-color: #6c757d; color: white; border-radius: 5px; cursor: pointer; margin-right: 10px;">Cancelar</button>
                <button class="save" style="padding: 10px 20px; border: none; background-color: #007bff; color: white; border-radius: 5px; cursor: pointer;">Salvar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Event listeners for the modal buttons
    modal.querySelector('.cancel').addEventListener('click', () => {
        closeEditProfileModal();
    });

    modal.querySelector('.save').addEventListener('click', () => {
        saveProfileChanges();
    });

    const uploadNewPhotoInput = modal.querySelector('#upload-new-photo');
    uploadNewPhotoInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                modal.querySelector('#edit-profile-pic').src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    document.body.appendChild(modal);

}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
}

function saveProfileChanges() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;

    const newProfilePicture = modal.querySelector('#edit-profile-pic').src;

    // Update profile picture in local storage and on the page
    localStorage.setItem('profilePictureURL', newProfilePicture);
    document.getElementById('profile-pic').src = newProfilePicture;

    closeEditProfileModal();
    showNotification('Perfil atualizado com sucesso!', 'success');
}