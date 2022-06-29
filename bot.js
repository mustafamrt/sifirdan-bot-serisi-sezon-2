const { Client, Intents, Collection, MessageActionRow, MessageSelectMenu, MessageAttachment, MessageEmbed, Permissions, Constants, ApplicationCommandPermissionsManager } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,Intents.FLAGS.GUILD_INTEGRATIONS,Intents.FLAGS.GUILD_WEBHOOKS,Intents.FLAGS.GUILD_INVITES,Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MESSAGE_TYPING,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const ayarlar = require("./ayarlar.json");
const Discord = require("discord.js")
const db = require("nrc.db");
const message = require("./events/message");
let prefix = ayarlar.prefix;
const ms = require("ms");
const moment = require("moment");






///////





client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
  require(`./komutcalistirici`)(client);
});

client.on("ready", () => {
  require("./events/eventLoader")(client);
});

///// `saas_${message.guild.id}`

client.on("messageCreate", async msg => {

  let saas = db.fetch(`saas_${msg.guild.id}`)

if(saas == true) {

var sa = ["sa","SA","Sa","Sea","sea","Selamın Aleyküm","selamın aleyküm", "SELAMIN ALEKYÜM","Selam","selam","SELAM"]

if(sa.includes(msg.content.toLowerCase())){
msg.reply(`Aleyküm Selam Hoşgeldin Dostum.`)



}



}


})





client.on("guildMemberAdd", async member => {

/*

    db.delete(`otorol_kanal_${message.guild.id}`)
    db.delete(`otorol_rol_${message.guild.id}`)
*/


let kanal = db.fetch(`otorol_kanal_${member.guild.id}`)
let rol   = db.fetch(`otorol_rol_${member.guild.id}`)

if(!kanal) return;
if(!rol) return;

member.roles.add(rol)

client.channels.cache.get(kanal).send(`${member} sunucuya katıldı ve başarılı bir şekilde <@&${rol}> isimli rol verildi.`)

})
client.on("guildMemberAdd", async member => {


let hgbb = db.fetch(`hg_bb_kanal_${member.guild.id}`)

if(!hgbb) return;

const hg = new Discord.MessageEmbed()
.setColor("RANDOM")
.setDescription(`${member}, Aramıza Hoşgeldin`)
client.channels.cache.get(hgbb).send({embeds: [hg]})
})

client.on("guildMemberRemove", async member => {


  let hgbb = db.fetch(`hg_bb_kanal_${member.guild.id}`)

  if(!hgbb) return;

  const bb = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setDescription(`${member}, Aramıza Ayrıldı`)
  client.channels.cache.get(hgbb).send({embeds: [bb]})
  })


  client.on("guildMemberAdd", async member => {


    let kontrol1 = db.fetch(`sayaç_log_${member.guild.id}`)
    let kontrol2 = db.fetch(`sayaç_hedef_${member.guild.id}`)

   if(!kontrol1) return;

   if(kontrol2){

   let kalan = kontrol2 - member.guild.memberCount

   if(kalan === 0) {
     client.channels.cache.get(kontrol1).send(`Yeni Biri Katıldı, ${member} Hoşgeldin. Seninle beraber **${member.guild.memberCount}** Kişiyiz Sayaç Hedefimize ulaştık.`)
     db.delete(`sayaç_hedef_${member.guild.id}`)
   }else{

    client.channels.cache.get(kontrol1).send(`Yeni Biri Katıldı, ${member} Hoşgeldin. Seninle beraber **${member.guild.memberCount}** Kişiyiz Sayaç Hedefimize **${kalan}** kişi kaldı.`)

   }

   }else{

    client.channels.cache.get(kontrol1).send(`Yeni Biri Katıldı, ${member} Hoşgeldin. Seninle beraber **${member.guild.memberCount}** Kişiyiz Sayaç Hedefimize şu anda bulunmamaktadır..`)
   }

  })

setTimeout(() => {
  let liste = db.fetch(`vadeli_hesaplar`)
liste.forEach(elem => {


let coin = db.fetch(`banka_coin_vadeli_${elem}`)
let miktar = Number(coin)
if(!miktar) return;
if(miktar === 0) return;

var son = (miktar*5)/100
db.add(`banka_coin_vadeli_${elem}`, son)
message.reply(`<@${elem}> isimli kişinin vadeli kazancı **${son}** miktar coindir. `)
});

}, ms("4h"));

client.on("messageCreate", async message => {

  if(message.author.bot == true) return;

  let kontrol = db.fetch(`level_log_${message.guild.id}`)
  if(!kontrol) return;

  let xpmesaj = Number(db.fetch(`xp_mesaj_${message.guild.id}`))
  let kontrol2 = Number(db.fetch(`xp_${message.guild.id}_${message.author.id}`))
  if(!kontrol2) db.set(`xp_${message.guild.id}_${message.author.id}`, 0)
  db.add(`xp_${message.guild.id}_${message.author.id}`, xpmesaj)

  let kontrol3 = Number(db.fetch(`xp_${message.guild.id}_${message.author.id}`))
  let xplevel = Number(db.fetch(`xp_level_${message.guild.id}`))
  if(kontrol3 >= xplevel){

    let kontrol4 = db.fetch(`lvl_${message.guild.id}_${message.author.id}`)
    if(!kontrol4) db.set(`lvl_${message.guild.id}_${message.author.id}`, 0)
    db.add(`lvl_${message.guild.id}_${message.author.id}`, 1)
    let kontrol5 = db.fetch(`level_tebrik_${message.guild.id}`)

    db.set(`xp_${message.guild.id}_${message.author.id}`, 0)
    if(kontrol5 == true){
      message.reply(`Tebrikler başarılı bir şekilde yeni level atladınız. Yeni leveliniz **${db.fetch(`lvl_${message.guild.id}_${message.author.id}`)}**`)
    }
  }



})


/*
client.on("channelCreate", async channel => {
  let kanal = db.fetch(`modlog_${channel.guild.id}`)
})

*/

//////////////  Modlog Başlangıc
client.on("channelCreate", async channel => {
  let kanal = db.fetch(`modlog_${channel.guild.id}`)
  if(!kanal) return;
  let user = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_CREATE' }).then(audit => audit.entries.first())

  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Kanal Oluşturuldu")
  .setDescription(`

  Kanal İd : **${channel.id}**
  Kanal İsmi : **${channel.name}**
  Oluşturan Kişi: ${user.executor} **(${user.executor.id})**
  `)
  client.channels.cache.get(kanal).send({embeds:[embed]})

})

client.on("channelDelete", async channel => {
  let kanal = db.fetch(`modlog_${channel.guild.id}`)
  if(!kanal) return;
  let user = await channel.guild.fetchAuditLogs({ type: 'CHANNEL_DELETE' }).then(audit => audit.entries.first())

  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Kanal Silindi")
  .setDescription(`

  Kanal İd : **${channel.id}**
  Kanal İsmi : **${channel.name}**
  Silen Kişi: ${user.executor} **(${user.executor.id})**
  `)
  client.channels.cache.get(kanal).send({embeds:[embed]})

})

client.on("channelUpdate", async (oldChannel, newChannel) => {
  let kanal = db.fetch(`modlog_${oldChannel.guild.id}`)
  if(!kanal) return;
  let user = await oldChannel.guild.fetchAuditLogs({ type: 'CHANNEL_UPDATE' }).then(audit => audit.entries.first())

  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Kanal Güncellendi")
  .setDescription(`

  Kanal İd : **${oldChannel.id}**
  Eski Kanal İsmi : **${oldChannel.name}**
  Yeni Kanal İsmi : **${newChannel.name}**
  Güncelleyen Kişi: ${user.executor} **(${user.executor.id})**
  `)
  client.channels.cache.get(kanal).send({embeds:[embed]})

})

client.on("emojiDelete", async emoji => {
  let kanal = db.fetch(`modlog_${emoji.guild.id}`)
  if(!kanal) return;
  let user = await emoji.guild.fetchAuditLogs({ type: 'EMOJİ_DELETE' }).then(audit => audit.entries.first())

  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Emoji Silindi")
  .setDescription(`

  Emoji İd : **${emoji.id}**
  Emoji İsmi : **${emoji.name}**
  Silen Kişi: ${user.executor} **(${user.executor.id})**
  `)
  client.channels.cache.get(kanal).send({embeds:[embed]})

})

client.on("emojiCreate", async emoji => {
  let kanal = db.fetch(`modlog_${emoji.guild.id}`)
  if(!kanal) return;
  let user = await emoji.guild.fetchAuditLogs({ type: 'EMOJİ_CREATE' }).then(audit => audit.entries.first())

  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Emoji Oluşturuldu")
  .setDescription(`

  Emoji İd : **${emoji.id}**
  Emoji İsmi : **${emoji.name}**
  Oluşturan Kişi: ${user.executor} **(${user.executor.id})**
  `)
  client.channels.cache.get(kanal).send({embeds:[embed]})

})





client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  let kanal = db.fetch(`modlog_${oldEmoji.guild.id}`)
  if(!kanal) return;
  let user = await oldEmoji.guild.fetchAuditLogs({ type: 'EMOJİ_UPDATE' }).then(audit => audit.entries.first())

  const embed = new Discord.MessageEmbed()
  .setColor("RANDOM")
  .setTitle("Emoji Güncellendi")
  .setDescription(`

  Emoji İd : **${oldEmoji.id}**
  Eski Emoji İsmi : **${oldEmoji.name}**
  Yeni Emoji İsmi : **${newEmoji.name}**
  Güncelleyen Kişi: ${user.executor} **(${user.executor.id})**
  `)
  client.channels.cache.get(kanal).send({embeds:[embed]})

})

////////////// Modlog Bitiş





// Slash Başlangıç

 client.on("ready", async() =>{
   
   
// client.guilds.cache.get("761858064315187250").commands.set([]) // slash temizleme
// client.application.commands.set([]);


 })

 client.on("ready", async() =>{
   
  // let commands = client.guilds.cache.get("761858064315187250").commands;
  let commands = client.application.commands;


  commands.create({
    name : "ping",
    description: "Botun pingine bakarsın."
  })
  commands.create({
    name : "ban",
    description: "İstediğiniz kişiye ban atarsınız",
    options:[{
      name: "kullanıcı",
      description: "Banlanacak kişiyi yazınız",
      type: "USER",
    },
    {
      name: "sebep",
      description: "Banlama sebebinizi yazınız",
      type: "STRING",
    }]
  })

  commands.create({
    name : "kick",
    description: "İstediğiniz kişiye kick atarsınız",
    options:[{
      name: "kullanıcı",
      description: "Kicklenecek kişiyi yazınız",
      type: "USER",
    },
    {
      name: "sebep",
      description: "Kick sebebinizi yazınız",
      type: "STRING",
    }]
  })


  commands.create({
    name : "rol",
    description: "Rol ver-al komududur",
    options:[{
      name: "ver",
      description: "Rol Verirsin",
      type: "SUB_COMMAND",
      options:[{
        name: "kullanıcı",
        description: "Rol verilecek kullanıcıyı belirtiniz.",
        type: "USER",
      },
      {        
        name: "rol",
        description: "Verilecek olan rolü belirtiniz",
        type: "ROLE",
        }
        
    ]
    },
    {        
      name: "al",
      description: "Rol Alırsın",
      type: "SUB_COMMAND",
      options:[{
        name: "kullanıcı",
        description: "Rol alınacak kullanıcıyı belirtiniz.",
        type: "USER",
      },
      {        
        name: "rol",
        description: "Alınacak rolü belirtiniz",
        type: "ROLE",
        }
        
    ]
      }
      
  ]
  })
    ////// otorol slash ayar

    commands.create({
      name : "otorol",
      description: "Otorol ayarlarsınız",
      type: "SUB_COMMAND_GROUP",
      options:[{
        name: "log",
        description: "Otorol log ayarlarsınız.",
        type: "CHANNEL",
      },
      {
        name: "rol",
        description: "Verilecek olan rolü seçiniz.",
        type: "ROLE",
      }
      ]
    })
  ////// hg-bb slash ayar

  commands.create({
    name : "hg-bb",
    description: "hg-bb ayarlarsınız",
    type: "SUB_COMMAND",
    options:[{
      name: "log",
      description: "hg-bb kanalını belirtiniz",
      type: "CHANNEL",
    }
    ]
  })
    
  ////// mod-log slash ayar

  commands.create({
    name : "mod-log",
    description: "Mod-log ayarlarsınız",
    type: "SUB_COMMAND",
    options:[{
      name: "log",
      description: "Mod-log kanalını belirtiniz",
      type: "CHANNEL",
    }
    ]
  })
  ////// sayaç slash ayar

  commands.create({
    name : "sayaç",
    description: "Sayaç ayarlarsınız",
    type: "SUB_COMMAND_GROUP",
    options:[{
      name: "log",
      description: "Sayaç log ayarlarsınız",
      type: "CHANNEL",
    },
    {
      name: "hedef",
      description: "Sayaç hedefinizi belirlersiniz.",
      type: "NUMBER",
    }
    ]
  })

/////// sa-as slah ayar


commands.create({
  name : "sa-as",
  description: "sa-as kapat/açarsın",
  type: "",
})
// nuke slash ayar
commands.create({
  name : "nuke",
  description: "Kanalı Sıfırlarsın",
  type: "INTAGER",
})


// hg-bb kapat slash ayar
commands.create({
  name : "kapat-hg-bb",
  description: "hg-bb sistemini Sıfırlarsın",
  type: "INTAGER",
})

// mod-log kapat slash ayar
commands.create({
  name : "kapat-mod-log",
  description: "Mod-log sistemini Sıfırlarsın",
  type: "INTAGER",
})

// otorol kapat slash ayar
commands.create({
  name : "kapat-otorol",
  description: "Otorol sistemini Sıfırlarsın",
  type: "INTAGER",
})

// sayaç kapat slash ayar
commands.create({
  name : "kapat-sayaç",
  description: "Sayaç sistemini Sıfırlarsın",
  type: "INTAGER",
})


//// kayıt komutları

commands.create({
  name : "kayıt-ayar",
  description: "Kayıt ayarlarsınız",
  type: "SUB_COMMAND",
  options:[{
    name: "kayıt-yetkilisi",
    description: "Kayıt yetkilisi rolünü ayarlarsınız",
    type: "ROLE",
    required : true,

  },
  {
    name: "erkek-rol",
    description: "Erkek Rol Ayarlarsınız",
    type: "ROLE",
    required : true,

  },
  {
    name: "kız-rol",
    description: "Kız Rol Ayarlarsınız.",
    type: "ROLE",
    required : true,

  },
  {
    name: "kayıtsız-rol",
    description: "Kayıtsız Rol Ayarlarsınız.",
    type: "ROLE",
    required : true,

  },
  {
    name: "kayıt-log",
    description: "Kayıt Log Ayarlarsınız.",
    type: "CHANNEL",
    required : true,

  },
  {
    name: "kayıt-kanal",
    description: "Kayıt kanal ayarlarsınız",
    type: "CHANNEL",
    required : true,
  }
  ]
})


/// kayıt erkek
commands.create({
  name : "kayıt-erkek",
  description: "Erkek Kayıt Yaparsınız",
  type: "SUB_COMMAND",
  options:[{
    name: "user",
    description: "Kayıt edilecek kişiyi belirtiniz",
    type: "USER",
    required : true,

  },
  {
    name: "yas",
    description: "Yaşını belirtiniz",
    type: "NUMBER",
    required : true,

  },
  {
    name: "isim",
    description: "İsmini Belirtiniz",
    type: "STRING",
    required : true,

  },
  ]
})
/// kayıt kız
commands.create({
  name : "kayıt-kız",
  description: "Kız Kayıt Yaparsınız",
  type: "SUB_COMMAND",
  options:[{
    name: "user",
    description: "Kayıt edilecek kişiyi belirtiniz",
    type: "USER",
    required : true,

  },
  {
    name: "yas",
    description: "Yaşını belirtiniz",
    type: "NUMBER",
    required : true,

  },
  {
    name: "isim",
    description: "İsmini Belirtiniz",
    type: "STRING",
    required : true,

  },
  ]
})




/// kayıt yetkili stats
commands.create({
  name : "kayit-stats",
  description: "Kayıt Yetkilisinin bilgilerine bakarsınız",
  type: "SUB_COMMAND_GROUP",
  options:[{
    name: "yetkili_sec",
    description: "Yetkili seçerek onun bilgilerine bakabilirsiniz",
    type: "USER",
  }
  ]
})

// kayıt isim değiştir

commands.create({
  name : "isim_degistir",
  description: "Kullanıcının kayıt bilgilerini değiştirirsiniz",
  type: "SUB_COMMAND",
  options:[{
    name: "user",
    description: "Kayıt edilecek kişiyi belirtiniz",
    type: "USER",
    required : true,

  },
  {
    name: "yas",
    description: "Yaşını belirtiniz",
    type: "NUMBER",
    required : true,

  },
  {
    name: "isim",
    description: "İsmini Belirtiniz",
    type: "STRING",
    required : true,

  },
  ]
})
/// kayıtsıza düşür
commands.create({
  name : "kayitsiz",
  description: "Kullanıcıyı kayıtsıza düşürürsünüz",
  type: "SUB_COMMAND_GROUP",
  options:[{
    name: "user",
    description: "Kayıtsıza düşürlecek kullanıcıyı seçiniz",
    type: "USER",
    required: true,
  }
  ]
})



// level komutları

commands.create({
  name : "level-bak",
  description: "kaç level olduğuna bakarsın",
})
commands.create({
  name : "level-mesaj",
  description: "level mesaj aç kapa yaparsın",
})

commands.create({
  name : "level-ayar",
  description: "level sistemini ayarlarsınız",
  type: "SUB_COMMAND_GROUP",
  options:[{
    name: "xp-mesaj",
    description: " mesaj başı xp oranını ayarlarsınız. [Otomatik ayar 1]",
    type: "NUMBER",
  },
  {
    name: "xp-level",
    description: "Kaç xp de lvl atlar. [Otomatik ayar 250]",
    type: "NUMBER",
  },
  {
    name: "log",
    description: "Level atlandığında mesaj atılacak kanal.",
    type: "CHANNEL",
  }
  ]
})



commands.create({
  name : "banka",
  description: "Banka ayarlarına bakarsın",
  type: "SUB_COMMAND",
  options:[{
    name: "kur",
    description: "Banka hesabı kurarsın",
    type: "BOOLEAN",
  },
  {
    name: "sil",
    description: "banka hesabını silersin",
    type: "BOOLEAN",
  },
  {
    name: "yatir",
    description: "Banka hesabına para yatırırsınız",
    type: "NUMBER",
  },
  {
    name: "cek",
    description: "Banka hesabından para çekersiniz",
    type: "NUMBER",
  }
  ]
})


commands.create({
  
  name: "vade",
  description: "Banka hesabına para yatırırsınız",
  type: "SUB_COMMAND",
  options:[{
    name : "ac",
    description: "Vadeli hesap açarsınız",
    type: "BOOLEAN",

  },
  {
    name : "kapat",
    description: "Vadeli hesap kapatırsınız",
    type: "BOOLEAN",

  },
  {
    name : "yatir",
    description: "Vadeli hesapa coin yatırırsınız",
    type : "NUMBER",
  },
  {
    name : "cek",
    description: "Vadeli hesapatan coin çekersiniz",
    type : "NUMBER",
  }
  
]
})



commands.create({
  
  name: "calis",
  description: "Çalışarak coin kasabilirsiniz",
  type: "SUB_COMMAND",
  options:[{
    name : "orman",
    description: "Ormanda çalışarak odun kasabilirsiniz",
    type: "BOOLEAN",

  },
  {
    name : "maden",
    description: "Madence çalışarak kömür demir elmas vb bulabilirsiniz",
    type: "BOOLEAN",

  }
]
})





commands.create({
  
  name: "envanter",
  description: "Envanterine bakarsın",
})

commands.create({
  
  name: "gunluk",
  description: "Günlük Coin alırsın",
})

commands.create({
  
  name: "coin-gönder",
  description: "Coin Gönder",
  type: "SUB_COMMAND",
  options:[{
    name : "user",
    description: "Coin gönderilecek kişiyi belirtiniz",
    type: "USER",

  },
  {
    name : "coin",
    description: "Gönderilecek coin miktarını giriniz",
    type: "NUMBER",

  }
]
})

commands.create({
  
  name: "hesap",
  description: "Ekonomi hesap aç/kapat yaparsın",
  type: "SUB_COMMAND",
  options:[{
    name : "ac",
    description: "Ekonomi hesabını açarsınız",
    type: "STRING",

  },
  {
    name : "kapat",
    description: "Ekonomi hesabını kapatırsınız",
    type: "BOOLEAN",

  }
]
})



commands.create({
  
  name: "market",
  description: "Marketten ürün satın alırsın",
  type: "SUB_COMMAND_GROUP",
  options:[
    
  {
    name : "al",
    description: "Marketten ürün satın alırsınız",
    type: "SUB_COMMAND",
    options:[
        {
          name : "balta",
          description: "Alınacak balta miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "kazma",
          description: "Alınacak kazma miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "odun",
          description: "Alınacak odun miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "elmas",
          description: "Alınacak elmas miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "altın",
          description: "Alınacak altın miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "demir",
          description: "Alınacak demir miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "kömür",
          description: "Alınacak kömür miktarını belirtiniz",
          type: "NUMBER",
        }
    ]
  } , 
  {
    name : "sat",
    description: "Marketten ürün satın alırsınız",
    type: "SUB_COMMAND",
    options:[
        {
          name : "odun",
          description: "Satılacak odun miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "elmas",
          description: "Satılacak elmas miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "altın",
          description: "Satılacak altın miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "demir",
          description: "Satılacak demir miktarını belirtiniz",
          type: "NUMBER",
        },
        {
          name : "kömür",
          description: "Satılacak kömür miktarını belirtiniz",
          type: "NUMBER",
        },
      
      ]
      }
    
    
]
})



commands.create({
  
  name: "yardım",
  description: "Botun komutlarını gösterir",

})


commands.create({
  
  name: "form-deneme",
  description: "Forum sistemi örnek",
})
})


const { Modal, TextInputComponent, showModal } = require('discord-modals') 
const discordModals = require('discord-modals') 
discordModals(client); 

client.on('interactionCreate', async interaction => {
	if (!interaction.isSelectMenu()) return;

  
  if(interaction.customId == "yardim"){
    if(interaction.values[0] == "komut_ekonomi"){

      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Ekonomi Komutları")
      .setDescription(`
      **/banka** - Banka komutlarını gösterir
      **/vade** - Vadeli hesap komutlarını gösterir
      **/calis** - Çalışarak coin kasabilirsiniz
      **/envanter** - Envanterine bakarsın
      **/gunluk** - Günlük Coin alırsın
      **/coin-gönder** - Coin Gönder
      **/hesap** - Ekonomi hesap aç/kapat yaparsın
      **/market** - Marketten ürün satın alırsın
      `)
  
      await interaction.deferUpdate();
      await interaction.editReply({ embeds: [embed] });
    }

    if(interaction.values[0] == "komut_kayit"){

      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Ekonomi Komutları")
      .setDescription(`
      **/kayıt-ayar** - Kayıt ayarlarını gösterir
      **/kayıt-erkek** - Erkek olarak kayıt olursunuz
      **/kayıt-kız** - Kız olarak kayıt olursunuz
      **/kayıt-stats** - Statsunu gösterir
      **/isim-değiştir** - İsminizi değiştirir
      **/kayitsiz** - Kullanıcıyı kayıtsıza düşürür
      `)
  
      await interaction.deferUpdate();
      await interaction.editReply({ embeds: [embed] });
    }

    if(interaction.values[0] == "komut_level"){

      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Level Komutları")
      .setDescription(`
      **/level-mesaj** - Level mesaj aç/kapa ayarını yapar
      **/level-ayar** - Level Ayarlarını gösterir
      **/level-bak** - Level bilgisini gösterir
      `)
  
      await interaction.deferUpdate();
      await interaction.editReply({ embeds: [embed] });
    }

    if(interaction.values[0] == "komut_moderasyon"){

      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Moderasyon Komutları")
      .setDescription(`
      **/ban** - Kullanıcıyı sunucudan banlar
      **/kick** - Kullanıcıyı sunucudan atar
      **/mute** - Kullanıcıyı susturur
      **/rol ** - Kullanıcıya rol verir/alırsınız
      **/otorol ** - Sunucuya otomatik rol verir
      **/hg-bb** - Hoşgeldin BayBay sistemini ayarlarsın
      **/kapat-hg-bb** - Hoşgeldin BayBay sistemi kapatır
      **/mod-log** - Mod-log sistemi açarsın
      **/kapat-mod-log** - Mod-log sistemi kapatır
      **/sayac** - Sayac sistemi açarsın
      **/kapat-sayac** - Sayac sistemi kapatır
      **/sa-as** - Sistemini aç/kapa yapar
      `)
  
      await interaction.deferUpdate();
      await interaction.editReply({ embeds: [embed] });
    }
  }
  
});


client.on('modalSubmit',async (modal) => {

	if(modal.customId === 'nrc-form'){

		const deneme = modal.getTextInputValue('deneme')
    modal.reply(deneme)
  }
})



client.on("interactionCreate", async(interaction) => {
  const { commandName, options } = interaction;

  if(commandName == "form-deneme"){

    const nrcmodal = new Modal() 
    .setCustomId('nrc-form')
    .setTitle('Sıfırdan Bot Serisi S2 B25')
    .addComponents(
      new TextInputComponent() 
      .setCustomId('deneme')
      .setLabel('birşeyler yazınız')
      .setStyle('SHORT') 
      // .setMinLength(1) // minimum girilecek karakter sayısı
      // .setMaxLength(18) // maksimum girilecek karakter sayısı
      .setPlaceholder('merhaba')
      .setRequired(true)
    )
    showModal(nrcmodal, {
        client: client, 
        interaction: interaction 
      })
  }


  if(commandName == "yardım"){
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('yardim')
					.setPlaceholder('Bakmak istediğiniz yardım komutunu seçiniz')
					.addOptions([
						{
							label: 'Ekonomi Komutları',
							description: 'Ekonomi komutlarını görebilirsiniz',
							value: 'komut_ekonomi',
						},
						{
							label: 'Kayıt Komutları',
							description: 'Kayıt komutlarını görebilirsiniz',
							value: 'komut_kayit',
						},
            {
							label: 'Level Komutları',
							description: 'Level komutlarını görebilirsiniz',
							value: 'komut_level',
						},
            {
							label: 'Moderasyon Komutları',
							description: 'Moderasyon komutlarını görebilirsiniz',
							value: 'komut_moderasyon',
						},
					]),
			);


      const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Yardım Komutları")
      .setDescription("Yardım komutlarını görebilirsiniz")	

		await interaction.reply({ embeds: [embed], components: [row] });
  }



  if(commandName == "hesap"){

    if(options.getString("ac")){

      let isim = options.getString("ac")

      if(!isim) return interaction.reply(`Lütfen Hesap adı belirtiniz`)
      
      if(db.fetch(`hesap_${interaction.user.id}`)) return interaction.reply(`Zaten hesabınız var`)
      db.set(`hesap_${interaction.user.id}`, isim)
      db.set(`coin_${interaction.user.id}`, 0)
      interaction.reply(`Hesabınız başarılı bir şekilde kurulmuştur.`)
    }else if(options.getBoolean("kapat")){


      let kontrol = db.fetch(`hesap_${interaction.user.id}`)

      if(!kontrol) return interaction.reply(`Zaten Hesabınız Yok`)
      db.delete(`hesap_${interaction.user.id}`)
      let kontrol2 = db.fetch(`coin_${interaction.user.id}`)
      
      if(kontrol2) db.delete(`coin_${interaction.user.id}`)
      
      interaction.reply(`Hesabınız başarılı bir şekilde sıfırlanmıştır.`)
    }
  }


  if(commandName == "gunluk"){


    let kontrol = Number(db.fetch(`günlük_${interaction.user.id}`))
    if(kontrol > moment.utc().format("X")){
      interaction.reply(`> Bir Sonraki Günlük Ödül için Süreniz: <t:${kontrol}:R> (<t:${kontrol}:F>)`)
    }else {
        
    let kontrol2 = Number(db.fetch(`coin_${interaction.user.id}`))
    if(!kontrol2) db.set(`coin_${interaction.user.id}`, 0)
    
    db.add(`coin_${interaction.user.id}`, 500)
    db.set(`günlük_${interaction.user.id}`, moment.utc().add(1, 'day').format("X"))
    interaction.reply(`Başarılı bir şekilde günlük ödülünüz aldınız.`)
    }
    
  }

  if(commandName == "envanter"){
    let kazma = db.fetch(`kazma_${interaction.user.id}`)
    let balta = db.fetch(`balta_${interaction.user.id}`)
    let elmas = db.fetch(`elmas_${interaction.user.id}`)
    let altın = db.fetch(`altın_${interaction.user.id}`)
    let demir = db.fetch(`demir_${interaction.user.id}`)
    let kömür = db.fetch(`kömür_${interaction.user.id}`)
    let odun = db.fetch(`odun_${interaction.user.id}`)
    const embed = new Discord.MessageEmbed()
    .addField(`Kazma`, `**${kazma? kazma: 0}**`, true)
    .addField(`Balta`, `**${balta ? balta: 0}**`, true)
    .addField(`Elmas`, `**${elmas ? elmas: 0}**`, true)
    .addField(`Altın`, `**${altın ? altın: 0}**`, true)
    .addField(`Demir`, `**${demir ? demir: 0}**`, true)
    .addField(`Kömür`, `**${kömür ? kömür: 0}**`, true)
    .addField(`Odun`, `**${odun ? odun: 0}**`, true)

    interaction.reply({embeds:[embed]})
  }




// Ekonomi Market komutları
if(commandName == "market"){
  if(options.getSubcommand() == "sat"){
    
  if(options.getNumber("elmas")){

      let urun = "elmas"
      let urun2= "Elmas"
      let fıyat = 40
      let odun = db.fetch(`${urun}_${interaction.user.id}`)
      if(!odun) return interaction.reply(`${urun2} Hiç Yok.`)
      let miktar = options.getNumber("elmas")
      if(!miktar) return interaction.reply(`Satılacak Miktarı Belirtiniz.`)
      if(isNaN(miktar))return interaction.reply(`Miktar Sayı İle Olmalıdır.`) 
      if(miktar > odun) interaction.reply(`Bu Kadar ${urun2} sahip değilsiniz.`)
      let kontrol = db.fetch(`coin_${interaction.user.id}`)
      if(!kontrol) db.set(`coin_${interaction.user.id}`, 0)
      var son = miktar*fıyat
      db.add(`${urun}_${interaction.user.id}`, -miktar)
      db.add(`coin_${interaction.user.id}`, son)
      interaction.reply(`Başarılı bir şekilde **${miktar}** adet ${urun2} satıldı.`)
    }else if(options.getNumber("demir")){

      let urun = "demir"
      let urun2= "Demir"
      let fıyat = 20
      let odun = db.fetch(`${urun}_${interaction.user.id}`)
      if(!odun) return interaction.reply(`${urun2} Hiç Yok.`)
      let miktar = options.getNumber("demir")
      if(!miktar) return interaction.reply(`Satılacak Miktarı Belirtiniz.`)
      if(isNaN(miktar))return interaction.reply(`Miktar Sayı İle Olmalıdır.`) 
      if(miktar > odun) interaction.reply(`Bu Kadar ${urun2} sahip değilsiniz.`)
      let kontrol = db.fetch(`coin_${interaction.user.id}`)
      if(!kontrol) db.set(`coin_${interaction.user.id}`, 0)
      var son = miktar*fıyat
      db.add(`${urun}_${interaction.user.id}`, -miktar)
      db.add(`coin_${interaction.user.id}`, son)
      interaction.reply(`Başarılı bir şekilde **${miktar}** adet ${urun2} satıldı.`)
    }else if(options.getNumber("altın")){

      let urun = "altın"
      let urun2= "Altın"
      let fıyat = 30
      let odun = db.fetch(`${urun}_${interaction.user.id}`)
      if(!odun) return interaction.reply(`${urun2} Hiç Yok.`)
      let miktar = options.getNumber("altın")
      if(!miktar) return interaction.reply(`Satılacak Miktarı Belirtiniz.`)
      if(isNaN(miktar))return interaction.reply(`Miktar Sayı İle Olmalıdır.`) 
      if(miktar > odun) interaction.reply(`Bu Kadar ${urun2} sahip değilsiniz.`)
      let kontrol = db.fetch(`coin_${interaction.user.id}`)
      if(!kontrol) db.set(`coin_${interaction.user.id}`, 0)
      var son = miktar*fıyat
      db.add(`${urun}_${interaction.user.id}`, -miktar)
      db.add(`coin_${interaction.user.id}`, son)
      interaction.reply(`Başarılı bir şekilde **${miktar}** adet ${urun2} satıldı.`)
    }else if(options.getNumber("komur")){

      let urun = "kömür"
      let urun2= "Kömür"
      let fıyat = 5
      let odun = db.fetch(`${urun}_${interaction.user.id}`)
      if(!odun) return interaction.reply(`${urun2} Hiç Yok.`)
      let miktar = options.getNumber("kömür")
      if(!miktar) return interaction.reply(`Satılacak Miktarı Belirtiniz.`)
      if(isNaN(miktar))return interaction.reply(`Miktar Sayı İle Olmalıdır.`) 
      if(miktar > odun) interaction.reply(`Bu Kadar ${urun2} sahip değilsiniz.`)
      let kontrol = db.fetch(`coin_${interaction.user.id}`)
      if(!kontrol) db.set(`coin_${interaction.user.id}`, 0)
      var son = miktar*fıyat
      db.add(`${urun}_${interaction.user.id}`, -miktar)
      db.add(`coin_${interaction.user.id}`, son)
      interaction.reply(`Başarılı bir şekilde **${miktar}** adet ${urun2} satıldı.`)
    }else if(options.getNumber("odun")){

      let urun = "odun"
      let urun2= "Odun"
      let fıyat = 20
      let odun = db.fetch(`${urun}_${interaction.user.id}`)
      if(!odun ) return interaction.reply(`${urun2} Hiç Yok.`)
      let miktar = options.getNumber("odun")
      if(!miktar) return interaction.reply(`Satılacak Miktarı Belirtiniz.`)
      if(isNaN(miktar))return interaction.reply(`Miktar Sayı İle Olmalıdır.`) 
      if(miktar > odun) interaction.reply(`Bu Kadar ${urun2} sahip değilsiniz.`)
      let kontrol = db.fetch(`coin_${interaction.user.id}`)
      if(!kontrol) db.set(`coin_${interaction.user.id}`, 0)
      var son = miktar*fıyat
      db.add(`${urun}_${interaction.user.id}`, -miktar)
      db.add(`coin_${interaction.user.id}`, son)
      interaction.reply(`Başarılı bir şekilde **${miktar}** adet ${urun2} satıldı.`)
    }
  }
  if(options.getSubcommand() == "al"){

    if(options.getNumber("balta")){
      let urun = "balta"
      let urun2 = "Balta"
      let coin = db.fetch(`coin_${interaction.user.id}`)
      let miktar = options.getNumber("balta")
      if(!miktar) return interaction.reply(`Alınacak Miktarı Belirtiniz`)
      if(isNaN(miktar)) return interaction.reply(`Belirtlilen Miktar Sayı İle Olmalıdır.`)
      var son = miktar*100
      if(coin < son) return interaction.reply(`${son-coin} Miktar Coine İhtiyacınız Var.`)
      let kontrol = db.fetch(`${urun}_${interaction.user.id}`)
      if(!kontrol) db.set(`${urun}_${interaction.user.id}`, 0)
      db.add(`${urun}_${interaction.user.id}`, Number(miktar))
      db.add(`coin_${interaction.user.id}`, -son)
      interaction.reply(`Başarılı Bir Şekilde **${son}** coine ${urun2} Aldınız.`)
    }else if(options.getNumber("kazma")){
      let urun = "kazma"
      let urun2 = "Kazma"
      let coin = db.fetch(`coin_${interaction.user.id}`)
      let miktar = options.getNumber("kazma")
      if(!miktar) return interaction.reply(`Alınacak Miktarı Belirtiniz`)
      if(isNaN(miktar)) return interaction.reply(`Belirtlilen Miktar Sayı İle Olmalıdır.`)
      var son = miktar*150
      if(coin < son) return interaction.reply(`${son-coin} Miktar Coine İhtiyacınız Var.`)
      let kontrol = db.fetch(`${urun}_${interaction.user.id}`)
      if(!kontrol) db.set(`${urun}_${interaction.user.id}`, 0)
      db.add(`${urun}_${interaction.user.id}`, 1)
      db.add(`coin_${interaction.user.id}`, -son)
      interaction.reply(`Başarılı Bir Şekilde **${son}** ${urun2} Aldınız.`)
    }else if(options.getNumber("elmas")){
    let urun = "elmas"
    let urun2 = "Elmas"
    let coin = db.fetch(`coin_${interaction.user.id}`)
    let miktar = options.getNumber("elmas")
    if(!miktar) return interaction.reply(`Alınacak Miktarı Belirtiniz`)
    if(isNaN(miktar)) return interaction.reply(`Belirtlilen Miktar Sayı İle Olmalıdır.`)
    var son = miktar*60
    if(coin < son) return interaction.reply(`${son-coin} Miktar Coine İhtiyacınız Var.`)
    let kontrol = db.fetch(`${urun}_${interaction.user.id}`)
    if(!kontrol) db.set(`${urun}_${interaction.user.id}`, 0)
    db.add(`${urun}_${interaction.user.id}`, 1)
    db.add(`coin_${interaction.user.id}`, -son)
    interaction.reply(`Başarılı Bir Şekilde **${son}** ${urun2} Aldınız.`)
    }else if(options.getNumber("demir")){
    let urun = "demir"
    let urun2 = "Demir"
    let coin = db.fetch(`coin_${interaction.user.id}`)
    let miktar = options.getNumber("demir")
    if(!miktar) return interaction.reply(`Alınacak Miktarı Belirtiniz`)
    if(isNaN(miktar)) return interaction.reply(`Belirtlilen Miktar Sayı İle Olmalıdır.`)
    var son = miktar*40
    if(coin < son) return interaction.reply(`${son-coin} Miktar Coine İhtiyacınız Var.`)
    let kontrol = db.fetch(`${urun}_${interaction.user.id}`)
    if(!kontrol) db.set(`${urun}_${interaction.user.id}`, 0)
    db.add(`${urun}_${interaction.user.id}`, 1)
    db.add(`coin_${interaction.user.id}`, -son)
    interaction.reply(`Başarılı Bir Şekilde **${son}** ${urun2} Aldınız.`)
    }else if(options.getNumber("altın")){
      let urun = "altın"
    let urun2 = "Altın"
    let coin = db.fetch(`coin_${interaction.user.id}`)
    let miktar = options.getNumber("altın")
    if(!miktar) return interaction.reply(`Alınacak Miktarı Belirtiniz`)
    if(isNaN(miktar)) return interaction.reply(`Belirtlilen Miktar Sayı İle Olmalıdır.`)
    var son = miktar*50
    if(coin < son) return interaction.reply(`${son-coin} Miktar Coine İhtiyacınız Var.`)
    let kontrol = db.fetch(`${urun}_${interaction.user.id}`)
    if(!kontrol) db.set(`${urun}_${interaction.user.id}`, 0)
    db.add(`${urun}_${interaction.user.id}`, 1)
    db.add(`coin_${interaction.user.id}`, -son)
    interaction.reply(`Başarılı Bir Şekilde **${son}** ${urun2} Aldınız.`)
    }else if(options.getNumber("komur")){
      
    let urun = "kömür"
    let urun2 = "Kömür"
    let coin = db.fetch(`coin_${interaction.user.id}`)
    let miktar = options.getNumber("komur")
    if(!miktar) return interaction.reply(`Alınacak Miktarı Belirtiniz`)
    if(isNaN(miktar)) return interaction.reply(`Belirtlilen Miktar Sayı İle Olmalıdır.`)
    var son = miktar*15
    if(coin < son) return interaction.reply(`${son-coin} Miktar Coine İhtiyacınız Var.`)
    let kontrol = db.fetch(`${urun}_${interaction.user.id}`)
    if(!kontrol) db.set(`${urun}_${interaction.user.id}`, 0)
    db.add(`${urun}_${interaction.user.id}`, 1)
    db.add(`coin_${interaction.user.id}`, -son)
    }else if(options.getNumber("odun")){
      let urun = "odun"
      let urun2 = "Odun"
      let coin = db.fetch(`coin_${interaction.user.id}`)
      let miktar = options.getNumber("odun")
      if(!miktar) return interaction.reply(`Alınacak Miktarı Belirtiniz`)
      if(isNaN(miktar)) return interaction.reply(`Belirtlilen Miktar Sayı İle Olmalıdır.`)
      var son = miktar*30
      if(coin < son) return interaction.reply(`${son-coin} Miktar Coine İhtiyacınız Var.`)
      let kontrol = db.fetch(`${urun}_${interaction.user.id}`)
      if(!kontrol) db.set(`${urun}_${interaction.user.id}`, 0)
      db.add(`${urun}_${interaction.user.id}`, 1)
      db.add(`coin_${interaction.user.id}`, -son)
      interaction.reply(`Başarılı Bir Şekilde **${son}** ${urun2} Aldınız.`)
    }

  }
}



// Çalış komutları
if(commandName == "calis"){
  if(options.getBoolean("orman")){
    let kontrol = db.fetch(`balta_${interaction.user.id}`)
    if(!kontrol) return interaction.reply(`Yeterince baltanız yok.`)
    
    let miktarlar = [
        "2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","3","3","3","3","3","3","3","3","4","4","4","4","4","4","5","5","5","5","5",
    ]
    
    let son = miktarlar[Math.floor(Math.random() * miktarlar.length)]
    
    let kontrol2 = db.fetch(`odun_${interaction.user.id}`)
    if(!kontrol2) db.set(`odun_${interaction.user.id}`, 0)
    db.add(`odun_${interaction.user.id}`, Number(son))
    
    let kontrol3 = db.fetch(`balta_hak_${interaction.user.id}`)
    if(!kontrol3) db.set(`balta_hak_${interaction.user.id}`, 0)
    db.add(`balta_hak_${interaction.user.id}`, 1)
    
    if(db.fetch(`balta_hak_${interaction.user.id}`) >= 5){
        db.set(`balta_hak_${interaction.user.id}`, 0)
        db.add(`balta_${interaction.user.id}`, -1)
        interaction.reply(`Bir Adet Baltanın ne yazıkki kullanım hakkı bitti.`)
    }
    
    interaction.reply(`Başarılı bir şekilde **${son}** adet odun topladın.`)
  }else if(options.getBoolean("maden")){
      let kontrol = db.fetch(`kazma_${interaction.user.id}`)
      if(!kontrol) return interaction.reply(`Yeterince kazman yok.`)


    let madentur = [
    "kömür","kömür","kömür","kömür","kömür","kömür","kömür","kömür","kömür","kömür","kömür","kömür","demir","demir","demir","demir","demir","demir","demir","demir","demir","demir","altın","altın","altın","altın","altın","altın","altın","elmas","elmas","elmas","elmas","elmas",
    ]

    let son = madentur[Math.floor(Math.random() * madentur.length)]


    if(son === "kömür"){
      let miktarlar = [
          "2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","3","3","3","3","3","3","3","3","4","4","4","4","4","4","5","5","5","5","5",
      ]
      let son = miktarlar[Math.floor(Math.random() * miktarlar.length)]
      let kontrol = db.fetch(`kömür_${interaction.auuserthor.id}`)
      if(!kontrol) db.set(`kömür_${interaction.user.id}`, 0)
      db.add(`kömür_${interaction.user.id}`, Number(son))
      interaction.reply(`Başarılı bir şekilde maden yapıldı ve **${son}** adet kömür çıkardınız.`)



    }else if(son === "demir"){
      let miktarlar = [
          "2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","3","3","3","3","3","3","3","3","4","4","4","4","4","4","5","5","5","5","5",
      ]
      let son = miktarlar[Math.floor(Math.random() * miktarlar.length)]
      let kontrol = db.fetch(`demir_${interaction.user.id}`)
      if(!kontrol) db.set(`demir_${interaction.user.id}`, 0)
      db.add(`demir_${interaction.user.id}`, Number(son))
      interaction.reply(`Başarılı bir şekilde maden yapıldı ve **${son}** adet demir çıkardınız.`)
    }else if(son === "altın"){
      let miktarlar = [
          "2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","3","3","3","3","3","3","3","3","4","4","4","4","4","4","5","5","5","5","5",
      ]
      let son = miktarlar[Math.floor(Math.random() * miktarlar.length)]
      let kontrol = db.fetch(`altın_${interaction.user.id}`)
      if(!kontrol) db.set(`altın_${interaction.user.id}`, 0)
      db.add(`altın_${interaction.user.id}`, Number(son))
      interaction.reply(`Başarılı bir şekilde maden yapıldı ve **${son}** adet altın çıkardınız.`)
    }else{
      let miktarlar = [
          "2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","2","3","3","3","3","3","3","3","3","4","4","4","4","4","4","5","5","5","5","5",
      ]
      let son = miktarlar[Math.floor(Math.random() * miktarlar.length)]
      let kontrol = db.fetch(`elmas_${interaction.user.id}`)
      if(!kontrol) db.set(`elmas_${interaction.user.id}`, 0)
      db.add(`elmas_${interaction.user.id}`, Number(son))
      interaction.reply(`Başarılı bir şekilde maden yapıldı ve **${son}** adet elmas çıkardınız.`)
    }

    let kontrol3 = db.fetch(`kazma_hak_${interaction.user.id}`)
    if(!kontrol3) db.set(`kazma_hak_${interaction.user.id}`, 0)
    db.add(`kazma_hak_${interaction.user.id}`, 1)

    if(db.fetch(`kazma_hak_${interaction.user.id}`) >= 5){
      db.set(`kazma_hak_${interaction.user.id}`, 0)
      db.add(`kazma_${interaction.user.id}`, -1)
      interaction.reply(`Bir Adet Kazma'nın ne yazıkki kullanım hakkı bitti.`)
}

}else{
  interaction.reply("lütfen maden veya orman seçiniz")
}
}


// Vadeli komutları
if(commandName == "vade"){

  let kontrol = db.fetch(`hesap_${interaction.user.id}`)
  if(!kontrol) return interaction.reply(`Lütfen İlk Önce Ekonomi Hesabınızı Kurunuz. **/hesap kur**`)


  if(options.getBoolean("ac")){
    let kontrol = db.fetch(`vadeli_hesap_${interaction.user.id}`)
    if(kontrol) return interaction.reply(`Zaten Vadeli Hesabınız bulunmakta.`)
    db.set(`vadeli_hesap_${interaction.user.id}`, true)
    db.push(`vadeli_hesaplar`, interaction.user.id)
    interaction.reply(`Vadeli hesabınız açıldı.`)
  }else if(options.getBoolean("kapat")){
    let kontrol = db.fetch(`vadeli_hesap_${interaction.user.id}`)
    if(!kontrol) return interaction.reply(`Zaten Vadeli Hesabınız yok.`)
    db.delete(`vadeli_hesap_${interaction.user.id}`)
    let miktar = db.fetch(`banka_coin_vadeli_${interaction.user.id}`)
    db.add(`banka_coin_${interaction.user.id}`, Number(miktar))
    db.arrayDeleteVal(`vadeli_hesaplar`, interaction.user.id)
    db.delete(`banka_coin_vadeli_${interaction.user.id}`)
    interaction.reply(`Vadeli hesabınız kapatıldı. Vadeli hesabınızda kalan coinler hesabınıza aktarıldı.`)

  }else if(options.getNumber("yatir")){
    let kontroll = db.fetch(`vadeli_hesap_${interaction.user.id}`)
    if(!kontroll) return interaction.reply(`İlk Önce Vadeli hesap kurmanız gerekmekte. **/banka vade aç**`)
    let miktar = options.getNumber("yatir")
    if(!miktar) return interaction.reply(`Yatırılacak coini belirtiniz.`)
    if(isNaN(miktar)) return interaction.reply(`Yatırılacak coin miktarı sayı ile olmalıdır.`)
    let banka = db.fetch(`banka_coin_${interaction.user.id}`)
    let coin = Number(miktar)
    if(coin > banka) return interaction.reply(`Vadeli hesabınıza yatırılacak miktar banka hesabınızda yok.`)
    let kontrol = db.fetch(`banka_coin_vadeli_${interaction.user.id}`)
    if(!kontrol) db.set(`banka_coin_vadeli_${interaction.user.id}`, 0)
    db.add(`banka_coin_vadeli_${interaction.user.id}`, coin)
    db.add(`banka_coin_${interaction.user.id}`, -coin)
    interaction.reply(`Vadeli hesabınıza **${miktar}** miktar coin yatırıldı.`)

  }else if(options.getNumber("cek")){
    let kontroll = db.fetch(`vadeli_hesap_${interaction.user.id}`)
    if(!kontroll) return interaction.reply(`İlk Önce Vadeli hesap kurmanız gerekmekte. **/banka vade aç**`)
    let miktar = options.getNumber("cek")
    if(!miktar) return interaction.reply(`Çekilecek coini belirtiniz.`)
    if(isNaN(miktar)) return interaction.reply(`Çekilecek coin miktarı sayı ile olmalıdır.`)
    let banka = db.fetch(`banka_coin_vadeli_${interaction.user.id}`)
    let coin = Number(miktar)
    if(coin > banka) return interaction.reply(`Vadeli hesabınızdan çekilecek miktar vadeli hesabınızda yok.`)
    let kontrol = db.fetch(`banka_coin_vadeli_${interaction.user.id}`)
    if(!kontrol) db.set(`banka_coin_vadeli_${interaction.user.id}`, 0)
    db.add(`banka_coin_vadeli_${interaction.user.id}`, -coin)
    db.add(`banka_coin_${interaction.user.id}`, coin)
    interaction.reply(`Banka Hesabınıza **${miktar}** miktar coin yatırıldı.`)
  }else{

   interaction.reply(`Doğru Kullanımı; **/vade yatır/çek/aç/kapat**`) 

  }
}





// banka komutları
if(commandName == "banka"){
  let tekrar = db.fetch("vadeli_hesaplar")
  if(!tekrar) db.set("vadeli_hesaplar", [])

  let banka = db.fetch(`banka_${interaction.user.id}`)
  let bankacoin = db.fetch(`banka_coin_${interaction.user.id}`)
  let coin = db.fetch(`coin_${interaction.user.id}`)
  let bankavadeli = db.fetch(`banka_coin_vadeli_${interaction.user.id}`)
  let durum;
  if(banka) durum = "Aktif"

if(options.getBoolean("kur")){

  console.log(options.getNumber("yatir"))
  let kontrol = db.fetch(`hesap_${interaction.user.id}`)
  if(!kontrol) return interaction.reply(`Lütfen İlk Önce Ekonomi Hesabınızı Kurunuz. **/hesap kur**`)
  if(banka) return interaction.reply(`Şu Anda Banka Hesabınız Bulunmaktadır.`)
  if(Number(coin) < 100) return interaction.reply(`Banka Hesabı Açmak için 100 Coine ihtiyacınız var.`)
  db.set(`banka_${interaction.user.id}`, true)
  db.set(`banka_coin_${interaction.user.id}`, 0)
  /// db.set(`banka_kurulum_${message.author.id}`, moment.utc().format("MMDDHHmm"))
  db.add(`coin_${interaction.user.id}`, -100)
  interaction.reply(`Hesabınız başarılı bir şekilde kurulmuştur.`)
}else if(options.getBoolean("sil")){

  if(!banka) return interaction.reply(`Şu Anda Banka Hesabınız Bulunmamaktadır.`)
  db.delete(`banka_${interaction.user.id}`)
  db.delete(`banka_coin_${interaction.user.id}`)
  interaction.reply(`Banka Hesabınız Başarılı Bir Şekilde Kapatılmıştır.`)
}else if(options.getNumber("yatir")){
  let kontrol = db.fetch(`hesap_${interaction.user.id}`)
if(!kontrol) return interaction.reply(`Lütfen İlk Önce Ekonomi Hesabınızı Kurunuz. **/hesap kur**`)
if(!banka) return interaction.reply(`Şu Anda Banka Hesabınız Bulunmaktadır.`)

let miktar = options.getNumber("yatir")

if(!miktar) return interaction.reply(`Lütfen Banka Hesabınıza Yatırılacak Miktari Belirtiniz.`)
if(isNaN(miktar)) return interaction.reply(`Yatırılacak Miktar Sayı İle Olmalıdır.`)
if(coin < miktar) return interaction.reply(`Cüzdanınızda bu kadar coin bulunmamaktadır.`)
db.add(`banka_coin_${interaction.user.id}`, Number(miktar))
db.add(`coin_${interaction.user.id}`, -Number(miktar))
interaction.reply(`Banka Hesabınıza Başarılı bir şekilde **${miktar}** coin yatırıldı.`)

}else if(options.getNumber("cek")){
    let kontrol = db.fetch(`hesap_${interaction.user.id}`)
    if(!kontrol) return interaction.reply(`Lütfen İlk Önce Ekonomi Hesabınızı Kurunuz. **/hesap kur**`)
    if(!banka) return interaction.reply(`Şu Anda Banka Hesabınız Bulunmaktadır.`)
    
    let miktar = options.getNumber("cek")
    
    if(!miktar) return interaction.reply(`Lütfen Banka Hesabınızdan çekilecek Miktari Belirtiniz.`)
    if(isNaN(miktar)) return interaction.reply(`Çekilecek Miktar Sayı İle Olmalıdır.`)
    if(bankacoin < miktar) return interaction.reply(`Banka hesabınızda bu kadar coin bulunmamaktadır.`)
    db.add(`banka_coin_${interaction.user.id}`, -Number(miktar))
    db.add(`coin_${interaction.user.id}`, Number(miktar))
    interaction.reply(`Banka Hesabınızdan Başarılı bir şekilde **${miktar}** coin çekildi.`)

}else{
  const menu = new Discord.MessageEmbed()
.setDescription(`
> Banka Durumu: **${durum ? durum : "DeAktif"}**
> Bankadaki Coin: **${bankacoin ? bankacoin : "0"}**
> Vadeli Hesabındaki Coin: **${bankavadeli ? bankavadeli : "0"}**
> Cüzdanınızdaki Coin: **${coin ? coin : "0"}**
> Hesap Kurulma Tarihi: 

> Diğer Komutlar;
**/banka kur** : Banka Hesabı Kurarsın
**/banka sil** : Banka Hesabını silersin.
**/banka yatır** : Banka Hesabına Coin Eklersin.
**/banka çek** : Banka Hesabındaki Coini Çekersin.
**/vade** : Vadeli hesabınız ile alakalı işlemler yaparsınız
`)

interaction.reply({embeds: [menu]})
}



}






// level bak komudu
  if(commandName == "level-bak"){
    let xp = db.fetch(`xp_${interaction.guild.id}_${interaction.user.id}`)
    let lvl = db.fetch(`lvl_${interaction.guild.id}_${interaction.user.id}`)


    const embed = new Discord.MessageEmbed()
    .setDescription(`
    > Leveliniz: **${lvl ? lvl :0}**
    > Xp'niz   : **${xp ? xp : 0}**
    `)

    interaction.reply({embeds:[embed]})



  }
  if(commandName == "level-mesaj"){
    let kontrol1 = db.fetch(`level_tebrik_${interaction.guild.id}`)
    if(kontrol1){
        db.set(`level_tebrik_${interaction.guild.id}`, false)
        interaction.reply(`Başarılı bir şekilde tebrik mesajı kapatıldı`)
    }
    if(!kontrol1){
        db.set(`level_tebrik_${interaction.guild.id}`, true)
        interaction.reply(`Başarılı bir şekilde tebrik mesajı açıldı`)
    }
  }

  if(commandName == "level-ayar"){
    let xp_mesaj = options.getNumber("xp-mesaj")
    let xp_level = options.getNumber("xp-level")
    let log = options.getChannel("log")

    if(!xp_mesaj && !xp_level && !log && !mesaj){
      let xpmesaj = db.fetch(`xp_mesaj_${interaction.guild.id}`)
      let xplevel = db.fetch(`xp_level_${interaction.guild.id}`)
      let levellog = db.fetch(`level_log_${interaction.guild.id}`)
      let leveltebrik = db.fetch(`level_tebrik_${interaction.guild.id}`)
      let leveltebrik2 = db.fetch(`level_tebrik_${interaction.guild.id}`) 
      let son;
      if(leveltebrik2 === true){
          son = "Açık"
      }else{
          son = "Kapalı"
      }
      const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`
      Mesaj başına Verilecek XP: **${xpmesaj ? xpmesaj : 1}**
      Kaç xp de level atılayacak: **${xplevel ? xplevel : 250}**
      Level Log: <#${levellog ? levellog : "Ayarlanmamış"}>
      Tebrik Mesaj: **${son}**
      `)
      interaction.reply({embeds:[embed]})
    }else{

      if(xp_mesaj){
        let miktar = xp_mesaj
        db.set(`xp_mesaj_${interaction.guild.id}`, Number(miktar))
      }

      if(xp_level){
        let miktar = xp_level
        db.set(`xp_level_${interaction.guild.id}`, Number(miktar))
      }

      if(log){
        let kanal =  log;
        db.set(`level_log_${interaction.guild.id}`, kanal.id)
      }


      interaction.reply("Başarılı bir şekilde ayarlandı");

    }




  }

/// kayıt isim değiştir

if(commandName == "isim_degistir"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let member = options.getUser("user")
  let isim = options.getString("isim")
  let yas = options.getNumber("yas")


  let kayıt_ytk     =    db.fetch(`kayıt_yetkili_${interaction.guild.id}`)
  let kayıt_erkek   =    db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`)
  let kayıt_kız     =      db.fetch(`kayıt_kız_rol_${interaction.guild.id}`)
  let kayıtsız      =     db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`)
  let kayıt_log     =     db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`)
  let kayıt_kanal   =     db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`)



if(!kayıt_ytk) return interaction.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`)
if(!interaction.member.roles.cache.has(kayıt_ytk)) return interaction.reply(`Bu komudu sadece ayarlanan **Kayıt Yetkilisi** rolüne sahip olan kişiler kullanabilir`)
if(!kayıt_erkek) return interaction.reply(`**Erkek** rolü ayarlanmamış.`)
if(!kayıt_kız) return interaction.reply(`**Kız** rolü ayarlanmamış.`)
if(!kayıtsız) return interaction.reply(`**Kayıtsız** rolü ayarlanmamış.`)
if(!kayıt_log) return interaction.reply(`**Kayıt Log** kanalı ayarlanmamış.`)
if(!kayıt_kanal) return interaction.reply(`**Kayıt** kanalı ayarlanmamış.`)






let üye = interaction.guild.members.cache.get(member.id)


üye.setNickname(`${isim} | ${yas}`)


let kayıtları = db.fetch(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`)
const embed = new Discord.MessageEmbed()
.setDescription(`
İsmi Değiştirilen Kişi: ${member}

Yeni İsmi: **${isim}**
Yeni Yaşı : **${yas}**


Kayıt yetkilisin bilgileri;
Kayıtsız yapan kişi : ${interaction.user}
`)

interaction.reply({embeds: [embed]})
client.channels.cache.get(kayıt_log).send({embeds: [embed]})





}








 // kayıtsıza düşür

 if(commandName == "kayitsiz"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let member = options.getUser("user")


  let kayıt_ytk     =    db.fetch(`kayıt_yetkili_${interaction.guild.id}`)
  let kayıt_erkek   =    db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`)
  let kayıt_kız     =      db.fetch(`kayıt_kız_rol_${interaction.guild.id}`)
  let kayıtsız      =     db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`)
  let kayıt_log     =     db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`)
  let kayıt_kanal   =     db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`)




if(!kayıt_ytk) return interaction.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`)
if(!interaction.member.roles.cache.has(kayıt_ytk)) return interaction.reply(`Bu komudu sadece ayarlanan **Kayıt Yetkilisi** rolüne sahip olan kişiler kullanabilir`)
if(!kayıt_erkek) return interaction.reply(`**Erkek** rolü ayarlanmamış.`)
if(!kayıt_kız) return interaction.reply(`**Kız** rolü ayarlanmamış.`)
if(!kayıtsız) return interaction.reply(`**Kayıtsız** rolü ayarlanmamış.`)
if(!kayıt_log) return interaction.reply(`**Kayıt Log** kanalı ayarlanmamış.`)
if(!kayıt_kanal) return interaction.reply(`**Kayıt** kanalı ayarlanmamış.`)



let üye = interaction.guild.members.cache.get(member.id)

üye.roles.add(kayıtsız)
üye.setNickname(`Kayıtsız`)
üye.roles.remove(kayıt_erkek)
üye.roles.remove(kayıt_kız)

let kayıtları = db.fetch(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`)
const embed = new Discord.MessageEmbed()
.setDescription(`
Kayıtsıza düşürülen kişinin bilgileri;

Düşürülen kişi : ${member}


Kayıt yetkilisin bilgileri;
Kayıtsız yapan kişi : ${interaction.user}
`)

interaction.reply({embeds: [embed]})
client.channels.cache.get(kayıt_log).send({embeds: [embed]})
 }





//// kayıt yetkili stats

if(commandName == "kayit-stats"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")


  let kayıt_ytk     =    db.fetch(`kayıt_yetkili_${interaction.guild.id}`)
  let kayıt_erkek   =    db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`)
  let kayıt_kız     =      db.fetch(`kayıt_kız_rol_${interaction.guild.id}`)
  let kayıtsız      =     db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`)
  let kayıt_log     =     db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`)
  let kayıt_kanal   =     db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`)




if(!kayıt_ytk) return interaction.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`)
if(!interaction.member.roles.cache.has(kayıt_ytk)) return interaction.reply(`Bu komudu sadece ayarlanan **Kayıt Yetkilisi** rolüne sahip olan kişiler kullanabilir`)
if(!kayıt_erkek) return interaction.reply(`**Erkek** rolü ayarlanmamış.`)
if(!kayıt_kız) return interaction.reply(`**Kız** rolü ayarlanmamış.`)
if(!kayıtsız) return interaction.reply(`**Kayıtsız** rolü ayarlanmamış.`)
if(!kayıt_log) return interaction.reply(`**Kayıt Log** kanalı ayarlanmamış.`)
if(!kayıt_kanal) return interaction.reply(`**Kayıt** kanalı ayarlanmamış.`)

let yetkilisec = options.getUser("yetkili_sec")

if(yetkilisec){
let member = yetkilisec.id
let kayıt = db.fetch(`kayıt_yetkilisi_${interaction.guild.id}_${member}`)
const embed = new Discord.MessageEmbed()
.setDescription(`
Yaptığı Kayıt Sayısı: **${kayıt ? kayıt : "0"}**


`)
interaction.reply({embeds:[embed]})
}else{
let member = interaction.user.id
let kayıt = db.fetch(`kayıt_yetkilisi_${interaction.guild.id}_${member}`)
const embed = new Discord.MessageEmbed()
.setDescription(`
Yaptığı Kayıt Sayısı: **${kayıt ? kayıt : "0"}**


`)
interaction.reply({embeds:[embed]})
}





}







// kayıt kız
if(commandName == "kayıt-kız"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let user = options.getUser("user")
  let isim = options.getString("isim")
  let yas = options.getNumber("yas")

  let kayıt_ytk     =    db.fetch(`kayıt_yetkili_${interaction.guild.id}`)
  let kayıt_erkek   =    db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`)
  let kayıt_kız     =      db.fetch(`kayıt_kız_rol_${interaction.guild.id}`)
  let kayıtsız      =     db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`)
  let kayıt_log     =     db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`)
  let kayıt_kanal   =     db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`)




if(!kayıt_ytk) return interaction.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`)
if(!interaction.member.roles.cache.has(kayıt_ytk)) return interaction.reply(`Bu komudu sadece ayarlanan **Kayıt Yetkilisi** rolüne sahip olan kişiler kullanabilir`)
if(!kayıt_erkek) return interaction.reply(`**Erkek** rolü ayarlanmamış.`)
if(!kayıt_kız) return interaction.reply(`**Kız** rolü ayarlanmamış.`)
if(!kayıtsız) return interaction.reply(`**Kayıtsız** rolü ayarlanmamış.`)
if(!kayıt_log) return interaction.reply(`**Kayıt Log** kanalı ayarlanmamış.`)
if(!kayıt_kanal) return interaction.reply(`**Kayıt** kanalı ayarlanmamış.`)



let kayıtcı = db.fetch(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`)
if(!kayıtcı) db.set(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`, 0)
db.add(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`, 1)
let üye = interaction.guild.members.cache.get(user.id)

üye.roles.add(kayıt_kız)
üye.setNickname(`${isim} | ${yas}`)
üye.roles.remove(kayıtsız)

let kayıtları = db.fetch(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`)
const embed = new Discord.MessageEmbed()
.setDescription(`
Kayıt olan kişinin bilgileri;

Kayıt Olan üye: ${user}
Kayıt olduğu isim: **${isim}**
Kayıt olduğu yaş : **${yas}**

Kayıt yetkilisin bilgileri;
Kayıt yapan kişi : ${interaction.user}
Yaptığı kayıtlar : **${kayıtları}**
`)

interaction.reply({embeds: [embed]})
client.channels.cache.get(kayıt_log).send({embeds: [embed]})


}
// kayıt erkek
if(commandName == "kayıt-erkek"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let user = options.getUser("user")
  let isim = options.getString("isim")
  let yas = options.getNumber("yas")

  let kayıt_ytk     =    db.fetch(`kayıt_yetkili_${interaction.guild.id}`)
  let kayıt_erkek   =    db.fetch(`kayıt_erkek_rol_${interaction.guild.id}`)
  let kayıt_kız     =      db.fetch(`kayıt_kız_rol_${interaction.guild.id}`)
  let kayıtsız      =     db.fetch(`kayıt_kayıtsız_rol_${interaction.guild.id}`)
  let kayıt_log     =     db.fetch(`kayıt_kayıt_log_${interaction.guild.id}`)
  let kayıt_kanal   =     db.fetch(`kayıt_kayıt_kanal_${interaction.guild.id}`)




if(!kayıt_ytk) return interaction.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`)
if(!interaction.member.roles.cache.has(kayıt_ytk)) return interaction.reply(`Bu komudu sadece ayarlanan **Kayıt Yetkilisi** rolüne sahip olan kişiler kullanabilir`)
if(!kayıt_erkek) return interaction.reply(`**Erkek** rolü ayarlanmamış.`)
if(!kayıt_kız) return interaction.reply(`**Kız** rolü ayarlanmamış.`)
if(!kayıtsız) return interaction.reply(`**Kayıtsız** rolü ayarlanmamış.`)
if(!kayıt_log) return interaction.reply(`**Kayıt Log** kanalı ayarlanmamış.`)
if(!kayıt_kanal) return interaction.reply(`**Kayıt** kanalı ayarlanmamış.`)




let kayıtcı = db.fetch(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`)
if(!kayıtcı) db.set(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`, 0)
db.add(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`, 1)
let üye = interaction.guild.members.cache.get(user.id)

üye.roles.add(kayıt_erkek)
üye.setNickname(`${isim} | ${yas}`)
üye.roles.remove(kayıtsız)

let kayıtları = db.fetch(`kayıt_yetkilisi_${interaction.guild.id}_${interaction.user.id}`)
const embed = new Discord.MessageEmbed()
.setDescription(`
Kayıt olan kişinin bilgileri;

Kayıt Olan üye: ${interaction.user}
Kayıt olduğu isim: **${isim}**
Kayıt olduğu yaş : **${yas}**

Kayıt yetkilisin bilgileri;
Kayıt yapan kişi : ${interaction.user}
Yaptığı kayıtlar : **${kayıtları}**
`)

interaction.reply({embeds: [embed]})
client.channels.cache.get(kayıt_log).send({embeds: [embed]})
}

//// Kayıt komutları
if(commandName == "kayıt-ayar"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")

  let kayityetkili = options.getRole("kayıt-yetkilisi")
  let erkekrol = options.getRole("erkek-rol")
  let kızrol = options.getRole("kız-rol")
  let kayitsiz = options.getRole("kayıtsız-rol")
  let kayıtlog = options.getChannel("kayıt-log")
  let kayıtkanal = options.getChannel("kayıt-kanal")


    db.set(`kayıt_yetkili_${interaction.guild.id}`, kayityetkili.id)
    db.set(`kayıt_erkek_rol_${interaction.guild.id}`, erkekrol.id)
    db.set(`kayıt_kız_rol_${interaction.guild.id}`, kızrol.id)
    db.set(`kayıt_kayıtsız_rol_${interaction.guild.id}`, kayitsiz.id)
    db.set(`kayıt_kayıt_log_${interaction.guild.id}`, kayıtlog.id)
    db.set(`kayıt_kayıt_kanal_${interaction.guild.id}`, kayıtkanal.id)


  interaction.reply("Başarılı bir şekilde ayarlandı.")

}






// hg-bb-sıfırla komutları

if(commandName == "kapat-hg-bb"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let kontrol = db.fetch(`hg_bb_kanal_${interaction.guild.id}`)
  if(!kontrol) return interaction.reply("Zaten sistem kapalı")
  db.delete(`hg_bb_kanal_${interaction.guild.id}`)
  interaction.reply("Başarılı bir şekilde sıfırlandı")
}
// mod-log-sıfırla komutları

if(commandName == "kapat-hg-bb"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let kontrol = db.fetch(`modlog_${interaction.guild.id}`)
  if(!kontrol) return interaction.reply("Zaten sistem kapalı")
  db.delete(`modlog_${interaction.guild.id}`)
  interaction.reply("Başarılı bir şekilde sıfırlandı")
}

// otorol-sıfırla komutları

if(commandName == "kapat-otorol"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let kontrol = db.fetch(`otorol_kanal_${interaction.guild.id}`)
  let kontrol2 = db.fetch(`otorol_rol_${interaction.guild.id}`)
  if(!kontrol && !kontrol2) return interaction.reply("Zaten sistem kapalı")
  db.delete(`otorol_kanal_${interaction.guild.id}`)
  db.delete(`otorol_rol_${interaction.guild.id}`)
  interaction.reply("Başarılı bir şekilde sıfırlandı")
}

// sayaç-sıfırla komutları

if(commandName == "kapat-sayaç"){
  
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let kontrol = db.fetch(`sayaç_log_${interaction.guild.id}`)
  let kontrol2 = db.fetch(`sayaç_hedef_${interaction.guild.id}`)
  if(!kontrol && !kontrol2) return interaction.reply("Zaten sistem kapalı")
  db.delete(`sayaç_log_${interaction.guild.id}`)
  db.delete(`sayaç_hedef_${interaction.guild.id}`)
  interaction.reply("Başarılı bir şekilde sıfırlandı")
}



  // nuke slash komutları

if(commandName == "nuke"){
  
if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")


interaction.channel.clone().then(channel => {
channel.setPosition(interaction.channel.position)
channel.send("https://cdn.discordapp.com/attachments/927885582221312010/927887159787139092/hidrojen-bombasi_1786815.gif")
channel.send(`Kanal Başarılı bir şekilde sıfırlandı.`)
})
interaction.channel.delete()
}


// mod-log slash komutları

if(commandName == "hg-bb"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let log = options.getChannel("log")


  if(!log) return interaction.reply("hg-bb kanalını belirtiniz")

  db.set(`hg_bb_kanal_${interaction.guild.id}`, log.id)
  interaction.reply("Başarılı bir şekilde ayarlandı")

}


// mod-log slash komutları

if(commandName == "mod-log"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let log = options.getChannel("log")


  if(!log) return interaction.reply("Mod-log kanalını belirtiniz")

  db.set(`modlog_${interaction.guild.id}`, log.id)
  interaction.reply("Başarılı bir şekilde ayarlandı")

}

// otorol slash komutları

if(commandName == "otorol"){
  if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
  let log = options.getChannel("log")
  let rol = options.getRole("rol")

  if(!log && !hedef) return interaction.reply("Verilecek olan rol veya Log belirtilmemiş")

  db.set(`otorol_kanal_${interaction.guild.id}`, log.id)
  db.set(`otorol_rol_${interaction.guild.id}`, rol.id)

  interaction.reply("Başarılı bir şekilde ayarlandı")

}



////// sayaç slash komutları
  if(commandName == "sayaç"){
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
    let log = options.getChannel("log")
    let hedef = options.getNumber("hedef")

    if(!log && !hedef) return interaction.reply("Hedef veya Log belirtilmemiş")

    db.set(`sayaç_log_${interaction.guild.id}`, log.id)
    db.set(`sayaç_hedef_${interaction.guild.id}`,hedef)
    interaction.reply("Başarılı 1bir şekilde ayarlandı")

  }

  //// sa as slash komutları
  if(commandName == "sa-as"){
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")
    let saas = db.fetch(`saas_${interaction.guild.id}`)


    if(!saas) {
    db.set(`saas_${interaction.guild.id}`, true)
    interaction.reply(`Sa As Sistemi Başarılı Bir Şekilde Aktif Edildi.`)
    return;
    }
    db.delete(`saas_${interaction.guild.id}`)

    interaction.reply(`Sa As sistemi başarılı bir şekilde kapatıldı.`)
  } 


  /// rol-ver al slash komutları
  if(commandName == "rol"){
    let user = options.getUser('kullanıcı');
    let rol = options.getRole('rol');
    if(options.getSubcommand() == "ver"){
      
      if(!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply("Rolleri Yönet Yetkiniz Bulunmamakta.")


      if(!user) return interaction.reply("Lütfen Rolün Verileceği Kişiyi Belirtiniz.")
      if(!rol) return interaction.reply("Lütfen Verilecek Rolü Belirtiniz.")


      interaction.guild.members.cache.get(user.id).roles.add(rol)

      const embed = new Discord.MessageEmbed()
      .setColor("GOLD")
      .setAuthor("Sıfırdan Bot Serisi Bölüm 2")
      .setDescription(`${user}, isimli kişiye ${rol} isimli rol verildi.`)


      interaction.reply({embeds:[embed]})
    }
    if(options.getSubcommand() == "al"){
      
      if(!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply("Rolleri Yönet Yetkiniz Bulunmamakta.")


      if(!user) return message.reply("Lütfen Rolün Verileceği Kişiyi Belirtiniz.")
      if(!rol) return message.reply("Lütfen Verilecek Rolü Belirtiniz.")


      interaction.guild.members.cache.get(user.id).roles.remove(rol)

      const embed = new Discord.MessageEmbed()
      .setColor("GOLD")
      .setAuthor("Sıfırdan Bot Serisi Bölüm 2")
      .setDescription(`${user}, isimli kişiden ${rol} isimli rol alındı.`)

      interaction.reply({embeds:[embed]})
    }
  }





 
  if(commandName == "ping"){
    
const embed = new Discord.MessageEmbed()
.setColor("BLUE")
.setAuthor({ name: "Sıfırdan Bot Serisi 15. bölüm" })
.setDescription(`Botun Pingi: ${Math.round(interaction.client.ws.ping)} MS`)


    interaction.reply({embeds: [embed]})
  }
 //// ban komudu
  if(commandName == "ban"){
    let user = options.getUser('kullanıcı');
    let sebep = options.getString('sebep');
    
    if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply("Üyeleri Banla Yetkiniz Yok.")
    
    if(user){
      if(!sebep) return interaction.reply("Lütfen Sebep Belirtiniz")
      
      
      const üye = interaction.guild.members.cache.get(user.id)
      
      üye.ban({reason: sebep})
      
      
      const ban = new Discord.MessageEmbed()
      .setAuthor("Sıfırdan Bot Serisi Bölüm 2")
      .setColor("GOLD")
      .setDescription(`${user}, isimli kişi başarılı bir şekilde banlandı
      banlanma sebebi: **${sebep}**`)
      interaction.reply({embeds:[ban]})
    }else{
      interaction.reply("Lütfen Banlanacak kişiyi belirtiniz.")
    }
  }

  /// kick komudu
  if(commandName == "kick"){
    let user = options.getUser('kullanıcı');
    let sebep = options.getString('sebep');
    
    if(!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply("Üyeleri Kickleme Yetkiniz Yok.")
    
    if(user){
      if(!sebep) return interaction.reply("Lütfen Sebep Belirtiniz")
      
      
      const üye = interaction.guild.members.cache.get(user.id)
      
      üye.kick({reason: sebep})
      
      
      const kick = new Discord.MessageEmbed()
      .setAuthor("Sıfırdan Bot Serisi Bölüm 2")
      .setColor("GOLD")
      .setDescription(`${user}, isimli kişi başarılı bir şekilde Sunucudan Atıldı
      Atılma sebebi: **${sebep}**`)
      interaction.reply({embeds:[kick]})
    }else{
      interaction.reply("Lütfen Banlanacak kişiyi belirtiniz.")
    }
  }


  // Rol VER-AL komudu
  if(commandName == "kick"){
    let secenek = options.getString('sebep');
  }
})



// Slash Bitiş









client.login(ayarlar.token);
