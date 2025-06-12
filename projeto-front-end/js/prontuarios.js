document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Carregar dados
    carregarNavbar();
    carregarDropdowns();
    carregarProntuarios();
    carregarEstatisticas();

    // Configurar eventos
    const formNovoProntuario = document.getElementById('formNovoProntuario');
    if (formNovoProntuario) {
        formNovoProntuario.addEventListener('submit', salvarProntuario);
    }
    const formImportar = document.getElementById('formImportar');
    if (formImportar) {
        formImportar.addEventListener('submit', importarProntuarios);
    }
    const formExportar = document.getElementById('formExportar');
    if (formExportar) {
        formExportar.addEventListener('submit', exportarProntuarios);
    }
    const buscaProntuario = document.getElementById('buscaProntuario');
    if (buscaProntuario) {
        buscaProntuario.addEventListener('input', filtrarProntuarios);
    }
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarProntuarios);
    }
    const filtroMedico = document.getElementById('filtroMedico');
    if (filtroMedico) {
        filtroMedico.addEventListener('change', filtrarProntuarios);
    }
    const filtroEspecialidade = document.getElementById('filtroEspecialidade');
    if (filtroEspecialidade) {
        filtroEspecialidade.addEventListener('change', filtrarProntuarios);
    }
});

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

// Carregar dropdowns
function carregarDropdowns() {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const selectPaciente = document.getElementById('selectPaciente');
    const selectMedico = document.getElementById('selectMedico');
    const filtroMedico = document.getElementById('filtroMedico');
    const filtroEspecialidade = document.getElementById('filtroEspecialidade');

    if (selectPaciente) {
        selectPaciente.innerHTML = '<option value="">Selecione um paciente</option>' + 
            pacientes.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    }
    if (selectMedico) {
        selectMedico.innerHTML = '<option value="">Selecione um médico</option>' + 
            medicos.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
    }
    if (filtroMedico) {
        filtroMedico.innerHTML = '<option value="">Todos os Médicos</option>' + 
            medicos.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
    }
    if (filtroEspecialidade) {
        const especialidades = [...new Set(medicos.map(m => m.especialidade))];
        filtroEspecialidade.innerHTML = '<option value="">Todas as Especialidades</option>' + 
            especialidades.map(e => `<option value="${e}">${e}</option>`).join('');
    }
}

// Carregar prontuários
function carregarProntuarios(prontuariosFiltrados = null) {
    const tbody = document.querySelector('#tabelaProntuarios tbody');
    const prontuarios = prontuariosFiltrados || JSON.parse(localStorage.getItem('prontuarios')) || [];
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const pacienteId = new URLSearchParams(window.location.search).get('pacienteId');
    const pacienteNome = document.getElementById('pacienteNome');

    if (pacienteId) {
        const paciente = pacientes.find(p => p.id === parseInt(pacienteId));
        pacienteNome.textContent = paciente ? `Paciente: ${paciente.nome}` : '';
    } else {
        pacienteNome.textContent = '';
    }

    tbody.innerHTML = '';
    prontuarios
        .filter(p => !pacienteId || p.pacienteId === parseInt(pacienteId))
        .forEach(prontuario => {
            const paciente = pacientes.find(p => p.id === prontuario.pacienteId) || {};
            const medico = medicos.find(m => m.id === prontuario.medicoId) || {};
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${prontuario.id}</td>
                <td>${paciente.nome || 'N/A'}</td>
                <td>${medico.nome || 'N/A'}</td>
                <td>${prontuario.especialidade || 'N/A'}</td>
                <td>${formatarData(prontuario.data)}</td>
                <td><span class="badge bg-${getStatusBadge(prontuario.status)}">${prontuario.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarProntuario(${prontuario.id})" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-info me-1" onclick="visualizarProntuario(${prontuario.id})" title="Visualizar"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="excluirProntuario(${prontuario.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
}

// Carregar estatísticas
function carregarEstatisticas() {
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];
    const pacienteId = new URLSearchParams(window.location.search).get('pacienteId');
    const filtrados = pacienteId ? prontuarios.filter(p => p.pacienteId === parseInt(pacienteId)) : prontuarios;

    const estatisticas = [
        { id: 'totalProntuarios', title: 'Total de Prontuários', value: filtrados.length, subtexto: 'Todos os registros', bg: 'primary' },
        { id: 'concluidos', title: 'Concluídos', value: filtrados.filter(p => p.status === 'Concluído').length, subtexto: 'Prontuários finalizados', bg: 'success' },
        { id: 'emAndamento', title: 'Em Andamento', value: filtrados.filter(p => p.status === 'Em Andamento').length, subtexto: 'Prontuários abertos', bg: 'warning' },
        { id: 'emRevisao', title: 'Em Revisão', value: filtrados.filter(p => p.status === 'Em Revisão').length, subtexto: 'Aguardando revisão', bg: 'info' }
    ];

    const container = document.getElementById('estatisticasContainer');
    container.innerHTML = estatisticas.map(stat => `
        <div class="col-md-3 mb-3">
            <div class="card bg-${stat.bg} text-white">
                <div class="card-body">
                    <h6 class="card-title">${stat.title}</h6>
                    <h3 class="card-text">${stat.value}</h3>
                    <p class="small">${stat.subtexto}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Salvar prontuário
function salvarProntuario(e) {
    e.preventDefault();
    const formulario = document.getElementById('formNovoProntuario');
    const dadosForm = new FormData(formulario);
    let prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];

    const prontuario = {
        id: dadosForm.get('id') ? parseInt(dadosForm.get('id')) : prontuarios.length + 1,
        pacienteId: parseInt(dadosForm.get('pacienteId')),
        medicoId: parseInt(dadosForm.get('medicoId')),
        data: dadosForm.get('data'),
        tipo: dadosForm.get('tipo'),
        queixaPrincipal: dadosForm.get('queixaPrincipal'),
        historiaDoenca: dadosForm.get('historiaDoenca'),
        exameFisico: dadosForm.get('exameFisico'),
        diagnostico: dadosForm.get('diagnostico'),
        conduta: dadosForm.get('conduta'),
        observacoes: dadosForm.get('observacoes'),
        especialidade: JSON.parse(localStorage.getItem('medicos')).find(m => m.id === parseInt(dadosForm.get('medicoId')))?.especialidade || 'Geral',
        status: dadosForm.get('id') ? prontuarios.find(p => p.id === parseInt(dadosForm.get('id')))?.status || 'Em Andamento' : 'Em Andamento'
    };

    if (dadosForm.get('id')) {
        prontuarios = prontuarios.map(p => p.id === prontuario.id ? prontuario : p);
    } else {
        prontuarios.push(prontuario);
    }

    localStorage.setItem('prontuarios', JSON.stringify(prontuarios));
    carregarProntuarios();
    carregarEstatisticas();

    formulario.reset();
    document.querySelector('#modalNovoProntuario .btn-close').click();
    mostrarNotificacao('Prontuário salvo com sucesso!', 'success');
}

// Editar prontuário
function editarProntuario(id) {
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];
    const prontuario = prontuarios.find(p => p.id === id);
    if (prontuario) {
        const formulario = document.getElementById('formNovoProntuario');
        const modalTitle = document.querySelector('#modalNovoProntuario .modal-title');
        
        modalTitle.innerHTML = '<i class="fas fa-file-medical me-2"></i>Editar Prontuário';
        formulario.querySelector('[name="id"]').value = prontuario.id;
        formulario.querySelector('[name="pacienteId"]').value = prontuario.pacienteId;
        formulario.querySelector('[name="medicoId"]').value = prontuario.medicoId;
        formulario.querySelector('[name="data"]').value = prontuario.data;
        formulario.querySelector('[name="tipo"]').value = prontuario.tipo;
        formulario.querySelector('[name="queixaPrincipal"]').value = prontuario.queixaPrincipal;
        formulario.querySelector('[name="historiaDoenca"]').value = prontuario.historiaDoenca;
        formulario.querySelector('[name="exameFisico"]').value = prontuario.exameFisico;
        formulario.querySelector('[name="diagnostico"]').value = prontuario.diagnostico;
        formulario.querySelector('[name="conduta"]').value = prontuario.conduta;
        formulario.querySelector('[name="observacoes"]').value = prontuario.observacoes;

        const modal = new bootstrap.Modal(document.getElementById('modalNovoProntuario'));
        modal.show();

        modal._element.addEventListener('hidden.bs.modal', () => {
            modalTitle.innerHTML = '<i class="fas fa-file-medical me-2"></i>Novo Prontuário';
            formulario.reset();
        }, { once: true });
    } else {
        mostrarNotificacao('Prontuário não encontrado!', 'danger');
    }
}

// Visualizar prontuário
function visualizarProntuario(id) {
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const prontuario = prontuarios.find(p => p.id === id);

    if (prontuario) {
        const paciente = pacientes.find(p => p.id === prontuario.pacienteId) || {};
        const medico = medicos.find(m => m.id === prontuario.medicoId) || {};
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-file-medical me-2"></i>Prontuário #${prontuario.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="card-title">Paciente: ${paciente.nome || 'N/A'}</h6>
                                <p><strong>Médico:</strong> ${medico.nome || 'N/A'}</p>
                                <p><strong>Especialidade:</strong> ${prontuario.especialidade || 'N/A'}</p>
                                <p><strong>Data:</strong> ${formatarData(prontuario.data)}</p>
                                <p><strong>Tipo:</strong> ${prontuario.tipo}</p>
                                <p><strong>Status:</strong> <span class="badge bg-${getStatusBadge(prontuario.status)}">${prontuario.status}</span></p>
                                <hr>
                                <p><strong>Queixa Principal:</strong> ${prontuario.queixaPrincipal}</p>
                                <p><strong>História da Doença:</strong> ${prontuario.historiaDoenca}</p>
                                <p><strong>Exame Físico:</strong> ${prontuario.exameFisico}</p>
                                <p><strong>Diagnóstico:</strong> ${prontuario.diagnostico}</p>
                                <p><strong>Conduta:</strong> ${prontuario.conduta}</p>
                                ${prontuario.observacoes ? `<p><strong>Observações:</strong> ${prontuario.observacoes}</p>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        modal.addEventListener('hidden.bs.modal', () => modal.remove());
    } else {
        mostrarNotificacao('Prontuário não encontrado!', 'danger');
    }
}

// Excluir prontuário
function excluirProntuario(id) {
    if (confirm('Tem certeza que deseja excluir este prontuário?')) {
        let prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];
        prontuarios = prontuarios.filter(p => p.id !== id);
        localStorage.setItem('prontuarios', JSON.stringify(prontuarios));
        carregarProntuarios();
        carregarEstatisticas();
        mostrarNotificacao('Prontuário excluído com sucesso!', 'success');
    }
}

// Importar prontuários
function importarProntuarios(e) {
    e.preventDefault();
    const arquivoInput = document.querySelector('#formImportar input[name="arquivo"]');
    const file = arquivoInput.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const novosProntuarios = JSON.parse(event.target.result);
                let prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];
                prontuarios = [...prontuarios, ...novosProntuarios];
                localStorage.setItem('prontuarios', JSON.stringify(prontuarios));
                carregarProntuarios();
                carregarEstatisticas();
                document.querySelector('#modalImportar .btn-close').click();
                mostrarNotificacao('Prontuários importados com sucesso!', 'success');
            } catch (error) {
                mostrarNotificacao('Erro ao importar prontuários!', 'danger');
            }
        };
        reader.readAsText(file);
    } else {
        mostrarNotificacao('Por favor, selecione um arquivo JSON válido!', 'danger');
    }
}

// Exportar prontuários
function exportarProntuarios(e) {
    e.preventDefault();
    const dadosForm = new FormData(document.getElementById('formExportar'));
    const dataInicio = dadosForm.get('dataInicio');
    const dataFim = dadosForm.get('dataFim');
    let prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];

    const filtrados = prontuarios.filter(p => p.data >= dataInicio && p.data <= dataFim);
    const json = JSON.stringify(filtrados, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prontuarios_${dataInicio}_${dataFim}.json`;
    a.click();
    URL.revokeObjectURL(url);

    document.querySelector('#modalExportar .btn-close').click();
    mostrarNotificacao('Prontuários exportados com sucesso!', 'success');
}

// Filtrar prontuários
function filtrarProntuarios() {
    const termo = document.getElementById('buscaProntuario').value.toLowerCase();
    const medicoId = document.getElementById('filtroMedico').value;
    const especialidade = document.getElementById('filtroEspecialidade').value;
    let prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

    prontuarios = prontuarios.filter(prontuario => {
        const paciente = pacientes.find(p => p.id === prontuario.pacienteId) || {};
        const medico = medicos.find(m => m.id === prontuario.medicoId) || {};
        return (
            (!termo ||
                paciente.nome?.toLowerCase().includes(termo) ||
                prontuario.id.toString().includes(termo)) &&
            (!medicoId || prontuario.medicoId === parseInt(medicoId)) &&
            (!especialidade || prontuario.especialidade === especialidade)
        );
    });

    carregarProntuarios(prontuarios);
}

// Formatar data
function formatarData(dataString) {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

// Formatar badge de status
function getStatusBadge(status) {
    switch (status) {
        case 'Concluído': return 'success';
        case 'Em Andamento': return 'warning';
        case 'Em Revisão': return 'info';
        default: return 'secondary';
    }
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
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}
