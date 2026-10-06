// ==========================================================
//  EDITE AQUI: todos os textos e fotos do site ficam neste arquivo
//  Use \n para quebrar linha e {dias} para mostrar os dias desde o primeiro beijo.
// ==========================================================
const CONFIG = {
  nome: "minha princesa",
  assinatura: "Matheus",

  // Data do primeiro beijo (usada no contador e como senha de entrada)
  primeiroBeijo: "2025-10-08T00:00:00",

  // Música opcional: coloque um arquivo .mp3 na pasta e escreva o nome aqui, ex: "musica.mp3"
  musica: "",

  // Cada item é uma tela dos stories, na ordem.
  // tipos: "texto", "contador", "foto", "carta", "final"
  // temas (texto/contador): "escuro", "claro", "vermelho"
  stories: [
    {
      tipo: "texto",
      tema: "escuro",
      eyebrow: "08 · 10 · 2025",
      titulo: "Tudo começou\ncom um beijo.",
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
      legenda: "Meu lugar favorito continua sendo do seu lado.",
    },
    {
      tipo: "foto",
      src: "fotos/foto2.jpg",
      posicao: "center 55%",
      eyebrow: "Nº 02",
      legenda: "Qualquer aventura, desde que seja com você.",
    },
    {
      tipo: "foto",
      src: "fotos/foto3.jpg",
      eyebrow: "Nº 03",
      legenda: "Os detalhes que só a gente entende.",
    },
    {
      tipo: "foto",
      src: "fotos/foto4.jpg",
      posicao: "center 35%",
      eyebrow: "Nº 04",
      legenda: "E ainda tem muita coisa pela frente.",
    },
    {
      tipo: "texto",
      tema: "vermelho",
      eyebrow: "08 · 10 · 2026",
      titulo: "Um ano depois,\naqui estamos\nde novo.",
      texto: "{dias} dias depois daquele beijo, chega o seu dia.",
    },
    {
      tipo: "carta",
      eyebrow: "Uma carta",
      titulo: "Princesa,",
      texto: `Faz um ano que eu te beijei pela primeira vez, na véspera do seu aniversário. Naquele dia eu ainda não sabia, mas estava começando a melhor parte da minha vida.

De lá pra cá a gente viveu muita coisa. Dias bons, dias corridos, viagens, conversas sem fim e aquelas besteiras que só fazem sentido pra nós dois. Em todos eles eu tive a mesma certeza: é com você.

Obrigado por me escolher todos os dias, pela paciência, pelas risadas e por ser exatamente quem você é.

Feliz aniversário. Que esse novo ano seja leve, cheio de coisas boas, e que eu esteja do seu lado pra ver cada uma delas.

Te amo.`,
    },
    {
      tipo: "final",
      titulo: "Feliz\naniversário.",
      texto: "09 · 10 · 2026",
    },
  ],
};
