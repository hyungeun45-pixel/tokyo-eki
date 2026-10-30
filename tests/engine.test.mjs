import test from 'node:test';
import assert from 'node:assert/strict';
import {Run,deleteBackward,typingProgress,sanitizeSettings} from '../dist/engine.js';
import {lines} from '../dist/stations.js';
import {pointsFor,pointAt} from '../dist/map.js';
const stations=[...lines[0].stations].reverse().slice(0,3);
test('a run only advances on correct input and prevents repeated departures during travel',()=>{
 const run=new Run(stations);assert.equal(run.submit('아사쿠사').type,'ignored');run.start();assert.equal(run.submit('긴자').type,'wrong');assert.equal(run.index,0);assert.equal(run.submit('浅草').type,'correct');assert.equal(run.index,1);assert.equal(run.accuracy,50);run.moving=true;assert.equal(run.submit(stations[1].en).type,'ignored');assert.equal(run.index,1);run.moving=false;run.submit(stations[1].en);const result=run.submit(stations[2].ko);assert.ok(result.complete);assert.equal(run.progress,1);assert.equal(run.status,'done');assert.equal(run.submit('아사쿠사').type,'ignored');
});
test('settings and exit dialogs can pause time without consuming time attack budget',()=>{
 let now=0;const run=new Run(stations,'time',()=>now);run.start();now=30000;run.pause();now=90000;assert.equal(run.elapsed(),30);assert.equal(run.remaining(),90);assert.equal(run.submit('아사쿠사').type,'ignored');run.resume();now=100000;assert.equal(run.elapsed(),40);assert.equal(run.remaining(),80);now=180001;assert.equal(run.submit('아사쿠사').type,'timeout');assert.equal(run.index,0);assert.equal(run.status,'done');
});
test('typing progress follows matching Korean, English and Japanese text without rewarding unrelated input',()=>{
 assert.equal(typingProgress(stations[0],'ASAKUSA'),1);assert.equal(typingProgress(stations[0],'浅'),.5);assert.equal(typingProgress(stations[0],'아사'),2/4);assert.equal(typingProgress(stations[0],'시부야'),0);assert.equal(typingProgress(stations[0],''),0);
});
test('jamo and full character deletion support compounds, selections and Unicode',()=>{
 assert.deepEqual(deleteBackward('한',1),{value:'하',caret:1});assert.equal(deleteBackward('하',1).value,'ㅎ');assert.equal(deleteBackward('한',1,1,'letter').value,'');assert.equal(deleteBackward('닭',1).value,'달');assert.equal(deleteBackward('과',1).value,'고');assert.equal(deleteBackward('괘',1).value,'과');assert.equal(deleteBackward('가나다',1,2).value,'가다');assert.deepEqual(deleteBackward('도쿄🚇',4,4,'letter'),{value:'도쿄',caret:2});assert.equal(deleteBackward('',0).value,'');
});
test('invalid persisted settings cannot set arbitrary themes, URLs or invalid numbers',()=>{
 const s=sanitizeSettings({theme:'<script>',zoom:Infinity,sound:'false',volume:-200,skin:'https://evil.example'});assert.equal(s.theme,'dark');assert.equal(s.zoom,150);assert.equal(s.sound,true);assert.equal(s.volume,0);assert.equal(s.skin,'garden');assert.equal(sanitizeSettings(null).departure,'manual');assert.equal(sanitizeSettings({zoom:999}).zoom,250);
});
test('all route points and fractional train positions are finite and stay on their segment',()=>{
 for(const line of lines){const pts=pointsFor(line.stations);assert.equal(pts.length,line.stations.length);for(const p of pts)assert.ok(p.every(Number.isFinite));for(let i=0;i<pts.length-1;i++){const p=pointAt(pts,i+.5);assert.equal(p[0],(pts[i][0]+pts[i+1][0])/2);assert.equal(p[1],(pts[i][1]+pts[i+1][1])/2);}}
});
