'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function load() {
  const ctx = vm.createContext({});
  for (const name of ['content.js','curriculum.js','principles-depth.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),ctx,{filename:name});
  }
  return ctx;
}
const evaluate = (ctx,expression) => vm.runInContext(expression,ctx);

test('AC 297P starts with fourteen syllabus-area chapters and 71 questions',()=>{
  const ctx=load();
  const workspace=evaluate(ctx,'expandPrinciplesDepth(starterWorkspace())');
  const course=workspace.courses.find(c=>c.id==='ac-297p');
  const chapters=evaluate(ctx,'principlesChapters');
  assert.equal(chapters.length,14);
  assert.equal(course.topics.length,71);
  assert.equal(new Set(course.topics.map(t=>t.id)).size,71);
  assert.deepEqual(chapters.map(ch=>ch.title).join('|'),
    ['Welcome to the World of Accounting','Information Processing','Income Measurement',
     'The Reporting Cycle','Special Issues for Merchants','Cash and Highly-Liquid Investments',
     'Accounts Receivable','Inventory','Long-Term Investments','Property, Plant and Equipment',
     'Advanced PP&E, Natural Resources and Intangibles','Current Liabilities and Employer Obligations',
     'Long-Term Obligations','Corporate Equity Accounting'].join('|'));
  for (const t of course.topics) {
    assert.ok(chapters.some(ch=>ch.id===t.chapter), t.title+' has an unknown chapter');
    assert.equal(t.choices.length,3,t.title);
    assert.ok(t.correct>=0 && t.correct<3,t.title);
    assert.ok(t.question && t.explanation && t.prompt && t.answer,t.title);
    if(t.origin==='depth-1') assert.ok(t.worked && t.pitfall,t.title);
  }
});

test('upgrading twice does not duplicate chapters, topics or answers',()=>{
  const ctx=load(), workspace=evaluate(ctx,'starterWorkspace()');
  ctx.workspace=workspace;
  evaluate(ctx,'expandPrinciplesDepth(workspace)');
  const first=workspace.courses.find(c=>c.id==='ac-297p');
  assert.equal(first.topics.length,71);
  first.topics[0].attempts=3;first.topics[0].hits=2;first.topics[0].done=true;
  evaluate(ctx,'expandPrinciplesDepth(workspace)');
  assert.equal(first.topics.length,71);
  assert.equal(first.topics[0].attempts,3);
  assert.equal(first.topics[0].hits,2);
  assert.equal(first.topics[0].done,true);
});

test('all four mock sets cover the question bank without duplicates',()=>{
  const ctx=load(),workspace=evaluate(ctx,'expandPrinciplesDepth(starterWorkspace())');
  const topics=workspace.courses.find(c=>c.id==='ac-297p').topics.filter(t=>t.question);
  const examSets=[0,1,2,3].map(i=>topics.filter((t,index)=>index%4===i));
  assert.ok(examSets.every(set=>set.length>=17 && set.length<=18));
  const combined=examSets.flat().map(t=>t.id);
  assert.equal(combined.length,topics.length);
  assert.equal(new Set(combined).size,topics.length);
});

test('cash-flow material lives in AC 298P',()=>{
  const ctx=load(),workspace=evaluate(ctx,'expandPrinciplesDepth(starterWorkspace())');
  const one=workspace.courses.find(c=>c.id==='ac-297p');
  const two=workspace.courses.find(c=>c.id==='ac-298p');
  for(const title of ['Operating cash flows indirect method','Investing and financing cash flows']) {
    assert.equal(one.topics.some(t=>t.title===title),false);
    assert.equal(two.topics.filter(t=>t.title===title).length,1);
  }
});
