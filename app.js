const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const port = 3000
const diceModel = require('./model/diceModel')
const connectionMongoDB = require('./connectionMongoDB')
connectionMongoDB()

app.use(express.static('public'))

app.get('/dice', async (req, res) => {
  try {
    const allDice = await diceModel.find()
    return res.status(200).json(allDice)
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    })
  }
})

io.on('connection', (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`)

  socket.on('chatMessage', (msg) => {
    io.emit('newChatMessage', msg.user + ': ' + msg.message)
  })

  socket.on('diceValue', (dice) => {
    io.emit(
      'diceMessage',
      dice.user + ' rolled ' + dice.dice + '. Total: ' + dice.total
    )
    let user = dice.user
    let diceNumber = dice.dice
    let total = dice.total

    const newDice = new diceModel({
      player: user,
      diceNumber: diceNumber,
      sum: total,
    })
    newDice.save()
  })

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected!`)
  })
})

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`)
})
