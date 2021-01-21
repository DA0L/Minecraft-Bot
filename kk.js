const mineflayer = require('mineflayer')
const autoeat = require("mineflayer-auto-eat")


/////////////////////aSTORT/////////////////////////////////

const bot = mineflayer.createBot({
    host: '168.119.141.28', // optional   
    port: 25551,
    username: "NiWinner",    // optional         // online-mode=true servers
    version: false,                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
    auth: 'mojang' 
})

bot.on('message', function(msg) {
  const str = msg.toString()
  // const [completeMsg, guild, username, message] = str.match(/【(.*)】(.*) ▶ (.*)/) || [str]
  const [completeMsg, username, message] = str.match(/[(.*) -> me] (.*)/) || [str]
  if (username && message) bot.emit("chat", username, message)
  console.log(completeMsg)
  console.log(username)
  console.log(message)
})

bot.on('chat', (username, message) => {
  console.log(message)
  if (username === bot.username) return
  const command = message.split(" ")
  switch (true) {
    case /niwinlist$/.test(message):
      list(username)
      break
    case /^niwinda \d+ \w+$/.test(message):
      // toss amount name
      // ex: toss 64 diamond
      tossItem(username, command[2], command[1])
      break
    case /^niwinda \w+$/.test(message):
      // toss name
      // ex: toss diamond
      tossItem(username, command[1])
      break
    case /^niwinven$/.test(message):
      tpauser(username)
      break
    case /^niwinputo$/.test(message):
      insult(username)
      break
    case /^niwinni$/.test(message):
      tpani()
      break
    case /^niwinhelp$/.test(message):
      help(username)
      break
  }
})

function help (username) {
  bot.chat(`/msg ${username} My commands are: niwinlist for seeing my inventory        niwinda amount name for tossing a number of items/all copies of that item       niwinven for me to tpa to user        niwinputo for being insulted     niwinni for me to tpa to nil     niwinhelp for displaying commands`)
}

function itemToString (item) {
  if (item) {
    return `(${item.name} x ${item.count})`
  } else {
    return '(nothing)'
  }
}

//bot.on('message', msg => console.log(msg.toString().split("▶")[1])) // msg
//bot.on('message', msg => console.log(msg.toString().split("】")[1].split("▶"))) // user

function itemByName (name) {
  return bot.inventory.items().filter(item => item.name === name)[0]
}

function tossItem (username, name, amount) {
  amount = parseInt(amount, 10)
  const item = itemByName(name)
  if (!item) {
    bot.chat(`/msg ${username} I have no ${name}`)
  } else if (amount) {
    bot.toss(item.type, null, amount, checkIfTossed)
  } else {
    bot.tossStack(item, checkIfTossed)
  }

  function checkIfTossed (err) {
    if (err) {
      bot.chat(`/msg ${username} unable to toss: ${err.message}`)
    } else if (amount) {
      bot.chat(`/msg ${username} tossed ${amount} x ${name}`)
    } else {
      bot.chat(`/msg ${username} tossed ${name}`)
    }
  }
}

function list (username, items = bot.inventory.items()){
  const output = items.map(itemToString).join(', ')
  if (output) {
    bot.chat(`/msg ${username} ${output}`)
  } else {
    bot.chat(`/msg ${username}`)
}
}

function insult (username) {
  bot.chat(`/msg ${username} ${username} you fucking nigger!!`)
}

function tpauser (username) {
  bot.chat(`/tpa ${username}`)
}

function tpani () {
    bot.chat('/tpa Niloser1')
  }

bot.once('spawn', () => {
    bot.chat('/login xyvZy42')
    bot.chatAddPattern(/^【(.*)】(.*) ▶ (.*)$/, 'chat', 'Anotat chat')
    bot.chatAddPattern(/^[(.*) -> me] (.*)$/, 'whisper', 'Anotat whisper')
    bot.autoEat.options = {
      priority: "foodPoints",
      startAt: 14,
      bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
    }

})


//////////////////AUTOEAT////////////////////

bot.loadPlugin(autoeat)

bot.on("autoeat_started", () => {
  console.log("Auto Eat started!")
})

bot.on("autoeat_stopped", () => {
  console.log("Auto Eat stopped!")
})

bot.on("health", () => {
  if (bot.food === 20) bot.autoEat.disable()
  // Disable the plugin if the bot is at 20 food points
  else bot.autoEat.enable() // Else enable the plugin again
})





///////////////////////ERRORLOG///////////////

bot.on("kicked", (reason, loggedIn) => console.log(reason, loggedIn))
bot.on("error", err => console.log(err))