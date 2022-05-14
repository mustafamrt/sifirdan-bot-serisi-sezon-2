const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {


const menu = new Discord.MessageEmbed()
.setDescription(`

**${ayarlar.prefix}kayıt kayıt-yetkilisi** : Kayıt yetkilisi rolünü ayarlarsın.
**${ayarlar.prefix}kayıt erkek-rol**       : Erkek üye rolünü ayarlarsın
**${ayarlar.prefix}kayıt kız-rol**         : Kız üye rolünü ayarlarsın
**${ayarlar.prefix}kayıt kayıtsız-rol**    : Kayıtsız rolünü ayarlarsın.
**${ayarlar.prefix}kayıt kayıt-log**       : Kayıt Log kanalını ayarlarsın.
**${ayarlar.prefix}kayıt kayıt-kanal**     : Kayıt kanalını ayarlarsın.
`)

if(!args[0]) return message.reply({embeds: [menu]})

if(args[0] === "kayıt-yetkilisi"){
let rol = message.mentions.roles.first()

if(!rol) return message.reply(`Lütfen **Kayıt Yetkilisi** rolünü etiketleyiniz.`)
db.set(`kayıt_yetkili_${message.guild.id}`, rol.id)
message.reply(`Başarılı bir şekilde **Kayıt Yetkilisi** rolü ${rol} olarak ayarlandı.`)
}

if(args[0] === "erkek-rol"){
let rol = message.mentions.roles.first()

if(!rol) return message.reply(`Lütfen **Erkek** rolünü etiketleyiniz.`)
db.set(`kayıt_erkek_rol_${message.guild.id}`, rol.id)
message.reply(`Başarılı bir şekilde **Erkek** rolü ${rol} olarak ayarlandı.`)
}
if(args[0] === "kız-rol"){
let rol = message.mentions.roles.first()

if(!rol) return message.reply(`Lütfen **Kız** rolünü etiketleyiniz.`)
db.set(`kayıt_kız_rol_${message.guild.id}`, rol.id)
message.reply(`Başarılı bir şekilde **Kız** rolü ${rol} olarak ayarlandı.`)
}
if(args[0] === "kayıtsız-rol"){
let rol = message.mentions.roles.first()

if(!rol) return message.reply(`Lütfen **Kayıtsız** rolünü etiketleyiniz.`)
db.set(`kayıt_kayıtsız_rol_${message.guild.id}`, rol.id)
message.reply(`Başarılı bir şekilde **Kayıtsız** rolü ${rol} olarak ayarlandı.`)
}

if(args[0] === "kayıt-log"){
let kanal = message.mentions.channels.first()

if(!kanal) return message.reply(`Lütfen **Kayıt Log** kanalını etiketleyiniz.`)
db.set(`kayıt_kayıt_log_${message.guild.id}`, kanal.id)
message.reply(`Başarılı bir şekilde **Kayıt Log** kanalı ${kanal} olarak ayarlandı.`)
}


if(args[0] === "kayıt-kanal"){
let kanal = message.mentions.channels.first()

if(!kanal) return message.reply(`Lütfen **Kayıt Kanal** kanalını etiketleyiniz.`)
db.set(`kayıt_kayıt_kanal_${message.guild.id}`, kanal.id)
message.reply(`Başarılı bir şekilde **Kayıt Kanal** kanalı ${kanal} olarak ayarlandı.`)
}
},

name: "kayıt",
description: "Kayıt Sistemini ayarlarsın.",
aliases: [],
kategori: "",
usage: "kayıt",
}