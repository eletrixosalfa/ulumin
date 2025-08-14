module.exports = [
  {
    model: 'Lights',
    actions: ['Ligar', 'Desligar', 'Mudar cor', 'Temporizar'],
  },
  {
    model: 'Blinds',
    actions: ['Abrir', 'Fechar'],
  },
  {
    model: 'Sensors',
    actions: ['Ler valor'],
  },
  {
    model: 'Switches',
    actions: ['Ligar', 'Desligar'],
  }
  // Futuramente adicionar os necessários
];