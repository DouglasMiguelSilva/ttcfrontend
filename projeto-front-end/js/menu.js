document.addEventListener('DOMContentLoaded', function() {
    // Obtém o nome da página atual (ex: 'prontuarios.html')
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Seleciona todos os links do menu com a classe .nav-link
    const menuLinks = document.querySelectorAll('.nav-link');

    // Para cada link do menu, verifica se o href corresponde à página atual
    menuLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active'); // adiciona a classe 'active' ao link atual
        } else {
            link.classList.remove('active'); // remove 'active' de outros links
        }
    });

    // Inicializa o dropdown do usuário, se existir
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        new bootstrap.Dropdown(userDropdown);
    }
});