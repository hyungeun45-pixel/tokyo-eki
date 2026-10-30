import {decodeHtmlText} from './text.js';
export function normalize(value){return decodeHtmlText(value).normalize('NFKC').toLowerCase().replace(/[\s\-‐‑–—・･ー·,.'’()（）〈〉<>]/g,'').replace(/駅$|역$/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
const extraAliases={shimbashi:['shinbashi','しんばし','シンバシ'],nihombashi:['nihonbashi','にほんばし','ニホンバシ'],asakusa:['あさくさ','アサクサ'],shibuya:['しぶや','シブヤ'],ginza:['ぎんざ','ギンザ'],ueno:['うえの','ウエノ'],'meiji-jingumae':['메이지진구마에','Meiji-jingumae','明治神宮前','めいじじんぐうまえ'],'nijubashimae':['니주바시마에','Nijubashimae','二重橋前','にじゅうばしまえ'],oshiage:['오시아게','Oshiage','押上','おしあげ']};
export function stationAliases(station){return [station.ko,station.en,station.ja,station.id,...(station.aliases||[]),...(extraAliases[station.id]||[])];}
export function accepts(station,value){return stationAliases(station).some(s=>normalize(s)===normalize(value)&&normalize(value).length>0);}
export function playableStations(line,branch=false){
 if(line.id==='M'){if(branch)return [...line.stations.filter(s=>s.code.startsWith('m')),line.stations.find(s=>s.code==='M06')];return line.stations.filter(s=>s.code.startsWith('M'));}
 return [...line.stations];
}
export function formatTime(seconds){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
export function accuracy(correct,attempts){return attempts?Math.round(correct/attempts*100):100;}
