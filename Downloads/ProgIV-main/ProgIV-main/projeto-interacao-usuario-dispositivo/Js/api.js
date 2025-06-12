const API_URL = 'https://umfgcloud-autenticacao-service-7e27ead80532.herokuapp.com/Autenticacao';

async function registrarUsuario(email, senha, senhaConfirmada) {
    try {
        const response = await fetch(`${API_URL}/registar`, {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "senha": senha,
                "senhaConfirmada": senhaConfirmada
            })
        });

        if (response.status === 400) {
            const errorData = await response.text();
            throw new Error(errorData || 'Erro ao cadastrar usuário');
        }

        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário');
        }

        const data = await response.text();
        return data;
    } catch (error) {
        throw error;
    }
}

async function realizarLogin(email, senha) {
    try {
        const response = await fetch(`${API_URL}/autenticar`, {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "senha": senha
            })
        });

        if (response.status === 400) {
            const errorData = await response.text();
            throw new Error(errorData || 'Erro ao realizar login');
        }

        if (!response.ok) {
            throw new Error('Erro ao realizar login');
        }

        const data = await response.text();
        try {
            const jsonData = JSON.parse(data);
            return {
                token: jsonData.token,
                dataExpiracao: jsonData.dataExpiracao
            };
        } catch {
            throw new Error('Erro ao processar resposta do servidor');
        }
    } catch (error) {
        throw error;
    }
}

function salvarToken(token) {
    localStorage.setItem('authToken', token);
}

function obterToken() {
    return localStorage.getItem('authToken');
}

function limparToken() {
    localStorage.removeItem('authToken');
} 