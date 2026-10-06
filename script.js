(() => {
  const $ = (s) => document.querySelector(s);
  const beijo = new Date(CONFIG.primeiroBeijo);

  document.querySelectorAll(".js-nome").forEach((el) => (el.textContent = CONFIG.nome));
  document.querySelectorAll(".js-assinatura").forEach((el) => (el.textContent = CONFIG.assinatura));

  // ---------- corações flutuando ----------
  const bg = $("#hearts-bg");
  const hearts = ["❤", "💕", "💖", "♥", "💗"];
  function spawnHeart() {
    const h = document.createElement("span");
    h.className = "float-heart";
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 12 + Math.random() * 22 + "px";
    h.style.animationDuration = 7 + Math.random() * 8 + "s";
    bg.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
  setInterval(spawnHeart, 700);
  for (let i = 0; i < 6; i++) setTimeout(spawnHeart, i * 200);

  // ---------- confete ----------
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  let pieces = [];
  let animating = false;
  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  addEventListener("resize", resize);
  resize();

  const colors = ["#ff5c8a", "#ffb3c7", "#ffd59e", "#ffffff", "#c2185b"];
  function confetti(count = 160, originY = 0.3) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      pieces.push({
        x: innerWidth / 2,
        y: innerHeight * originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        size: 5 + Math.random() * 7,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        heart: Math.random() < 0.3,
        life: 0,
      });
    }
    if (!animating) {
      animating = true;
      requestAnimationFrame(tick);
    }
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach((p) => {
      p.vy += 0.22;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.heart) {
        ctx.font = `${p.size * 2}px serif`;
        ctx.fillText("❤", 0, 0);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }
      ctx.restore();
    });
    pieces = pieces.filter((p) => p.y < innerHeight + 40 && p.life < 400);
    if (pieces.length) requestAnimationFrame(tick);
    else {
      animating = false;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  }

  // ---------- tela de senha ----------
  const input = $("#senha");
  const msg = $("#lock-msg");
  const dd = String(beijo.getDate()).padStart(2, "0");
  const mm = String(beijo.getMonth() + 1).padStart(2, "0");
  const yyyy = String(beijo.getFullYear());
  const aceitas = [dd + mm + yyyy, dd + mm + yyyy.slice(2), dd + mm, +dd + mm];

  input.addEventListener("input", () => {
    let v = input.value.replace(/\D/g, "").slice(0, 8);
    if (v.length > 4) v = v.slice(0, 2) + "/" + v.slice(2, 4) + "/" + v.slice(4);
    else if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    input.value = v;
    msg.textContent = "";
  });

  const erros = [
    "Hmm... não é essa 🤔",
    "Pensa no nosso primeiro beijo 💋",
    "Dica: foi em outubro de 2025 😘",
    "Foi um dia antes do seu aniversário 🎂",
  ];
  let tentativas = 0;

  function entrar() {
    const v = input.value.replace(/\D/g, "");
    if (aceitas.includes(v)) {
      input.blur();
      $("#lock").classList.remove("active");
      $("#content").classList.add("active");
      scrollTo(0, 0);
      setTimeout(() => confetti(220, 0.35), 300);
      tocarMusica();
      observar();
    } else {
      msg.textContent = erros[Math.min(tentativas, erros.length - 1)];
      tentativas++;
      const card = $(".lock-card");
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
      if (navigator.vibrate) navigator.vibrate(150);
    }
  }
  $("#btn-entrar").addEventListener("click", entrar);
  input.addEventListener("keydown", (e) => e.key === "Enter" && entrar());

  // ---------- música ----------
  function tocarMusica() {
    if (!CONFIG.musica) return;
    const audio = new Audio(CONFIG.musica);
    audio.loop = true;
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }

  // ---------- animação ao rolar ----------
  function observar() {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  // ---------- contador ----------
  function atualizarContador() {
    let diff = Math.max(0, Date.now() - beijo.getTime());
    const s = Math.floor(diff / 1000);
    $("#c-dias").textContent = Math.floor(s / 86400);
    $("#c-horas").textContent = Math.floor((s % 86400) / 3600);
    $("#c-min").textContent = Math.floor((s % 3600) / 60);
    $("#c-seg").textContent = s % 60;
  }
  atualizarContador();
  setInterval(atualizarContador, 1000);

  // ---------- linha do tempo ----------
  $("#timeline").innerHTML = CONFIG.linhaDoTempo
    .map(
      (t) => `<li><div class="t-date">${t.data}</div><div class="t-title">${t.titulo}</div><div class="t-text">${t.texto}</div></li>`
    )
    .join("");

  // ---------- galeria ----------
  const gallery = $("#gallery");
  const lightbox = $("#lightbox");
  CONFIG.fotos.forEach((f) => {
    const fig = document.createElement("figure");
    fig.className = "photo";
    fig.innerHTML = `<div class="ph">❤</div><img src="${f.src}" alt="" loading="lazy" /><figcaption>${f.legenda}</figcaption>`;
    const img = fig.querySelector("img");
    img.addEventListener("error", () => {
      img.remove();
      fig.dataset.vazio = "1";
    });
    fig.addEventListener("click", () => {
      if (fig.dataset.vazio) return;
      lightbox.querySelector("img").src = f.src;
      lightbox.querySelector("p").textContent = f.legenda;
      lightbox.classList.remove("hidden");
    });
    gallery.appendChild(fig);
  });
  lightbox.addEventListener("click", () => lightbox.classList.add("hidden"));

  // ---------- motivos ----------
  const reasons = $("#reasons");
  CONFIG.motivos.forEach((m) => {
    const card = document.createElement("div");
    card.className = "reason";
    card.innerHTML = `<div class="reason-inner"><div class="reason-face reason-front">💝</div><div class="reason-face reason-back">${m}</div></div>`;
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    reasons.appendChild(card);
  });

  // ---------- carta ----------
  $("#btn-carta").addEventListener("click", () => {
    $("#btn-carta").classList.add("hidden");
    $("#carta").classList.remove("hidden");
    const alvo = $("#carta-texto");
    alvo.classList.add("typing");
    const texto = CONFIG.carta;
    let i = 0;
    (function digitar() {
      alvo.textContent = texto.slice(0, ++i);
      if (i < texto.length) {
        const c = texto[i - 1];
        setTimeout(digitar, c === "\n" ? 280 : c === "." || c === "," ? 160 : 32);
      } else {
        alvo.classList.remove("typing");
      }
    })();
  });

  // ---------- coração final ----------
  $("#btn-final").addEventListener("click", () => {
    confetti(200, 0.6);
    for (let i = 0; i < 15; i++) setTimeout(spawnHeart, i * 60);
    if (navigator.vibrate) navigator.vibrate([80, 60, 80]);
  });
})();
