const track = document.getElementById('carouselTrack');
const cards = track.querySelectorAll('.recipe-card');
const dotsContainer = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playBtn = document.getElementById('playBtn');

let currentIndex = 0;
let isPlaying = true;
let intervalId = null;
const SLIDE_DELAY = 5000;

cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
});

function updateCarousel() {
  const offset = -currentIndex * 100;
  track.style.transform = `translateX(${offset}%)`;
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function next() {
  currentIndex = (currentIndex + 1) % cards.length;
  updateCarousel();
}

function prev() {
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  updateCarousel();
}

function goTo(index) {
  currentIndex = index;
  updateCarousel();
  resetInterval();
}

function startAutoplay() {
  intervalId = setInterval(next, SLIDE_DELAY);
}

function stopAutoplay() {
  clearInterval(intervalId);
  intervalId = null;
}

function resetInterval() {
  if (isPlaying) {
    stopAutoplay();
    startAutoplay();
  }
}

prevBtn.addEventListener('click', () => { prev(); resetInterval(); });
nextBtn.addEventListener('click', () => { next(); resetInterval(); });
playBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? '⏸' : '▶';
  if (isPlaying) startAutoplay(); else stopAutoplay();
});

const wrapper = document.querySelector('.carousel-wrapper');
wrapper.addEventListener('mouseenter', stopAutoplay);
wrapper.addEventListener('mouseleave', () => { if (isPlaying) startAutoplay(); });

startAutoplay();

const langButtons = document.querySelectorAll('.lang-btn');
let currentLang = 'es';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en][data-es]').forEach(el => {
    el.textContent = el.dataset[lang];
  });
  langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

langButtons.forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

let touchStartX = 0;
let touchEndX = 0;

track.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

track.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) next(); else prev();
    resetInterval();
  }
}, { passive: true });
