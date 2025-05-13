document.querySelector('.hamburger').addEventListener('click', function() {
  document.querySelector('nav').classList.toggle('active');
});

document.getElementById('recovery-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Pega o valor do campo de e-mail
  const email = document.getElementById('email').value;
    document.getElementById('backButton').addEventListener('click', function() {
        window.history.back();
    });

  try {
      // Envia uma requisição POST para o backend
      const response = await fetch('http://localhost:5268/auth/forgot-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
      });

      if (response.ok) {
          // Sucesso na recuperação
          document.getElementById('response-message').innerText = "Um link para redefinir a senha foi enviado para o e-mail.";
      } else {
          // Falha ao encontrar o e-mail
          document.getElementById('response-message').innerText = "Erro ao enviar o e-mail de recuperação. Verifique o endereço de e-mail.";
      }
  } catch (error) {
      // Erro na requisição
      document.getElementById('response-message').innerText = "Ocorreu um erro. Tente novamente.";
      console.error('Erro ao enviar e-mail: ', error.message);
      alert('Erro no servidor.');
  }
    
});
