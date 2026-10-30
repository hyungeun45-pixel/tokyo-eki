import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanStationName} from '../scripts/station-text.mjs';
import {lines} from '../dist/stations.js';
import {accepts} from '../dist/game.js';
import {decodeHtmlText} from '../dist/text.js';
import {countTypingUnits} from '../dist/speed.js';
test('official HTML entities and missing closing semicolons become readable station names',()=>{
 assert.equal(cleanStationName('오시아게 &lt;스카이트리앞&gt;'),'오시아게 〈스카이트리앞〉');assert.equal(cleanStationName('Nijubashimae &lt;Marunouchi&gt'),'Nijubashimae 〈Marunouchi〉');assert.equal(cleanStationName('<span>메이지진구마에</span> &#x3008;하라주쿠&#x3009;'),'메이지진구마에 〈하라주쿠〉');assert.equal(decodeHtmlText('&#x110000;'),'&#x110000;');
});
test('all station display names are free of undecoded HTML entities',()=>{
 for(const line of lines)for(const station of line.stations)for(const lang of ['ko','en','ja'])assert.doesNotMatch(station[lang],/&(?:lt|gt|amp|quot|apos|nbsp|#\w+);?/i,`${station.code} ${lang}`);
});
test('Oshiage accepts short, full, Japanese, English and copied encoded names',()=>{
 const s=lines.find(l=>l.id==='Z').stations.find(s=>s.id==='oshiage');assert.equal(s.ko,'오시아게 〈스카이트리앞〉');for(const v of ['오시아게','오시아게 <스카이트리앞>','오시아게 (스카이트리 앞)','오시아게 〈스카이트리앞〉','오시아게 &lt;스카이트리앞&gt;','Oshiage','Oshiage <SKYTREE>','押上','押上〈スカイツリー前〉'])assert.ok(accepts(s,v),v);
 assert.equal(countTypingUnits('오시아게 &lt;스카이트리앞&gt;'),countTypingUnits('오시아게 〈스카이트리앞〉'));
});
