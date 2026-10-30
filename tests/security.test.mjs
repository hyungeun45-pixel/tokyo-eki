import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {escapeHtml,safeExternalUrl,sanitizeJournal} from '../dist/storage.js';
test('untrusted text is escaped and external links require HTTPS on an allowlisted host',()=>{
 assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
 for(const url of ['javascript:alert(1)','data:text/html,x','http://www.gotokyo.org','https://www.gotokyo.org.attacker.example','https://name:password@www.gotokyo.org'])assert.equal(safeExternalUrl(url),'https://www.gotokyo.org/kr/');
 assert.equal(safeExternalUrl('https://www.gotokyo.org/kr/spot/59/'),'https://www.gotokyo.org/kr/spot/59/');
});
test('tampered browser records are bounded and validated before display',()=>{
 const valid={line:'긴자선',mode:'travel',seconds:30,accuracy:100,date:'2026-10-30T01:00:00.000Z'};
 const d=sanitizeJournal({visited:['asakusa','asakusa','<script>'],records:[valid,{...valid,date:{}},{...valid,seconds:-1},{...valid,accuracy:999},null]},new Set(['asakusa']));assert.deepEqual(d.visited,['asakusa']);assert.equal(d.records.length,1);assert.equal(d.records[0].hints,0);assert.equal(sanitizeJournal(null,new Set()).records.length,0);
});
test('HTML restricts script execution, networking, forms and referrer disclosure',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');assert.match(html,/http-equiv="Content-Security-Policy"/);assert.match(html,/script-src 'self'/);assert.match(html,/connect-src 'none'/);assert.match(html,/object-src 'none'/);assert.match(html,/form-action 'none'/);assert.match(html,/name="referrer" content="no-referrer"/);assert.doesNotMatch(html,/unsafe-inline|unsafe-eval|\son(?:click|load|error|submit)=/);assert.doesNotMatch(html,/<script\b[^>]*src="https?:/);assert.doesNotMatch(html,/<script\b(?![^>]*src=)[^>]*>[^<]+/);
 const links=[...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)];for(const [tag] of links)assert.match(tag,/rel="noopener noreferrer"/);
});
test('public assets contain no environment, private key or credential files',async()=>{
 const files=await readdir(new URL('../dist/',import.meta.url));for(const f of files){assert.doesNotMatch(f,/(^\.env|\.(?:pem|key|p12|pfx)$)/i);if(/\.(?:js|html|css|json)$/.test(f)){const content=await readFile(new URL('../dist/'+f,import.meta.url),'utf8');assert.doesNotMatch(content,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}\b/);}}
 const css=await readFile(new URL('../dist/style.css',import.meta.url),'utf8');assert.doesNotMatch(css,/@import|https?:\/\//);
});
test('deployment actions are pinned and write permission is isolated from source execution',async()=>{
 const workflow=await readFile(new URL('../.github/workflows/deploy-pages.yml',import.meta.url),'utf8');const actions=[...workflow.matchAll(/uses:\s*(\S+)/g)];assert.equal(actions.length,5);for(const [,action] of actions)assert.match(action,/@[a-f0-9]{40}$/);assert.match(workflow,/persist-credentials: false/);assert.match(workflow,/needs: verify/);const verify=workflow.split('  verify:')[1].split('  deploy:')[0];assert.doesNotMatch(verify,/pages: write|id-token: write/);assert.doesNotMatch(workflow,/pull_request_target|secrets\./);
});
