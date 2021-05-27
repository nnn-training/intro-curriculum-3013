// tmux → node index.js でサーバー立ち上げ後、Ctrl + b → c で別ウィンドウを作り
// 例えばPOSTメソッドでアクセス: curl -d 'message=こんにちは' http://localhost:8000/messages
'use strict';
const http = require('http');
// reqはStreamと同様イベントを発行するオブジェクト
// Streamの場合はreadlineオブジェクトがイベントを発行していた
// streamのイベント一覧：https://nodejs.org/docs/v10.14.2/api/readline.html#readline_class_interface
// req (http) のイベント一覧:
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.socket.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    // 各caseの中ではreturnまたはbreakのいずれかが必要であることに注意
    switch (req.method) {
      case 'GET':
        res.write('GET ' + req.url);
        break;
      case 'POST':
        res.write('POST ' + req.url);
        let rawData = '';
        req
        // APIリファレンスで'data'が見つからない https://tmykndr.hatenablog.com/entry/2018/05/16/030921
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            console.info('[' + now + '] Data posted: ' + rawData);
          });
        break;
        // どれもマッチしない場合にはdefaultの次の行が実行される
      case 'DELETE':
        res.write('DELETE ' + req.url);
      default:
        break;
    }
    res.end();
  })
  .on('error', e => {
    console.error('[' + new Date() + '] Server Error', e);
  })
  // https://nodejs.org/api/http.html#http_event_clienterror
  .on('clientError', e => {
    console.error('[' + new Date() + '] Client Error', e);
  });
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
