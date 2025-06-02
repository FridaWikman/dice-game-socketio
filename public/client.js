const socket = io()

const userForm = document.querySelector('#userForm')
const userInput = document.querySelector('#userInput')
const messages = document.querySelector('#messages')
const messageForm = document.querySelector('#messageForm')
const messageInput = document.querySelector('#messageInput')
const userContainer = document.querySelector('#userContainer')
const diceMessage = document.querySelector('#diceMessage')
const winnerMsg = document.querySelector('.winnerMessage')
const flexContainer = document.querySelector('flexContainer')
const rollDice = document.querySelector('#rollDice')
const chatBtn = document.querySelector('#chatBtn')

let playerName
let total = 0
rollDice.disabled = true
chatBtn.disabled = true

userForm.addEventListener('submit', function (e) {
  e.preventDefault()
  playerName = userInput.value
  userContainer.innerHTML =
    '<h2>Welcome ' + playerName + '</h2></br><p class="score"></p>'
  document.querySelector('#user').style.display = 'none'
  rollDice.disabled = false
  chatBtn.disabled = false
})

messageForm.addEventListener('submit', function (e) {
  e.preventDefault()
  if (messageInput.value) {
    socket.emit('chatMessage', {
      user: playerName,
      message: messageInput.value,
    })
    messageInput.value = ''
  }
})

socket.on('newChatMessage', function (msg) {
  let li = document.createElement('li')
  li.textContent = msg
  messages.appendChild(li)
  messages.scrollTop = messages.scrollHeight
})

rollDice.addEventListener('click', function (e) {
  e.preventDefault()
  playerName = userInput.value
  let randomDice = Math.floor(Math.random() * 6 + 1)
  total += randomDice
  let score = document.querySelector('.score')
  score.innerHTML = 'Score: ' + total

  if (total >= 21) {
    document.querySelector('.flexContainer').classList.add('hide')
    confetti({
      particleCount: 300,
      spread: 90,
      origin: { y: 0.6 },
    })
    winnerMsg.innerHTML =
      '<div class="winnerDiv"><p>' +
      playerName +
      ' got 21 and won the game!</p><br><button class="button" id="playAgainBtn">Play again</button></div>'
    const playAgainBtn = document.querySelector('#playAgainBtn')
    playAgainBtn.addEventListener('click', function (e) {
      e.preventDefault()
      window.location.reload()
    })
  }
  socket.emit('diceValue', {
    user: playerName,
    dice: randomDice,
    total: total,
  })
})

socket.on('diceMessage', function (dice) {
  let li = document.createElement('li')
  li.textContent = dice
  diceMessage.appendChild(li)
  diceMessage.scrollTop = diceMessage.scrollHeight
})
