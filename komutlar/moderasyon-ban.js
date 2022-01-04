const Discord = require("discord.js");



module.exports = {
    calistir: async(client, message, args) => {

        if(!message.member.permissions.has("BAN_MEMBERS")) return message.reply("Üyeleri Banla Yetkiniz Yok.")


/////  !ban @kişi sebep

        let user = message.mentions.users.first();
        let sebep = args[1]


        if(!user) return message.reply("Lütfen Banlanacak Kişiyi Belirtiniz.")
        if(!sebep) return message.reply("Lütfen Sebep Belirtiniz")


const üye = message.guild.members.cache.get(user.id)

üye.ban({reason: sebep})


const ban = new Discord.MessageEmbed()
.setAuthor("Sıfırdan Bot Serisi Bölüm 2")
.setColor("GOLD")
.setDescription(`${user}, isimli kişi başarılı bir şekilde banlandı
banlanma sebebi: **${sebep}**`)


message.reply({embeds:[ban]})


},

name: "ban",
description: "Belirlenen kişiyi banlarsın",
aliases: [],
kategori: "moderasyon",
usage: "",
}