import {accepts,stationAliases} from './game.js';
const leads=[...'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'];
const vowels=[...'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'];
const tails=['',...'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'];
const compounds={'ㅘ':'ㅗㅏ','ㅙ':'ㅗㅐ','ㅚ':'ㅗㅣ','ㅝ':'ㅜㅓ','ㅞ':'ㅜㅔ','ㅟ':'ㅜㅣ','ㅢ':'ㅡㅣ','ㄳ':'ㄱㅅ','ㄵ':'ㄴㅈ','ㄶ':'ㄴㅎ','ㄺ':'ㄹㄱ','ㄻ':'ㄹㅁ','ㄼ':'ㄹㅂ','ㄽ':'ㄹㅅ','ㄾ':'ㄹㅌ','ㄿ':'ㄹㅍ','ㅀ':'ㄹㅎ','ㅄ':'ㅂㅅ'};
const expand=char=>[...(compounds[char]||char)];
// Logical correct keystrokes for standard two-set Korean. Shift is not counted.
// English letters/digits count once; Japanese counts committed characters.
export function typingTokens(value){
 const cleaned=String(value).normalize('NFKC').toLowerCase().replace(/[\s\-‐‑–—・･ー·,.'’()（）〈〉<>]/g,'').replace(/駅$|역$/g,'');
 const tokens=[];for(const char of cleaned){const cp=char.codePointAt(0);
  if(cp>=0xac00&&cp<=0xd7a3){const n=cp-0xac00;tokens.push(...expand(leads[Math.floor(n/588)]),...expand(vowels[Math.floor(n%588/28)]),...expand(tails[n%28]));}
  else if(cp>=0x1100&&cp<=0x1112)tokens.push(...expand(leads[cp-0x1100]));
  else if(cp>=0x1161&&cp<=0x1175)tokens.push(...expand(vowels[cp-0x1161]));
  else if(cp>=0x11a8&&cp<=0x11c2)tokens.push(...expand(tails[cp-0x11a7]));
  else if(/[\p{L}\p{N}]/u.test(char))tokens.push(...expand(char));
 }
 return tokens;
}
export function countTypingUnits(value){return typingTokens(value).length;}
export function matchingTypingUnits(station,value){
 if(!station||!value)return 0;
 const typed=typingTokens(value);if(accepts(station,value))return typed.length;
 return Math.max(0,...stationAliases(station).map(name=>{const expected=typingTokens(name);let i=0;while(i<typed.length&&i<expected.length&&typed[i]===expected[i])i++;return i;}));
}
export function calculateCpm(units,elapsedSeconds){return Number.isFinite(units)&&units>=0&&Number.isFinite(elapsedSeconds)&&elapsedSeconds>=1?Math.round(units*60/elapsedSeconds):0;}
export function speedSnapshot(run,value=''){
 const draft=run.status==='done'?0:matchingTypingUnits(run.stations[run.index],value),units=run.units+draft;
 return {units,completedUnits:run.units,draftUnits:draft,cpm:calculateCpm(units,run.elapsed())};
}
