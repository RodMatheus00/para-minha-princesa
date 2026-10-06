(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const beijo = new Date(CONFIG.primeiroBeijo);
  const slides = CONFIG.stories;
  const musica = CONFIG.musica;
  const DURACAO = { texto: 5500, contador: 8000, foto: 6500, top5: 10000, carta: 0, final: 0 };

  const segundosJuntos = () => Math.max(0, Math.floor((Date.now() - beijo.getTime()) / 1000));
  const diasJuntos = () => Math.floor(segundosJuntos() / 86400);
  const milhar = (n) => n.toLocaleString("pt-BR");

  const RABISCO =
    '<svg viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M3 13 C 40 5, 90 4, 130 9 S 185 15, 197 7" /></svg>';
  const fmt = (t = "") =>
    t
      .replace(/\{dias\}/g, diasJuntos())
      .replace(/\*(.+?)\*/g, `<span class="mark">$1${RABISCO}</span>`)
      .replace(/\n/g, "<br />");

  $$(".js-nome").forEach((el) => (el.textContent = CONFIG.nome));
  $("#lock-titulo").innerHTML = fmt("Antes de abrir,\n") + `<span class="sub">${fmt("quando foi o nosso *primeiro beijo*?")}</span>`;
  if (!musica?.youtube) $(".lock-foot").textContent = "";

  // ---------- entrada ----------
  const input = $("#senha");
  const msg = $("#lock-msg");
  const dd = String(beijo.getDate()).padStart(2, "0");
  const mm = String(beijo.getMonth() + 1).padStart(2, "0");
  const yyyy = String(beijo.getFullYear());
  const aceitas = [dd + mm + yyyy, dd + mm + yyyy.slice(2), dd + mm, String(+dd) + mm];

  input.addEventListener("input", () => {
    let v = input.value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 4) v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4);
    else if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    input.value = v;
    msg.textContent = "";
  });

  const erros = [
    "Não foi esse dia.",
    "Pensa melhor...",
    "Dica: outubro de 2025.",
    "Dica: um dia antes do seu aniversário.",
  ];
  let tentativas = 0;

  function entrar() {
    const v = input.value.replace(/\D/g, "");
    if (!aceitas.includes(v)) {
      msg.textContent = erros[Math.min(tentativas++, erros.length - 1)];
      const f = $(".lock-field");
      f.classList.remove("shake");
      void f.offsetWidth;
      f.classList.add("shake");
      if (navigator.vibrate) navigator.vibrate(120);
      return;
    }
    input.blur();
    carregarYouTube();
    montar();
    $("#stories").hidden = false;
    $("#lock").classList.add("saindo");
    setTimeout(() => $("#lock").remove(), 900);
    go(0);
    requestAnimationFrame(loop);
  }
  $("#btn-entrar").addEventListener("click", entrar);
  input.addEventListener("keydown", (e) => e.key === "Enter" && entrar());

  // ---------- montagem dos stories ----------
  let slideEls = [];
  let barEls = [];

  const ICONE_PLAY = '<svg class="i-play" viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';
  const ICONE_PAUSE =
    '<svg class="i-pause" viewBox="0 0 24 24"><rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor"/></svg>';

  function render(s) {
    switch (s.tipo) {
      case "texto":
        return `${s.fundo ? `<div class="bg-photo"><img src="${s.fundo}" alt="" /></div>` : '<div class="grad"></div>'}
        <div class="inner">
          <p class="eyebrow reveal">${s.eyebrow || ""}</p>
          <h2 class="serif reveal">${fmt(s.titulo)}</h2>
          ${s.texto ? `<p class="body reveal">${fmt(s.texto)}</p>` : ""}
        </div>`;
      case "contador":
        return `<div class="grad"></div>
        <div class="inner">
          <p class="eyebrow reveal">${s.eyebrow || ""}</p>
          <div class="big-num reveal js-dias">0</div>
          <p class="serif num-label reveal">dias juntos</p>
          <p class="ticker reveal"><span class="js-h">0</span>h <span class="js-m">0</span>min <span class="js-s">0</span>s</p>
          <div class="stats reveal">
            <div><b class="js-semanas">0</b><span>semanas</span></div>
            <div><b class="js-horas">0</b><span>horas</span></div>
            <div><b class="js-minutos">0</b><span>minutos</span></div>
            <div><b>1º</b><span>aniversário seu comigo</span></div>
          </div>
          ${s.texto ? `<p class="body reveal">${fmt(s.texto)}</p>` : ""}
        </div>`;
      case "foto":
        if (s.layout === "polaroid")
          return `<div class="grad"></div>
          <div class="inner">
            <p class="eyebrow reveal">${s.eyebrow || ""}</p>
            <div class="polaroid reveal">
              <div class="tape"></div>
              <img src="${s.src}" alt="" style="object-position:${s.posicao || "center"}" />
              <span class="hand">${s.bilhete || ""}</span>
            </div>
            <p class="serif legenda reveal">${fmt(s.legenda)}</p>
          </div>`;
        return `<div class="photo"><img src="${s.src}" alt="" style="object-position:${s.posicao || "center"}" /></div>
          <div class="shade"></div>
          <div class="caption">
            <p class="eyebrow reveal">${s.eyebrow || ""}</p>
            <p class="serif reveal">${fmt(s.legenda)}</p>
          </div>`;
      case "top5":
        return `<div class="grad"></div>
        <div class="inner">
          <p class="eyebrow reveal">${s.eyebrow || ""}</p>
          <h2 class="serif reveal">${fmt(s.titulo)}</h2>
          <ol class="top5">${s.itens
            .map((t, i) => `<li class="reveal"><span>${String(i + 1).padStart(2, "0")}</span>${fmt(t)}</li>`)
            .join("")}</ol>
        </div>`;
      case "carta":
        return `<div class="letter-wrap"><div class="letter">
          <p class="eyebrow">${s.eyebrow || ""}</p>
          ${s.foto ? `<div class="mini-polaroid"><div class="tape"></div><img src="${s.foto}" alt="" /></div>` : ""}
          <h2 class="serif">${fmt(s.titulo)}</h2>
          <div class="letter-body">${s.texto
            .split(/\n\s*\n/)
            .map((p) => `<p>${fmt(p.trim())}</p>`)
            .join("")}</div>
          <p class="sign hand">${CONFIG.assinatura}</p>
          <button class="btn-linha js-next">Continuar →</button>
        </div></div>`;
      case "final":
        return `<div class="grad"></div>
        <div class="inner">
          <div>
            <p class="eyebrow reveal">${s.eyebrow || ""}</p>
            <h2 class="serif reveal">${fmt(s.titulo)}</h2>
          </div>
          <div class="vinyl-area reveal">
            <div class="vinyl"><img src="${musica?.capa || ""}" alt="" /><div class="hole"></div></div>
          </div>
          <div>
            <div class="player reveal">
              <button class="play js-play" aria-label="Tocar música">${ICONE_PLAY}${ICONE_PAUSE}</button>
              <div class="track">
                <b>${musica?.titulo || ""}</b>
                <small>${musica?.artista || ""}</small>
                <div class="progress"><i class="js-progress"></i></div>
              </div>
            </div>
            <div class="final-foot reveal">
              <span class="hand">com amor, ${CONFIG.assinatura}</span>
              <button class="btn-linha js-replay">Ver de novo ↺</button>
            </div>
          </div>
        </div>`;
    }
    return "";
  }

  function montar() {
    const stage = $("#stage");
    const bars = $("#bars");
    slides.forEach((s) => {
      const el = document.createElement("section");
      const tema = s.tipo === "final" ? "escuro" : s.tema;
      el.className = `slide slide-${s.tipo}${s.layout ? " slide-" + s.layout : ""}${tema ? " tema-" + tema : ""}`;
      el.innerHTML = render(s);
      $$(".reveal", el).forEach((r, i) => (r.style.animationDelay = 0.1 + i * 0.22 + "s"));
      stage.appendChild(el);
      const b = document.createElement("div");
      b.className = "bar";
      b.innerHTML = "<i></i>";
      bars.appendChild(b);
    });
    slideEls = [...stage.children];
    barEls = [...bars.children].map((b) => b.firstChild);
    $$(".js-next", stage).forEach((b) => b.addEventListener("click", () => go(idx + 1)));
    $$(".js-replay", stage).forEach((b) => b.addEventListener("click", () => go(0)));
    $$(".js-play", stage).forEach((b) => b.addEventListener("click", alternarMusica));
    atualizarContador();
    setInterval(atualizarContador, 1000);
    ligarToques(stage);
  }

  function atualizarContador() {
    const s = segundosJuntos();
    const set = (cls, v) => $$(cls).forEach((el) => (el.textContent = v));
    set(".js-dias", Math.floor(s / 86400));
    set(".js-h", Math.floor((s % 86400) / 3600));
    set(".js-m", Math.floor((s % 3600) / 60));
    set(".js-s", s % 60);
    set(".js-semanas", milhar(Math.floor(s / 604800)));
    set(".js-horas", milhar(Math.floor(s / 3600)));
    set(".js-minutos", milhar(Math.floor(s / 60)));
  }

  // ---------- música (YouTube) ----------
  let player = null;
  let playerPronto = false;
  let querTocar = false;
  let erroPlayer = false;
  let checagem;

  function carregarYouTube() {
    if (!musica?.youtube) return;
    window.onYouTubeIframeAPIReady = () => {
      player = new YT.Player("yt", {
        videoId: musica.youtube,
        width: 240,
        height: 135,
        playerVars: { playsinline: 1, controls: 0, rel: 0, start: musica.inicio || 0 },
        events: {
          onReady: () => {
            playerPronto = true;
            if (querTocar) player.playVideo();
          },
          onStateChange: (e) => {
            const tocando = e.data === YT.PlayerState.PLAYING;
            document.body.classList.toggle("tocando", tocando);
            if (tocando) {
              clearTimeout(checagem);
              $("#yt-wrap").classList.remove("visivel");
            }
          },
          onError: () => (erroPlayer = true),
        },
      });
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  function alternarMusica() {
    if (erroPlayer || !musica?.youtube) {
      window.open(`https://www.youtube.com/watch?v=${musica.youtube}`, "_blank");
      return;
    }
    if (document.body.classList.contains("tocando")) {
      player.pauseVideo();
      return;
    }
    querTocar = true;
    if (playerPronto) player.playVideo();
    clearTimeout(checagem);
    checagem = setTimeout(() => {
      if (!document.body.classList.contains("tocando")) $("#yt-wrap").classList.add("visivel");
    }, 2500);
  }

  setInterval(() => {
    if (!playerPronto || !player.getDuration) return;
    const d = player.getDuration();
    if (d) $$(".js-progress").forEach((el) => (el.style.width = (player.getCurrentTime() / d) * 100 + "%"));
  }, 500);

  // ---------- navegação ----------
  let idx = 0;
  let inicio = 0;
  let acumulado = 0;
  let pausado = false;

  function temaDe(s) {
    if (s.tipo === "carta") return "claro";
    if (s.tipo === "final") return "escuro";
    if (s.tipo === "foto") return s.layout === "polaroid" ? "claro" : "escuro";
    return s.tema === "rosa" ? "claro" : s.tema || "escuro";
  }

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i > 0) $("#hint").classList.add("off");
    idx = i;
    acumulado = 0;
    inicio = performance.now();
    slideEls.forEach((el, k) => {
      el.classList.remove("active");
      if (k === i) {
        void el.offsetWidth;
        el.classList.add("active");
      }
    });
    barEls.forEach((b, k) => (b.style.width = k < i ? "100%" : "0%"));
    const wrap = $(".letter-wrap", slideEls[i]);
    if (wrap) wrap.scrollTop = 0;
    document.body.dataset.tema = temaDe(slides[i]);
  }

  function loop(agora) {
    const d = slides[idx].duracao ?? DURACAO[slides[idx].tipo];
    if (!d) {
      barEls[idx].style.width = "100%";
    } else if (!pausado) {
      const p = Math.min(1, (acumulado + agora - inicio) / d);
      barEls[idx].style.width = p * 100 + "%";
      if (p >= 1 && idx < slides.length - 1) go(idx + 1);
    }
    requestAnimationFrame(loop);
  }

  function pausar() {
    if (pausado) return;
    acumulado += performance.now() - inicio;
    pausado = true;
    $("#stories").classList.add("paused");
  }
  function retomar() {
    if (!pausado) return;
    inicio = performance.now();
    pausado = false;
    $("#stories").classList.remove("paused");
  }

  function ligarToques(stage) {
    let x0 = null;
    let y0 = null;
    let segurando = false;
    let moveu = false;
    let timer;

    stage.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      x0 = e.clientX;
      y0 = e.clientY;
      segurando = false;
      moveu = false;
      timer = setTimeout(() => {
        segurando = true;
        pausar();
      }, 220);
    });
    stage.addEventListener("pointermove", (e) => {
      if (x0 === null) return;
      if (Math.abs(e.clientX - x0) > 10 || Math.abs(e.clientY - y0) > 10) {
        moveu = true;
        clearTimeout(timer);
      }
    });
    stage.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      clearTimeout(timer);
      const dentroDaCarta = e.target.closest(".letter-wrap");
      if (segurando) retomar();
      else if (!moveu && !dentroDaCarta) {
        if (e.clientX < innerWidth * 0.3) go(idx - 1);
        else go(idx + 1);
      }
      x0 = null;
    });
    stage.addEventListener("pointercancel", () => {
      clearTimeout(timer);
      if (segurando) retomar();
      x0 = null;
    });
    stage.addEventListener("contextmenu", (e) => e.preventDefault());

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(idx + 1);
      if (e.key === "ArrowLeft") go(idx - 1);
    });
  }

  // pré-carrega as fotos
  [...new Set(slides.flatMap((s) => [s.src, s.fundo, s.foto]).concat(musica?.capa))]
    .filter(Boolean)
    .forEach((src) => (new Image().src = src));
})();
