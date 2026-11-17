// Original starter lessons. Each topic pairs instruction with recall and application.
const term = 'Spring 2027';
function lesson(title, reading, prompt, answer, question, choices, correct, explanation) {
  return { id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title, reading, prompt, answer,
    question, choices, correct, explanation, done: false, due: '', level: 0, attempts: 0, hits: 0 };
}

function starterWorkspace() {
  const definitions = [
    ['AC 297P', 'Principles of Accounting I', [
      lesson('The accounting equation',
        'A balance sheet describes a business at one point in time. Assets are resources the business controls. Liabilities are its obligations. Equity is the residual interest after liabilities are deducted.\n\nAssets = Liabilities + Equity\n\nSuppose a shop has $12,000 in cash and owes $5,000. Its equity is $7,000. If it borrows another $2,000, cash and liabilities both rise by $2,000. The borrowing creates no revenue, so equity stays at $7,000.',
        'A business borrows cash. Which parts of the accounting equation change, and why?', 'Assets and liabilities increase by the same amount. The cash comes with an obligation to repay it, so equity is unchanged.',
        'A business has $24,000 in assets and $9,000 in liabilities. It pays $2,000 of an existing payable in cash. What is its equity immediately afterward?', ['$13,000', '$15,000', '$17,000'], 1,
        'After the payment, assets are $22,000 and liabilities are $7,000. Their difference is still $15,000.'),
      lesson('Debits and credits',
        'Debit means the left side of an account and credit means the right. Assets and expenses normally increase with debits. Liabilities, equity and revenue normally increase with credits. Every journal entry has equal debit and credit totals.\n\nA $500 cash sale of services debits Cash and credits Service Revenue. A collection on an old invoice debits Cash and credits Accounts Receivable. The second transaction earns no new revenue.',
        'A client pays an invoice that you recorded as revenue last month. What entry records the receipt?', 'Debit Cash and credit Accounts Receivable. The collection exchanges one asset for another.',
        'You buy $800 of supplies on account and will use them next month. Which entry records the purchase?', ['Debit Supplies and credit Accounts Payable', 'Debit Accounts Payable and credit Supplies', 'Debit Supplies Expense and credit Cash'], 0,
        'Unused supplies are an asset. Buying on account creates a liability.'),
      lesson('Adjusting entries',
        'Under accrual accounting, the date of a cash movement can differ from the period in which a business earns revenue or incurs an expense. Adjusting entries align the accounts with what happened during the period.\n\nA firm pays $1,200 on January 1 for 12 months of insurance, initially debiting Prepaid Insurance. At January 31 it debits Insurance Expense and credits Prepaid Insurance for $100. The remaining $1,100 represents future coverage.',
        'Why does using prepaid insurance require an adjusting entry even if no cash moves?', 'Coverage has been consumed. Debit Insurance Expense and credit Prepaid Insurance for the expired portion.',
        'On April 1 a firm prepays $2,400 for six months of evenly provided coverage. What is the prepaid balance after the April 30 adjustment?', ['$400', '$2,400', '$2,000'], 2, 'One month costs $400. The remaining five months represent a $2,000 asset.')
    ]],
    ['AC 298P', 'Principles of Accounting II', [
      lesson('Contribution margin', 'Contribution margin is sales less variable costs. Each unit contributes its selling price less variable cost toward fixed costs and then profit.\n\nA product sells for $50 and costs $30 per unit to produce and sell in variable costs. Each sale contributes $20. With $6,000 of fixed costs, the break-even volume is 300 units, assuming the costs and price hold over this range.',
        'How do you compute break-even volume for a single product?', 'Divide total fixed costs by contribution margin per unit.', 'Price is $80, variable cost is $50 per unit and fixed costs are $9,000. What is break-even volume?', ['180 units', '300 units', '450 units'], 1, 'Each unit contributes $30. Divide $9,000 by $30.')
    ]],
    ['AC 361P', 'Financial Reporting I', [
      lesson('Estimating credit losses', 'An allowance reduces gross accounts receivable to the amount expected to be collected. Under a balance-sheet approach, the estimate sets a target ending allowance. The adjustment bridges the existing balance and the target.\n\nIf the allowance already has a $300 credit balance and the target is $1,000, debit credit loss expense and credit the allowance for $700.',
        'How does writing off a receivable against an existing allowance affect net receivables?', 'Gross receivables and the allowance both decrease by the same amount. Net receivables stay the same.',
        'An aging analysis calls for a $3,200 allowance. It already has an $800 credit balance. How large is the adjustment?', ['$2,400', '$3,200', '$4,000'], 0, 'The existing $800 credit plus a $2,400 credit reaches the target.')
    ]],
    ['AC 362P', 'Financial Reporting II', [
      lesson('Amortizing a bond discount', 'When a bond’s stated coupon rate is below the market yield at issuance, it sells at a discount. Under the effective-interest method, interest expense equals the opening carrying amount times the market rate for the period.\n\nIf expense exceeds the coupon payment, the difference increases the carrying amount toward face value.',
        'For a bond issued at a discount, why does its carrying amount increase after a coupon payment?', 'Effective interest expense exceeds the cash coupon. Amortizing the difference reduces the unamortized discount.',
        'A bond opens the year at $95,000, has a 6% effective annual yield and pays a $5,000 annual coupon. What is its year-end carrying amount?', ['$94,300', '$95,700', '$100,700'], 1, 'Interest expense is $5,700. Add the $700 difference to $95,000.')
    ]],
    ['AC 365P', 'Financial Reporting III', [
      lesson('Consolidation eliminations', 'Consolidated statements present a parent and its controlled subsidiaries as one economic entity. Transactions between group members must be eliminated.\n\nIf the parent lends a subsidiary $8,000, the parent has a receivable and the subsidiary has a payable. Both balances disappear in consolidation because the group cannot owe money to itself.',
        'Why eliminate an intercompany loan when consolidating?', 'The group’s receivable and payable represent opposite sides of one internal transaction.',
        'A parent shows $50,000 of receivables, including $6,000 owed by a subsidiary. The subsidiary has $12,000 of external receivables. What are consolidated receivables?', ['$50,000', '$62,000', '$56,000'], 2, 'Combine both balances and remove the $6,000 internal receivable.')
    ]],
    ['AC 366P', 'Management Accounting', [
      lesson('Relevant costs', 'A cost is relevant to a decision if it is a future cost that differs between alternatives. Past spending is sunk. A fixed cost may be relevant if the decision actually eliminates it.\n\nFor a make-or-buy decision, compare the supplier price with the costs avoided by outsourcing. Include opportunity costs if outsourcing frees capacity for a profitable alternative.',
        'Which two conditions make a cost relevant to a choice?', 'It is a future cost and differs between the available alternatives.',
        'A part costs $14 in variable cost and $6 in allocated fixed cost. The fixed cost continues either way. A supplier charges $17 and idle capacity has no other use. Which option costs less?', ['Make by $3 per unit', 'Buy by $3 per unit', 'Both cost the same'], 0, 'Only the $14 variable cost is avoided. Making saves $3 against the supplier price.')
    ]],
    ['AC 460P', 'Accounting Information Systems and Controls', [
      lesson('Segregation of duties', 'Separating authorization, custody and recordkeeping limits the ability of one person to commit and conceal an error or fraud.\n\nFor example, a clerk who creates vendors should not also have unilateral power to release payments. An independent review of new vendors helps detect changes that bypass approval.',
        'Why separate vendor creation from payment approval?', 'One employee acting alone would otherwise be able to create a fictitious vendor and pay it.',
        'Which assignment creates the clearest conflict?', ['A supervisor reviews exception reports', 'A cashier handles receipts and independently reconciles the bank account', 'A buyer requests approval before placing an order'], 1, 'The cashier could take cash and conceal the shortage in the reconciliation.')
    ]],
    ['AC 462P', 'Federal Income Taxation I', [
      lesson('Marginal tax rates', 'A marginal rate applies to the next increment of taxable income in a bracket. An average rate compares total tax with the chosen income base.\n\nIn a hypothetical system with 10% on the first $10,000 and 20% on the next $10,000, a person with $15,000 of taxable income pays $2,000 before credits. Only $5,000 falls in the second bracket.',
        'What is the difference between a marginal rate and an average tax rate?', 'The marginal rate applies to an additional unit of taxable income. The average is total tax divided by the stated income base.',
        'Using the hypothetical brackets above, how much additional tax arises if taxable income rises from $15,000 to $16,000?', ['$100', '$160', '$200'], 2, 'The full $1,000 increment falls in the 20% bracket.')
    ]],
    ['AC 463P', 'Financial Statement Auditing I', [
      lesson('Testing assertions', 'An assertion is a claim implicit in a financial statement. Existence asks whether a recorded item is real. Completeness asks whether everything that should be recorded appears in the records.\n\nTo test whether listed inventory exists, select items from the listing and inspect them on the floor. To test completeness, select physical items and trace them to the listing.',
        'Which direction would you test to find inventory omitted from the listing?', 'Start with items on the warehouse floor and trace them to the inventory listing.',
        'An auditor selects recorded equipment and inspects the physical items. Which assertion does this primarily test?', ['Existence', 'Completeness', 'Valuation'], 0, 'The auditor starts with a recorded balance and seeks evidence that the assets exist.')
    ]],
    ['AC 465P', 'Federal Income Taxation II', [
      lesson('Book and tax differences', 'Financial reporting and tax rules can recognize an item in different periods. A temporary difference reverses over time. A permanent difference never reverses.\n\nConsider equipment with the same total depreciable cost for book and tax purposes. If tax depreciation is accelerated, cumulative depreciation differs today but converges when the asset is fully depreciated under both methods.',
        'How can you distinguish a temporary book–tax difference from a permanent one?', 'Ask whether the difference in cumulative recognition will reverse in a future period.',
        'Book and tax methods deduct the same total equipment cost over different schedules. What type of difference results?', ['Permanent', 'Temporary', 'No difference in any year'], 1, 'Only the timing differs. The cumulative deductions converge.')
    ]],
    ['FAR', 'Financial Accounting and Reporting', [
      lesson('Operating cash flow', 'The indirect method reconciles net income to cash from operating activities. Reverse noncash expenses and account for timing differences in operating assets and liabilities.\n\nA rise in trade receivables means recognized revenue exceeded collections, all else equal. Subtract that increase from net income. Add back depreciation because it reduced net income without consuming cash during the period.',
        'How do depreciation expense and an increase in trade receivables enter an indirect operating cash flow reconciliation?', 'Add back depreciation expense and subtract the increase in trade receivables.',
        'Net income is $40,000. Depreciation is $6,000 and receivables increased $3,000. With no other adjustments, what is operating cash flow?', ['$37,000', '$49,000', '$43,000'], 2, '$40,000 + $6,000 − $3,000 = $43,000.')
    ]],
    ['AUD', 'Auditing and Attestation', [
      lesson('Evidence quality', 'Audit evidence must be sufficient in quantity and appropriate in quality. Relevance depends on the assertion being tested. Reliability depends on the source and the circumstances in which evidence was obtained.\n\nA confirmation received directly from an independent customer may support the existence of a receivable. It does not by itself establish that the full amount will be collected.',
        'Why might a positive receivable confirmation be insufficient for valuation?', 'The customer may agree that it owes the balance yet be unable to pay it.',
        'Which procedure most directly helps assess collectibility of a year-end receivable?', ['Inspect a sales brochure', 'Inspect subsequent cash collections against the balance', 'Count inventory at year end'], 1, 'Cash received against that receivable provides evidence about the amount recoverable.')
    ]],
    ['REG', 'Taxation and Regulation', [
      lesson('Basis and gain', 'In a simplified sale, realized gain equals amount realized minus adjusted basis. Begin with cost basis, incorporate capital additions and reduce basis for applicable adjustments such as depreciation.\n\nA machine purchased for $12,000 with $4,000 of accumulated depreciation has an adjusted basis of $8,000. A sale for $10,000 cash, with no selling costs or other adjustments, produces a $2,000 realized gain.',
        'How do you compute realized gain in a simple cash sale?', 'Subtract adjusted basis from amount realized. Account for any facts affecting either amount.',
        'Equipment cost $30,000 and has $9,000 of depreciation. It sells for $25,000 cash with no selling costs. What gain is realized?', ['$4,000', '$5,000', '$16,000'], 0, 'Adjusted basis is $21,000, leaving a $4,000 gain.')
    ]],
    ['ISC', 'Information Systems and Controls', [
      lesson('Access reviews', 'Access rights should match current responsibilities. A periodic review compares assigned permissions with job needs and documents approval or removal.\n\nAn employee who transfers departments may legitimately gain new permissions but retain old ones unnecessarily. Comparing current access with the new role can reveal this accumulation.',
        'What evidence would show that an access review led to removal of an inappropriate permission?', 'A documented review decision linked to a completed removal and verification of the resulting access.',
        'An employee moves from payroll to purchasing. Which action best addresses unnecessary access?', ['Change the employee’s password', 'Retain all prior access for convenience', 'Review both roles and remove unnecessary payroll rights'], 2, 'Reviewing permissions against current duties addresses excess access after a transfer.')
    ]]
  ];
  const courses = definitions.map(([code, title, topics], i) => ({
    id: code.toLowerCase().replace(/ /g, '-'), code, title, type: i < 10 ? 'Course' : 'Exam',
    provider: i < 10 ? 'University of North Alabama' : 'U.S. CPA Exam',
    status: i === 0 ? 'In focus' : 'Planned', term: i === 0 ? term : '',
    credits: i < 10 ? '3' : '', tentative: code === 'ISC', topics, notes: []
  }));
  return expandCurriculum({version: 1, courses, last: courses[0].id});
}

// A one-time addition to the original AC 297P starter set, also used for legacy backups.
function expandPrinciples(workspace) {
  const c = workspace.courses.find(item => item.id === 'ac-297p');
  if (!c || c.principlesEdition >= 2) return workspace;
  const topics = [
    lesson('Closing the books',
      'At period end, revenue and expense balances transfer into retained earnings through closing entries. Dividends reduce retained earnings separately. Assets and liabilities carry forward. A company beginning with $8,000 of retained earnings, earning $3,000 and declaring $500 of dividends ends with $10,500.',
      'Which balances reset at year-end, and where does the period’s profit go?', 'Revenue, expense and dividend accounts reset. Profit increases retained earnings, and dividends reduce it.',
      'Opening retained earnings are $9,000. Revenue is $8,000, expenses are $5,000 and dividends are $700. Find ending retained earnings.',
      ['$12,000','$11,300','$16,300'],1,'Net income is $3,000. Add it to $9,000, then subtract $700. Dividends are a distribution of earnings.'),
    lesson('Merchandising and gross profit',
      'In a perpetual inventory system, a sale creates two entries. Record revenue at the selling price. Then debit cost of goods sold and credit inventory at cost. Selling goods costing $70 for $100 on account creates a $100 receivable and $30 gross profit.',
      'What two entries record a credit sale of merchandise under perpetual inventory?', 'Debit Accounts Receivable and credit Sales. Debit Cost of Goods Sold and credit Inventory for the cost of the units sold.',
      'A retailer sells goods for $900 on account. Their cost was $540. What is the immediate change in total assets?',
      ['Increase $900','Decrease $540','Increase $360'],2,'Receivables rise $900 and inventory falls $540. The net increase equals the $360 gross profit.'),
    lesson('Bank reconciliation',
      'Match the bank statement to the cash ledger at the same date. Adjust the bank side for deposits in transit and outstanding checks. Adjust the book side for fees, returned customer payments and collections first reported by the bank. For example, a $10,000 bank balance plus a $600 deposit in transit less $900 outstanding checks gives $9,700 adjusted cash.',
      'Why does an outstanding check affect the bank side of a reconciliation?', 'The company already reduced its cash ledger when it wrote the check. The bank has yet to record the payment.',
      'The statement shows $8,000. A $500 deposit is in transit, $800 of checks are outstanding and a $40 fee is already on the statement. What is adjusted bank cash?',
      ['$7,700','$7,660','$8,300'],0,'Add $500 and subtract $800. The bank already deducted the fee, so the company records it only on the book side.'),
    lesson('Receivables and the allowance',
      'Report trade receivables net of estimated credit losses. An aging schedule gives a target ending allowance. If it calls for $1,000 and the allowance already has a $200 credit, record $800 of expense. A later write-off debits the allowance and credits receivables.',
      'Why does a write-off under the allowance method leave net receivables unchanged?', 'The write-off reduces both the gross asset and its contra-asset by the same amount.',
      'Gross receivables are $40,000 and the allowance is $1,500. A $500 balance is written off against it. What is the new net receivable?',
      ['$38,000','$38,500','$39,000'],1,'After the write-off, gross receivables are $39,500 and the allowance is $1,000.'),
    lesson('Inventory cost flows',
      'Assign the cost of goods available between units sold and units remaining. Under FIFO, the earliest costs go to cost of goods sold. If 10 units cost $4 each and 10 later units cost $5 each, selling 12 assigns $50 to cost of goods sold and leaves $40 in inventory. The two amounts reconcile to the $90 available.',
      'When FIFO purchase costs rise, which cost layers remain in inventory?', 'The newest layers remain because FIFO charges the oldest costs to goods sold first.',
      'A shop has 5 units at $10 and buys 8 more at $12. It then sells 7. Under FIFO, what is ending inventory?',
      ['$72','$74','$84'],0,'Six of the $12 units remain. The $74 figure is the cost of the seven units sold.'),
    lesson('Equity method investments',
      'When the equity method applies, the investor starts at cost, records its share of the investee’s earnings, and reduces the investment for dividends received. Assume no basis differences or other adjustments. A 30% holding in a company earning $10,000 generates $3,000 of investment income.',
      'Why do dividends reduce an equity method investment?', 'The investor already recognized its share of earnings. The distribution converts part of the investment balance to cash.',
      'An equity method investment cost $20,000. The investor’s share of earnings is $3,000 and it receives $500 in dividends. Find the carrying amount.',
      ['$20,500','$23,500','$22,500'],2,'Start with cost, add the share of earnings and subtract the dividend.'),
    lesson('Depreciation and asset cost',
      'Include costs necessary to bring equipment to its intended location and working condition. Straight-line depreciation spreads cost less expected residual value over useful life. Equipment costing $20,000 with $2,000 installation, $2,000 residual value and a five-year life has annual depreciation of $4,000.',
      'Why subtract residual value when computing depreciation?', 'Residual value is the amount expected to remain at the end of useful life. Only the depreciable amount is allocated.',
      'Equipment costs $24,000 plus $2,000 installation. Residual value is $1,000 and life is five years. What is one full year’s straight-line expense?',
      ['$4,600','$5,000','$5,200'],1,'The installed cost is $26,000. Divide the $25,000 depreciable amount by five.'),
    lesson('Asset disposals',
      'Bring depreciation up to the disposal date. Subtract accumulated depreciation from original cost to get carrying amount. Compare proceeds with carrying amount. If a machine originally cost $15,000 and accumulated depreciation is $9,000, a $5,000 sale produces a $1,000 loss.',
      'What amounts does a disposal entry remove from the ledger?', 'Remove the original asset cost and its accumulated depreciation. Record proceeds and the gain or loss needed to balance the entry.',
      'An asset cost $50,000 and has $32,000 of accumulated depreciation at sale. It sells for $20,000. What is the result?',
      ['$2,000 gain','$30,000 loss','$2,000 loss'],0,'The carrying amount is $18,000. Proceeds exceed it by $2,000.'),
    lesson('Depletion and amortization',
      'A resource consumed through extraction can use a per-unit depletion rate. Divide the depletable base by estimated recoverable units. A $60,000 base over 30,000 tons allocates $2 per ton extracted to inventory. This cost reaches expense as the extracted units are sold. A finite-lived intangible asset instead undergoes amortization over its useful life.',
      'When do depletion costs on extracted but unsold units reach cost of goods sold?', 'Extraction assigns the depletion cost to inventory. Selling the units moves their cost into cost of goods sold.',
      'A quarry has a $90,000 depletable base and 30,000 estimated tons. It extracts 4,000 tons and sells 3,000. How much depletion cost remains in inventory from this extraction?',
      ['$9,000','$12,000','$3,000'],2,'The remaining 1,000 tons carry $3 of depletion cost per ton.'),
    lesson('Accrued interest and payroll',
      'Record interest as time passes, even when the contract postpones payment. For a $10,000 note at 6% simple annual interest, two months incur $100. For payroll, record gross wages as expense. Employee withholdings create liabilities until remitted, and the remaining net pay goes to employees.',
      'How do gross wages, employee withholdings and cash paid fit in a payroll entry?', 'Debit wages expense for gross pay. Credit withholding liabilities and credit cash for the remaining net pay.',
      'Gross wages are $5,000 and employee withholdings total $900. Ignoring employer payroll taxes, what expense and cash payment are recorded?',
      ['$4,100 expense and $4,100 cash','$5,000 expense and $4,100 cash','$5,900 expense and $5,000 cash'],1,'Employees earned $5,000. The employer pays $4,100 to them and owes $900 to others.'),
    lesson('Long-term borrowing',
      'An installment payment can include both interest and principal. Compute interest on the opening principal for the payment period. The rest reduces the debt. An annual $2,500 payment on a $10,000 loan at 5% consists of $500 interest and $2,000 principal.',
      'Why does the interest share of equal payments decline on an amortizing fixed-rate loan?', 'Principal outstanding falls after each payment. Applying the same periodic rate to a smaller balance produces less interest.',
      'A loan opens at $20,000 with 6% annual interest. After one full year the borrower pays $4,000. What principal remains?',
      ['$16,000','$17,200','$18,800'],1,'Interest is $1,200. The remaining $2,800 reduces principal.'),
    lesson('Corporate equity',
      'Share issues bring in contributed capital. Earnings retained in the business accumulate separately. If a corporation issues 100 shares of $1 par stock for $8 each, debit cash $800, credit common stock $100 and credit additional paid-in capital $700.',
      'How does issuing shares for cash affect net income and total equity?', 'Total equity increases by the proceeds. A contribution from owners produces no revenue or net income.',
      'A company issues 1,000 shares of $2 par stock for $9 each. What is the increase in additional paid-in capital?',
      ['$2,000','$9,000','$7,000'],2,'Of the $9,000 proceeds, $2,000 is par value and $7,000 is additional paid-in capital.')
  ];
  const existing = new Set(c.topics.map(t => t.id));
  c.topics.push(...topics.filter(t => !existing.has(t.id)));
  c.principlesEdition = 2;
  return workspace;
}

// Each case changes its figures while keeping the accounting relationships intact.
const caseTitles = ['Month-end close', 'Inventory and gross profit', 'Bank reconciliation'];
function makeCase(kind) {
  const units = (low, high) => low + Math.floor(Math.random() * (high - low + 1));
  const money = amount => '$' + amount.toLocaleString('en-US');
  if (kind === 0) {
    const monthly = units(8,24)*25, billed=units(6,12)*1000, wages=units(8,20)*100, collected=units(1,4)*500;
    return {story:`On June 1, a new consulting firm pays ${money(monthly*12)} for 12 months of insurance and records a prepaid asset. In June it earns and bills ${money(billed)}, collects ${money(collected)} of those invoices, and incurs ${money(wages)} in wages. Assume one month of coverage expires and there are no other revenues or expenses.`,
      parts:[
        ['June insurance expense',monthly,`${money(monthly*12)} ÷ 12 = ${money(monthly)}. Only June coverage has expired.`,'adjusting-entries'],
        ['June 30 accounts receivable',billed-collected,`Billings less collections = ${money(billed)} − ${money(collected)}. Collecting a receivable does not earn revenue again.`,'debits-and-credits'],
        ['June net income',billed-wages-monthly,`Earned revenue less wages and insurance = ${money(billed)} − ${money(wages)} − ${money(monthly)}.`,'closing-the-books']
      ]};
  }
  if (kind === 1) {
    const first=units(6,12), oldPrice=units(8,14), newPrice=oldPrice+units(2,6), extra=units(2,6), bought=extra+units(3,8), price=newPrice+units(4,10);
    const sold=first+extra, cost=first*oldPrice+extra*newPrice;
    return {story:`A store opens with ${first} units at ${money(oldPrice)} each. It buys ${bought} more at ${money(newPrice)} each, then sells ${sold} units for ${money(price)} each. Use FIFO. There are no discounts, returns or other purchases.`,
      parts:[
        ['Cost of goods sold',cost,`The sale uses all ${first} older units at ${money(oldPrice)} and ${extra} newer units at ${money(newPrice)}.`,'inventory-cost-flows'],
        ['Ending inventory at cost',(bought-extra)*newPrice,`The ${bought-extra} remaining units all came from the ${money(newPrice)} layer.`,'inventory-cost-flows'],
        ['Gross profit',sold*price-cost,`Sales of ${money(sold*price)} less cost of goods sold of ${money(cost)}.`,'merchandising-and-gross-profit']
      ]};
  }
  const bank=units(60,120)*100, deposit=units(4,12)*100, checks=units(3,10)*100, fee=units(2,7)*10, collection=units(3,8)*100;
  const cash=bank+deposit-checks;
  return {story:`The bank statement closes at ${money(bank)}. A ${money(deposit)} deposit is in transit and ${money(checks)} of checks are outstanding. The cash ledger closes at ${money(cash-collection+fee)}. The bank collected ${money(collection)} of receivables and charged a ${money(fee)} fee. Both appear only on the bank statement.`,
    parts:[
      ['Adjusted bank balance',cash,`Add the ${money(deposit)} deposit in transit and subtract ${money(checks)} of outstanding checks.`,'bank-reconciliation'],
      ['Net increase to record in the cash ledger',collection-fee,`Record the ${money(collection)} collection and deduct the ${money(fee)} fee.`,'bank-reconciliation'],
      ['Change in net income from the bank collection and fee (signed)',-fee,`The collection exchanges receivables for cash. The fee reduces income by ${money(fee)}.`,'debits-and-credits']
    ]};
}

