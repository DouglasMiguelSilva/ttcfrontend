document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Inicializar logs
    inicializarLogs();

    // Carregar dados
    carregarNavbar();
    carregarPerfil();
    carregarAtividades();

    // Configurar eventos
    document.getElementById('formPerfil').addEventListener('submit', salvarPerfil);
    document.getElementById('formSenha').addEventListener('submit', alterarSenha);
    document.getElementById('formPreferencias').addEventListener('submit', salvarPreferencias);

    // Máscaras
    const telefoneInput = document.querySelector('input[name="telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', e => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                e.target.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        });
    }

    const crmInput = document.querySelector('input[name="crm"]');
    if (crmInput) {
        crmInput.addEventListener('input', e => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 6) {
                e.target.value = value + '-SP';
            }
        });
    }
});

// Inicializar logs
function inicializarLogs() {
    if (!localStorage.getItem('logs')) {
        const logsIniciais = [
            { id: 1, usuarioId: 3, tipo: "Consulta Realizada", descricao: "Atendimento ao paciente Clara Souza", timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString() },
            { id: 2, usuarioId: 3, tipo: "Teleconsulta", descricao: "Teleconsulta com Lucas Ferreira", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
            { id: 3, usuarioId: 3, tipo: "Prontuário Atualizado", descricao: "Atualização do prontuário de Fernanda Lima", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
        ];
        localStorage.setItem('logs', JSON.stringify(logsIniciais));
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
                <li><a class="dropdown-item active" href="perfil.html"><i class="fas fa-user me-2"></i>Meu Perfil</a></li>
                <li><a class="dropdown-item" href="configuracao.html"><i class="fas fa-cog me-2"></i>Configurações</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="login.html" onclick="localStorage.removeItem('loggedIn'); localStorage.removeItem('userEmail'); localStorage.removeItem('userName'); localStorage.removeItem('userRole')"><i class="fas fa-sign-out-alt me-2"></i>Sair</a></li>
            </ul>
        </div>
    `;
}

// Carregar perfil
function carregarPerfil() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const userEmail = localStorage.getItem('userEmail');
    const usuario = usuarios.find(u => u.email === userEmail) || {};

    // Header
    const profileInfo = document.getElementById('profileInfo');
    profileInfo.innerHTML = `
        <h2 class="h4 mb-2">${usuario.nome || 'Usuário'}</h2>
        <p class="mb-2"><i class="fas fa-user-md me-2"></i>${usuario.especialidade || 'N/A'}</p>
        <p class="mb-2"><i class="fas fa-hospital me-2"></i>${usuario.unidade || 'N/A'}</p>
        <p class="mb-0"><i class="fas fa-envelope me-2"></i>${usuario.email || 'N/A'}</p>
    `;

    // Stats
    const consultas = JSON.parse(localStorage.getItem('consultas')) || [];
    const pacientesAtendidos = consultas.filter(c => c.medicoId === usuario.id).reduce((acc, c) => acc + (c.pacienteId ? 1 : 0), 0);
    const teleconsultas = consultas.filter(c => c.medicoId === usuario.id && c.tipo === 'Telemedicina').length;
    const profileStats = document.getElementById('profileStats');
    profileStats.innerHTML = `
        <div class="stat-item">
            <div class="stat-value">${pacientesAtendidos}</div>
            <div class="stat-label">Pacientes Atendidos</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">${teleconsultas}</div>
            <div class="stat-label">Teleconsultas</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">4.8</div>
            <div class="stat-label">Avaliação</div>
        </div>
    `;

    // Formulário de perfil
    const formPerfil = document.getElementById('formPerfil');
    formPerfil.querySelector('[name="id"]').value = usuario.id || '';
    formPerfil.querySelector('[name="nome"]').value = usuario.nome || '';
    formPerfil.querySelector('[name="crm"]').value = usuario.crm || '';
    formPerfil.querySelector('[name="especialidade"]').value = usuario.especialidade || '';
    formPerfil.querySelector('[name="email"]').value = usuario.email || '';
    formPerfil.querySelector('[name="telefone"]').value = usuario.telefone || '';

    // Formulário de preferências
    const formPreferencias = document.getElementById('formPreferencias');
    formPreferencias.querySelector('[name="notifEmail"]').checked = usuario.preferencias?.notifEmail || false;
    formPreferencias.querySelector('[name="notifSMS"]').checked = usuario.preferencias?.notifSMS || false;
    formPreferencias.querySelector('[name="tema"]').value = usuario.preferencias?.tema || 'light';
    formPreferencias.querySelector('[name="idioma"]').value = usuario.preferencias?.idioma || 'pt-BR';
}

// Carregar atividades
function carregarAtividades() {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    const userEmail = localStorage.getItem('userEmail');
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === userEmail) || {};
    const activityLog = document.getElementById('activityLog');
    activityLog.innerHTML = '';

    const userLogs = logs.filter(log => log.usuarioId === usuario.id).slice(0, 3);
    userLogs.forEach(log => {
        const item = document.createElement('a');
        item.className = 'list-group-item list-group-item-action';
        item.href = '#';
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1"><i class="fas fa-${getLogIcon(log.tipo)} text-primary me-2"></i>${log.tipo}</h6>
                <small class="text-muted">${formatarDataHora(log.timestamp)}</small>
            </div>
            <p class="mb-1">${log.descricao}</p>
        `;
        activityLog.appendChild(item);
    });
}

// Salvar perfil
function salvarPerfil(e) {
    e.preventDefault();
    const form = document.getElementById('formPerfil');
    const formData = new FormData(form);
    const userEmail = localStorage.getItem('userEmail');
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuario = {
        id: parseInt(formData.get('id')),
        nome: formData.get('nome'),
        email: formData.get('email'),
        crm: formData.get('crm'),
        especialidade: formData.get('especialidade'),
        telefone: formData.get('telefone'),
        senha: usuarios.find(u => u.email === userEmail)?.senha || '',
        unidade: usuarios.find(u => u.email === userEmail)?.unidade || 'Unidade Central',
        role: usuarios.find(u => u.email === userEmail)?.role || 'medico',
        cargo: usuarios.find(u => u.email === userEmail)?.cargo || 'Médico',
        preferencias: usuarios.find(u => u.email === userEmail)?.preferencias || {}
    };

    usuarios = usuarios.map(u => u.email === userEmail ? usuario : u);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('userName', usuario.nome);
    localStorage.setItem('userEmail', usuario.email);

    // Atualizar medicos
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    medicos = medicos.map(m => m.id === usuario.id ? { ...m, nome: usuario.nome, especialidade: usuario.especialidade } : m);
    localStorage.setItem('medicos', JSON.stringify(medicos));

    carregarPerfil();
    carregarNavbar();
    mostrarNotificacao('Perfil salvo com sucesso!', 'success');
}

// Alterar senha
function alterarSenha(e) {
    e.preventDefault();
    const form = document.getElementById('formSenha');
    const formData = new FormData(form);
    const senhaAtual = formData.get('senhaAtual');
    const novaSenha = formData.get('novaSenha');
    const confirmarSenha = formData.get('confirmarSenha');
    const userEmail = localStorage.getItem('userEmail');
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuario = usuarios.find(u => u.email === userEmail);
    if (!usuario || usuario.senha !== senhaAtual) {
        mostrarNotificacao('Senha atual incorreta!', 'danger');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        mostrarNotificacao('As novas senhas não coincidem!', 'danger');
        return;
    }

    if (novaSenha.length < 6) {
        mostrarNotificacao('A nova senha deve ter pelo menos 6 caracteres!', 'danger');
        return;
    }

    usuarios = usuarios.map(u => u.email === userEmail ? { ...u, senha: novaSenha } : u);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    form.reset();
    mostrarNotificacao('Senha alterada com sucesso!', 'success');
}

// Salvar preferências
function salvarPreferencias(e) {
    e.preventDefault();
    const form = document.getElementById('formPreferencias');
    const formData = new FormData(form);
    const userEmail = localStorage.getItem('userEmail');
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const preferencias = {
        notifEmail: formData.get('notifEmail') === 'on',
        notifSMS: formData.get('notifSMS') === 'on',
        tema: formData.get('tema'),
        idioma: formData.get('idioma')
    };

    usuarios = usuarios.map(u => u.email === userEmail ? { ...u, preferencias } : u);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    carregarPerfil();
    mostrarNotificacao('Preferências salvas com sucesso!', 'success');
}

// Formatar data e hora
function formatarDataHora(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Ícone de log
function getLogIcon(tipo) {
    switch (tipo) {
        case 'Consulta Realizada': return 'user-md';
        case 'Teleconsulta': return 'video';
        case 'Prontuário Atualizado': return 'file-medical';
        default: return 'history';
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