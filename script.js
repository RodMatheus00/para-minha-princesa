(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const beijo = new Date(CONFIG.primeiroBeijo);
  const slides = CONFIG.stories;
  const DURACAO = { texto: 5500, contador: 7000, foto: 6500, carta: 0, final: 0 };

  document.querySelectorAll(".js-nome").forEach((el) => (el.textContent = CONFIG.nome));
  if (!CONFIG.musica) $(".lock-foot").textContent = "";

  const diasJuntos = () => Math.floor((Date.now() - beijo.getTime()) / 86400000);
  const fmt = (t = "") => t.replace(/\{dias\}/g, diasJuntos()).replace(/\n/g, "<br />");

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
    tocarMusica();
    montar();
    $("#stories").hidden = false;
    $("#lock").classList.add("saindo");
    setTimeout(() => $("#lock").remove(), 900);
    go(0);
    requestAnimationFrame(loop);
  }
  $("#btn-entrar").addEventListener("click", entrar);
  input.addEventListener("keydown", (e) => e.key === "Enter" && entrar());

  function tocarMusica() {
    if (!CONFIG.musica) return;
    const audio = new Audio(CONFIG.musica);
    audio.loop = true;
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }

  // ---------- montagem dos stories ----------
  const fotos = slides.filter((s) => s.tipo === "foto").map((s) => s.src);
  let slideEls = [];
  let barEls = [];

  function render(s) {
    switch (s.tipo) {
      case "texto":
        return `<div class="inner">
          <p class="eyebrow reveal">${s.eyebrow || ""}</p>
          <h2 class="serif reveal">${fmt(s.titulo)}</h2>
          ${s.texto ? `<p class="body reveal">${fmt(s.texto)}</p>` : ""}
        </div>`;
      case "contador":
        return `<div class="inner">
          <p class="eyebrow reveal">${s.eyebrow || ""}</p>
          <div class="big-num reveal js-dias">0</div>
          <p class="serif num-label reveal">dias</p>
          <p class="ticker reveal"><span class="js-h">0</span> horas, <span class="js-m">0</span> minutos e <span class="js-s">0</span> segundos</p>
          ${s.texto ? `<p class="body reveal">${fmt(s.texto)}</p>` : ""}
        </div>`;
      case "foto":
        return `<div class="photo"><img src="${s.src}" alt="" style="object-position:${s.posicao || "center"}" /></div>
          <div class="shade"></div>
          <div class="caption">
            <p class="eyebrow reveal">${s.eyebrow || ""}</p>
            <p class="serif reveal">${fmt(s.legenda)}</p>
          </div>`;
      case "carta":
        return `<div class="letter-wrap"><div class="letter">
          <p class="eyebrow">${s.eyebrow || ""}</p>
          <h2 class="serif">${fmt(s.titulo)}</h2>
          <div class="letter-body">${s.texto.split(/\n\s*\n/).map((p) => `<p>${fmt(p.trim())}</p>`).join("")}</div>
          <p class="sign serif">${CONFIG.assinatura}</p>
          <button class="btn-linha js-next">Continuar →</button>
        </div></div>`;
      case "final": {
        const n = fotos.length;
        const imgs = fotos
          .map((src, i) => {
            const t = n > 1 ? i / (n - 1) - 0.5 : 0;
            return `<img src="${src}" alt="" style="--r:${(t * 16).toFixed(1)}deg;--x:${(t * 30).toFixed(0)}px;animation-delay:${0.2 + i * 0.25}s" />`;
          })
          .join("");
        return `<div class="stack">${imgs}</div>
          <div class="inner">
            <h2 class="serif reveal">${fmt(s.titulo)}</h2>
            <p class="eyebrow data reveal">${fmt(s.texto)}</p>
            <p class="assina reveal">com amor, ${CONFIG.assinatura}</p>
            <div class="reveal"><button class="btn-linha js-replay">Ver de novo ↺</button></div>
          </div>`;
      }
    }
    return "";
  }

  function montar() {
    const stage = $("#stage");
    const bars = $("#bars");
    slides.forEach((s) => {
      const el = document.createElement("section");
      el.className = `slide slide-${s.tipo}${s.tema ? " tema-" + s.tema : ""}`;
      el.innerHTML = render(s);
      stage.appendChild(el);
      const b = document.createElement("div");
      b.className = "bar";
      b.innerHTML = "<i></i>";
      bars.appendChild(b);
    });
    slideEls = [...stage.children];
    barEls = [...bars.children].map((b) => b.firstChild);
    stage.querySelectorAll(".js-next").forEach((b) => b.addEventListener("click", () => go(idx + 1)));
    stage.querySelectorAll(".js-replay").forEach((b) => b.addEventListener("click", () => go(0)));
    atualizarContador();
    setInterval(atualizarContador, 1000);
    ligarToques(stage);
  }

  function atualizarContador() {
    const s = Math.max(0, Math.floor((Date.now() - beijo.getTime()) / 1000));
    document.querySelectorAll(".js-dias").forEach((el) => (el.textContent = Math.floor(s / 86400)));
    document.querySelectorAll(".js-h").forEach((el) => (el.textContent = Math.floor((s % 86400) / 3600)));
    document.querySelectorAll(".js-m").forEach((el) => (el.textContent = Math.floor((s % 3600) / 60)));
    document.querySelectorAll(".js-s").forEach((el) => (el.textContent = s % 60));
  }

  // ---------- navegação ----------
  let idx = 0;
  let inicio = 0;
  let acumulado = 0;
  let pausado = false;

  function temaDe(s) {
    if (s.tipo === "carta") return "claro";
    if (s.tipo === "foto" || s.tipo === "final") return "escuro";
    return s.tema || "escuro";
  }

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    if (i > 0) $("#hint").classList.add("off");
    idx = i;
    acumulado = 0;
    inicio = performance.now();
    slideEls.forEach((el, k) => {
      if (k === i) {
        el.classList.remove("active");
        void el.offsetWidth;
        el.classList.add("active");
      } else {
        el.classList.remove("active");
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
  fotos.forEach((src) => (new Image().src = src));
})();
