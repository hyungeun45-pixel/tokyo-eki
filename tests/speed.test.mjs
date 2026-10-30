import test from 'node:test';
import assert from 'node:assert/strict';
import {countTypingUnits,matchingTypingUnits,calculateCpm,speedSnapshot} from '../dist/speed.js';
import {Run} from '../dist/engine.js';
import {lines} from '../dist/stations.js';
const stations=[...lines[0].stations].reverse().slice(0,3);
test('Korean counts standard two-set keystrokes, not composed string length',()=>{
 assert.equal(countTypingUnits('한'),3);assert.equal(countTypingUnits('한글'),6);assert.equal(countTypingUnits('아사쿠사'),8);assert.equal(countTypingUnits('우에노히로코지'),14);assert.equal(countTypingUnits('과'),3);assert.equal(countTypingUnits('괜'),4);assert.equal(countTypingUnits('닭'),4);assert.equal(countTypingUnits('까'),2);assert.equal(countTypingUnits('ㅘ'),2);assert.equal(countTypingUnits('한글'.normalize('NFD')),6);
});
test('English and Japanese use their own committed characters; ignored spacing does not inflate speed',()=>{
 assert.equal(countTypingUnits('Asakusa'),7);assert.equal(countTypingUnits('Ueno-hirokoji'),12);assert.equal(countTypingUnits('우에노 히로코지'),14);assert.equal(countTypingUnits('稲荷町'),3);assert.equal(countTypingUnits('うえの'),3);assert.equal(countTypingUnits('        '),0);
});
test('live units include matching Hangul composition, English and Japanese prefixes only',()=>{
 assert.equal(matchingTypingUnits(stations[0],'ㅇ'),1);assert.equal(matchingTypingUnits(stations[0],'아'),2);assert.equal(matchingTypingUnits(stations[0],'아ㅅ'),3);assert.equal(matchingTypingUnits(stations[0],'아사'),4);assert.equal(matchingTypingUnits(stations[0],'아사쿠사'),8);assert.equal(matchingTypingUnits(stations[0],'아타'),2);assert.equal(matchingTypingUnits(stations[0],'시부야'),0);assert.equal(matchingTypingUnits(stations[0],'Asa'),3);assert.equal(matchingTypingUnits(stations[0],'あさ'),2);
});
test('CPM equals correct units divided by elapsed active minutes, without a startup spike',()=>{
 assert.equal(calculateCpm(120,60),120);assert.equal(calculateCpm(20,5),240);assert.equal(calculateCpm(8,2),240);assert.equal(calculateCpm(8,0),0);assert.equal(calculateCpm(8,.5),0);assert.equal(calculateCpm(8,NaN),0);
});
test('compositions and backspaces are recomputed and submitting a station never counts it twice',()=>{
 let now=0;const run=new Run(stations,'travel',()=>now);run.start();now=2000;
 assert.deepEqual(speedSnapshot(run,'아사'),{units:4,completedUnits:0,draftUnits:4,cpm:120});assert.equal(speedSnapshot(run,'아').units,2);assert.equal(speedSnapshot(run,'아사쿠사').units,8);run.submit('아사쿠사');assert.equal(speedSnapshot(run,'').units,8);assert.equal(run.units,8);run.submit('wrong');assert.equal(run.units,8);assert.equal(speedSnapshot(run,'다').units,10);assert.equal(speedSnapshot(run,'').units,8);
 run.pause();now=62000;assert.equal(speedSnapshot(run,'').cpm,240);run.resume();now=64000;assert.equal(speedSnapshot(run,'').cpm,120);
});
