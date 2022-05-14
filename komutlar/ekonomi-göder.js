const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {


let coin = db.fetch(`coin_${message.author.id}`)
let miktar = args[1]

let user = message.mentions.users.first();

if(!user) return message.reply(`lütfen gönderilecek kişiyi belirtiniz.`)
if(message.author.id === user.id) return message.reply(`Kendine para gönderemezsin.`)
if(user.bot === true) return message.reply(`Bir Bota coin gönderemezsiniz.`)
if(!miktar) return message.reply(`Lütfen gönderilecek miktarı giriniz.`)
if(isNaN(miktar)) return message.reply(`Gönderilecek miktar sayı ile olmalıdır.`)
if(coin < miktar) return message.reply(`Gönderilecek miktar cüzdanınızda yok.`)

db.add(`coin_${message.author.id}`, -Number(miktar))
let kontrol = db.fetch(`coin_${user.id}`)
if(!kontrol) db.set(`coin_${user.id}`,0)
db.add(`coin_${user.id}`, Number(miktar))
message.reply(`Başarılı bir şekilde **${miktar}** miktar coin ${user} isimli kişiye gönderildi.`)


},

name: "coin-gönder",
description: "",
aliases: [""],
kategori: "",
usage: "",
}