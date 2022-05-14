const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")


module.exports = {
    calistir: async(client, message, args) => {

        let xpmesaj = db.fetch(`xp_mesaj_${message.guild.id}`)
        let xplevel = db.fetch(`xp_level_${message.guild.id}`)
        let levellog = db.fetch(`level_log_${message.guild.id}`)
        let leveltebrik = db.fetch(`level_tebrik_${message.guild.id}`)
        let leveltebrik2 = db.fetch(`level_tebrik_${message.guild.id}`) 
        let son;
        if(leveltebrik2 === true){
            son = "Açık"
        }else{
            son = "Kapalı"
        }



        const menu = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(`
        > Doğru Kullanım;
        **${ayarlar.prefix}level-ayar xp-mesaj miktar :** mesaj başı xp oranını ayarlarsınız. [Otomatik ayar 1]
        **${ayarlar.prefix}level-ayar xp-level :** Kaç xp de lvl atlar. [Otomatik ayar 250]
        **${ayarlar.prefix}level-ayar log :** Level atlandığında mesaj atılacak kanal.
        **${ayarlar.prefix}level-ayar tebrik-mesaj :** Kişi level atladığında mesajını yanıtla yaparak tebrik eder. [Otomatik ayar **Kapalı**]
        
        > Ayarlar; 
        Mesaj başına Verilecek XP: **${xpmesaj ? xpmesaj : 1}**
        Kaç xp de level atılayacak: **${xplevel ? xplevel : 250}**
        Level Log: <#${levellog ? levellog : "Ayarlanmamış"}>
        Tebrik Mesaj: **${son}**


        `)

        if(!args[0]) return message.reply({embeds:[menu]})

        if(args[0] === "xp-mesaj"){
            let miktar = args[1]
            if(!miktar) return message.reply(`Lütfen her bir mesaj için verilecek xp değerini yazınız.`)
            db.set(`xp_mesaj_${message.guild.id}`, Number(miktar))
            message.reply(`Başarılı bir şekilde her bir mesaj için **${miktar}** xp ayarlandı.`)
        }
        if(args[0] === "xp-level"){
            let miktar = args[1]
            if(!miktar) return message.reply(`Lütfen kaç xp de level atlanacak ayarlayınız.`)
            db.set(`xp_level_${message.guild.id}`, Number(miktar))
            message.reply(`Başarılı bir şekilde level atlamak için gerekli xp **${miktar}** olarak ayarlanmıştır.`)
        }
        if(args[0] === "tebrik-mesaj"){
            let kontrol1 = db.fetch(`level_tebrik_${message.guild.id}`)
            console.log(kontrol1)
            if(kontrol1){
                db.set(`level_tebrik_${message.guild.id}`, false)
                message.reply(`Başarılı bir şekilde tebrik mesajı kapatıldı`)
            }
            if(!kontrol1){
                db.set(`level_tebrik_${message.guild.id}`, true)
                message.reply(`Başarılı bir şekilde tebrik mesajı açıldı`)
            }

        }
        if(args[0] === "log"){
            let kanal =  message.mentions.channels.first();
            if(!kanal) return message.reply(`Lütfen level log kanalını belirtiniz.`)
            db.set(`level_log_${message.guild.id}`, kanal.id)
            message.reply(`Başarılı bir şekilde level log kanalı ${kanal} olarak ayarlandı.`)
        }




},

name: "level-ayar",
description: "",
aliases: [""],
kategori: "",
usage: "",
}