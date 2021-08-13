const fs = require('fs');
const { Session } = require('inspector');
const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');



const SESSION_FILE_PATH = './session.js';
const country_code = "521";
const number = "";
const msg = "prueba";

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
    session: sessionData
});

client.initialize();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
})

client.on('ready', () => {
    console.log('Cliente listo')

    let chatId = country_code + number + "@c.us";

    client.sendMessage(chatId, msg).then(response => {
        if (response.id.fromMe) {
            console.log('mensaje enviado')
        }
    })
})

client.on('authenticated', session => {
    sessionData = session;

    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err => {
        if (err) {
            console.error(err);
        }
    })
})

client.on('auth_failure', msg => {
    console.error('error en la autenticacion', msg);
})

client.on('message', msg => {
    console.log(msg)
    if (msg.body == "Hola") {
        client.sendMessage(msg.from, "Hola como te puedo ayudar?")
    }
})

