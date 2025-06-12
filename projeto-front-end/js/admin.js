const config = {
    unidades: ['Hospital', 'Clínica', 'Laboratório', 'Home Care'],
    especialidades: ['Médico', 'Enfermeiro', 'Técnico'],
    status: ['Ativo', 'Inativo', 'Em Férias', 'Afastado']
};

// Dados mockados
let unidades = [
    { id: 'u1', nome: 'Hospital Central', tipo: 'Hospital', endereco: 'Rua A, 123', capacidade: 100, status: 'Ativo' }
];
let pacientes = [
    { id: 'p1', nome: 'João Silva', cpf: '123.456.789-00', unidade: 'Hospital Central', ultimaConsulta: '2025-06-01', status: 'Ativo' }
];
let profissionais = [
    { id: 'pr1', nome: 'Dr. Maria Oliveira', especialidade: 'Médico', unidade: 'Hospital Central', status: 'Ativo' }
];
let teleconsultas = [
    { id: 't1', dataHora: '2025-06-12 10:00', paciente: 'João Silva', profissional: 'Dr. Maria Oliveira', status: 'Agendada' }
];
let logs = [
    { id: 'l1', dataHora: '2025-06-10 14:30', usuario: 'admin', acao: 'Cadastro', modulo: 'Unidades', ip: '127.0.0.1', detalhes: 'Unidade cadastrada' }
];

// Funções de Autenticação
class Auth {
    static isAuthenticated() {
        if (!localStorage.getItem('loggedIn')) {
            localStorage.setItem('loggedIn', 'true'); // Forçar bypass
        }
        return true; // Sempre autenticado para front-end puro
    }

    static logout() {
        localStorage.removeItem('loggedIn');
        window.location.href = 'index.html';
    }
}

// Funções de Gestão de Unidades
class Unidades {
    static listar() {
        return unidades;
    }

    static cadastrar(unidade) {
        const novaUnidade = { id: `u${Math.random().toString(36).substr(2, 9)}`, ...unidade, status: 'Ativo' };
        unidades.push(novaUnidade);
        return novaUnidade;
    }
}

// Funções de Gestão de Pacientes
class Pacientes {
    static listar() {
        return pacientes;
    }

    static cadastrar(paciente) {
        const novoPaciente = { id: `p${Math.random().toString(36).substr(2, 9)}`, ...paciente, status: 'Ativo' };
        pacientes.push(novoPaciente);
        return novoPaciente;
    }

    static buscarPorCPF(cpf) {
        return pacientes.find(p => p.cpf === cpf) || null;
    }
}

// Funções de Gestão de Profissionais
class Profissionais {
    static listar() {
        return profissionais;
    }

    static cadastrar(profissional) {
        const novoProfissional = { id: `pr${Math.random().toString(36).substr(2, 9)}`, ...profissional, status: 'Ativo' };
        profissionais.push(novoProfissional);
        return novoProfissional;
    }
}

// Funções de Telemedicina
class Telemedicina {
    static listarConsultas() {
        return teleconsultas;
    }

    static agendarConsulta(consulta) {
        const novaConsulta = { id: `t${Math.random().toString(36).substr(2, 9)}`, ...consulta, status: 'Agendada' };
        teleconsultas.push(novaConsulta);
        return novaConsulta;
    }

    static iniciarConsulta(id) {
        const consulta = teleconsultas.find(c => c.id === id);
        if (consulta) {
            consulta.status = 'Iniciada';
            return consulta;
        }
        return null;
    }
}

// Funções de Auditoria
class Auditoria {
    static listarLogs() {
        return logs;
    }

    static registrarLog(acao, modulo, detalhes) {
        const novoLog = {
            id: `l${Math.random().toString(36).substr(2, 9)}`,
            dataHora: new Date().toLocaleString('pt-BR'),
            usuario: 'admin',
            acao,
            modulo,
            detalhes,
            ip: '127.0.0.1'
        };
        logs.push(novoLog);
        return novoLog;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados sem verificar autenticação (bypass garantido pela classe Auth)
    carregarUnidades();
    carregarPacientes();
    carregarProfissionais();
    carregarTeleconsultas();
    carregarLogs();
    configurarEventListeners();
});

// Funções de Carregamento
function carregarUnidades() {
    const unidades = Unidades.listar();
    const tbody = document.getElementById('tabelaUnidades');
    if (tbody) {
        tbody.innerHTML = unidades.map(unidade) (`
            <tr>
                <td>${unidade.nome}</td>
                <td>${unidade.tipo}</td>
                <td>${unidade.status}</td>
                <td>${unidade.capacidade}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarUnidade('${unidade.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="excluirUnidade('${unidade.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function carregarPacientes() {
    const pacientes = Pacientes.listar();
    const tbody = document.getElementById('tabelaPacientes');
    if (tbody) {
        tbody.innerHTML = pacientes.map((paciente) => `
            <tr>
                <td>${paciente.id}</td>
                <td>${paciente.nome}</td>
                <td>${paciente.cpf}</td>
                <td>${paciente.unidade}</td>
                <td>${paciente.ultimaConsulta || 'N/A'}</td>
                <td>${paciente.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarPaciente('${paciente.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="visualizarProntuario('${paciente.id}')">
                        <i class="fas fa-file-medical"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function carregarProfissionais() {
    const profissionais = Profissionais.listar();
    const tbody = document.getElementById('tabelaProfissionais');
    if (tbody) {
        tbody.innerHTML = profissionais.map((profissional) => `
            <tr>
                <td>${profissional.id}</td>
                <td>${profissional.nome}</td>
                <td>${profissional.especialidade}</td>
                <td>${profissional.unidade}</td>
                <td>${profissional.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editarProfissional('${profissional.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="visualizarAgenda('${profissional.id}')">
                        <i class="fas fa-calendar"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function carregarTeleconsultas() {
    const consultas = Telemedicina.listarConsultas();
    const tbody = document.getElementById('tabelaTeleconsultas');
    if (tbody) {
        tbody.innerHTML = consultas.map((consulta) => `
            <tr>
                <td>${consulta.dataHora}</td>
                <td>${consulta.paciente}</td>
                <td>${consulta.profissional}</td>
                <td>${consulta.status}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="iniciarConsulta('${consulta.id}')">
                        <i class="fas fa-video"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cancelarConsulta('${consulta.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function carregarLogs() {
    const logs = Auditoria.listarLogs();
    const tbody = document.getElementById('tabelaAuditoria');
    if (tbody) {
        tbody.innerHTML = logs.map((log) => `
            <tr>
                <td>${log.dataHora}</td>
                <td>${log.usuario}</td>
                <td>${log.acao}</td>
                <td>${log.modulo}</td>
                <td>${log.ip}</td>
                <td>${log.detalhes}</td>
            </tr>
        `).join('');
    }
}

// Configuração de Event Listeners
function configurarEventListeners() {
    const formUnidade = document.getElementById('formUnidade');
    if (formUnidade) {
        formUnidade.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const unidade = {
                nome: formData.get('nome'),
                tipo: formData.get('tipo'),
                endereco: formData.get('endereco'),
                capacidade: parseInt(formData.get('capacidade')),
            };
            Unidades.cadastrar(unidade);
            Auditoria.registrarLog('Cadastro', 'Unidades', `Nova unidade cadastrada: ${unidade.nome}`);
            carregarUnidades();
            formUnidade.reset();
            alert('Unidade cadastrada com sucesso!');
        });
    }

    const formNovoProfissional = document.getElementById('formNovoProfissional');
    if (formNovoProfissional) {
        formNovoProfissional.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const profissional = {
                nome: formData.get('nome'),
                cpf: formData.get('cpf'),
                especialidade: formData.get('especialidade'),
                unidade: formData.get('unidade'),
            };
            Profissionais.cadastrar(profissional);
            Auditoria.registrarLog('Cadastro', 'Profissionais', `Novo profissional cadastrado: ${profissional.nome}`);
            carregarProfissionais();
            formNovoProfissional.reset();
            alert('Profissional cadastrado com sucesso!');
        });
    }
}

// Funções de Manipulação
function editarUnidade(id) {
    alert(`Editar unidade ID: ${id} (funcionalidade em desenvolvimento)`);
}

function excluirUnidade(id) {
    unidades = unidades.filter((u) => u.id !== id);
    Auditoria.registrarLog('Exclusão', 'Unidades', `Unidade ID ${id} excluída`);
    carregarUnidades();
}

function editarPaciente(id) {
    alert(`Editar paciente ID: ${id} (funcionalidade em desenvolvimento)`);
}

function visualizarProntuario(id) {
    window.location.href = `prontuario.html?id=${id}`;
}

function editarProfissional(id) {
    alert(`Editar profissional ID: ${id} (funcionalidade em desenvolvimento)`);
}

function visualizarAgenda(id) {
    alert(`Visualizar agenda do profissional ID: ${id} (funcionalidade em desenvolvimento)`);
}

function iniciarConsulta(id) {
    const consulta = Telemedicina.iniciarConsulta(id);
    if (consulta) {
        window.location.href = `telemedicina.html?id=${id}`;
    }
}

function cancelarConsulta(id) {
    teleconsultas = teleconsultas.filter((c) => c.id !== id);
    Auditoria.registrarLog('Cancelamento', 'Telemedicina', `Consulta ID ${id} cancelada`);
    carregarTeleconsultas();
}