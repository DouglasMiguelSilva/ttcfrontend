document.addEventListener('DOMContentLoaded', () => {
    // Máscara de CPF
    document.getElementById('cpf').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, '$1.$2.');
        } else if (value.length > 0) {
            value = value.replace(/(\d{3})/, '$1');
        }
        e.target.value = value;
    });

    // Validação em tempo real
    document.getElementById('registroForm').addEventListener('input', (e) => {
        const target = e.target;
        const inputGroup = target.closest('.input-group');

        if (target.id === 'nome') {
            if (target.value.trim().length > 2) {
                target.classList.add('is-valid');
                target.classList.remove('is-invalid');
                inputGroup.classList.add('is-valid');
                inputGroup.classList.remove('is-invalid');
            } else {
                target.classList.add('is-invalid');
                target.classList.remove('is-valid');
                inputGroup.classList.add('is-invalid');
                inputGroup.classList.remove('is-valid');
            }
        }

        if (target.id === 'cpf') {
            const cpf = target.value.replace(/\D/g, '');
            if (cpf.length === 11 && validarCPF(cpf)) {
                target.classList.add('is-valid');
                target.classList.remove('is-invalid');
                inputGroup.classList.add('is-valid');
                inputGroup.classList.remove('is-invalid');
            } else {
                target.classList.add('is-invalid');
                target.classList.remove('is-valid');
                inputGroup.classList.add('is-invalid');
                inputGroup.classList.remove('is-valid');
            }
        }

        if (target.id === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(target.value)) {
                target.classList.add('is-valid');
                target.classList.remove('is-invalid');
                inputGroup.classList.add('is-valid');
                inputGroup.classList.remove('is-invalid');
            } else {
                target.classList.add('is-invalid');
                target.classList.remove('is-valid');
                inputGroup.classList.add('is-invalid');
                inputGroup.classList.remove('is-valid');
            }
        }

        if (target.id === 'senha') {
            if (target.value.length >= 8) {
                target.classList.add('is-valid');
                target.classList.remove('is-invalid');
                inputGroup.classList.add('is-valid');
                inputGroup.classList.remove('is-invalid');
            } else {
                target.classList.add('is-invalid');
                target.classList.remove('is-valid');
                inputGroup.classList.add('is-invalid');
                inputGroup.classList.remove('is-valid');
            }
            // Revalidar confirmar senha
            const confirmarSenha = document.getElementById('confirmarSenha');
            if (confirmarSenha.value) {
                const confirmarInputGroup = confirmarSenha.closest('.input-group');
                if (confirmarSenha.value === target.value) {
                    confirmarSenha.classList.add('is-valid');
                    confirmarSenha.classList.remove('is-invalid');
                    confirmarInputGroup.classList.add('is-valid');
                    confirmarInputGroup.classList.remove('is-invalid');
                } else {
                    confirmarSenha.classList.add('is-invalid');
                    confirmarSenha.classList.remove('is-valid');
                    confirmarInputGroup.classList.add('is-invalid');
                    confirmarInputGroup.classList.remove('is-valid');
                }
            }
        }

        if (target.id === 'confirmarSenha') {
            const senha = document.getElementById('senha').value;
            if (target.value === senha && target.value.length >= 8) {
                target.classList.add('is-valid');
                target.classList.remove('is-invalid');
                inputGroup.classList.add('is-valid');
                inputGroup.classList.remove('is-invalid');
            } else {
                target.classList.add('is-invalid');
                target.classList.remove('is-valid');
                inputGroup.classList.add('is-invalid');
                inputGroup.classList.remove('is-valid');
            }
        }

        if (target.id === 'tipoUsuario') {
            if (target.value) {
                target.classList.add('is-valid');
                target.classList.remove('is-invalid');
                inputGroup.classList.add('is-valid');
                inputGroup.classList.remove('is-invalid');
            } else {
                target.classList.add('is-invalid');
                target.classList.remove('is-valid');
                inputGroup.classList.add('is-invalid');
                inputGroup.classList.remove('is-valid');
            }
        }
    });

    // Validação e envio do formulário
    document.getElementById('registroForm').addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nome = document.getElementById('nome');
        const cpf = document.getElementById('cpf');
        const email = document.getElementById('email');
        const senha = document.getElementById('senha');
        const confirmarSenha = document.getElementById('confirmarSenha');
        const tipoUsuario = document.getElementById('tipoUsuario');

        // Validações
        if (nome.value.trim().length <= 2) {
            nome.classList.add('is-invalid');
            nome.classList.remove('is-valid');
            nome.closest('.input-group').classList.add('is-invalid');
            nome.closest('.input-group').classList.remove('is-valid');
            isValid = false;
        }

        const cpfValue = cpf.value.replace(/\D/g, '');
        if (cpfValue.length !== 11 || !validarCPF(cpfValue)) {
            cpf.classList.add('is-invalid');
            cpf.classList.remove('is-valid');
            cpf.closest('.input-group').classList.add('is-invalid');
            cpf.closest('.input-group').classList.remove('is-valid');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.classList.add('is-invalid');
            email.classList.remove('is-valid');
            email.closest('.input-group').classList.add('is-invalid');
            email.closest('.input-group').classList.remove('is-valid');
            isValid = false;
        }

        if (senha.value.length < 8) {
            senha.classList.add('is-invalid');
            senha.classList.remove('is-valid');
            senha.closest('.input-group').classList.add('is-invalid');
            senha.closest('.input-group').classList.remove('is-valid');
            isValid = false;
        }

        if (confirmarSenha.value !== senha.value) {
            confirmarSenha.classList.add('is-invalid');
            confirmarSenha.classList.remove('is-valid');
            confirmarSenha.closest('.input-group').classList.add('is-invalid');
            confirmarSenha.closest('.input-group').classList.remove('is-valid');
            isValid = false;
        }

        if (!tipoUsuario.value) {
            tipoUsuario.classList.add('is-invalid');
            tipoUsuario.classList.remove('is-valid');
            tipoUsuario.closest('.input-group').classList.add('is-invalid');
            tipoUsuario.closest('.input-group').classList.remove('is-valid');
            isValid = false;
        }

        if (isValid) {
            // Salvar dados no localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(user => user.email === email.value)) {
                alert('Email já registrado!');
                return;
            }
            users.push({
                nome: nome.value,
                cpf: cpfValue,
                email: email.value,
                senha: senha.value,
                tipoUsuario: tipoUsuario.value
            });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registro realizado com sucesso!');
            window.location.href = 'login.html';
        }
    });

    // Função de validação de CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digitoVerificador1 = resto > 9 ? 0 : resto;

        if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digitoVerificador2 = resto > 9 ? 0 : resto;

        return digitoVerificador2 === parseInt(cpf.charAt(10));
    }
});
