# Folio CPA Learning Hub

A simple, offline-friendly personal study desk written in **vanilla HTML, CSS and JavaScript**. No package manager, build step or account is required for the app.

## Open

Open `index.html` in a modern browser, or visit the deployed Vercel site. The contents of `content.js`, `curriculum.js` and `principles-depth.js` populate a starter learning library.

## AC 297P learning path

The Principles of Accounting I course has **14 chapter groups, 71 lessons and practice questions** aligned to the main topic areas named in [UNA's published AC 297P syllabus](https://www.una.edu/business/accounting-career-program/syllabus_ac297.pdf). The chapters are educational guidance, **not the institution's official graded course materials**. Four cash-flow lessons are added to AC 298P, which includes financial analysis and the statement of cash flows.

Every added lesson includes instruction, an example, a common error, an active-recall prompt and a checked practice question. Study tools include:

- Chapter-based navigation, retained-mastery progress, and notes.
- Individual lesson practice and concept-by-concept answer explanations.
- Mixed-topic and weak-topic drills.
- Four 30-minute cumulative mock exams with explanations on completion.
- Review scheduling after 1, 3, 7, 14, 30 and 60 days.

### Interactive labs and skill drills

Lessons with a **Lab** badge include a hands-on simulation beside the reading. Ten labs cover the core mechanics:

- **Accounting equation, live**: apply business events and watch assets, liabilities and equity stay balanced.
- **How the four statements connect**: net income → retained earnings → balance sheet, and cash-flow ending cash → balance sheet cash.
- **Journal → ledger → trial balance**: post entries into T-accounts, optionally predicting each entry first.
- **Deferrals over time**: prepaid expenses and unearned revenue month by month, with the adjusting entry and the cost of skipping it.
- **Bank reconciliation**: place randomly generated reconciling items on the bank or book side until both balances agree.
- **Aging schedule**: set balances and loss rates to find the required allowance and the adjusting entry.
- **FIFO, LIFO and weighted average**: see which purchase layers become cost of goods sold.
- **Depreciation methods**: straight-line, double-declining and units-of-production charted side by side, plus gain or loss on sale.
- **Bonds and installment notes**: issue price, effective-interest amortization schedule and carrying amount chart.
- **Break-even explorer** (AC 298P): contribution margin, break-even and margin-of-safety chart.

The **Practice** tab adds unlimited **skill drills** with fresh numbers each time: build journal entries, classify accounts and their normal balances, or work 17 kinds of calculation, each followed by a step-by-step solution. Drill totals are kept separately in this browser (`folio-drills-v1`) and do not change lesson mastery.

The Learn tab also shows a **lesson map** (every lesson as a square, coloured by progress; click to jump to it). Lessons can be linked directly as `#course/<course>/learn/<lesson-id>`. During practice quizzes, press 1–3 to answer and Enter to continue; missed questions link back to their lesson and show its common mistake.

**Dark mode** follows your device setting by default. Use **Theme** at the bottom of the sidebar to switch between System, Light and Dark; the choice is remembered in this browser (`folio-theme`).

**Reading is not mastery.** Read markers only track that a topic was opened or practiced; the retention count requires a correct quiz response and success in a later spaced review. The mock exams are not official UNA assessments.

## Saving work

All progress, notes, and review due dates are saved in your browser's `localStorage` under `folio-learning-v1`. Nothing is uploaded to GitHub automatically. Open **Data & backup** and export a JSON backup regularly. Import restores a backup after validation and adds any newly available starter lessons, while preserving existing answers and notes.

## Files

- `index.html`: page structure and script loading
- `style.css`: responsive interface
- `content.js`: starter courses and foundational accounting lessons
- `curriculum.js`: supplementary courses, practice cases and starter migration
- `principles-depth.js`: syllabus-area lesson expansion and AC 298P cash-flow material
- `labs.js`: interactive lesson labs, the shared chart component and lesson text formatting
- `drills.js`: generated skill drills (journal entries, account classification, calculations)
- `app.js`: browser storage, study sessions, quizzes, practice and navigation

To run optional data and calculation tests with a Node.js installation: `node --test tests/*.test.js`. The website itself has no Node.js dependency.

## Limitations

The standalone hub supplements, not replaces, required UNA readings, assignments, videos, grading and Canvas assessments. It is a learning aid, not a guarantee of syllabus or CPA blueprint completeness. Verify your course outline and examination rules with the institution.
