import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const cutoff = Date.parse('2026-11-24T03:00:00Z');
let now = cutoff - 1;
const nodes = {};
const events = {};
for (const id of ['confirm','rsvp-status','share','share-status','copy-fallback','share-link']) {
  nodes[id] = {hidden:true, addEventListener(type, fn){this[type]=fn;}, removeAttribute(name){delete this[name];}, focus(){}, select(){}};
}
let tick;
let copied;
const context = vm.createContext({Date:{parse:Date.parse, now:()=>now},
  document:{getElementById:id=>nodes[id],addEventListener:(name,fn)=>events[name]=fn},
  window:{addEventListener:(name,fn)=>events[name]=fn},
  navigator:{clipboard:{writeText:async text=>copied=text}},
  setInterval:fn=>tick=fn});
vm.runInContext(source, context);
assert.equal(nodes.confirm.hidden,false);
assert.match(nodes.confirm.href,/forms.gle/);
now = cutoff;
tick();
assert.equal(nodes.confirm.hidden,true);
assert.equal(nodes.confirm.href,undefined);
assert.match(nodes['rsvp-status'].innerHTML,/encerrado/);
now = cutoff-1000; events.pageshow();
assert.equal(nodes.confirm.hidden,false);
now = cutoff+1000;
let prevented=false;
nodes.confirm.click({preventDefault(){prevented=true;}});
assert.equal(prevented,true);
await nodes.share.click();
assert.equal(copied,'https://gabrielaccorsi.github.io/convite-laura/');
context.navigator.clipboard.writeText=async()=>{throw Error('denied');};
await nodes.share.click();
assert.equal(nodes['copy-fallback'].hidden,false);
let shared;
context.navigator.share=async data=>shared=data;
await nodes.share.click();
assert.equal(shared.url,copied);
assert.doesNotMatch(shared.text,/Confirme/);
console.log('OK: limite exato, virada automática, retorno à página, clique após prazo, Web Share e duas alternativas de cópia. TZ='+process.env.TZ);
