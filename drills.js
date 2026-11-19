'use strict';
// Skill drills: unlimited generated practice with fresh numbers and a worked solution after every answer.
// Drills do not change lesson mastery; their running totals are kept separately in this browser.

const drillRand = (a, b, step=1) => a + step * Math.floor(Math.random() * (Math.floor((b - a) / step) + 1));
const drillPick = list => list[Math.floor(Math.random() * list.length)];
const drillStoreKey = 'folio-drills-v1';

// [account, type, normal balance, note]
const drillAccounts = [
  ['Cash','Asset','Debit'], ['Accounts Receivable','Asset','Debit'], ['Notes Receivable','Asset','Debit'], ['Interest Receivable','Asset','Debit'],
  ['Supplies','Asset','Debit','Unused supplies still have future benefit, so they start as an asset.'], ['Prepaid Insurance','Asset','Debit','Paying ahead buys future coverage: an asset until it is used.'],
  ['Inventory','Asset','Debit'], ['Equipment','Asset','Debit'], ['Land','Asset','Debit'], ['Patent','Asset','Debit'],
  ['Accumulated Depreciation','Contra-asset','Credit','It offsets an asset (equipment), so it carries the opposite, credit, balance.'],
  ['Allowance for Doubtful Accounts','Contra-asset','Credit','It reduces receivables to the amount expected to be collected, so it has a credit balance.'],
  ['Accounts Payable','Liability','Credit'], ['Notes Payable','Liability','Credit'], ['Wages Payable','Liability','Credit'], ['Interest Payable','Liability','Credit'],
  ['Unearned Revenue','Liability','Credit','Cash received before the work is done is an obligation to perform, not revenue yet.'],
  ['Bonds Payable','Liability','Credit'], ['Sales Tax Payable','Liability','Credit','Sales tax collected belongs to the government; it is owed, not earned.'],
  ['Discount on Bonds Payable','Contra-liability','Debit','It reduces the carrying amount of bonds payable, so it carries a debit balance.'],
  ['Common Stock','Equity','Credit'], ['Additional Paid-in Capital','Equity','Credit'], ['Retained Earnings','Equity','Credit'],
  ['Dividends','Contra-equity','Debit','Dividends reduce equity directly. They are a distribution to owners, not an expense.'],
  ['Treasury Stock','Contra-equity','Debit','Shares bought back reduce total equity, so the account carries a debit balance.'],
  ['Service Revenue','Revenue','Credit'], ['Sales Revenue','Revenue','Credit'], ['Interest Revenue','Revenue','Credit'],
  ['Gain on Disposal','Revenue','Credit','Gains behave like revenue: they increase equity and carry credit balances.'],
  ['Sales Returns and Allowances','Contra-revenue','Debit','It reduces sales revenue, so it has a debit balance.'], ['Sales Discounts','Contra-revenue','Debit','It reduces sales revenue, so it has a debit balance.'],
  ['Rent Expense','Expense','Debit'], ['Wages Expense','Expense','Debit'], ['Depreciation Expense','Expense','Debit'], ['Cost of Goods Sold','Expense','Debit'],
  ['Insurance Expense','Expense','Debit'], ['Supplies Expense','Expense','Debit'], ['Bad Debt Expense','Expense','Debit'], ['Interest Expense','Expense','Debit'],
  ['Bank Service Expense','Expense','Debit'], ['Loss on Disposal','Expense','Debit','Losses behave like expenses: they reduce equity and carry debit balances.'],
];
const drillTypes = ['Asset','Contra-asset','Liability','Contra-liability','Equity','Contra-equity','Revenue','Contra-revenue','Expense'];

const dm = n => usd(n);
// Journal entry templates. Each returns {text, lines:[[account, 'Dr'|'Cr', amount]], why, topic}.
const drillEntries = [
  () => { const a = drillRand(10, 60) * 500; return {text:`Owners invest ${dm(a)} cash in the business in exchange for common stock.`, lines:[['Cash','Dr',a],['Common Stock','Cr',a]],
    why:'Cash, an asset, increases with a debit. Contributed capital increases with a credit. Owner investment is never revenue.', topic:'transaction-effects'}; },
  () => { const a = drillRand(5, 40) * 1000; return {text:`The company borrows ${dm(a)} from a bank, signing a note payable.`, lines:[['Cash','Dr',a],['Notes Payable','Cr',a]],
    why:'Borrowing raises an asset and a liability. Nothing is earned, so no revenue.', topic:'transaction-effects'}; },
  () => { const a = drillRand(4, 40) * 50; return {text:`Purchased ${dm(a)} of office supplies on account, to be used next month.`, lines:[['Supplies','Dr',a],['Accounts Payable','Cr',a]],
    why:'Unused supplies are an asset. Buying on account creates a liability.', topic:'chart-of-accounts'}; },
  () => { const total = drillRand(12, 40) * 1000, cash = drillRand(2, 8) * 1000;
    return {text:`Bought equipment costing ${dm(total)}: paid ${dm(cash)} cash and signed a note for the rest.`, lines:[['Equipment','Dr',total],['Cash','Cr',cash],['Notes Payable','Cr',total - cash]],
      why:'A compound entry: one debit for the full cost of the asset, two credits for how it was paid.', topic:'journalize-then-post'}; },
  () => { const a = drillRand(6, 60) * 50; return {text:`Performed services for a customer and received ${dm(a)} in cash.`, lines:[['Cash','Dr',a],['Service Revenue','Cr',a]],
    why:'The work is done, so revenue is earned. Cash comes in at the same time.', topic:'debits-and-credits'}; },
  () => { const a = drillRand(6, 80) * 50; return {text:`Completed a ${dm(a)} job and billed the client; payment is due in 30 days.`, lines:[['Accounts Receivable','Dr',a],['Service Revenue','Cr',a]],
    why:'Accrual accounting recognizes revenue when it is earned, even though cash comes later.', topic:'accrual-compared-with-cash-accounting'}; },
  () => { const a = drillRand(6, 80) * 50; return {text:`Collected ${dm(a)} from a customer for work billed last month.`, lines:[['Cash','Dr',a],['Accounts Receivable','Cr',a]],
    why:'The revenue was recorded last month. Collecting it just swaps one asset for another.', topic:'debits-and-credits'}; },
  () => { const a = drillRand(4, 40) * 50; return {text:`Paid ${dm(a)} to a supplier for supplies bought on account last month.`, lines:[['Accounts Payable','Dr',a],['Cash','Cr',a]],
    why:'Paying a debt reduces a liability (debit) and cash (credit). It is not an expense.', topic:'transaction-effects'}; },
  () => { const a = drillRand(8, 40) * 100; return {text:`Paid this month’s rent of ${dm(a)} in cash.`, lines:[['Rent Expense','Dr',a],['Cash','Cr',a]],
    why:'The rent is used up this month, so it is an expense right away.', topic:'journalize-then-post'}; },
  () => { const a = drillRand(6, 30) * 200; return {text:`Paid ${dm(a)} in advance for a 12-month insurance policy starting today.`, lines:[['Prepaid Insurance','Dr',a],['Cash','Cr',a]],
    why:'The coverage is all in the future, so the payment creates an asset.', topic:'prepaids-supplies-and-depreciation'}; },
  () => { const annual = drillRand(6, 30) * 240, m = drillRand(1, 3); const a = annual / 12 * m;
    return {text:`A 12-month insurance policy was prepaid for ${dm(annual)}. Record the adjusting entry after ${m} month${m > 1 ? 's' : ''} of coverage ${m > 1 ? 'have' : 'has'} expired (no earlier adjustment).`, lines:[['Insurance Expense','Dr',a],['Prepaid Insurance','Cr',a]],
      why:`${dm(annual)} ÷ 12 = ${dm(annual / 12)} per month × ${m} = ${dm(a)} used up. Move it from the asset to expense.`, topic:'adjusting-entries'}; },
  () => { const bal = drillRand(20, 60) * 50, count = drillRand(2, 15) * 50;
    return {text:`The Supplies account shows ${dm(bal)}. A count at month end finds ${dm(count)} still on hand.`, lines:[['Supplies Expense','Dr',bal - count],['Supplies','Cr',bal - count]],
      why:`${dm(bal)} − ${dm(count)} = ${dm(bal - count)} was used. Record the used portion as expense and reduce the asset.`, topic:'prepaids-supplies-and-depreciation'}; },
  () => { const a = drillRand(10, 60) * 50; return {text:`Employees earned ${dm(a)} of wages in the last days of the month; they will be paid next week.`, lines:[['Wages Expense','Dr',a],['Wages Payable','Cr',a]],
    why:'The expense is incurred this month even though cash goes out later: an accrued expense.', topic:'accrued-expenses'}; },
  () => { const a = drillRand(6, 40) * 100; return {text:`A client pays ${dm(a)} in advance for work to be done next quarter.`, lines:[['Cash','Dr',a],['Unearned Revenue','Cr',a]],
    why:'Nothing is earned yet. The company owes the work, so record a liability.', topic:'unearned-revenue-becomes-earned'}; },
  () => { const total = drillRand(6, 40) * 300, part = drillRand(1, 2); const a = total * part / 3;
    return {text:`Unearned Revenue holds ${dm(total)} received for 3 months of service. At month end, ${part} month${part > 1 ? 's' : ''} of service ${part > 1 ? 'have' : 'has'} been provided (no earlier adjustment).`, lines:[['Unearned Revenue','Dr',a],['Service Revenue','Cr',a]],
      why:`${dm(total)} ÷ 3 × ${part} = ${dm(a)} has now been earned. Reduce the liability and recognize revenue.`, topic:'unearned-revenue-becomes-earned'}; },
  () => { const cost = drillRand(10, 60) * 1000, salvage = drillRand(0, 5) * 1000, life = drillPick([4, 5, 8, 10]); const a = (cost - salvage) / life;
    return {text:`Record one year of straight-line depreciation on equipment costing ${dm(cost)}, with residual value ${dm(salvage)} and a ${life}-year life.`, lines:[['Depreciation Expense','Dr',a],['Accumulated Depreciation','Cr',a]],
      why:`(${dm(cost)} − ${dm(salvage)}) ÷ ${life} = ${dm(a)}. Credit the contra-asset, never the Equipment account itself.`, topic:'straight-line-and-units-of-production'}; },
  () => { const a = drillRand(4, 40) * 100; return {text:`The board declares and immediately pays a ${dm(a)} cash dividend.`, lines:[['Dividends','Dr',a],['Cash','Cr',a]],
    why:'Dividends reduce equity directly (debit Dividends). They are not an expense.', topic:'corporate-equity'}; },
  () => { const a = drillRand(4, 40) * 25; return {text:`Using the allowance method, write off a ${dm(a)} customer account as uncollectible.`, lines:[['Allowance for Doubtful Accounts','Dr',a],['Accounts Receivable','Cr',a]],
    why:'The expense was estimated earlier. A write-off just removes the account against the allowance; net receivables do not change.', topic:'write-offs-and-recovery'}; },
  () => { const target = drillRand(20, 60) * 100, existing = drillRand(-8, 15) * 50; const a = target - existing;
    return {text:`An aging analysis says the allowance should be ${dm(target)}. Before adjusting, the allowance has a ${dm(Math.abs(existing))} ${existing >= 0 ? 'credit' : 'debit'} balance. Record the adjustment.`, lines:[['Bad Debt Expense','Dr',a],['Allowance for Doubtful Accounts','Cr',a]],
      why:existing >= 0 ? `${dm(target)} − ${dm(existing)} existing credit = ${dm(a)}.` : `A debit balance must be cleared too: ${dm(target)} + ${dm(-existing)} = ${dm(a)}.`, topic:'aging-the-receivables'}; },
  () => { const a = drillRand(10, 80) * 100; return {text:`Purchased ${dm(a)} of merchandise on account (perpetual inventory system).`, lines:[['Inventory','Dr',a],['Accounts Payable','Cr',a]],
    why:'Under a perpetual system, purchases go straight into the Inventory asset account.', topic:'perpetual-versus-periodic-systems'}; },
  () => { const cost = drillRand(10, 60) * 50, price = cost + drillRand(4, 30) * 50;
    return {text:`Sold merchandise on account for ${dm(price)}. The goods cost ${dm(cost)} (perpetual system). Record the sale and the cost.`, lines:[['Accounts Receivable','Dr',price],['Sales Revenue','Cr',price],['Cost of Goods Sold','Dr',cost],['Inventory','Cr',cost]],
      why:'A perpetual system needs two pairs: the sale at selling price, and the transfer of cost from inventory to COGS.', topic:'perpetual-versus-periodic-systems'}; },
  () => { const p = drillRand(4, 24) * 2500, r = drillPick([6, 8, 9, 12]), m = drillPick([2, 3, 4, 6]); const a = p * r / 100 * m / 12;
    return {text:`A ${dm(p)}, ${r}% note payable has been outstanding for ${m} months at year end. Accrue the interest.`, lines:[['Interest Expense','Dr',a],['Interest Payable','Cr',a]],
      why:`${dm(p)} × ${r}% × ${m}/12 = ${dm(a)}.`, topic:'short-term-notes-and-accrued-interest'}; },
  () => { const cost = drillRand(20, 60) * 1000, acc = drillRand(8, 18) * 1000, gain = drillRand(-6, 6) * 500; const book = cost - acc, cash = book + gain;
    const lines = [['Cash','Dr',cash],['Accumulated Depreciation','Dr',acc],['Equipment','Cr',cost]];
    if (gain > 0) lines.push(['Gain on Disposal','Cr',gain]); if (gain < 0) lines.push(['Loss on Disposal','Dr',-gain]);
    return {text:`Sold equipment for ${dm(cash)} cash. It cost ${dm(cost)} and has accumulated depreciation of ${dm(acc)}.`, lines,
      why:`Book value = ${dm(cost)} − ${dm(acc)} = ${dm(book)}. ${gain === 0 ? 'Cash equals book value: no gain or loss.' : gain > 0 ? `Cash exceeds book value: gain of ${dm(gain)}.` : `Cash is below book value: loss of ${dm(-gain)}.`} Remove both the asset and its accumulated depreciation.`, topic:'gain-or-loss-on-disposal'}; },
  () => { const shares = drillRand(2, 20) * 500, par = drillPick([1, 5, 10]), price = par + drillPick([2, 5, 8, 10]);
    return {text:`Issued ${labNum(shares)} shares of $${par} par common stock for $${price} per share in cash.`, lines:[['Cash','Dr',shares * price],['Common Stock','Cr',shares * par],['Additional Paid-in Capital','Cr',shares * (price - par)]],
      why:`Common Stock gets par only (${labNum(shares)} × $${par}). The excess over par goes to Additional Paid-in Capital.`, topic:'common-shares-and-additional-paid-in-capital'}; },
  () => { const a = drillRand(3, 12) * 5; return {text:`The bank statement shows a ${dm(a)} service fee the company has not recorded.`, lines:[['Bank Service Expense','Dr',a],['Cash','Cr',a]],
    why:'Book-side reconciling items need entries. The fee reduces cash and is an expense.', topic:'book-side-adjustments'}; },
  () => { const a = drillRand(10, 60) * 10; return {text:`A customer’s ${dm(a)} check deposited last week is returned by the bank marked NSF.`, lines:[['Accounts Receivable','Dr',a],['Cash','Cr',a]],
    why:'The customer still owes the money, so restore the receivable and remove the cash.', topic:'book-side-adjustments'}; },
];

// Calculation generators. Each returns {prompt, answer, steps, topic}. Answers are rounded to whole dollars unless noted.
const drillCalcs = [
  {id:'sl', title:'Straight-line depreciation', courses:['ac-297p'], make() {
    const cost = drillRand(10, 80) * 1000, salvage = drillRand(0, 8) * 500, life = drillPick([3, 4, 5, 8, 10]); const a = Math.round((cost - salvage) / life);
    return {prompt:`Equipment costs ${dm(cost)}, has a residual value of ${dm(salvage)} and a ${life}-year useful life. Annual straight-line depreciation?`, answer:a,
      steps:[`Depreciable base = cost − residual = ${dm(cost)} − ${dm(salvage)} = ${dm(cost - salvage)}`, `Annual expense = ${dm(cost - salvage)} ÷ ${life} = ${dm(a)}`], topic:'straight-line-and-units-of-production'}; }},
  {id:'ddb', title:'Double-declining balance (year 2)', courses:['ac-297p'], make() {
    const cost = drillRand(10, 60) * 1000, life = drillPick([4, 5, 8, 10]), salvage = drillRand(0, 4) * 500; const rate = 2 / life, y1 = cost * rate, y2 = (cost - y1) * rate;
    return {prompt:`An asset costs ${dm(cost)} with a ${life}-year life and ${dm(salvage)} residual value. Depreciation expense in year 2 under double-declining balance?`, answer:Math.round(y2),
      steps:[`Rate = 2 ÷ ${life} = ${labRound(rate * 100, 1)}%. Ignore residual value when applying the rate (just don’t go below it).`, `Year 1 = ${dm(cost)} × ${labRound(rate * 100, 1)}% = ${usd(y1, 2)}`,
        `Book value after year 1 = ${dm(cost)} − ${usd(y1, 2)} = ${usd(cost - y1, 2)}`, `Year 2 = ${usd(cost - y1, 2)} × ${labRound(rate * 100, 1)}% = ${usd(y2, 2)}`], topic:'declining-balance-and-estimate-changes'}; }},
  {id:'uop', title:'Units-of-production depreciation', courses:['ac-297p'], make() {
    const cost = drillRand(20, 90) * 1000, salvage = drillRand(1, 8) * 1000, total = drillRand(4, 20) * 10000, used = drillRand(5, 40) * 200; const rate = (cost - salvage) / total;
    return {prompt:`A truck costs ${dm(cost)}, has ${dm(salvage)} residual value and is expected to be driven ${labNum(total)} miles. It was driven ${labNum(used)} miles this year. Depreciation expense?`, answer:Math.round(rate * used),
      steps:[`Rate per mile = (${dm(cost)} − ${dm(salvage)}) ÷ ${labNum(total)} = ${usd(rate, 4)}`, `Expense = ${usd(rate, 4)} × ${labNum(used)} miles = ${usd(rate * used, 2)}`], topic:'straight-line-and-units-of-production'}; }},
  {id:'disposal', title:'Gain or loss on disposal', courses:['ac-297p'], make() {
    const cost = drillRand(20, 60) * 1000, acc = drillRand(5, 18) * 1000, cash = drillRand(2, 50) * 500; const gl = cash - (cost - acc);
    return {prompt:`Equipment that cost ${dm(cost)} with ${dm(acc)} of accumulated depreciation is sold for ${dm(cash)}. Enter the gain as a positive number or the loss as a negative number.`, answer:gl,
      steps:[`Book value = ${dm(cost)} − ${dm(acc)} = ${dm(cost - acc)}`, `Proceeds − book value = ${dm(cash)} − ${dm(cost - acc)} = ${dm(gl)}`, gl >= 0 ? `A ${gl ? 'gain' : 'zero result'}: proceeds ${gl ? 'exceed' : 'equal'} book value.` : 'A loss: proceeds are below book value.'], topic:'gain-or-loss-on-disposal'}; }},
  {id:'fifo', title:'FIFO cost of goods sold', courses:['ac-297p','ac-361p','far'], make() {
    const L = drillInventoryLayers(); const sold = drillRand(Math.ceil(L.total * .4 / 10), Math.floor(L.total * .9 / 10)) * 10; const r = inventoryCost(L.layers, sold, 'fifo');
    return {prompt:`${L.text} ${labNum(sold)} units were sold. Using FIFO (periodic), what is cost of goods sold?`, answer:Math.round(r.cogs),
      steps:['FIFO sends the oldest costs to COGS first.', ...r.cogsPieces.map(p => `${labNum(p.units)} units × ${usd(p.cost, 2)} = ${usd(p.units * p.cost, 2)}`), `COGS = ${usd(r.cogs, 2)}`], topic:'fifo-layers'}; }},
  {id:'lifo', title:'LIFO ending inventory', courses:['ac-297p','far'], make() {
    const L = drillInventoryLayers(); const sold = drillRand(Math.ceil(L.total * .4 / 10), Math.floor(L.total * .9 / 10)) * 10; const r = inventoryCost(L.layers, sold, 'lifo');
    return {prompt:`${L.text} ${labNum(sold)} units were sold. Using LIFO (periodic), what is ending inventory?`, answer:Math.round(r.ending),
      steps:['LIFO sends the newest costs to COGS, so ending inventory keeps the oldest costs.', `Units left = ${labNum(L.total)} − ${labNum(sold)} = ${labNum(L.total - sold)}`,
        ...r.endPieces.map(p => `${labNum(p.units)} units × ${usd(p.cost, 2)} = ${usd(p.units * p.cost, 2)}`), `Ending inventory = ${usd(r.ending, 2)}`], topic:'lifo-and-net-realizable-value'}; }},
  {id:'avg', title:'Weighted-average cost of goods sold', courses:['ac-297p','far'], make() {
    const L = drillInventoryLayers(); const sold = drillRand(Math.ceil(L.total * .4 / 10), Math.floor(L.total * .9 / 10)) * 10; const r = inventoryCost(L.layers, sold, 'avg');
    return {prompt:`${L.text} ${labNum(sold)} units were sold. Using the weighted-average method (periodic), what is cost of goods sold? Round to the nearest dollar.`, answer:Math.round(r.cogs),
      steps:[`Cost of goods available = ${usd(r.totalCost, 2)} for ${labNum(r.totalUnits)} units`, `Average cost = ${usd(r.totalCost, 2)} ÷ ${labNum(r.totalUnits)} = ${usd(r.avg, 4)} per unit`,
        `COGS = ${labNum(sold)} × ${usd(r.avg, 4)} = ${usd(r.cogs, 2)}`], topic:'weighted-average-cost'}; }},
  {id:'allowance', title:'Allowance adjustment (aging)', courses:['ac-297p','ac-361p','far'], make() {
    const ar = drillRand(40, 160) * 1000, pct = drillPick([2, 3, 4, 5, 6]), existing = drillRand(-10, 20) * 50; const target = ar * pct / 100, adj = target - existing;
    return {prompt:`Accounts receivable total ${dm(ar)}, and ${pct}% is estimated to be uncollectible. Before adjustment the allowance has a ${dm(Math.abs(existing))} ${existing >= 0 ? 'credit' : 'debit'} balance. How much bad debt expense is recorded?`, answer:Math.round(adj),
      steps:[`Required ending allowance = ${dm(ar)} × ${pct}% = ${dm(target)}`, existing >= 0 ? `Subtract the existing credit: ${dm(target)} − ${dm(existing)} = ${dm(adj)}` : `Add back the debit balance: ${dm(target)} + ${dm(-existing)} = ${dm(adj)}`,
        'The balance-sheet approach sets the target balance; the expense is the amount needed to reach it.'], topic:'aging-the-receivables'}; }},
  {id:'bankrec', title:'Adjusted cash balance', courses:['ac-297p'], make() {
    const bank = drillRand(400, 1500) * 10, dit = drillRand(20, 200) * 10, oc = drillRand(20, 160) * 10; const adj = bank + dit - oc;
    return {prompt:`The bank statement shows ${dm(bank)}. There is a ${dm(dit)} deposit in transit and ${dm(oc)} of outstanding checks. What is the adjusted (true) cash balance?`, answer:adj,
      steps:['Both items are things the bank does not know about yet, so they adjust the bank side.', `${dm(bank)} + ${dm(dit)} deposit in transit − ${dm(oc)} outstanding checks = ${dm(adj)}`], topic:'bank-side-adjustments'}; }},
  {id:'bondint', title:'Bond interest and carrying amount', courses:['ac-297p','ac-362p','far'], make() {
    const face = drillRand(1, 10) * 100000, coupon = drillPick([4, 5, 6]), market = coupon + drillPick([1, 2]); const cv = Math.round(face * (0.9 + Math.random() * .06) / 100) * 100;
    const interest = cv * market / 100, cash = face * coupon / 100, next = cv + interest - cash;
    return {prompt:`Bonds with face value ${dm(face)} pay ${coupon}% interest annually. At the start of the year their carrying amount is ${dm(cv)} and the market rate at issue was ${market}%. Using the effective-interest method, what is the carrying amount after this year’s payment?`, answer:Math.round(next),
      steps:[`Interest expense = ${dm(cv)} × ${market}% = ${usd(interest, 2)}`, `Cash paid = ${dm(face)} × ${coupon}% = ${dm(cash)}`, `Discount amortized = ${usd(interest, 2)} − ${dm(cash)} = ${usd(interest - cash, 2)}`,
        `New carrying amount = ${dm(cv)} + ${usd(interest - cash, 2)} = ${usd(next, 2)}`], topic:'effective-interest-discount-amortization'}; }},
  {id:'breakeven', title:'Break-even units', courses:['ac-298p','ac-366p'], make() {
    const vc = drillRand(5, 60), price = vc + drillRand(5, 40), fc = drillRand(4, 60) * 1000; const be = Math.ceil(fc / (price - vc));
    return {prompt:`A product sells for $${price} and has a variable cost of $${vc} per unit. Fixed costs are ${dm(fc)}. How many units must be sold to break even? Round up to a whole unit.`, answer:be,
      steps:[`Contribution margin per unit = $${price} − $${vc} = $${price - vc}`, `Break-even units = ${dm(fc)} ÷ $${price - vc} = ${labRound(fc / (price - vc), 2)}, rounded up to ${labNum(be)}`], topic:'contribution-margin', unit:'units'}; }},
  {id:'gross', title:'Net sales and gross profit', courses:['ac-297p'], make() {
    const sales = drillRand(80, 300) * 1000, ret = drillRand(1, 8) * 1000, disc = drillRand(1, 5) * 500, cogs = Math.round((sales - ret - disc) * (0.5 + Math.random() * .2) / 100) * 100; const net = sales - ret - disc;
    return {prompt:`Gross sales were ${dm(sales)}, sales returns and allowances ${dm(ret)}, sales discounts ${dm(disc)}, and cost of goods sold ${dm(cogs)}. What is gross profit?`, answer:net - cogs,
      steps:[`Net sales = ${dm(sales)} − ${dm(ret)} − ${dm(disc)} = ${dm(net)}`, `Gross profit = net sales − COGS = ${dm(net)} − ${dm(cogs)} = ${dm(net - cogs)}`], topic:'net-sales-and-gross-margin'}; }},
  {id:'interest', title:'Accrued interest on a note', courses:['ac-297p'], make() {
    const p = drillRand(4, 40) * 2500, r = drillPick([5, 6, 8, 9, 10, 12]), m = drillPick([1, 2, 3, 4, 5, 6, 9]); const a = p * r / 100 * m / 12;
    return {prompt:`A ${dm(p)}, ${r}% note was signed ${m} month${m > 1 ? 's' : ''} before year end. How much interest should be accrued at year end?`, answer:Math.round(a),
      steps:['Interest = principal × annual rate × fraction of the year', `${dm(p)} × ${r}% × ${m}/12 = ${usd(a, 2)}`], topic:'short-term-notes-and-accrued-interest'}; }},
  {id:'prepaid', title:'Prepaid balance after adjustment', courses:['ac-297p'], make() {
    const months = drillPick([6, 12, 24]), per = drillRand(2, 20) * 50, used = drillRand(1, months - 1); const paid = per * months;
    return {prompt:`A company prepaid ${dm(paid)} for ${months} months of insurance. After ${used} month${used > 1 ? 's' : ''} of coverage, what balance should remain in Prepaid Insurance?`, answer:paid - per * used,
      steps:[`Monthly cost = ${dm(paid)} ÷ ${months} = ${dm(per)}`, `Used = ${dm(per)} × ${used} = ${dm(per * used)}`, `Remaining asset = ${dm(paid)} − ${dm(per * used)} = ${dm(paid - per * used)}`], topic:'prepaids-supplies-and-depreciation'}; }},
  {id:'re', title:'Ending retained earnings', courses:['ac-297p'], make() {
    const beg = drillRand(10, 90) * 1000, rev = drillRand(50, 200) * 1000, exp = drillRand(30, 190) * 1000, div = drillRand(0, 20) * 500; const ni = rev - exp;
    return {prompt:`Retained earnings began the year at ${dm(beg)}. Revenue was ${dm(rev)}, expenses ${dm(exp)}, and dividends ${dm(div)}. What is ending retained earnings?`, answer:beg + ni - div,
      steps:[`Net ${ni >= 0 ? 'income' : 'loss'} = ${dm(rev)} − ${dm(exp)} = ${dm(ni)}`, `Ending RE = ${dm(beg)} ${ni >= 0 ? '+' : '−'} ${dm(Math.abs(ni))} − ${dm(div)} = ${dm(beg + ni - div)}`, 'Dividends reduce retained earnings but are not an expense.'], topic:'four-statements-connect'}; }},
  {id:'equity', title:'Equity from the accounting equation', courses:['ac-297p'], make() {
    const assets = drillRand(30, 120) * 1000, liab = drillRand(5, 25) * 1000, borrow = drillRand(1, 10) * 1000, rev = drillRand(1, 10) * 1000;
    return {prompt:`A business has assets of ${dm(assets)} and liabilities of ${dm(liab)}. It then borrows ${dm(borrow)} cash and earns ${dm(rev)} of revenue on account. What is equity now?`, answer:assets - liab + rev,
      steps:[`Starting equity = ${dm(assets)} − ${dm(liab)} = ${dm(assets - liab)}`, `Borrowing raises assets and liabilities equally: no effect on equity.`, `Revenue on account raises receivables and equity by ${dm(rev)}.`, `Equity = ${dm(assets - liab)} + ${dm(rev)} = ${dm(assets - liab + rev)}`], topic:'the-accounting-equation'}; }},
  {id:'discount', title:'Cost of inventory with a purchase discount', courses:['ac-297p'], make() {
    const invoice = drillRand(20, 120) * 100, freight = drillRand(2, 12) * 25, pct = drillPick([1, 2, 3]); const disc = invoice * pct / 100;
    return {prompt:`Merchandise with an invoice price of ${dm(invoice)} is bought on terms ${pct}/10, n/30, FOB shipping point. The buyer pays ${dm(freight)} freight and pays the invoice within 10 days. What is the total cost of the inventory?`, answer:Math.round(invoice - disc + freight),
      steps:[`Discount = ${dm(invoice)} × ${pct}% = ${usd(disc, 2)}`, 'FOB shipping point: the buyer owns the goods in transit, so freight-in is part of inventory cost.', `Cost = ${dm(invoice)} − ${usd(disc, 2)} + ${dm(freight)} = ${usd(invoice - disc + freight, 2)}`], topic:'purchase-discounts-and-freight-in'}; }},
];

function drillInventoryLayers() {
  const base = drillRand(8, 20), units = [drillRand(5, 20) * 10, drillRand(5, 25) * 10, drillRand(5, 25) * 10];
  const costs = [base, base + drillRand(1, 3), base + drillRand(4, 6)];
  const layers = units.map((u, i) => ({units:u, cost:costs[i]}));
  const total = units.reduce((a, b) => a + b, 0);
  return {layers, total, text:`Beginning inventory: ${labNum(units[0])} units at $${costs[0]}. Purchases: ${labNum(units[1])} units at $${costs[1]}, then ${labNum(units[2])} units at $${costs[2]}.`};
}

// ---------- Session logic ----------
function drillStats() {
  try { return JSON.parse(localStorage.getItem(drillStoreKey)) || {}; } catch { return {}; }
}
function drillRecord(kind, correct) {
  try {
    const all = drillStats(), s = all[kind] || {attempts:0, correct:0};
    s.attempts++; if (correct) s.correct++;
    all[kind] = s; localStorage.setItem(drillStoreKey, JSON.stringify(all));
  } catch { /* stats are a convenience only */ }
}
const drillCalcsFor = courseId => drillCalcs.filter(g => g.courses.includes(courseId));
const drillKinds = courseId => [
  ...(courseId === 'ac-297p' ? [['journal', 'Journal entries', 'Read a transaction and build the entry.'], ['classify', 'Account types', 'Name the account type and its normal balance.']] : []),
  ...(drillCalcsFor(courseId).length ? [['calc', 'Calculations', 'Work the numbers, then compare with the full solution.']] : [])
];
function drillMake(kind, courseId, focus) {
  if (kind === 'classify') {
    const [account, type, normal, note] = drillPick(drillAccounts);
    return {account, type, normal, note:note || `${type === 'Asset' || type === 'Expense' ? 'Assets and expenses increase with debits' : 'Liabilities, equity and revenue increase with credits'}, so ${account} normally carries a ${normal.toLowerCase()} balance.`};
  }
  if (kind === 'journal') return drillPick(drillEntries)();
  const pool = drillCalcsFor(courseId), gen = pool.find(g => g.id === focus) || drillPick(pool);
  return {...gen.make(), title:gen.title};
}
function drillStart(kind, courseId, focus='') {
  return {mode:'drill', scope:courseId, kind, focus, item:drillMake(kind, courseId, focus), checked:false, ok:false, response:null, score:0, count:0, streak:0};
}
function drillNext(s) { Object.assign(s, {item:drillMake(s.kind, s.scope, s.focus), checked:false, ok:false, response:null}); }

const drillNet = lines => {
  const map = {};
  for (const [account, side, amount] of lines) map[account] = labRound((map[account] || 0) + (side === 'Dr' ? amount : -amount));
  return map;
};
function drillCheck(s, el) {
  if (s.checked) return false;
  let ok = false, response;
  if (s.kind === 'classify') {
    response = {type:el.type.value, normal:el.normal.value};
    if (!response.type || !response.normal) return false;
    ok = response.type === s.item.type && response.normal === s.item.normal;
  } else if (s.kind === 'journal') {
    response = [0, 1, 2, 3].map(i => [el['acct' + i].value, Number(el['dr' + i].value) || 0, Number(el['cr' + i].value) || 0]);
    const lines = response.filter(([a, d, c]) => a && (d || c)).flatMap(([a, d, c]) => [...(d ? [[a, 'Dr', d]] : []), ...(c ? [[a, 'Cr', c]] : [])]);
    if (!lines.length) return false;
    const want = drillNet(s.item.lines), got = drillNet(lines);
    const keys = new Set([...Object.keys(want), ...Object.keys(got)].filter(k => Math.abs(want[k] || 0) > .004 || Math.abs(got[k] || 0) > .004));
    ok = [...keys].every(k => Math.abs((want[k] || 0) - (got[k] || 0)) < .5);
    const dr = lines.filter(l => l[1] === 'Dr').reduce((t, l) => t + l[2], 0), cr = lines.filter(l => l[1] === 'Cr').reduce((t, l) => t + l[2], 0);
    s.balance = Math.abs(dr - cr) < .005 ? '' : `Your entry does not balance: debits ${usd(dr, 2)}, credits ${usd(cr, 2)}.`;
  } else {
    const raw = String(el.answer.value).replace(/[$,\s]/g, '').replace('−', '-');
    if (raw === '' || !Number.isFinite(Number(raw))) return false;
    response = Number(raw);
    ok = Math.abs(response - s.item.answer) <= Math.max(1, Math.abs(s.item.answer) * .001);
  }
  Object.assign(s, {checked:true, ok, response, count:s.count + 1, score:s.score + (ok ? 1 : 0), streak:ok ? s.streak + 1 : 0});
  drillRecord(s.kind, ok);
  return true;
}

const drillOption = (value, selected, label=value) => `<option value="${labEsc(value)}" ${value === selected ? 'selected' : ''}>${labEsc(label)}</option>`;
function drillAccountOptions(selected) {
  return '<option value="">Account…</option>' + drillTypes.map(type => {
    const list = drillAccounts.filter(a => a[1] === type).map(a => a[0]).sort();
    return list.length ? `<optgroup label="${type}">${list.map(a => drillOption(a, selected)).join('')}</optgroup>` : '';
  }).join('');
}

function drillPanel(c) {
  const kinds = drillKinds(c.id);
  if (!kinds.length) return '';
  const stats = drillStats(), calcs = drillCalcsFor(c.id);
  const stat = k => stats[k]?.attempts ? `${stats[k].correct}/${stats[k].attempts} all time` : 'Not tried yet';
  return `<section class="panel padded practice drill-panel"><span class="lab-tag">New · unlimited</span><h2>Skill drills</h2>
    <p>Fresh numbers every time. After each answer you get the complete worked solution, so you can practise a skill until it feels automatic.</p>
    <div class="drill-cards">${kinds.map(([k, name, desc]) => `<div class="drill-card"><h3>${name}</h3><p class="help">${desc}</p>
      ${k === 'calc' ? `<label class="field"><span class="sr-only">Calculation type</span><select id="drill-focus"><option value="">Mixed calculations</option>${calcs.map(g => `<option value="${g.id}">${labEsc(g.title)}</option>`).join('')}</select></label>` : ''}
      <div class="split"><small class="muted">${stat(k)}</small><button type="button" class="btn green" data-action="drill" data-kind="${k}" data-c="${c.id}">Start</button></div></div>`).join('')}</div></section>`;
}
// lessonHref(topicId) returns a link to that lesson in the current course, or '' when the course has no such lesson.
function drillView(s, lessonHref=() => '') {
  const it = s.item, names = {journal:'Journal entries', classify:'Account types', calc:'Calculations'};
  const head = `<div class="split"><span class="eyebrow">Skill drill · ${names[s.kind]}${s.kind === 'calc' ? ' · ' + labEsc(it.title) : ''}</span><button type="button" class="text-link" data-action="end">End drill</button></div>
    <div class="drill-score"><span><strong>${s.score}</strong> / ${s.count} correct</span><span>Streak <strong>${s.streak}</strong>${s.streak >= 3 ? ' 🔥' : ''}</span></div>`;
  const dis = s.checked ? 'disabled' : '';
  let body = '', feedback = '';
  if (s.kind === 'classify') {
    const r = s.response || {};
    body = `<h2>${labEsc(it.account)}</h2><div class="lab-grid two"><label class="field">Account type<select name="type" required ${dis}><option value="">Choose…</option>${drillTypes.map(t => drillOption(t, r.type)).join('')}</select></label>
      <label class="field">Normal balance<select name="normal" required ${dis}><option value="">Choose…</option>${drillOption('Debit', r.normal)}${drillOption('Credit', r.normal)}</select></label></div>`;
    if (s.checked) feedback = `<strong>${s.ok ? 'Correct.' : `Answer: ${it.type}, ${it.normal.toLowerCase()} balance.`}</strong> ${labEsc(it.note)}`;
  } else if (s.kind === 'journal') {
    const r = s.response || [];
    body = `<h2>${labEsc(it.text)}</h2><table class="lab-table drill-entry"><thead><tr><th>Account</th><th>Debit ($)</th><th>Credit ($)</th></tr></thead><tbody>${[0, 1, 2, 3].map(i =>
      `<tr><td><select name="acct${i}" aria-label="Line ${i + 1} account" ${dis}>${drillAccountOptions(r[i]?.[0] || '')}</select></td>
      <td><input name="dr${i}" type="number" min="0" step="0.01" inputmode="decimal" aria-label="Line ${i + 1} debit" value="${r[i]?.[1] || ''}" ${dis}></td>
      <td><input name="cr${i}" type="number" min="0" step="0.01" inputmode="decimal" aria-label="Line ${i + 1} credit" value="${r[i]?.[2] || ''}" ${dis}></td></tr>`).join('')}</tbody></table>
      <p class="help">Use as many lines as you need. Line order does not matter.</p>`;
    if (s.checked) feedback = `<strong>${s.ok ? 'Correct.' : 'Not quite. Here is the entry:'}</strong>${s.balance ? ` <span class="lab-warn-inline">${labEsc(s.balance)}</span>` : ''}${labEntry(it.lines)}<p>${labEsc(it.why)}</p>`;
  } else {
    body = `<h2>${labEsc(it.prompt)}</h2><label class="field">Your answer${it.unit === 'units' ? ' (units)' : ' ($)'}<input name="answer" inputmode="decimal" autocomplete="off" value="${s.response ?? ''}" ${dis} required></label>`;
    if (s.checked) feedback = `<strong>${s.ok ? 'Correct.' : 'Answer: ' + (it.unit === 'units' ? labNum(it.answer) + ' units' : usd(it.answer)) + '.'}</strong><ol class="steps">${it.steps.map(st => `<li>${labEsc(st)}</li>`).join('')}</ol>`;
  }
  const actions = s.checked ? `<div class="feedback ${s.ok ? 'ok' : 'bad'}" role="status">${feedback}</div><div class="actions"><button type="button" class="btn green" data-action="drill-next">Next problem →</button>${it.topic && lessonHref(it.topic) ? `<a class="text-link" href="${lessonHref(it.topic)}">Review the lesson →</a>` : ''}</div>`
    : `<div class="actions"><button class="btn green">Check answer</button></div>`;
  return `<section class="panel padded practice drill">${head}<form id="drill-form" autocomplete="off">${body}${actions}</form></section>`;
}
