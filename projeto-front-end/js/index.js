document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (!localStorage.getItem('loggedIn')) {
        localStorage.setItem('loggedIn', 'true'); // Bypass
    }

    // Carregar navbar e estatísticas
    carregarNavbar();
    carregarEstatisticas();

    // Configurar formulário de contato
    document.getElementById('formContato').addEventListener('submit', enviarContato);
});

// Dados mockados
const estatisticas = [
    { icone: 'fas fa-users', valor: 45, texto: 'Pacientes' },
    { icone: 'fas fa-user-md', valor: 3, texto: 'Profissionais' },
    { icone: 'fas fa-hospital', valor: 1, texto: 'Unidade' },
    { icone: 'fas fa-star', valor: 4.8, texto: 'Satisfação' }
];

// Carregar navbar
function carregarNavbar() {
    const userMenu = document.getElementById('userMenu');
    if (localStorage.getItem('loggedIn') === 'true') {
        userMenu.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-2"></i>Administrador
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="perfil.html"><i class="fas fa-user me-2"></i>Meu Perfil</a></li>
                    <li><a class="dropdown-item" href="configuracoes.html"><i class="fas fa-cog me-2"></i>Configurações</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="login.html"><i class="fas fa-sign-out-alt me-2"></i>Sair</a></li>
                </ul>
            </div>
        `;
    } else {
        userMenu.innerHTML = `
            <a href="login.html" class="btn btn-primary">
                <i class="fas fa-sign-in-alt me-2"></i>Entrar
            </a>
        `;
    }
}

// Carregar estatísticas
function carregarEstatisticas() {
    const container = document.getElementById('estatisticasContainer');
    if (container) {
        container.innerHTML = estatisticas.map(stat => `
            <div class="col-md-3">
                <div class="stats-card text-center">
                    <i class="${stat.icone} stats-icon"></i>
                    <h3>${stat.valor}</h3>
                    <p>${stat.texto}</p>
                </div>
            </div>
        `).join('');
    }
}

// Enviar formulário de contato
function enviarContato(event) {
    event.preventDefault();
    const form = document.getElementById('formContato');
    const formData = new FormData(form);

    const contato = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        mensagem: formData.get('mensagem'),
        data: new Date().toISOString()
    };

    // Salvar em localStorage
    const contatos = JSON.parse(localStorage.getItem('contatos')) || [];
    contatos.push(contato);
    localStorage.setItem('contatos', JSON.stringify(contatos));

    form.reset();
    alert('Mensagem enviada com sucesso!');
}