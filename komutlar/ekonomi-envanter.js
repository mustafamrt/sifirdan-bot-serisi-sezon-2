const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {

let kazma = db.fetch(`kazma_${message.author.id}`)
let balta = db.fetch(`balta_${message.author.id}`)
let elmas = db.fetch(`elmas_${message.author.id}`)
let altın = db.fetch(`altın_${message.author.id}`)
let demir = db.fetch(`demir_${message.author.id}`)
let kömür = db.fetch(`kömür_${message.author.id}`)
let odun = db.fetch(`odun_${message.author.id}`)
const embed = new Discord.MessageEmbed()
.addField(`Kazma`, `**${kazma? kazma: 0}**`, true)
.addField(`Balta`, `**${balta ? balta: 0}**`, true)
.addField(`Elmas`, `**${elmas ? elmas: 0}**`, true)
.addField(`Altın`, `**${altın ? altın: 0}**`, true)
.addField(`Demir`, `**${demir ? demir: 0}**`, true)
.addField(`Kömür`, `**${kömür ? kömür: 0}**`, true)
.addField(`Odun`, `**${odun ? odun: 0}**`, true)

message.reply({embeds:[embed]})
},

name: "envanter",
description: "",
aliases: [""],
kategori: "",
usage: "",
}