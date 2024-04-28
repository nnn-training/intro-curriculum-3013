'use strict';
const http = require('node:http');
const server = http.createServer((req,res)=>{
    const now = new Date();
    console.info(`[${now}] Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200,{
      'Content-Type': 'text/plain; charset=utf-8'
    });
    switch(req.method){
      case 'GET':
        res.write(`GET ${req.url}`);
        break;
      case 'POST':
        res.write(`POST ${req.url}`);
        let rawData = '';
        req.on('data',chunk=>{
          rawData += chunk;
        }).on('end',()=>{
          console.info(`[${now}] DataをPostしてきた:${rawData}`);
        });
        break;
      case 'DELETE':
        res.write(`DELETE ${req.url}¥n`);
        break;
        default:
        break;
    }
    res.end();
  }).on('error', e=>{
    console.error(`[${new Date()}] Server Errorが発生`, e)
  }).on('clientError', e=>{
    console.error(`[${new Date()}] Client Errorが発生`, e)
  });
  const port = 8000;
  server.listen(port, ()=>{
    console.info(`[${new Date()}] Listening on ${port}`);
  });

       