const passwordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const emailInput = document.getElementById('email');
const tokenInput = document.getElementById('token');
const passwordStrengthBar = document.querySelector('.password-strength-bar');
const form = document.getElementById('password-reset-form');

passwordInput.addEventListener('input', updatePasswordStrength);

document.getElementById('password-reset-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita o comportamento padrão do formulário

  // Obtenha os valores dos campos do formulário
  const email = document.getElementById('email').value;
  const token = document.getElementById('token').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  // Verifique se as senhas coincidem
  if (newPassword !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
  }

  if (!email || !token || !newPassword || !confirmPassword) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  if (newPassword.length < 8) {
    alert('A senha deve ter pelo menos 8 caracteres.');
    return;
  }


  // Crie o objeto para enviar ao backend
  const resetPasswordData = {
      email: email,
      token: token,
      senha: newPassword,
      confirmarSenha: confirmPassword
  };

  try {
      // Envie a requisição para o backend
      const response = await fetch('http://localhost:5268/auth/reset-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(resetPasswordData)
      });

      // Verifique a resposta do servidor
      if (response.ok) {
          alert('Senha redefinida com sucesso!');
          // Redirecionar ou limpar o formulário
      } else {
          const errorData = await response.json();
          alert('Erro ao redefinir a senha: ' + (errorData.message ));
      }
  } catch (error) { 
      console.error('Erro ao redefinir senha:', error.message);
      alert('Erro ao redefinir senha, tente novamente mais tarde.');
  }
});


function updatePasswordStrength() {
  const password = passwordInput.value;
  let strength = 0;

  if (password.length >= 8) strength += 25;
  if (password.match(/[a-z]+/)) strength += 25;
  if (password.match(/[A-Z]+/)) strength += 25;
  if (password.match(/[0-9]+/)) strength += 25;

  passwordStrengthBar.style.width = strength + '%';

  if (strength < 50) {
    passwordStrengthBar.style.backgroundColor = '#ff4d4d';
  } else if (strength < 75) {
    passwordStrengthBar.style.backgroundColor = '#ffd700';
  } else {
    passwordStrengthBar.style.backgroundColor = '#00cc00';
  }
}

const logo = document.querySelector('.logo img');
logo.addEventListener('mouseover', function() {
  this.style.transform = 'scale(1.1)';
});
logo.addEventListener('mouseout', function() {
  this.style.transform = 'scale(1)';
});

const bubblesContainer = document.createElement('div');
bubblesContainer.style.position = 'fixed';
bubblesContainer.style.top = '0';
bubblesContainer.style.left = '0';
bubblesContainer.style.width = '100%';
bubblesContainer.style.height = '100%';
bubblesContainer.style.pointerEvents = 'none';
bubblesContainer.style.zIndex = '0';
document.body.appendChild(bubblesContainer);

function createBubble() {
  const bubble = document.createElement('div');
  bubble.style.position = 'absolute';
  bubble.style.width = Math.random() * 10 + 5 + 'px';
  bubble.style.height = bubble.style.width;
  bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  bubble.style.borderRadius = '50%';
  bubble.style.left = Math.random() * 100 + '%';
  bubble.style.bottom = '-50px';
  bubble.style.animation = `rise ${Math.random() * 15 + 10}s linear infinite`;
  bubblesContainer.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 25000);
}

setInterval(createBubble, 2000);