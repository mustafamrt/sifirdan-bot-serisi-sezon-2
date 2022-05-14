const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {
        
        let xp = db.fetch(`xp_${message.guild.id}_${message.author.id}`)
        let lvl = db.fetch(`lvl_${message.guild.id}_${message.author.id}`)


        const embed = new Discord.MessageEmbed()
        .setDescription(`
        > Leveliniz: **${lvl ? lvl :0}**
        > Xp'niz   : **${xp ? xp : 0}**
        `)

        message.reply({embeds:[embed]})



},

name: "levelim",
description: "",
aliases: ["me", "level", "lvl"],
kategori: "",
usage: "",
}