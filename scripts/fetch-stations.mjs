import { mkdir, writeFile } from 'node:fs/promises';
const definitions = [
 ['G','ginza','긴자선','Ginza Line','#e8a328'],['M','marunouchi','마루노우치선','Marunouchi Line','#e55652'],
 ['H','hibiya','히비야선','Hibiya Line','#8c9ba5'],['T','tozai','도자이선','Tozai Line','#36a7c7'],
 ['C','chiyoda','치요다선','Chiyoda Line','#2c9b77'],['Y','yurakucho','유라쿠초선','Yurakucho Line','#bc9c63'],
 ['Z','hanzomon','한조몬선','Hanzomon Line','#9673bc'],['N','namboku','난보쿠선','Namboku Line','#35a49c'],
 ['F','fukutoshin','후쿠토신선','Fukutoshin Line','#af7858']
];
const clean = s => s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
async function get(slug,lang) {
 const url=`https://www.tokyometro.jp/${lang==='ja'?'':`lang_${lang}/`}station/line_${slug}/index.html`;
 const r=await fetch(url); if(!r.ok) throw Error(`${r.status}: ${url}`);
 const html=await r.text();
 const rows=[...html.matchAll(/<div class="v2_routeStationImg">([\s\S]*?)<\/p>/g)];
 return rows.map(([,s])=>({code:s.match(/alt="([GMHTCYZNFm]\d{2})"/)?.[1],slug:s.match(/href="\.\.\/([^/]+)\/index.html"/)?.[1],name:clean(s.match(/<a [^>]*>([\s\S]*?)<\/a>/)?.[1]||'')})).filter(s=>s.code&&s.slug);
}
const lines=await Promise.all(definitions.map(async ([id,slug,ko,en,color])=>{
 const [kr,english,ja]=await Promise.all(['kr','en','ja'].map(lang=>get(slug,lang)));
 if(!kr.length || kr.length!==english.length || kr.length!==ja.length) throw Error(`Incomplete line ${id}: ${JSON.stringify({kr,english,ja})}`);
 return {id,slug,ko,en,color,stations:kr.map(s=>({id:s.slug,code:s.code,ko:s.name,en:english.find(x=>x.code===s.code)?.name,ja:ja.find(x=>x.code===s.code)?.name}))};
}));
// The official Chiyoda listing omits its C07 link in some language layouts.
const chiyoda=lines.find(l=>l.id==='C');
if(!chiyoda.stations.some(s=>s.code==='C07')){
 const shared=lines.find(l=>l.id==='M').stations.find(s=>s.code==='M14');
 chiyoda.stations.splice(6,0,{...shared,code:'C07'});
}
await mkdir('dist',{recursive:true});
await writeFile('dist/stations.js',`// Official Tokyo Metro station lists, retrieved 2026-10-30. See SOURCES.md.\nexport const lines = ${JSON.stringify(lines,null,2)};\n`);
console.log(lines.map(l=>`${l.id}: ${l.stations.length}`).join('\n'));
