# Sistema de Telemedicina - TCC Frontend

**Autor:** Douglas Miguel Silva  
**Repositório:** [github.com/DouglasMiguelSilva/ttcfrontend](https://github.com/DouglasMiguelSilva/ttcfrontend)

## 📘 Contexto

Este projeto é um sistema web de **telemedicina** desenvolvido como **Trabalho de Conclusão de Curso (TCC)** .  
O objetivo é simular um ambiente hospitalar onde **médicos podem realizar teleconsultas**, gerenciar **prontuários eletrônicos**, emitir **prescrições médicas** e **agendar consultas**.  

A aplicação é um **frontend estático**, voltada à **demonstração visual e funcional** de uma solução de telemedicina com foco em usabilidade, simulação de funcionalidades reais e documentação completa.

---

## 🎯 Finalidade

- Fornecer uma **plataforma web** para teleconsultas com videoconferência simulada.
- Permitir o **registro e login** de médicos e pacientes.
- Gerenciar **informações clínicas** (prontuários e prescrições).
- Exibir **agenda de consultas** com estatísticas.
- Servir como **projeto acadêmico (TCC)** com documentação e hospedagem gratuita via GitHub Pages.

---

## 🔧 Funcionalidades

### 🔐 Autenticação de Usuários
- Registro com: nome, CPF, e-mail, senha e tipo de usuário (médico ou paciente).
- Login com verificação de e-mail e senha.
- Sessão salva no `localStorage` com:
  - `loggedIn`, `userName`, `userRole`.
- Redirecionamento automático para `dashboard.html` após login.
- **Exemplo de login:**  
  E-mail: `sofia.ribeiro@sistemahospitalartcc.com.br`  
  Senha: `medico456`  
  Tipo: Médico

### 📹 Sala de Teleconsulta
- Interface de videoconferência com WebRTC (vídeo local simulado).
- Botões para **ativar/desativar câmera e microfone**, com cores:
  - Verde (ativo)
  - Vermelho (desligado)
- Nome do paciente e médico visível.
- Temporizador de duração da consulta.
- Botão **Encerrar consulta** (redireciona para dashboard).

### 📝 Prontuário Eletrônico
- Campos:
  - Queixa principal
  - História da doença
  - Exame físico
  - Diagnóstico
  - Conduta
- Validação em tempo real (mín. 10 caracteres).
- Feedback visual com Bootstrap (`is-valid`, `is-invalid`).
- Dados salvos no `localStorage` com chave `prontuarios`.

### 💊 Prescrição Médica
- Adição de medicamentos e exames com campos dinâmicos.
- Exemplo:
  - Medicamento: Nitroglicerina, 0.4 mg, a cada 5 minutos.
  - Exame: ECG
- Validação e armazenamento no `localStorage` (chave `prescricoes`).

### 📆 Agenda de Teleconsultas
- Tabela com:
  - Horário
  - Paciente
  - Médico
  - Especialidade
  - Status (Confirmada, Pendente, Em Andamento)
  - Ações: Iniciar/Cancelar
- Dados iniciais simulados no `localStorage` (chave `consultas`).
- Modal de agendamento:
  - Paciente
  - Médico
  - Data/Hora
  - Duração (30, 45 ou 60 minutos)
- Estatísticas em cards:
  - Total de consultas
  - Confirmadas
  - Pendentes
  - Em andamento

### 🌐 Interface e Navegação
- Menu superior com:
  - Dashboard
  - Pacientes
  - Prontuários
  - Funcionários
  - Telemedicina
  - Administração
- Design:
  - Gradiente verde: `#e8f5e9 → #c8e6c9`
  - Cards com efeito blur
  - Animações suaves
- Dropdown de usuário com nome logado + opções:
  - Perfil
  - Configurações
  - Sair

---

## 🧪 Tecnologias Utilizadas

- **HTML5**: Estrutura das páginas
- **CSS3**: Estilos personalizados (`/css/menu.css`)
- **JavaScript**: Validações, lógica, armazenamento local
- **Bootstrap 5.3**: Layout, formulários, validações visuais
- **Font Awesome 6.0**: Ícones de interface
- **WebRTC**: Simulação de videoconferência
- **localStorage**: Persistência de dados
- **GitHub Pages**: Hospedagem gratuita do site

---

## 📁 Estrutura do Repositório

```plaintext
ttcfrontend/
├── css/
│   └── menu.css
├── img/
│   └── logosemfundo.png
├── js/
│   ├── login.js
│   ├── registro.js
│   └── telemedicina.js
├── dashboard.html
├── login.html
├── registro.html
├── telemedicina.html  ← Página principal (ver nota abaixo)
├── index.html         ← (opcional: redireciona para telemedicina.html)
└── README.md          ← (a ser criado com este conteúdo)
