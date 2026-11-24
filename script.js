/* ==========================================================================
   Bachelorette invitation film — sequencing, player, procedural cheetah print
   ========================================================================== */
(() => {
  'use strict';

  const C = window.INVITE || {};
  const T = C.text || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const get = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

  /* ------------------------------------------------------------------------
     Procedural cheetah print: seeded, seamless SVG tile
     ------------------------------------------------------------------------ */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = v => v.toFixed(1);
  function smooth(pts) {
    const n = pts.length;
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + 'Z';
  }
  function blob(r, cx, cy, rx, ry, rot, jit, n = 9) {
    const pts = [];
    const cr = Math.cos(rot), sr = Math.sin(rot);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.35;
      const k = 1 + (r() * 2 - 1) * jit;
      const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
      pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
    }
    return smooth(pts);
  }
  // one broken, irregular arc of a rosette ring
  function arcPiece(r, R, mid, span, w) {
    const N = 7, outer = [], inner = [];
    for (let k = 0; k <= N; k++) {
      const t = k / N;
      const a = mid - span / 2 + span * t;
      const prof = Math.pow(Math.sin(Math.PI * t), 0.55);
      const wo = w * (0.3 + 0.7 * prof) * (0.8 + 0.4 * r());
      const wi = w * (0.25 + 0.75 * prof) * (0.8 + 0.4 * r());
      const ro = R + wo * 0.55, ri = R - wi * 0.45;
      outer.push([Math.cos(a) * ro, Math.sin(a) * ro]);
      inner.unshift([Math.cos(a) * ri, Math.sin(a) * ri]);
    }
    return smooth(outer.concat(inner));
  }
  function scatter(r, W, count, existing = []) {
    const pts = existing.slice();
    const out = [];
    for (let i = 0; i < count; i++) {
      let best = null, bd = -1;
      for (let c = 0; c < 24; c++) {
        const p = [r() * W, r() * W];
        let d = Infinity;
        for (const q of pts) {
          let dx = Math.abs(p[0] - q[0]), dy = Math.abs(p[1] - q[1]);
          dx = Math.min(dx, W - dx); dy = Math.min(dy, W - dy);
          d = Math.min(d, (dx * dx + dy * dy) / (q[2] || 1));
        }
        if (d > bd) { bd = d; best = p; }
      }
      pts.push(best); out.push(best);
    }
    return out;
  }
  function cheetahSVG(seed = 2026, W = 360) {
    const r = rng(seed);
    const DARK = '#22130a', CENTER = '#9e5b25', SPOT = '#2a170c';
    let g = '';
    // soft tonal blotches (fur variation)
    for (let i = 0; i < 16; i++) {
      const x = r() * W, y = r() * W, rad = 30 + r() * 60;
      g += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="url(#${r() < 0.55 ? 'lt' : 'dk'})"/>`;
    }
    // rosettes
    const ros = scatter(r, W, 30).map(p => [p[0], p[1], 1]);
    for (const [x, y] of ros) {
      const R = 11 + r() * 8;
      const sy = 0.72 + r() * 0.28, rot = r() * 180;
      let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(1 ${sy.toFixed(2)})">`;
      s += `<path d="${blob(r, 0, 0, R * 0.82, R * 0.78, r() * 6, 0.16)}" fill="${CENTER}" opacity="${(0.7 + r() * 0.25).toFixed(2)}"/>`;
      const k = 3 + Math.floor(r() * 3);
      const a0 = r() * Math.PI * 2;
      for (let j = 0; j < k; j++) {
        if (r() < 0.08) continue; // occasionally missing segment → broken look
        const slot = (Math.PI * 2) / k;
        const mid = a0 + j * slot + (r() - 0.5) * slot * 0.25;
        const span = slot * (0.5 + r() * 0.32);
        const w = R * (0.42 + r() * 0.26);
        s += `<path d="${arcPiece(r, R * (0.92 + r() * 0.16), mid, span, w)}" fill="${DARK}"/>`;
      }
      if (r() < 0.3) s += `<path d="${blob(r, (r() - 0.5) * R * 0.5, (r() - 0.5) * R * 0.5, 2 + r() * 2, 2 + r() * 2, 0, 0.2, 7)}" fill="${DARK}"/>`;
      g += s + '</g>';
    }
    // solid spots, small and medium
    const spots = scatter(r, W, 60, ros.map(p => [p[0], p[1], 4]));
    spots.forEach(([x, y], i) => {
      const big = i % 5 === 0;
      const rx = big ? 5 + r() * 3.5 : 2.2 + r() * 3.2;
      g += `<path d="${blob(r, x, y, rx, rx * (0.7 + r() * 0.4), r() * 6, 0.22, 8)}" fill="${SPOT}"/>`;
    });

    let uses = '';
    for (const dx of [-W, 0, W]) for (const dy of [-W, 0, W]) uses += `<use xlink:href="#t" href="#t" x="${dx}" y="${dy}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">` +
      `<defs><radialGradient id="lt"><stop offset="0" stop-color="#ecca8c" stop-opacity=".7"/><stop offset="1" stop-color="#ecca8c" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="dk"><stop offset="0" stop-color="#a8733a" stop-opacity=".55"/><stop offset="1" stop-color="#a8733a" stop-opacity="0"/></radialGradient>` +
      `<g id="t">${g}</g></defs><rect width="${W}" height="${W}" fill="#cf9d5a"/>${uses}</svg>`;
  }
  const svgUrl = s => `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}")`;
  document.documentElement.style.setProperty('--cheetah', svgUrl(cheetahSVG()));

  // film grain tile
  try {
    const cv = document.createElement('canvas'); cv.width = cv.height = 160;
    const cx = cv.getContext('2d'); const im = cx.createImageData(160, 160);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = Math.random() * 255;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255;
    }
    cx.putImageData(im, 0, 0);
    document.documentElement.style.setProperty('--grain', `url(${cv.toDataURL('image/png')})`);
  } catch (e) { /* no grain, no problem */ }

  const stage = $('#stage');
  if (!stage) return; // used standalone (e.g. for the share image)

  /* ------------------------------------------------------------------------
     Content from config.js
     ------------------------------------------------------------------------ */
  $$('[data-c]').forEach(el => {
    const v = get(C, el.dataset.c);
    if (v != null && v !== '') el.textContent = v;
  });
  if (T.countdownLabels) $$('#countdown small').forEach((s, i) => { if (T.countdownLabels[i]) s.textContent = T.countdownLabels[i]; });
  document.title = `${T.invited || "You're invited"} — ${get(C, 'bride.name') || ''}`.trim();

  // split text into animatable characters (words kept together)
  function splitChars(el) {
    const words = el.textContent.split(' ');
    el.textContent = '';
    el.setAttribute('aria-label', words.join(' '));
    words.forEach((w, i) => {
      const ws = document.createElement('span'); ws.className = 'w'; ws.setAttribute('aria-hidden', 'true');
      for (const ch of w) { const c = document.createElement('span'); c.className = 'ch'; c.textContent = ch; ws.appendChild(c); }
      el.appendChild(ws);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return $$('.ch', el);
  }
  // rolling digits: each digit spins through 0–9 twice before landing
  function makeRoll(el, str) {
    el.textContent = '';
    const strips = [];
    for (const ch of String(str)) {
      const d = document.createElement('span'); d.className = 'digit';
      if (/\d/.test(ch)) {
        const s = document.createElement('span'); s.className = 'strip';
        const seq = '01234567890123456789' + ch;
        for (const c of seq) { const n = document.createElement('span'); n.textContent = c; s.appendChild(n); }
        d.appendChild(s); strips.push({ s, n: seq.length });
      } else { d.textContent = ch === ' ' ? ' ' : ch; }
      el.appendChild(d);
    }
    return strips;
  }
  const dayStrips = makeRoll($('#day'), get(C, 'date.day') || '00');
  const yearStrips = makeRoll($('#year'), get(C, 'date.year') || '2026');

  // dress code swatches
  const sw = $('#swatches');
  (get(C, 'dressCode.swatches') || []).forEach(s => {
    const w = document.createElement('div'); w.className = 'sw';
    const dot = document.createElement('span'); dot.className = 'sw-dot';
    if (s.type === 'cheetah') dot.classList.add('cheetah');
    else if (s.type === 'gold') dot.classList.add('gold');
    else dot.style.background = s.color || '#000';
    const lab = document.createElement('span'); lab.className = 'sw-label'; lab.textContent = s.label || '';
    w.append(dot, lab); sw.appendChild(w);
  });

  // baby photo (placeholder stays visible if missing)
  const img = $('#babyImg');
  if (C.babyPhoto) {
    img.addEventListener('error', () => { img.remove(); });
    img.addEventListener('load', () => { $('#ph').style.visibility = 'hidden'; });
    img.src = C.babyPhoto;
  } else img.remove();

  // links
  const ev = C.event || {};
  const toUTC = s => { const d = new Date(s); return isNaN(d) ? '' : d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  const where = [C.venue, C.address].filter(Boolean).join(', ');
  const gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(ev.title || '')}` +
    `&dates=${toUTC(ev.start)}/${toUTC(ev.end || ev.start)}` +
    `&details=${encodeURIComponent(ev.description || '')}` +
    `&location=${encodeURIComponent(where)}`;
  const esc = s => String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitation//EN', 'BEGIN:VEVENT',
    `UID:${toUTC(ev.start)}-bachelorette@invite`, `DTSTAMP:${toUTC(new Date().toISOString())}`,
    `DTSTART:${toUTC(ev.start)}`, `DTEND:${toUTC(ev.end || ev.start)}`,
    `SUMMARY:${esc(ev.title)}`, `DESCRIPTION:${esc(ev.description)}`, `LOCATION:${esc(where)}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  $('#calGoogle').href = gcal;
  $('#calIcs').href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  $('#btnMap').href = C.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}`;
  const wa = String(get(C, 'rsvp.whatsappNumber') || '').replace(/\D/g, '');
  $('#btnRsvp').href = `https://wa.me/${wa}?text=${encodeURIComponent(get(C, 'rsvp.message') || '')}`;
  const calBtn = $('#btnCal'), calMenu = $('#calMenu');
  calBtn.addEventListener('click', e => {
    e.stopPropagation();
    calMenu.hidden = !calMenu.hidden;
    calBtn.setAttribute('aria-expanded', String(!calMenu.hidden));
  });
  document.addEventListener('click', e => { if (!calMenu.hidden && !e.target.closest('.cal-wrap')) { calMenu.hidden = true; calBtn.setAttribute('aria-expanded', 'false'); } });

  // countdown
  let cdTimer = null;
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const ms = new Date(ev.start) - new Date();
    if (isNaN(ms)) return;
    if (ms <= 0) {
      $('#countdown').hidden = true;
      const done = $('#cdDone'); done.hidden = false; done.textContent = T.countdownDone || '';
      clearInterval(cdTimer); cdTimer = null; return;
    }
    const s = Math.floor(ms / 1000);
    $('#cdD').textContent = pad(Math.floor(s / 86400));
    $('#cdH').textContent = pad(Math.floor(s / 3600) % 24);
    $('#cdM').textContent = pad(Math.floor(s / 60) % 60);
    $('#cdS').textContent = pad(s % 60);
  }
  function startCountdown() { if (!cdTimer) { tick(); cdTimer = setInterval(tick, 1000); } }

  // shrink long names to fit
  function fit(el, maxPx, minCqw) {
    const cw = stage.clientWidth / 100;
    let size = parseFloat(getComputedStyle(el).fontSize) / cw;
    el.style.fontSize = size + 'cqw';
    let guard = 40;
    while (el.scrollWidth > maxPx && size > minCqw && guard--) { size *= 0.94; el.style.fontSize = size + 'cqw'; }
  }

  /* ------------------------------------------------------------------------
     Static fallback (reduced motion, or GSAP failed to load)
     ------------------------------------------------------------------------ */
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function goStatic() {
    document.body.classList.add('static');
    stage.classList.add('at-final');
    $('#gate').classList.add('gone');
    startCountdown();
  }

  const fontsReady = (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
    .catch(() => {});
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 3000))]).then(() => {
    fit($('#nameText'), stage.clientWidth * 0.86, 7);
    fit($('#finalName'), $('#finalCard').clientWidth * 0.84, 6);
    if (reduced || !window.gsap) { goStatic(); return; }
    init();
  });

  /* ------------------------------------------------------------------------
     The film
     ------------------------------------------------------------------------ */
  function init() {
    const SCENES = ['open', 'envelope', 'invited', 'name', 'photo', 'date', 'place', 'dress', 'final'];
    const prog = $('#progress');
    SCENES.forEach(() => { const i = document.createElement('i'); i.appendChild(document.createElement('b')); prog.appendChild(i); });
    const bars = $$('#progress b');

    const inviteChars = splitChars($('#inviteTitle'));
    const monthChars = splitChars($('#month'));

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' }, onUpdate, onComplete: () => toFinal() });
    const at = {};
    const mark = (n, t) => { at[n] = t; tl.addLabel(n, t); };

    gsap.set('#wipe', { xPercent: -101, autoAlpha: 1 });
    gsap.set('#sweep', { xPercent: -200, rotate: 14, autoAlpha: 1 });

    /* 0 · opening ---------------------------------------------------- */
    mark('open', 0);
    tl.set('#sOpen', { autoAlpha: 1 }, 0);
    tl.fromTo('.spark-glow', { scale: 0.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' }, 0.25);
    tl.fromTo('.spark', { scale: 0, rotate: -120, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.6, ease: 'expo.out' }, 0.3);
    tl.fromTo('.open-line', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power3.inOut' }, 1.2);
    tl.to('.spark', { scale: 0, rotate: 90, opacity: 0, duration: 0.6, ease: 'power2.in' }, 2.2);
    tl.to('.spark-glow', { scale: 1.6, opacity: 0, duration: 0.8, ease: 'power1.in' }, 2.2);
    tl.set('#sEnv', { autoAlpha: 1 }, 2.6);
    tl.fromTo('#envBg', { scale: 1.2 }, { scale: 1, duration: 7.5, ease: 'none' }, 2.6);
    tl.to('.s-open .half.top', { yPercent: -101, duration: 1.4, ease: 'power3.inOut' }, 2.7);
    tl.to('.s-open .half.bot', { yPercent: 101, duration: 1.4, ease: 'power3.inOut' }, 2.7);
    tl.to('.open-line', { opacity: 0, duration: 0.6 }, 2.8);
    tl.set('#sOpen', { autoAlpha: 0 }, 4.2);

    /* 1 · envelope --------------------------------------------------- */
    mark('envelope', 3.4);
    tl.fromTo('#env', { yPercent: 150, rotate: -9 }, { yPercent: 0, rotate: 0, duration: 1.7, ease: 'expo.out' }, 3.4);
    tl.fromTo('#seal', { rotate: 0 }, { keyframes: { rotate: [0, -7, 6, -4, 2, 0] }, duration: 0.55, ease: 'none' }, 5.2);
    tl.fromTo('.crack', { opacity: 0 }, { opacity: 1, duration: 0.12 }, 5.7);
    tl.fromTo('.seal-half.l', { x: 0, y: 0, rotate: 0, opacity: 1 }, { xPercent: -45, yPercent: 60, rotate: -28, opacity: 0, duration: 0.85, ease: 'power2.in' }, 5.85);
    tl.fromTo('.seal-half.r', { x: 0, y: 0, rotate: 0, opacity: 1 }, { xPercent: 45, yPercent: 70, rotate: 24, opacity: 0, duration: 0.85, ease: 'power2.in' }, 5.85);
    tl.to('.crack', { opacity: 0, duration: 0.2 }, 5.9);
    tl.fromTo('#flap', { rotateX: 0 }, { rotateX: 180, duration: 1.15, ease: 'power2.inOut' }, 6.3);
    tl.set('#flap', { zIndex: 2 }, 6.88);
    tl.fromTo('#miniCard', { yPercent: 0 }, { yPercent: -60, duration: 1.4, ease: 'power3.inOut' }, 7.3);

    /* 2 · zoom into the card → "You're invited" ---------------------- */
    mark('invited', 8.9);
    tl.to(['#envBack', '#envFront', '#envLines', '#flap'], { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 8.9);
    tl.to('#env', { yPercent: 55, scale: 3.6, transformOrigin: '50% -6%', duration: 1.3, ease: 'power3.in' }, 8.9);
    tl.fromTo('#sInvite', { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 9.75);
    tl.set('#sEnv', { autoAlpha: 0 }, 10.7);
    tl.fromTo('.s-invite .rule', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power3.inOut' }, 10.2);
    tl.fromTo(inviteChars, { opacity: 0, yPercent: 55 }, { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.075, ease: 'power3.out' }, 10.3);
    tl.fromTo('#inviteSub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 11.7);

    /* 3 · cross-dissolve → name writes itself ------------------------ */
    mark('name', 13.1);
    tl.to('#sInvite', { autoAlpha: 0, duration: 1.1, ease: 'power1.inOut' }, 13.1);
    tl.fromTo('#sName', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.1, ease: 'power1.inOut' }, 13.1);
    tl.fromTo('#nameKicker', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9 }, 13.8);
    tl.fromTo('#write', { xPercent: -100 }, { xPercent: 0, duration: 2.5, ease: 'power1.inOut' }, 14.3);
    tl.fromTo('#writeIn', { xPercent: 100 }, { xPercent: 0, duration: 2.5, ease: 'power1.inOut' }, 14.3);
    tl.fromTo('#nibTrack', { xPercent: -100 }, { xPercent: 0, duration: 2.5, ease: 'power1.inOut' }, 14.3);
    tl.fromTo('.nib', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 14.3);
    tl.to('.nib', { opacity: 0, scale: 2, duration: 0.6 }, 16.6);
    tl.fromTo('#nameRule', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.inOut' }, 16.4);
    tl.fromTo('#nameSub', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9 }, 16.7);

    /* 4 · cheetah wipe → polaroid develops --------------------------- */
    mark('photo', 18.0);
    tl.fromTo('#wipe', { xPercent: -101 }, { xPercent: 0, duration: 0.7, ease: 'power3.in' }, 18.0);
    tl.set('#sName', { autoAlpha: 0 }, 18.7);
    tl.set('#sPhoto', { autoAlpha: 1 }, 18.7);
    tl.to('#wipe', { xPercent: 101, duration: 0.85, ease: 'power3.out' }, 18.7);
    tl.fromTo('#photoBg', { scale: 1.18 }, { scale: 1.02, duration: 6.5, ease: 'none' }, 18.7);
    tl.fromTo('#polaroid', { yPercent: -170, rotate: -24 }, { yPercent: 0, rotate: -4, duration: 1.5, ease: 'back.out(1.05)' }, 18.95);
    tl.fromTo('#devWhite', { opacity: 1 }, { opacity: 0, duration: 3.2, ease: 'power1.inOut' }, 20.2);
    tl.fromTo('#devWarm', { opacity: 1 }, { opacity: 0, duration: 3.6, ease: 'power1.in' }, 20.5);
    tl.fromTo('#caption', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 21.0);
    tl.fromTo('#photoSub', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 21.8);

    /* 5 · gold light sweep → date ------------------------------------ */
    mark('date', 24.3);
    tl.fromTo('#sweep', { xPercent: -200 }, { xPercent: 220, duration: 1.3, ease: 'power2.inOut' }, 24.3);
    tl.fromTo('#flash', { opacity: 0 }, { opacity: 0.55, duration: 0.35, ease: 'power2.in' }, 24.55);
    tl.to('#flash', { opacity: 0, duration: 0.7, ease: 'power2.out' }, 24.9);
    tl.set('#sPhoto', { autoAlpha: 0 }, 24.9);
    tl.set('#sDate', { autoAlpha: 1 }, 24.9);
    tl.fromTo('.lines .t, .lines .b', { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power3.inOut' }, 24.9);
    tl.fromTo('.lines .l, .lines .r', { scaleY: 0 }, { scaleY: 1, duration: 1.4, ease: 'power3.inOut' }, 25.0);
    tl.fromTo('#dateKicker', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 25.0);
    tl.fromTo('#weekday', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 25.2);
    tl.fromTo(dayStrips.map(s => s.s), { yPercent: 0 }, { yPercent: (i) => -100 * (dayStrips[i].n - 1) / dayStrips[i].n, duration: 1.8, stagger: 0.15, ease: 'power4.out' }, 25.1);
    tl.fromTo(monthChars, { opacity: 0, yPercent: 50 }, { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, 26.0);
    tl.fromTo(yearStrips.map(s => s.s), { yPercent: 0 }, { yPercent: (i) => -100 * (yearStrips[i].n - 1) / yearStrips[i].n, duration: 1.6, stagger: 0.1, ease: 'power4.out' }, 26.3);
    tl.fromTo('#year', { opacity: 0 }, { opacity: 1, duration: 0.5 }, 26.3);

    /* 6 · mask reveal → time & place --------------------------------- */
    mark('place', 28.7);
    tl.set('#sPlace', { autoAlpha: 1 }, 28.7);
    tl.fromTo('#placeMask', { yPercent: 100 }, { yPercent: 0, duration: 1.15, ease: 'power3.inOut' }, 28.7);
    tl.fromTo('#placeInner', { yPercent: -100 }, { yPercent: 0, duration: 1.15, ease: 'power3.inOut' }, 28.7);
    tl.set('#sDate', { autoAlpha: 0 }, 29.9);
    tl.fromTo('#placeKicker', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 29.6);
    tl.fromTo('#placeTitle', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 29.7);
    tl.fromTo('#placeRule', { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 30.0);
    tl.fromTo('.details .ico', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.45, ease: 'back.out(1.6)' }, 30.4);
    tl.fromTo('.details .li', { yPercent: 110 }, { yPercent: 0, duration: 0.95, stagger: 0.45, ease: 'power3.out' }, 30.5);

    /* 7 · slow zoom dissolve → dress code ---------------------------- */
    mark('dress', 33.4);
    tl.to('#sPlace', { scale: 1.14, autoAlpha: 0, duration: 1.5, ease: 'power2.in' }, 33.4);
    tl.fromTo('#sDress', { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'power2.out' }, 33.9);
    tl.fromTo('#dressKicker', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 34.4);
    tl.fromTo('#dressTitle', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 34.5);
    tl.fromTo('.sw-dot', { scale: 0 }, { scale: 1, duration: 0.75, stagger: 0.32, ease: 'back.out(1.7)' }, 35.1);
    tl.fromTo('.sw-label', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.32 }, 35.35);
    tl.fromTo('#dressNote', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1 }, 36.7);

    /* 8 · final card ------------------------------------------------- */
    mark('final', 38.8);
    tl.to('#sDress', { autoAlpha: 0, duration: 1, ease: 'power1.inOut' }, 38.8);
    tl.fromTo('#sFinal', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.1, ease: 'power1.inOut' }, 39.0);
    tl.fromTo('#finalBg', { scale: 1.16 }, { scale: 1, duration: 3.5, ease: 'power2.out' }, 39.0);
    tl.fromTo('#finalCard', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, ease: 'power3.out' }, 39.5);
    tl.fromTo('#finalCard .fc', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.07 }, 39.9);

    const starts = SCENES.map(n => at[n]);
    const END = tl.duration();

    /* ---- player state ---- */
    let finalShown = false;
    function onUpdate() {
      const t = tl.time();
      bars.forEach((b, i) => {
        const s = starts[i], e = i < starts.length - 1 ? starts[i + 1] : END;
        b.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - s) / (e - s)))})`;
      });
      const isFinal = t >= at.final + 0.6;
      if (isFinal !== finalShown) { finalShown = isFinal; isFinal ? toFinal() : leaveFinal(); }
    }
    function toFinal() {
      finalShown = true;
      stage.classList.add('at-final');
      startCountdown();
      music.fadeOut();
    }
    function leaveFinal() { stage.classList.remove('at-final'); }
    const sceneAt = t => { let i = 0; starts.forEach((s, k) => { if (t >= s - 0.01) i = k; }); return i; };
    function next() { const i = sceneAt(tl.time()); if (i < SCENES.length - 1) tl.play(starts[i + 1]); }
    function prev() {
      const t = tl.time(), i = sceneAt(t);
      tl.play(t - starts[i] > 1.2 || i === 0 ? starts[i] : starts[i - 1]);
    }

    /* ---- music ---- */
    const music = (() => {
      let a = null, ok = false;
      const btn = $('#btnMute');
      if (C.music) {
        a = new Audio(); a.loop = true; a.preload = 'auto'; a.volume = 0;
        a.addEventListener('error', () => { ok = false; btn.hidden = true; });
        a.src = C.music;
      }
      const vol = { v: 0 };
      const setV = () => { if (a) a.volume = Math.max(0, Math.min(1, vol.v)); };
      btn.addEventListener('click', e => { e.stopPropagation(); if (!a) return; a.muted = !a.muted; btn.classList.toggle('muted', a.muted); btn.setAttribute('aria-label', a.muted ? 'Unmute music' : 'Mute music'); });
      return {
        start() {
          if (!a) return;
          a.currentTime = 0;
          const p = a.play();
          if (p && p.then) p.then(() => { ok = true; btn.hidden = false; gsap.killTweensOf(vol); gsap.fromTo(vol, { v: 0 }, { v: 0.7, duration: 3, onUpdate: setV }); })
            .catch(() => { btn.hidden = true; });
        },
        fadeOut() {
          if (!a || !ok) return;
          gsap.killTweensOf(vol);
          gsap.to(vol, { v: 0, duration: 6, delay: 4, ease: 'power1.in', onUpdate: setV, onComplete: () => a.pause() });
        }
      };
    })();

    /* ---- gate ---- */
    const gate = $('#gate');
    stage.classList.add('ready');
    let opened = false;
    function open() {
      if (opened) return; opened = true;
      gate.classList.add('gone');
      music.start();
      setTimeout(() => tl.play(0), 450);
    }
    gate.addEventListener('click', open);
    gate.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

    /* ---- tap / hold ---- */
    let holdTimer = null, held = false, downAt = 0, downX = 0;
    const interactive = e => e.target.closest('button, a, .controls, .gate') || stage.classList.contains('at-final');
    stage.addEventListener('pointerdown', e => {
      if (!opened || interactive(e)) return;
      downAt = Date.now(); downX = e.clientX; held = false;
      holdTimer = setTimeout(() => { held = true; tl.pause(); stage.classList.add('is-paused'); }, 220);
    });
    const release = (e, cancel) => {
      if (!downAt) return;
      clearTimeout(holdTimer);
      const wasHeld = held; downAt = 0; held = false;
      if (wasHeld) { stage.classList.remove('is-paused'); tl.play(); return; }
      if (cancel) return;
      const r = stage.getBoundingClientRect();
      (downX - r.left) < r.width * 0.33 ? prev() : next();
    };
    stage.addEventListener('pointerup', e => release(e, false));
    stage.addEventListener('pointercancel', e => release(e, true));
    stage.addEventListener('pointerleave', e => { if (held) release(e, true); });
    stage.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if (!opened || stage.classList.contains('at-final')) return;
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ') { e.preventDefault(); tl.paused() ? tl.play() : tl.pause(); stage.classList.toggle('is-paused', tl.paused()); }
    });

    $('#btnSkip').addEventListener('click', e => { e.stopPropagation(); tl.pause(); tl.progress(1); toFinal(); });
    $('#btnReplay').addEventListener('click', e => {
      e.stopPropagation();
      leaveFinal(); finalShown = false; calMenu.hidden = true;
      music.start();
      tl.play(0);
    });

    // debug/test hook: ?scene=name&t=1.5 jumps straight to a moment (also opens the gate)
    const q = new URLSearchParams(location.search);
    if (q.has('scene')) {
      opened = true; gate.classList.add('gone');
      const t = (at[q.get('scene')] || 0) + parseFloat(q.get('t') || 0);
      tl.pause(t); onUpdate();
    }
    window.__film = { tl, at };
  }
})();
