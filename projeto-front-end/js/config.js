document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (!localStorage.getItem('loggedIn')) {
        localStorage.setItem('loggedIn', 'true'); // Forçar bypass
    }

    // Carregar configurações salvas
    carregarConfiguracoes();

    // Configurar event listeners para formulários
    configurarFormularios();

    // Carregar tabela de integrações
    carregarIntegracoes();
});

// Dados mockados para integrações
const integracoes = [
    { id: 'i1', sistema: 'PACS', status: 'Ativo', ultimaSincronizacao: '15/03/2024 14:30' },
    { id: 'i2', sistema: 'LIS', status: 'Pendente', ultimaSincronizacao: '14/03/2024 16:45' },
    { id: 'i3', sistema: 'Farmacêutico', status: 'Ativo', ultimaSincronizacao: '15/03/2024 09:15' },
    { id: 'i4', sistema: 'Financeiro', status: 'Inativo', ultimaSincronizacao: '10/03/2024 11:30' }
];

// Carregar configurações salvas do localStorage
function carregarConfiguracoes() {
    const configGerais = JSON.parse(localStorage.getItem('configGerais')) || {
        nome: 'Hospital Vida Plus',
        fusoHorario: 'America/Sao_Paulo',
        formatoData: 'DD/MM/YYYY',
        formatoHora: '24'
    };
    document.querySelector('#formConfigGerais [name="nome"]').value = configGerais.nome;
    document.querySelector(`#formConfigGerais [name="fusoHorario"] [value="${configGerais.fusoHorario}"]`).selected = true;
    document.querySelector(`#formConfigGerais [name="formatoData"] [value="${configGerais.formatoData}"]`).selected = true;
    document.querySelector(`#formConfigGerais [name="formatoHora"] [value="${configGerais.formatoHora}"]`).selected = true;

    const configNotificacoes = JSON.parse(localStorage.getItem('configNotificacoes')) || {
        emailConsultas: true,
        emailResultados: true,
        emailSistema: false,
        smsConsultas: true,
        smsResultados: false,
        smsEmergencia: true
    };
    document.getElementById('emailConsultas').checked = configNotificacoes.emailConsultas;
    document.getElementById('emailResultados').checked = configNotificacoes.emailResultados;
    document.getElementById('emailSistema').checked = configNotificacoes.emailSistema;
    document.getElementById('smsConsultas').checked = configNotificacoes.smsConsultas;
    document.getElementById('smsResultados').checked = configNotificacoes.smsResultados;
    document.getElementById('smsEmergencia').checked = configNotificacoes.smsEmergencia;

    const configSeguranca = JSON.parse(localStorage.getItem('configSeguranca')) || {
        authEmail: true,
        authSMS: true,
        authApp: false,
        senhaComplexa: true,
        senhaExpiracao: true,
        senhaHistorico: true
    };
    document.getElementById('authEmail').checked = configSeguranca.authEmail;
    document.getElementById('authSMS').checked = configSeguranca.authSMS;
    document.getElementById('authApp').checked = configSeguranca.authApp;
    document.getElementById('senhaComplexa').checked = configSeguranca.senhaComplexa;
    document.getElementById('senhaExpiracao').checked = configSeguranca.senhaExpiracao;
    document.getElementById('senhaHistorico').checked = configSeguranca.senhaHistorico;
}

// Configurar event listeners para os formulários
function configurarFormularios() {
    const formConfigGerais = document.getElementById('formConfigGerais');
    if (formConfigGerais) {
        formConfigGerais.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const config = {
                nome: formData.get('nome'),
                fusoHorario: formData.get('fusoHorario'),
                formatoData: formData.get('formatoData'),
                formatoHora: formData.get('formatoHora')
            };
            localStorage.setItem('configGerais', JSON.stringify(config));
            alert('Configurações gerais salvas com sucesso!');
        });
    }

    const formNotificacoes = document.getElementById('formNotificacoes');
    if (formNotificacoes) {
        formNotificacoes.addEventListener('submit', (e) => {
            e.preventDefault();
            const config = {
                emailConsultas: document.getElementById('emailConsultas').checked,
                emailResultados: document.getElementById('emailResultados').checked,
                emailSistema: document.getElementById('emailSistema').checked,
                smsConsultas: document.getElementById('smsConsultas').checked,
                smsResultados: document.getElementById('smsResultados').checked,
                smsEmergencia: document.getElementById('smsEmergencia').checked
            };
            localStorage.setItem('configNotificacoes', JSON.stringify(config));
            alert('Configurações de notificações salvas com sucesso!');
        });
    }

    const formSeguranca = document.getElementById('formSeguranca');
    if (formSeguranca) {
        formSeguranca.addEventListener('submit', (e) => {
            e.preventDefault();
            const config = {
                authEmail: document.getElementById('authEmail').checked,
                authSMS: document.getElementById('authSMS').checked,
                authApp: document.getElementById('authApp').checked,
                senhaComplexa: document.getElementById('senhaComplexa').checked,
                senhaExpiracao: document.getElementById('senhaExpiracao').checked,
                senhaHistorico: document.getElementById('senhaHistorico').checked
            };
            localStorage.setItem('configSeguranca', JSON.stringify(config));
            alert('Configurações de segurança salvas com sucesso!');
        });
    }
}

// Carregar tabela de integrações
function carregarIntegracoes() {
    const tbody = document.getElementById('tabelaIntegracoes');
    if (tbody) {
        tbody.innerHTML = integracoes.map(integracao => `
            <tr>
                <td>${integracao.sistema}</td>
                <td>
                    <span class="badge ${integracao.status === 'Ativo' ? 'bg-success' : integracao.status === 'Pendente' ? 'bg-warning' : 'bg-danger'}">
                        ${integracao.status}
                    </span>
                </td>
                <td>${integracao.ultimaSincronizacao}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="configurarIntegracao('${integracao.id}')" title="Configurar">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="sincronizarIntegracao('${integracao.id}')" title="Sincronizar">
                        <i class="fas fa-sync"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Funções de manipulação de integrações
function configurarIntegracao(id) {
    alert(`Configurar integração ID: ${id} (funcionalidade em desenvolvimento)`);
}

function sincronizarIntegracao(id) {
    const integracao = integracoes.find(i => i.id === id);
    if (integracao) {
        integracao.ultimaSincronizacao = new Date().toLocaleString('pt-BR');
        integracao.status = 'Ativo';
        carregarIntegracoes();
        alert(`Integração ${integracao.sistema} sincronizada com sucesso!`);
    }
}