import {sanitizeSettings} from './engine.js';
export function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const allowedHosts=['www.gotokyo.org','gotokyo.org','www.japan.travel','japan.travel','www.tokyometro.jp','metrotyping.kr','docs.github.com'];
export function safeExternalUrl(raw){try{const url=new URL(raw);if(url.protocol==='https:'&&allowedHosts.includes(url.hostname)&&!url.username&&!url.password)return url.href;}catch{}return 'https://www.gotokyo.org/kr/';}
export function sanitizeJournal(raw,stationIds){
 const data=raw&&typeof raw==='object'?raw:{};
 const visited=[...new Set(Array.isArray(data.visited)?data.visited.filter(id=>typeof id==='string'&&stationIds.has(id)):[])].slice(0,200);
 const records=(Array.isArray(data.records)?data.records:[]).filter(r=>r&&typeof r==='object'&&typeof r.line==='string'&&r.line.length<=30&&['travel','memory','time'].includes(r.mode)&&Number.isFinite(r.seconds)&&r.seconds>=0&&r.seconds<86400&&Number.isFinite(r.accuracy)&&r.accuracy>=0&&r.accuracy<=100&&typeof r.date==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(r.date)&&!Number.isNaN(Date.parse(r.date))).slice(0,30).map(r=>({line:r.line,mode:r.mode,seconds:r.seconds,accuracy:r.accuracy,date:r.date.slice(0,30),hints:Number.isInteger(r.hints)?Math.max(0,Math.min(1000,r.hints)):0,branch:r.branch===true,from:typeof r.from==='string'?r.from.slice(0,50):'',to:typeof r.to==='string'?r.to.slice(0,50):''}));
 return {visited,records};
}
export function readStored(key,fallback){try{const text=localStorage.getItem(key);return text&&text.length<100000?JSON.parse(text):fallback;}catch{return fallback;}}
export function saveStored(key,data){try{localStorage.setItem(key,JSON.stringify(data));return true;}catch{return false;}}
export function readSettings(){return sanitizeSettings(readStored('tokyo-eki-settings-v2',{}));}
