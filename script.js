const root = document.documentElement;
const cursorGlow = document.querySelector('.cursor-glow');
const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');

const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
updateThemeLabel();

window.addEventListener('pointermove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

themeToggle?.addEventListener('click', toggleTheme);
function toggleTheme() {
  const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);
  updateThemeLabel();
}
function updateThemeLabel() {
  if (themeLabel) themeLabel.textContent = root.getAttribute('data-theme') === 'dark' ? 'Dark' : 'Light';
}

menuButton?.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
});
mobileClose?.addEventListener('click', closeMobileMenu);
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const moduleCopy = {
  python: {
    label: 'Python',
    title: 'Turn calculations into repeatable workflows.',
    body: 'I use Python for return series, risk metrics, portfolio outputs and quick checks that would be slow or fragile in a spreadsheet.',
    lines: ['import pandas as pd', 'returns = prices.pct_change()', 'metrics.to_csv("outputs.csv")']
  },
  pandas: {
    label: 'Pandas',
    title: 'Clean the data before reading the result.',
    body: 'Most finance work starts with messy data. I use Pandas to align dates, clean columns, merge sources and prepare reliable inputs.',
    lines: ['df = df.dropna()', 'monthly = daily.resample("M").last()', 'panel = managers.join(benchmarks)']
  },
  sql: {
    label: 'SQL',
    title: 'Ask cleaner questions of larger datasets.',
    body: 'SQL is useful for extracting the exact data needed for analysis without carrying unnecessary noise into the model.',
    lines: ['select ticker, date, close', 'from prices', 'where date >= :start_date']
  },
  model: {
    label: 'Model',
    title: 'Make assumptions visible.',
    body: 'I prefer models where the assumptions are clear, scenario switches are easy to audit and the outputs can be explained in plain English.',
    lines: ['base = revenue * margin', 'bear = base * downside_case', 'sensitivity.table(price, volume)']
  },
  risk: {
    label: 'Risk',
    title: 'Check the downside before trusting the upside.',
    body: 'I use volatility, drawdowns, tracking error and stress tests to make sure the result is not only attractive on paper.',
    lines: ['calculate drawdown', 'run stress scenario', 'compare risk to benchmark']
  },
  dcf: {
    label: 'DCF',
    title: 'Connect value to cash flow.',
    body: 'Valuation work is strongest when growth, margins, reinvestment and discount rates are clearly linked to the business story.',
    lines: ['fcf = ebit * (1 - tax) + da - capex - nwc', 'value = discount(fcf, wacc)', 'implied_multiple(value)']
  },
  git: {
    label: 'Git',
    title: 'Keep the work traceable.',
    body: 'Git helps keep models, notebooks and scripts version controlled so the analysis can be reviewed and recovered.',
    lines: ['git checkout -b analysis', 'git commit -m "add risk checks"', 'git push origin analysis']
  },
  chart: {
    label: 'Charts',
    title: 'Make the output easy to read.',
    body: 'Good charts should explain the result quickly without hiding the assumptions behind it.',
    lines: ['plot wealth index', 'label benchmark clearly', 'export figure for report']
  }
};

const allKeys = document.querySelectorAll('[data-key]');
const readoutLabel = document.getElementById('readoutLabel');
const readoutTitle = document.getElementById('readoutTitle');
const readoutBody = document.getElementById('readoutBody');
const readoutLines = document.getElementById('readoutLines');

allKeys.forEach((button) => {
  if (!moduleCopy[button.dataset.key]) return;
  button.addEventListener('click', () => setModule(button.dataset.key));
});
function setModule(key) {
  const copy = moduleCopy[key];
  if (!copy) return;
  allKeys.forEach((button) => button.classList.toggle('active', button.dataset.key === key));
  readoutLabel.textContent = copy.label;
  readoutTitle.textContent = copy.title;
  readoutBody.textContent = copy.body;
  readoutLines.innerHTML = copy.lines.map((line) => `<code>${line}</code>`).join('');
}

const profileCopy = {
  analysis: 'I like work that turns raw information into clear decisions. That usually means clean data, transparent assumptions and outputs that can be tested.',
  markets: 'I am interested in how markets price risk, where assumptions break down and how data can be used to explain movement rather than just describe it.',
  delivery: 'I care about the final handover. A model, notebook or report should be understandable enough for someone else to review without guessing what happened.'
};
document.querySelectorAll('.profile-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.profile-chip').forEach((item) => item.classList.remove('active'));
    chip.classList.add('active');
    document.getElementById('profileOutput').textContent = profileCopy[chip.dataset.profile];
  });
});

const filters = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    const value = filter.dataset.filter;
    projectCards.forEach((card) => {
      const show = value === 'all' || card.dataset.tags.includes(value);
      card.classList.toggle('hidden', !show);
    });
  });
});
projectCards.forEach((card) => card.addEventListener('click', () => card.classList.toggle('expanded')));

const sydneyTime = document.getElementById('sydneyTime');
const marketStatus = document.getElementById('marketStatus');
const marketCountdown = document.getElementById('marketCountdown');
const OPEN_SECONDS = 9 * 3600 + 59 * 60 + 45;
const CLOSE_SECONDS = 16 * 3600;

function getSydneyNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
}
function pad(value) {
  return String(value).padStart(2, '0');
}
function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}
function nextWeekdayOpen(now) {
  const target = new Date(now);
  target.setHours(9, 59, 45, 0);
  if (now.getDay() >= 1 && now.getDay() <= 5 && secondsNow(now) < OPEN_SECONDS) return target;
  do {
    target.setDate(target.getDate() + 1);
  } while (target.getDay() === 0 || target.getDay() === 6);
  target.setHours(9, 59, 45, 0);
  return target;
}
function secondsNow(date) {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}
function updateMarketClock() {
  const now = getSydneyNow();
  const sec = secondsNow(now);
  const weekday = now.getDay() >= 1 && now.getDay() <= 5;
  const open = weekday && sec >= OPEN_SECONDS && sec < CLOSE_SECONDS;
  sydneyTime.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  if (open) {
    const close = new Date(now);
    close.setHours(16, 0, 0, 0);
    marketStatus.textContent = 'Market open';
    marketCountdown.textContent = `${formatDuration(close - now)} until close`;
  } else {
    const nextOpen = nextWeekdayOpen(now);
    marketStatus.textContent = 'Market closed';
    marketCountdown.textContent = `${formatDuration(nextOpen - now)} until open`;
  }
}
updateMarketClock();
setInterval(updateMarketClock, 1000);

const canvas = document.getElementById('sparkline');
const context = canvas?.getContext('2d');
let points = Array.from({ length: 42 }, (_, index) => 65 + Math.sin(index / 3) * 18 + Math.random() * 12);
function drawSparkline() {
  if (!context || !canvas) return;
  points = points.slice(1).concat(points[points.length - 1] + (Math.random() - 0.44) * 16);
  points = points.map((point) => Math.max(20, Math.min(112, point)));
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 5;
  context.lineJoin = 'round';
  context.lineCap = 'round';
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, '#ff6b1a');
  gradient.addColorStop(1, '#9fd33c');
  context.strokeStyle = gradient;
  context.beginPath();
  points.forEach((point, index) => {
    const x = (index / (points.length - 1)) * canvas.width;
    const y = canvas.height - point;
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
  requestAnimationFrame(() => setTimeout(drawSparkline, 450));
}
drawSparkline();

const riskSlider = document.getElementById('riskSlider');
const riskScore = document.getElementById('riskScore');
const riskMode = document.getElementById('riskMode');
riskSlider?.addEventListener('input', () => {
  const value = Number(riskSlider.value);
  riskScore.textContent = value;
  riskMode.textContent = value < 30 ? 'Defensive' : value < 68 ? 'Balanced growth' : 'High beta';
});

const gameModal = document.getElementById('gameModal');
const commandMenu = document.getElementById('commandMenu');
const openGame = document.getElementById('openGame');
const newRound = document.getElementById('newRound');
const gameGrid = document.getElementById('gameGrid');
const gameResult = document.getElementById('gameResult');

function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => closeModal(document.getElementById(button.dataset.close)));
});
openGame?.addEventListener('click', () => { createRound(); openModal(gameModal); });
newRound?.addEventListener('click', createRound);

function createRound() {
  const names = ['BHP', 'CBA', 'WES', 'CSL', 'MQG', 'REA', 'XRO', 'WOW'];
  const choices = names.sort(() => Math.random() - 0.5).slice(0, 4).map((ticker) => {
    const fair = Math.round((40 + Math.random() * 110) * 100) / 100;
    const market = Math.round((fair + (Math.random() - 0.5) * 32) * 100) / 100;
    return { ticker, fair, market, gap: Math.abs(fair - market) };
  });
  const best = choices.reduce((winner, current) => current.gap > winner.gap ? current : winner, choices[0]);
  gameResult.textContent = 'Pick the widest gap.';
  gameGrid.innerHTML = choices.map((choice) => `
    <button class="game-option" data-ticker="${choice.ticker}">
      ${choice.ticker}
      <span>Market $${choice.market.toFixed(2)} | Fair $${choice.fair.toFixed(2)}</span>
    </button>
  `).join('');
  gameGrid.querySelectorAll('.game-option').forEach((button) => {
    button.addEventListener('click', () => {
      const picked = choices.find((choice) => choice.ticker === button.dataset.ticker);
      const correct = picked.ticker === best.ticker;
      gameResult.textContent = correct
        ? `Correct. ${best.ticker} had the widest gap at $${best.gap.toFixed(2)}.`
        : `Not quite. ${best.ticker} had the widest gap at $${best.gap.toFixed(2)}.`;
    });
  });
}

const openCommand = document.getElementById('openCommand');
openCommand?.addEventListener('click', () => openModal(commandMenu));
window.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openModal(commandMenu);
  }
  if (event.key === 'Escape') {
    closeModal(commandMenu);
    closeModal(gameModal);
  }
});

document.querySelectorAll('[data-command]').forEach((button) => {
  button.addEventListener('click', () => {
    const command = button.dataset.command;
    closeModal(commandMenu);
    if (command === 'game') {
      createRound();
      openModal(gameModal);
    } else if (command === 'theme') {
      toggleTheme();
    } else {
      document.querySelector(command)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
