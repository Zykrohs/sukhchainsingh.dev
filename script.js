/* =================================================================
   Sukhchain Singh - Portfolio JS
   Interactive features: ticker, hero reveal, mini-games, easter egg
   ================================================================= */

/* ---------- Loader ---------- */
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('hidden'), 650);
});

/* ---------- Sound (kept minimal, low volume) ---------- */
let soundEnabled = false;
let audioCtx;
function playTone(freq = 420, duration = 0.05, type = 'sine') {
  if (!soundEnabled) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration + 0.01);
  } catch (_) {}
}
const soundToggle = document.querySelector('.sound-toggle');
soundToggle?.classList.add('off');
if (soundToggle) soundToggle.title = 'Sound off';
soundToggle?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle('off', !soundEnabled);
  soundToggle.querySelector('span').textContent = soundEnabled ? '♪' : '♪';
  soundToggle.title = soundEnabled ? 'Sound on' : 'Sound off';
  if (soundEnabled) playTone(520, .05, 'triangle');
});

/* ---------- Theme toggle ---------- */
const root = document.documentElement;
const themeButton = document.querySelector('.theme-button');
const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
themeButton?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  playTone(260, 0.04, 'triangle');
});

/* ---------- Header scrolled state ---------- */
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ---------- Menu ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const menuPanel  = document.querySelector('.menu-panel');
const menuClose  = document.querySelector('.menu-close');
function openMenu() {
  menuPanel?.classList.add('open');
  document.body.classList.add('menu-open');
  menuPanel?.setAttribute('aria-hidden', 'false');
  playTone(330, 0.04, 'sine');
}
function closeMenu() {
  menuPanel?.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuPanel?.setAttribute('aria-hidden', 'true');
}
menuToggle?.addEventListener('click', openMenu);
menuClose?.addEventListener('click', closeMenu);
menuPanel?.querySelectorAll('a, [data-menu-close]').forEach(link =>
  link.addEventListener('click', closeMenu)
);
window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ---------- Reveal-on-scroll ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- Hero text reveal (split chars) ---------- */
const heroH1 = document.querySelector('.hero-copy h1');
if (heroH1) {
  const raw = heroH1.innerHTML;
  const html = raw.split('<br>').map((line, li) => {
    return line.split('').map((ch, i) => {
      const delay = (li * 0.25) + (i * 0.04);
      const safe = ch === ' ' ? '&nbsp;' : ch;
      return `<span class="h1-char" style="animation-delay:${delay}s">${safe}</span>`;
    }).join('');
  }).join('<br>');
  heroH1.innerHTML = html;
}

/* ---------- Tilt for glass cards ---------- */
const tiltCards = document.querySelectorAll('.hero-asx-panel, .tech-board-icons');
tiltCards.forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
    card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  });
});

/* ---------- Project / metric card spotlight ---------- */
document.querySelectorAll('.project-card, .about-metrics > div').forEach(card => {
  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

/* ---------- Click sparks ---------- */
function emitClickSpark(x, y) {
  const spark = document.createElement('span');
  spark.className = 'click-spark';
  spark.style.left = `${x}px`;
  spark.style.top  = `${y}px`;
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 620);
}

document.querySelectorAll('.button, .icon-key, .index-row button, .btm-btn, .project-card, .lab-card, .menu-nav a, .contact-links a').forEach(el => {
  el.addEventListener('click', e => emitClickSpark(e.clientX, e.clientY));
});

function bindSoftHover(selector, base = 430) {
  document.querySelectorAll(selector).forEach((el, i) => {
    let ready = true;
    el.addEventListener('mouseenter', () => {
      if (!ready) return;
      ready = false;
      playTone(base + (i % 6) * 22, 0.028, 'sine');
      setTimeout(() => { ready = true; }, 180);
    });
  });
}
bindSoftHover('.project-card, .lab-card, .button.ghost, .menu-nav a', 360);

/* ---------- Skill board ---------- */
const skillCaption = document.getElementById('skillCaption');
const techKeys = Array.from(document.querySelectorAll('.icon-key'));
const board = document.querySelector('.tech-board-icons');
function popBoard() {
  if (!board) return;
  board.classList.remove('pop'); void board.offsetWidth; board.classList.add('pop');
  setTimeout(() => board.classList.remove('pop'), 460);
}
function setSkill(skill, index = 0) {
  if (!skill) return;
  techKeys.forEach(k => k.classList.toggle('active', k.dataset.skill === skill));
  if (skillCaption) skillCaption.textContent = skill;
  playTone(240 + index * 22, 0.05, 'triangle');
  popBoard();
}
techKeys.forEach((key, i) => {
  key.addEventListener('click', () => setSkill(key.dataset.skill, i));
  key.addEventListener('mouseenter', () => {
    if (skillCaption) skillCaption.textContent = key.dataset.skill;
    playTone(420 + i * 18, 0.028, 'sine');
  });
});
window.addEventListener('keydown', e => {
  const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
  if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    const current = techKeys.findIndex(k => k.classList.contains('active'));
    const dir = e.key === 'ArrowLeft' ? -1 : 1;
    const next = ((current === -1 ? 0 : current) + dir + techKeys.length) % techKeys.length;
    setSkill(techKeys[next].dataset.skill, next);
  }
});

/* =============================================================
   STARFIELD - finance-themed floating data particles
   ============================================================= */
const canvas = document.getElementById('starfield');
const ctx = canvas?.getContext('2d');
let stars = [];
let glyphs = [];
const GLYPH_SET = ['$', '€', '¥', '£', '%', '01', '10', '↑', '↓'];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth  * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  const count = Math.min(120, Math.floor(window.innerWidth / 12));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.2,
    a: Math.random() * 0.55 + 0.1,
    v: Math.random() * 0.18 + 0.03
  }));
  const gcount = Math.min(18, Math.floor(window.innerWidth / 80));
  glyphs = Array.from({ length: gcount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    v: (Math.random() * 0.25 + 0.06) * window.devicePixelRatio,
    size: (Math.random() * 8 + 9) * window.devicePixelRatio,
    char: GLYPH_SET[Math.floor(Math.random() * GLYPH_SET.length)],
    hue: Math.random() > .5 ? 'rgba(255,106,26,' : 'rgba(34,211,238,',
    alpha: Math.random() * 0.22 + 0.08
  }));
}
function drawStars() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(s => {
    s.y += s.v * window.devicePixelRatio;
    if (s.y > canvas.height) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * window.devicePixelRatio, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fill();
  });

  ctx.font = '500 14px JetBrains Mono, monospace';
  glyphs.forEach(g => {
    g.y += g.v;
    if (g.y > canvas.height + 20) {
      g.y = -20;
      g.x = Math.random() * canvas.width;
      g.char = GLYPH_SET[Math.floor(Math.random() * GLYPH_SET.length)];
    }
    ctx.font = `500 ${g.size}px JetBrains Mono, monospace`;
    ctx.fillStyle = `${g.hue}${g.alpha})`;
    ctx.fillText(g.char, g.x, g.y);
  });

  requestAnimationFrame(drawStars);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();

/* =============================================================
   ASX market desk (live clock + sparkline)
   ============================================================= */
const asxStatusEl = document.getElementById('asxStatus');
const asxClockEl  = document.getElementById('asxClock');
const asxCountdownEl = document.getElementById('asxCountdown');
const asxDot = document.getElementById('asxDot');

function sydneyParts(date = new Date()) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney', hour12: false, weekday: 'short',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(date).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
}
function fmtDuration(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}
function updateAsxDesk() {
  if (!asxClockEl) return;
  const p = sydneyParts();
  const weekday = !['Sat','Sun'].includes(p.weekday);
  const current = Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second);
  const open = 9 * 3600 + 59 * 60 + 45;
  const close = 16 * 3600;
  asxClockEl.textContent = `${p.hour}:${p.minute}:${p.second}`;
  if (weekday && current >= open && current < close) {
    if (asxStatusEl) asxStatusEl.textContent = 'market open';
    if (asxCountdownEl) asxCountdownEl.textContent = `${fmtDuration(close - current)} until close`;
    asxDot?.classList.add('open');
  } else {
    if (asxStatusEl) asxStatusEl.textContent = 'market closed';
    let until = open - current;
    if (!weekday || until <= 0) until += 24 * 3600;
    if (asxCountdownEl) asxCountdownEl.textContent = `${fmtDuration(until)} until open`;
    asxDot?.classList.remove('open');
  }
}
updateAsxDesk();
setInterval(updateAsxDesk, 1000);

/* Sparkline */
const sparkLine = document.getElementById('sparkLine');
const sparkArea = document.getElementById('sparkArea');
const sparkDot  = document.getElementById('sparkDot');
let sparkSeed = [62,48,56,68,58,51,46,45,46,46,46,58,75,73,59,50,45,42,48,38,55,53,52,39,45,38,68,92,101,86,88,98,113];
function buildSpark(values = sparkSeed) {
  if (!sparkLine) return;
  const w = 360, h = 120, pad = 8;
  const min = Math.min(...values), max = Math.max(...values);
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2);
    return [x, y];
  });
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  sparkLine.setAttribute('d', d);
  sparkArea.setAttribute('d', `${d} L${w - pad} ${h - pad} L${pad} ${h - pad} Z`);
  const last = pts[pts.length - 1];
  sparkDot.setAttribute('cx', last[0]);
  sparkDot.setAttribute('cy', last[1]);
}
buildSpark();
function mutateSpark(base = 0) {
  sparkSeed = sparkSeed.map((v, i) => Math.max(18, Math.min(115, v + Math.sin(i + base) * 6 + (Math.random() - .5) * 8)));
  buildSpark(sparkSeed);
}
setInterval(() => mutateSpark(Math.random() * 8), 2200);

const indexButtons = Array.from(document.querySelectorAll('.index-row button'));
indexButtons.forEach((btn, i) => {
  btn.addEventListener('mouseenter', () => {
    indexButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mutateSpark(i * 3);
    playTone(520 + i * 90, .04, 'triangle');
  });
});

/* =============================================================
   MARKET TICKER - fake live prices
   ============================================================= */
const tickerSymbols = [
  { sym: 'BHP',    px: 44.82  }, { sym: 'CBA',    px: 122.05 },
  { sym: 'CSL',    px: 286.40 }, { sym: 'WBC',    px: 27.18  },
  { sym: 'NAB',    px: 35.92  }, { sym: 'WES',    px: 68.74  },
  { sym: 'WOW',    px: 31.66  }, { sym: 'TLS',    px: 3.92   },
  { sym: 'FMG',    px: 19.45  }, { sym: 'RIO',    px: 124.30 },
  { sym: 'AAPL',   px: 218.55 }, { sym: 'NVDA',   px: 142.80 },
  { sym: 'TSLA',   px: 246.91 }, { sym: 'MSFT',   px: 425.13 },
  { sym: 'GOOGL',  px: 174.62 }, { sym: 'BTC',    px: 67340  },
  { sym: 'ETH',    px: 3245   }, { sym: 'AUD/USD',px: 0.6612 },
  { sym: 'XAU',    px: 2685.20}, { sym: 'BRENT',  px: 78.44  }
];
function buildTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = tickerSymbols.map(t => {
    const chg = (Math.random() * 4 - 2);
    const up = chg >= 0;
    const pxStr = t.px >= 1000 ? t.px.toLocaleString(undefined, { maximumFractionDigits: 2 }) : t.px.toFixed(2);
    return `
      <span class="ticker-item">
        <span class="sym">${t.sym}</span>
        <span class="px">${pxStr}</span>
        <span class="chg ${up ? 'up' : 'down'}"><span class="arr">${up ? '▲' : '▼'}</span> ${Math.abs(chg).toFixed(2)}%</span>
      </span>
    `;
  }).join('');
  // duplicate for seamless scroll
  track.innerHTML = items + items;
}
buildTicker();
setInterval(buildTicker, 9000);

/* =============================================================
   TERMINAL CARD - typed finance/coding commands
   ============================================================= */
const termBody = document.getElementById('termBody');
const TERMINAL_SCRIPT = [
  { p: '~ portfolio $', cmd: 'python analyse.py --asset ASX200', wait: 220 },
  { out: 'Loading 10y daily returns ...', wait: 320 },
  { out: 'Sharpe Ratio:      <span class="num">0.84</span>', wait: 220 },
  { out: 'Max Drawdown:      <span class="num">-18.2%</span>', wait: 220 },
  { out: 'Annualised Return: <span class="num">9.6%</span>', wait: 320 },
  { p: '~ portfolio $', cmd: 'git commit -m "rebalance Q2 weights"', wait: 240 },
  { out: '<span class="ok">[main 7a2f1b]</span> rebalance Q2 weights', wait: 260 },
  { p: '~ portfolio $', cmd: 'curl api.markets/quote?symbol=AAPL', wait: 280 },
  { out: '{ <span class="key">"symbol"</span>: "AAPL", <span class="key">"px"</span>: <span class="num">218.55</span>, <span class="key">"chg"</span>: <span class="ok">+1.24%</span> }', wait: 320 },
  { p: '~ portfolio $', cmd: 'echo "open to opportunities"', wait: 200 },
  { out: 'open to opportunities', wait: 1400 }
];

async function typeStr(target, str, speed = 18) {
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '<') {
      const close = str.indexOf('>', i);
      target.innerHTML += str.slice(i, close + 1);
      i = close;
    } else {
      target.innerHTML += str[i];
      await new Promise(r => setTimeout(r, speed + Math.random() * 30));
    }
  }
}
async function runTerminal() {
  if (!termBody) return;
  while (true) {
    termBody.innerHTML = '';
    for (const step of TERMINAL_SCRIPT) {
      const line = document.createElement('span');
      line.className = 'line';
      termBody.appendChild(line);
      if (step.cmd) {
        line.innerHTML = `<span class="prompt">${step.p}</span><span class="cmd"></span>`;
        await typeStr(line.querySelector('.cmd'), step.cmd, 22);
      } else {
        line.classList.add('out');
        await typeStr(line, step.out, 10);
      }
      await new Promise(r => setTimeout(r, step.wait || 200));
    }
    const cur = document.createElement('span');
    cur.className = 'cursor';
    termBody.appendChild(cur);
    await new Promise(r => setTimeout(r, 2000));
  }
}
runTerminal();

/* =============================================================
   BEAT THE MARKET mini game
   ============================================================= */
const btmStage    = document.getElementById('btmStage');
const btmStartBtn = document.getElementById('btmStart');
const btmScoreEl  = document.getElementById('btmScore');
const btmTimeEl   = document.getElementById('btmTime');
const btmMsg      = document.getElementById('btmMsg');

const BTM_ASSETS = ['BHP', 'CBA', 'AAPL', 'NVDA', 'BTC', 'TSLA', 'CSL', 'XAU', 'RIO', 'MSFT'];
let btmState = { running: false, score: 0, time: 25, spawn: null, tick: null };

function btmSpawn() {
  if (!btmState.running || !btmStage) return;
  const sym = BTM_ASSETS[Math.floor(Math.random() * BTM_ASSETS.length)];
  const up  = Math.random() > 0.45;
  const el = document.createElement('button');
  el.className = `btm-asset ${up ? 'up' : 'down'}`;
  el.dataset.up = up ? '1' : '0';
  el.innerHTML = `${sym} <span>${up ? '▲' : '▼'}</span>`;
  const x = 10 + Math.random() * (btmStage.clientWidth  - 90);
  const y = 50 + Math.random() * (btmStage.clientHeight - 90);
  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
  btmStage.appendChild(el);
  const lifetime = 1500 + Math.random() * 700;
  el.dataset.t = setTimeout(() => el.remove(), lifetime);

  el.addEventListener('click', () => {
    el.classList.add('pop');
    if (up) {
      btmState.score += 1;
      playTone(680, 0.06, 'triangle');
    } else {
      btmState.score = Math.max(0, btmState.score - 1);
      playTone(160, 0.08, 'sawtooth');
    }
    if (btmScoreEl) btmScoreEl.textContent = btmState.score;
    setTimeout(() => el.remove(), 350);
  });
}

function btmEnd() {
  btmState.running = false;
  clearInterval(btmState.spawn);
  clearInterval(btmState.tick);
  btmStage?.querySelectorAll('.btm-asset').forEach(el => el.remove());
  if (btmStartBtn) { btmStartBtn.disabled = false; btmStartBtn.textContent = 'Play again'; }
  if (btmMsg) {
    const s = btmState.score;
    btmMsg.textContent = s >= 18 ? `Alpha generated. ${s} pts.`
                       : s >= 10 ? `Beat the index. ${s} pts.`
                       : s >= 5  ? `Solid trade. ${s} pts.`
                                 : `Try again. ${s} pts.`;
  }
}

btmStartBtn?.addEventListener('click', () => {
  if (btmState.running) return;
  btmState = { running: true, score: 0, time: 25, spawn: null, tick: null };
  if (btmScoreEl) btmScoreEl.textContent = '0';
  if (btmTimeEl)  btmTimeEl.textContent  = '25';
  if (btmMsg)     btmMsg.textContent     = 'Click ▲ green tickers. Avoid ▼ red.';
  btmStartBtn.disabled = true;
  btmStartBtn.textContent = 'Running...';
  btmState.spawn = setInterval(btmSpawn, 460);
  btmState.tick = setInterval(() => {
    btmState.time -= 1;
    if (btmTimeEl) btmTimeEl.textContent = btmState.time;
    if (btmState.time <= 0) btmEnd();
  }, 1000);
});

/* =============================================================
   ALLOCATION slider + risk score
   ============================================================= */
const allocStocks = document.getElementById('allocStocks');
const allocBonds  = document.getElementById('allocBonds');
const allocStocksVal = document.getElementById('allocStocksVal');
const allocBondsVal  = document.getElementById('allocBondsVal');
const allocCashVal   = document.getElementById('allocCashVal');
const segStocks  = document.querySelector('.alloc-bar .seg-stocks');
const segBonds   = document.querySelector('.alloc-bar .seg-bonds');
const segCash    = document.querySelector('.alloc-bar .seg-cash');
const riskScoreEl = document.getElementById('riskScore');
const riskLevelEl = document.getElementById('riskLevel');

function updateAllocation() {
  if (!allocStocks || !allocBonds) return;
  let s = Number(allocStocks.value);
  let b = Number(allocBonds.value);
  if (s + b > 100) {
    b = 100 - s;
    allocBonds.value = b;
  }
  const c = 100 - s - b;

  if (allocStocksVal) allocStocksVal.textContent = `${s}%`;
  if (allocBondsVal)  allocBondsVal.textContent  = `${b}%`;
  if (allocCashVal)   allocCashVal.textContent   = `${c}%`;

  if (segStocks) segStocks.style.width = `${s}%`;
  if (segBonds)  segBonds.style.width  = `${b}%`;
  if (segCash)   segCash.style.width   = `${c}%`;

  // simple risk score: stocks weight heavy, bonds medium, cash light
  const score = Math.round((s * 1.0 + b * 0.35 + c * 0.05));
  if (riskScoreEl) {
    riskScoreEl.textContent = score;
    let color = 'var(--green)';
    let level = 'Conservative';
    if (score > 75)      { color = 'var(--red)';   level = 'Aggressive'; }
    else if (score > 55) { color = 'var(--accent)';level = 'Growth'; }
    else if (score > 35) { color = 'var(--gold)';  level = 'Balanced'; }
    riskScoreEl.style.color = color;
    if (riskLevelEl) { riskLevelEl.textContent = level; riskLevelEl.style.color = color; }
  }
}
allocStocks?.addEventListener('input', () => { updateAllocation(); playTone(260, 0.025, 'triangle'); });
allocBonds?.addEventListener('input',  () => { updateAllocation(); playTone(300, 0.025, 'triangle'); });
updateAllocation();


/* =============================================================
   CONTACT FORM - in-page success popup, no external redirect
   ============================================================= */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message = 'Submitted successfully.') {
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  if (formStatus) formStatus.textContent = message;
}

contactForm?.addEventListener('submit', event => {
  event.preventDefault();

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    playTone(180, 0.06, 'sawtooth');
    return;
  }

  showToast('Submitted successfully.');
  playTone(520, 0.06, 'triangle');
  setTimeout(() => playTone(760, 0.08, 'sine'), 90);
  contactForm.reset();
});

contactForm?.querySelectorAll('input, textarea').forEach((field, i) => {
  field.addEventListener('focus', () => playTone(310 + i * 28, 0.025, 'sine'));
});

/* =============================================================
   EASTER EGG - click name/logo 5x
   ============================================================= */
const nameTriggers = [
  document.querySelector('.header-name'),
  document.querySelector('.hero-copy h1')
].filter(Boolean);

let eggCount = 0;
let eggTimer = null;
const eggOverlay = document.getElementById('easterEgg');

nameTriggers.forEach(el => {
  el.addEventListener('click', () => {
    eggCount++;
    clearTimeout(eggTimer);
    eggTimer = setTimeout(() => { eggCount = 0; }, 1500);
    playTone(440 + eggCount * 80, 0.05, 'triangle');
    if (eggCount >= 5) {
      eggCount = 0;
      eggOverlay?.classList.add('show');
      playTone(880, 0.12, 'sine');
      setTimeout(() => playTone(1120, 0.12, 'sine'), 120);
      setTimeout(() => playTone(1320, 0.18, 'triangle'), 260);
    }
  });
});

document.querySelector('.ee-close')?.addEventListener('click', () => {
  eggOverlay?.classList.remove('show');
});
eggOverlay?.addEventListener('click', e => {
  if (e.target === eggOverlay) eggOverlay.classList.remove('show');
});
