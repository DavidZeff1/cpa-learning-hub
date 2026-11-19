'use strict';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// labs.js and drills.js only touch the DOM inside a `typeof document` guard, so they load in a bare context.
function load() {
  const ctx = vm.createContext({});
  for (const name of ['content.js','curriculum.js','principles-depth.js','labs.js','drills.js'])
    vm.runInContext(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),ctx,{filename:name});
  return ctx;
}
const ctx = load();
const run = expression => vm.runInContext(expression, ctx);

test('depreciation methods all reach residual value and depreciate the same total', () => {
  for (const method of ['sl','ddb','uop']) for (const pattern of ['even','front','back']) for (const life of [2,5,10]) {
    const rows = run(`depreciationSchedule(50000, 5000, ${life}, '${method}', '${pattern}')`);
    assert.equal(rows.length, life);
    assert.equal(rows[rows.length-1].book, 5000, `${method}/${pattern}/${life}`);
    assert.ok(rows.every(r => r.book >= 5000 && r.expense >= 0), `${method} never drops below residual`);
  }
  const ddb = run(`depreciationSchedule(50000, 5000, 5, 'ddb')`);
  assert.equal(ddb[0].expense, 20000);
  assert.equal(ddb[1].expense, 12000);
});

test('bond pricing matches present value and amortizes to face', () => {
  const discount = run('bondSchedule(100000, 6, 8, 5, 1)');
  assert.equal(discount.price, 92014.58);
  assert.equal(discount.rows[0].interest, 7361.17);
  assert.equal(discount.rows.at(-1).carrying, 100000);
  const premium = run('bondSchedule(100000, 10, 8, 10, 2)');
  assert.ok(premium.price > 100000);
  assert.equal(premium.rows.length, 20);
  assert.equal(premium.rows.at(-1).carrying, 100000);
  assert.equal(run('bondSchedule(50000, 7, 7, 3, 1)').price, 50000);
});

test('installment notes are fully repaid', () => {
  const {payment, rows} = run('installmentSchedule(50000, 7, 5)');
  assert.equal(payment, 12194.53);
  assert.equal(rows.at(-1).balance, 0);
});

test('inventory cost flows split goods available between COGS and ending inventory', () => {
  const layers = '[{units:100,cost:10},{units:150,cost:12},{units:200,cost:13},{units:50,cost:15}]';
  const fifo = run(`inventoryCost(${layers}, 380, 'fifo')`), lifo = run(`inventoryCost(${layers}, 380, 'lifo')`), avg = run(`inventoryCost(${layers}, 380, 'avg')`);
  assert.equal(fifo.cogs, 4490); assert.equal(fifo.ending, 1660);
  assert.equal(lifo.cogs, 4910); assert.equal(lifo.ending, 1240);
  for (const r of [fifo, lifo, avg]) assert.equal(Math.round(r.cogs + r.ending), 6150);
});

test('bank reconciliations always reconcile when every item is placed correctly', () => {
  for (let i = 0; i < 200; i++) {
    const s = run('bankrecGenerate()');
    const effect = (prefix, base) => s.items.filter(x => x.side.startsWith(prefix)).reduce((t, x) => t + (x.side.endsWith('+') ? x.amt : -x.amt), base);
    assert.equal(effect('bank', s.bank), s.trueCash);
    assert.equal(effect('book', s.book), s.trueCash);
    assert.ok(s.items.every(x => x.amt > 0));
  }
});

test('every lab renders for its starting state, and lab lessons exist', () => {
  const ids = new Set(run('expandPrinciplesDepth(expandCurriculum(starterWorkspace()))').courses.flatMap(c => c.topics.map(t => t.id)));
  for (const [topic, key] of Object.entries(run('labTopics'))) {
    assert.ok(ids.has(topic), `${topic} is not a lesson`);
    const html = run(`labBlock(${JSON.stringify(topic)})`);
    assert.match(html, /class="lab"/, key);
    assert.doesNotMatch(html, /NaN|undefined/, key);
  }
});

test('generated journal entries balance and use accounts the learner can pick', () => {
  const names = new Set(run('drillAccounts').map(a => a[0]));
  const count = run('drillEntries.length');
  for (let k = 0; k < count; k++) for (let n = 0; n < 30; n++) {
    const e = run(`drillEntries[${k}]()`);
    const dr = e.lines.filter(l => l[1] === 'Dr').reduce((t, l) => t + l[2], 0);
    const cr = e.lines.filter(l => l[1] === 'Cr').reduce((t, l) => t + l[2], 0);
    assert.ok(Math.abs(dr - cr) < 0.005, e.text);
    assert.ok(e.lines.every(l => names.has(l[0]) && l[2] > 0), e.text);
    assert.doesNotMatch(e.text + e.why, /NaN|undefined/);
  }
});

test('calculation drills produce finite answers with worked steps', () => {
  const ids = run('drillCalcs.map(g => g.id)');
  for (const id of ids) for (let n = 0; n < 50; n++) {
    const item = run(`drillCalcs.find(g => g.id === ${JSON.stringify(id)}).make()`);
    assert.ok(Number.isFinite(item.answer), id);
    assert.ok(item.steps.length >= 1, id);
    assert.doesNotMatch(item.prompt + item.steps.join(' '), /NaN|undefined/, id);
  }
});

test('lesson text formatting escapes HTML and highlights equations', () => {
  const html = run(`formatReading('Intro <b>.\\n\\nAssets = Liabilities + Equity\\n\\nEnd.')`);
  assert.match(html, /&lt;b&gt;/);
  assert.match(html, /<p class="formula">Assets = Liabilities \+ Equity<\/p>/);
});
