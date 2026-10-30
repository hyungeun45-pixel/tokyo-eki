import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
const headerText=await readFile(path.join(root,'_headers'),'utf8');
const securityHeaders=Object.fromEntries(headerText.split(/\r?\n/).filter(line=>/^  [A-Za-z-]+:/.test(line)).map(line=>{const i=line.indexOf(':');return [line.slice(0,i).trim(),line.slice(i+1).trim()];}).filter(([key])=>key!=='Strict-Transport-Security'));
http.createServer(async(req,res)=>{
 try {const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+path.sep))throw Error();const data=await readFile(file);res.writeHead(200,{...securityHeaders,'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data);}catch{res.writeHead(404,{...securityHeaders,'Content-Type':'text/plain; charset=utf-8'});res.end('Not found');}
}).listen(Number(process.env.PORT)||4180,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${Number(process.env.PORT)||4180}`));
