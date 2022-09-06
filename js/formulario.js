const formulario = document.querySelector("form");

function formularioEnviado(resposta) {
  if (resposta.ok) {
    formulario.innerHTML =
      "<p class='font-1-m cor-h2' style='grid-column: 1/-1; padding: 1rem; border-radius: 4px; background: #1d1e1e;'><span style='color: #317A00;'>Mensagem enviada</span>, em breve entraremos em contato. Geralmente respondemos em 24 horas.</p>";
  } else {
    formulario.innerHTML =
      "<p class='font-1-m cor-h2' style='grid-column: 1/-1; padding: 1rem; border-radius: 4px; background: #1d1e1e;'><span style='color: #E00000;'>Erro no envio</span>, você pode enviar diretamente para o nosso email em: contato@devmozer.com</p>";
  }
}

function enviarFormulario(event) {
  event.preventDefault();
  const botao = document.querySelector("form button");
  botao.disabled = true;
  botao.innerText = "Enviando...";

  const campos = formulario.querySelectorAll("[nome]");
  const data = new FormData();

  campos.forEach((campo) => {
    const name = campo.getAttribute("nome");
    const value = campo.value;
    data.append(name, value);
  });

  fetch("./enviar.php", {
    method: "POST",
    body: data,
  }).then(formularioEnviado);
}

formulario.addEventListener("submit", enviarFormulario);
