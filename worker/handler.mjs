// Sites serves the same browser-only game through a small response-header handler.
// No account data, runtime secrets, database, or external network access is used.
export function makeHandler(assets,securityHeaders){
 return {
  async fetch(request){
   const headers=new Headers(securityHeaders);headers.set('Cache-Control','no-cache');
   const reply=(body,status=200,type='text/plain; charset=utf-8')=>{headers.set('Content-Type',type);return new Response(request.method==='HEAD'?null:body,{status,headers});};
   if(!['GET','HEAD'].includes(request.method)){headers.set('Allow','GET, HEAD');return reply('Method not allowed',405);}
   let pathname;try{pathname=decodeURIComponent(new URL(request.url).pathname);}catch{return reply('Bad request',400);}
   const key=pathname==='/'?'index.html':pathname.slice(1);
   if(!Object.hasOwn(assets,key))return reply('Not found',404);
   const asset=assets[key];return reply(asset.body,200,asset.type);
  }
 };
}
