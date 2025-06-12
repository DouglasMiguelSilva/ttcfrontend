document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados
    inicializarDados();
    carregarNavbar();
    carregarPacientes();
    carregarEstatisticas();
    carregarConsultas();
    carregarDropdowns();

    // Configurar eventos
    const formCadastro = document.getElementById('formCadastroPaciente');
    if (formCadastro) {
        formCadastro.addEventListener('submit', salvarPaciente);
    }
    const formAgendamento = document.getElementById('formAgendamento');
    if (formAgendamento) {
        formAgendamento.addEventListener('submit', agendarConsulta);
    }
    const formRelatorio = document.getElementById('formRelatorio');
    if (formRelatorio) {
        formRelatorio.addEventListener('submit', gerarRelatorio);
    }
    const buscaPaciente = document.getElementById('buscaPaciente');
    if (buscaPaciente) {
        buscaPaciente.addEventListener('input', filtrarPacientes);
    }
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarPacientes);
    }

    // Adicionar máscaras
    const cpfInput = document.querySelector('input[name="cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('input', e => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                e.target.value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }
        });
    }
    const telefoneInput = document.querySelector('input[name="telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', e => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                e.target.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        });
    }
});

// Inicializar dados mockados
function inicializarDados() {
    if (!localStorage.getItem('pacientes')) {
        const pacientesIniciais = [
            { id: 1, nome: "Clara Souza", cpf: "123.456.789-00", telefone: "(11) 98765-4321", email: "clara.souza@example.com", endereco: "Rua das Flores, 123", dataNascimento: "1990-05-15", plano: "Básico", status: "Ativo", observacoes: "Alérgica a Dipirona", ultimaConsulta: "2025-06-10" },
            { id: 2, nome: "Lucas Ferreira", cpf: "987.654.321-00", telefone: "(11) 91234-5678", email: "lucas.ferreira@example.com", endereco: "Av. Central, 456", dataNascimento: "1985-08-20", plano: "Premium", status: "Ativo", observacoes: "Hipertenso", ultimaConsulta: "2025-06-09" },
            { id: 3, nome: "Fernanda Lima", cpf: "456.789.123-00", telefone: "(11) 99876-5432", email: "fernanda.lima@example.com", endereco: "Rua do Centro, 789", dataNascimento: "1992-03-10", plano: "VIP", status: "Primeiro", observacoes: "", ultimaConsulta: "2025-06-08" },
            { id: 4, nome: "Rafael Costa", cpf: "789.123.456-00", telefone: "(11) 97777-8888", email: "rafael.costa@example.com", endereco: "Av. Nova, 101", dataNascimento: "1988-11-25", plano: "Básico", status: "Ativo", observacoes: "Diabético", ultimaConsulta: "2025-06-07" }
        ];
        localStorage.setItem('pacientes', JSON.stringify(pacientesIniciais));
    }

    if (!localStorage.getItem('consultas')) {
        const consultasIniciais = [
            { id: 1, pacienteId: 1, medicoId: 3, data: "2025-06-11", horario: "14:30", tipo: "Telemedicina", especialidade: "Cardiologia", status: "Confirmada", observacoes: "" },
            { id: 2, pacienteId: 2, medicoId: 2, data: "2025-06-11", horario: "15:45", tipo: "Presencial", especialidade: "Neurologia", status: "Pendente", observacoes: "" },
            { id: 3, pacienteId: 3, medicoId: 3, data: "2025-06-10", horario: "16:30", tipo: "Telemedicina", especialidade: "Cardiologia", status: "Concluída", observacoes: "" },
            { id: 4, pacienteId: 4, medicoId: 2, data: "2025-06-10", horario: "17:00", tipo: "Presencial", especialidade: "Neurologia", status: "Confirmada", observacoes: "" },
            { id: 5, pacienteId: 1, medicoId: 3, data: "2025-06-09", horario: "10:00", tipo: "Presencial", especialidade: "Cardiologia", status: "Concluída", observacoes: "" },
            { id: 6, pacienteId: 2, medicoId: 3, data: "2025-06-09", horario: "11:00", tipo: "Telemedicina", especialidade: "Cardiologia", status: "Concluída", observacoes: "" },
            // Simulando mais 39 consultas para Sofia (medicoId: 3)
            ...Array.from({ length: 39 }, (_, i) => ({
                id: 7 + i,
                pacienteId: (i % 4) + 1,
                medicoId: 3,
                data: `2025-06-${10 - (i % 3)}`,
                horario: `${10 + (i % 8)}:00`,
                tipo: "Presencial",
                especialidade: "Cardiologia",
                status: "Concluída",
                observacoes: ""
            }))
        ];
        localStorage.setItem('consultas', JSON.stringify(consultasIniciais));
    }

    if (!localStorage.getItem('medicos')) {
        const medicosIniciais = [
            { id: 2, nome: "Dr. Lucas Mendes", especialidade: "Neurologia" },
            { id: 3, nome: "Dra. Sofia Ribeiro", especialidade: "Cardiologia" }
        ];
        localStorage.setItem('medicos', JSON.stringify(medicosIniciais));
    }
}

// Carregar navbar
function carregarNavbar() {
    const userMenu = document.getElementById('userMenu');
    const userName = localStorage.getItem('userName') || 'Usuário';
    userMenu.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                <i class="fas fa-user-circle me-2"></i>${userName}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="perfil.html"><i class="fas fa-user me-2"></i>Meu Perfil</a></li>
                <li><a class="dropdown-item" href="configuracao.html"><i class="fas fa-cog me-2"></i>Configurações</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="login.html" onclick="localStorage.removeItem('loggedIn'); localStorage.removeItem('userEmail'); localStorage.removeItem('userName'); localStorage.removeItem('userRole')"><i class="fas fa-sign-out-alt me-2"></i>Sair</a></li>
            </ul>
        </div>
    `;
}

// Carregar pacientes
function carregarPacientes(pacientesFiltrados = null) {
    const tbody = document.querySelector('#tabelaPacientes tbody');
    const pacientes = pacientesFiltrados || JSON.parse(localStorage.getItem('pacientes')) || [];
    tbody.innerHTML = '';

    pacientes.forEach(paciente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${paciente.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    <div class="avatar me-2">${paciente.nome.charAt(0)}</div>
                    <div>
                        <div class="fw-bold">${paciente.nome}</div>
                        <small class="text-muted">${paciente.email}</small>
                    </div>
                </div>
            </td>
            <td>${paciente.cpf}</td>
            <td>${paciente.telefone}</td>
            <td>${formatarData(paciente.ultimaConsulta)}</td>
            <td><span class="badge bg-${paciente.status === 'Ativo' ? 'success' : 'warning'}">${paciente.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editarPaciente(${paciente.id})" title="Editar"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-info me-1" onclick="visualizarProntuario(${paciente.id})" title="Prontuário"><i class="fas fa-file-medical"></i></button>
                <button class="btn btn-sm btn-danger" onclick="excluirPaciente(${paciente.id})" title="Excluir"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Carregar estatísticas
function carregarEstatisticas() {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    const hoje = new Date().toISOString().split('T')[0];
    const consultasHoje = consultas.filter(c => c.data === hoje).length;

    const estatisticas = [
        { id: 'totalPacientes', title: 'Total de Pacientes', value: pacientes.length, subtexto: 'Capacidade máxima 100', bg: 'info' },
        { id: 'consultasHoje', title: 'Consultas Hoje', value: consultasHoje, subtexto: 'Teleconsultas inclusas', bg: 'success' },
        { id: 'pacientesAtivos', title: 'Pacientes Ativos', value: pacientes.filter(p => p.status === 'Ativo').length, subtexto: 'Ativos no sistema', bg: 'primary' },
        { id: 'consultasPendentes', title: 'Consultas Pendentes', value: consultas.filter(c => c.status === 'Pendente').length, subtexto: 'Aguardando confirmação', bg: 'warning' }
    ];

    const container = document.getElementById('estatisticasContainer');
    container.innerHTML = estatisticas.map(stat => `
        <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm">
                <div class="card-body">
                    <h6 class="card-title text-muted">${stat.title}</h6>
                    <h3 class="card-text">${stat.value}</h3>
                    <p class="text-muted small">${stat.subtexto}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Carregar consultas
function carregarConsultas() {
    const tbody = document.querySelector('#tabelaConsultas tbody');
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

    tbody.innerHTML = '';
    consultas.forEach(consulta => {
        const paciente = pacientes.find(p => p.id === parseInt(consulta.pacienteId)) || {};
        const medico = medicos.find(m => m.id === parseInt(consulta.medicoId)) || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarData(consulta.data)} ${consulta.horario}</td>
            <td>${paciente.nome || 'N/A'}</td>
            <td>${medico.nome || 'N/A'}</td>
            <td>${consulta.especialidade || 'N/A'}</td>
            <td><span class="badge bg-${getStatusBadge(consulta.status)}">${consulta.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="iniciarConsulta(${consulta.id})" title="Iniciar"><i class="fas fa-video"></i></button>
                <button class="btn btn-sm btn-danger" onclick="cancelarConsulta(${consulta.id})" title="Cancelar"><i class="fas fa-times"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Carregar dropdowns
function carregarDropdowns() {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const selectPaciente = document.getElementById('selectPaciente');
    const selectMedico = document.getElementById('selectMedico');

    if (selectPaciente) {
        selectPaciente.innerHTML = '<option value="">Selecione um paciente</option>' + pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    }
    if (selectMedico) {
        selectMedico.innerHTML = '<option value="">Selecione um médico</option>' + medicos.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
    }
}

// Salvar paciente
function salvarPaciente(e) {
    e.preventDefault();
    const formulario = document.getElementById('formCadastroPaciente');
    const dadosForm = new FormData(formulario);
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

    // Validar CPF
    const cpf = dadosForm.get('cpf').replace(/\D/g, '');
    if (!validarCPF(cpf)) {
        mostrarNotificacao('CPF inválido!', 'danger');
        return;
    }

    // Validar email
    const email = dadosForm.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarNotificacao('Email inválido!', 'danger');
        return;
    }

    const paciente = {
        id: dadosForm.get('id') ? parseInt(dadosForm.get('id')) : pacientes.length + 1,
        nome: dadosForm.get('nome'),
        cpf: dadosForm.get('cpf'),
        dataNascimento: dadosForm.get('dataNascimento'),
        telefone: dadosForm.get('telefone'),
        email: dadosForm.get('email'),
        endereco: dadosForm.get('endereco'),
        plano: dadosForm.get('plano'),
        observacoes: dadosForm.get('observacoes'),
        status: dadosForm.get('id') ? pacientes.find(p => p.id === parseInt(dadosForm.get('id')))?.status || 'Ativo' : 'Ativo',
        ultimaConsulta: dadosForm.get('id') ? pacientes.find(p => p.id === parseInt(dadosForm.get('id')))?.ultimaConsulta || new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    };

    if (dadosForm.get('id')) {
        pacientes = pacientes.map(p => p.id === paciente.id ? paciente : p);
    } else {
        if (pacientes.some(p => p.cpf === paciente.cpf && p.id !== paciente.id)) {
            mostrarNotificacao('CPF já cadastrado!', 'danger');
            return;
        }
        pacientes.push(paciente);
    }

    localStorage.setItem('pacientes', JSON.stringify(pacientes));
    carregarPacientes();
    carregarEstatisticas();
    carregarDropdowns();

    formulario.reset();
    document.querySelector('#modalCadastroPaciente .btn-close').click();
    mostrarNotificacao('Paciente salvo com sucesso!', 'success');
}

// Editar paciente
function editarPaciente(id) {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes.find(p => p.id === id);
    if (paciente) {
        const formulario = document.getElementById('formCadastroPaciente');
        const modalTitle = document.querySelector('#modalCadastroPaciente .modal-title');
        
        // Atualizar título do modal
        modalTitle.innerHTML = '<i class="fas fa-user-edit me-2"></i>Editar Paciente';

        // Preencher formulário
        formulario.querySelector('[name="id"]').value = paciente.id;
        formulario.querySelector('[name="nome"]').value = paciente.nome;
        formulario.querySelector('[name="cpf"]').value = paciente.cpf;
        formulario.querySelector('[name="dataNascimento"]').value = paciente.dataNascimento;
        formulario.querySelector('[name="telefone"]').value = paciente.telefone;
        formulario.querySelector('[name="email"]').value = paciente.email;
        formulario.querySelector('[name="endereco"]').value = paciente.endereco;
        formulario.querySelector('[name="plano"]').value = paciente.plano;
        formulario.querySelector('[name="observacoes"]').value = paciente.observacoes;

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalCadastroPaciente'));
        modal.show();

        // Resetar título ao fechar modal
        modal._element.addEventListener('hidden.bs.modal', () => {
            modalTitle.innerHTML = '<i class="fas fa-user-plus me-2"></i>Novo Paciente';
            formulario.reset();
        }, { once: true });
    } else {
        mostrarNotificacao('Paciente não encontrado!', 'danger');
    }
}

// Agendar consulta
function agendarConsulta(e) {
    e.preventDefault();
    const formulario = document.getElementById('formAgendamento');
    const dadosForm = new FormData(formulario);
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];

    const consulta = {
        id: consultas.length + 1,
        pacienteId: parseInt(dadosForm.get('paciente')),
        medicoId: parseInt(dadosForm.get('medico')),
        data: dadosForm.get('data'),
        horario: dadosForm.get('horario'),
        tipo: dadosForm.get('tipo'),
        especialidade: JSON.parse(localStorage.getItem('medicos')).find(m => m.id === parseInt(dadosForm.get('medico')))?.especialidade || 'Geral',
        status: 'Pendente',
        observacoes: dadosForm.get('observacoes')
    };

    consultas.push(consulta);
    localStorage.setItem('consultas', JSON.stringify(consultas));
    carregarConsultas();
    carregarEstatisticas();

    formulario.reset();
    document.querySelector('#modalAgendamento .btn-close').click();
    mostrarNotificacao('Consulta agendada com sucesso!', 'success');
}

// Gerar relatório
function gerarRelatorio(e) {
    e.preventDefault();
    const formulario = document.getElementById('formRelatorio');
    const dadosForm = new FormData(formulario);
    const tipo = dadosForm.get('tipo');
    const dataInicio = dadosForm.get('dataInicio');
    const dataFim = dadosForm.get('dataFim');
    const formato = dadosForm.get('formato');

    let conteudo;
    if (tipo === 'pacientes') {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        conteudo = pacientes.map(p => `${p.id},${p.nome},${p.cpf},${p.status}`).join('\n');
    } else if (tipo === 'consultas') {
        const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
        conteudo = consultas.filter(c => c.data >= dataInicio && c.data <= dataFim)
            .map(c => `${c.id},${c.data},${c.horario},${c.status}`).join('\n');
    } else if (tipo === 'faturamento') {
        conteudo = 'Faturamento simulado,1000,2025-06';
    }

    if (formato === 'pdf') {
        console.log(`Gerando PDF: ${tipo} de ${dataInicio} a ${dataFim}\n${conteudo}`);
    } else {
        console.log(`Gerando Excel: ${tipo} de ${dataInicio} a ${dataFim}`);
    }

    document.querySelector('#modalRelatorio .btn-close').click();
    mostrarNotificacao('Relatório gerado com sucesso!', 'success');
}

// Ações de paciente
function visualizarProntuario(id) {
    mostrarNotificacao(`Visualizando prontuário do paciente ${id}`, 'info');
}

function excluirPaciente(id) {
    if (confirm('Tem certeza que deseja excluir este paciente?')) {
        let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        pacientes = pacientes.filter(p => p.id !== id);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        carregarPacientes();
        carregarEstatisticas();
        carregarDropdowns();
        mostrarNotificacao('Paciente excluído com sucesso!', 'success');
    }
}

// Ações de consulta
function iniciarConsulta(id) {
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultas = consultas.map(c => c.id === id ? { ...c, status: 'Em Andamento' } : c);
    localStorage.setItem('consultas', JSON.stringify(consultas));
    carregarConsultas();
    mostrarNotificacao('Consulta iniciada!', 'success');
}

function cancelarConsulta(id) {
    if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
        let consultas = JSON.parse(localStorage.getItem('consultas')) || [];
        consultas = consultas.filter(c => c.id !== id);
        localStorage.setItem('consultas', JSON.stringify(consultas));
        carregarConsultas();
        mostrarNotificacao('Consulta cancelada com sucesso!', 'success');
    }
}

// Filtros
function filtrarPacientes() {
    const termo = document.getElementById('buscaPaciente').value.toLowerCase();
    const status = document.getElementById('filtroStatus').value;
    const plano = document.getElementById('filtroPlano').value;

    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes = pacientes.filter(p =>
        (!termo ||
            p.nome.toLowerCase().includes(termo) ||
            p.cpf.toLowerCase().includes(termo) ||
            p.email.toLowerCase().includes(termo)) &&
        (!status || p.status === status) &&
        (!plano || p.plano === plano)
    );
    carregarPacientes(pacientes);
}

// Formatar data
function formatarData(dataString) {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Formata badge de status
function getStatusBadge(status) {
    switch (status) {
        case 'Confirmada': return 'success';
        case 'Pendente': return 'warning';
        case 'Em Andamento': return 'info';
        case 'Concluída': return 'primary';
        default: return 'secondary';
    }
}

// Validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}

// Mostrar notificação
function mostrarNotificacao(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${tipo} border-0 position-fixed bottom-0 end-0 m-3`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensagem}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    document.body.appendChild(toast);
    new bootstrap.Toast(toast).show();
    toast.addEventListener('hidden.bs.modal', () => toast.remove());
}
