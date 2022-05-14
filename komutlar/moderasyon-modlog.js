const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {

        let kanal = message.mentions.channels.first();
        if(!kanal) return message.reply(`Lütfen Modlog kanalı belirtiniz.`)
        db.set(`modlog_${message.guild.id}`, kanal.id)
        message.reply(`Modlog kanalı başarılı bir şekilde ${kanal} olarak ayarlandı.`)



},

name: "mod-log",
description: "",
aliases: [""],
kategori: "",
usage: "",
}