const dotenv = require("dotenv").config()
const Discord = require("discord.js")
const fetch = require("node-fetch")
const client = new Discord.Client()

const playerList = []
let players = []

// START OF RIOT API REQUEST
const urlByName = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
const urlById = 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'

// Get ID from summoner name
const getSummonerIdByName = async (url, message) => {
  const sumName = message.content.slice().trim().split(/ +/g)

  try {
    const response = await fetch(`${url}${sumName[1]}`, {
      method: "GET",
      withCredentials: true,
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
        "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,la;q=0.5",
        "Content-Type": "application/json"
      }
    })
    const json = await response.json()
    getSummonerRankById(urlById, json.id, message)
  } catch (error) {
    console.log(error)
  }
}

// Get rank by ID
const getSummonerRankById = async (url, id, message) => {
  try {
    const response = await fetch(`${url}${id}`, {
      method: "GET",
      withCredentials: true,
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
        "Accept-Language": "sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6,la;q=0.5",
        "Content-Type": "application/json"
      }
    })
    const json = await response.json()
    console.log(json)
    if(json.length === 0) {
      return message.reply(`Sorry, this summoner dont have any rank yet!`)
    } else {
      summonerRankResponse(json, message)
    }
  } catch (error) {
    console.log(error)
  }
}

// Bot rank response
const summonerRankResponse = async (data, message) => {
  const messageEmbed = new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle(data[0].summonerName)
  .attachFiles(['Emblem_Gold.png', 'Emblem_Silver.png'])
  // .attachFiles(['Emblem_Silver.png'])
	.setURL(`https://euw.op.gg/summoner/userName=${data[0].summonerName}`)
	.setDescription(`League of legends summoner rank`)
	.addFields(
    // IF statement to sort random response from server
    data[0].queueType === 'RANKED_SOLO_5x5' ? { name: 'Ranked Solo', value: `${data[0].tier} ${data[0].rank}`, inline: true } : { name: 'Ranked Solo', value: `${data[1].tier} ${data[1].rank}`, inline: true },
    data[1].queueType === 'RANKED_FLEX_SR' ? { name: 'Ranked Flex', value: `${data[1].tier} ${data[1].rank}`, inline: true } : { name: 'Ranked Flex', value: `${data[0].tier} ${data[0].rank}`, inline: true }
    )
  .setImage('attachment://Emblem_Gold.png')
  .setImage('attachment://Emblem_Silver.png')
	.setTimestamp()
  .setFooter('Information provided by Two-Face')
  return message.reply(messageEmbed)
}



// Rock, paper, scissors game
const rps = async (message) => {
  const acceptedReplies = ['rock', 'paper', 'scissors']
  const random = Math.floor((Math.random() * acceptedReplies.length))
  const result = acceptedReplies[random]
  console.log('Bot choose:', result)

  const choice = message.content.slice().trim().split(/ +/g)
  console.log(message.author.username, `choose:`, choice[1])

  if(players.indexOf(message.author.username) !== -1) {
    console.log('Player exists')
  } else {
    players.push(message.author.username)
  }


  if (result === choice[1]) return message.reply(`It's a tie! We both choose **${choice[1]}**!`)

  switch (choice[1]) {
    case 'rock': {
        if (result === 'paper') return message.reply(`I win! My choice was **${result}** and your choice was **${choice[1]}**`)
        else {
            message.reply(`You win! Your choice was **${choice[1]}** and my choice was **${result}**`)
            if(message.author.username === 'mettlica') {
              return message.author.reply('https://memegenerator.net/img/instances/68370253.jpg')
            } else {
              const randomNumber = Math.floor(Math.random() * 10000)
              const file = await fetch(`http://api.oboobs.ru/boobs/${randomNumber}`).then(response => response.json())
              console.log('Oh no you didnt!')
              return message.author.send('http://media.oboobs.ru/' + file[0].preview)
            }
        }

    }
    case 'paper': {
        if (result === 'scissors') return message.reply(`I win! My choice was **${result}** and your choice was **${choice[1]}**`)
        else {
          message.reply(`You win! Your choice was **${choice[1]}** and my choice was **${result}**`)
          if(message.author.username === 'mettlica') {
            return message.author.reply('https://memegenerator.net/img/instances/68370253.jpg')
          } else {
            const randomNumber = Math.floor(Math.random() * 10000)
            const file = await fetch(`http://api.oboobs.ru/boobs/${randomNumber}`).then(response => response.json())
            console.log('Oh no you didnt!')
            return message.author.send('http://media.oboobs.ru/' + file[0].preview)
          }
        }
    }
    case 'scissors': {
        if (result === 'rock') return message.reply(`I win! My choice was **${result}** and your choice was **${choice[1]}**`)
        else {
          message.reply(`You win! Your choice was **${choice[1]}** and my choice was **${result}**`)
          if(message.author.username === 'mettlica') {
            return message.author.reply('https://memegenerator.net/img/instances/68370253.jpg')
          } else {
            const randomNumber = Math.floor(Math.random() * 10000)
            const file = await fetch(`http://api.oboobs.ru/boobs/${randomNumber}`).then(response => response.json())
            console.log('Oh no you didnt!')
            return message.author.send('http://media.oboobs.ru/' + file[0].preview)
          }
        }
    }
    default: {
        return message.reply(`Only these responses are accepted: \`${acceptedReplies.join(', ')}\``)
    }
  }

}


client.on("ready", () => {
  console.log("I am ready!")
  client.user.setActivity("Batman")
})


client.on("message", async (message) => {

  if (message.content.startsWith("ping")) {
    message.author.send("pong!")
  }

  // Random pic of cat :/
  if(message.content === 'cat') {
    const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json())
    message.author.send(file)
  }

  // Rock, paper, scissors help command
  if(message.content === '#rps') {
    return message.reply(`You play by typing **rps** followed by your choice, **rock**, **paper**, **scissors**. I.e rps rock`)
  }

  // List all current registered players
  if(message.content === '#stats') {
    return message.reply(`Current players: ${players}`)
  }

  // Rock, paper, scissors game
  if(message.content.startsWith('rps')) {
    rps(message)
  }

  // Search LOL Summoner ID by name: 'whois FredrikochFilip'
  if(message.content.startsWith('whois')) {
    getSummonerIdByName(urlByName, message)
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)