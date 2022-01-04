const Discord = require("discord.js");



module.exports = {
    calistir: async(client, message, args) => {

        if(!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Üyeleri Banla Yetkiniz Yok.")


/////  !ban @kişi sebep

        let user = message.mentions.users.first();
        let sebep = args[1]


        if(!user) return message.reply("Lütfen Atılacak Kişiyi Belirtiniz.")
        if(!sebep) return message.reply("Lütfen Sebep Belirtiniz")


const üye = message.guild.members.cache.get(user.id)

üye.kick({reason: sebep})


const kick = new Discord.MessageEmbed()
.setAuthor("Sıfırdan Bot Serisi Bölüm 2")
.setColor("GOLD")
.setDescription(`${user}, isimli kişi başarılı bir şekilde Sunucudan Atıldı
Atılma sebebi: **${sebep}**`)


message.reply({embeds:[kick]})


},

name: "kick",
description: "Belirlenen kişiyi Sunucudan Atarsın",
aliases: [],
kategori: "moderasyon",
usage: "",
}