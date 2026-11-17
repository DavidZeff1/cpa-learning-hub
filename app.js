
'use strict';
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char =>
  ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const icons = {
  desk:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  library:'M3 4h4v16H3z M10 4h4v16h-4z M16 5l3-1 4 15-3 1z',
  review:'M3 10a8.5 8.5 0 1 1 1 7 M3 4v6h6 M12 7v5l3 2',
  notes:'M6 3h13v18H6z M3 7h5 M3 12h5 M3 17h5 M11 8h5 M11 12h5',
  archive:'M3 4h18v4H3z M5 8v12h14V8 M10 12h4', plus:'M12 5v14 M5 12h14',
  arrow:'M4 12h15 M13 6l6 6-6 6', panel:'M3 4h18v16H3z M9 4v16',
  calendar:'M3 6h18v15H3z M7 3v6 M17 3v6 M3 11h18',
  menu:'M3 6h18 M3 12h18 M3 18h18', x:'M5 5l14 14 M19 5L5 19', cards:'M3 5h15v11H3z M7 19h14V9',
  book:'M12 6Q7 3 2 5v14q6-2 10 1 5-3 10-1V5q-5-2-10 1z M12 6v14',
  check:'M4 12l5 5L20 6', edit:'M4 20l4-1L20 7l-3-3L5 16z', download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5'
};
function icon(name) { return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]}"/></svg>`; }
document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
const pages = {desk:'Study desk', library:'My library', review:'Review queue', notes:'Notebook', backup:'Data & backup'};
$('#navigation').innerHTML = '<p class="nav-label">Workspace</p>' + ['desk','library','review','notes'].map(key =>
  `<a href="#${key}" data-nav="${key}">${icon(key)}${pages[key]}</a>`).join('');
const key = 'folio-learning-v1';
const types = ['Course','Exam','Certification','Subject'];
const statuses = ['In focus','Planned','Completed'];
const intervals = [1,3,7,14,30,60];
const uid = () => 'u-' + crypto.randomUUID();
const day = (offset=0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
};
const dateLabel = date => new Date(date+'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
const safeID = id => typeof id === 'string' && /^[a-z0-9][a-z0-9-]{0,119}$/.test(id);
const unique = items => new Set(items.map(item => item.id)).size === items.length;
const strings = (obj, keys) => keys.every(k => typeof obj[k] === 'string');
const natural = n => Number.isSafeInteger(n) && n >= 0;
const validDate = d => /^\d{4}-\d\d-\d\d$/.test(d) && Number.isFinite(Date.parse(d+'T12:00:00Z')) &&
  new Date(d+'T12:00:00Z').toISOString().slice(0,10) === d;
function validTopic(t) {
  return t && safeID(t.id) && strings(t, ['title','reading','prompt','answer','question','explanation','due']) &&
    t.title.trim() && t.reading.trim() && t.prompt.trim() && t.answer.trim() && Array.isArray(t.choices) &&
    t.choices.every(s => typeof s === 'string' && s.trim()) && natural(t.correct) &&
    (t.question ? t.choices.length === 3 && t.correct < 3 && t.explanation.trim() : t.choices.length === 0 && t.correct === 0) &&
    typeof t.done === 'boolean' && (!t.due || validDate(t.due)) && natural(t.level) && t.level <= intervals.length &&
    natural(t.attempts) && natural(t.hits) && t.hits <= t.attempts;
}
function validWorkspace(data) {
  return data && data.version === 1 && Array.isArray(data.courses) && data.courses.every(c =>
    c && safeID(c.id) && strings(c, ['code','title','provider','term','credits']) && c.title.trim() &&
    typeof c.tentative === 'boolean' && types.includes(c.type) && statuses.includes(c.status) &&
    Array.isArray(c.topics) && c.topics.every(validTopic) && unique(c.topics) &&
    Array.isArray(c.notes) && c.notes.every(n => n && safeID(n.id) && strings(n,['title','body','date']) && validDate(n.date)) && unique(c.notes)
  ) && unique(data.courses) && (data.last === '' || data.courses.some(c => c.id === data.last));
}
let db = starterWorkspace(), disk = null, protectedData = false;
function warn(message) { $('#warning').hidden = !message; $('#warning').textContent = message; }
try {
  disk = localStorage.getItem(key);
  if (disk !== null) {
    const parsed = JSON.parse(disk);
    if (!validWorkspace(parsed)) throw Error('Invalid workspace');
    db = expandCurriculum(parsed);
  }
} catch {
  protectedData = true;
  warn('The saved workspace could not be opened. Data & backup lets you download the original data or restore a backup.');
}
let toastTimer;
function notify(message) {
  $('#toast').textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').textContent = '', 3600);
}
// One atomic storage write per action. A stale tab must reload before it can overwrite newer work.
function save(change, restoring=false) {
  if (protectedData && !restoring) { notify('Restore a valid backup before editing this workspace.'); return false; }
  try {
    if (localStorage.getItem(key) !== disk) {
      warn('Another tab changed this workspace. Copy any open draft, then reload this page to use the latest version.');
      return false;
    }
    const next = change(structuredClone(db));
    const json = JSON.stringify(next);
    localStorage.setItem(key, json);
    db = next; disk = json; protectedData = false; warn('');
    return true;
  } catch {
    warn('This change could not be saved. Check browser storage or free space, then retry. Your previous saved data is intact.');
    return false;
  }
}
window.addEventListener('storage', event => {
  if ((event.key === key || event.key === null) && localStorage.getItem(key) !== disk) warn('Another tab changed this workspace. Copy any open draft, then reload to see the latest data.');
});
const byId = (data,id) => data.courses.find(c => c.id === id);
const course = id => byId(db,id);
const pickTopic = (data,cid,tid) => byId(data,cid).topics.find(t => t.id === tid);
const allTopics = () => db.courses.flatMap(c => c.topics.map(t => ({c,t})));
const countDone = c => c.topics.filter(t => t.done).length;
const plural = (n,word) => `${n} ${word}${n===1?'':'s'}`;
const due = t => t.due && t.due <= day();
const active = () => db.courses.find(c => c.status === 'In focus' && c.id === db.last) ||
  db.courses.find(c => c.status === 'In focus') || db.courses.find(c => c.status !== 'Completed') || db.courses[0];
const action = (act,label,cls='btn light', attrs='') => `<button type="button" class="${cls}" data-action="${act}" ${attrs}>${label}</button>`;
const endpoint = (c, tab='learn') => `#course/${c.id}/${tab}`;
const heading = (title,sub='',extra='') => `<div class="heading"><div><h1>${escapeHTML(title)}</h1>${sub?`<p>${escapeHTML(sub)}</p>`:''}</div>${extra}</div>`;
const addItem = () => action('item',icon('plus')+' Add to library');
const empty = (message,controls='') => `<div class="panel empty"><p>${escapeHTML(message)}</p>${controls}</div>`;
const link = (href,label,cls='text-link') => `<a class="${cls}" href="${href}">${label}</a>`;
const newTopicButton = c => action('topic', icon('plus')+' Add topic','btn light',`data-c="${c.id}"`);
const coursesOf = type => db.courses.filter(c => c.type === type);
let filter='All', search='', noteSearch='', session=null, openTopic='', reviewScope='focus';
let prevHash='';
function matchCourse(c) { return (filter==='All' || filter===c.type) && `${c.code} ${c.title} ${c.provider}`.toLowerCase().includes(search.trim().toLowerCase()); }
function filterButtons(overview=false) {
  const options = ['All',...types.filter(t => coursesOf(t).length)];
  return `<div class="filters" aria-label="Library filters">${options.map(t => action('filter', t==='All'?'All items':escapeHTML(t+'s'),'filter',
    `aria-pressed="${filter===t}" data-type="${t}" data-overview="${overview}"`)).join('')}</div>`;
}
function card(c) {
  const style = c.type==='Exam' ? 2 : Math.max(0,db.courses.indexOf(c))%3;
  const [design,tint,tone] = [['ledger','#dce9cd','#59764e'],['bars','#f1e1c7','#946e47'],['rings','#e2deec','#776a8d']][style];
  const pct=c.topics.length ? Math.round(countDone(c)*100/c.topics.length) : 0;
  const category = c.provider==='University of North Alabama'?'UNA course':c.provider==='U.S. CPA Exam'?'CPA exam section':c.type;
  return `<a class="course-card" href="${endpoint(c)}"><div class="cover ${design}" style="--tint:${tint};--tone:${tone}">
    <span class="eyebrow">${escapeHTML(c.code||c.type)}</span><span class="motif" aria-hidden="true"><i></i>${design==='bars'?'<i></i><i></i>':''}</span></div>
    <div class="card-body"><span class="eyebrow">${escapeHTML(category)}</span><h3>${escapeHTML(c.title)}</h3>
    <div class="progress-line"><span>${countDone(c)} of ${plural(c.topics.length,'topic')} studied</span><span>${pct}%</span></div><span class="track"><i style="width:${pct}%"></i></span></div></a>`;
}
function focusPanel(c) {
  if (!c) return empty('Add your first course, exam or certification.',addItem());
  return `<section class="focus"><span class="eyebrow">Study focus</span><h2>${escapeHTML(c.title)}</h2>
    <p>${[c.code,c.term,c.credits && plural(Number(c.credits),'credit')].filter(Boolean).map(escapeHTML).join(' · ')}</p>
    ${link(endpoint(c),`${c.topics.some(t=>t.done)?'Continue':'Start'} studying ${icon('arrow')}`,'btn lime')}
    <div class="book-art" aria-hidden="true"><div class="stack"><i class="book bottom"></i><i class="book middle"></i><i class="book top"></i></div></div></section>`;
}
function desk() {
  const topics=allTopics(), focus=active();
  const preview = [...new Set([focus, coursesOf('Course').find(c=>c!==focus), coursesOf('Exam')[0], ...db.courses].filter(Boolean))].filter(matchCourse).slice(0,3);
  return heading('Study desk','Your personal learning workspace.',addItem())+`<div class="spotlight">${focusPanel(focus)}
    <section class="panel queue"><span class="tile-icon">${icon('cards')}</span><h2>Review queue</h2>
    <div class="queue-line"><span>Due today</span><strong>${topics.filter(({t})=>due(t)).length}</strong></div>
    <div class="queue-line"><span>New in focus</span><strong>${topics.filter(({t,c})=>!t.due&&c.status==='In focus').length}</strong></div>
    ${link('#review','Open review '+icon('arrow'))}</section></div>
    <section><div class="section-head"><h2>My library</h2>${link('#library','View all '+icon('arrow'))}</div>${filterButtons(true)}
    <div class="grid">${preview.map(card).join('')}</div></section>
    <section><div class="section-head"><h2>Study progress</h2></div><div class="panel stats">
    <div><strong>${topics.filter(({t})=>t.done).length}</strong><span>Topics studied</span></div><div><strong>${topics.reduce((s,{t})=>s+t.attempts,0)}</strong><span>Practice attempts</span></div>
    <div><strong>${db.courses.reduce((s,c)=>s+c.notes.length,0)}</strong><span>Saved notes</span></div></div></section>`;
}
function libraryGrid() {
  const items=db.courses.filter(matchCourse);
  return items.length?`<div class="grid">${items.map(card).join('')}</div>`:empty('No items match. Try another filter or add an item.');
}
function library() {
  const counts = types.filter(t=>coursesOf(t).length).map(t=>plural(coursesOf(t).length,t.toLowerCase())).join(' · ');
  return heading('My library',counts,addItem()) + `<div class="controls">${filterButtons()}<input class="search" type="search" aria-label="Search library" id="search" value="${escapeHTML(search)}" placeholder="Search library…"></div><div id="results">${libraryGrid()}</div>`;
}
function details(c,tab) {
  const meta=[c.code,c.provider,c.term,c.credits&&plural(Number(c.credits),'credit'),c.tentative&&'Tentative choice'].filter(Boolean).join(' · ');
  const sections={learn:'Learn',practice:'Practice',notes:'Notes'};
  const tabs=`<nav class="tabs" aria-label="Course sections">${Object.entries(sections).map(([k,v])=>`<a href="${endpoint(c,k)}" ${k===tab?'aria-current="page"':''}>${v}</a>`).join('')}</nav>`;
  const edit=action('item',icon('edit')+' Edit item','btn light',`data-c="${c.id}"`);
  let body='';
  if(tab==='notes') body=noteList(c);
  else if(tab==='practice') body=practicePage(c);
  else {
    body=`<div class="section-head"><div><h2>Study topics</h2><p class="help">${countDone(c)} of ${plural(c.topics.length,'topic')} studied</p></div>${newTopicButton(c)}</div>`;
    body+=c.topics.map((t,i)=>`<details class="lesson-card" ${t.id===openTopic||(!openTopic&&i===Math.max(0,c.topics.findIndex(x=>!x.done)))?'open':''}>
      <summary><span>${escapeHTML(t.title)}</span>${t.done?'<small>✓ Studied</small>':''}</summary><div class="reading">${escapeHTML(t.reading)}</div>
      <div class="actions">${action('studied',t.done?'Mark unread':'Mark studied',t.done?'btn light':'btn green',`data-c="${c.id}" data-t="${t.id}"`)}
      ${action('topic','Edit topic','text-link',`data-c="${c.id}" data-t="${t.id}"`)}</div></details>`).join('');
    if(!c.topics.length) body+=empty('Add a topic with a lesson and a recall prompt to start studying.');
    if(c.id==='ac-297p') body+=`<p class="help">Check your course coverage against the <a class="source" href="https://www.una.edu/business/accounting-career-program/syllabus_ac297.pdf" target="_blank" rel="noopener">published UNA syllabus ↗</a>.</p>`;
    if(c.provider==='University of North Alabama' && c.id!=='ac-297p') body+=`<p class="help"><a class="source" href="https://distance.una.edu/business/accounting-career-program/course-descriptions-and-syllabi.html" target="_blank" rel="noopener">UNA course descriptions ↗</a></p>`;
    if(c.provider==='U.S. CPA Exam') body+=`<p class="help"><a class="source" href="https://assets.ctfassets.net/rb9cdnjh59cm/71s84dkfo3KEsoLlz4vv6G/c4c2a547b9c16f737b75e5e465031d3c/2609-168676_PA_Pipe_2027_CPAExam_Blueprints_Final.pdf" target="_blank" rel="noopener">2027 AICPA Exam Blueprints ↗</a> · <a class="source" href="https://www.aicpa-cima.com/resources/download/learn-what-is-tested-on-the-cpa-exam" target="_blank" rel="noopener">Exam updates and practice resources ↗</a></p>`;
  }
  return heading(c.title,meta,edit)+`<span class="chip">${escapeHTML(c.status)}</span>${tabs}${body}`;
}


function getReviewItems() {
  return allTopics().filter(({c,t}) => {
    if (reviewScope === 'focus') return due(t) || (!t.due && c.status==='In focus');
    return (reviewScope === 'all' || c.id===reviewScope) && (due(t)||!t.due);
  }).sort((a,b) => (a.t.due || '9999').localeCompare(b.t.due || '9999'));
}

function availableCases(courseId) {
  if (courseId === 'ac-297p') return caseTitles.map((title, index) => ({title, index}));
  return exhibitCases.filter(item => item.courses.includes(courseId));
}
function casePicker(c) {
  const cases = availableCases(c.id);
  if (!cases.length) return '';
  const description = c.id === 'ac-297p' ? 'Solve three connected amounts. Each attempt uses fresh figures.' :
    'Use the exhibits to solve each part, then check the reasoning.';
  return `<section class="panel padded practice"><h2>Case practice</h2><p>${description}</p>
    <div class="actions" style="margin-top:14px">${cases.map((item,i)=>action('case',escapeHTML(item.title),'btn light',`data-i="${i}" data-c="${c.id}"`)).join('')}</div></section>`;
}
function casePage() {
  const s=session, test=s.test;
  const exhibits=(test.exhibits||[]).map(([title,body])=>
    `<article class="case-exhibit"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(body)}</p></article>`).join('');
  return `<section class="panel padded practice"><div class="split"><span class="eyebrow">Case practice</span>${action('end','Back to practice','text-link')}</div><h2>${escapeHTML(test.title)}</h2>
    <p>${escapeHTML(test.story)}</p>${exhibits}<form id="case-form">${test.parts.map(([label,answer,reason,,options],i)=>{
      const result=s.responses?s.responses[i]:null;
      const input=options ? `<select name="part${i}" required ${s.responses?'disabled':''}><option value="">Choose an answer</option>${options.map((option,index)=>
        `<option value="${index}" ${result===index?'selected':''}>${escapeHTML(option)}</option>`).join('')}</select>` :
        `<input name="part${i}" type="number" step="any" required ${s.responses?`readonly value="${result}"`:''}>`;
      return `<label class="field">${escapeHTML(label)}${test.exhibits?'':' ($)'}${input}</label>
      ${s.responses?`<p class="feedback"><strong>${result===answer?'Correct':'Answer: '+escapeHTML(options?options[answer]:answer.toLocaleString('en-US'))}.</strong> ${escapeHTML(reason)}</p>`:''}`;
    }).join('')}${s.responses?`<p>${s.score} of ${test.parts.length} correct.</p><div class="actions">${test.exhibits?'':action('case','Try fresh figures','btn green',`data-i="${s.kind}" data-c="${s.scope}"`)}${action('end','Finish','btn light')}</div>`:'<button class="btn green">Check my work</button>'}</form></section>`;
}
document.addEventListener('submit',event=>{
  if(event.target.id!=='case-form') return;
  event.preventDefault();
  const s=session;
  if(!s || s.responses) return;
  const responses=s.test.parts.map((part,i)=>event.target.elements['part'+i].value === '' ? NaN : Number(event.target.elements['part'+i].value));
  if(!responses.every(Number.isFinite)) return;
  if(!save(data=>{
    const c=byId(data,s.scope);
    s.test.parts.forEach(([,answer,,id],i)=>{
      const t=c.topics.find(item=>item.id===id);
      if(!t) return;
      t.attempts++;
      if(responses[i]===answer) {t.hits++; if(!t.due) t.due=day(1);}
      else {t.lastMiss=true; t.due=day();t.level=0;}
    });
    data.last=c.id;return data;
  })) return;
  s.responses=responses;s.score=s.test.parts.filter((part,i)=>part[1]===responses[i]).length;
  render();$('#main').focus();
});


function practicePage(c) {
  if (session?.mode==='case' && session.scope===c.id) return casePage();
  if (session?.mode==='practice' && session.scope===c.id) return studySession();
  const qs=c.topics.filter(t=>t.question), attempts=qs.reduce((n,t)=>n+t.attempts,0), hits=qs.reduce((n,t)=>n+t.hits,0);
  return `<div class="panel padded practice"><span class="tile-icon">${icon('book')}</span><h2>Practice questions</h2>
    <p>${plural(qs.length,'question')} available · ${hits} correct across ${plural(attempts,'attempt')}</p>
    <p class="help">Start with up to five questions. Missed questions come first, followed by the least practiced topics.</p>
    <div class="actions section-head">${qs.length?action('practice','Practice up to 5 '+icon('arrow'),'btn green',`data-c="${c.id}"`):newTopicButton(c)}
    ${qs.length>5?action('practice','Full set','btn light',`data-c="${c.id}" data-all="yes"`):''}
    ${action('course-review','Review concepts','btn light',`data-c="${c.id}"`)}</div></div>` + casePicker(c);
}
function reviewPage() {
  if (session?.mode==='review') return heading('Review queue')+studySession();
  const rows=getReviewItems(), scheduled=allTopics().filter(({c,t})=>
    t.due>day() && (['all','focus'].includes(reviewScope)||c.id===reviewScope)).sort((a,b)=>a.t.due.localeCompare(b.t.due));
  const opts=[['focus','All due + new in focus'],['all','All subjects'],...db.courses.map(c=>[c.id,[c.code,c.title].filter(Boolean).join(' · ')])];
  return heading('Review queue','Recall each concept before revealing the answer.')+`<label class="field">Study set<select id="scope">${opts.map(([k,v])=>`<option value="${k}" ${k===reviewScope?'selected':''}>${escapeHTML(v)}</option>`).join('')}</select></label>
    <section class="panel padded practice"><span class="tile-icon">${icon('cards')}</span>
    <h2>${rows.length?plural(rows.length,'concept')+' ready':'You’re caught up'}</h2>
    <p>${rows.length?`${rows.filter(({t})=>due(t)).length} due · ${rows.filter(({t})=>!t.due).length} new`:'Choose another study set or add topics to your library.'}</p>
    ${rows.length?`<div class="actions" style="margin-top:18px">${action('review','Start review '+icon('arrow'),'btn green')}</div>`:''}</section>
    ${scheduled.length?`<div class="section-head"><h2>Coming up</h2></div>${scheduled.slice(0,8).map(({c,t})=>`<div class="panel padded split"><div><strong>${escapeHTML(t.title)}</strong><div class="muted">${escapeHTML(c.code||c.title)}</div></div><span class="muted">${dateLabel(t.due)}</span></div>`).join('')}`:''}`;
}
function begin(mode,scope,rows) {
  session={mode,scope,items:rows.map(({c,t})=>[c.id,t.id]),index:0,shown:false,choice:null,success:0};
  render(); $('#main').focus();
}
function studySession() {
  const s=session, isQuiz=s.mode==='practice';
  if (s.index>=s.items.length) return `<section class="panel padded practice"><span class="tile-icon">${icon('check')}</span>
    <h2>${isQuiz?'Practice complete':'Review complete'}</h2><p>${s.success} of ${s.items.length} ${isQuiz?'answered correctly':'recalled'}.</p>
    ${!isQuiz&&s.success<s.items.length?'<p class="help">Missed concepts stay due today. Try them again after a break.</p>':''}
    <div class="actions" style="margin-top:18px">${action('end',isQuiz?'Back to practice':'Back to queue','btn green')}</div></section>`;
  const [cid,tid]=s.items[s.index], c=course(cid), t=pickTopic(db,cid,tid);
  const top=`<div class="split"><span class="eyebrow">${isQuiz?'Question':'Concept'} ${s.index+1} of ${s.items.length}</span>${action('end','End session','text-link')}</div>`;
  const controls = isQuiz?`<div class="choices">${t.choices.map((v,i)=>`<button class="choice ${s.shown?(i===t.correct?'correct':i===s.choice?'wrong':''):''}" data-action="answer" data-i="${i}" ${s.shown?'disabled':''}>${escapeHTML(v)}</button>`).join('')}</div>
    ${s.shown?`<div class="feedback" role="status"><strong>${s.choice===t.correct?'Correct.':'Correct answer: '+escapeHTML(t.choices[t.correct])+'.'}</strong> ${escapeHTML(t.explanation)}</div>${action('next',s.index===s.items.length-1?'See results':'Next question','btn green')}`:''}`:
    `${s.shown?`<div class="feedback">${escapeHTML(t.answer)}</div><p class="help">How did you do from memory?</p><div class="actions" style="margin-top:10px">${action('miss','Missed · retry today','btn light')}${action('recall',`Recalled · ${plural(intervals[Math.min(t.level,intervals.length-1)],'day')}`,'btn green')}</div>`:
      `<label class="field">Your answer (optional)<textarea id="scratch" placeholder="Write what you remember, or answer aloud."></textarea></label>${action('reveal','Reveal answer','btn green')}`}`;
  return `<section class="panel padded practice">${top}<p class="help">${escapeHTML(c.code||c.title)} · ${escapeHTML(t.title)}</p>
    <h2>${escapeHTML(isQuiz?t.question:t.prompt)}</h2>${!isQuiz&&s.shown&&s.typed?`<p class="reading"><strong>Your answer</strong><br>${escapeHTML(s.typed)}</p>`:''}${controls}</section>`;
}
function advance() { session.index++; session.shown=false; session.choice=null; session.typed=''; render(); $('#main').focus(); }
function recordAnswer(choice) {
  const s=session;
  if (!s||s.shown||s.mode!=='practice') return;
  const [cid,tid]=s.items[s.index], t=pickTopic(db,cid,tid), correct=choice===t.correct;
  if (!save(data=>{
    const item=pickTopic(data,cid,tid); item.attempts++; item.lastMiss=!correct;
    if(correct) { item.hits++; if(!item.due) item.due=day(1); }
    else { item.level=0; item.due=day(); }
    data.last=cid; return data;
  })) return;
  s.choice=choice; s.shown=true; if(correct) s.success++;
  render(); $('.feedback')?.scrollIntoView({block:'nearest'});
}
function rate(recalled) {
  const s=session;
  if(!s?.shown||s.mode!=='review') return;
  const [cid,tid]=s.items[s.index];
  if (!save(data=>{
    const t=pickTopic(data,cid,tid);
    t.due=day(recalled?intervals[Math.min(t.level,intervals.length-1)]:0);
    t.level=recalled?Math.min(t.level+1,intervals.length):0;
    data.last=cid; return data;
  })) return;
  if(recalled) s.success++;
  advance();
}
function noteRows(c) {
  const rows=(c?[c]:db.courses).flatMap(item=>item.notes.map(note=>({item,note})))
    .filter(({note,item})=>c||[note.title,note.body,item.title,item.code].join(' ').toLowerCase().includes(noteSearch.toLowerCase()))
    .sort((a,b)=>b.note.date.localeCompare(a.note.date));
  return rows.length ? rows.map(({item,note})=>`<article class="note"><div class="split"><span class="eyebrow">${escapeHTML(item.code||item.title)} · ${dateLabel(note.date)}</span>
    ${action('note','Edit','text-link',`data-c="${item.id}" data-n="${note.id}"`)}</div><h3>${escapeHTML(note.title)}</h3><p class="note-body">${escapeHTML(note.body)}</p></article>`).join(''):
    empty(noteSearch&&!c?'No matching notes.':'Your saved notes will appear here.');
}
function noteList(c=null) {
  const button=db.courses.length?action('note',icon('plus')+' Add note','btn light',c?`data-c="${c.id}"`:''):addItem();
  return (c?`<div class="section-head"><h2>Course notes</h2>${button}</div>`:heading('Notebook','Notes from across your library.',button)+
    `<div class="controls"><input type="search" id="note-search" class="search" aria-label="Search notes" placeholder="Search notes…" value="${escapeHTML(noteSearch)}"></div>`)+`<div id="notes-list">${noteRows(c)}</div>`;
}
function backupPage() {
  return heading('Data & backup','Progress is saved in this browser on this device.')+`<section class="panel padded practice">
    <h2>Workspace backup</h2><p>Download a copy of your courses, topics, reviews and notes. Restore it here to move your workspace to another browser or device.</p>
    <div class="actions" style="margin-top:18px">${action('export',icon('download')+' Download backup','btn green')}
    ${action('import','Restore backup')}<input type="file" id="import" accept=".json,application/json" hidden>
    ${protectedData && disk!==null?action('raw','Download original data'):''}</div>
    <p class="help">Clearing site data removes this browser’s copy. Keep a backup after important study sessions.</p></section>
    <section class="panel padded practice"><h2>Study methods</h2>
    <p>Attempt a question before checking its explanation. In review, retrieve the answer from memory, then rate your recall. Recalled concepts return after 1, 3, 7, 14, 30 and 60 days. Missed concepts remain due today.</p>
    <p class="help">The intervals are a simple scheduling choice. The learning approach draws on research on practice testing and distributed practice. <a class="source" href="https://doi.org/10.3389/feduc.2021.581216" target="_blank" rel="noopener">Read the research ↗</a></p></section>
    <section class="panel padded practice"><h2>Starter material</h2><p>Each planned course and section includes original lessons and practice cases. Use the syllabus or exam blueprint to identify additional objectives to study. Topic percentages reflect the material in this workspace.</p>
    <p class="help"><a class="source" href="https://openstax.org/details/books/principles-financial-accounting" target="_blank" rel="noopener">OpenStax Financial Accounting ↗</a> · <a class="source" href="https://www.aicpa-cima.com/resources/download/learn-what-is-tested-on-the-cpa-exam" target="_blank" rel="noopener">AICPA Exam Blueprints ↗</a></p></section>`;
}
function render() {
  const [page='desk',cid,tab]=location.hash.slice(1).split('/');
  const c=course(cid), actual=page==='course'&&c?'course':Object.hasOwn(pages,page)?page:'desk';
  const title=actual==='course'?(c.code||c.title):pages[actual];
  $('#crumb').textContent=title; document.title=`${title} · Folio`;
  document.querySelectorAll('[data-nav]').forEach(a=>{
    if(a.dataset.nav===(actual==='course'?'library':actual)) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
  const views={desk,library,review:reviewPage,notes:noteList,backup:backupPage,course:()=>details(c,['learn','practice','notes'].includes(tab)?tab:'learn')};
  $('#main').innerHTML=views[actual]();
  $('#date').innerHTML=icon('calendar')+escapeHTML(new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}));
}
function toggleMenu(open) {
  $('.sidebar').classList.toggle('open',open); $('.scrim').hidden=!open;
  $('#menu').setAttribute('aria-expanded',String(open));
  if(open) $('.brand').focus(); else if(matchMedia('(max-width:820px)').matches) $('#menu').focus();
}
$('#menu').onclick=()=>toggleMenu(true);
$('.scrim').onclick=()=>toggleMenu(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('.sidebar').classList.contains('open')) toggleMenu(false);});
$('.sidebar').onclick=e=>{if(e.target.closest('a')&&$('.sidebar').classList.contains('open')) toggleMenu(false);};
window.addEventListener('hashchange',()=>{
  if(location.hash==='#main') { history.replaceState(null,'',prevHash||'#desk'); $('#main').focus(); return; }
  prevHash=location.hash; session=null; openTopic=''; filter='All'; search=''; noteSearch='';
  render(); window.scrollTo(0,0); $('#main').focus({preventScroll:true});
});
$('#main').addEventListener('input',e=>{
  if(e.target.id==='search') { search=e.target.value; $('#results').innerHTML=libraryGrid(); }
  if(e.target.id==='note-search') { noteSearch=e.target.value; $('#notes-list').innerHTML=noteRows(); }
});
$('#main').addEventListener('change',e=>{
  if(e.target.id==='scope') {reviewScope=e.target.value;render();}
  if(e.target.id==='import'&&e.target.files[0]) readBackup(e.target.files[0]);
});


const dialog=$('#dialog'), form=$('#dialog-form');
dialog.setAttribute('aria-labelledby','dialog-title');
let submitForm;
function field(name,label,value='',kind='text',required=false) {
  const attrs=`name="${name}" ${required?'required':''}`;
  if(kind==='textarea') return `<label class="field">${label}<textarea ${attrs} rows="3">${escapeHTML(value)}</textarea></label>`;
  return `<label class="field">${label}<input ${attrs} type="${kind}" value="${escapeHTML(value)}"></label>`;
}
function selectField(name,label,options,selected) {
  return `<label class="field">${label}<select name="${name}">${options.map(entry=>{
    const [value,text]=Array.isArray(entry)?entry:[entry,entry];
    return `<option value="${escapeHTML(value)}" ${value===selected?'selected':''}>${escapeHTML(text)}</option>`;
  }).join('')}</select></label>`;
}
function showForm(title,fields,saveLabel,onSubmit) {
  $('#dialog-title').textContent=title; $('#fields').innerHTML=fields;
  $('#submit').textContent=saveLabel; submitForm=onSubmit;
  dialog.showModal(); dialog.scrollTop=0;
  const first=$('#fields input:not([type=checkbox]), #fields textarea, #fields select');
  if(first) first.focus(); else $('#dialog .dialog-foot button').focus();
}
form.onsubmit=e=>{
  e.preventDefault();
  for(const el of form.querySelectorAll('[required]')) {
    if(!el.value.trim()) {el.setCustomValidity('Please enter a value.');el.reportValidity();return;}
  }
  const data=Object.fromEntries([...new FormData(form)].map(([k,v])=>[k,v.trim()]));
  if(submitForm(data)!==false) { dialog.close(); render(); }
};
form.oninput=e=>e.target.setCustomValidity?.('');
const removeButton=(kind,cid,id='')=>action('remove',`Delete ${kind}`,'text-link danger',`data-kind="${kind}" data-c="${cid}" data-id="${id}"`);
function editItem(id) {
  const c=course(id);
  const data=c||{id:uid(),code:'',title:'',type:'Course',provider:'',term:'',credits:'',status:'Planned',tentative:false,topics:[],notes:[]};
  const fields=field('title','Title',data.title,'text',true)+field('code','Course or exam code (optional)',data.code)+
    selectField('type','Type',types,data.type)+selectField('status','Study status',statuses,data.status)+
    field('provider','Institution or program',data.provider)+field('term','Term or target date',data.term)+
    `<label class="field">Credits (optional)<input type="number" min="0" step="any" name="credits" value="${escapeHTML(data.credits)}"></label>
    <label><input type="checkbox" name="tentative" ${data.tentative?'checked':''}> Tentative choice</label>`+
    (c?`<div>${removeButton('item',id)}</div>`:'');
  showForm(c?'Edit library item':'Add to library',fields,c?'Save changes':'Add item',values=>{
    if(!save(next=>{
      const updated={...data,...values,tentative:values.tentative==='on'};
      if(c) next.courses[next.courses.findIndex(x=>x.id===id)]=updated; else next.courses.push(updated);
      if(updated.status==='In focus'||!next.last) next.last=updated.id;
      return next;
    })) return false;
    notify(c?'Library item updated.':'Added to your library.');
    if(!c) location.hash=endpoint(data);
  });
}
function editTopic(cid,tid) {
  const c=course(cid), existing=c.topics.find(t=>t.id===tid);
  const t=existing||{id:uid(),title:'',reading:'',prompt:'',answer:'',question:'',choices:[],correct:0,explanation:'',done:false,level:0,due:'',attempts:0,hits:0};
  const choiceFields=[0,1,2].map(i=>field('choice'+i,`Choice ${i+1}`,t.choices[i]||'')).join('');
  const fields=field('title','Topic title',t.title,'text',true)+field('reading','Lesson or worked example',t.reading,'textarea',true)+
    field('prompt','Recall prompt',t.prompt,'textarea',true)+field('answer','Recall answer',t.answer,'textarea',true)+
    `<details id="mcq" ${t.question?'open':''}><summary>Practice question (optional)</summary>${field('question','Question',t.question,'textarea')}${choiceFields}
    ${selectField('correct','Correct choice',[['0','Choice 1'],['1','Choice 2'],['2','Choice 3']],String(t.correct))}${field('explanation','Answer explanation',t.explanation,'textarea')}</details>`+
    (existing?removeButton('topic',cid,tid):'');
  showForm(existing?'Edit topic':'Add study topic',fields,'Save topic',v=>{
    const choices=[v.choice0,v.choice1,v.choice2];
    const hasQuiz=Boolean(v.question||choices.some(Boolean)||v.explanation);
    if(hasQuiz&&(!v.question||!choices.every(Boolean)||!v.explanation)) {
      $('#mcq').open=true;
      const el=[...$('#mcq').querySelectorAll('input,textarea')].find(x=>!x.value.trim());
      el.setCustomValidity('Complete the question, three choices and explanation, or clear all practice fields.');el.reportValidity();return false;
    }
    if(!save(next=>{
      const item={...t,title:v.title,reading:v.reading,prompt:v.prompt,answer:v.answer,question:v.question,
        choices:hasQuiz?choices:[],correct:hasQuiz?Number(v.correct):0,explanation:v.explanation};
      const topics=byId(next,cid).topics;
      if(existing) topics[topics.findIndex(q=>q.id===tid)]=item; else topics.push(item);
      return next;
    })) return false;
    openTopic=t.id; notify('Topic saved.');
  });
}
function editNote(cid,nid) {
  const c=course(cid)||active(), n=c?.notes.find(item=>item.id===nid);
  if(!c) {editItem(); return;}
  const fields=(cid?`<p class="muted">${escapeHTML(c.title)}</p>`:selectField('cid','Save in',db.courses.map(item=>[item.id,item.title]),c.id))+
    field('title','Note title',n?.title||'','text',true)+field('body','Note',n?.body||'','textarea',true)+(n?removeButton('note',cid,nid):'');
  showForm(n?'Edit note':'Add note',fields,'Save note',v=>{
    if(!save(next=>{
      const item=byId(next,v.cid||c.id), note={id:n?.id||uid(),title:v.title,body:v.body,date:day()};
      if(n) item.notes[item.notes.findIndex(x=>x.id===nid)]=note;
      else item.notes.unshift(note);
      return next;
    })) return false;
    notify('Note saved.');
  });
}
function remove(kind,cid,id) {
  const c=course(cid), target=kind==='item'?c:(kind==='note'?c.notes:c.topics).find(x=>x.id===id);
  if(!confirm(`Delete “${target.title}”${kind==='item'?' and all its topics, progress and notes':''}?`)) return;
  if(save(next=>{
    if(kind==='item') {
      next.courses=next.courses.filter(item=>item.id!==cid);
      if(next.last===cid) next.last=next.courses[0]?.id||'';
    } else {
      const prop=kind==='note'?'notes':'topics', item=byId(next,cid);
      item[prop]=item[prop].filter(x=>x.id!==id);
    }
    return next;
  })) {
    dialog.close(); session=null;
    if(kind==='item') { reviewScope='focus';location.hash='#library'; }
    render(); notify('Deleted.');
  }
}
function download(text,name) {
  const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));
  const a=document.createElement('a'); a.href=url; a.download=name;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
async function readBackup(file) {
  $('#import').value='';
  let next;
  try {
    next=JSON.parse(await file.text());
    if(!validWorkspace(next)) throw Error('Invalid workspace');
  } catch {
    showForm('Backup could not be read','<p>Choose a valid Folio JSON backup. Your current workspace is unchanged.</p>','OK',()=>{});
    return;
  }
  const notes=next.courses.reduce((sum,c)=>sum+c.notes.length,0);
  showForm('Restore this backup?',`<p>This file contains ${plural(next.courses.length,'library item')} and ${plural(notes,'note')}. Restoring replaces all data in this browser.</p>
    <p class="help">Save your current workspace first if you want to keep it.</p>${protectedData&&disk!==null?action('raw','Download original data','text-link'):action('export','Download current backup','text-link')}`,'Replace and restore',()=>{
    if(!save(()=>expandCurriculum(next),true)) return false;
    session=null;reviewScope='focus';notify('Workspace restored.');location.hash='#desk';
  });
}
document.addEventListener('click',e=>{
  const button=e.target.closest('[data-action]');
  if(!button) return;
  const {action:act,c:cid,t:tid,n:nid,i,kind,id,type}=button.dataset;
  switch(act) {
    case 'close': dialog.close(); break;
    case 'item': editItem(cid); break;
    case 'topic': editTopic(cid,tid); break;
    case 'note': editNote(cid,nid); break;
    case 'remove': remove(kind,cid,id); break;
    case 'filter': filter=type;render();document.querySelector('.filter[aria-pressed=true]')?.focus({preventScroll:true});break;
    case 'studied': {
      if(save(next=>{
        const t=pickTopic(next,cid,tid); t.done=!t.done;
        if(t.done&&!t.due) t.due=day();
        next.last=cid;return next;
      })) {openTopic=tid;render();notify(pickTopic(db,cid,tid).done?'Marked studied. Concept ready for review.':'Marked unread.');}
      break;
    }
    case 'case': {
      const kind=Number(i);
      const selected=availableCases(cid)[kind];
      const test=selected.exhibits ? selected : {...makeCase(kind),title:selected.title};
      session={mode:'case',scope:cid,kind,test};
      render();$('#main').focus();break;
    }
    case 'practice': {
      const c=course(cid);
      const rows=c.topics.filter(t=>t.question).map(t=>({c,t}))
        .sort((a,b)=>Number(!!b.t.lastMiss)-Number(!!a.t.lastMiss) || a.t.attempts-b.t.attempts);
      begin('practice',cid,button.dataset.all ? rows : rows.slice(0,5));
      break;
    }
    case 'course-review': reviewScope=cid;location.hash='#review';break;
    case 'review': begin('review',reviewScope,getReviewItems().slice(0,10));break;
    case 'answer': recordAnswer(Number(i));break;
    case 'reveal': session.typed=$('#scratch').value.trim();session.shown=true;render();$('.feedback').scrollIntoView({block:'nearest'});break;
    case 'next': advance(); break;
    case 'recall': rate(true);break;
    case 'miss': rate(false);break;
    case 'end': session=null;render();$('#main').focus();break;
    case 'export': download(JSON.stringify(db,null,2),`folio-backup-${day()}.json`);break;
    case 'raw': download(disk,`folio-original-${day()}.json`);break;
    case 'import': $('#import').click();break;
  }
});
prevHash=location.hash;
render();

