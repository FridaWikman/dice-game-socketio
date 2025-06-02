const mongoose = require('mongoose')

const DiceSchema = new mongoose.Schema({
  player: {
    type: String,
    required: true,
  },
  diceNumber: {
    type: Number,
    required: true,
  },
  sum: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('rolledDice', DiceSchema)
