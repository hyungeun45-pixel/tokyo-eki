import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {publicAssets,securityHeaders,root} from './assets.mjs';
const assets=await publicAssets(),headers=await securityHeaders(),handler=await readFile(new URL('worker/handler.mjs',root),'utf8'),manifest=await readFile(new URL('.openai/hosting.json',root),'utf8');
await mkdir(new URL('dist/server/',root),{recursive:true});await mkdir(new URL('dist/.openai/',root),{recursive:true});
await writeFile(new URL('dist/server/index.js',root),`// Generated from the tracked static game. Never edit this output.\n${handler}\nconst assets=${JSON.stringify(assets)};\nconst securityHeaders=${JSON.stringify(headers)};\nexport default makeHandler(assets,securityHeaders);\n`);
await writeFile(new URL('dist/.openai/hosting.json',root),manifest);
console.log(`Worker ready: ${Object.keys(assets).length} public assets with security response headers.`);
