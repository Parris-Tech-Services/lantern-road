#!/usr/bin/env node
// Fail-closed validator for the shared agent work queue.
// Detects valid-JSON-but-duplicated fields too: JSON.parse alone silently
// accepts two "notes" or "updated_at" keys and discards the older value.
import fs from 'node:fs';
import path from 'node:path';

export function duplicateKeys(source) {
  JSON.parse(source); // First reject malformed JSON, including broken separators.
  let i=0;
  const found=[];
  const whitespace=()=>{while(i<source.length && /\s/.test(source[i])) i++};
  function readString() {
    const start=i++;
    while(i<source.length) {
      if(source[i]==='\\') {i+=2;continue}
      if(source[i++]==='"')break;
    }
    return JSON.parse(source.slice(start,i));
  }
  function scan(at) {
    whitespace();
    if(source[i]==='{'){
      i++;whitespace();
      const keys=new Set();
      while(source[i]!=='}'){
        const key=readString();
        if(keys.has(key))found.push(at+'/'+key);
        keys.add(key);
        whitespace();i++; // validated ':' by JSON.parse above
        scan(at+'/'+key);
        whitespace();if(source[i]===','){i++;whitespace()}else break;
      }
      i++;return;
    }
    if(source[i]==='['){
      i++;whitespace();let offset=0;
      while(source[i]!==']'){
        scan(at+'/'+offset++);
        whitespace();if(source[i]===','){i++;whitespace()}else break;
      }
      i++;return;
    }
    if(source[i]==='"'){readString();return}
    while(i<source.length&&!/[\s,\]}]/.test(source[i]))i++;
  }
  scan('');whitespace();
  if(i!==source.length)throw Error('Queue parser did not consume all JSON');
  return found;
}

export function validateQueue(source) {
  const repeats=duplicateKeys(source);
  if(repeats.length)throw Error('Duplicate JSON fields: '+repeats.slice(0,10).join(', '));
  const queue=JSON.parse(source);
  if(queue.schema_version!==1||!Array.isArray(queue.tasks)||queue.tasks.length===0||
     !Array.isArray(queue.status_values)||!queue.status_values.length)
    throw Error('Invalid agent work queue schema');
  const ids=new Set(),statuses=new Set(queue.status_values);
  for(const entry of queue.tasks) {
    if(!entry||typeof entry!=='object'||!/^LR-[0-9]{4}$/.test(entry.id||'')||
       ids.has(entry.id)||typeof entry.title!=='string'||!entry.title.trim()||
       !statuses.has(entry.status)||!Array.isArray(entry.depends_on))
      throw Error('Invalid, duplicate or incomplete work item: '+(entry?.id||'?'));
    ids.add(entry.id);
  }
  for(const entry of queue.tasks) {
    for(const dep of entry.depends_on) {
      if(!ids.has(dep)||dep===entry.id)throw Error('Unresolved or circular self-dependency '+entry.id+' -> '+dep);
    }
  }
  return {tasks:queue.tasks.length,validStatuses:statuses.size,duplicateKeys:0};
}

if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)){
  const file=process.argv[2]||'.agent-coordination/WORK-QUEUE.json';
  try{
    const result=validateQueue(fs.readFileSync(file,'utf8'));
    console.log('Agent queue integrity PASS:',JSON.stringify(result));
  }catch(e){console.error('Agent queue integrity FAIL:',e.message);process.exitCode=1}
}
