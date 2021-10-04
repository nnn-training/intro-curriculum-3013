/**
 * 2019年度あさづけさんのプルリク#634
 * を参考にさせてもらいました。
 */

'use strict';
const http = require('http');

const fs = require('fs');           //ファイルシステムmodule読込
const fileName = './log.json';     //保存するファイル名宣言
//let log = [];
let log = new Map();

try {
   const akkData = fs.readFileSync(fileName, 'utf8');
   log = new Map(JASON.perse(allData));
}catch(ignore){
  console.log(fileName+'に、過去のログはありません');
}

const server = http
  .createServer((req, res) => {
    const now = new Date();

    let nichiji = {
      month:now.getMonth()+1,
      day:now.getDate(),
      year:now.getFullYear(),
      week:["日","月","火","水","木","金","土"][(now.getDay())],
      Hours:now.getHours(),
      Minutes:now.getMinutes(),
      Seconds:now.getSeconds()
    }

    let logData = `${nichiji.year}/${nichiji.month}/${nichiji.day}/(${nichiji.week})
    ${nichiji.Hours}:${nichiji.Minutes}:${nichiji.Seconds} \n
    「${req.socket.remoteAddress}」からアクセスがありました。\n`;

    log.set(now, logData);
    //saveLogs();
    saveTasks();
    console.info(logData);
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
      
    });

    switch (req.url){
       case '/log':
        res.write(logData);
       break;
       default:
       break;
    }

    switch (req.method) {
      case 'GET':
        res.write('GET ' + req.url + '\n');
        break;
      case 'POST':
        res.write('POST ' + req.url + '\n');
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            console.info('[' + now + '] Data posted: ' + rawData);
          });
        break;
      case 'DELETE ':
        res.write('DELETE' + req.url + '\n')
        break;
      default:
        break;
    }
    res.end();
  })
  .on('error', e => {
    console.error('[' + new Date() + '] Server Error', e);
    saveLogs();
  })
  .on('clientError', e => {
    console.error('[' + new Date() + '] Client Error', e);
    saveLogs();
  });

const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});

/**
 * ログをJSONファイルに保存する関数
 * JSON.stringify関数でJASONの文字列に変換して
 * 同期的にファイルに書き出す
 */
 function saveTasks(){
  fs.writeFileSync(fileName,JSON.stringify(Array.from(log)), 'utf8');
}

