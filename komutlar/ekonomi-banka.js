const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json")
const moment = require("moment")
moment.locale("tr")
const db = require("nrc.db")
module.exports = {
    calistir: async(client, message, args) => {
let tekrar = db.fetch("vadeli_hesaplar")
if(!tekrar) db.set("vadeli_hesaplar", [])

let banka = db.fetch(`banka_${message.author.id}`)
let bankacoin = db.fetch(`banka_coin_${message.author.id}`)
let coin = db.fetch(`coin_${message.author.id}`)
let bankavadeli = db.fetch(`banka_coin_vadeli_${message.author.id}`)
let durum;
if(banka) durum = "Aktif"

const menu = new Discord.MessageEmbed()
.setDescription(`
> Banka Durumu: **${durum ? durum : "DeAktif"}**
> Bankadaki Coin: **${bankacoin ? bankacoin : "0"}**
> Vadeli Hesabındaki Coin: **${bankavadeli ? bankavadeli : "0"}**
> Cüzdanınızdaki Coin: **${coin ? coin : "0"}**
> Hesap Kurulma Tarihi: 

> Diğer Komutlar;
**${ayarlar.prefix}banka kur** : Banka Hesabı Kurarsın
**${ayarlar.prefix}banka sil** : Banka Hesabını silersin.
**${ayarlar.prefix}banka yatır** : Banka Hesabına Coin Eklersin.
**${ayarlar.prefix}banka çek** : Banka Hesabındaki Coini Çekersin.
**${ayarlar.prefix}banka vade** : Vadeli hesabınız ile alakalı işlemler yaparsınız
`)

if(!args[0]) return message.reply({embeds: [menu]})


if(args[0] === "kur"){
let kontrol = db.fetch(`hesap_${message.author.id}`)
if(!kontrol) return message.reply(`Lütfen İlk Önce Ekonomi Hesabınızı Kurunuz. **${ayarlar.prefix}hesap kur**`)
if(banka) return message.reply(`Şu Anda Banka Hesabınız Bulunmaktadır.`)
if(Number(coin) < 100) return message.reply(`Banka Hesabı Açmak için 100 Coine ihtiyacınız var.`)
db.set(`banka_${message.author.id}`, true)
db.set(`banka_coin_${message.author.id}`, 0)
/// db.set(`banka_kurulum_${message.author.id}`, moment.utc().format("MMDDHHmm"))
db.add(`coin_${message.author.id}`, -100)
message.reply(`Hesabınız başarılı bir şekilde kurulmuştur.`)
}

if(args[0] === "sil"){
if(!banka) return message.reply(`Şu Anda Banka Hesabınız Bulunmamaktadır.`)
db.delete(`banka_${message.author.id}`)
db.delete(`banka_coin_${message.author.id}`)
message.reply(`Banka Hesabınız Başarılı Bir Şekilde Kapatılmıştır.`)
}

if(args[0] === "yatır"){
let kontrol = db.fetch(`hesap_${message.author.id}`)
if(!kontrol) return message.reply(`Lütfen İlk Önce Ekonomi Hesabınızı Kurunuz. **${ayarlar.prefix}hesap kur**`)
if(!banka) return message.reply(`Şu Anda Banka Hesabınız Bulunmaktadır.`)

let miktar = args[1]

if(!miktar) return message.reply(`Lütfen Banka Hesabınıza Yatırılacak Miktari Belirtiniz.`)
if(isNaN(miktar)) return message.reply(`Yatırılacak Miktar Sayı İle Olmalıdır.`)
if(coin < miktar) return message.reply(`Cüzdanınızda bu kadar coin bulunmamaktadır.`)
db.add(`banka_coin_${message.author.id}`, Number(miktar))
db.add(`coin_${message.author.id}`, -Number(miktar))
message.reply(`Banka Hesabınıza Başarılı bir şekilde **${miktar}** coin yatırıldı.`)
}
if(args[0] === "çek"){
let kontrol = db.fetch(`hesap_${message.author.id}`)
if(!kontrol) return message.reply(`Lütfen İlk Önce Ekonomi Hesabınızı Kurunuz. **${ayarlar.prefix}hesap kur**`)
if(!banka) return message.reply(`Şu Anda Banka Hesabınız Bulunmaktadır.`)

let miktar = args[1]

if(!miktar) return message.reply(`Lütfen Banka Hesabınızdan çekilecek Miktari Belirtiniz.`)
if(isNaN(miktar)) return message.reply(`Çekilecek Miktar Sayı İle Olmalıdır.`)
if(bankacoin < miktar) return message.reply(`Banka hesabınızda bu kadar coin bulunmamaktadır.`)
db.add(`banka_coin_${message.author.id}`, -Number(miktar))
db.add(`coin_${message.author.id}`, Number(miktar))
message.reply(`Banka Hesabınızdan Başarılı bir şekilde **${miktar}** coin çekildi.`)
}

if(args[0] === "vade"){
let kontrol = db.fetch(`hesap_${message.author.id}`)
if(!kontrol) return message.reply(`Lütfen İlk Önce Ekonomi Hesabınızı Kurunuz. **${ayarlar.prefix}hesap kur**`)
if(!args[1]) return message.reply(`Doğru Kullanımı; **${ayarlar.prefix}banka vade yatır/çek/aç/kapat**`) 


if(args[1] === "aç"){
let kontrol = db.fetch(`vadeli_hesap_${message.author.id}`)
if(kontrol) return message.reply(`Zaten Vadeli Hesabınız bulunmakta.`)
db.set(`vadeli_hesap_${message.author.id}`, true)
db.push(`vadeli_hesaplar`, message.author.id)
message.reply(`Vadeli hesabınız açıldı.`)

}
if(args[1] === "kapat"){
let kontrol = db.fetch(`vadeli_hesap_${message.author.id}`)
if(!kontrol) return message.reply(`Zaten Vadeli Hesabınız yok.`)
db.delete(`vadeli_hesap_${message.author.id}`)
let miktar = db.fetch(`banka_coin_vadeli_${message.author.id}`)
db.add(`banka_coin_${message.author.id}`, Number(miktar))
db.arrayDeleteVal(`vadeli_hesaplar`, message.author.id)
db.delete(`banka_coin_vadeli_${message.author.id}`)
message.reply(`Vadeli hesabınız kapatıldı. Vadeli hesabınızda kalan coinler hesabınıza aktarıldı.`)
}


if(args[1] === "yatır"){
let kontroll = db.fetch(`vadeli_hesap_${message.author.id}`)
if(!kontroll) return message.reply(`İlk Önce Vadeli hesap kurmanız gerekmekte. **${ayarlar.prefix}banka vade aç**`)
let miktar = args[2] 
if(!miktar) return message.reply(`Yatırılacak coini belirtiniz.`)
if(isNaN(miktar)) return message.reply(`Yatırılacak coin miktarı sayı ile olmalıdır.`)
let banka = db.fetch(`banka_coin_${message.author.id}`)
let coin = Number(miktar)
if(coin > banka) return message.reply(`Vadeli hesabınıza yatırılacak miktar banka hesabınızda yok.`)
let kontrol = db.fetch(`banka_coin_vadeli_${message.author.id}`)
if(!kontrol) db.set(`banka_coin_vadeli_${message.author.id}`, 0)
db.add(`banka_coin_vadeli_${message.author.id}`, coin)
db.add(`banka_coin_${message.author.id}`, -coin)

message.reply(`Vadeli hesabınıza **${miktar}** miktar coin yatırıldı.`)
}
if(args[1] === "çek"){
let kontroll = db.fetch(`vadeli_hesap_${message.author.id}`)
if(!kontroll) return message.reply(`İlk Önce Vadeli hesap kurmanız gerekmekte. **${ayarlar.prefix}banka vade aç**`)
let miktar = args[2] 
if(!miktar) return message.reply(`Çekilecek coini belirtiniz.`)
if(isNaN(miktar)) return message.reply(`Çekilecek coin miktarı sayı ile olmalıdır.`)
let banka = db.fetch(`banka_coin_vadeli_${message.author.id}`)
let coin = Number(miktar)
if(coin > banka) return message.reply(`Vadeli hesabınızdan çekilecek miktar vadeli hesabınızda yok.`)
let kontrol = db.fetch(`banka_coin_vadeli_${message.author.id}`)
if(!kontrol) db.set(`banka_coin_vadeli_${message.author.id}`, 0)
db.add(`banka_coin_vadeli_${message.author.id}`, -coin)
db.add(`banka_coin_${message.author.id}`, coin)
message.reply(`Banka Hesabınıza **${miktar}** miktar coin yatırıldı.`)
    
    
}

}

},

name: "banka",
description: "Bankana bakarsın",
aliases: [],
kategori: "ekonomi",
usage: "",
}