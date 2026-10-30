import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
export const root=new URL('../',import.meta.url);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'};
export async function publicAssets(){const dir=new URL('dist/',root),assets={};for(const name of (await readdir(dir)).sort()){const type=types[path.extname(name)];if(!type)continue;assets[name]={type,body:await readFile(new URL(name,dir),'utf8')};}return assets;}
export async function securityHeaders(){const text=await readFile(new URL('dist/_headers',root),'utf8');return Object.fromEntries(text.split(/\r?\n/).filter(line=>/^  [A-Za-z-]+:/.test(line)).map(line=>{const i=line.indexOf(':');return [line.slice(0,i).trim(),line.slice(i+1).trim()];}));}
