import {decodeHtmlText} from '../dist/text.js';
export function cleanStationName(html){return decodeHtmlText(String(html).replace(/<[^>]*>/g,'')).replace(/</g,'〈').replace(/>/g,'〉').replace(/\s+/g,' ').trim();}
