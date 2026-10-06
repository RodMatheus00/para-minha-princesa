// ==========================================================
//  EDITE AQUI: todos os textos e fotos do site ficam neste arquivo
//  \n quebra a linha · *palavra* ganha um sublinhado desenhado à mão
//  {dias} mostra os dias desde o primeiro beijo
// ==========================================================
const CONFIG = {
  nome: "minha princesa",
  assinatura: "Matheus",

  // Data do primeiro beijo (usada no contador e como senha de entrada)
  primeiroBeijo: "2025-10-08T00:00:00",

  // Música do final (id do vídeo no YouTube, o que vem depois de "watch?v=")
  musica: {
    youtube: "xFJjczkU4So",
    titulo: "2 Much",
    artista: "Justin Bieber",
    inicio: 0, // segundo em que a música começa
    capa: "fotos/foto4.jpg", // foto no centro do disco
  },

  // Cada item é uma tela dos stories, na ordem.
  // tipos: "texto", "contador", "foto", "top5", "carta", "final"
  // temas: "escuro", "claro", "vermelho", "rosa"
  stories: [
    {
      tipo: "texto",
      tema: "escuro",
      fundo: "fotos/foto4.jpg",
      eyebrow: "08 · 10 · 2025",
      titulo: "Tudo começou\ncom um *beijo*.",
      texto: "Na véspera do seu aniversário.",
    },
    {
      tipo: "contador",
      tema: "claro",
      eyebrow: "Desde aquele dia",
      texto: "e eu não pretendo parar de contar.",
    },
    {
      tipo: "foto",
      src: "fotos/foto1.jpg",
      eyebrow: "Nº 01",
      legenda: "Meu lugar favorito continua sendo *do seu lado*.",
    },
    {
      tipo: "foto",
      src: "fotos/foto2.jpg",
      posicao: "center 55%",
      eyebrow: "Nº 02",
      legenda: "Qualquer aventura, desde que seja *com você*.",
    },
    {
      tipo: "foto",
      layout: "polaroid",
      tema: "rosa",
      src: "fotos/foto3.jpg",
      eyebrow: "Nº 03",
      legenda: "Os detalhes que só a gente *entende*.",
      bilhete: "a gente ♡",
    },
    {
      tipo: "foto",
      src: "fotos/foto4.jpg",
      posicao: "center 35%",
      eyebrow: "Nº 04",
      legenda: "E ainda tem *muita coisa* pela frente.",
    },
    {
      tipo: "top5",
      tema: "escuro",
      eyebrow: "Top 5 do ano",
      titulo: "Coisas favoritas\n*em você*",
      itens: [
        "Sua risada, principalmente quando é de mim",
        "O jeito que você me olha quando acha que eu não tô vendo",
        "Seu abraço depois de um dia ruim",
        "Como você cuida de quem você ama",
        "Você inteira, sem exceção",
      ],
    },
    {
      tipo: "texto",
      tema: "vermelho",
      eyebrow: "08 · 10 · 2026",
      titulo: "Um ano depois,\naqui estamos\n*de novo*.",
      texto: "{dias} dias depois daquele beijo, chega o seu dia.",
    },
    {
      tipo: "carta",
      eyebrow: "Uma carta",
      titulo: "Princesa,",
      foto: "fotos/foto1.jpg",
      texto: `Faz um ano que eu te beijei pela primeira vez, na véspera do seu aniversário. Naquele dia eu ainda não sabia, mas estava começando a melhor parte da minha vida.

De lá pra cá a gente viveu muita coisa. Dias bons, dias corridos, viagens, conversas sem fim e aquelas besteiras que só fazem sentido pra nós dois. Em todos eles eu tive a mesma certeza: é com você.

Obrigado por me escolher todos os dias, pela paciência, pelas risadas e por ser exatamente quem você é.

Feliz aniversário. Que esse novo ano seja leve, cheio de coisas boas, e que eu esteja do seu lado pra ver cada uma delas.

Te amo.`,
    },
    {
      tipo: "final",
      eyebrow: "Pra fechar, aperta o play",
      titulo: "Feliz *aniversário*.",
    },
  ],
};
