// ============================================================
// PRERANA & RAUNAK — WEDDING INVITATION
// ============================================================

// LANGUAGE
let marathi = false;

// WEDDING DATE
const weddingDate = new Date('2026-12-18T13:00:00+05:30');


// ============================================================
// COUNTDOWN
// ============================================================

function countdown() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());

  const vals = [
    Math.floor(diff / 86400000),
    Math.floor(diff / 3600000) % 24,
    Math.floor(diff / 60000) % 60,
    Math.floor(diff / 1000) % 60
  ];

  const ids = ['days', 'hours', 'minutes', 'seconds'];
  const marathiDigits = '०१२३४५६७८९';

  ids.forEach((id, i) => {
    const element = document.getElementById(id);
    if (!element) return;

    let value = String(vals[i]).padStart(2, '0');

    if (marathi) {
      value = value.replace(/[0-9]/g, d => marathiDigits[+d]);
    }

    element.textContent = value;
  });

  if (diff === 0) {
    const note = document.getElementById('countdown-note');

    if (note) {
      note.textContent = marathi
        ? 'मंगल सोहळा सुरू झाला आहे! ✨'
        : 'The celebrations have begun! ✨';
    }
  }
}

countdown();
setInterval(countdown, 1000);


// ============================================================
// SCROLL PROGRESS BAR
// ============================================================

window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const progress = document.getElementById('progress');

  if (progress) {
    progress.style.width =
      (max > 0 ? scrollY / max * 100 : 0) + '%';
  }
}, { passive: true });


// ============================================================
// ENGLISH / MARATHI TRANSLATION
// ============================================================

const languageButton = document.getElementById('lang');

languageButton.addEventListener('click', () => {
  marathi = !marathi;

  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = el.dataset[marathi ? 'mr' : 'en'];
  });

  languageButton.textContent = marathi ? 'English' : 'मराठी';

  document.documentElement.lang = marathi ? 'mr' : 'en';

  countdown();
  translateDynamic();
});


// ============================================================
// CALENDAR EVENTS
// ============================================================

const events = {
  wedding: {
    title: 'Prerana & Raunak — Wedding Ceremony',
    start: '20261218T073000Z',
    end: '20261218T093000Z'
  },

  reception: {
    title: 'Prerana & Raunak — Wedding Reception',
    start: '20261218T123000Z',
    end: '20261218T143000Z'
  }
};

const venue =
  'Larisa Resort, Gangapur-Savargaon Road, near York Winery, Gangavhare, Nashik, Maharashtra 422222, India';

function icsEscape(s) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

document.querySelectorAll('.calendar').forEach(btn => {
  btn.addEventListener('click', () => {

    const e = events[btn.dataset.event];

    const uid =
      `${btn.dataset.event}-20261218@prerana-raunak`;

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Prerana Raunak Wedding//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${new Date().toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '')}`,
      `DTSTART:${e.start}`,
      `DTEND:${e.end}`,
      `SUMMARY:${icsEscape(e.title)}`,
      `LOCATION:${icsEscape(venue)}`,
      'DESCRIPTION:We look forward to celebrating with you!',
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    const blob = new Blob(
      [lines.join('\r\n') + '\r\n'],
      { type: 'text/calendar;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;
    a.download = `prerana-raunak-${btn.dataset.event}.ics`;

    document.body.append(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
});


// ============================================================
// SHARE INVITATION
// ============================================================

document.getElementById('share').addEventListener('click', async () => {

  const status = document.getElementById('share-status');

  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Prerana & Raunak — Wedding Invitation',
        text: 'Join us on 18 December 2026 in Nashik!',
        url: location.href
      });

      return;
    }

    await navigator.clipboard.writeText(location.href);

    status.textContent = 'Invitation link copied!';

  } catch (err) {

    if (err.name !== 'AbortError') {
      status.textContent =
        'Copy the URL from your browser to share.';
    }
  }
});


// ============================================================
// SOUNDCLOUD MUSIC
// ============================================================

// Music is OFF until SoundCloud confirms playback.
// This prevents the button from incorrectly showing ON.

let musicOn = false;

const musicButton = document.getElementById('music-toggle');
const musicFrame = document.getElementById('wedding-music');

let music = null;
let musicReady = false;
let musicRequested = false;


// Update music button text and accessibility state.

function translateDynamic() {

  const note = document.getElementById('countdown-note');

  if (Date.now() >= weddingDate.getTime() && note) {
    note.textContent = marathi
      ? 'मंगल सोहळा सुरू झाला आहे! ✨'
      : 'The celebrations have begun! ✨';
  }

  if (musicButton) {

    musicButton.textContent = musicOn
      ? (marathi ? '♫ संगीत बंद करा' : '♫ Music on')
      : (marathi ? '♫ संगीत सुरू करा' : '♫ Music off');

    musicButton.setAttribute(
      'aria-pressed',
      String(musicOn)
    );
  }
}


// Set the actual playback state.
// Only SoundCloud events should mark the music as playing.

function setMusicState(isPlaying) {
  musicOn = isPlaying;
  translateDynamic();
}


// Initialize SoundCloud.

if (musicFrame && typeof SC !== 'undefined') {

  music = SC.Widget(musicFrame);

  music.bind(SC.Widget.Events.READY, function () {

    musicReady = true;

    // If the invitation was already opened,
    // try to start the music now.

    if (musicRequested) {
      music.play();
    }
  });


  // Music has actually started.

  music.bind(SC.Widget.Events.PLAY, function () {
    setMusicState(true);
  });


  // Music has been paused.

  music.bind(SC.Widget.Events.PAUSE, function () {
    setMusicState(false);
  });


  // Music has finished.

  music.bind(SC.Widget.Events.FINISH, function () {
    setMusicState(false);
  });
}


// Request music playback.

function startMusic() {

  musicRequested = true;

  if (music && musicReady) {
    music.play();
  }
}


// Stop music playback.

function stopMusic() {

  musicRequested = false;

  if (music) {
    music.pause();
  }
}


// Music button toggle.

function toggleMusic() {

  if (musicOn || (musicRequested && !musicOn)) {
    stopMusic();
  } else {
    startMusic();
  }
}


// Music button click.

if (musicButton) {

  musicButton.addEventListener('click', toggleMusic);
}


// Set initial button state.

translateDynamic();


// ============================================================
// FLOATING FLOWER PETALS
// ============================================================

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const petals = document.getElementById('petal-field');

if (!reducedMotion && petals) {

  for (let i = 0; i < 24; i++) {

    const petal = document.createElement('span');

    petal.className =
      'petal' +
      (i % 5 === 0 ? ' gold' :
       i % 4 === 0 ? ' purple' : '');

    petal.style.setProperty(
      '--left',
      `${(i * 47.37) % 100}%`
    );

    petal.style.setProperty(
      '--delay',
      `${-(i * 2.13) % 20}s`
    );

    petal.style.setProperty(
      '--duration',
      `${11 + (i % 8) * 1.4}s`
    );

    petal.style.setProperty(
      '--sway',
      `${(i % 2 ? 1 : -1) * (45 + i % 7 * 11)}px`
    );

    petal.style.setProperty(
      '--rotation',
      `${i * 32}deg`
    );

    petals.append(petal);
  }
}


// ============================================================
// WAX SEAL OPENING ANIMATION
// ============================================================

const overlay = document.getElementById('envelope-overlay');

const openButton = document.getElementById('open-invitation');

function openInvitation() {

  if (overlay.classList.contains('opening')) {
    return;
  }

  // Start music when the guest opens the invitation.
  // The button will show ON only after playback begins.

  startMusic();

  // Play envelope-opening animation.

  overlay.classList.add('opening');

  setTimeout(() => {

    overlay.classList.add('opened');

    overlay.setAttribute('aria-hidden', 'true');

    openButton.setAttribute('tabindex', '-1');

    const heroButton =
      document.querySelector('.hero .primary');

    if (heroButton) {
      heroButton.focus({ preventScroll: true });
    }

  }, reducedMotion ? 50 : 1300);
}

openButton.addEventListener('click', openInvitation);


// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================

const scrollObserver = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add('visible');

        scrollObserver.unobserve(entry.target);
      }
    });

  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -24px 0px'
  }
);

document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .reveal-zoom'
).forEach(el => scrollObserver.observe(el));
