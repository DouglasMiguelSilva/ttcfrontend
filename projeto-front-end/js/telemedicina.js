document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (localStorage.getItem('loggedIn') !== 'true') {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }

    // Atualizar nome do usuário no dropdown
    const userName = localStorage.getItem('userName') || 'Administrador';
    document.getElementById('userName').textContent = userName;

    // Dados simulados iniciais
    let consultas = JSON.parse(localStorage.getItem('consultas')) || [
        {
            id: 1,
            dataHora: '2025-06-10T14:30',
            paciente: 'Clara Souza',
            medico: 'Dra. Sofia Ribeiro',
            especialidade: 'Cardiologia',
            status: 'Confirmada'
        },
        {
            id: 2,
            dataHora: '2025-06-10T15:45',
            paciente: 'Lucas Ferreira',
            medico: 'Dr. Lucas Mendes',
            especialidade: 'Neurologia',
            status: 'Pendente'
        },
        {
            id: 3,
            dataHora: '2025-06-10T16:30',
            paciente: 'Fernanda Lima',
            medico: 'Dra. Sofia Ribeiro',
            especialidade: 'Cardiologia',
            status: 'Em Andamento'
        },
        {
            id: 4,
            dataHora: '2025-06-10T17:15',
            paciente: 'Rafael Costa',
            medico: 'Dr. Lucas Mendes',
            especialidade: 'Neurologia',
            status: 'Confirmada'
        }
    ];

    // Configuração WebRTC
    const config = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    // Elementos HTML
    const videoLocal = document.getElementById('videoLocal');
    const videoRemote = document.getElementById('videoRemote');
    const btnMicrofone = document.getElementById('btnMicrofone');
    const btnCamera = document.getElementById('btnCamera');
    const btnEncerrar = document.getElementById('btnEncerrar');
    const nomePaciente = document.getElementById('nomePaciente');
    const nomeProfissional = document.getElementById('nomeProfissional');
    const duracaoConsulta = document.getElementById('duracaoConsulta');
    const tabelaConsultas = document.getElementById('tabelaConsultas');

    // Variáveis de controle
    let localStream = null;
    let peerConnection = null;
    let consultaIniciada = false;
    let tempoInicio = null;
    let timerInterval = null;

    // Carregar consultas na tabela
    function carregarConsultas() {
        tabelaConsultas.innerHTML = '';
        consultas.forEach(consulta => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(consulta.dataHora).toLocaleString('pt-BR')}</td>
                <td>${consulta.paciente}</td>
                <td>${consulta.medico}</td>
                <td>${consulta.especialidade}</td>
                <td><span class="badge bg-${consulta.status === 'Confirmada' ? 'success' : consulta.status === 'Pendente' ? 'warning' : 'info'}">${consulta.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="iniciarConsulta(${consulta.id})" title="Iniciar">
                        <i class="fas fa-video"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="cancelarConsulta(${consulta.id})" title="Cancelar">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            tabelaConsultas.appendChild(tr);
        });
        atualizarEstatisticas();
    }

    // Atualizar estatísticas
    function atualizarEstatisticas() {
        const total = consultas.length;
        const confirmadas = consultas.filter(c => c.status === 'Confirmada').length;
        const pendentes = consultas.filter(c => c.status === 'Pendente').length;
        const emAndamento = consultas.filter(c => c.status === 'Em Andamento').length;

        document.getElementById('totalConsultas').textContent = total;
        document.getElementById('consultasConfirmadas').textContent = confirmadas;
        document.getElementById('consultasPendentes').textContent = pendentes;
        document.getElementById('consultasEmAndamento').textContent = emAndamento;

        document.getElementById('percentualConfirmadas').textContent = total ? `${Math.round((confirmadas / total) * 100)}% do total` : '0% do total';
        document.getElementById('percentualPendentes').textContent = total ? `${Math.round((pendentes / total) * 100)}% do total` : '0% do total';
        document.getElementById('percentualEmAndamento').textContent = total ? `${Math.round((emAndamento / total) * 100)}% do total` : '0% do total';
    }

    // Iniciar consulta
    window.iniciarConsulta = async (consultaId) => {
        const consulta = consultas.find(c => c.id === consultaId);
        if (!consulta) {
            alert('Consulta não encontrada.');
            return;
        }
        try {
            localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            videoLocal.srcObject = localStream;
            nomePaciente.textContent = consulta.paciente;
            nomeProfissional.textContent = consulta.medico;
            consultaIniciada = true;
            consulta.status = 'Em Andamento';
            localStorage.setItem('consultas', JSON.stringify(consultas));
            carregarConsultas();
            tempoInicio = new Date();
            timerInterval = setInterval(atualizarTempo, 1000);
            registrarLog('INICIO_CONSULTA', `Consulta iniciada com ${consulta.paciente}`);
            // Simular WebRTC (vídeo remoto não implementado)
            videoRemote.srcObject = localStream; // Simula vídeo remoto com local
        } catch (error) {
            console.error('Erro ao iniciar consulta:', error);
            alert('Erro ao acessar câmera e microfone. Verifique as permissões.');
        }
    };

    // Cancelar consulta
    window.cancelarConsulta = (consultaId) => {
        if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
            consultas = consultas.filter(c => c.id !== consultaId);
            localStorage.setItem('consultas', JSON.stringify(consultas));
            carregarConsultas();
            registrarLog('CANCELAR_CONSULTA', `Consulta ${consultaId} cancelada`);
        }
    };

    // Encerrar consulta
    function encerrarConsulta() {
        if (!confirm('Tem certeza que deseja encerrar a consulta?')) return;
        clearInterval(timerInterval);
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (peerConnection) {
            peerConnection.close();
        }
        videoLocal.srcObject = null;
        videoRemote.srcObject = null;
        consultaIniciada = false;
        duracaoConsulta.textContent = '00:00:00';
        registrarLog('ENCERRAR_CONSULTA', `Consulta com ${nomePaciente.textContent} encerrada`);
        window.location.href = 'dashboard.html';
    }

    // Atualizar tempo da consulta
    function atualizarTempo() {
        if (!tempoInicio) return;
        const agora = new Date();
        const diff = Math.floor((agora - tempoInicio) / 1000);
        const horas = Math.floor(diff / 3600);
        const minutos = Math.floor((diff % 3600) / 60);
        const segundos = diff % 60;
        duracaoConsulta.textContent = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    // Registrar log
    function registrarLog(tipo, mensagem) {
        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        logs.push({
            timestamp: new Date().toISOString(),
            tipo,
            mensagem,
            usuario: localStorage.getItem('userName') || 'Sistema'
        });
        localStorage.setItem('logs', JSON.stringify(logs));
    }

    // Validação em tempo real para Prontuário
    document.getElementById('formProntuario').addEventListener('input', (e) => {
        const target = e.target;
        if (target.tagName === 'TEXTAREA') {
            if (target.value.trim().length > 10) {
                target.classList.add('is-valid');
                target.classList.remove('is-invalid');
            } else {
                target.classList.add('is-invalid');
                target.classList.remove('is-valid');
            }
        }
    });

    // Salvar prontuário
    document.getElementById('formProntuario').addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const inputs = document.querySelectorAll('#formProntuario textarea');
        inputs.forEach(input => {
            if (input.value.trim().length <= 10) {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                isValid = false;
            } else {
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            }
        });
        if (isValid) {
            const prontuario = {
                consultaId: consultas.find(c => c.paciente === nomePaciente.textContent)?.id || 1,
                queixa: document.getElementById('queixa').value,
                historia: document.getElementById('historia').value,
                exame: document.getElementById('exame').value,
                diagnostico: document.getElementById('diagnostico').value,
                conduta: document.getElementById('conduta').value,
                data: new Date().toISOString()
            };
            const prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || [];
            prontuarios.push(prontuario);
            localStorage.setItem('prontuarios', JSON.stringify(prontuarios));
            alert('Prontuário salvo com sucesso!');
            registrarLog('SALVAR_PRONTUARIO', `Prontuário salvo para ${nomePaciente.textContent}`);
        }
    });

    // Validação em tempo real para Prescrição
    document.getElementById('formPrescricao').addEventListener('input', (e) => {
        const target = e.target;
        const inputGroup = target.closest('[data-medicamento], [data-exame]');
        if (inputGroup) {
            const inputs = inputGroup.querySelectorAll('input');
            const allFilled = [...inputs].every(input => input.value.trim().length > 0);
            if (allFilled) {
                inputGroup.classList.add('is-valid');
                inputGroup.classList.remove('is-invalid');
            } else {
                inputGroup.classList.add('is-invalid');
                inputGroup.classList.remove('is-valid');
            }
        }
    });

    // Adicionar medicamento
    document.getElementById('btnAddMedicamento').addEventListener('click', () => {
        const template = document.querySelector('[data-medicamento]').cloneNode(true);
        template.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.classList.remove('is-valid', 'is-invalid');
        });
        template.classList.remove('is-valid', 'is-invalid');
        document.getElementById('listaMedicamentos').appendChild(template);
    });

    // Adicionar exame
    document.getElementById('btnAddExame').addEventListener('click', () => {
        const template = document.querySelector('[data-exame]').cloneNode(true);
        template.querySelector('input').value = '';
        template.classList.remove('is-valid', 'is-invalid');
        document.getElementById('listaExames').appendChild(template);
    });

    // Remover medicamento ou exame
    document.getElementById('formPrescricao').addEventListener('click', (e) => {
        if (e.target.closest('.remove-medicamento')) {
            const parent = e.target.closest('[data-medicamento]');
            if (document.querySelectorAll('[data-medicamento]').length > 1) {
                parent.remove();
            }
        }
        if (e.target.closest('.remove-exame')) {
            const parent = e.target.closest('[data-exame]');
            if (document.querySelectorAll('[data-exame]').length > 1) {
                parent.remove();
            }
        }
    });

    // Emitir prescrição
    document.getElementById('formPrescricao').addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        document.querySelectorAll('[data-medicamento], [data-exame]').forEach(group => {
            const inputs = group.querySelectorAll('input');
            if ([...inputs].some(input => !input.value.trim())) {
                group.classList.add('is-invalid');
                group.classList.remove('is-valid');
                isValid = false;
            } else {
                group.classList.add('is-valid');
                group.classList.remove('is-invalid');
            }
        });
        if (isValid) {
            const medicamentos = [];
            document.querySelectorAll('[data-medicamento]').forEach(group => {
                const inputs = group.querySelectorAll('input');
                medicamentos.push({
                    nome: inputs[0].value,
                    dosagem: inputs[1].value,
                    frequencia: inputs[2].value
                });
            });
            const exames = [];
            document.querySelectorAll('[data-exame]').forEach(group => {
                exames.push(group.querySelector('input').value);
            });
            const prescricao = {
                consultaId: consultas.find(c => c.paciente === nomePaciente.textContent)?.id || 1,
                medicamentos,
                exames,
                medico: nomeProfissional.textContent,
                paciente: nomePaciente.textContent,
                data: new Date().toISOString()
            };
            const prescricoes = JSON.parse(localStorage.getItem('prescricoes')) || [];
            prescricoes.push(prescricao);
            localStorage.setItem('prescricoes', JSON.stringify(prescricoes));
            alert('Prescrição emitida com sucesso!');
            registrarLog('EMITIR_PRESCRICAO', `Prescrição emitida para ${nomePaciente.textContent}`);
        }
    });

    // Nova teleconsulta
    document.getElementById('formNovaTeleconsulta').addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        const inputs = document.querySelectorAll('#formNovaTeleconsulta input, #formNovaTeleconsulta select');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                isValid = false;
            } else {
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
            }
        });
        if (isValid) {
            const novaConsulta = {
                id: consultas.length ? Math.max(...consultas.map(c => c.id)) + 1 : 1,
                dataHora: document.getElementById('dataHora').value,
                paciente: document.getElementById('paciente').options[document.getElementById('paciente').selectedIndex].text,
                medico: document.getElementById('medico').options[document.getElementById('medico').selectedIndex].text,
                especialidade: document.getElementById('medico').value === '1' ? 'Cardiologia' : 'Neurologia',
                status: 'Pendente'
            };
            consultas.push(novaConsulta);
            localStorage.setItem('consultas', JSON.stringify(consultas));
            carregarConsultas();
            alert('Teleconsulta agendada com sucesso!');
            registrarLog('AGENDAR_CONSULTA', `Teleconsulta agendada com ${novaConsulta.paciente}`);
            bootstrap.Modal.getInstance(document.getElementById('modalNovaTeleconsulta')).hide();
        }
    });

    // Controles de mídia
    btnMicrofone.addEventListener('click', () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            btnMicrofone.classList.toggle('btn-danger');
            registrarLog('TOGGLE_MICROFONE', `Microfone ${audioTrack.enabled ? 'ativado' : 'desativado'}`);
        }
    });

    btnCamera.addEventListener('click', () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            btnCamera.classList.toggle('btn-danger');
            registrarLog('TOGGLE_CAMERA', `Câmera ${videoTrack.enabled ? 'ativada' : 'desativada'}`);
        }
    });

    btnEncerrar.addEventListener('click', encerrarConsulta);

    // Inicializar
    carregarConsultas();
});