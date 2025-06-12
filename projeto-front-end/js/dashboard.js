document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (!localStorage.getItem('loggedIn')) {
        localStorage.setItem('loggedIn', 'true'); // Forçar bypass
    }

    // Carregar todas as seções
    carregarEstatisticas();
    carregarProximasConsultas();
    carregarProntuarios();
    carregarInfoHospital();
    carregarAlertas();
});

// Dados mockados
const estatisticas = {
    pacientesAtivos: { valor: 1247, tendencia: '+12% este mês' },
    consultasHoje: { valor: 86, detalhe: '15 teleconsultas' },
    teleconsultas: { valor: 42, tendencia: '+8% esta semana' },
    leitosOcupados: { valor: 78, detalhe: '92% de ocupação' }
};

const proximasConsultas = [
    { id: 'c1', horario: '2025-06-11T14:30', paciente: 'Beatriz Costa', medico: 'Dra. Sofia Ribeiro', especialidade: 'Cirurgiã Geral', status: 'Confirmada' },
    { id: 'c2', horario: '2025-06-11T15:45', paciente: 'Rafael Almeida', medico: 'Dr. Lucas Mendes', especialidade: 'Neurologia', status: 'Pendente' },
    { id: 'c3', horario: '2025-06-11T16:30', paciente: 'Juliana Lima', medico: 'Dra. Sofia Ribeiro', especialidade: 'Cirurgiã Geral', status: 'Em Andamento' },
    { id: 'c4', horario: '2025-06-11T17:15', paciente: 'Gabriel Santos', medico: 'Dr. Lucas Mendes', especialidade: 'Neurologia', status: 'Confirmada' }
];

const prontuarios = [
    { id: 'p12345', paciente: 'Beatriz Costa', medico: 'Dra. Sofia Ribeiro', data: '2025-06-10', especialidade: 'Cirurgiã Geral', status: 'Concluído' },
    { id: 'p12346', paciente: 'Rafael Almeida', medico: 'Dr. Lucas Mendes', data: '2025-06-10', especialidade: 'Neurologia', status: 'Em Andamento' },
    { id: 'p12347', paciente: 'Juliana Lima', medico: 'Dra. Sofia Ribeiro', data: '2025-06-09', especialidade: 'Cirurgiã Geral', status: 'Em Revisão' },
    { id: 'p12348', paciente: 'Gabriel Santos', medico: 'Dr. Lucas Mendes', data: '2025-06-09', especialidade: 'Neurologia', status: 'Concluído' }
];

const infoHospital = {
    nome: 'SGHSS',
    endereco: 'Av. Principal, 1000 - Centro<br>São Paulo - SP, 01234-567',
    telefone: '(11) 3333-4444',
    horario: 'Segunda a Sexta: 7h às 19h<br>Sábado: 8h às 14h<br>Domingo: 8h às 12h',
    email: 'contato@SGHSS.com.br',
    emergencia: '(11) 99999-9999'
};

const alertas = [
    { id: 'a1', tipo: 'Estoque Baixo', icone: 'fa-exclamation-triangle', cor: 'text-warning', mensagem: 'Paracetamol 500mg está com estoque abaixo do mínimo.', tempo: '3 min atrás' },
    { id: 'a2', tipo: 'Consulta Pendente', icone: 'fa-calendar-check', cor: 'text-info', mensagem: 'Dr. Lucas Mendes tem 3 consultas pendentes de confirmação.', tempo: '15 min atrás' },
    { id: 'a3', tipo: 'Backup do Sistema', icone: 'fa-database', cor: 'text-success', mensagem: 'Backup diário realizado com sucesso.', tempo: '1 hora atrás' }
];

// Função para formatar data e hora
function formatarDataHora(dataString) {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Carregar estatísticas
function carregarEstatisticas() {
    const container = document.getElementById('estatisticasContainer');
    if (container) {
        container.innerHTML = `
            <div class="col-md-3 mb-4">
                <div class="card stat-card">
                    <div class="card-body">
                        <h6 class="card-title">Pacientes Ativos</h6>
                        <h2 class="mb-0">${estatisticas.pacientesAtivos.valor}</h2>
                        <small>${estatisticas.pacientesAtivos.tendencia}</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card stat-card">
                    <div class="card-body">
                        <h6 class="card-title">Consultas Hoje</h6>
                        <h2 class="mb-0">${estatisticas.consultasHoje.valor}</h2>
                        <small>${estatisticas.consultasHoje.detalhe}</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card stat-card">
                    <div class="card-body">
                        <h6 class="card-title">Teleconsultas</h6>
                        <h2 class="mb-0">${estatisticas.teleconsultas.valor}</h2>
                        <small>${estatisticas.teleconsultas.tendencia}</small>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card stat-card">
                    <div class="card-body">
                        <h6 class="card-title">Leitos Ocupados</h6>
                        <h2 class="mb-0">${estatisticas.leitosOcupados.valor}</h2>
                        <small>${estatisticas.leitosOcupados.detalhe}</small>
                    </div>
                </div>
            </div>
        `;
    }
}

// Carregar próximas consultas
function carregarProximasConsultas() {
    const tbody = document.getElementById('tabelaConsultas');
    if (tbody) {
        tbody.innerHTML = proximasConsultas.map(consulta => `
            <tr>
                <td>${formatarDataHora(consulta.horario)}</td>
                <td>${consulta.paciente}</td>
                <td>${consulta.medico}</td>
                <td>${consulta.especialidade}</td>
                <td>
                    <span class="badge ${consulta.status === 'Confirmada' ? 'bg-success' : consulta.status === 'Pendente' ? 'bg-warning' : 'bg-info'}">
                        ${consulta.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="iniciarConsulta('${consulta.id}')" title="Iniciar">
                        <i class="fas fa-video"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cancelarConsulta('${consulta.id}')" title="Cancelar">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Carregar prontuários
function carregarProntuarios() {
    const tbody = document.getElementById('tabelaProntuarios');
    if (tbody) {
        tbody.innerHTML = prontuarios.map(prontuario => `
            <tr>
                <td>${prontuario.id}</td>
                <td>${prontuario.paciente}</td>
                <td>${prontuario.medico}</td>
                <td>${formatarDataHora(prontuario.data)}</td>
                <td>${prontuario.especialidade}</td>
                <td>
                    <span class="badge ${prontuario.status === 'Concluído' ? 'bg-success' : prontuario.status === 'Em Andamento' ? 'bg-warning' : 'bg-info'}">
                        ${prontuario.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarProntuario('${prontuario.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info me-1" onclick="visualizarProntuario('${prontuario.id}')" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirProntuario('${prontuario.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Carregar informações do hospital
function carregarInfoHospital() {
    document.getElementById('nomeHospital').innerHTML = infoHospital.nome;
    document.getElementById('enderecoHospital').innerHTML = infoHospital.endereco;
    document.getElementById('telefoneHospital').innerHTML = infoHospital.telefone;
    document.getElementById('horarioHospital').innerHTML = infoHospital.horario;
    document.getElementById('emailHospital').innerHTML = infoHospital.email;
    document.getElementById('emergenciaHospital').innerHTML = infoHospital.emergencia;
}

// Carregar alertas
function carregarAlertas() {
    const lista = document.getElementById('listaAlertas');
    if (lista) {
        lista.innerHTML = alertas.map(alerta => `
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1"><i class="fas ${alerta.icone} ${alerta.cor} me-2"></i>${alerta.tipo}</h6>
                    <small class="text-muted">${alerta.tempo}</small>
                </div>
                <p class="mb-1">${alerta.mensagem}</p>
            </a>
        `).join('');
    }
}

// Funções de manipulação
function iniciarConsulta(id) {
    const consulta = proximasConsultas.find(c => c.id === id);
    if (consulta) {
        consulta.status = 'Em Andamento';
        carregarProximasConsultas();
        alert(`Consulta com ${consulta.paciente} iniciada!`);
    }
}

function cancelarConsulta(id) {
    const index = proximasConsultas.findIndex(c => c.id === id);
    if (index !== -1) {
        proximasConsultas.splice(index, 1);
        carregarProximasConsultas();
        alert('Consulta cancelada com sucesso!');
    }
}

function editarProntuario(id) {
    alert(`Editar prontuário ID: ${id} (funcionalidade em desenvolvimento)`);
}

function visualizarProntuario(id) {
    window.location.href = `prontuario.html?id=${id}`;
}

function excluirProntuario(id) {
    const index = prontuarios.findIndex(p => p.id === id);
    if (index !== -1) {
        prontuarios.splice(index, 1);
        carregarProntuarios();
        alert('Prontuário excluído com sucesso!');
    }
}