import {mkdir,writeFile} from 'node:fs/promises';
import {publicAssets,root} from './assets.mjs';
const assets=await publicAssets(),output=new URL('.pages-output/',root);await mkdir(output,{recursive:true});
for(const [name,asset] of Object.entries(assets))await writeFile(new URL(name,output),asset.body);
console.log(`GitHub Pages ready: ${Object.keys(assets).length} public assets. Server source and hosting metadata excluded.`);
