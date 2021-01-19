const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const inventoryViewer = require('mineflayer-web-inventory')
const autoeat = require("mineflayer-auto-eat")


/////////////////////aSTORT/////////////////////////////////

const bot = mineflayer.createBot({
    host: '168.119.141.28', // optional   
    port: 25551,
    username: "NiWinner",    // optional         // online-mode=true servers
    version: false,                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
    auth: 'mojang' 
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  const command = message.split(' ')
  switch (true) {
    case /niwinlist$/.test(message):
      list(username)
      break
    case /^niwinda \d+ \w+$/.test(message):
      // toss amount name
      // ex: toss 64 diamond
      tossItem(command[2], command[1])
      break
    case /^niwinda \w+$/.test(message):
      // toss name
      // ex: toss diamond
      tossItem(command[1])
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
  }
})

function itemToString (item) {
  if (item) {
    return `${item.name} x ${item.count}`
  } else {
    return '(nothing)'
  }
}

function itemByName (name) {
  return bot.inventory.items().filter(item => item.name === name)[0]
}

function tossItem (name, amount) {
  amount = parseInt(amount, 10)
  const item = itemByName(name)
  if (!item) {
    bot.chat(`I have no ${name}`)
  } else if (amount) {
    bot.toss(item.type, null, amount, checkIfTossed)
  } else {
    bot.tossStack(item, checkIfTossed)
  }

  function checkIfTossed (err) {
    if (err) {
      bot.chat(`unable to toss: ${err.message}`)
    } else if (amount) {
      bot.chat(`tossed ${amount} x ${name}`)
    } else {
      bot.chat(`tossed ${name}`)
    }
  }
}

function list (username, items = bot.inventory.items()){
  const output = items.map(itemToString).join(', ')
  if (output) {
    bot.chat(`msg ${username} ${output}`)
  } else {
    bot.chat(`msg ${username}`)
}
}

function insult (username) {
  bot.chat(`msg ${username} ${username} you fucking nigger!!`)
}

function tpauser (username) {
  bot.chat(`tpa ${username}`)
}

function tpani () {
    bot.chat('tpa Niloser1')
  }

bot.once('spawn', () => {
    bot.chat('register xyvZy42 xyvZy42')
    bot.chat('login xyvZy42')
    mineflayerViewer(bot, { port: 3007, firstPerson: true })
    bot.autoEat.options = {
      priority: "foodPoints",
      startAt: 14,
      bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
    }

})

inventoryViewer(bot)

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