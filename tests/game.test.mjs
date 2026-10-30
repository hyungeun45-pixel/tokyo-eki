import test from 'node:test';
import assert from 'node:assert/strict';
import {lines} from '../dist/stations.js';
import {accepts,playableStations,accuracy,formatTime} from '../dist/game.js';
import {places} from '../dist/places.js';
test('all nine lines contain complete, unique station numbers and three languages',()=>{
 assert.equal(lines.length,9);
 const counts={G:19,M:28,H:22,T:23,C:20,Y:24,Z:14,N:19,F:16};
 for(const l of lines){assert.equal(l.stations.length,counts[l.id],l.id);assert.equal(new Set(l.stations.map(s=>s.code)).size,l.stations.length);for(const s of l.stations)for(const k of ['ko','en','ja'])assert.ok(s[k]?.trim(),`${s.code} ${k}`);}
});
test('every official station name is accepted in each of three languages',()=>{
 for(const l of lines)for(const s of l.stations)for(const lang of ['ko','en','ja'])assert.equal(accepts(s,s[lang]),true,`${s.code} ${lang}`);
});
test('formatting and common alternative spellings are accepted without accepting wrong stations',()=>{
 const g=lines.find(l=>l.id==='G'),a=g.stations.at(-1),shimbashi=g.stations.find(s=>s.id==='shimbashi');
 for(const value of ['ASAKUSA','  Asa kusa  ','아사쿠사역','浅草駅','あさくさ','アサクサ'])assert.ok(accepts(a,value),value);
 assert.ok(accepts(shimbashi,'Shinbashi'));assert.ok(!accepts(a,'시부야'));assert.ok(!accepts(a,''));assert.ok(!accepts(a,'G19'));
});
test('Marunouchi branch is not incorrectly inserted into the main line',()=>{
 const m=lines.find(l=>l.id==='M');const main=playableStations(m),branch=playableStations(m,true);
 assert.equal(main.length,25);assert.deepEqual(main.map(s=>s.code),Array.from({length:25},(_,i)=>`M${String(i+1).padStart(2,'0')}`));
 assert.deepEqual(branch.map(s=>s.code),['m03','m04','m05','M06']);
});
test('Chiyoda contains the shared Kokkai-gijidomae station in the correct position',()=>{
 assert.deepEqual(lines.find(l=>l.id==='C').stations.map(s=>s.code),Array.from({length:20},(_,i)=>`C${String(i+1).padStart(2,'0')}`));
});
test('Ginza has curated neighborhood information at every stop',()=>{
 for(const s of lines.find(l=>l.id==='G').stations)assert.ok(places[s.id]||(s.id==='gaiemmae'&&places.gaienmae),s.id);
});
test('game statistics handle initial state and mistakes',()=>{assert.equal(accuracy(0,0),100);assert.equal(accuracy(2,3),67);assert.equal(formatTime(125),'02:05');});
