const Discord = require("discord.js");


const db = require("nrc.db")
module.exports = {
    calistir: async(client, message, args) => {






let user = message.author;

let id = message.author.id

let guild = message.guild;

let gid = message.guild.id

let sayi = 1

let map = message.guild.members.cache.filter(mem => !mem.user.bot).array().sort((a, b) => { return ( db.fetch(`test_${b.user.id}_${message.guild.id}`) || 0) - ( db.fetch(`test_${a.user.id}_${message.guild.id}`) || 0)  }).slice(0, 5).map(member => { return `\`#${sayi++}\` <@${member.user.id}> | **__Seviye:__** \`${( db.fetch(`lvl_${member.user.id}_${message.guild.id}`))}\` **__XP:__** \`${( db.fetch(`xp_${member.user.id}_${message.guild.id}`)) || `0`}\`` })

message.channel.send(new Discord.MessageEmbed()

.setColor("RANDOM")

.setAuthor(`${message.guild.name} Seviye İlk 5`, client.user.avatarURL())

.setDescription(map)

.setFooter(`${client.user.username} Seviye-Top Sistemi!`, client.user.avatarURL()))

},

name: "test",
description: "",
aliases: [],
kategori: "",
usage: "",
}