const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const token = '901231463:AAHMqvWSKVPQLi7ufsJwfQRIkH3Ebnx4GMw';
const bot = new TelegramBot(token, {polling: true});
let myMSg= null;
let myMatch = null;
const firstChatId = -348731507;
const SecondChatId = -362169744;
const chat_ids=[-376092482,471460368,-348731507,-362169744];
let textMsg = "Write new message";


bot.onText(/\/[a-z.]+/, (msg, match) => {
    const chatId = msg.chat.id;
    myMatch=match;
    myMSg=msg;
    console.log(msg);
    let textMasg = JSON.parse(JSON.stringify(match));
    if(match[0] === '/ad'){

    }
    if(match[0] === '/curse'){
        bot.sendMessage(chatId, 'What group you interesting?',{
            reply_markup:{
                inline_keyboard:[
                    [
                        {
                            text: 'First group',
                            callback_data: 'first'
                        },
                        {
                            text: 'Second group',
                            callback_data: "second"
                        },
                        {
                            text: 'All group',
                            callback_data: 'all'
                        },
                    ]
                ]
            }
        });
    }
    if (match[0] === '/msg'){
        textMsg = msg.text.slice(5,msg.text.length);
        bot.sendMessage(chatId, "I saved your message")
    }
});
bot.on('callback_query',query=>{
    console.log('query',query);
    console.log("myMSg",myMSg);
    console.log("myMatch",myMatch);
    const id = query.message.chat.id;
    if(textMsg!=="Write new message") {
        switch (query.data) {
            case  'first':
                bot.pinChatMessage(firstChatId, textMsg);
                bot.sendMessage(firstChatId, textMsg);
                textMsg = "Write new message";
                break;
            case  'second':
                bot.sendMessage(secondChatId, textMsg);
                textMsg = "Write new message";
                break;
            case  'all':
                for (let i = 0; i < chat_ids.length; i++) {
                    bot.sendMessage(chat_ids[i], textMsg);
                }
                textMsg = "Write new message";
                break;
            default:
                bot.sendMessage(id, "Error");
        }
    }else{
        bot.sendMessage(id, "Error in else block");
    }
   /* request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',(err,response,body)=>{

        const data = JSON.parse(body);
      //  console.log("query.data", query);
        let myitem = data.filter(item=>{
            return item.ccy === query.data;
        })[0];
        console.log("myMSg",myMSg);
        console.log("myMatch",myMatch);

        let md = `
        *${myitem.ccy}=>${myitem.base_ccy}*
        Buy:_${myitem.buy}_
        Sale:_${myitem.sale}_
        `;
        bot.sendMessage(id,md,{parse_mode:'Markdown'});
    })*/



})