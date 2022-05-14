const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")
const moment = require("moment")
moment.locale("tr")

module.exports = {
    calistir: async(client, message, args) => {



let kontrol = Number(db.fetch(`günlük_${message.author.id}`))
if(kontrol > moment.utc().format("X")){
message.reply(`> Bir Sonraki Günlük Ödül için Süreniz: <t:${kontrol}:R> (<t:${kontrol}:F>)`)
}else {
    
let kontrol2 = Number(db.fetch(`coin_${message.author.id}`))
if(!kontrol2) db.set(`coin_${message.author.id}`, 0)

db.add(`coin_${message.author.id}`, 500)
db.set(`günlük_${message.author.id}`, moment.utc().add(1, 'day').format("X"))
message.reply(`Başarılı bir şekilde günlük ödülünüz aldınız.`)
}


},

name: "günlük",
description: "",
aliases: [""],
kategori: "",
usage: "",
}