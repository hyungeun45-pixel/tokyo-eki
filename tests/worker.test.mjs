import test from 'node:test';
import assert from 'node:assert/strict';
import {makeHandler} from '../worker/handler.mjs';
import {publicAssets,securityHeaders} from '../scripts/assets.mjs';
const assets=await publicAssets(),headers=await securityHeaders(),handler=makeHandler(assets,headers);
test('the deployed handler adds all security headers to the real HTML and JavaScript',async()=>{
 for(const file of ['','app.js','style.css','art.js']){
  const res=await handler.fetch(new Request('https://test.invalid/'+file));assert.equal(res.status,200);assert.match(res.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);assert.equal(res.headers.get('X-Content-Type-Options'),'nosniff');assert.equal(res.headers.get('X-Frame-Options'),'DENY');assert.equal(res.headers.get('Referrer-Policy'),'no-referrer');assert.match(res.headers.get('Permissions-Policy'),/camera=\(\)/);assert.equal(res.headers.get('Cross-Origin-Opener-Policy'),'same-origin');assert.match(res.headers.get('Strict-Transport-Security'),/max-age=31536000/);assert.equal(await res.text(),assets[file||'index.html'].body);
 }
});
test('the handler supports HEAD and rejects writes and non-public paths with protective headers',async()=>{
 const head=await handler.fetch(new Request('https://test.invalid/',{method:'HEAD'}));assert.equal(head.status,200);assert.equal(await head.text(),'');
 const post=await handler.fetch(new Request('https://test.invalid/',{method:'POST',body:'x'}));assert.equal(post.status,405);assert.equal(post.headers.get('Allow'),'GET, HEAD');
 for(const name of ['.env','.git/config','.openai/hosting.json','server/index.js','%2e%2e%2f.env']){const res=await handler.fetch(new Request('https://test.invalid/'+name));assert.equal(res.status,404,name);assert.equal(res.headers.get('X-Frame-Options'),'DENY');}
});
test('only browser game files are included in generated public artifacts',()=>{
 assert.ok(Object.hasOwn(assets,'index.html'));assert.ok(Object.hasOwn(assets,'engine.js'));assert.ok(!Object.hasOwn(assets,'_headers'));assert.ok(!Object.keys(assets).some(s=>s.includes('/')||s.startsWith('.')));
});
