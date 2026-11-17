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

**Reading is not mastery.** Read markers only track that a topic was opened or practiced; the retention count requires a correct quiz response and success in a later spaced review. The mock exams are not official UNA assessments.

## Saving work

All progress, notes, and review due dates are saved in your browser's `localStorage` under `folio-learning-v1`. Nothing is uploaded to GitHub automatically. Open **Data & backup** and export a JSON backup regularly. Import restores a backup after validation and adds any newly available starter lessons, while preserving existing answers and notes.

## Files

- `index.html`: page structure and script loading
- `style.css`: responsive interface
- `content.js`: starter courses and foundational accounting lessons
- `curriculum.js`: supplementary courses, practice cases and starter migration
- `principles-depth.js`: syllabus-area lesson expansion and AC 298P cash-flow material
- `app.js`: browser storage, study sessions, quizzes, practice and navigation

To run optional data integrity tests with a Node.js installation: `node --test tests/content.test.js`. The website itself has no Node.js dependency.

## Limitations

The standalone hub supplements, not replaces, required UNA readings, assignments, videos, grading and Canvas assessments. It is a learning aid, not a guarantee of syllabus or CPA blueprint completeness. Verify your course outline and examination rules with the institution.
