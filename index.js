const TelegramBot = require('node-telegram-bot-api');
/*const request = require('request');*/
let fs = require('fs');

const token = '901231463:AAHMqvWSKVPQLi7ufsJwfQRIkH3Ebnx4GMw';
const ROOT_USER = { phone_number: '+380978065905', first_name: 'Юрий',user_id: 471460368 };
const bot = new TelegramBot(token, {polling: true});

let myMSg= null;
let myMatch = null;
const firstChatId = -348731507;
const SecondChatId = -362169744;

let textMsg = "Write new message";
let listChats= JSON.parse(fs.readFileSync(__dirname + '/listChats.txt','utf8'));
let listUser= JSON.parse(fs.readFileSync(__dirname + '/test.json','utf8'));
let newUser= JSON.parse(fs.readFileSync(__dirname + '/newUser.txt','utf8'));




bot.onText(/\/[a-z.]+/, (msg, match) => {
    const chatId = msg.chat.id;
    myMatch=match;
    myMSg=msg;
let testList= newUser.users.map(item=>{
    return {
        text : item.first_name,
        callback_data: item.user_id
    }
})
    let testText= newUser.users.map((item,i)=>{
        return item.first_name+" : "+i;
    })
    console.log("testText",testText);


    if (msg.from.id === ROOT_USER.user_id){
        switch (match[0]) {
            case  '/curse':
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
                break;
            case  '/msg':
                textMsg = msg.text.slice(5,msg.text.length);
                bot.sendMessage(chatId, "I saved your message");
                console.log(msg);
                break;
            case  '/addchat':
                console.log("msg addchat: ",msg);
                listChats.chats.push(msg.chat);
                console.log("listChats : ",listChats);
                fs.writeFile(__dirname+'/listChats.txt',JSON.stringify(listChats),err => console.log(err));
                bot.sendMessage(chatId,"Test add addchat");
                break;
            case  '/adduser':
                let option = {
                    "parse_mode": "Markdown",
                    "reply_markup": {
                        "one_time_keyboard": true,
                        "keyboard": [[{
                            text: "My phone number",
                            request_contact: true
                        }], ["Cancel"]]
                    }
                };
                console.log("msg : ",msg);
                console.log("match : ",match);
                bot.sendMessage(msg.chat.id, "How can we contact you?", option).then(() => {
                    bot.once("contact",(msg)=>{
                       // console.log("contact Test",msg.contact);
                        listUser.users.push(msg.contact);
                        console.log(listUser);
                        fs.writeFile(__dirname+'/newUser.txt',JSON.stringify(listUser),err => console.log(err));
                    })});
                break;
            case  '/chek':
                for (let i=0; i<newUser.users.length;i++){
                    bot.sendMessage(chatId,
                        `${newUser.users[i].first_name} ${newUser.users[i].last_name?newUser.users[i].last_name :""} ${newUser.users[i].phone_number}`,{
                        reply_markup:{
                            inline_keyboard:[[
                                {
                                    text: 'Delete',
                                    callback_data: `Delete : ${newUser.users[i].user_id}`
                                },
                                {
                                    text: 'Add',
                                    callback_data: `Add : ${newUser.users[i].user_id}`
                                },
                            ]
                            ]
                        }
                    })
                }
                break;
            default:
                bot.sendMessage(id, "Error");
        }
    }
    if (msg.from.id !== ROOT_USER.user_id){

        switch (match[0]) {
            case '/addme':
                let option = {
                    "parse_mode": "Markdown",
                    "reply_markup": {
                        "one_time_keyboard": true,
                        "inline_keyboard": [[{
                            text: "My phone number",
                            request_contact: true
                        }], ["Cancel"]]
                    }
                };
                console.log("msg : ",msg);
                console.log("match : ",match);
                bot.sendMessage(msg.chat.id, "How can we contact you?", option).then(() => {
                    bot.once("contact",(msg)=>{console.log("contact Test",msg.contact)})});
             /*   listUser.users.push(JSON.stringify(msg.contact));
                console.log(listUser);*/
                break;
            case  '/chek':
               /* bot.sendMessage(chatId, 'What group you interesting?',{
                    reply_markup:{
                        inline_keyboard:[

                        ]
                    }
                });*/
                for (let i=0; i<newUser.users.length;i++){
                    bot.sendMessage(chatId, newUser.users[i].first_name,{
                        reply_markup:{
                            inline_keyboard:[[
                                {
                                    text: 'Delete',
                                    callback_data: `Delete : ${newUser.users[i].user_id}`
                                },
                                {
                                    text: 'Add',
                                    callback_data: `Add : ${newUser.users[i].user_id}`
                                },
                            ]
                            ]
                        }
                    })
                }
                break;
            default:
                bot.sendMessage(id, "Error");

        }

    }
  /*  else{
        bot.sendMessage(chatId, "You not have access");
    }*/
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