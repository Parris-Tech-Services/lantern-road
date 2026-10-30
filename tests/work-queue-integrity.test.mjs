import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {duplicateKeys, validateQueue} from '../scripts/validate-work-queue.mjs';

const valid = {
  schema_version:1,
  status_values:['READY','DONE'],
  tasks:[
    {id:'LR-0001',title:'First',status:'DONE',depends_on:[]},
    {id:'LR-0002',title:'Second',status:'READY',depends_on:['LR-0001']}
  ]
};

test('real team work queue parses with no duplicate keys or dangling tasks',()=>{
  const text=fs.readFileSync(new URL('../.agent-coordination/WORK-QUEUE.json',import.meta.url),'utf8');
  const report=validateQueue(text);
  assert.ok(report.tasks>=100);
  assert.deepEqual(duplicateKeys(text),[]);
});

test('well-formed JSON with repeated task notes is rejected',()=>{
  const duplicate='{"schema_version":1,"status_values":["READY"],"tasks":[{"id":"LR-0001","title":"First","notes":"old","notes":"overwritten","status":"READY","depends_on":[]}]}';
  assert.deepEqual(duplicateKeys(duplicate),['/tasks/0/notes']);
  assert.throws(()=>validateQueue(duplicate),/Duplicate JSON fields/);
});

test('malformed separators and repeated root metadata fail closed',()=>{
  const bad='{"schema_version":1 "status_values":["READY"],"tasks":[]}';
  assert.throws(()=>validateQueue(bad),SyntaxError);
  const repeated='{"schema_version":1,"schema_version":1,"status_values":["READY"],"tasks":[]}';
  assert.throws(()=>validateQueue(repeated),/Duplicate JSON fields/);
});

test('missing dependencies, duplicate task IDs, unknown statuses are refused',()=>{
  const badDeps=structuredClone(valid);
  badDeps.tasks[1].depends_on=['LR-9999'];
  assert.throws(()=>validateQueue(JSON.stringify(badDeps)),/Unresolved/);
  const badId=structuredClone(valid);
  badId.tasks[1].id=badId.tasks[0].id;
  assert.throws(()=>validateQueue(JSON.stringify(badId)),/duplicate/);
  const badStatus=structuredClone(valid);
  badStatus.tasks[1].status='COMPLETED';
  assert.throws(()=>validateQueue(JSON.stringify(badStatus)),/Invalid/);
});
