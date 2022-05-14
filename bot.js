const { Client, Intents, Collection, MessageAttachment, MessageEmbed, Permissions, Constants, ApplicationCommandPermissionsManager } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_BANS,Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,Intents.FLAGS.GUILD_INTEGRATIONS,Intents.FLAGS.GUILD_WEBHOOKS,Intents.FLAGS.GUILD_INVITES,Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Intents.FLAGS.GUILD_MESSAGE_TYPING,Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,Intents.FLAGS.DIRECT_MESSAGE_TYPING] });
const ayarlar = require("./ayarlar.json");
const Discord = require("discord.js")
const db = require("nrc.db");
const message = require("./events/message");
const { DiscordFivemApi } = require('discord-fivem-api');
let prefix = ayarlar.prefix;
const ms = require("ms");
const { description } = require('./komutlar/bot-ping');






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

 })

 client.on("ready", async() =>{
   
  let commands = client.guilds.cache.get("761858064315187250").commands;

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


})



client.on("interactionCreate", async(interaction) => {
  const { commandName, options } = interaction;


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
