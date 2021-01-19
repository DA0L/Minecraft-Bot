/*
 * Never spend hours mining from ground to bedrock again!
 *
 * Learn how to create a simple bot that is capable of digging the block
 * below his feet and then going back up by creating a dirt column to the top.
 *
 * As always, you can send the bot commands using chat messages, and monitor
 * his inventory at any time.
 *
 * Remember that in survival mode he might not have enough dirt to get back up,
 * so be sure to teach him a few more tricks before leaving him alone at night.
 */
const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
    host: 'localhost', // optional   
    port: 53286,
    username: "NiWinner",    // optional         // online-mode=true servers
    version: false,                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
    auth: 'mojang' 
})

bot.on('chat', async (username, message) => {
  if (username === bot.username) return
  switch (message) {
    case 'NiWinNi':
      tpani()
      break
    case 'NiWinven':
      tpauser(username)
      break
    case 'NiWinputo':
      insult(username)
      break
    case 'NiWinreg':
      reg()
      break
    case 'NiWinlog':
      log()
      break
  }
})

function insult (username) {
  bot.chat(`/msg ${username} you fucking nigger!!`)
}

function tpauser (username) {
  bot.chat(`/tpa ${username}`)
}

function tpani () {
    bot.chat('/tpa Niloser1')
  }

function reg () {
    bot.chat('/register Nilo Nilo')
  }

function log () {
    bot.chat('/login xyvZy42')
  }

  bot.once('spawn', () => {
     bot.chat('/register xyvZy42 xyvZy42')
     bot.chat('/login xyvZy42')
  
  })

// Log errors and kick reasons:
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))