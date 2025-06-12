document.addEventListener('DOMContentLoaded', () => {
    // Inicializar usuários mockados
    inicializarUsuarios();

    // Configurar formulário de login
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', autenticarUsuario);
    }
});

// Inicializar usuários mockados
function inicializarUsuarios() {
    const usuariosPadrao = [
        {
            id: 1,
            email: 'admin@sistemahospitalartcc.com.br',
            senha: 'admin123',
            nome: 'Administrador',
            cargo: 'Administrador',
            role: 'admin',
            unidade: 'Unidade Central'
        },
        {
            id: 2,
            email: 'lucas.mendes@sistemahospitalartcc.com.br',
            senha: 'medico123',
            nome: 'Dr. Lucas Mendes',
            cargo: 'Médico',
            role: 'medico',
            especialidade: 'Neurologia',
            crm: '67890-SP',
            telefone: '(11) 91234-5678',
            unidade: 'Unidade Central',
            preferencias: { notifEmail: true, notifSMS: false, tema: 'light', idioma: 'pt-BR' }
        },
        {
            id: 3,
            email: 'sofia.ribeiro@sistemahospitalartcc.com.br',
            senha: 'medico456',
            nome: 'Dra. Sofia Ribeiro',
            cargo: 'Médico',
            role: 'medico',
            especialidade: 'Cardiologia',
            crm: '12345-SP',
            telefone: '(11) 98765-4321',
            unidade: 'Unidade Central',
            preferencias: { notifEmail: true, notifSMS: true, tema: 'light', idioma: 'pt-BR' }
        }
    ];

    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify(usuariosPadrao));
    }

    // Garantir medicos sincronizados
    if (!localStorage.getItem('medicos')) {
        const medicosIniciais = [
            { id: 2, nome: 'Dr. Lucas Mendes', especialidade: 'Neurologia' },
            { id: 3, nome: 'Dra. Sofia Ribeiro', especialidade: 'Cardiologia' }
        ];
        localStorage.setItem('medicos', JSON.stringify(medicosIniciais));
    }
}

// Autenticar usuário
function autenticarUsuario(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value;

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    // Carregar usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar credenciais
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userRole', usuario.role);
        localStorage.setItem('userName', usuario.nome);
        localStorage.setItem('userEmail', usuario.email);
        window.location.href = 'dashboard.html';
    } else {
        alert('Email ou senha inválidos.');
    }
}