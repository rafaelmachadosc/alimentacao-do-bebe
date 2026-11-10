// Abre o detalhe dos elementos clicáveis numa janela.
(function () {
  const janela = document.getElementById('janela');
  const titulo = document.getElementById('janela-titulo');
  const corpo = document.getElementById('janela-corpo');
  const arte = document.getElementById('janela-arte');
  const btAnterior = document.getElementById('janela-anterior');
  const btProximo = document.getElementById('janela-proximo');
  const btFechar = document.getElementById('janela-fechar');
  let atual = null;
  let origem = null;

  function grupoDe(el) {
    const g = el.dataset.grupo;
    return g ? Array.from(document.querySelectorAll('.clicavel[data-grupo="' + g + '"]')) : [el];
  }

  function mostrar(el) {
    const det = el.querySelector(':scope > .detalhe') || el.querySelector('.detalhe');
    if (!det) return;
    atual = el;
    titulo.textContent = det.dataset.titulo || '';
    // a imagem fica fixa, inteira e sem corte; só o texto rola
    arte.innerHTML = '';
    arte.hidden = true;
    if (det.dataset.arte) {
      const img = document.createElement('img');
      img.src = det.dataset.arte;
      img.alt = det.dataset.arteAlt || '';
      img.onload = function () { arte.hidden = false; };
      img.onerror = function () { arte.innerHTML = ''; arte.hidden = true; };
      arte.appendChild(img);
      arte.hidden = false;
    }
    corpo.innerHTML = det.innerHTML;
    corpo.hidden = !corpo.textContent.trim();
    corpo.scrollTop = 0;

    const grupo = grupoDe(el);
    const i = grupo.indexOf(el);
    btAnterior.hidden = i <= 0;
    btProximo.hidden = i < 0 || i >= grupo.length - 1;
  }

  function abrir(el) {
    origem = el;
    mostrar(el);
    if (!janela.open) {
      if (typeof janela.showModal === 'function') janela.showModal();
      else janela.setAttribute('open', '');
    }
    document.body.classList.add('janela-aberta');
  }

  function fechar() {
    if (typeof janela.close === 'function') janela.close();
    else janela.removeAttribute('open');
  }

  janela.addEventListener('close', function () {
    document.body.classList.remove('janela-aberta');
    if (origem) origem.focus();
  });

  btFechar.addEventListener('click', fechar);
  janela.addEventListener('click', function (e) { if (e.target === janela) fechar(); });
  btAnterior.addEventListener('click', function () {
    const g = grupoDe(atual); const i = g.indexOf(atual); if (i > 0) mostrar(g[i - 1]);
  });
  btProximo.addEventListener('click', function () {
    const g = grupoDe(atual); const i = g.indexOf(atual); if (i < g.length - 1) mostrar(g[i + 1]);
  });

  document.querySelectorAll('.clicavel').forEach(function (el) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-haspopup', 'dialog');
    el.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      abrir(el);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrir(el); }
    });
  });
})();
