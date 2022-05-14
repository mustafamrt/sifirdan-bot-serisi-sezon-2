const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {





   let kayıt_ytk     =    db.fetch(`kayıt_yetkili_${message.guild.id}`)
   let kayıt_erkek   =    db.fetch(`kayıt_erkek_rol_${message.guild.id}`)
   let kayıt_kız     =      db.fetch(`kayıt_kız_rol_${message.guild.id}`)
   let kayıtsız      =     db.fetch(`kayıt_kayıtsız_rol_${message.guild.id}`)
   let kayıt_log     =     db.fetch(`kayıt_kayıt_log_${message.guild.id}`)
   let kayıt_kanal   =     db.fetch(`kayıt_kayıt_kanal_${message.guild.id}`)




if(!kayıt_ytk) return message.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`)
if(!message.member.roles.cache.has(kayıt_ytk)) return message.reply(`Bu komudu sadece ayarlanan **Kayıt Yetkilisi** rolüne sahip olan kişiler kullanabilir`)
if(!kayıt_erkek) return message.reply(`**Erkek** rolü ayarlanmamış.`)
if(!kayıt_kız) return message.reply(`**Kız** rolü ayarlanmamış.`)
if(!kayıtsız) return message.reply(`**Kayıtsız** rolü ayarlanmamış.`)
if(!kayıt_log) return message.reply(`**Kayıt Log** kanalı ayarlanmamış.`)
if(!kayıt_kanal) return message.reply(`**Kayıt** kanalı ayarlanmamış.`)


let member = message.mentions.members.first()
let isim = args[1]
let yas = args[2]



if(!member) return message.reply(`Lütfen İsmi Değiştirlecek kişiyi Belirtiniz.`)
if(!isim) return message.reply(`Yeni Adını belirtiniz.`)
if(!yas) return message.reply(`Yeni Yaşını belirtiniz.`)

let üye = message.guild.members.cache.get(member.id)


üye.setNickname(`${isim} | ${yas}`)


let kayıtları = db.fetch(`kayıt_yetkilisi_${message.guild.id}_${message.author.id}`)
const embed = new Discord.MessageEmbed()
.setDescription(`
İsmi Değiştirilen Kişi: ${member}

Yeni İsmi: **${isim}**
Yeni Yaşı : **${yas}**


Kayıt yetkilisin bilgileri;
Kayıtsız yapan kişi : ${message.author}
`)

message.reply({embeds: [embed]})
client.channels.cache.get(kayıt_log).send({embeds: [embed]})




},

name: "isim",
description: "Üyenin ismini değiştirirsin.",
aliases: [],
kategori: "kayıt",
usage: "",
}