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
  return {version: 1, courses, last: courses[0].id};
}
