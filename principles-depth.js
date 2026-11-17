// AC 297P enhanced study curriculum. Chapter grouping is a study aid, not an official UNA chapter enumeration.
const principlesChapters = [
  {
    "id": "foundations",
    "title": "Accounting foundations and financial statements",
    "goal": "Understand how business events flow into the financial statements.",
    "units": [
      [
        "Who uses financial statements",
        "External users such as lenders and investors rely on comparable financial statements; managers use financial and operating data for decisions. The accounting entity is distinct from its owners. The balance sheet is dated at a point in time; income and cash-flow statements cover a period.",
        "A bank asks whether a firm can repay a loan. Begin with cash, receivables, upcoming liabilities, and operating cash flow; net income alone cannot prove near-term liquidity.",
        "Do not confuse profitability with the cash available to pay a bill.",
        "Which report describes assets and liabilities on December 31?",
        "Balance sheet|Income statement|Statement of cash flows",
        0,
        "The balance sheet is a snapshot as of a specified date."
      ],
      [
        "Four statements connect",
        "Net income increases retained earnings, less distributions. Ending retained earnings enters the balance sheet. The statement of cash flows explains changes in cash, and ending cash must match the balance sheet. A statement of changes in equity bridges opening to closing owners' claims.",
        "Revenue $18,000, expenses $13,000 and dividends $1,000 produce $5,000 profit and a $4,000 increase in retained earnings.",
        "A distribution to owners is not an operating expense.",
        "Income $5,000 and dividends $1,000 change retained earnings by:",
        "$6,000|$4,000|$5,000",
        1,
        "Profit adds $5,000; dividends subtract $1,000."
      ],
      [
        "Transaction effects",
        "Analyze each event by identifying the accounts, whether each is an asset, liability or equity account, and the direction of change. Most economic events change two or more accounts. A balanced equation is a necessary check, not evidence that an entry is correct.",
        "Collect $900 of an existing receivable: Cash +$900 and Accounts Receivable −$900. Total assets, liabilities, equity and net income remain unchanged.",
        "Cash received is not always earned revenue.",
        "A customer settles an old invoice. What changes?",
        "Total assets increase|Cash rises and receivables fall|Revenue rises again",
        1,
        "The sale was recognized earlier. Collection only exchanges assets."
      ],
      [
        "Accrual compared with cash accounting",
        "Accrual reporting recognizes earned revenue and incurred costs in the appropriate period, even when payment occurs later. Cash-basis reporting recognizes cash receipts and payments. The difference is particularly important at period boundaries.",
        "A consultant completes $3,000 of work in December and receives payment in January. December accrual revenue is $3,000, and Accounts Receivable rises $3,000.",
        "Do not treat the billing or collection date as automatically determining revenue.",
        "December work billed and paid in January creates December accrual revenue of:",
        "$0|$1,500|$3,000",
        2,
        "Revenue is earned when the performance is completed under the stated facts."
      ]
    ]
  },
  {
    "id": "recording",
    "title": "Journals, ledgers and the trial balance",
    "goal": "Record and trace transactions accurately with double-entry bookkeeping.",
    "units": [
      [
        "Chart of accounts",
        "A chart of accounts gives consistent account names or codes for assets, liabilities, equity, revenue and expenses. Classify the underlying right or obligation before choosing an account. A ledger stores each account's running balance.",
        "Buying paper for use later increases Supplies, an asset; consuming it later creates Supplies Expense. Two different events require two different entries.",
        "An account's name does not determine whether cash was paid.",
        "Unused office supplies are normally first classified as:",
        "An asset|Revenue|An expense that must remain forever",
        0,
        "Future benefits from unused supplies are recorded as an asset."
      ],
      [
        "Normal balances and T-accounts",
        "Debit means left and credit means right, not good and bad. Assets, expenses and dividends ordinarily carry debit balances; liabilities, equity and revenue ordinarily carry credit balances. A T-account visualizes increases and decreases.",
        "Cash begins with a $2,000 debit balance. A $600 cash sale adds a $600 debit; a $450 rent payment adds a $450 credit. Ending Cash is a $2,150 debit.",
        "Memorizing debit as increase fails for liabilities and revenue.",
        "Cash starts at $2,000. Debit $600 and credit $450. Ending balance?",
        "$2,150 debit|$1,850 debit|$3,050 credit",
        0,
        "2,000 + 600 − 450 = 2,150 debit."
      ],
      [
        "Journalize then post",
        "A journal records dated transactions in debit/credit form with narration. Posting transfers each journal line to its individual ledger account. A reference between journal and ledger enables tracing and helps locate errors.",
        "Pay $700 rent in cash: debit Rent Expense $700 and credit Cash $700. Post both lines; then the Rent Expense account increases while the Cash account decreases.",
        "An entry that balances may still use the wrong account.",
        "Paying rent immediately requires which debit?",
        "Cash|Accounts Payable|Rent Expense",
        2,
        "Rent is consumed this period; debit expense and credit cash."
      ],
      [
        "Prepare and interpret a trial balance",
        "An unadjusted trial balance lists account balances and checks that total debits equal total credits. It does not guarantee that every transaction was entered, dated correctly or classified properly. Adjusting entries lead to an adjusted trial balance.",
        "If debit balances total $42,400 and credits total $42,100, a $300 imbalance must be located before preparing the statements.",
        "Equal debit and credit totals do not rule out omitted or duplicated balanced entries.",
        "Which error might escape a balanced trial balance?",
        "Omitting an entire balanced sale|Recording only its debit|Adding a debit column incorrectly",
        0,
        "An entirely omitted entry does not disturb debit/credit equality."
      ]
    ]
  },
  {
    "id": "adjustments",
    "title": "Accruals, deferrals and adjusting entries",
    "goal": "Get revenue and expenses into the periods to which they belong.",
    "units": [
      [
        "Accrued revenue",
        "Accrued revenue has been earned but not yet billed or collected. At period-end record a receivable and revenue, then later collect the receivable. The later cash receipt must not repeat the revenue.",
        "Work worth $1,800 is completed December 29 and billed January 5. December entry: debit Accounts Receivable $1,800; credit Service Revenue $1,800.",
        "Billing in January does not move earned December revenue to January.",
        "Which December account increases for unbilled earned services?",
        "Accounts Receivable|Unearned Revenue|Accounts Payable",
        0,
        "An enforceable right to payment is an asset."
      ],
      [
        "Accrued expenses",
        "When goods or services have been consumed but not paid for, debit the relevant expense and credit a payable. Paying the obligation later reduces the liability rather than creating a second expense.",
        "Employees earn $2,400 in the last week of December and are paid January 4. December: debit Wages Expense $2,400 and credit Wages Payable $2,400.",
        "The payroll date alone does not establish the expense period.",
        "Unpaid December wages should create:",
        "Revenue and cash|Wages expense and wages payable|Prepaid wages and revenue",
        1,
        "Labor has already been consumed despite deferred payment."
      ],
      [
        "Unearned revenue becomes earned",
        "Cash received before performance creates a liability because the entity still owes goods or services. As performance occurs, reduce Unearned Revenue and recognize earned Revenue. The adjustment normally requires no cash.",
        "A gym receives $1,200 on October 1 for 12 months of service. On October 31, debit Unearned Revenue $100 and credit Revenue $100. Liability remaining: $1,100.",
        "Receiving advance cash does not make all twelve months of service earned immediately.",
        "A $1,200 annual advance earns one month. Revenue for month one is:",
        "$1,200|$100|$0",
        1,
        "1,200 divided by twelve months is $100 per month."
      ],
      [
        "Prepaids, supplies and depreciation",
        "Prepaid insurance and supplies start as assets and become expenses as benefits expire or supplies are consumed. Depreciation similarly allocates the depreciable cost of a long-lived asset over its use; it does not directly measure market value.",
        "Supplies ledger $950, physical count $320. Debit Supplies Expense $630 and credit Supplies $630 to leave a $320 asset.",
        "Do not expense all supplies while some still provide future benefit.",
        "Supplies began at $950 and $320 remain. Adjustment expense?",
        "$630|$320|$950",
        0,
        "950 − 320 were consumed."
      ]
    ]
  },
  {
    "id": "cycle",
    "title": "The full accounting cycle and closing",
    "goal": "Turn recorded transactions into complete period-end statements.",
    "units": [
      [
        "From adjusted balances to statements",
        "After adjustment, verify the adjusted trial balance. Prepare the income statement from revenue and expense accounts, the statement of retained earnings from profit and distributions, then the balance sheet from permanent accounts. Cash flows are prepared with cash activity and noncash adjustments.",
        "Revenue $16,000 and expenses $11,000 imply $5,000 net income. If opening retained earnings are $7,000 and dividends $600, ending retained earnings are $11,400.",
        "Do not prepare a statement using unadjusted balances when material adjustments are outstanding.",
        "Which figure feeds the retained earnings calculation?",
        "Sales revenue only|Net income|Total liabilities",
        1,
        "Net income is revenue less expenses and flows into retained earnings."
      ],
      [
        "Temporary and permanent accounts",
        "Revenue, expense and dividend accounts are temporary: they measure one period and are reset through closing. Assets, liabilities and retained earnings are permanent: their ending balances carry into the next accounting period.",
        "After closing a $9,000 revenue account and $6,000 of expenses, temporary accounts have zero balances and retained earnings has increased by $3,000 before dividends.",
        "Cash and Accounts Payable are never closed simply because the year ended.",
        "Which account normally survives closing with its ending balance?",
        "Service Revenue|Salaries Expense|Equipment",
        2,
        "Equipment is a permanent balance-sheet account."
      ],
      [
        "Post-closing trial balance",
        "A post-closing trial balance includes only permanent accounts. It verifies debit/credit equality after closing and becomes the foundation for the next accounting period. Review it for any revenue or expense account that should have been reset.",
        "If Rent Expense appears with $800 on a post-closing trial balance, the closing work is incomplete even if debits equal credits.",
        "A balanced post-closing trial balance alone does not prove every closing entry was correct.",
        "Which account should not appear on a post-closing trial balance?",
        "Retained Earnings|Rent Expense|Cash",
        1,
        "Rent Expense is temporary and should have been closed."
      ],
      [
        "Reversing entries",
        "A reversing entry optionally undoes some prior-period adjusting accruals at the start of a new period, allowing routine cash entries without double counting. It is a convenience, not a substitute for adjustments or a required procedure.",
        "December accrues $700 wages: debit expense, credit payable. On January 1 an optional reversal debits Wages Payable and credits Wages Expense, so the January payroll can be recorded routinely.",
        "Not every adjusting entry should be reversed; avoid automatically reversing depreciation.",
        "What is the main purpose of optional reversing entries?",
        "Simplify next-period entries for select accruals|Erase liabilities permanently|Increase annual profit",
        0,
        "Reversal simplifies subsequent routine posting without changing total earnings across periods."
      ]
    ]
  },
  {
    "id": "merchandising",
    "title": "Merchandising operations and gross profit",
    "goal": "Trace buying, selling, returns and margins for inventory businesses.",
    "units": [
      [
        "Perpetual versus periodic systems",
        "Under a perpetual system inventory and cost of goods sold are updated on each sale. Under a periodic system the business computes cost of goods sold using beginning inventory, purchases and the end-of-period physical count. Both require reliable count controls.",
        "A retailer sells an item for $150 that cost $90: perpetual accounting records $150 revenue and a separate $90 cost-of-goods-sold entry.",
        "One perpetual sale normally requires two journal entries, not just the sales entry.",
        "A perpetual $150 sale of goods costing $90 yields gross profit of:",
        "$150|$60|$90",
        1,
        "Gross profit is 150 − 90."
      ],
      [
        "Purchase discounts and freight-in",
        "Purchase discounts reduce inventory acquisition cost when earned under a perpetual system; costs necessary to acquire inventory, including qualifying freight-in, generally increase inventory. Read credit terms such as 2/10, n/30 carefully.",
        "An invoice is $5,000 with 2/10, n/30 terms. Pay within 10 days and take a $100 discount; cash settlement is $4,900.",
        "A discount of 2/10 means 2 percent, not two dollars.",
        "A $5,000 invoice paid within a 2% discount period requires cash of:",
        "$4,900|$5,000|$4,500",
        0,
        "5000 × 0.98 = 4900."
      ],
      [
        "Sales returns and allowances",
        "A return reverses the selling price using a contra-revenue account and may restore inventory at cost if salable. An allowance reduces the price without necessarily returning the product. Track the revenue side and inventory side separately.",
        "A customer returns goods sold for $300 that originally cost $180. Record a $300 Sales Returns debit; reverse the receivable/cash and restore $180 inventory if salable.",
        "Restocking inventory at selling price overstates the asset.",
        "Returned merchandise sold for $300 and costing $180 is restocked at:",
        "$300|$120|$180",
        2,
        "Inventory is recorded at cost, not the sales price."
      ],
      [
        "Net sales and gross margin",
        "Net sales equal gross sales less returns, allowances and sales discounts. Gross profit equals net sales less cost of goods sold. Gross margin percentage divides gross profit by net sales, not by cost.",
        "Gross sales $20,000, returns $1,000, COGS $11,400. Net sales $19,000; gross profit $7,600; gross margin 40%.",
        "Markup on cost and margin on sales are different percentages.",
        "Net sales $19,000 and COGS $11,400 give gross margin of:",
        "60%|40%|66.7%",
        1,
        "7,600 ÷ 19,000 = 0.40."
      ]
    ]
  },
  {
    "id": "inventory",
    "title": "Inventory counting and valuation",
    "goal": "Assign defensible costs to inventory and cost of goods sold.",
    "units": [
      [
        "Cost of goods available",
        "For a periodic inventory system, beginning inventory plus net purchases yields cost of goods available. Subtract ending inventory to find cost of goods sold. This identity is the starting point for inventory error analysis.",
        "Beginning inventory $4,000, net purchases $22,000, ending inventory $5,500: COGS is $20,500.",
        "Ending inventory is subtracted, not added, when computing COGS.",
        "What is COGS if available costs are $26,000 and ending inventory $5,500?",
        "$31,500|$20,500|$26,000",
        1,
        "26,000 − 5,500 = 20,500."
      ],
      [
        "FIFO layers",
        "FIFO assumes oldest purchase costs flow into COGS first; recent costs remain in ending inventory. The cost-flow assumption need not represent physical movement. Under periodic and perpetual FIFO the ending amounts agree for the same transactions.",
        "Buy 10 units at $4 and 10 at $6; sell 12. FIFO COGS is 10 × $4 + 2 × $6 = $52; ending inventory 8 × $6 = $48.",
        "Do not price all units sold at the latest purchase price.",
        "FIFO COGS on 12 units after buying 10 at $4 and 10 at $6?",
        "$72|$48|$52",
        2,
        "The first ten cost $4 each and the next two cost $6."
      ],
      [
        "Weighted-average cost",
        "Weighted-average costing assigns a blended unit cost to goods available. Under periodic accounting use total cost divided by total units available; a moving average in perpetual accounting is recalculated after purchases.",
        "Five units at $10 plus five at $14 produce total cost $120 across ten units, or $12 each. Sale of six uses $72 COGS; four remain at $48.",
        "Don't average the two invoice totals without accounting for unit quantities.",
        "Ten units cost $120 in total. Sell six under periodic weighted average. COGS?",
        "$60|$72|$84",
        1,
        "The weighted unit cost is $12; multiply by six."
      ],
      [
        "LIFO and net realizable value",
        "US GAAP permits LIFO, which sends recent costs to COGS; IFRS does not permit LIFO. Inventory is also assessed for write-downs when value declines. For inventories measured at lower of cost and net realizable value, NRV is estimated selling price less costs of completion and disposal.",
        "Goods cost $900 but their estimated net realizable value is $780. For an applicable lower-of-cost-and-NRV category, write down $120.",
        "Not all inventory categories use identical US GAAP valuation rules, particularly LIFO and retail inventory methods.",
        "Cost $900; NRV $780 under lower-of-cost-and-NRV. Report:",
        "$900|$780|$1,680",
        1,
        "Use the lower of cost and net realizable value under the stated method."
      ]
    ]
  },
  {
    "id": "cash",
    "title": "Cash, internal controls and bank reconciliations",
    "goal": "Safeguard cash and explain differences between ledger and bank.",
    "units": [
      [
        "Separate cash duties",
        "Authorization, custody, recordkeeping and reconciliation should be separated where practical. Independent review of reconciliations and restricted permissions reduce the opportunity to both commit and conceal an error.",
        "An employee receiving customer checks should not also control posting all receipts and approving the bank reconciliation without oversight.",
        "A control is not effective merely because policy says it exists; look for evidence it operated.",
        "Which arrangement is weakest?",
        "Independent reconciliation|Cashier also independently reconciles own receipts|Supervisor reviews exceptions",
        1,
        "The same person could take cash and conceal the discrepancy."
      ],
      [
        "Bank-side adjustments",
        "Start with the bank statement balance. Add deposits in transit and subtract outstanding checks. Correct bank errors if supported. Bank-side timing differences generally do not require new company ledger entries because the books already contain them.",
        "Bank $6,000, deposit in transit $800, outstanding checks $500: adjusted bank cash is $6,300.",
        "Do not subtract an outstanding check again from the ledger cash balance.",
        "Adjusted bank cash with $6,000 + $800 deposit − $500 checks?",
        "$6,300|$5,700|$7,300",
        0,
        "6,000 + 800 − 500 = 6,300."
      ],
      [
        "Book-side adjustments",
        "Start with the cash ledger. Record bank service charges, NSF customer checks, interest and collections the bank handled but the company hasn't recorded. The adjusted book and bank balances should match.",
        "Ledger $6,200, bank collection of a receivable $400, bank fee $30, customer NSF $270. Adjusted book cash = $6,300.",
        "A bank collection of an existing receivable increases cash, not sales revenue.",
        "Ledger $6,200 + $400 collection − $30 fee − $270 NSF equals:",
        "$6,900|$6,300|$5,900",
        1,
        "Book corrections bring the ledger to $6,300."
      ],
      [
        "Petty cash and cash equivalents",
        "Petty cash is a small imprest fund supported by receipts; replenishment records expenses and restores the cash level. Cash equivalents are short-term highly liquid investments with insignificant value-change risk, generally acquired with original maturities of three months or less.",
        "An imprest fund of $300 has $75 remaining and $225 in valid receipts. Replenish $225 and debit the relevant expenses for the receipt amounts.",
        "Cash-equivalent classification depends on original maturity and liquidity, not just an investment's current proximity to maturity.",
        "A $300 petty cash fund contains $75 cash and $225 receipts. Replenishment:",
        "$75|$300|$225",
        2,
        "Replenish enough to restore cash to the imprest amount."
      ]
    ]
  },
  {
    "id": "receivables",
    "title": "Receivables and credit losses",
    "goal": "Estimate collectible receivables and avoid double-counting write-offs.",
    "units": [
      [
        "Credit sales and collection",
        "A credit sale records Accounts Receivable and sales revenue at recognition. Later cash collection reduces the receivable. Credit terms, customer statements and subsidiary ledgers help manage the aging of unpaid balances.",
        "Sale on account $1,600: debit Accounts Receivable and credit Sales Revenue. Customer later pays $600: debit Cash and credit Accounts Receivable; $1,000 remains due.",
        "Do not create additional revenue when an invoice is paid.",
        "After $1,600 credit sale and $600 collection, receivable left:",
        "$600|$1,000|$2,200",
        1,
        "1,600 − 600 = 1,000."
      ],
      [
        "Aging the receivables",
        "An aging schedule applies different expected loss rates to receivable age buckets, establishing a desired closing Allowance for Credit Losses. Compare the desired allowance with its existing adjusted balance to compute the expense.",
        "Current receivables $20,000 at 1% loss plus past-due $5,000 at 8% = $600 required allowance. If allowance has $100 credit, expense adjustment is $500.",
        "The aging estimate is a target balance, not always the current period's expense.",
        "Required allowance $600 and existing $100 credit balance. Expense adjustment?",
        "$700|$500|$600",
        1,
        "Add $500 to the existing $100 credit to reach the $600 target."
      ],
      [
        "Write-offs and recovery",
        "Under the allowance method, an approved write-off debits the allowance and credits gross receivables. It does not create a fresh loss expense at that moment. If the customer later pays, reinstate the written-off receivable before recording collection.",
        "Write off $300: debit Allowance $300, credit A/R $300. Later recovery: debit A/R $300 and credit Allowance $300, then debit Cash and credit A/R $300.",
        "A write-off typically leaves net receivables unchanged on the date of the write-off.",
        "Write-off using an existing allowance has what immediate net A/R effect?",
        "Decrease $300|No change|Increase $300",
        1,
        "Gross receivables and the contra-asset decline by equal amounts."
      ],
      [
        "Notes receivable and interest",
        "A formal note receivable specifies principal, rate and due date. Interest revenue accrues with time and principal outstanding, commonly principal × annual rate × fraction of a year for simple-interest notes.",
        "A $12,000 note bears 6% annual simple interest for three months: interest is $12,000 × 0.06 × 3/12 = $180.",
        "Match the interest rate's period to the time fraction.",
        "Interest on $12,000 at 6% for three months?",
        "$720|$360|$180",
        2,
        "12,000 × 6% × 3/12 = 180."
      ]
    ]
  },
  {
    "id": "assets",
    "title": "Property, equipment and depreciation",
    "goal": "Measure asset cost and allocate it over use and disposal.",
    "units": [
      [
        "Capitalized versus expensed costs",
        "Include purchase price and necessary costs to prepare an asset for its intended use, such as transportation, installation and testing. Routine operating repairs are generally expensed, while qualifying improvements are capitalized. Consider specific policy and materiality.",
        "Machine invoice $10,000, freight $400, installation $600: initial recorded cost $11,000. Ordinary oil change after use begins is a repair expense.",
        "Not every cash payment associated with a machine belongs in the asset account.",
        "A $10,000 machine with $400 freight and $600 installation costs:",
        "$10,000|$11,000|$10,400",
        1,
        "Both delivery and installation prepare it for intended use."
      ],
      [
        "Straight-line and units-of-production",
        "Straight-line spreads depreciable cost evenly over useful life; units-of-production allocates cost based on usage. Depreciable base is cost minus estimated residual value. Neither method is designed to track market price.",
        "Machine cost $42,000, residual $2,000, expected 20,000 units: $2 per unit. Production of 3,500 units yields $7,000 depreciation.",
        "Do not use original cost as base when residual value is expected.",
        "$40,000 depreciable base / 20,000 units × 3,500 produced equals:",
        "$7,000|$8,000|$3,500",
        0,
        "Depreciation per unit is $2."
      ],
      [
        "Declining balance and estimate changes",
        "Double-declining-balance uses twice the straight-line rate on opening carrying value, subject to a residual-value floor. When useful life or residual estimate changes, apply the new estimate prospectively to remaining depreciable amount; don't rewrite prior years solely for changed estimates.",
        "Cost $10,000, five-year life, double-declining rate 40%: first-year depreciation is $4,000, leaving $6,000 before the next calculation.",
        "The method uses carrying value, not original cost every year.",
        "First-year double-declining depreciation on $10,000 over five years?",
        "$2,000|$4,000|$6,000",
        1,
        "2 × (1/5) × 10,000 = 4,000."
      ],
      [
        "Gain or loss on disposal",
        "First update depreciation to the sale date, then determine carrying value = historical cost minus accumulated depreciation. Compare disposal proceeds with carrying value. Remove asset cost and accumulated depreciation from the accounts.",
        "Equipment cost $28,000 with $19,000 accumulated depreciation sells for $7,500. Carrying amount $9,000; loss $1,500.",
        "Do not compare sale proceeds with original cost without subtracting depreciation.",
        "$28,000 cost − $19,000 accumulated depreciation, sale $7,500. Result?",
        "$1,500 loss|$1,500 gain|$20,500 loss",
        0,
        "Proceeds are $1,500 below the $9,000 book value."
      ]
    ]
  },
  {
    "id": "investments",
    "title": "Investments, intangibles and natural resources",
    "goal": "Understand common measurement and cost-allocation patterns.",
    "units": [
      [
        "Equity method mechanics",
        "The equity method generally reflects significant influence. Begin at acquisition cost, add the investor's share of investee income, subtract dividends and consider basis differences and impairment when applicable. Dividends are not additional income under the basic method.",
        "Investment initially $50,000, 25% share of $20,000 income, $2,000 cash dividend received: ending investment = $53,000.",
        "Do not record dividend as new income after recognizing a share of profit.",
        "Cost $50,000 + $5,000 share income − $2,000 dividend =:",
        "$55,000|$53,000|$52,000",
        1,
        "Equity-method dividends reduce the investment account."
      ],
      [
        "Passive equity holdings",
        "Investments without consolidation or equity-method accounting generally follow applicable fair-value measurement rules. Changes in fair value can affect earnings, depending on the relevant standard and instrument. Document investment type and measurement before posting gains.",
        "Shares bought for $5,000 are worth $5,600 at year-end under a fair-value-through-earnings rule; recognize $600 unrealized gain.",
        "A quoted higher market price is not cash received from selling the shares.",
        "Fair value rises from $5,000 to $5,600; change:",
        "$600 gain|$600 loss|$5,600 dividend",
        0,
        "The value increased by $600 without a sale."
      ],
      [
        "Finite-life intangibles",
        "Purchased finite-lived intangibles are generally amortized over their useful economic lives using an appropriate pattern. Indefinite-lived intangibles are not routinely amortized but are assessed for impairment. Internally created items often have different recognition rules from acquired rights.",
        "Purchased license cost $24,000, expected use six years and no residual: straight-line amortization $4,000 per year.",
        "Do not assume all brand names or goodwill are amortized annually under US GAAP.",
        "$24,000 license with six-year finite life amortizes annually:",
        "$24,000|$6,000|$4,000",
        2,
        "24,000 ÷ 6 = 4,000."
      ],
      [
        "Natural resource depletion",
        "Depletion assigns the depletable cost of a natural resource to extracted units. Costs may first enter inventory and then flow to cost of goods sold when units are sold. Compute a rate from depletable base divided by estimated recoverable quantity.",
        "Resource base $150,000 and 50,000 tons recoverable yields $3 per ton. Extract 8,000: $24,000 depletion assigned; if 6,000 sold, $18,000 flows to COGS.",
        "Do not expense all extraction-related depletion when some units remain unsold.",
        "At $3 per ton, depletion in 2,000 extracted unsold tons equals:",
        "$6,000|$18,000|$24,000",
        0,
        "Unsold 2,000 units × $3 remains in inventory."
      ]
    ]
  },
  {
    "id": "current-liabilities",
    "title": "Current liabilities and payroll",
    "goal": "Recognize near-term obligations, payroll withholdings and accruals.",
    "units": [
      [
        "Current liability classification",
        "A liability is current when expected to be settled within the normal operating cycle or within a year, subject to standard-specific criteria. Common examples are trade payables, payroll withholdings and the current portion of long-term borrowing.",
        "A company owes a $100,000 loan, with $12,000 principal due next year. Under simple assumptions classify $12,000 as current and $88,000 as noncurrent.",
        "Future interest is not principal outstanding at the balance-sheet date.",
        "Loan principal $100,000 with $12,000 due in next year. Noncurrent principal?",
        "$112,000|$88,000|$12,000",
        1,
        "100,000 − 12,000 = 88,000."
      ],
      [
        "Short-term notes and accrued interest",
        "Notes payable create contractual obligations for principal and, when applicable, interest. Accrue interest for time elapsed even if interest is payable only at maturity. Paying accrued interest later removes the payable.",
        "Borrow $20,000 on October 1 at 9% annually. At December 31 (three months) accrue $450 interest expense and interest payable.",
        "Do not wait until maturity to recognize incurred interest.",
        "$20,000 × 9% × 3/12 equals:",
        "$1,800|$450|$600",
        1,
        "Quarter-year interest is $450."
      ],
      [
        "Employee and employer payroll costs",
        "Gross wages are employee compensation expense; amounts withheld for taxes or benefits are liabilities owed to third parties. Net cash paid is gross minus employee withholdings. Employer payroll taxes, when applicable, are additional employer expense and liabilities.",
        "Gross payroll $8,000 with $1,700 employee deductions gives $6,300 cash pay and $1,700 withholding liabilities, ignoring employer taxes.",
        "Employee withholdings do not reduce the employer's gross wages expense.",
        "Gross $8,000 and withholdings $1,700. Net cash paid?",
        "$9,700|$8,000|$6,300",
        2,
        "8,000 − 1,700 = 6,300."
      ],
      [
        "Warranty and contingent liabilities",
        "Assurance-type warranty estimates can create an accrual when related sales occur. Other contingencies require judgment about probability and estimability under applicable rules. Disclosures may be needed even when no accrual is recorded.",
        "Sales of $100,000 carry an estimated 2% assurance-warranty cost. Record $2,000 warranty expense and liability when sales occur under the stated estimate.",
        "Do not wait until customers return products to recognize a reasonably estimated assurance obligation.",
        "Warranty estimate 2% of $100,000 sales. Accrual:",
        "$2,000|$200|$20,000",
        0,
        "100,000 × 2% = 2,000."
      ]
    ]
  },
  {
    "id": "debt",
    "title": "Long-term notes and bonds",
    "goal": "Connect borrowing proceeds, interest, amortization and principal repayment.",
    "units": [
      [
        "Bond face versus issue price",
        "A bond's face value is due at maturity; issue price is the present value of contractual cash flows discounted using the market yield. If stated coupon is below market yield, issue at a discount; if above, at a premium. Debt carrying amount moves toward face value over time.",
        "A $100,000 face bond issues for $96,000. Initial liability carrying amount is $96,000 and $4,000 discount must be amortized over its life.",
        "Face value is not the same as proceeds or initial carrying amount.",
        "$100,000 face bonds issue for $96,000. Discount:",
        "$4,000|$96,000|$196,000",
        0,
        "100,000 − 96,000 = 4,000."
      ],
      [
        "Effective-interest discount amortization",
        "Under the effective-interest method, interest expense is opening carrying amount multiplied by the market yield for the period. Compare with cash coupon paid. For a discount bond, expense exceeds coupon and increases debt carrying amount.",
        "Opening carrying amount $95,000, yield 8% annually, cash coupon $7,000: interest expense $7,600, discount amortization $600, new carrying amount $95,600.",
        "Use market yield for expense, coupon rate for cash interest.",
        "Effective expense $7,600 and coupon $7,000 imply discount amortization:",
        "$600|$7,000|$14,600",
        0,
        "The difference raises the carrying amount of discount debt."
      ],
      [
        "Effective-interest premium amortization",
        "Premium bonds carry more than face value initially. Coupon payments exceed effective-interest expense, so amortization reduces carrying value toward face. Match the yield and coupon to the payment interval.",
        "Opening bond carrying amount $105,000, effective annual yield 5%, annual cash coupon $6,000: expense $5,250 and premium amortization $750; new carrying value $104,250.",
        "Premium amortization reduces the debt carrying amount rather than adding it.",
        "A premium bond pays $6,000 coupon and incurs $5,250 expense. Premium amortization:",
        "$11,250|$750|$5,250",
        1,
        "6,000 − 5,250 = 750 reduction in premium."
      ],
      [
        "Installment note amortization",
        "For an amortizing note, compute each period's interest on beginning outstanding principal, allocate cash payment first to interest and the balance to principal, then carry forward the reduced principal. The interest portion falls as principal is repaid at a fixed rate.",
        "Opening note $20,000 at 5% annually. Pay $4,500 at year-end: $1,000 interest and $3,500 principal, closing principal $16,500.",
        "Do not charge interest on original principal after earlier repayments.",
        "$20,000 note, 5% rate, $4,500 year-end payment leaves principal:",
        "$15,500|$16,500|$20,000",
        1,
        "20,000 − (4,500 − 1,000) = 16,500."
      ]
    ]
  },
  {
    "id": "equity",
    "title": "Corporations, stock and retained earnings",
    "goal": "Classify contributions, distributions and equity transactions.",
    "units": [
      [
        "Common shares and additional paid-in capital",
        "At issuance, cash or assets received increase equity. For par-value shares, credit Common Stock for par and Additional Paid-in Capital for the excess. Share proceeds are not sales revenue.",
        "Issue 2,000 $1-par shares for $7 cash each: Cash debit $14,000; Common Stock credit $2,000; APIC credit $12,000.",
        "A corporation's new share issue does not increase net income.",
        "Issue 2,000 $1-par shares at $7. APIC:",
        "$14,000|$12,000|$2,000",
        1,
        "The excess $6 per share × 2,000 is $12,000."
      ],
      [
        "Preferred stock and dividends",
        "Preferred shares may have priority dividend or liquidation rights. For cumulative preferred shares, missed dividends are in arrears and must generally be addressed before common dividends. Dividend declaration and actual payment occur at separate times.",
        "1,000 shares of 6%, $100-par cumulative preferred generate $6,000 annual preference. If one prior year is unpaid, $12,000 is due before common dividends for the two-year period.",
        "Dividends in arrears on cumulative preferred are not automatically a declared liability before declaration.",
        "Annual 6% dividend on 1,000 shares of $100 par equals:",
        "$6,000|$600|$60,000",
        0,
        "100,000 par × 6% = 6,000."
      ],
      [
        "Treasury shares",
        "Repurchased shares are treasury stock and are shown as a reduction of stockholders' equity under the cost method. They are not investments in another company and do not become an expense just because the corporation used cash.",
        "Repurchase 100 own shares at $15 each: debit Treasury Stock $1,500 and credit Cash $1,500. Total equity decreases $1,500.",
        "Do not record a loss in earnings just because treasury shares are bought above original issue price.",
        "Buy back 100 shares at $15 under cost method. Equity changes by:",
        "Increase $1,500|No change|Decrease $1,500",
        2,
        "Treasury stock is contra-equity at its repurchase cost."
      ],
      [
        "Stock dividends and splits",
        "A stock split changes shares outstanding and per-share par value but ordinarily doesn't change total equity. A stock dividend reallocates amounts within equity, with rules depending on size and applicable standards. Cash dividends, by contrast, reduce equity when declared.",
        "A 2-for-1 split turns 1,000 shares with $2 par into 2,000 shares with $1 par, with total par capital unchanged.",
        "A stock split is not an economic profit or cash inflow.",
        "A 2-for-1 split of 1,000 shares gives:",
        "500 shares|2,000 shares|1,000 shares",
        1,
        "Each old share becomes two; total shares double."
      ]
    ]
  },
  {
    "id": "cashflows",
    "title": "Cash flows, ratios and integrated review",
    "goal": "Connect the statements and assess financial performance.",
    "units": [
      [
        "Operating cash flows indirect method",
        "Begin with net income, reverse noncash items such as depreciation, and adjust for changes in working-capital accounts. In general, increases in operating assets reduce cash flow; increases in operating liabilities increase it, subject to account-specific exceptions.",
        "Net income $30,000, depreciation $4,000, A/R increases $2,500 and A/P increases $1,200: cash from operations = $32,700.",
        "An increase in receivables is usually a deduction, not an addition, in the indirect method.",
        "30,000 + 4,000 − 2,500 + 1,200 equals:",
        "$32,700|$37,700|$27,300",
        0,
        "Reverse noncash depreciation, then adjust both working-capital changes."
      ],
      [
        "Investing and financing cash flows",
        "Investing often includes purchases and sales of long-lived assets; financing often includes issuing or repaying debt or shares and paying cash dividends under US GAAP. Financing principal and interest expense are not automatically the same cash-flow category.",
        "Company borrows $25,000 from a bank and buys $18,000 of equipment for cash: financing inflow $25,000, investing outflow $18,000.",
        "Buying equipment is not an operating expense merely because it uses cash.",
        "Cash purchase of $18,000 equipment appears as:",
        "Investing outflow|Financing outflow|Operating revenue",
        0,
        "It is acquisition of a long-lived operating asset."
      ],
      [
        "Liquidity and profitability ratios",
        "Current ratio = current assets/current liabilities; gross margin = gross profit/net sales; return measures connect profit with an investment base. Ratios need comparisons over time and context; one number alone is not a verdict.",
        "Current assets $60,000 and current liabilities $30,000 give a 2.0 current ratio. This is not proof every asset can immediately be converted to cash.",
        "A high ratio can mask overdue or uncollectible receivables and slow inventory.",
        "Current assets $60,000, liabilities $30,000. Current ratio:",
        "0.5|2.0|30,000",
        1,
        "60,000 ÷ 30,000 = 2."
      ],
      [
        "Integrated error diagnosis",
        "Use the accounting equation, account balances and statement links to diagnose errors. An inventory overstatement reduces COGS and inflates profit; an unrecorded wage payable understates expenses and liabilities. Follow an error through all affected reports.",
        "Omit $700 earned but unpaid December wages: December expense is understated $700, profit overstated $700 and liabilities understated $700.",
        "A trial balance can still balance perfectly when both halves of an adjusting entry are missing.",
        "Omitting $700 accrued wages causes December income to be:",
        "Understated $700|Unchanged|Overstated $700",
        2,
        "A missing expense inflates net income; payable is also too low."
      ]
    ]
  }
];
const legacyPrinciplesChapters = {
  "the-accounting-equation": "foundations",
  "debits-and-credits": "recording",
  "adjusting-entries": "adjustments",
  "closing-the-books": "cycle",
  "merchandising-and-gross-profit": "merchandising",
  "bank-reconciliation": "cash",
  "receivables-and-the-allowance": "receivables",
  "inventory-cost-flows": "inventory",
  "equity-method-investments": "investments",
  "depreciation-and-asset-cost": "assets",
  "asset-disposals": "assets",
  "depletion-and-amortization": "investments",
  "accrued-interest-and-payroll": "current-liabilities",
  "long-term-borrowing": "debt",
  "corporate-equity": "equity"
};
function expandPrinciplesDepth(workspace) {
  const course = workspace.courses.find(c => c.id === 'ac-297p');
  if (!course) return workspace;
  const seen = new Set(course.topics.map(t => t.id));
  for (const chapter of principlesChapters) {
    for (const [title,theory,worked,pitfall,question,answers,correct,explanation] of chapter.units) {
      const t = lesson(title,theory + '\n\nWhy it matters: ' + worked + '\n\nCommon mistake: ' + pitfall,
        'Without notes, explain ' + title.toLowerCase() + ', and solve the worked example.',
        theory + '\n' + worked, question, answers.split('|'), correct, explanation);
      t.chapter = chapter.id;
      t.worked = worked;
      t.pitfall = pitfall;
      t.origin = 'depth-1';
      if (!seen.has(t.id)) { course.topics.push(t); seen.add(t.id); }
    }
  }
  for (const t of course.topics) {
    if (!t.chapter && legacyPrinciplesChapters[t.id]) t.chapter = legacyPrinciplesChapters[t.id];
  }
  course.depthEdition = 1;
  return workspace;
}
