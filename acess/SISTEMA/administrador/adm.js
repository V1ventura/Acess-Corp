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

    const tabelaBody = document.querySelector("#administradorTableBody");

    if (!administradorSection || !tabelaBody) {
        console.error("Elemento da seção ou da tabela não encontrado.");
        return;
    }

            let administradores = [];

    async function getAdministradores() {
        try {
            const tokenData = JSON.parse(localStorage.getItem("authData"));
            if (!tokenData || !tokenData.accessToken) {
                alert("Você precisa estar logado para visualizar administradores.");
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
        
            console.log("Resultado da API:", result);
            console.log("Dados dos administradores:", result.data);

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

        const button = e.target; // <-- precisa ter isso para pegar o botão clicado
            const email = button.getAttribute("data-email");

            const admin = administradores.find(a => a.email === email);

            if (!admin) {
                alert("Erro ao buscar administrador: administrador não encontrado.");
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
            alert("Erro ao buscar administrador: " + err.message);
        }
    }

       if (e.target.classList.contains("remover-btn")) {
        const button = e.target;
        const email = button.getAttribute("data-email");

        const confirmacao = confirm(`Tem certeza que deseja excluir o administrador com o e-mail ${email}?`);
        if (!confirmacao) return;

        const tokenData = JSON.parse(localStorage.getItem("authData"));
        if (!tokenData || !tokenData.accessToken) {
            alert("Você precisa estar logado para excluir um administrador.");
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
            alert("Erro ao excluir administrador: " + error.message);
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
        alert("Você precisa estar logado para cadastrar um administrador.");
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

        alert(modo === "editar" ? "Administrador atualizado com sucesso!" : "Administrador cadastrado com sucesso!");

        // Reseta o formulário e atualiza a lista
        form.reset();
        form.removeAttribute("data-modo");
        form.removeAttribute("data-email");
        document.getElementById("previewFoto").src = "";
        form.classList.add("hidden");

        getAdministradores(); // Atualiza a tabela
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao processar: " + error.message);
    }
});

    function atualizarListaAdministrador() {
        console.log(administrador);  // Adicione um log para verificar o conteúdo dos administradores
        atualizarTabela(administrador);
    }

    administradorTableBody.addEventListener('click', function (event) {
        if (event.target.classList.contains('view-profile')) {
            const id = event.target.dataset.id;
            visualizarPerfil(id);
        }
        if (event.target.classList.contains('delete')) {
            const id = event.target.dataset.id;
            showConfirmationModal('Tem certeza que deseja excluir este administrador?', () => {
                excluirAdministrador(id);
            });
        } else if (event.target.classList.contains('edit')) {
            const id = event.target.dataset.id;
            editarAdministrador(id);
        } else if (event.target.classList.contains('qrcode')) {
            const id = event.target.dataset.id;
            showQRCodeConfirmation(id);
        }
    });

    function showQRCodeConfirmation(id) {
        const administrador = administrador.find(administrador => administrador.id === id);
        if (administrador) {
            const message = `
                <div style="text-align: center; padding: 20px; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h3 style="color: #333; margin-bottom: 15px;">QRCode para Administrador</h3>
                    <p style="font-size: 16px;"><strong>Nome:</strong> ${administrador.nome}</p>
                    <p style="font-size: 16px;"><strong>Apartamento:</strong> ${administrador.apartamento}</p>
                    <p style="font-size: 16px;"><strong>Telefone:</strong> ${administrador.telefone || 'Não informado'}</p>
                    <p style="font-size: 16px; margin-top: 15px;">Deseja enviar o QRCode com os dados deste administrador para o WhatsApp?</p>
                </div>
            `;
            showConfirmationModal(message, () => {
                showNotification('QR Code enviado para o WhatsApp!', 'success');
            });
        } else {
            showNotification('Administrador não encontrado.', 'error');
        }
    }

    function excluirAdministrador(id) {
        const timestamp = new Date().toLocaleString();
        const user = "System"; // Replace with actual user authentication if available
        const administrador = administrador.find(administrador=> administrador.id === id);
        if (administrador) {
            administrador.dataExclusao = timestamp;
            administrador.excluidoPor = user;
        }
        administrador = administrador.filter(administrador => administrador.id !== id);
        localStorage.setItem('administrador', JSON.stringify(administrador));
        atualizarListaAdministrador();
        showNotification('Administrador excluído com sucesso!', 'success');
    }

    function editarAdministrador(id) {
        const administrador = administrador.find(administrador => administrador.id === id);
        if (administrador) {
            form.classList.remove("hidden");
            document.getElementById('nome').value = administrador.nome;
            document.getElementById('sobrenome').value = administrador.sobrenome;
            document.getElementById('email').value = administrador.email;
            document.getElementById('telefone').value = administrador.telefone;
            document.getElementById('cpf').value = administrador.cpf;
            document.getElementById('cep').value = administrador.cep;
            document.getElementById('apartamento').value = administrador.apartamento;

            document.getElementById('previewFoto').src = administrador.foto || '';

            // Remove the old submit listener
            administradorForm.removeEventListener('submit', handleFormSubmit);

            // Add a new submit listener for editing
            administradorForm.addEventListener('submit', function handleFormSubmit(event) {
                event.preventDefault();
                atualizarAdministrador(id);
                // Remove the listener after it's used once
                administradorForm.removeEventListener('submit', handleFormSubmit);
            });

        }
    }

    function atualizarAdministrador(id) {
        const nome = document.getElementById('nome').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const cpf = document.getElementById('cpf').value;
        const cep = document.getElementById('cep').value;
        const apartamento = document.getElementById('apartamento').value;


        const fotoInput = document.getElementById('foto');
        const fotoFile = fotoInput.files[0];
        const timestamp = new Date().toLocaleString();
        const user = "System"; // Replace with actual user authentication if available


        let fotoURL = '';
        if (fotoFile) {
            const reader = new FileReader();
            reader.onloadend = function () {
                fotoURL = reader.result;
                administrador = administrador.map(administrador => {
                    if (administrador.id === id) {
                        return { ...administrador, nome, sobrenome, email, telefone, cpf, cep, apartamento, foto: fotoURL, dataEdicao: timestamp, editadoPor: user };
                    }
                    return administrador;
                });

                localStorage.setItem('administrador', JSON.stringify(administrador));
                atualizarListaAdministrador();
                administradorForm.style.display = 'none';
                administradorForm.reset();
                document.getElementById('previewFoto').src = '';
                document.getElementById('uploadIcon').style.display = 'block';
                showNotification('Administrador atualizado com sucesso!', 'success');
            }
            reader.readAsDataURL(fotoFile);
        } else {
            administrador = administrador.map(administrador=> {
                if (administrador.id === id) {
                    return { ...administrador, nome, sobrenome, email, telefone, cpf, cep, apartamento, dataEdicao: timestamp, editadoPor: user };
                }
                return administrador;
            });

            localStorage.setItem('administrador', JSON.stringify(administrador));
            atualizarListaAdministrador();
            administradorForm.style.display = 'none';
            administradorForm.reset();
            document.getElementById('previewFoto').src = '';
            document.getElementById('uploadIcon').style.display = 'block';
            showNotification('Administradoratualizado com sucesso!', 'success');
        }
    }

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
        const filtroValor = termoPesquisa; // Usar o termo de pesquisa como valor do filtro

        let resultadosPesquisa = administrador;

        if (filtroOpcao && filtroValor) {
            resultadosPesquisa = resultadosPesquisa.filter(administrador=> {
                const valorAdministrador = administrador[filtroOpcao]?.toLowerCase() || '';
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

    // Reports Elements
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const reportTypeSelect = document.getElementById('reportType');
    const generateReportButton = document.querySelector('.generate-report-button');
    const reportInfoDiv = document.querySelector('.report-info');
    const generatedFileContainer = document.querySelector('.generated-file-container');

    // Event listener for report type selection
    if (reportTypeSelect) {
        reportTypeSelect.addEventListener('change', function () {
            const selectedValue = this.value;
            let infoText = '';

            switch (selectedValue) {
                case 'all':
                    infoText = 'Gera um relatório abrangente com todos os dados cadastrados de visitantes, moradores e entregas, incluindo informações sobre edições e exclusões.';
                    break;
                case 'visitantes':
                    infoText = 'Gera um relatório específico com os dados de visitantes cadastrados.';
                    break;
                case 'moradores':
                    infoText = 'Gera um relatório específico com os dados dos moradores cadastrados.';
                    break;
                case 'entregas':
                    infoText = 'Gera um relatório específico com os dados de entregas registradas.';
                    break;
                default:
                    infoText = 'Selecione um tipo de relatório para visualizar as informações.';
            }

            reportInfoDiv.textContent = infoText;
            reportInfoDiv.style.display = 'block';
        });
    }

    // Event listener for generating report
    if (generateReportButton) {
        generateReportButton.addEventListener('click', () => {
            const startDate = startDateInput.value;
            const endDate = endDateInput.value;
            const reportType = reportTypeSelect.value;

            if (!startDate || !endDate) {
                showNotification('Por favor, selecione as datas de início e término.', 'error');
                return;
            }

            // Check date range
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            const today = new Date();

            // Calculate the difference in months
            let monthsDifference = (endDateObj.getFullYear() - startDateObj.getFullYear()) * 12;
            monthsDifference -= startDateObj.getMonth();
            monthsDifference += endDateObj.getMonth();

            if (monthsDifference > 6) {
                showNotification('O período máximo para extrair relatórios é de 6 meses.', 'error');
                return;
            }

            if (endDateObj > today) {
                showNotification('Não é possível extrair relatórios para datas futuras.', 'error');
                return;
            }

            generateReport(startDate, endDate, reportType);
        });
    }

    function generateReport(startDate, endDate, reportType) {
        // Pegar dados do localStorage
        const visitantes = JSON.parse(localStorage.getItem('visitantes')) || [];
        const moradores = JSON.parse(localStorage.getItem('moradores')) || [];
        const entregas = JSON.parse(localStorage.getItem('entregas')) || [];
        const perfis = JSON.parse(localStorage.getItem('perfis')) || [];

        // Filtrar os dados com base no intervalo de datas
        const filteredVisitantes = filterDataByDate(visitantes, startDate, endDate, 'dataCadastro');
        const filteredMoradores = filterDataByDate(moradores, startDate, endDate, 'dataCadastro');
        const filteredEntregas = filterDataByDate(entregas, startDate, endDate, 'dataEntrega');

        // Gerar o conteúdo do relatório com base no tipo de relatório
        let reportContent = '';
        switch (reportType) {
            case 'all':
                reportContent = generateAllReport(filteredVisitantes, filteredMoradores, filteredEntregas, perfis, startDate, endDate);
                break;
            case 'visitantes':
                reportContent = generateVisitantesReport(filteredVisitantes, startDate, endDate);
                break;
            case 'moradores':
                reportContent = generateMoradoresReport(filteredMoradores, startDate, endDate);
                break;
            case 'entregas':
                reportContent = generateEntregasReport(filteredEntregas, startDate, endDate);
                break;
            default:
                reportContent = '<p>Nenhum dado encontrado para o tipo de relatório selecionado.</p>';
        }

        // Exibir o relatório gerado
        displayGeneratedReport(reportContent, reportType, startDate, endDate);

        // Adicionar botões de download
        addDownloadButtons(reportContent, reportType, startDate, endDate);
    }


    // Function to filter data by date range
    // Função para filtrar os dados por intervalo de datas
    function filterDataByDate(data, startDate, endDate, dateField) {
        const start = new Date(startDate); // A data de início
        const end = new Date(endDate); // A data de término

        return data.filter(item => {
            // Se a data do item não existir, ignorar esse item
            if (!item[dateField]) return false;

            // Converter a data armazenada no campo dateField para um objeto Date
            const itemDate = new Date(item[dateField]);

            // Comparar se a data do item está dentro do intervalo
            return itemDate >= start && itemDate <= end;
        });
    }


    // Function to generate report for all data
    function generateAllReport(visitantes, moradores, entregas, perfis, startDate, endDate) {
        let report = `<h2>Relatório Completo de ${startDate} a ${endDate}</h2>`;

        report += '<h3>Visitantes</h3>';
        if (visitantes.length > 0) {
            report += '<ul>';
            visitantes.forEach(visitante => {
                report += '<li>';
                report += `<p><strong>Visitante:</strong> ${visitante.nome}</p>`;
                report += `<p><strong>Apartamento:</strong> ${visitante.apartamento}</p>`;
                report += `<p><strong>Cadastrado em:</strong> ${visitante.dataCadastro}</p>`;
                report += `<p><strong>Por:</strong> ${visitante.cadastradoPor}</p>`;
                if (visitante.dataEdicao) {
                    report += `<p>- <strong>Editado</strong> em: ${visitante.dataEdicao}, Por: ${visitante.editadoPor}</p>`;
                }
                if (visitante.dataExclusao) {
                    report += `<p>- <strong>Excluído</strong> em: ${visitante.dataExclusao}, Por: ${visitante.excluidoPor}</p>`;
                }
                report += '</li>';
            });
            report += '</ul>';
        } else {
            report += '<p>Nenhum visitante cadastrado no período selecionado.</p>';
        }

        report += '<h3>Moradores</h3>';
        if (moradores.length > 0) {
            report += '<ul>';
            moradores.forEach(morador => {
                report += '<li>';
                report += `<p><strong>Morador:</strong> ${morador.nomeMorador}</p>`;
                report += `<p><strong>Apartamento:</strong> ${morador.apartamentoMorador}</p>`;
                report += `<p><strong>Cadastrado em:</strong> ${morador.dataCadastro}</p>`;
                report += `<p><strong>Por:</strong> ${morador.cadastradoPor}</p>`;
                if (morador.dataEdicao) {
                    report += `<p>- <strong>Editado</strong> em: ${morador.dataEdicao}, Por: ${morador.editadoPor}</p>`;
                }
                if (morador.dataExclusao) {
                    report += `<p>- <strong>Excluído</strong> em: ${morador.dataExclusao}, Por: ${morador.excluidoPor}</p>`;
                }
                report += '</li>';
            });
            report += '</ul>';
        } else {
            report += '<p>Nenhum morador cadastrado no período selecionado.</p>';
        }

        report += '<h3>Entregas</h3>';
        if (entregas.length > 0) {
            report += '<ul>';
            entregas.forEach(entrega => {
                report += '<li>';
                report += `<p><strong>Entrega para:</strong> ${entrega.destinatario}</p>`;
                report += `<p><strong>Empresa:</strong> ${entrega.empresa}</p>`;
                report += `<p><strong>Apartamento:</strong> ${entrega.apartamento}</p>`;
                report += `<p><strong>Cadastrado em:</strong> ${entrega.dataCadastro}</p>`;
                report += `<p><strong>Por:</strong> ${entrega.cadastradoPor}</p>`;
                if (entrega.dataEdicao) {
                    report += `<p>- <strong>Editado</strong> em: ${entrega.dataEdicao}, Por: ${entrega.editadoPor}</p>`;
                }
                if (entrega.dataExclusao) {
                    report += `<p>- <strong>Excluído</strong> em: ${entrega.dataExclusao}, Por: ${entrega.excluidoPor}</p>`;
                }
                report += '</li>';
            });
            report += '</ul>';
        } else {
            report += '<p>Nenhuma entrega registrada no período selecionado.</p>';
        }

        report += '<h3>Acessos</h3>';
        if (perfis.length > 0) {
            report += '<ul>';
            perfis.forEach(perfil => {
                report += '<li>';
                report += `<p><strong>Nome:</strong> ${perfil.nomeAcesso}</p>`;
                report += `<p><strong>Tipo:</strong> ${perfil.tipoPerfil}</p>`;
                report += `<p><strong>Email:</strong> ${perfil.emailAcesso}</p>`;
                report += '</li>';
            });
            report += '</ul>';
        } else {
            report += '<p>Nenhum acesso registrado no período selecionado.</p>';
        }

        return report;
    }

    // Function to display the generated report
    function displayGeneratedReport(reportContent, reportType, startDate, endDate) {
        generatedFileContainer.innerHTML = `
            <div class="generated-file">
                <p>Relatório de ${reportType} de ${startDate} a ${endDate}:</p>
            </div>
        `;
    }

    // Function to add download buttons (HTML and PDF)
    function addDownloadButtons(reportContent, reportType, startDate, endDate) {
        const htmlButton = document.createElement('button');
        htmlButton.textContent = 'Download HTML';
        htmlButton.classList.add('report-button');
        htmlButton.style.backgroundColor = '#5cb85c'; // Green color
        htmlButton.style.borderColor = '#4cae4c';
        htmlButton.addEventListener('click', () => downloadHTML(reportContent, reportType, startDate, endDate));

        const xlsxButton = document.createElement('button');
        xlsxButton.textContent = 'Download XLSX';
        xlsxButton.classList.add('report-button');
        xlsxButton.style.backgroundColor = '#f0ad4e'; // Orange color
        xlsxButton.style.borderColor = '#eea236';
        xlsxButton.addEventListener('click', () => downloadXLSX(reportContent, reportType, startDate, endDate));

        const visualizeButton = document.createElement('button');
        visualizeButton.textContent = 'Visualizar Relatório';
        visualizeButton.classList.add('report-button');
        visualizeButton.style.backgroundColor = '#5bc0de'; // Light Blue color
        visualizeButton.style.borderColor = '#46b8da';
        visualizeButton.addEventListener('click', () => visualizeReport(reportContent, reportType, startDate, endDate));

        generatedFileContainer.appendChild(visualizeButton);
        generatedFileContainer.appendChild(htmlButton);
        generatedFileContainer.appendChild(xlsxButton);
    }

    // Function to visualize the report in a modal
    function visualizeReport(reportContent, reportType, startDate, endDate) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; overflow: auto;">
                <h2>Relatório de ${reportType} (${startDate} - ${endDate})</h2>
                <div style="margin-bottom: 20px; max-height: 400px; overflow: auto; border: 1px solid #ccc; padding: 10px;">
                    ${reportContent}
                </div>
                <button class="close-modal">Fechar</button>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
            modal.remove();
        });
    }

    // Function to download report as HTML
    function downloadHTML(reportContent, reportType, startDate, endDate) {
        const filename = `relatorio_${reportType}_${startDate}_${endDate}.html`;
        // Basic HTML structure with styles
        const styledReportContent = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>Relatório de ${reportType} (${startDate} - ${endDate})</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h2, h3 { color: #333; }
                    p { margin-bottom: 5px; }
                    strong { font-weight: bold; }
                </style>
            </head>
            <body>
                ${reportContent}
            </body>
            </html>
        `;

        const blob = new Blob([styledReportContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Function to download report as XLSX
    async function downloadXLSX(reportContent, reportType, startDate, endDate) {
        // Dynamically import xlsx
        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs');

        // Prepare data for XLSX
        const wb = XLSX.utils.book_new();
        const ws_name = "Relatório";

        // Extract data from reportContent (assuming it's HTML)
        const extractTableData = (reportContent) => {
            const tableData = [];
            const sections = reportContent.split('<h3>');

            sections.forEach(section => {
                if (!section) return;

                const sectionTitleMatch = section.match(/^(.*?)<\/h3>/);
                const sectionTitle = sectionTitleMatch ? sectionTitleMatch[1] : "Dados";

                tableData.push([sectionTitle]); // Section Title
                tableData.push([]); // Empty row for spacing

                // Extract data rows from the section
                const dataRows = section.split('<p>');
                dataRows.forEach(row => {
                    if (!row) return;

                    const rowData = row.replace(/<[^>]*>/g, '').split(': '); // Clean up HTML tags
                    if (rowData.length > 1) {
                        tableData.push(rowData); // Data Row
                    }
                });
                tableData.push([]); // Empty row after each section
            });

            return tableData;
        };

        const extractedData = extractTableData(reportContent);

        const ws = XLSX.utils.aoa_to_sheet(extractedData);

        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        XLSX.writeFile(wb, `relatorio_${reportType}_${startDate}_${endDate}.xlsx`);
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
