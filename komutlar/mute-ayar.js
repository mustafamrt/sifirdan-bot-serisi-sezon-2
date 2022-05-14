const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {












    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")



const muteyardım = new Discord.MessageEmbed()
.setDescription(`
**${ayarlar.prefix}mute-ayar rol** : Mute atılan kişiye verilecek rolü belirtlersiniz.
**${ayarlar.prefix}mute-ayar log** : Mute atılınca logun tutulacağı yeri ayarlarsın.
**${ayarlar.prefix}mute-ayar mute-yetkilisi** : Mute atabilecek rolü ayarlarsın.


`)


if(!args[1]) return message.reply({embeds:[muteyardım]})

if(args[0] == "rol") {

let rol = message.mentions.roles.first();


if(!rol) return message.reply(`Lütfen bir **Mute** rolü belirleyiniz`)

db.set(`mute_rol_${message.guild.id}`, rol.id)

message.reply(`Mute atıldığında kişinin tüm rollerini alıp ${rol} isimli rolü vericeğim.`)




}

if(args[0] == "mute-yetkilisi"){

    let rol = message.mentions.roles.first();
    
    
    if(!rol) return message.reply(`Lütfen bir **Mute Yetkilisi** rolü belirleyiniz`)
    
    db.set(`mute_yetkilirol_${message.guild.id}`, rol.id)
    
    message.reply(`Sadece ${rol} isimli rolü olan kişiler mute atabilecek.`)

    
    }
    

    if(args[0] == "log"){

        let kanal = message.mentions.channels.first();
        
        
        if(!kanal) return message.reply(`Lütfen bir **Mute Log** kanalı belirleyiniz`)
        
        db.set(`mute_kanal_${message.guild.id}`, kanal.id)
        
        message.reply(`Mute atıldığında artık ${kanal} isimli kanalda log tutucam`)
    
        
        }










},

name: "mute-ayar",
description: "",
aliases: [""],
kategori: "",
usage: "",
}