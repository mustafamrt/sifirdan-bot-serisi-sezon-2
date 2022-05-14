const Discord = require("discord.js");
const db = require("nrc.db")
const ayarlar = require("../ayarlar.json")
const ms = require("ms")


module.exports = {
    calistir: async(client, message, args) => {

        const {MessageActionRow, MessageButton} = require("discord.js")

const menu1 = new Discord.MessageEmbed()
.setAuthor(`V13 Sıfırdan Bot Serisi Yardım Menüsü`)
.setColor("RANDOM")
.setDescription(`

Kayıt Komutlarını Görmek İçin  📝
Moderasyon Komutlarını Görmek için 🔐
Botun Komutlarını Görmek için 🤖
Ekonomi Komutlarını Görmek için 💰

`)

const butonlar = new MessageActionRow()
.addComponents(
    new MessageButton()
    .setCustomId('kayıt_yardım')
    .setEmoji('📝')
    .setStyle('DANGER'),
    new MessageButton()
    .setCustomId('moderasyon_yardım')
    .setEmoji('🔐')
    .setStyle('SUCCESS'),
    new MessageButton()
    .setCustomId('yardım')
    .setEmoji('🏡')
    .setStyle('PRIMARY'),
    new MessageButton()
    .setCustomId('bot_yardım')
    .setEmoji('🤖')
    .setStyle('DANGER'),
    new MessageButton()
    .setCustomId('ekonomi_yardım')
    .setEmoji('💰')
    .setStyle('SUCCESS'),
        
      

);


message.reply({embeds:[menu1] , components: [butonlar] }).then(async function(mesaj) {

    setTimeout(async () => {
mesaj.delete().catch(err =>  console.log("Mesaj bulunamadığı için silemedim"))
      }, ms('1m'));

    mesaj.createMessageComponentCollector(user => user.clicker.user.id == message.author.id).on('collect', async (button) => {

		await button.deferUpdate();

        if(button.customId === "yardım"){

            const menu2 = new Discord.MessageEmbed()
            .setAuthor(`V13 Sıfırdan Bot Serisi Yardım Menüsü`)
            .setColor("RANDOM")
            .setDescription(`
            
            Kayıt Komutlarını Görmek İçin  📝
            Moderasyon Komutlarını Görmek için 🔐
            Botun Komutlarını Görmek için 🤖
            Ekonomi Komutlarını Görmek için 💰
            
            `)
            mesaj.edit({embeds:[menu2]})

        }



        if(button.customId === "kayıt_yardım"){


    const kayıt = new Discord.MessageEmbed()
    .setAuthor(`V13 Sıfırdan Bot Serisi Kayıt Yardım Menüsü`)
    .setColor(`RANDOM`)
    .setDescription(`
    ${client.commands
       
        .filter(cmds => cmds.kategori == "kayıt")
      
        .map(nrc => ` **${ayarlar.prefix}${nrc.name}** = ${nrc.description || "**Açıklama Eklenmemiş**"}`)
      
        .join('\n')}
    `)
        mesaj.edit({embeds:[kayıt]})



        }

       if(button.customId === "moderasyon_yardım"){


    const mod = new Discord.MessageEmbed()
    .setAuthor(`V13 Sıfırdan Bot Serisi Moderasyon Yardım Menüsü`)
    .setColor(`RANDOM`)
    .setDescription(`
    ${client.commands
       
        .filter(cmds => cmds.kategori == "moderasyon")
      
        .map(nrc => ` **${ayarlar.prefix}${nrc.name}** = ${nrc.description || "**Açıklama Eklenmemiş**"}`)
      
        .join('\n')}
    `)
        mesaj.edit({embeds:[mod]})



        }

               if(button.customId === "bot_yardım"){


    const kayıt = new Discord.MessageEmbed()
    .setAuthor(`V13 Sıfırdan Bot Serisi Bot Yardım Menüsü`)
    .setColor(`RANDOM`)
    .setDescription(`
    ${client.commands
       
        .filter(cmds => cmds.kategori == "bot")
      
        .map(nrc => ` **${ayarlar.prefix}${nrc.name}** = ${nrc.description || "**Açıklama Eklenmemiş**"}`)
      
        .join('\n')}
    `)
        mesaj.edit({embeds:[kayıt]})



        }
       if(button.customId === "ekonomi_yardım"){


    const kayıt = new Discord.MessageEmbed()
    .setAuthor(`V13 Sıfırdan Bot Serisi Kayıt Yardım Menüsü`)
    .setColor(`RANDOM`)
    .setDescription(`
    ${client.commands
       
        .filter(cmds => cmds.kategori == "ekonomi")
      
        .map(nrc => ` **${ayarlar.prefix}${nrc.name}** = ${nrc.description || "**Açıklama Eklenmemiş**"}`)
      
        .join('\n')}
    `)
        mesaj.edit({embeds:[kayıt]})



        }


    })})

},

name: "yardım",
description: "",
aliases: [""],
kategori: "",
usage: "",
}