'use strict';
const http = require('http');
const server = http
  .createServer((req, res) => {
    //Dateオブジェクトを変数に定義
    const now = new Date();
    //クライアントからリクエストがあった時間とIPアドレスをコンソールに表示
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    //res関数のメソッドで、以下の情報をレスポンスヘッダに書き出す（第一引数はステータスコード、第二引数はヘッダー情報をオブジェクトにしたもの）
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8'
    });
    //レスポンスボディの書き出し
    //switch-caseにはbreak(スコープから出る)かreturn(関数から出る)を記述しないと他のcaseやdefaultも全て実行してしまう
    switch (req.method) {
      //クライアントから'GET'でリクエストが来た時
      case 'GET':
        //レスポンスにリクエストされたURLを表示する(テキストではmessegesディレクトリを指定した)
        res.write(`GET ${req.url}`);
        break;
      //クライアントから'POST'でリクエストが来た時
      case 'POST':
        res.write(`POST ${req.url}`);
        //送られてくるデータを格納する空文字列を定義
        let rawData = '';
        req
          //リクエストがあり、'data'イベントが起こったら、取得したstreamingデータをchankに溜め込み、それを順番にrawData内に元の状態の文字列として繋げて格納する
          .on('data', chunk => {
            rawData += chunk;
          })
          //メソッドチェーン。'end'イベントが起こったら(全部格納が終わったら)、ログとして今の時間と取得したデータをコンソールに出力
          .on('end', () => {
            console.info(`[ ${now} ] Data posted: ${rawData}`);
          });
        break;
      //クライアントから'DELETE'でリクエストが来た時
      case 'DELETE':
        res.write(`DELETE ${req.url}`);
        break;
      //どれにも当てはまらなければdefaultに飛ぶ  
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
