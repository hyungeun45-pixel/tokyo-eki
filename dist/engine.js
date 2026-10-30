import {accepts,normalize} from './game.js';
export const defaults=Object.freeze({theme:'dark',movement:'dynamic',departure:'manual',backspace:'jamo',sound:true,volume:35,skin:'garden',landmarks:true,labels:true,follow:true,zoom:150,language:'ko',layer:'all',countdown:3});
export function sanitizeSettings(raw={}){
 raw=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const s={...defaults};
 for(const [key,values] of Object.entries({theme:['dark','light'],movement:['classic','dynamic'],departure:['manual','auto'],backspace:['jamo','letter'],skin:['garden','blueprint'],language:['ko','en','ja'],layer:['all','sight','food']}))if(values.includes(raw[key]))s[key]=raw[key];
 for(const key of ['sound','landmarks','labels','follow'])if(typeof raw[key]==='boolean')s[key]=raw[key];
 for(const [key,min,max] of [['volume',0,100],['zoom',75,250],['countdown',3,5]])if(Number.isFinite(raw[key]))s[key]=Math.min(max,Math.max(min,Math.round(raw[key])));
 return s;
}
export class Run {
 constructor(stations,mode='travel',now=()=>performance.now()){this.stations=stations;this.mode=mode;this.now=now;this.status='ready';this.index=0;this.correct=0;this.attempts=0;this.hints=0;this.duration=0;this.deadline=120;this.moving=false;}
 start(){if(this.status!=='ready')return false;this.status='running';this.started=this.now();return true;}
 elapsed(){return this.status==='running'?this.duration+(this.now()-this.started)/1000:this.duration;}
 expired(){return this.mode==='time'&&this.elapsed()>=this.deadline;}
 remaining(){return Math.max(0,this.deadline-this.elapsed());}
 pause(){if(this.status!=='running')return;this.duration=this.elapsed();this.status='paused';}
 resume(){if(this.status!=='paused')return;this.started=this.now();this.status='running';}
 stop(){if(this.status==='running')this.duration=this.elapsed();this.status='done';}
 submit(value){
  if(this.status!=='running'||this.moving)return {type:'ignored'};
  if(this.expired()){this.stop();return {type:'timeout'};}
  if(!normalize(value))return {type:'empty'};
  this.attempts++;
  if(!accepts(this.stations[this.index],value))return {type:'wrong'};
  const station=this.stations[this.index++];this.correct++;
  const complete=this.index===this.stations.length;
  if(complete)this.stop();
  return {type:'correct',station,complete,position:this.index-1};
 }
 get accuracy(){return this.attempts?Math.round(this.correct/this.attempts*100):100;}
 get progress(){return this.index/this.stations.length;}
}
export function typingProgress(station,value){
 const input=normalize(value);if(!input||!station)return 0;
 if(accepts(station,value))return 1;
 return Math.max(0,...[station.ko,station.en,station.ja,station.id].map(name=>{const n=normalize(name);let i=0;while(i<input.length&&i<n.length&&input[i]===n[i])i++;return i/n.length;}));
}
const initials=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const partialFinal={2:1,3:1,5:4,6:4,9:8,10:8,11:8,12:8,13:8,14:8,15:8,18:17,20:19};
const partialVowel={1:0,3:2,5:4,7:6,9:8,10:9,11:8,14:13,15:14,16:13,19:18};
export function deleteBackward(value,start,end=start,mode='jamo'){
 if(start!==end)return {value:value.slice(0,start)+value.slice(end),caret:start};
 if(start<=0)return {value,caret:0};
 const before=[...value.slice(0,start)],last=before.pop(),cp=last.codePointAt(0);let replacement='';
 if(mode==='jamo'&&cp>=0xac00&&cp<=0xd7a3){const offset=cp-0xac00,lead=Math.floor(offset/588),vowel=Math.floor(offset%588/28),tail=offset%28;
  if(tail)replacement=String.fromCodePoint(0xac00+lead*588+vowel*28+(partialFinal[tail]??0));
  else if(partialVowel[vowel]!==undefined)replacement=String.fromCodePoint(0xac00+lead*588+partialVowel[vowel]*28);
  else replacement=initials[lead];
 }
 const prefix=before.join('')+replacement;return {value:prefix+value.slice(end),caret:prefix.length};
}
