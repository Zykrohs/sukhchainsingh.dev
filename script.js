
const loader = document.getElementById('loader');
const soundToggle = document.querySelector('.sound-toggle');
let soundEnabled = true;
window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('hidden'), 650);
});
soundToggle?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.textContent = soundEnabled ? 'Sound On' : 'Sound Off';
  soundToggle.classList.toggle('off', !soundEnabled);
  if (soundEnabled) playTone(520, .055, 'triangle');
});
window.addEventListener('pointerdown', () => {
  if (soundEnabled) playTone(180, .035, 'sine');
}, { once: true });
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
  if (!soundEnabled) return;
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

const skillCaption = document.getElementById('skillCaption');
const techKeys = Array.from(document.querySelectorAll('.icon-key, .ref-key, .tech-key'));
const soundMap = [240, 275, 310, 350, 390, 430, 470, 520, 570, 620, 670, 720, 760, 810, 860, 910, 960, 1020, 1070, 1120, 1180, 1240, 1300, 1360];

techKeys.forEach((key, index) => {
  key.addEventListener('click', () => setSkill(key.dataset.skill, index));
  key.addEventListener('mouseenter', () => {
    setCaption(key.dataset.skill);
    playTone(soundMap[index % soundMap.length], 0.028, 'square');
  });
});

window.addEventListener('keydown', (event) => {
  const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
  if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;
  const current = techKeys.findIndex((key) => key.classList.contains('active'));
  const next = event.key === 'ArrowLeft' ? current - 1 : current + 1;
  const wrapped = (next + techKeys.length) % techKeys.length;
  setSkill(techKeys[wrapped].dataset.skill, wrapped);
});

function setCaption(label) {
  if (!skillCaption || !label) return;
  skillCaption.textContent = label;
}

function setSkill(skill, index = 0) {
  if (!skill) return;
  techKeys.forEach((key) => key.classList.toggle('active', key.dataset.skill === skill));
  setCaption(skill);
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


const board = document.querySelector('.tech-board-icons') || document.querySelector('.tech-board-ref');
function popBoard(){
  if (!board) return;
  board.classList.remove('pop');
  void board.offsetWidth;
  board.classList.add('pop');
  setTimeout(()=>board.classList.remove('pop'), 460);
}
document.querySelectorAll('.icon-key, .ref-key').forEach((key, index) => {
  key.addEventListener('click', () => popBoard());
  key.addEventListener('mouseenter', () => {
    key.animate([
      { transform: getComputedStyle(key).transform },
      { transform: 'translateZ(62px) translateY(-12px) rotateZ(-1.4deg)' },
      { transform: getComputedStyle(key).transform }
    ], { duration: 240, easing: 'ease-out' });
  });
});
window.addEventListener('keydown', (event) => {
  const isTyping = ['INPUT','TEXTAREA'].includes(document.activeElement?.tagName);
  if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) popBoard();
});
document.querySelectorAll('a, button').forEach((el) => {
  el.addEventListener('mouseenter', () => playTone(740, .025, 'sine'));
});

// v16 ASX market desk and richer UI tones
const asxStatusEl = document.getElementById('asxStatus');
const asxClockEl = document.getElementById('asxClock');
const asxCountdownEl = document.getElementById('asxCountdown');
function sydneyParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney', hour12: false, weekday: 'short',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(date).reduce((acc, p) => (acc[p.type] = p.value, acc), {});
  return parts;
}
function secondsUntil(from, targetSeconds) {
  const current = Number(from.hour) * 3600 + Number(from.minute) * 60 + Number(from.second);
  return targetSeconds - current;
}
function fmtDuration(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}
function updateAsxDesk() {
  if (!asxClockEl || !asxStatusEl || !asxCountdownEl) return;
  const now = new Date();
  const p = sydneyParts(now);
  const weekday = !['Sat','Sun'].includes(p.weekday);
  const current = Number(p.hour) * 3600 + Number(p.minute) * 60 + Number(p.second);
  const open = 9 * 3600 + 59 * 60 + 45;
  const close = 16 * 3600;
  asxClockEl.textContent = `${p.hour}:${p.minute}:${p.second}`;
  if (weekday && current >= open && current < close) {
    asxStatusEl.textContent = 'market open';
    asxCountdownEl.textContent = `${fmtDuration(close - current)} until close`;
  } else {
    asxStatusEl.textContent = 'market closed';
    let until = secondsUntil(p, open);
    if (!weekday || until <= 0) until += 24 * 3600;
    asxCountdownEl.textContent = `${fmtDuration(until)} until open`;
  }
}
updateAsxDesk();
setInterval(updateAsxDesk, 1000);

function playStackChord(index = 0) {
  if (!soundEnabled) return;
  [0, 7, 12].forEach((offset, i) => setTimeout(() => playTone(220 + index * 18 + offset * 12, 0.04, i === 1 ? 'triangle' : 'sine'), i * 28));
}
document.querySelectorAll('.icon-key').forEach((key, index) => {
  key.addEventListener('click', () => playStackChord(index));
});
