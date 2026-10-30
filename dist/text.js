// Decode plain text only. Callers still escape text before putting it into HTML.
const named={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '};
export function decodeHtmlText(value){return String(value).replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp)\b;?/gi,(match,entity)=>{const key=entity.toLowerCase();if(key[0]!=='#')return named[key]??match;const n=key.startsWith('#x')?parseInt(key.slice(2),16):parseInt(key.slice(1),10);return Number.isInteger(n)&&n>0&&n<=0x10ffff&&!(n>=0xd800&&n<=0xdfff)?String.fromCodePoint(n):match;});}
