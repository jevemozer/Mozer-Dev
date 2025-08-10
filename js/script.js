document.addEventListener('DOMContentLoaded', () => {
  const commandInput = document.getElementById('command');
  const outputDiv = document.getElementById('output');
  const terminal = document.getElementById('terminal');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const splashScreen = document.getElementById('splash-screen');

  let commandHistory = [];
  let historyIndex = -1;
  let matrixInterval = null;
  let isHacking = false; // Flag para controlar a simulação de hacking

  const portfolioData = {
    welcome: `
<span class="system-message">Bem-vindo ao meu terminal.</span>
Digite 'ajuda' para ver a lista de comandos disponíveis.
`, 
    ajuda: `
Comandos disponíveis:
  <span class="link">sobre</span>      - Exibe minha biografia.
  <span class="link">habilidades</span>  - Lista minhas competências técnicas.
  <span class="link">projetos</span>     - Lista meus projetos publicados no GitHub Pages.
  <span class="link">contato</span>      - Apresenta minhas informações de contato.
  <span class="link">limpar</span>       - Limpa o console do terminal.
  <span class="link">historico</span>    - Exibe o histórico de comandos.

Easter Eggs:
  <span class="link">matrix</span>     - Inicia a animação. Digite 'sair' para parar.
  <span class="link">hack &lt;alvo&gt;</span>  - Inicia uma simulação de hacking divertida.

Temas:
  <span class="link">tema classic</span> - Tema verde padrão.
  <span class="link">tema amber</span>   - Tema âmbar (laranja/marrom).
  <span class="link">tema blue</span>    - Tema azul.
`, 
    sobre: `
Desenvolvedor focado em tecnologias front-end, com experiência na criação de sites e aplicações web responsivas. Este portfólio interativo foi desenvolvido em JavaScript puro para demonstrar minhas habilidades práticas em manipulação de DOM e integração com APIs. Buscando aplicar e expandir meu conhecimento em novos desafios.
`, 
    habilidades: `
<span class="system-message">🛠 Tech Stack:</span>

<span class="link">Linguagens e Frameworks:</span>
React, Next.js 13+ (foco principal)
TypeScript
JavaScript (ES6+)
Vue.js (conhecimento básico)
HTML5, CSS3, Sass
Tailwind CSS
Shadcn UI

<span class="link">Ferramentas de Desenvolvimento:</span>
Git & GitHub
Supabase
Node.js (conhecimento básico)

<span class="link">Ambiente de Desenvolvimento:</span>
VSCode
Linux & WSL
`, 
    contato: `
<span class="system-message">Estabelecendo conexão...</span>

- <span class="link">GitHub:</span> <a href="https://github.com/jevemozer" target="_blank" class="link">github.com/jevemozer</a>
- <span class="link">WhatsApp:</span> <a href="https://api.whatsapp.com/send?1=pt_BR&phone=5549991626463" target="_blank" class="link">+55 49 99162-6463</a>
`, 
  };

  const typeOutput = (text, callback) => {
    const outputLine = document.createElement('div');
    outputLine.classList.add('output-line');
    outputDiv.appendChild(outputLine);

    let i = 0;
    const speed = 10;
    outputLine.innerHTML = '';

    const typeWriter = () => {
      if (i < text.length) {
        outputLine.innerHTML += text.charAt(i);
        i++;
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(typeWriter, speed);
      } else {
        outputLine.innerHTML = text;
        window.scrollTo(0, document.body.scrollHeight);
        if (callback) callback();
      }
    };
    typeWriter();
  };

  const executeCommand = (cmd) => {
    if (cmd === '') return;
    if (isHacking) {
      typeOutput('<span class="system-message">Aguarde, a simulação de hacking está em andamento...</span>');
      return;
    }

    const promptLine = document.createElement('div');
    promptLine.classList.add('output-line');
    promptLine.innerHTML = `<span class="prompt">$&gt;</span> ${cmd}`;
    outputDiv.appendChild(promptLine);

    if (cmd.toLowerCase() !== 'historico') {
        commandHistory.unshift(cmd);
    }
    historyIndex = -1;

    const command = cmd.toLowerCase();
    if (command === 'limpar') {
      outputDiv.innerHTML = '';
    } else if (command === 'historico') {
      let history = '<span class="system-message">Histórico de comandos:</span>\n';
      commandHistory.forEach((c, i) => { history += `${i}: ${c}\n`; });
      typeOutput(history);
    } else if (command === 'matrix') {
      startMatrix();
    } else if (command === 'sair') {
      stopMatrix();
    } else if (command.startsWith('tema ')) {
      const themeName = command.substring(5).trim();
      setTheme(themeName);
    } else if (command.startsWith('hack ')) {
      const target = command.substring(5).trim();
      startHackSimulation(target);
    } else if (command === 'projetos') {
      fetchGithubProjects();
    } else if (portfolioData[command]) {
      typeOutput(portfolioData[command]);
    } else {
      typeOutput(`Comando não encontrado: <span class="system-message">${cmd}</span>. Digite 'ajuda' para ver a lista de comandos.`);
    }

    commandInput.value = '';
    window.scrollTo(0, document.body.scrollHeight);
  };

  const fetchGithubProjects = async () => {
    typeOutput('<span class="system-message">Buscando projetos no GitHub...</span>');
    try {
      const response = await fetch('https://api.github.com/users/jevemozer/repos?sort=pushed&direction=desc');
      if (!response.ok) {
        throw new Error(`Erro na API do GitHub: ${response.statusText}`);
      }
      const repos = await response.json();
      const deployedRepos = repos.filter(repo => repo.has_pages && repo.homepage);

      let projectsText = '';
      if(deployedRepos.length > 0) {
        deployedRepos.forEach(repo => {
          projectsText += `\n<a href="${repo.homepage}" target="_blank" class="link">${repo.name}</a>\n`;
          projectsText += `  <span class="command-output">${repo.description || 'Sem descrição.'}</span>\n`;
        });
      } else {
        projectsText = 'Nenhum projeto com GitHub Pages encontrado.';
      }
      typeOutput(projectsText);
    } catch (error) {
      typeOutput(`<span class="system-message">Erro ao buscar projetos: ${error.message}</span>`);
    }
  };

  const setTheme = (themeName) => {
    const body = document.body;
    // Remove todas as classes de tema existentes
    body.classList.remove('theme-classic', 'theme-amber', 'theme-blue');

    let message = `Tema <span class="system-message">${themeName}</span> aplicado.`;
    switch (themeName) {
      case 'classic':
        body.classList.add('theme-classic');
        break;
      case 'amber':
        body.classList.add('theme-amber');
        break;
      case 'blue':
        body.classList.add('theme-blue');
        break;
      default:
        body.classList.add('theme-classic'); // Volta para o padrão se o tema for inválido
        message = `Tema <span class="system-message">${themeName}</span> inválido. Voltando para o tema clássico.`;
    }
    typeOutput(message);
  };

  const startHackSimulation = async (target) => {
    isHacking = true;
    commandInput.disabled = true;
    typeOutput(`Iniciando ataque de força bruta em <span class="system-message">${target}</span>...`);

    const messages = [
      "Conectando aos servidores...",
      "Bypass de firewall detectado...",
      "Injetando SQL...",
      "Acessando banco de dados...",
      "Extraindo dados confidenciais...",
      "Finalizando operação..."
    ];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const progress = Math.floor(((i + 1) / messages.length) * 100);
      const progressBar = `[${'#'.repeat(progress / 10)}${'-'.repeat(10 - (progress / 10))}] ${progress}%`;
      typeOutput(`<span class="command-output">${message}</span>
${progressBar}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo
    }

    typeOutput(`
<span class="system-message">Ataque a <span class="command-output">${target}</span> concluído com sucesso! Dados comprometidos.</span>`);
    isHacking = false;
    commandInput.disabled = false;
    commandInput.focus();
  };

  const startMatrix = () => {
    matrixCanvas.classList.add('active');
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    const rainDrops = Array.from({ length: columns }).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
        if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(draw, 33);
    typeOutput("Iniciando efeito Matrix... Digite <span class='link'>sair</span> para parar.");
  };

  const stopMatrix = () => {
    if (matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
      matrixCanvas.classList.remove('active');
      typeOutput("Animação parada.");
    } else {
      typeOutput("Nenhuma animação rodando.");
    }
  };

  const init = () => {
    // Adiciona event listeners para esconder a splash screen ao interagir
    const hideSplashScreen = () => {
      splashScreen.classList.add('hidden');
      // Inicia o terminal depois que a animação de fade-out terminar
      setTimeout(() => {
        typeOutput(portfolioData.welcome);
        commandInput.focus();
      }, 1000); // Ajustado para 1 segundo, considerando a transição CSS
      splashScreen.removeEventListener('click', hideSplashScreen);
      document.removeEventListener('keydown', hideSplashScreen);
    };

    splashScreen.addEventListener('click', hideSplashScreen);
    document.addEventListener('keydown', hideSplashScreen);

    // Define o tema clássico como padrão ao carregar
    setTheme('classic');
  };

  commandInput.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Enter':
        executeCommand(commandInput.value.trim());
        break;
      case 'ArrowUp':
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          commandInput.value = commandHistory[historyIndex];
        }
        break;
      case 'ArrowDown':
        if (historyIndex > 0) {
          historyIndex--;
          commandInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = -1;
          commandInput.value = '';
        }
        break;
    }
  });

  terminal.addEventListener('click', () => commandInput.focus());

  // Inicia todo o processo
  init();
});