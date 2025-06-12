document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (!localStorage.getItem('loggedIn')) {
        localStorage.setItem('loggedIn', 'true'); // Bypass
    }

    // Carregar funcionários
    carregarFuncionarios();

    // Configurar eventos
    document.getElementById('buscaFuncionario').addEventListener('input', filtrarFuncionarios);
    document.getElementById('filtroCargo').addEventListener('change', filtrarFuncionarios);
    document.getElementById('filtroStatus').addEventListener('change', filtrarFuncionarios);
    document.getElementById('btnFiltrar').addEventListener('click', filtrarFuncionarios);
    document.getElementById('formNovoFuncionario').addEventListener('submit', salvarFuncionario);

    // Configurar modais de importar/exportar
    document.querySelector('#modalImportar .btn-primary').addEventListener('click', importarFuncionarios);
    document.querySelector('#modalExportar .btn-primary').addEventListener('click', exportarFuncionarios);
});

// Dados mockados
let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [
    {
        id: '#1001',
        nome: 'Dr. Lucas Mendes',
        crm: '123456-SP',
        cargo: 'Médico',
        telefone: '(11) 98765-4321',
        admissao: '2020-01-01',
        status: 'Ativo',
        especialidade: 'Neurologia'
    },
    {
        id: '#1002',
        nome: 'Dra. Sofia Ribeiro',
        crm: '654321-SP',
        cargo: 'Médico',
        telefone: '(11) 91234-5678',
        admissao: '2020-02-15',
        status: 'Ativo',
        especialidade: 'Cirurgiã Geral'
    }
];

// Carregar funcionários
function carregarFuncionarios() {
    const tbody = document.getElementById('tabelaFuncionarios');
    if (tbody) {
        tbody.innerHTML = funcionarios.map(funcionario => `
            <tr>
                <td>${funcionario.id}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.crm}</td>
                <td>${funcionario.cargo}</td>
                <td>${funcionario.telefone}</td>
                <td>${formatarData(funcionario.admissao)}</td>
                <td>
                    <span class="badge ${funcionario.status === 'Ativo' ? 'bg-success' : funcionario.status === 'Inativo' ? 'bg-danger' : 'bg-warning'}">
                        ${funcionario.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarFuncionario('${funcionario.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info me-1" onclick="visualizarFuncionario('${funcionario.id}')" title="Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="desativarFuncionario('${funcionario.id}')" title="Desativar">
                        <i class="fas fa-ban"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Formatar data
function formatarData(dataString) {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Filtrar funcionários
function filtrarFuncionarios() {
    const busca = document.getElementById('buscaFuncionario').value.toLowerCase();
    const cargo = document.getElementById('filtroCargo').value;
    const status = document.getElementById('filtroStatus').value;

    const filtrados = funcionarios.filter(funcionario => {
        const matchNome = funcionario.nome.toLowerCase().includes(busca);
        const matchCargo = !cargo || funcionario.cargo === cargo;
        const matchStatus = !status || funcionario.status === status;
        return matchNome && matchCargo && matchStatus;
    });

    const tbody = document.getElementById('tabelaFuncionarios');
    if (tbody) {
        tbody.innerHTML = filtrados.map(funcionario => `
            <tr>
                <td>${funcionario.id}</td>
                <td>${funcionario.nome}</td>
                <td>${funcionario.crm}</td>
                <td>${funcionario.cargo}</td>
                <td>${funcionario.telefone}</td>
                <td>${formatarData(funcionario.admissao)}</td>
                <td>
                    <span class="badge ${funcionario.status === 'Ativo' ? 'bg-success' : funcionario.status === 'Inativo' ? 'bg-danger' : 'bg-warning'}">
                        ${funcionario.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarFuncionario('${funcionario.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info me-1" onclick="visualizarFuncionario('${funcionario.id}')" title="Detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="desativarFuncionario('${funcionario.id}')" title="Desativar">
                        <i class="fas fa-ban"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Salvar novo funcionário
function salvarFuncionario(event) {
    event.preventDefault();
    const form = document.getElementById('formNovoFuncionario');
    const formData = new FormData(form);

    const novoFuncionario = {
        id: `#${1000 + funcionarios.length + 1}`,
        nome: formData.get('nome'),
        crm: formData.get('crm'),
        cargo: formData.get('cargo'),
        especialidade: formData.get('especialidade') || 'N/A',
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        admissao: formData.get('admissao'),
        status: formData.get('status')
    };

    funcionarios.push(novoFuncionario);
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    carregarFuncionarios();
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById('modalNovoFuncionario')).hide();
    alert('Funcionário adicionado com sucesso!');
}

// Funções de manipulação
function editarFuncionario(id) {
    alert(`Editar funcionário ID: ${id} (funcionalidade em desenvolvimento)`);
}

function visualizarFuncionario(id) {
    const funcionario = funcionarios.find(f => f.id === id);
    if (funcionario) {
        alert(`
            Nome: ${funcionario.nome}
            CRM/Registro: ${funcionario.crm}
            Cargo: ${funcionario.cargo}
            Especialidade: ${funcionario.especialidade}
            Email: ${funcionario.email}
            Telefone: ${funcionario.telefone}
            Admissão: ${formatarData(funcionario.admissao)}
            Status: ${funcionario.status}
        `);
    }
}

function desativarFuncionario(id) {
    const funcionario = funcionarios.find(f => f.id === id);
    if (funcionario) {
        funcionario.status = 'Inativo';
        localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
        carregarFuncionarios();
        alert(`Funcionário ${funcionario.nome} desativado!`);
    }
}

function importarFuncionarios() {
    alert('Funcionalidade de importação em desenvolvimento.');
}

function exportarFuncionarios() {
    const csv = [
        ['ID', 'Nome', 'CRM/Registro', 'Cargo', 'Especialidade', 'Email', 'Telefone', 'Admissão', 'Status'],
        ...funcionarios.map(f => [
            f.id,
            f.nome,
            f.crm,
            f.cargo,
            f.especialidade,
            f.email,
            f.telefone,
            f.admissao,
            f.status
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'funcionarios.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    bootstrap.Modal.getInstance(document.getElementById('modalExportar')).hide();
}