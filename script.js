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
}
function closeMenu() {
  menuPanel?.classList.remove('open');
  menuPanel?.setAttribute('aria-hidden', 'true');
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const skillCopy = {
  python: ['Python', 'Repeatable analysis.', 'I use Python to turn finance calculations into workflows that can be checked, rerun and explained.'],
  pandas: ['Pandas', 'Clean inputs first.', 'Most analysis is only as good as the dataset behind it. Pandas helps with alignment, cleaning and reliable transformations.'],
  sql: ['SQL', 'Sharper data questions.', 'SQL is useful for extracting only the data needed before the model or notebook starts.'],
  excel: ['Excel', 'Clear business models.', 'Excel is still useful for scenario work, sensitivity tables and assumptions that need to be easy to review.'],
  jupyter: ['Jupyter', 'Analysis with context.', 'Jupyter makes it easier to combine code, charts and explanations in one workflow.'],
  git: ['GitHub', 'Work that can be traced.', 'Git keeps versions, changes and handover files organised across technical projects.'],
  models: ['Models', 'Assumptions made visible.', 'I focus on models where the drivers can be checked rather than hidden behind the output.'],
  charts: ['Charts', 'Readable outputs.', 'A good chart should make the result easier to understand without adding unnecessary noise.'],
  risk: ['Risk', 'Downside before upside.', 'Volatility, drawdowns, tracking error and stress scenarios help test whether a result is robust.'],
  valuation: ['Valuation', 'Value tied to drivers.', 'Valuation work is strongest when cash flow, growth, margins and discount rates connect to the business story.']
};

const skillLabel = document.getElementById('skillLabel');
const skillTitle = document.getElementById('skillTitle');
const skillText = document.getElementById('skillText');
const stackKeys = Array.from(document.querySelectorAll('.stack-key'));

stackKeys.forEach((key) => {
  key.addEventListener('click', () => setSkill(key.dataset.skill));
});
function setSkill(skill) {
  const copy = skillCopy[skill];
  if (!copy) return;
  stackKeys.forEach((key) => key.classList.toggle('active', key.dataset.skill === skill));
  skillLabel.textContent = copy[0];
  skillTitle.textContent = copy[1];
  skillText.textContent = copy[2];
}

const aboutCopy = {
  analysis: 'I prefer work where assumptions are visible, calculations are reproducible and the final result is simple to explain.',
  markets: 'I am interested in how market data, pricing and risk connect to decision-making.',
  delivery: 'The final output should be useful to someone else, not just technically correct on my own machine.'
};
document.querySelectorAll('.about-pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.about-pill').forEach((item) => item.classList.remove('active'));
    pill.classList.add('active');
    document.getElementById('aboutOutput').textContent = aboutCopy[pill.dataset.about];
  });
});

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  stars = Array.from({ length: Math.min(150, Math.floor(window.innerWidth / 9)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.25,
    a: Math.random() * 0.75 + 0.15,
    v: Math.random() * 0.25 + 0.05
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
