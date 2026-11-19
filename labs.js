'use strict';
// Interactive labs: small visual simulations attached to lessons.
// Each lab keeps its state in memory (per browser tab) so re-rendering a page does not reset it.

const LAB_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#6250d6'];
const labEsc = value => String(value).replace(/[&<>"']/g, char =>
  ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const labRound = (n, d=2) => Math.round(n * 10 ** d) / 10 ** d;
function usd(n, digits=0) {
  const v = labRound(n, digits);
  return (v < 0 ? '−' : '') + '$' + Math.abs(v).toLocaleString('en-US', {minimumFractionDigits:digits, maximumFractionDigits:digits});
}
const labNum = n => Number(n).toLocaleString('en-US');
const labFmt = {
  usd: v => usd(v), usd2: v => usd(v, 2), pct: v => v + '%', num: labNum,
  yrs: v => v + (Number(v) === 1 ? ' year' : ' years'), mo: v => v + (Number(v) === 1 ? ' month' : ' months'),
  units: v => labNum(v) + ' units',
  allow: v => v === 0 ? '$0' : usd(Math.abs(v)) + (v > 0 ? ' credit' : ' debit')
};
const labAxisFmt = {
  usd: v => Math.abs(v) >= 10000 ? (v < 0 ? '−' : '') + '$' + labNum(Math.abs(v) / 1000) + 'K' : usd(v),
  num: v => labNum(v), yr: v => 'Yr ' + v, period: v => String(v)
};

// Lesson formatting: paragraphs, with standalone equations shown as formula callouts.
function formatReading(text) {
  return String(text).split(/\n{2,}/).map(part => {
    const p = part.trim();
    if (!p) return '';
    if (/^[A-Z][^.!?]{1,90}=[^.!?]{1,90}$/.test(p)) return `<p class="formula">${labEsc(p)}</p>`;
    return `<p>${labEsc(p).replace(/\n/g, '<br>')}</p>`;
  }).join('');
}

// ---------- Pure calculations (also used by drills and tests) ----------
function depreciationSchedule(cost, salvage, life, method, pattern='even') {
  salvage = Math.min(salvage, cost);
  const base = cost - salvage, rows = [];
  const weights = Array.from({length:life}, (_, i) => pattern === 'front' ? life - i : pattern === 'back' ? i + 1 : 1);
  const wsum = weights.reduce((a, b) => a + b, 0);
  let book = cost;
  for (let year = 1; year <= life; year++) {
    let expense;
    if (method === 'sl') expense = base / life;
    else if (method === 'ddb') expense = year === life ? book - salvage : Math.min(book * 2 / life, Math.max(0, book - salvage));
    else expense = base * weights[year - 1] / wsum;
    expense = labRound(expense);
    book = labRound(book - expense);
    rows.push({year, expense, accumulated:labRound(cost - book), book});
  }
  return rows;
}

function bondSchedule(face, couponPct, marketPct, years, freq=1) {
  const n = years * freq, i = marketPct / 100 / freq, cash = labRound(face * couponPct / 100 / freq);
  const price = labRound(i === 0 ? cash * n + face : cash * (1 - (1 + i) ** -n) / i + face * (1 + i) ** -n);
  const rows = [];
  let carrying = price;
  for (let k = 1; k <= n; k++) {
    let interest = labRound(carrying * i), amort = labRound(interest - cash);
    if (k === n) { amort = labRound(face - carrying); interest = labRound(cash + amort); }
    carrying = labRound(carrying + amort);
    rows.push({period:k, cash, interest, amort, carrying});
  }
  return {price, rows, cash};
}

function installmentSchedule(principal, ratePct, years) {
  const r = ratePct / 100;
  const payment = labRound(r === 0 ? principal / years : principal * r / (1 - (1 + r) ** -years));
  const rows = [];
  let balance = principal;
  for (let k = 1; k <= years; k++) {
    const interest = labRound(balance * r);
    let reduction = labRound(payment - interest), paid = payment;
    if (k === years) { reduction = labRound(balance); paid = labRound(reduction + interest); }
    balance = labRound(balance - reduction);
    rows.push({period:k, payment:paid, interest, reduction, balance});
  }
  return {payment, rows};
}

function inventoryCost(layers, sold, method) {
  const totalUnits = layers.reduce((s, l) => s + l.units, 0);
  const totalCost = layers.reduce((s, l) => s + l.units * l.cost, 0);
  sold = Math.max(0, Math.min(sold, totalUnits));
  if (method === 'avg') {
    const avg = totalUnits ? totalCost / totalUnits : 0;
    const cogs = labRound(sold * avg);
    return {cogs, ending:labRound(totalCost - cogs), avg, sold, totalUnits, totalCost, cogsPieces:[], endPieces:[]};
  }
  const order = layers.map((l, index) => ({...l, index}));
  if (method === 'lifo') order.reverse();
  let left = sold;
  const cogsPieces = [], endPieces = [];
  for (const l of order) {
    const take = Math.min(left, l.units);
    left -= take;
    if (take) cogsPieces.push({index:l.index, units:take, cost:l.cost});
    if (l.units - take) endPieces.push({index:l.index, units:l.units - take, cost:l.cost});
  }
  const sum = pieces => labRound(pieces.reduce((s, p) => s + p.units * p.cost, 0));
  const byLayer = (a, b) => a.index - b.index;
  return {cogs:sum(cogsPieces), ending:sum(endPieces), sold, totalUnits, totalCost,
    cogsPieces:cogsPieces.sort(byLayer), endPieces:endPieces.sort(byLayer)};
}

// ---------- Small UI helpers ----------
function labSlider(field, label, value, min, max, step, fmt='usd', full=false) {
  return `<label class="lab-field"><span>${labEsc(label)}<output>${labFmt[fmt](value)}</output></span>
    <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-lab-input="${field}" data-fmt="${fmt}" ${full?'data-full="1"':''}></label>`;
}
function labSeg(field, options, value, label) {
  return `<div class="lab-field"><span>${labEsc(label)}</span><div class="lab-seg" role="group" aria-label="${labEsc(label)}">${options.map(([v, text]) =>
    `<button type="button" data-lab-act="set" data-field="${field}" data-v="${v}" aria-pressed="${String(v) === String(value)}">${labEsc(text)}</button>`).join('')}</div></div>`;
}
const labBtn = (act, label, extra='', cls='btn light') => `<button type="button" class="${cls}" data-lab-act="${act}" ${extra}>${label}</button>`;
const labStat = (label, value, note='') => `<div class="lab-stat"><span>${labEsc(label)}</span><strong>${value}</strong>${note?`<small>${note}</small>`:''}</div>`;
function labEntry(lines) {
  return `<table class="lab-entry"><thead><tr><th>Account</th><th>Debit</th><th>Credit</th></tr></thead><tbody>${lines.map(([account, side, amount]) =>
    `<tr><td class="${side === 'Cr' ? 'cr' : ''}">${labEsc(account)}</td><td>${side === 'Dr' ? usd(amount) : ''}</td><td>${side === 'Cr' ? usd(amount) : ''}</td></tr>`).join('')}</tbody></table>`;
}
function labTicks(min, max, count=5) {
  if (max === min) max = min + 1;
  const raw = (max - min) / count, mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map(f => f * mag).find(s => s >= raw);
  const ticks = [];
  for (let v = Math.floor(min / step) * step; v <= Math.ceil(max / step) * step + step / 2; v += step) ticks.push(labRound(v, 6));
  return ticks;
}

// Line chart: inline SVG with direct end labels, a legend, and a crosshair tooltip (mouse and keyboard).
function labChart(spec) {
  const W = 640, H = spec.height || 250, m = {l:62, r:140, t:18, b:42};
  const values = spec.series.flatMap(s => s.values).concat((spec.refs || []).map(r => r.y));
  // Charts start at zero unless spec.zero === false (e.g. a bond's carrying amount, where the change is small relative to the level).
  const lo = Math.min(...values), hi = Math.max(...values), pad = (hi - lo) * .15 || Math.abs(hi) * .02 || 1;
  const ticks = spec.zero === false ? labTicks(lo - pad, hi + pad) : labTicks(Math.min(0, lo), Math.max(1, hi));
  const y0 = ticks[0], y1 = ticks[ticks.length - 1], xs = spec.xs, x0 = xs[0], x1 = xs[xs.length - 1];
  const X = v => m.l + (x1 === x0 ? 0 : (v - x0) / (x1 - x0)) * (W - m.l - m.r);
  const Y = v => m.t + (y1 - v) / (y1 - y0) * (H - m.t - m.b);
  const yf = labAxisFmt[spec.yFmt || 'usd'], xf = labAxisFmt[spec.xFmt || 'num'];
  let out = ticks.map(t => `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${Y(t)}" y2="${Y(t)}"/><text class="axis" x="${m.l - 8}" y="${Y(t) + 4}" text-anchor="end">${labEsc(yf(t))}</text>`).join('');
  out += `<line class="baseline" x1="${m.l}" x2="${W - m.r}" y1="${Y(Math.max(0, y0))}" y2="${Y(Math.max(0, y0))}"/>`;
  const every = Math.max(1, Math.ceil(xs.length / 8));
  const lastX = xs.length - 1;
  out += xs.map((x, i) => (i % every === 0 && lastX - i >= every / 2) || i === lastX ? `<text class="axis" x="${X(x)}" y="${H - m.b + 18}" text-anchor="middle">${labEsc(xf(x))}</text>` : '').join('');
  if (spec.xLabel) out += `<text class="axis" x="${(m.l + W - m.r) / 2}" y="${H - 6}" text-anchor="middle">${labEsc(spec.xLabel)}</text>`;
  for (const r of spec.refs || []) out += `<line class="ref" x1="${m.l}" x2="${W - m.r}" y1="${Y(r.y)}" y2="${Y(r.y)}"/><text class="axis" x="${r.align === 'right' ? W - m.r - 6 : m.l + 6}" y="${Y(r.y) + (r.below ? 15 : -6)}" text-anchor="${r.align === 'right' ? 'end' : 'start'}">${labEsc(r.label)}</text>`;
  out += spec.series.map(s => `<path d="${s.values.map((v, i) => (i ? 'L' : 'M') + X(xs[i]).toFixed(1) + ' ' + Y(v).toFixed(1)).join('')}" stroke="${s.color}" class="series"/>`).join('');
  const ends = spec.series.map(s => ({s, y:Y(s.values[s.values.length - 1])})).sort((a, b) => a.y - b.y);
  ends.forEach((e, i) => { if (i && e.y - ends[i - 1].y < 15) e.y = ends[i - 1].y + 15; });
  out += ends.map(({s, y}) => `<line x1="${W - m.r + 8}" x2="${W - m.r + 22}" y1="${y}" y2="${y}" stroke="${s.color}" stroke-width="2" stroke-linecap="round"/><text class="end-label" x="${W - m.r + 27}" y="${y + 4}">${labEsc(s.name)}</text>`).join('');
  for (const mk of spec.marks || []) out += `<circle cx="${X(mk.x)}" cy="${Y(mk.y)}" r="5" fill="${mk.color || '#202922'}" class="mark"/><text class="mark-label" x="${X(mk.x)}" y="${Y(mk.y) - 11}" text-anchor="middle">${labEsc(mk.label)}</text>`;
  out += `<line class="cross" x1="0" x2="0" y1="${m.t}" y2="${H - m.b}" visibility="hidden"/>`;
  const data = {W, l:m.l, r:m.r, x0, x1, xs, xFmt:spec.xFmt || 'num', yFmt:spec.yFmt || 'usd', xName:spec.xName || '',
    series:spec.series.map(s => ({name:s.name, color:s.color, values:s.values}))};
  const legend = spec.series.length > 1 ? `<div class="lab-legend">${spec.series.map(s => `<span><i style="background:${s.color}"></i>${labEsc(s.name)}</span>`).join('')}</div>` : '';
  return `<figure class="lab-chart">${legend}<svg viewBox="0 0 ${W} ${H}" role="img" tabindex="0" aria-label="${labEsc(spec.title)}. Use arrow keys to read values." data-chart="${labEsc(JSON.stringify(data))}">${out}</svg></figure>`;
}

// ---------- Lab definitions ----------
const labDefs = {};

// 1. Accounting equation
const eqAccounts = [['cash','Cash','A'],['ar','Accounts receivable','A'],['supplies','Supplies','A'],['equipment','Equipment','A'],
  ['ap','Accounts payable','L'],['notes','Notes payable','L'],['stock','Common stock','E'],['re','Retained earnings','E']];
const eqEvents = [
  ['Owners invest $20,000 for stock', {cash:20000, stock:20000}, 'Assets and equity rise together. Money from owners is contributed capital, not revenue.'],
  ['Borrow $10,000 from a bank', {cash:10000, notes:10000}, 'Assets and liabilities rise together. Borrowing creates an obligation, not income, so equity is unchanged.'],
  ['Buy equipment for $8,000 cash', {equipment:8000, cash:-8000}, 'One asset is exchanged for another. Total assets do not change.'],
  ['Buy $1,500 of supplies on account', {supplies:1500, ap:1500}, 'An asset and a liability rise together. No expense yet: the supplies have not been used.'],
  ['Perform $6,000 of services on account', {ar:6000, re:6000}, 'Revenue is earned when the work is done, so retained earnings rise now, before any cash arrives.'],
  ['Collect $4,000 from customers', {cash:4000, ar:-4000}, 'An asset swap: cash up, receivables down. The revenue was already recorded when the work was done.'],
  ['Pay $2,500 of wages', {cash:-2500, re:-2500}, 'An expense uses up assets and reduces retained earnings.'],
  ['Pay $1,000 owed to a supplier', {cash:-1000, ap:-1000}, 'Settling a debt lowers assets and liabilities. It is not an expense.'],
  ['Pay a $1,200 dividend', {cash:-1200, re:-1200}, 'Dividends reduce retained earnings, but they are a distribution to owners, not an expense, so net income is unaffected.'],
  ['Use $600 of supplies', {supplies:-600, re:-600}, 'Consumed supplies become supplies expense. No cash moves, yet equity falls.'],
];
const eqEffectKind = ['', '', '', '', 'revenue', '', 'expense', '', 'dividend', 'expense'];
function eqBalances(log) {
  const b = Object.fromEntries(eqAccounts.map(([k]) => [k, 0]));
  for (const i of log) for (const [k, v] of Object.entries(eqEvents[i][1])) b[k] += v;
  return b;
}
labDefs.equation = {
  title:'The accounting equation, live',
  blurb:'Apply business events one at a time and watch both sides of the equation move. Notice that every event keeps it balanced.',
  init:() => ({log:[0]}),
  controls(s) {
    const b = eqBalances(s.log);
    return `<div class="lab-events">${eqEvents.map(([label, fx], i) => {
      const blocked = Object.entries(fx).some(([k, v]) => b[k] + v < 0);
      return `<button type="button" class="lab-event" data-lab-act="apply" data-v="${i}" ${blocked ? 'disabled title="Not enough balance yet. Try another event first."' : ''}>${labEsc(label)}</button>`;
    }).join('')}</div><div class="actions">${labBtn('undo', 'Undo', s.log.length ? '' : 'disabled')}${labBtn('reset', 'Reset', s.log.length ? '' : 'disabled')}</div>`;
  },
  act(s, act, v) {
    if (act === 'apply') s.log.push(Number(v));
    if (act === 'undo') s.log.pop();
    if (act === 'reset') s.log = [];
  },
  output(s) {
    const b = eqBalances(s.log), last = s.log.length ? s.log[s.log.length - 1] : -1, changed = last >= 0 ? eqEvents[last][1] : {};
    const sum = cls => eqAccounts.filter(a => a[2] === cls).reduce((t, [k]) => t + b[k], 0);
    const A = sum('A'), L = sum('L'), E = sum('E'), scale = Math.max(40000, A);
    const color = {A:LAB_COLORS[0], L:LAB_COLORS[1], E:LAB_COLORS[2]};
    const column = classes => {
      const accts = eqAccounts.filter(a => classes.includes(a[2]) && b[a[0]] > 0);
      return `<div class="eq-col">${accts.map(([k, name, cls]) => `<i style="height:${Math.max(3, b[k] / scale * 220)}px;background:${color[cls]}" title="${labEsc(name)} ${usd(b[k])}"></i>`).join('')}</div>`;
    };
    const rows = classes => eqAccounts.filter(a => classes.includes(a[2])).map(([k, name, cls]) => {
      const delta = changed[k];
      return `<li class="${b[k] ? '' : 'zero'}"><i style="background:${color[cls]}"></i><span>${labEsc(name)}</span><strong>${usd(b[k])}</strong>${delta ? `<em class="${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '+' : '−'}${usd(Math.abs(delta))}</em>` : ''}</li>`;
    }).join('');
    const kinds = s.log.map(i => [eqEffectKind[i], eqEvents[i][1].re || 0]);
    const revenue = kinds.filter(k => k[0] === 'revenue').reduce((t, k) => t + k[1], 0);
    const expenses = -kinds.filter(k => k[0] === 'expense').reduce((t, k) => t + k[1], 0);
    const dividends = -kinds.filter(k => k[0] === 'dividend').reduce((t, k) => t + k[1], 0);
    return `<div class="eq-line" aria-live="polite"><span><small>Assets</small>${usd(A)}</span><b>=</b><span><small>Liabilities</small>${usd(L)}</span><b>+</b><span><small>Equity</small>${usd(E)}</span></div>
      <div class="eq-visual"><div class="eq-side">${column(['A'])}<ul class="eq-list">${rows(['A'])}</ul></div>
      <div class="eq-side">${column(['L','E'])}<ul class="eq-list">${rows(['L'])}${rows(['E'])}</ul></div></div>
      <p class="lab-note">${last >= 0 ? `<strong>${labEsc(eqEvents[last][0])}.</strong> ${labEsc(eqEvents[last][2])}` : 'Start with an event above. The bars show each account; the two columns are always the same height.'}</p>
      <div class="lab-stats">${labStat('Revenue earned', usd(revenue))}${labStat('Expenses incurred', usd(expenses))}${labStat('Net income', usd(revenue - expenses), 'Dividends of ' + usd(dividends) + ' are excluded')}</div>`;
  }
};

// 2. How the four statements connect
labDefs.statements = {
  title:'How the four statements connect',
  blurb:'Change the year’s activity and follow the arrows. Hover a highlighted number to see where it reappears.',
  init:() => ({revenue:40000, expenses:31000, dividends:3000, borrow:5000, equipment:8000}),
  controls:s => `<div class="lab-grid">${labSlider('revenue','Revenue (cash)',s.revenue,0,60000,1000)}${labSlider('expenses','Expenses (cash)',s.expenses,0,60000,1000)}
    ${labSlider('dividends','Dividends paid',s.dividends,0,10000,500)}${labSlider('borrow','New bank loan',s.borrow,0,20000,1000)}${labSlider('equipment','Equipment bought for cash',s.equipment,0,20000,1000)}</div>`,
  output(s) {
    const begin = {cash:12000, other:30000, liab:14000, stock:20000, re:8000};
    const ni = s.revenue - s.expenses, re = begin.re + ni - s.dividends;
    const op = ni, inv = -s.equipment, fin = s.borrow - s.dividends, cash = begin.cash + op + inv + fin;
    const assets = cash + begin.other + s.equipment, liab = begin.liab + s.borrow;
    const ln = (key, v) => `<b class="lk" data-link="${key}">${usd(v)}</b>`;
    const row = (label, v, cls='') => `<div class="st-row ${cls}"><span>${label}</span><span>${v}</span></div>`;
    return `<div class="st-grid">
      <article class="st-card"><h5><span class="st-num">1</span>Income statement</h5>${row('Revenue', usd(s.revenue))}${row('Expenses', usd(-s.expenses))}${row(ni >= 0 ? 'Net income' : 'Net loss', ln('ni', ni), 'total')}</article>
      <article class="st-card"><h5><span class="st-num">2</span>Statement of retained earnings</h5>${row('Beginning balance', usd(begin.re))}${row('+ Net income', ln('ni', ni))}${row('− Dividends', usd(-s.dividends))}${row('Ending balance', ln('re', re), 'total')}</article>
      <article class="st-card"><h5><span class="st-num">3</span>Balance sheet (year end)</h5>${row('Cash', ln('cash', cash))}${row('Other assets', usd(begin.other + s.equipment))}${row('Total assets', usd(assets), 'total')}
        ${row('Liabilities', usd(liab))}${row('Common stock', usd(begin.stock))}${row('Retained earnings', ln('re', re))}${row('Liabilities + equity', usd(liab + begin.stock + re), 'total')}</article>
      <article class="st-card"><h5><span class="st-num">4</span>Statement of cash flows</h5>${row('Operating', usd(op))}${row('Investing', usd(inv))}${row('Financing', usd(fin))}${row('Beginning cash', usd(begin.cash))}${row('Ending cash', ln('cash', cash), 'total')}</article></div>
      <ol class="lab-flow"><li><b>Net income</b> (1) feeds the retained earnings statement (2).</li><li><b>Ending retained earnings</b> (2) appears in equity on the balance sheet (3).</li>
      <li><b>Ending cash</b> on the cash flow statement (4) must equal cash on the balance sheet (3).</li><li>Dividends reduce retained earnings and cash, but never appear on the income statement.</li></ol>
      ${cash < 0 ? '<p class="lab-warn">Cash would be negative. In reality the business would need more financing first.</p>' : ''}
      <p class="lab-note">Simplified: all revenue and expenses are paid in cash, and there is no depreciation. Opening balances: cash $12,000, other assets $30,000, liabilities $14,000, stock $20,000, retained earnings $8,000.</p>`;
  }
};

// 3. Journal → ledger → trial balance
const jrAccounts = {cash:['Cash','Dr'], ar:['Accounts Receivable','Dr'], supplies:['Supplies','Dr'], ap:['Accounts Payable','Cr'], unearned:['Unearned Revenue','Cr'],
  stock:['Common Stock','Cr'], div:['Dividends','Dr'], rev:['Service Revenue','Cr'], rent:['Rent Expense','Dr'], supexp:['Supplies Expense','Dr']};
const jrEvents = [
  ['Issue common stock for $15,000 cash', 'cash', 'stock', 15000],
  ['Buy $800 of supplies on account', 'supplies', 'ap', 800],
  ['Provide services for $2,400 cash', 'cash', 'rev', 2400],
  ['Bill a client $1,800 for completed work', 'ar', 'rev', 1800],
  ['Pay $900 rent for this month', 'rent', 'cash', 900],
  ['Collect $1,000 from the client billed earlier', 'cash', 'ar', 1000],
  ['Pay $500 to the supplies vendor', 'ap', 'cash', 500],
  ['Receive $1,200 in advance for next month’s work', 'cash', 'unearned', 1200],
  ['Pay a $400 dividend', 'div', 'cash', 400],
  ['Record $300 of supplies used (adjusting)', 'supexp', 'supplies', 300],
];
function jrLedger(posted) {
  const ledger = {};
  posted.forEach(i => {
    const [, dr, cr, amt] = jrEvents[i];
    (ledger[dr] ||= {dr:[], cr:[]}).dr.push([i + 1, amt]);
    (ledger[cr] ||= {dr:[], cr:[]}).cr.push([i + 1, amt]);
  });
  return ledger;
}
labDefs.journal = {
  title:'Journal → ledger → trial balance',
  blurb:'Post transactions in order. Each journal entry lands in two T-accounts, and the trial balance updates. Turn on prediction to test yourself first.',
  init:() => ({posted:[], predict:false, guess:{dr:'', cr:''}, msg:''}),
  controls(s) {
    const next = s.posted.length < jrEvents.length ? s.posted.length : -1;
    const opts = sel => `<option value="">Choose…</option>` + Object.entries(jrAccounts).map(([k, [name]]) => `<option value="${k}" ${sel === k ? 'selected' : ''}>${name}</option>`).join('');
    const guess = s.predict && next >= 0 ? `<div class="lab-grid two"><label class="lab-field"><span>Debit</span><select data-lab-input="guess.dr" data-kind="text">${opts(s.guess.dr)}</select></label>
      <label class="lab-field"><span>Credit</span><select data-lab-input="guess.cr" data-kind="text">${opts(s.guess.cr)}</select></label></div>` : '';
    return `<div class="lab-next">${next >= 0 ? `<span class="eyebrow">Next · transaction ${next + 1} of ${jrEvents.length}</span><p><strong>${labEsc(jrEvents[next][0])}</strong></p>` : '<p><strong>All transactions are posted.</strong> Reset to try again with prediction on.</p>'}</div>
      ${guess}<div class="actions">${next >= 0 ? labBtn('post', s.predict ? 'Check and post' : 'Post entry', '', 'btn green') : ''}${labBtn('undo', 'Undo', s.posted.length ? '' : 'disabled')}${labBtn('reset', 'Reset', s.posted.length ? '' : 'disabled')}
      <label class="lab-check"><input type="checkbox" data-lab-input="predict" data-full="1" ${s.predict ? 'checked' : ''}> Predict the entry first</label></div>
      ${s.msg ? `<p class="lab-msg ${s.msg.startsWith('Correct') ? 'ok' : 'bad'}" role="status">${labEsc(s.msg)}</p>` : ''}`;
  },
  act(s, act) {
    const next = s.posted.length;
    if (act === 'post' && next < jrEvents.length) {
      if (s.predict) {
        if (!s.guess.dr || !s.guess.cr) { s.msg = 'Choose a debit and a credit account first.'; return; }
        const [, dr, cr] = jrEvents[next];
        s.msg = s.guess.dr === dr && s.guess.cr === cr ? 'Correct. Debit ' + jrAccounts[dr][0] + ', credit ' + jrAccounts[cr][0] + '.' :
          'Not quite. The entry is debit ' + jrAccounts[dr][0] + ', credit ' + jrAccounts[cr][0] + '.';
        s.guess = {dr:'', cr:''};
      } else s.msg = '';
      s.posted.push(next);
    }
    if (act === 'undo') { s.posted.pop(); s.msg = ''; }
    if (act === 'reset') { s.posted = []; s.msg = ''; }
  },
  output(s) {
    if (!s.posted.length) return '<p class="lab-note">Nothing is posted yet. The journal, T-accounts and trial balance will build up here.</p>';
    const ledger = jrLedger(s.posted), last = s.posted[s.posted.length - 1] + 1;
    const journal = `<table class="lab-table"><thead><tr><th>#</th><th>Account</th><th>Debit</th><th>Credit</th></tr></thead><tbody>${s.posted.map(i => {
      const [, dr, cr, amt] = jrEvents[i];
      return `<tr class="${i + 1 === last ? 'hot' : ''}"><td>${i + 1}</td><td class="acct">${jrAccounts[dr][0]}</td><td>${usd(amt)}</td><td></td></tr><tr class="${i + 1 === last ? 'hot' : ''}"><td></td><td class="acct cr">${jrAccounts[cr][0]}</td><td></td><td>${usd(amt)}</td></tr>`;
    }).join('')}</tbody></table>`;
    let tdr = 0, tcr = 0;
    const order = Object.keys(jrAccounts).filter(k => ledger[k]);
    const taccounts = order.map(k => {
      const {dr, cr} = ledger[k], net = dr.reduce((t, e) => t + e[1], 0) - cr.reduce((t, e) => t + e[1], 0);
      const side = net >= 0 ? 'Dr' : 'Cr', abnormal = net !== 0 && side !== jrAccounts[k][1];
      const cell = list => list.map(([n, a]) => `<div class="${n === last ? 'hot' : ''}"><small>(${n})</small> ${usd(a)}</div>`).join('');
      return `<div class="t-acct"><h6>${jrAccounts[k][0]}<small>Normal: ${jrAccounts[k][1] === 'Dr' ? 'debit' : 'credit'}</small></h6><div class="t-body"><div>${cell(dr)}</div><div>${cell(cr)}</div></div>
        <div class="t-bal ${side === 'Cr' ? 'right' : ''}">${usd(Math.abs(net))} ${side === 'Dr' ? 'debit' : 'credit'} balance${abnormal ? ' ⚠' : ''}</div></div>`;
    }).join('');
    const tb = order.map(k => {
      const {dr, cr} = ledger[k], net = dr.reduce((t, e) => t + e[1], 0) - cr.reduce((t, e) => t + e[1], 0);
      if (net >= 0) tdr += net; else tcr -= net;
      return `<tr><td>${jrAccounts[k][0]}</td><td>${net > 0 ? usd(net) : ''}</td><td>${net < 0 ? usd(-net) : ''}</td></tr>`;
    }).join('');
    return `<div class="jr-wrap"><div><h5>General journal</h5><div class="table-scroll">${journal}</div></div>
      <div><h5>Trial balance</h5><table class="lab-table"><thead><tr><th>Account</th><th>Debit</th><th>Credit</th></tr></thead><tbody>${tb}</tbody>
      <tfoot><tr><td>Totals</td><td>${usd(tdr)}</td><td>${usd(tcr)}</td></tr></tfoot></table><p class="lab-note">${tdr === tcr ? '✓ Debits equal credits.' : ''} A balanced trial balance does not prove every entry used the right accounts.</p></div></div>
      <h5>Ledger (T-accounts)</h5><div class="t-grid">${taccounts}</div>`;
  }
};

// 4. Deferrals: prepaid expenses and unearned revenue
labDefs.deferral = {
  title:'Deferrals over time',
  blurb:'Cash moves once, but the expense or revenue is recognized month by month. Slide through the months to see the adjusting entries.',
  init:variant => ({mode:variant === 'unearned' ? 'unearned' : 'prepaid', amount:2400, months:12, month:3}),
  controls:s => `${labSeg('mode', [['prepaid','Prepaid insurance (we paid)'],['unearned','Unearned revenue (we were paid)']], s.mode, 'Scenario')}
    <div class="lab-grid">${labSlider('amount', s.mode === 'prepaid' ? 'Cash paid up front' : 'Cash received up front', s.amount, 600, 12000, 600)}
    ${labSlider('months','Coverage period',s.months,3,24,1,'mo',true)}${labSlider('month','Month-ends passed',s.month,0,s.months,1,'mo')}</div>`,
  onInput(s) { s.month = Math.min(s.month, s.months); },
  output(s) {
    const per = s.amount / s.months, used = labRound(per * s.month), left = labRound(s.amount - used), pre = s.mode === 'prepaid';
    const [rec, def] = pre ? ['Insurance Expense', 'Prepaid Insurance'] : ['Service Revenue', 'Unearned Revenue'];
    const cells = Array.from({length:s.months}, (_, i) => `<i class="${i < s.month ? 'on' : ''}" title="Month ${i + 1}: ${i < s.month ? 'recognized' : 'still deferred'}">${i + 1}</i>`).join('');
    const entry = pre ? [[rec, 'Dr', per], [def, 'Cr', per]] : [[def, 'Dr', per], [rec, 'Cr', per]];
    const miss = pre ? `assets overstated by ${usd(per, 2)}, expenses understated by ${usd(per, 2)}, and net income overstated by ${usd(per, 2)}`
      : `liabilities overstated by ${usd(per, 2)}, revenue understated by ${usd(per, 2)}, and net income understated by ${usd(per, 2)}`;
    return `<div class="month-strip" aria-hidden="true">${cells}</div>
      <div class="lab-legend"><span><i style="background:${LAB_COLORS[0]}"></i>${pre ? 'Expensed (used up)' : 'Earned (revenue)'}</span><span><i style="background:${LAB_COLORS[1]}"></i>${pre ? 'Still an asset' : 'Still a liability'}</span></div>
      <div class="lab-stats">${labStat(pre ? 'Expense recognized so far' : 'Revenue earned so far', usd(used, 2))}${labStat(def + ' balance', usd(left, 2), pre ? 'Asset on the balance sheet' : 'Liability on the balance sheet')}${labStat('Each month', usd(per, 2))}</div>
      <div class="lab-split"><div><h5>Day 1 entry (cash moves)</h5>${labEntry(pre ? [[def, 'Dr', s.amount], ['Cash', 'Cr', s.amount]] : [['Cash', 'Dr', s.amount], [def, 'Cr', s.amount]])}</div>
      <div><h5>Adjusting entry at each month-end</h5>${labEntry(entry.map(([a, sd, v]) => [a, sd, labRound(v, 2)]))}</div></div>
      <p class="lab-note"><strong>Skip one month’s adjustment</strong> and the statements show ${miss}.</p>`;
  }
};

// 5. Bank reconciliation
function bankrecGenerate() {
  const r = (a, b, step=1) => a + step * Math.floor(Math.random() * (Math.floor((b - a) / step) + 1));
  const check = () => r(1100, 1899);
  const d = [r(1, 9), r(0, 9), r(0, 9)];
  if (d[1] === d[2]) d[2] = (d[2] + 3) % 10;
  const actual = d[0] * 100 + d[1] * 10 + d[2], recorded = d[0] * 100 + d[2] * 10 + d[1], diff = actual - recorded;
  const pool = [
    {text:'Deposit made Dec 31, not on the bank statement', amt:r(40, 240) * 10, side:'bank+', why:'A deposit in transit is already in the books but not yet processed by the bank.', entry:''},
    {text:`Check #${check()} written to a supplier has not cleared`, amt:r(30, 150) * 10, side:'bank-', why:'An outstanding check is already deducted in the books; the bank has not paid it yet.', entry:''},
    {text:`Check #${check()} for rent has not cleared`, amt:r(20, 120) * 10, side:'bank-', why:'Another outstanding check. Deduct it from the bank balance.', entry:''},
    {text:'Bank service fee shown on the statement', amt:r(2, 12) * 5, side:'book-', why:'The company first learns of the fee from the statement, so the books must record it.', entry:'Dr Bank Service Expense / Cr Cash'},
    {text:'Customer check returned NSF (insufficient funds)', amt:r(10, 60) * 10, side:'book-', why:'The deposit bounced. Reduce cash and restore the customer’s receivable.', entry:'Dr Accounts Receivable / Cr Cash'},
    {text:'Interest earned, credited by the bank', amt:r(5, 45), side:'book+', why:'The bank added interest the books have not recorded yet.', entry:'Dr Cash / Cr Interest Revenue'},
    {text:'Note receivable collected by the bank for the company', amt:r(10, 40) * 50, side:'book+', why:'The bank collected money on the company’s behalf; record the cash.', entry:'Dr Cash / Cr Notes Receivable'},
    {text:`Check #${check()} for $${actual} to a supplier was recorded in the books as $${recorded}`, amt:Math.abs(diff), side:diff > 0 ? 'book-' : 'book+',
      why:diff > 0 ? 'The books deducted too little. Reduce book cash by the difference.' : 'The books deducted too much. Add the difference back to book cash.',
      entry:diff > 0 ? 'Dr Accounts Payable / Cr Cash' : 'Dr Cash / Cr Accounts Payable'},
  ];
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const items = pool.slice(0, 6);
  if (!items.some(i => i.side.startsWith('bank'))) items[0] = pool.find(i => i.side.startsWith('bank'));
  const trueCash = r(600, 1500) * 10;
  const effect = side => items.filter(i => i.side === side).reduce((t, i) => t + i.amt, 0);
  return {items, bank:trueCash - effect('bank+') + effect('bank-'), book:trueCash - effect('book+') + effect('book-'), trueCash, choice:{}, checked:false};
}
const bankSides = [['bank+','Add to bank balance'],['bank-','Deduct from bank balance'],['book+','Add to book balance'],['book-','Deduct from book balance']];
labDefs.bankrec = {
  title:'Reconcile the bank account',
  blurb:'Decide where each reconciling item belongs. Both adjusted balances must agree. Items on the book side need journal entries.',
  init:() => bankrecGenerate(),
  controls(s) {
    return `<div class="lab-stats">${labStat('Balance per bank statement', usd(s.bank))}${labStat('Balance per books', usd(s.book))}</div>
      <ol class="rec-items">${s.items.map((item, i) => {
        const pick = s.choice[i] || '', ok = s.checked && pick === item.side;
        return `<li class="${s.checked ? (ok ? 'ok' : 'bad') : ''}"><span>${labEsc(item.text)} · <strong>${usd(item.amt)}</strong></span>
          <select data-lab-input="choice.${i}" data-kind="text" data-full="1" aria-label="Treatment for item ${i + 1}"><option value="">Choose treatment…</option>${bankSides.map(([v, t]) => `<option value="${v}" ${pick === v ? 'selected' : ''}>${t}</option>`).join('')}</select>
          ${s.checked ? `<small>${ok ? '✓ ' : '✗ Should be: ' + bankSides.find(b => b[0] === item.side)[1] + '. '}${labEsc(item.why)}</small>` : ''}</li>`;
      }).join('')}</ol>
      <div class="actions">${labBtn('check', 'Check my reconciliation', '', 'btn green')}${labBtn('new', 'New bank statement')}</div>`;
  },
  onInput(s) { s.checked = false; },
  act(s, act) {
    if (act === 'check') s.checked = true;
    if (act === 'new') Object.assign(s, bankrecGenerate());
  },
  output(s) {
    const side = prefix => s.items.map((item, i) => [item, s.choice[i]]).filter(([, c]) => c && c.startsWith(prefix));
    const total = (base, prefix) => side(prefix).reduce((t, [item, c]) => t + (c.endsWith('+') ? item.amt : -item.amt), base);
    const list = prefix => side(prefix).map(([item, c]) => `<div class="st-row"><span>${c.endsWith('+') ? '+' : '−'} ${labEsc(item.text.split(',')[0].slice(0, 46))}</span><span>${usd(c.endsWith('+') ? item.amt : -item.amt)}</span></div>`).join('');
    const bank = total(s.bank, 'bank'), book = total(s.book, 'book'), done = s.items.every((_, i) => s.choice[i]);
    const allRight = s.items.every((item, i) => s.choice[i] === item.side);
    return `<div class="st-grid two"><article class="st-card"><h5>Bank side</h5><div class="st-row"><span>Per bank statement</span><span>${usd(s.bank)}</span></div>${list('bank')}<div class="st-row total"><span>Adjusted bank balance</span><span>${usd(bank)}</span></div></article>
      <article class="st-card"><h5>Book side</h5><div class="st-row"><span>Per books</span><span>${usd(s.book)}</span></div>${list('book')}<div class="st-row total"><span>Adjusted book balance</span><span>${usd(book)}</span></div></article></div>
      <p class="lab-msg ${bank === book && done ? 'ok' : ''}" role="status">${!done ? `${s.items.filter((_, i) => s.choice[i]).length} of ${s.items.length} items placed. Difference so far: ${usd(Math.abs(bank - book))}.` :
        bank === book ? '✓ Reconciled. The true cash balance is ' + usd(bank) + '.' : 'The adjusted balances differ by ' + usd(Math.abs(bank - book)) + '. Recheck which side knows about each item.'}</p>
      ${s.checked && allRight ? `<h5>Journal entries required (book-side items only)</h5><ul class="lab-list">${s.items.filter(i => i.entry).map(i => `<li>${labEsc(i.entry)} · ${usd(i.amt)}</li>`).join('')}</ul>` : ''}
      <p class="lab-note">Rule of thumb: if the <em>bank</em> doesn’t know yet (deposits in transit, outstanding checks), adjust the bank side. If the <em>company</em> doesn’t know yet (fees, NSF checks, interest, collections, its own errors), adjust the book side and record an entry.</p>`;
  }
};

// 6. Aging and the allowance
labDefs.aging = {
  title:'Aging schedule and the allowance',
  blurb:'Older receivables are less likely to be collected. Set balances and loss rates to find the required allowance, then the adjusting entry.',
  init:() => ({buckets:[['Current',42000,1],['1–30 days past due',18000,4],['31–60 days',9000,10],['61–90 days',4000,25],['Over 90 days',2000,50]], existing:400}),
  controls:s => `<table class="lab-table inputs"><thead><tr><th>Age</th><th>Balance ($)</th><th>Est. uncollectible (%)</th></tr></thead><tbody>${s.buckets.map(([name, bal, rate], i) =>
      `<tr><td>${labEsc(name)}</td><td><input type="number" min="0" step="100" value="${bal}" data-lab-input="buckets.${i}.1" aria-label="${labEsc(name)} balance"></td><td><input type="number" min="0" max="100" step="1" value="${rate}" data-lab-input="buckets.${i}.2" aria-label="${labEsc(name)} rate"></td></tr>`).join('')}</tbody></table>
    ${labSlider('existing','Unadjusted allowance balance', s.existing, -2000, 3000, 50, 'allow')}`,
  output(s) {
    const rows = s.buckets.map(([name, bal, rate]) => ({name, bal:Math.max(0, bal), est:labRound(Math.max(0, bal) * Math.min(100, Math.max(0, rate)) / 100)}));
    const gross = rows.reduce((t, r) => t + r.bal, 0), target = labRound(rows.reduce((t, r) => t + r.est, 0)), adj = labRound(target - s.existing);
    const max = Math.max(1, ...rows.map(r => r.bal));
    const bars = rows.map(r => `<div class="hbar"><span>${labEsc(r.name)}</span><div class="hbar-track"><i style="width:${(r.bal - r.est) / max * 100}%;background:${LAB_COLORS[0]}"></i><i style="width:${r.est / max * 100}%;background:${LAB_COLORS[1]}"></i></div><small>${usd(r.est)} of ${usd(r.bal)}</small></div>`).join('');
    const entry = adj >= 0 ? [['Credit Loss (Bad Debt) Expense', 'Dr', adj], ['Allowance for Doubtful Accounts', 'Cr', adj]] : [['Allowance for Doubtful Accounts', 'Dr', -adj], ['Credit Loss (Bad Debt) Expense', 'Cr', -adj]];
    return `<div class="lab-legend"><span><i style="background:${LAB_COLORS[0]}"></i>Expected to collect</span><span><i style="background:${LAB_COLORS[1]}"></i>Expected uncollectible</span></div><div class="hbars">${bars}</div>
      <div class="lab-stats">${labStat('Gross receivables', usd(gross))}${labStat('Required allowance', usd(target), 'Target ending credit balance')}${labStat('Adjustment needed', usd(Math.abs(adj)), labFmt.allow(s.existing) + ' already there')}${labStat('Net realizable value', usd(gross - target))}</div>
      <div class="lab-split"><div><h5>Adjusting entry</h5>${adj ? labEntry(entry) : '<p class="lab-note">No adjustment needed.</p>'}</div>
      <div><p class="lab-note">The aging method sets the <strong>ending balance</strong> of the allowance. The expense is whatever amount gets the account there. ${s.existing < 0 ? 'A debit balance means write-offs exceeded the old estimate, so the adjustment is larger than the target.' : s.existing > 0 ? 'An existing credit balance reduces the adjustment.' : ''}</p></div></div>`;
  }
};

// 7. Inventory cost flows
labDefs.inventory = {
  title:'FIFO, LIFO and weighted average',
  blurb:'The same units and purchases, three cost-flow assumptions. Change the units sold and see which purchase layers become cost of goods sold.',
  init:() => ({layers:[['Beginning inventory',100,10],['March purchase',150,12],['July purchase',200,13],['November purchase',50,15]], sold:380, method:'fifo', price:20}),
  controls(s) {
    const total = s.layers.reduce((t, l) => t + Math.max(0, l[1]), 0);
    return `<table class="lab-table inputs"><thead><tr><th>Layer</th><th>Units</th><th>Unit cost ($)</th></tr></thead><tbody>${s.layers.map(([name, u, c], i) =>
      `<tr><td><i class="swatch" style="background:${LAB_COLORS[i]}"></i>${labEsc(name)}</td><td><input type="number" min="0" step="10" value="${u}" data-lab-input="layers.${i}.1" aria-label="${labEsc(name)} units"></td><td><input type="number" min="0" step="0.5" value="${c}" data-lab-input="layers.${i}.2" aria-label="${labEsc(name)} unit cost"></td></tr>`).join('')}</tbody></table>
      <div class="lab-grid">${labSlider('sold','Units sold this year',Math.min(s.sold, total),0,total,10,'units')}${labSlider('price','Selling price per unit',s.price,5,40,1,'usd')}</div>
      ${labSeg('method', [['fifo','FIFO'],['lifo','LIFO'],['avg','Weighted average']], s.method, 'Show layers for')}`;
  },
  onInput(s, field, box) {
    const total = s.layers.reduce((t, l) => t + Math.max(0, l[1]), 0);
    s.sold = Math.min(s.sold, total);
    const slider = box && box.querySelector('[data-lab-input="sold"]');
    if (slider) { slider.max = total; slider.value = s.sold; slider.closest('label').querySelector('output').textContent = labFmt.units(s.sold); }
  },
  output(s) {
    const layers = s.layers.map(([name, units, cost]) => ({name, units:Math.max(0, units), cost:Math.max(0, cost)}));
    const res = inventoryCost(layers, s.sold, s.method), total = res.totalUnits || 1;
    const piece = p => `<i style="width:${p.units / total * 100}%;background:${LAB_COLORS[p.index]}" title="${labNum(p.units)} units × ${usd(p.cost, 2)}">${p.units / total > .1 ? labNum(p.units) + ' @ ' + usd(p.cost, 2) : ''}</i>`;
    const avgPiece = units => units ? `<i class="avg" style="width:${units / total * 100}%" title="${labNum(units)} units × ${usd(res.avg, 2)} average">${units / total > .1 ? labNum(units) + ' @ ' + usd(res.avg, 2) : ''}</i>` : '';
    const lane = (label, html, amount) => `<div class="lane"><span>${label}<strong>${usd(amount)}</strong></span><div class="lane-track">${html}</div></div>`;
    const cogsHtml = s.method === 'avg' ? avgPiece(res.sold) : res.cogsPieces.map(piece).join('');
    const endHtml = s.method === 'avg' ? avgPiece(res.totalUnits - res.sold) : res.endPieces.map(piece).join('');
    const methods = [['fifo','FIFO'],['lifo','LIFO'],['avg','Weighted average']].map(([m, name]) => {
      const r = inventoryCost(layers, s.sold, m), sales = r.sold * s.price;
      return `<tr class="${m === s.method ? 'hot' : ''}"><td>${name}</td><td>${usd(r.cogs)}</td><td>${usd(r.ending)}</td><td>${usd(sales - r.cogs)}</td></tr>`;
    }).join('');
    return `<div class="lanes">${lane('Cost of goods sold', cogsHtml, res.cogs)}${lane('Ending inventory', endHtml, res.ending)}</div>
      <p class="lab-note">Goods available for sale: ${labNum(res.totalUnits)} units costing ${usd(res.totalCost)}. ${s.method === 'fifo' ? 'FIFO sends the <strong>oldest</strong> costs to COGS first, so ending inventory reflects recent prices.' : s.method === 'lifo' ? 'LIFO sends the <strong>newest</strong> costs to COGS first, so ending inventory is left at older prices. (US GAAP permits LIFO; IFRS does not.)' : `Weighted average spreads total cost evenly: ${usd(res.totalCost)} ÷ ${labNum(res.totalUnits)} units = ${usd(res.avg, 4)} per unit.`}</p>
      <div class="table-scroll"><table class="lab-table"><thead><tr><th>Method</th><th>COGS</th><th>Ending inventory</th><th>Gross profit</th></tr></thead><tbody>${methods}</tbody></table></div>
      <p class="lab-note">Whatever the method, COGS + ending inventory = ${usd(res.totalCost)}. When costs are rising, FIFO reports the highest gross profit and LIFO the lowest. Periodic system assumed.</p>`;
  }
};

// 8. Depreciation methods and disposal
labDefs.depreciation = {
  title:'Depreciation methods compared',
  blurb:'Same asset, three methods. Every method depreciates the same total, but the timing differs. Then sell the asset to see the gain or loss.',
  init:() => ({cost:50000, salvage:5000, life:5, pattern:'front', sellYear:3, proceeds:20000, method:'sl'}),
  get sections() { return [['controls', this.controls], ['output', this.output], ['controls', this.sellControls], ['output', this.sellOutput]]; },
  controls:s => `<div class="lab-grid">${labSlider('cost','Asset cost',s.cost,5000,100000,1000,'usd',true)}${labSlider('salvage','Residual (salvage) value',s.salvage,0,20000,500)}
    ${labSlider('life','Useful life',s.life,2,10,1,'yrs',true)}</div>${labSeg('pattern', [['even','Even'],['front','Heavier early'],['back','Heavier late']], s.pattern, 'Units-of-production usage pattern')}`,
  onInput(s) { s.sellYear = Math.min(s.sellYear, s.life); s.proceeds = Math.min(s.proceeds, s.cost); },
  output(s) {
    const salvage = Math.min(s.salvage, s.cost);
    const methods = [['sl','Straight-line'],['ddb','Double-declining'],['uop','Units of production']];
    const sched = Object.fromEntries(methods.map(([m]) => [m, depreciationSchedule(s.cost, salvage, s.life, m, s.pattern)]));
    const xs = Array.from({length:s.life + 1}, (_, i) => i);
    const chart = labChart({title:'Book value by year', xs, xFmt:'yr', xName:'End of year', yFmt:'usd',
      series:methods.map(([m, name], i) => ({name, color:LAB_COLORS[i], values:[s.cost, ...sched[m].map(r => r.book)]})),
      refs:[{y:salvage, label:'Residual value ' + usd(salvage)}]});
    const table = `<table class="lab-table"><thead><tr><th>Year</th>${methods.map(([, n]) => `<th>${n}<br><small>expense · book value</small></th>`).join('')}</tr></thead><tbody>${xs.slice(1).map(y =>
      `<tr><td>${y}</td>${methods.map(([m]) => `<td>${usd(sched[m][y - 1].expense)} · ${usd(sched[m][y - 1].book)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    return `${chart}<details class="lab-details"><summary>Year-by-year table</summary><div class="table-scroll">${table}</div>
      <p class="lab-note">Double-declining applies ${labRound(200 / s.life, 1)}% to the opening book value each year, never dropping below residual value; the final year takes book value down to residual value. Units of production assumes the usage pattern above.</p></details>`;
  },
  sellControls:s => `<h5>Sell the asset</h5><div class="lab-grid">${labSeg('method', [['sl','Straight-line'],['ddb','Double-declining'],['uop','Units of production']], s.method, 'Method used')}
    ${labSlider('sellYear','Sold at end of year',Math.min(s.sellYear, s.life),1,s.life,1,'num')}${labSlider('proceeds','Cash received',Math.min(s.proceeds, s.cost),0,s.cost,500)}</div>`,
  sellOutput(s) {
    const sched = depreciationSchedule(s.cost, Math.min(s.salvage, s.cost), s.life, s.method, s.pattern);
    const pick = sched[Math.min(s.sellYear, s.life) - 1], proceeds = Math.min(s.proceeds, s.cost), gl = labRound(proceeds - pick.book);
    const entry = [['Cash', 'Dr', proceeds], ['Accumulated Depreciation', 'Dr', pick.accumulated]];
    if (gl < 0) entry.push(['Loss on Disposal', 'Dr', -gl]);
    entry.push(['Equipment', 'Cr', s.cost]);
    if (gl > 0) entry.push(['Gain on Disposal', 'Cr', gl]);
    return `<div class="lab-split"><div>${labStat('Book value at sale', usd(pick.book))}${labStat(gl >= 0 ? 'Gain on disposal' : 'Loss on disposal', usd(Math.abs(gl)), 'Proceeds − book value')}</div><div>${labEntry(entry)}</div></div>`;
  }
};

// 9. Bonds and installment notes
labDefs.bond = {
  title:'Bond pricing and the effective-interest method',
  blurb:'When the market rate differs from the coupon rate, the bond sells at a discount or premium. Amortization pulls its carrying amount to face value by maturity.',
  init:variant => ({mode:variant === 'note' ? 'note' : 'bond', face:100000, coupon:6, market:8, years:5, freq:1, principal:50000, rate:7, nyears:5}),
  controls:s => labSeg('mode', [['bond','Bond'],['note','Installment note']], s.mode, 'Instrument') + (s.mode === 'bond' ?
    `<div class="lab-grid">${labSlider('face','Face value',s.face,10000,500000,10000)}${labSlider('coupon','Coupon (stated) rate',s.coupon,0,12,0.5,'pct')}
      ${labSlider('market','Market (effective) rate',s.market,0.5,12,0.5,'pct')}${labSlider('years','Term',s.years,1,10,1,'yrs')}</div>${labSeg('freq', [[1,'Annual payments'],[2,'Semiannual payments']], s.freq, 'Interest paid')}` :
    `<div class="lab-grid">${labSlider('principal','Amount borrowed',s.principal,5000,200000,5000)}${labSlider('rate','Interest rate',s.rate,0,15,0.5,'pct')}${labSlider('nyears','Annual payments',s.nyears,1,10,1,'num')}</div>`),
  output(s) {
    if (s.mode === 'note') {
      const {payment, rows} = installmentSchedule(s.principal, s.rate, s.nyears);
      const chart = labChart({title:'Note balance after each payment', xs:[0, ...rows.map(r => r.period)], xFmt:'period', xName:'Payment', xLabel:'Payment number',
        series:[{name:'Balance owed', color:LAB_COLORS[0], values:[s.principal, ...rows.map(r => r.balance)]}]});
      const totalInterest = rows.reduce((t, r) => t + r.interest, 0);
      return `<div class="lab-stats">${labStat('Equal annual payment', usd(payment, 2))}${labStat('Total interest', usd(totalInterest, 2))}${labStat('First payment', usd(rows[0].interest, 2) + ' interest', usd(rows[0].reduction, 2) + ' principal')}</div>${chart}
        <details class="lab-details"><summary>Amortization schedule</summary><div class="table-scroll"><table class="lab-table"><thead><tr><th>#</th><th>Payment</th><th>Interest</th><th>Principal</th><th>Balance</th></tr></thead><tbody>${rows.map(r =>
        `<tr><td>${r.period}</td><td>${usd(r.payment, 2)}</td><td>${usd(r.interest, 2)}</td><td>${usd(r.reduction, 2)}</td><td>${usd(r.balance, 2)}</td></tr>`).join('')}</tbody></table></div></details>
        <p class="lab-note">Each payment is the same, but the split changes: interest = opening balance × rate, so as the balance falls more of each payment repays principal. The current portion of the note is next year’s principal reduction (${usd(rows[0].reduction, 2)}).</p>`;
    }
    const {price, rows, cash} = bondSchedule(s.face, s.coupon, s.market, s.years, s.freq);
    const diff = labRound(price - s.face), label = Math.abs(diff) < 0.5 ? 'at face value' : diff < 0 ? 'at a discount' : 'at a premium';
    const chart = labChart({title:'Carrying amount over the bond’s life', xs:[0, ...rows.map(r => r.period)], xFmt:'period', xName:'Period', xLabel:s.freq === 2 ? 'Six-month period' : 'Year',
      series:[{name:'Carrying amount', color:LAB_COLORS[0], values:[price, ...rows.map(r => r.carrying)]}], refs:[{y:s.face, label:'Face ' + usd(s.face), below:price > s.face}], zero:false});
    const totalInterest = rows.reduce((t, r) => t + r.interest, 0);
    const first = rows[0];
    return `<div class="lab-stats">${labStat('Issue price', usd(price, 2), 'Issued ' + label)}${labStat(diff < 0 ? 'Discount' : 'Premium', usd(Math.abs(diff), 2))}${labStat('Cash interest per period', usd(cash, 2))}${labStat('Total interest expense', usd(totalInterest, 2), 'Cash paid ± ' + (diff < 0 ? 'discount' : 'premium'))}</div>
      <p class="lab-msg">${Math.abs(diff) < 0.5 ? 'Coupon rate equals market rate, so investors pay face value.' : s.market > s.coupon ? `The market wants ${s.market}%, but the bond pays only ${s.coupon}%. Investors pay less than face, and the ${usd(-diff, 2)} discount becomes extra interest expense over the term.` : `The bond pays ${s.coupon}%, more than the ${s.market}% market rate. Investors pay a premium, which reduces interest expense over the term.`}</p>
      ${chart}<details class="lab-details"><summary>Amortization schedule</summary><div class="table-scroll"><table class="lab-table"><thead><tr><th>Period</th><th>Cash paid</th><th>Interest expense</th><th>Amortization</th><th>Carrying amount</th></tr></thead><tbody><tr><td>0</td><td></td><td></td><td></td><td>${usd(price, 2)}</td></tr>${rows.map(r =>
      `<tr><td>${r.period}</td><td>${usd(r.cash, 2)}</td><td>${usd(r.interest, 2)}</td><td>${usd(r.amort, 2)}</td><td>${usd(r.carrying, 2)}</td></tr>`).join('')}</tbody></table></div></details>
      <h5>First interest payment</h5>${labEntry([['Interest Expense', 'Dr', first.interest], ...(first.amort > 0 ? [['Discount on Bonds Payable', 'Cr', first.amort]] : first.amort < 0 ? [['Premium on Bonds Payable', 'Dr', -first.amort]] : []), ['Cash', 'Cr', first.cash]].sort((a, b) => a[1] === b[1] ? 0 : a[1] === 'Dr' ? -1 : 1))}
      <p class="lab-note">Interest expense = opening carrying amount × ${labRound(s.market / s.freq, 3)}% per period = ${usd(price, 2)} × ${labRound(s.market / s.freq, 3)}% = ${usd(first.interest, 2)}.</p>`;
  }
};

// 10. Cost-volume-profit
labDefs.cvp = {
  title:'Break-even explorer',
  blurb:'Every unit sold contributes its price minus variable cost toward fixed costs. Where total revenue crosses total cost, profit is zero.',
  init:() => ({price:50, vc:30, fc:6000, units:450, target:3000}),
  controls:s => `<div class="lab-grid">${labSlider('price','Selling price per unit',s.price,5,120,1)}${labSlider('vc','Variable cost per unit',s.vc,1,110,1)}
    ${labSlider('fc','Fixed costs per period',s.fc,0,30000,500)}${labSlider('units','Expected sales',s.units,0,2000,10,'units')}${labSlider('target','Target profit',s.target,0,20000,500)}</div>`,
  output(s) {
    const cm = s.price - s.vc;
    if (cm <= 0) return `<p class="lab-warn">Price does not exceed variable cost, so each unit loses ${usd(-cm)}. Selling more only deepens the loss; there is no break-even point.</p>`;
    const be = s.fc / cm, profit = cm * s.units - s.fc, maxU = Math.max(10, Math.ceil(Math.max(s.units * 1.3, be * 1.8) / 10) * 10);
    const xs = labTicks(0, maxU, 10);
    const chart = labChart({title:'Revenue and total cost by units sold', xs, xFmt:'num', xName:'Units', xLabel:'Units sold',
      series:[{name:'Revenue', color:LAB_COLORS[0], values:xs.map(u => u * s.price)}, {name:'Total cost', color:LAB_COLORS[1], values:xs.map(u => s.fc + u * s.vc)}],
      refs:[{y:s.fc, label:'Fixed costs ' + usd(s.fc), align:'right', below:true}],
      marks:[{x:be, y:be * s.price, label:'Break-even ' + labNum(Math.ceil(be))}, ...(s.units <= maxU ? [{x:s.units, y:s.units * s.price, label:'Expected', color:'#646e65'}] : [])]});
    const mos = s.units - be;
    return `<div class="lab-stats">${labStat('Contribution margin', usd(cm) + ' / unit', labRound(cm / s.price * 100, 1) + '% of price')}${labStat('Break-even', labNum(Math.ceil(be)) + ' units', usd(be * s.price) + ' of sales')}
      ${labStat(profit >= 0 ? 'Profit at expected sales' : 'Loss at expected sales', usd(Math.abs(profit)))}${labStat('Margin of safety', mos >= 0 ? labNum(Math.floor(mos)) + ' units' : 'None', mos >= 0 && s.units ? labRound(mos / s.units * 100, 1) + '% of expected sales' : 'Expected sales are below break-even')}</div>
      ${chart}<p class="lab-note">Break-even units = fixed costs ÷ contribution margin per unit = ${usd(s.fc)} ÷ ${usd(cm)} = ${labRound(be, 2)} units. To earn ${usd(s.target)}, sell (${usd(s.fc)} + ${usd(s.target)}) ÷ ${usd(cm)} = <strong>${labNum(Math.ceil((s.fc + s.target) / cm))} units</strong>.</p>`;
  }
};

// Which lessons show which lab. "lab:variant" picks a starting mode.
const labTopics = {
  'the-accounting-equation':'equation', 'transaction-effects':'equation',
  'four-statements-connect':'statements', 'from-adjusted-balances-to-statements':'statements', 'closing-the-books':'statements',
  'debits-and-credits':'journal', 'chart-of-accounts':'journal', 'normal-balances-and-t-accounts':'journal', 'journalize-then-post':'journal', 'prepare-and-interpret-a-trial-balance':'journal',
  'adjusting-entries':'deferral', 'prepaids-supplies-and-depreciation':'deferral', 'accrual-compared-with-cash-accounting':'deferral', 'unearned-revenue-becomes-earned':'deferral:unearned',
  'bank-reconciliation':'bankrec', 'bank-side-adjustments':'bankrec', 'book-side-adjustments':'bankrec',
  'receivables-and-the-allowance':'aging', 'aging-the-receivables':'aging', 'write-offs-and-recovery':'aging', 'estimating-credit-losses':'aging',
  'inventory-cost-flows':'inventory', 'cost-of-goods-available':'inventory', 'fifo-layers':'inventory', 'weighted-average-cost':'inventory', 'lifo-and-net-realizable-value':'inventory',
  'depreciation-and-asset-cost':'depreciation', 'straight-line-and-units-of-production':'depreciation', 'declining-balance-and-estimate-changes':'depreciation',
  'gain-or-loss-on-disposal':'depreciation', 'asset-disposals':'depreciation', 'disposal-of-fixed-assets':'depreciation',
  'long-term-borrowing':'bond', 'bond-face-versus-issue-price':'bond', 'effective-interest-discount-amortization':'bond', 'effective-interest-premium-amortization':'bond',
  'amortizing-a-bond-discount':'bond', 'construction-of-an-amortization-schedule':'bond', 'installment-note-amortization':'bond:note',
  'contribution-margin':'cvp'
};
const labStates = {};
const labFor = topicId => labTopics[topicId] || '';
function labState(key) {
  if (!labStates[key]) { const [name, variant] = key.split(':'); labStates[key] = labDefs[name].init(variant); }
  return labStates[key];
}
// A lab is a sequence of control and output sections. Typing or sliding redraws only the outputs,
// so the control being dragged is never replaced mid-gesture.
const labSections = def => def.sections || [['controls', def.controls], ['output', def.output]];
function labInner(key) {
  const def = labDefs[key.split(':')[0]], s = labState(key);
  return `<div class="lab-head"><span class="lab-tag">Interactive lab</span><h4>${labEsc(def.title)}</h4><p>${labEsc(def.blurb)}</p></div>` +
    labSections(def).map(([kind, fn], i) => kind === 'controls' ? `<div class="lab-controls">${fn(s)}</div>` : `<div class="lab-out" data-part="${i}">${fn(s)}</div>`).join('');
}
function labBlock(topicId) {
  const key = labFor(topicId);
  return key ? `<section class="lab" data-lab-key="${key}">${labInner(key)}</section>` : '';
}
function setLabPath(obj, path, value) {
  const parts = path.split('.'), last = parts.pop();
  const target = parts.reduce((o, p) => o[p], obj);
  target[last] = value;
}
function labRedraw(box, key, full, focusSelector) {
  const def = labDefs[key.split(':')[0]], s = labState(key);
  document.querySelectorAll(`.lab[data-lab-key="${key}"]`).forEach(el => {
    if (el === box && !full) {
      const sections = labSections(def);
      el.querySelectorAll('.lab-out').forEach(out => { out.innerHTML = sections[Number(out.dataset.part)][1](s); });
    } else el.innerHTML = labInner(key);
  });
  if (full && focusSelector) box.querySelector(focusSelector)?.focus();
}

// Tooltip for charts: one floating element shared by all charts.
function labTip() {
  let tip = document.getElementById('lab-tip');
  if (!tip) { tip = document.createElement('div'); tip.id = 'lab-tip'; tip.className = 'lab-tip'; tip.hidden = true; document.body.append(tip); }
  return tip;
}
function labShowPoint(svg, index, clientX, clientY) {
  const d = JSON.parse(svg.dataset.chart), i = Math.max(0, Math.min(d.xs.length - 1, index));
  svg.dataset.index = i;
  const X = v => d.l + (d.x1 === d.x0 ? 0 : (v - d.x0) / (d.x1 - d.x0)) * (d.W - d.l - d.r);
  const cross = svg.querySelector('.cross');
  cross.setAttribute('x1', X(d.xs[i])); cross.setAttribute('x2', X(d.xs[i])); cross.setAttribute('visibility', 'visible');
  const tip = labTip();
  tip.replaceChildren();
  const head = document.createElement('div');
  head.className = 'tip-head';
  head.textContent = (d.xName ? d.xName + ' ' : '') + labAxisFmt[d.xFmt === 'yr' ? 'num' : d.xFmt](d.xs[i]);
  tip.append(head);
  for (const s of d.series) {
    const row = document.createElement('div'), key = document.createElement('i'), val = document.createElement('strong'), name = document.createElement('span');
    key.style.background = s.color;
    val.textContent = d.yFmt === 'usd' ? usd(s.values[i]) : labNum(s.values[i]);
    name.textContent = s.name;
    row.append(key, val, name);
    tip.append(row);
  }
  tip.hidden = false;
  const box = svg.getBoundingClientRect();
  const px = clientX ?? box.left + X(d.xs[i]) / d.W * box.width, py = clientY ?? box.top + 20;
  const w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = Math.min(window.innerWidth - w - 8, Math.max(8, px + 14)) + 'px';
  tip.style.top = Math.min(window.innerHeight - h - 8, Math.max(8, py - h / 2)) + 'px';
}
function labHidePoint(svg) {
  svg.querySelector('.cross')?.setAttribute('visibility', 'hidden');
  labTip().hidden = true;
}

if (typeof document !== 'undefined') {
  document.addEventListener('input', event => {
    const el = event.target.closest && event.target.closest('[data-lab-input]');
    if (!el) return;
    const box = el.closest('.lab'), key = box.dataset.labKey, s = labState(key), def = labDefs[key.split(':')[0]];
    let value = el.type === 'checkbox' ? el.checked : el.dataset.kind === 'text' ? el.value : Number(el.value);
    if (typeof value === 'number' && !Number.isFinite(value)) return;
    setLabPath(s, el.dataset.labInput, value);
    def.onInput?.(s, el.dataset.labInput, box);
    const out = el.closest('label')?.querySelector('output');
    if (out && el.dataset.fmt) out.textContent = labFmt[el.dataset.fmt](value);
    labRedraw(box, key, Boolean(el.dataset.full), `[data-lab-input="${el.dataset.labInput}"]`);
  });
  document.addEventListener('click', event => {
    const button = event.target.closest && event.target.closest('[data-lab-act]');
    if (!button) return;
    const box = button.closest('.lab'), key = box.dataset.labKey, s = labState(key), def = labDefs[key.split(':')[0]];
    const act = button.dataset.labAct, v = button.dataset.v;
    if (act === 'set') {
      setLabPath(s, button.dataset.field, Number.isNaN(Number(v)) ? v : Number(v));
      def.act?.(s, 'set', v);
    } else def.act(s, act, v);
    const selector = `[data-lab-act="${act}"]` + (v !== undefined ? `[data-v="${v}"]` : '') + (button.dataset.field ? `[data-field="${button.dataset.field}"]` : '');
    labRedraw(box, key, true, selector);
    if (!box.contains(document.activeElement)) box.querySelector('[data-lab-act]:not([disabled])')?.focus();
  });
  document.addEventListener('pointermove', event => {
    const svg = event.target.closest && event.target.closest('svg[data-chart]');
    if (!svg) { const tip = document.getElementById('lab-tip'); if (tip && !tip.hidden && !document.activeElement?.matches?.('svg[data-chart]')) { tip.hidden = true; document.querySelectorAll('svg[data-chart] .cross').forEach(c => c.setAttribute('visibility', 'hidden')); } return; }
    const d = JSON.parse(svg.dataset.chart), box = svg.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width * d.W;
    const X = v => d.l + (d.x1 === d.x0 ? 0 : (v - d.x0) / (d.x1 - d.x0)) * (d.W - d.l - d.r);
    let best = 0;
    d.xs.forEach((v, i) => { if (Math.abs(X(v) - x) < Math.abs(X(d.xs[best]) - x)) best = i; });
    labShowPoint(svg, best, event.clientX, event.clientY);
  });
  window.addEventListener('hashchange', () => { const tip = document.getElementById('lab-tip'); if (tip) tip.hidden = true; });
  document.addEventListener('focusin', event => { if (event.target.matches?.('svg[data-chart]')) labShowPoint(event.target, Number(event.target.dataset.index || 0)); });
  document.addEventListener('focusout', event => { if (event.target.matches?.('svg[data-chart]')) labHidePoint(event.target); });
  document.addEventListener('keydown', event => {
    const svg = event.target.matches?.('svg[data-chart]') ? event.target : null;
    if (!svg || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const n = JSON.parse(svg.dataset.chart).xs.length, i = Number(svg.dataset.index || 0);
    labShowPoint(svg, event.key === 'Home' ? 0 : event.key === 'End' ? n - 1 : i + (event.key === 'ArrowRight' ? 1 : -1));
  });
}
