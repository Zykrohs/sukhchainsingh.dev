const root = document.documentElement;
const cursor = document.querySelector('.cursor-dot');
const themeButton = document.querySelector('.theme-button');
const menuToggle = document.querySelector('.menu-toggle');
const menuPanel = document.querySelector('.menu-panel');
const menuClose = document.querySelector('.menu-close');

const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

window.addEventListener('pointermove', (event) => {
  if (!cursor) return;
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

themeButton?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  playTone(260, 0.04, 'triangle');
});

menuToggle?.addEventListener('click', () => openMenu());
menuClose?.addEventListener('click', () => closeMenu());
menuPanel?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
function openMenu() {
  menuPanel?.classList.add('open');
  menuPanel?.setAttribute('aria-hidden', 'false');
  playTone(330, 0.04, 'sine');
}
function closeMenu() {
  menuPanel?.classList.remove('open');
  menuPanel?.setAttribute('aria-hidden', 'true');
}

let audioCtx;
function playTone(freq = 420, duration = 0.055, type = 'sine') {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, audioCtx.currentTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration + 0.01);
  } catch (_) {}
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const skillCopy = {
  python: ['Python', 'Repeatable analysis.', 'Python turns one-off finance calculations into workflows that can be checked, rerun and explained.'],
  pandas: ['Pandas', 'Clean inputs first.', 'Useful for aligning dates, cleaning return series and turning raw data into something reliable.'],
  numpy: ['NumPy', 'Fast numerical work.', 'Useful when calculations need arrays, compounding, risk metrics or clean mathematical logic.'],
  sql: ['SQL', 'Sharper data questions.', 'Useful for pulling the right data before the modelling or notebook work starts.'],
  excel: ['Excel', 'Business-readable models.', 'Still useful for scenario work, sensitivity tables and assumptions that need to be easy to review.'],
  jupyter: ['Jupyter', 'Analysis with context.', 'Combines code, charts and explanations in one workflow instead of leaving results unexplained.'],
  git: ['Git', 'Version control.', 'Keeps technical work traceable so changes are not lost or mixed across files.'],
  github: ['GitHub', 'Project handover.', 'Useful for repo structure, collaboration, documentation and clean submissions.'],
  matplotlib: ['Matplotlib', 'Charts that explain.', 'Used for wealth indexes, drawdowns, attribution charts and simple visual checks.'],
  finance: ['Finance', 'Theory into outputs.', 'Portfolio analytics, corporate finance, valuation and markets become more useful when the logic is clear.'],
  valuation: ['Valuation', 'Drivers matter.', 'Cash flow, growth, margins and discount rates need to connect to the business story.'],
  risk: ['Risk', 'Downside before upside.', 'Volatility, drawdowns, tracking error and stress testing help test whether results are robust.'],
  economics: ['Economics', 'Context behind numbers.', 'Macro and market reasoning help frame why assumptions move and why outcomes change.'],
  api: ['APIs', 'Less manual data work.', 'Automated pulls reduce copy-paste errors and make analysis easier to refresh.'],
  models: ['Models', 'Assumptions made visible.', 'Good models make the drivers easy to inspect rather than hiding behind the final number.'],
  strategy: ['Strategy', 'Clear recommendations.', 'Analysis needs to land in a decision, not just a spreadsheet or chart.'],
  notebooks: ['Notebooks', 'Documented analysis.', 'A good notebook shows what was done, why it was done and how to rerun it.'],
  reporting: ['Reporting', 'Polished outputs.', 'The end result should be clear enough to present and structured enough to trust.']
};

const skillLabel = document.getElementById('skillLabel');
const skillTitle = document.getElementById('skillTitle');
const skillText = document.getElementById('skillText');
const techKeys = Array.from(document.querySelectorAll('.tech-key'));
const soundMap = [240, 275, 310, 350, 390, 430, 470, 520, 570, 620, 670, 720, 760, 810, 860, 910, 960, 1020];

techKeys.forEach((key, index) => {
  key.addEventListener('click', () => setSkill(key.dataset.skill, index));
  key.addEventListener('mouseenter', () => playTone(soundMap[index % soundMap.length], 0.035, 'square'));
});

window.addEventListener('keydown', (event) => {
  const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
  if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;
  const current = techKeys.findIndex((key) => key.classList.contains('active'));
  const next = event.key === 'ArrowLeft' ? current - 1 : current + 1;
  const wrapped = (next + techKeys.length) % techKeys.length;
  setSkill(techKeys[wrapped].dataset.skill, wrapped);
});

function setSkill(skill, index = 0) {
  const copy = skillCopy[skill];
  if (!copy) return;
  techKeys.forEach((key) => key.classList.toggle('active', key.dataset.skill === skill));
  skillLabel.textContent = copy[0];
  skillTitle.textContent = copy[1];
  skillText.textContent = copy[2];
  playTone(soundMap[index % soundMap.length], 0.055, 'triangle');
}

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  stars = Array.from({ length: Math.min(155, Math.floor(window.innerWidth / 9)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.22,
    a: Math.random() * 0.72 + 0.14,
    v: Math.random() * 0.22 + 0.04
  }));
}
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => {
    star.y += star.v * devicePixelRatio;
    if (star.y > canvas.height) star.y = 0;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r * devicePixelRatio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${star.a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();
