const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {





        let bos = args[0]

      

if(!bos) return message.reply(`Lütfen Komudu Doğru Kullanınız. **Doğru Kullanım: ${ayarlar.prefix}otorol kanal #kanal / ${ayarlar.prefix}otorol rol @üye **`)

if(args[0] == "rol"){

  let rol = message.mentions.roles.first();

  if(!rol) return message.reply(`Lütfen Bir Rol Belirtiniz`)

    db.set(`otorol_rol_${message.guild.id}`, rol.id)
    message.reply(`Başarılı bir şekilde ${rol} isimli rolü gelen yeni kişilere vereceğim.`)
}


if(args[0] == "kanal"){
    let kanal = message.mentions.channels.first();

    if(!kanal) return message.reply(`Lütfen bir kanal belirtiniz.`)
    db.set(`otorol_kanal_${message.guild.id}`, kanal.id)
    message.reply(`Başarılı bir şekilde ${kanal} isimli kanala rol verdiğim kişileri yazıcam`)
}

if(args[0] == "sıfırla"){

    db.delete(`otorol_kanal_${message.guild.id}`)
    db.delete(`otorol_rol_${message.guild.id}`)
    message.reply(`Sistem başarılı bir şekilde sıfırlandı / kapatıldı.`)

}




},

name: "otorol",
description: "Gelen kişilere verilecek rolü ayarlarsın",
aliases: [],
kategori: "",
usage: "",
}