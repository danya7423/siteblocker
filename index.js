const fs = require('fs')
const express = require('express');

let blocked = require('./blocked.json') // файл с заблокироваными доменами
let hosts = 'C://Windows/System32/drivers/etc/hosts'

async function clearHosts() { // Очистка файла с хостами
    let write = await fs.writeFileSync(hosts, '');
    return write
}
async function addHost(domain, redirect) { // Добавление хоста
    let write = await fs.appendFileSync(hosts, `${redirect} ${domain}\n`);
    return write
}

let app = express();

app.get('/', (req, res) => {
    res.send('Доступ к сайту запрещен.')
})

app.listen(80, function() {
    console.log('Сервер запущен.');
});

console.log('Доступ заблокирован.')
for (i in blocked) {
    addHost(blocked[i], '127.0.0.1')
}

const handleShutdown = async reason => {
    console.log('Доступ открыт.');
    await clearHosts() // Очищаем файл, при остановке процесса
    return process.exit(1)
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
process.on('SIGHUP', handleShutdown);