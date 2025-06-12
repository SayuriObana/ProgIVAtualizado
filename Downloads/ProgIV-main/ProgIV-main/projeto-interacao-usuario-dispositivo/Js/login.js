var body = document.querySelector("body");
var signInButton = document.querySelector("#signIn");
var signUpButton = document.querySelector("#signUp");
var registerForm = document.querySelector(".second-colunm .form");
var loginForm = document.querySelector(".second-content .form");

// Função para mostrar mensagens de erro/sucesso
function mostrarMensagem(mensagem, tipo = 'erro') {
    const div = document.createElement('div');
    div.className = `mensagem-${tipo}`;
    div.textContent = mensagem;
    document.querySelector('.container').appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 5000);
}

// Função para validar senha
function validarSenha(senha) {
    const temCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    const temLetraMaiuscula = /[A-Z]/.test(senha);
    
    const erros = [];
    if (!temCaracterEspecial) {
        erros.push("A senha deve ter pelo menos um caractere especial (!@#$%^&*(),.?\":{}|<>)");
    }
    if (!temLetraMaiuscula) {
        erros.push("A senha deve ter pelo menos uma letra maiúscula");
    }
    
    return erros;
}

body.onload = function(){
    body.className = "on-load";
    // Limpar token ao carregar a página inicial
    limparToken();
    
    // Adicionar dicas de senha
    const senhaInput = document.querySelector('#senha-registro');
    if (senhaInput) {
        senhaInput.title = "A senha deve conter:\n- Pelo menos uma letra maiúscula\n- Pelo menos um caractere especial";
    }
}

signInButton.addEventListener("click", function(){
    body.className = "sign-in";
})

signUpButton.addEventListener("click", function(){
    body.className = "sign-up";
})

// Manipulador do formulário de cadastro
registerForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const email = this.querySelector('#email-registro').value;
    const senha = this.querySelector('#senha-registro').value;
    const senhaConfirmada = this.querySelector('#confirma-senha').value;
    
    // Validar senha
    const errosSenha = validarSenha(senha);
    if (errosSenha.length > 0) {
        mostrarMensagem(errosSenha.join('\n'));
        return;
    }
    
    if (senha !== senhaConfirmada) {
        mostrarMensagem('As senhas não coincidem');
        return;
    }
    
    try {
        const mensagem = await registrarUsuario(email, senha, senhaConfirmada);
        mostrarMensagem(mensagem, 'sucesso');
        // Limpar campos
        this.reset();
        setTimeout(() => {
            body.className = "sign-in";
        }, 1500);
    } catch (erro) {
        mostrarMensagem(erro.message);
    }
});

// Manipulador do formulário de login
loginForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const email = this.querySelector('#email-login').value;
    const senha = this.querySelector('#senha-login').value;
    
    try {
        const resultado = await realizarLogin(email, senha);
        salvarToken(resultado.token);
        window.location.href = `bem-vindo.html?email=${encodeURIComponent(email)}&expiracao=${encodeURIComponent(resultado.dataExpiracao)}`;
    } catch (erro) {
        mostrarMensagem(erro.message);
    }
});