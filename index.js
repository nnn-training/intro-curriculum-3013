'use strict';
const http = require('http');
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


    //console.info(`[ ${now} ]\n ${req.socket.remoteAddress}からアクセスがありました`);
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        res.write((logData) +'GET ' + req.url + '\n');
        break;
      case 'POST':
        res.write((logData) +'POST ' + req.url + '\n');
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            console.info(`[ ${now} ] \n 投稿内容: ${rawData}`); 
          });
        break;
      case 'PUT':
        res.write((logData) +'PUT ' + req.url + '\n');
        break;
      case 'DELETE':
        res.write((logData) +'DELETE ' + req.url + '\n');
        break;
      default:
        break;
    }
    res.end();
  })
  .on('error', e => {
    console.error('[' + new Date() + '] Server Error', e);
  })
  .on('clientError', e => {
    console.error('[' + new Date() + '] Client Error', e);
  });
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
