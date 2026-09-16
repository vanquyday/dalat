/* Đà Lạt 3N2Đ — bản đồ thật (Leaflet/OSM) + lịch trình tự chạy. Dữ liệu ở data.js */
const $ = (id) => document.getElementById(id);
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fmt = (m) => { m = Math.max(0, Math.round(m)); return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };

const ZONE = {
  center: { z: 14, name: 'Trung tâm Đà Lạt' },
  caudat: { z: 14, name: 'Cầu Đất — Xuân Trường' },
  south:  { z: 12, name: 'Đường ra sân bay Liên Khương' }
};
const KIND = {
  place:  { c: '#c67139', t: 'Check-in',    i: 'camera' },
  food:   { c: '#8c491a', t: 'Ăn',          i: 'utensils' },
  cafe:   { c: '#b2622d', t: 'Cafe',        i: 'coffee' },
  hotel:  { c: '#82796a', t: 'Khách sạn',   i: 'bed-double' },
  market: { c: '#d67f48', t: 'Chợ đêm',     i: 'store' },
  nature: { c: '#728157', t: 'Thiên nhiên', i: 'mountain' },
  shop:   { c: '#56633f', t: 'Mua sắm',     i: 'shopping-basket' }
};

function km(a, b) {
  const R = 6371, p = Math.PI / 180;
  const dLat = (b[0] - a[0]) * p, dLon = (b[1] - a[1]) * p;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * p) * Math.cos(b[0] * p) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

STOPS.forEach(s => { s.min = toMin(s.t); });
/* tách nhẹ các điểm trùng toạ độ (khách sạn, quán ăn lặp lại) để ghim không đè nhau */
const seen = {};
STOPS.forEach(s => {
  const k = s.ll.map(v => v.toFixed(3)).join(',');
  const n = seen[k] = (seen[k] || 0);
  seen[k]++;
  const ang = n * 2.4, r = n ? 0.0034 + n * 0.0013 : 0;
  s.pll = [s.ll[0] + Math.sin(ang) * r, s.ll[1] + Math.cos(ang) * r];
});
const DAYS = TRIP.days.map(d => {
  const stops = STOPS.filter(s => s.d === d.d);
  stops.forEach((s, i) => {
    if (i === 0) { s.travel = 0; s.depart = s.min; return; }
    const prev = stops[i - 1];
    s.distKm = km(prev.ll, s.ll);
    s.travel = Math.max(6, Math.round(s.distKm / 28 * 60));
    s.depart = Math.max(prev.min + 5, s.min - s.travel);
  });
  return { ...d, stops, start: stops[0].min - 15, end: stops[stops.length - 1].min + 30 };
});
const TOTAL_KM = DAYS.reduce((a, d) => a + d.stops.reduce((b, s) => b + (s.distKm || 0), 0), 0);

const state = { day: 1, clock: DAYS[0].start, playing: false, speed: 1, curIdx: -1, celebrated: {} };
const SIM_PER_SEC = 34;

/* ---------- crew & stats ---------- */
$('concept').textContent = TRIP.concept + ' — bấm ▶ để xem cả nhóm tự đi theo giờ trên bản đồ.';
$('crew').innerHTML = PEOPLE.map(p => `<div class="person">
  <div class="ph">${p.photo ? `<img src="${p.photo}" alt="${p.name}">` : ''}</div>
  <div><b>${p.name}</b><span>${p.gender}</span></div></div>`).join('');
$('mini').innerHTML = PEOPLE.map(p => `<div class="av" title="${p.name}">${p.photo ? `<img src="${p.photo}" alt="${p.name}">` : ''}</div>`).join('');
const STATS = [
  [STOPS.length, 'điểm dừng'],
  [Math.round(TOTAL_KM) + ' km', 'tổng đường đi'],
  [FOODS.length, 'món phải thử'],
  ['3 ngày', '2 đêm']
];
$('stats').innerHTML = STATS.map(([a, b]) => `<div class="stat"><b>${a}</b><span>${b}</span></div>`).join('');

/* ---------- bản đồ thật ---------- */
const map = L.map('map', { zoomControl: false, scrollWheelZoom: false, attributionControl: true })
  .setView([11.9404, 108.4383], 14);
L.control.zoom({ position: 'bottomright' }).addTo(map);
/* 3 kiểu bản đồ, tất cả miễn phí và không cần API key */
const BASES = {
  'Đường phố': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, attribution: 'Esri, HERE, Garmin, &copy; OpenStreetMap contributors' }),
  'Vệ tinh': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, attribution: 'Esri, Maxar, Earthstar Geographics' }),
  'Địa hình': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, attribution: 'Esri, HERE, Garmin, &copy; OpenStreetMap contributors' })
};
let baseNow = 'Đường phố';
BASES[baseNow].addTo(map);
$('bases').innerHTML = Object.keys(BASES).map(k =>
  `<button data-b="${k}" aria-pressed="${k === baseNow}">${k}</button>`).join('');
$('bases').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || b.dataset.b === baseNow) return;
  map.removeLayer(BASES[baseNow]);
  baseNow = b.dataset.b;
  BASES[baseNow].addTo(map).bringToBack();
  [...$('bases').children].forEach(x => x.setAttribute('aria-pressed', x === b));
});
map.on('click', () => map.scrollWheelZoom.enable());

let pins = [], donePoly = null, restPoly = null, partyMarker = null, dayStops = [], follow = true;
map.on('dragstart', () => { follow = false; setTimeout(() => follow = true, 6000); });

function pinHtml(s, i) {
  const k = KIND[s.kind];
  return `<div class="pin" data-i="${i}">
    <span class="ic" style="background:${k.c}"><i data-lucide="${k.i}"></i></span>
    <span class="lb">${s.t}<br><small>${s.title}</small></span></div>`;
}
function partyHtml() {
  return `<div class="partyIcon"><div class="ring"></div>` +
    PEOPLE.map(p => `<div class="av"><img src="${p.photo}" alt="${p.name}"></div>`).join('') + `</div>`;
}

function buildDay() {
  const day = DAYS.find(d => d.d === state.day);
  dayStops = day.stops;
  pins.forEach(p => map.removeLayer(p.m)); pins = [];
  [donePoly, restPoly].forEach(p => p && map.removeLayer(p));

  restPoly = L.polyline(dayStops.map(s => s.pll), {
    color: '#8c7a63', weight: 3, opacity: .45, dashArray: '2 10', lineCap: 'round'
  }).addTo(map);
  donePoly = L.polyline([], { color: '#c67139', weight: 5.5, opacity: .95, lineCap: 'round', lineJoin: 'round' }).addTo(map);

  pins = dayStops.map((s, i) => {
    const m = L.marker(s.pll, {
      icon: L.divIcon({ className: '', html: pinHtml(s, i), iconSize: [0, 0], iconAnchor: [-9, 16] }),
      zIndexOffset: 100 + i, keyboard: false
    }).addTo(map);
    m.on('click', () => { state.clock = s.min; state.playing = false; syncPlay(); });
    return { m, s };
  });
  if (partyMarker) map.removeLayer(partyMarker);
  partyMarker = L.marker(dayStops[0].pll, {
    icon: L.divIcon({ className: '', html: partyHtml(), iconSize: [96, 56], iconAnchor: [48, 52] }),
    zIndexOffset: 900
  }).addTo(map);
  if (window.lucide) lucide.createIcons();

  $('dayTitle').textContent = `Ngày ${day.d}`;
  $('daySub').textContent = day.name;
  $('scrub').min = day.start; $('scrub').max = day.end;
  buildList(day);
}

function buildList(day) {
  const list = $('list'); list.replaceChildren();
  day.stops.forEach((s) => {
    const d = document.createElement('div');
    d.className = 'stop'; d.tabIndex = 0;
    d.innerHTML = `<div class="tm">${s.t}</div><div>
      <div class="ti">${s.title}</div><div class="ts">${s.sub}</div>
      ${s.items.length ? `<ul>${s.items.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
      <span class="kindtag" style="background:${KIND[s.kind].c}22;color:${KIND[s.kind].c}">${KIND[s.kind].t}</span>
      ${s.distKm ? `<span class="kindtag" style="background:#eee7db;color:#645c50">${s.distKm.toFixed(1)} km · ~${s.travel}′</span>` : ''}
    </div>`;
    const go = () => { state.clock = s.min; state.playing = false; syncPlay(); };
    d.addEventListener('click', go);
    d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    list.appendChild(d);
  });
}

/* ---------- điều khiển ---------- */
$('daytabs').innerHTML = DAYS.map(d => `<button class="btn btn-secondary" data-d="${d.d}">Ngày ${d.d}</button>`).join('');
$('daytabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  state.day = +b.dataset.d; state.clock = DAYS.find(d => d.d === state.day).start; state.curIdx = -1;
  buildDay(); markDayTabs(); flyToStop(dayStops[0]);
});
function markDayTabs() {
  [...$('daytabs').children].forEach(b => b.className = 'btn ' + (+b.dataset.d === state.day ? 'btn-primary' : 'btn-secondary'));
}
$('play').addEventListener('click', () => { state.playing = !state.playing; syncPlay(); });
function syncPlay() { $('play').textContent = state.playing ? '❚❚ Tạm dừng' : '▶ Chạy lịch'; }
$('speeds').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  state.speed = +b.dataset.s;
  [...$('speeds').children].forEach(x => x.setAttribute('aria-pressed', x === b));
});
$('scrub').addEventListener('input', e => { state.clock = +e.target.value; state.playing = false; syncPlay(); });
$('toTop').addEventListener('click', () => window.scrollTo({ top: $('stage').offsetTop - 70, behavior: 'smooth' }));
document.addEventListener('keydown', e => {
  if (e.target.matches('input,button,textarea')) return;
  if (e.code === 'Space') { e.preventDefault(); state.playing = !state.playing; syncPlay(); }
});

/* ---------- vị trí nhóm ---------- */
function partyState() {
  const c = state.clock;
  let i = -1;
  for (let k = 0; k < dayStops.length; k++) if (c >= dayStops[k].min) i = k;
  if (i < 0) return { from: dayStops[0], idx: -1, traveling: false, ll: dayStops[0].pll, p: 0 };
  const cur = dayStops[i], next = dayStops[i + 1];
  if (next && c >= next.depart) {
    const p = Math.min(1, (c - next.depart) / Math.max(1, next.min - next.depart));
    const e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    return { from: cur, to: next, idx: i, traveling: true, p,
      ll: [cur.ll[0] + (next.ll[0] - cur.ll[0]) * e, cur.ll[1] + (next.ll[1] - cur.ll[1]) * e] };
  }
  return { from: cur, idx: i, traveling: false, ll: cur.pll, p: 0 };
}
function flyToStop(s) { if (follow) map.flyTo(s.pll, ZONE[s.zone].z, { duration: 1.5 }); }
function flyToSegment(a, b) {
  if (!follow) return;
  map.flyToBounds(L.latLngBounds([a.pll, b.pll]).pad(.35), { duration: 1.6, maxZoom: 14 });
}

/* ---------- nền trời theo giờ ---------- */
function phaseOf(m) {
  const h = (m / 60) % 24;
  if (h < 5.3) return 'night';
  if (h < 6.6) return 'dawn';
  if (h < 10.5) return 'morning';
  if (h < 15.4) return 'noon';
  if (h < 18.4) return 'sunset';
  return 'night';
}
const PHASE_LABEL = { night: 'Trời còn tối', dawn: 'Bình minh', morning: 'Sáng sớm', noon: 'Trưa nắng', sunset: 'Hoàng hôn' };
let phaseNow = '';
function setPhase(m) {
  const p = phaseOf(m);
  if (p === phaseNow) return;
  phaseNow = p;
  document.body.dataset.phase = p;
  document.body.classList.toggle('dark', p === 'night');
  $('phaseName').textContent = PHASE_LABEL[p];
}
$('stars').innerHTML = Array.from({ length: 70 }, () =>
  `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 62).toFixed(1)}%;width:${(1.5 + Math.random() * 2.4).toFixed(1)}px;animation-delay:${(-Math.random() * 4).toFixed(2)}s;animation-duration:${(2.4 + Math.random() * 2.6).toFixed(1)}s"></i>`).join('');

/* ---------- ánh sáng theo giờ (lọc màu tile) ---------- */
function tileFilter(m) {
  const h = (m / 60) % 24;
  if (baseNow === 'Vệ tinh') return h < 5.4 || h >= 19.3 ? 'brightness(.62) saturate(.8)' : 'none';
  if (h < 5.4 || h >= 19.3) return 'brightness(.6) saturate(.7) hue-rotate(200deg) contrast(1.05)';
  if (h < 6.5) return 'brightness(.82) saturate(.85) hue-rotate(-14deg)';
  if (h < 8) return 'brightness(1.04) saturate(1.08) sepia(.14)';
  if (h < 15.4) return 'saturate(1.03)';
  if (h < 17.5) return 'brightness(1.02) sepia(.12) saturate(1.1)';
  return 'brightness(.9) sepia(.2) saturate(1.15) hue-rotate(-10deg)';
}

/* ---------- thẻ ảnh ---------- */
function showPhoto(s) {
  const card = $('photocard');
  if (!s || !s.photos || !s.photos.length) { card.classList.remove('on'); return; }
  $('shots').innerHTML = s.photos.slice(0, 2).map(u => `<img src="${u}" alt="${s.title}" loading="lazy">`).join('');
  $('pcTitle').textContent = s.title;
  $('pcSub').textContent = s.sub;
  card.classList.add('on');
}

/* ---------- sương mù ---------- */
$('fog').innerHTML = Array.from({ length: 7 }, (_, i) =>
  `<i style="left:-24%;top:${6 + i * 12}%;width:${190 + i * 44}px;height:${44 + (i % 3) * 26}px;animation-duration:${25 + i * 7}s;animation-delay:${-i * 5}s;opacity:${.32 + (i % 3) * .12}"></i>`).join('');

/* ---------- confetti khi xong 1 ngày ---------- */
const cvs = $('confetti'), ctx = cvs.getContext('2d');
let bits = [];
function sizeCvs() { const r = cvs.getBoundingClientRect(); cvs.width = r.width; cvs.height = r.height; }
addEventListener('resize', sizeCvs); sizeCvs();
function celebrate() {
  const cols = ['#c67139', '#7a8a5e', '#d67f48', '#ebddc5', '#8c491a'];
  for (let i = 0; i < 110; i++) bits.push({
    x: cvs.width * (.2 + Math.random() * .6), y: cvs.height * .45,
    vx: (Math.random() - .5) * 8, vy: -4 - Math.random() * 8,
    r: 3 + Math.random() * 5, a: Math.random() * 6.3, va: (Math.random() - .5) * .3,
    c: cols[i % cols.length], life: 1
  });
  ding(660); setTimeout(() => ding(880), 150); setTimeout(() => ding(1100), 300);
}
function drawBits(dt) {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  bits = bits.filter(b => b.life > 0);
  bits.forEach(b => {
    b.vy += 16 * dt; b.x += b.vx * dt * 60 / 4; b.y += b.vy * dt * 60 / 4; b.a += b.va; b.life -= dt * .34;
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a);
    ctx.globalAlpha = Math.max(0, b.life); ctx.fillStyle = b.c;
    ctx.fillRect(-b.r, -b.r * .5, b.r * 2, b.r); ctx.restore();
  });
}

/* ---------- âm thanh ---------- */
let actx, ambGain;
function ensureCtx() { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); return actx; }
function ding(f = 880) {
  if (!actx) return;
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0, actx.currentTime);
  g.gain.linearRampToValueAtTime(.14, actx.currentTime + .02);
  g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + .7);
  o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + .75);
}
$('sound').addEventListener('click', () => {
  const btn = $('sound'), on = btn.getAttribute('aria-pressed') === 'true';
  ensureCtx();
  if (!ambGain) {
    ambGain = actx.createGain(); ambGain.gain.value = 0;
    const filt = actx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 820;
    ambGain.connect(filt); filt.connect(actx.destination);
    [196, 293.66, 392, 587.33, 880].forEach((f, i) => {
      const o = actx.createOscillator(); o.type = i % 2 ? 'sine' : 'triangle'; o.frequency.value = f;
      const g = actx.createGain(); g.gain.value = .15 / (i + 1);
      const lfo = actx.createOscillator(); lfo.frequency.value = .05 + i * .019;
      const lg = actx.createGain(); lg.gain.value = .1 / (i + 1);
      lfo.connect(lg); lg.connect(g.gain); lfo.start();
      o.connect(g); g.connect(ambGain); o.start();
    });
  }
  actx.resume();
  ambGain.gain.cancelScheduledValues(actx.currentTime);
  ambGain.gain.linearRampToValueAtTime(on ? 0 : .5, actx.currentTime + 1.2);
  btn.setAttribute('aria-pressed', String(!on));
  btn.className = 'btn ' + (on ? 'btn-ghost' : 'btn-primary');
  btn.style.borderRadius = '999px'; btn.style.fontSize = '13px';
});

/* ---------- vòng lặp ---------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min(.08, (now - last) / 1000); last = now;
  const day = DAYS.find(d => d.d === state.day);
  if (state.playing) {
    state.clock += dt * SIM_PER_SEC * state.speed;
    if (state.clock > day.end) {
      if (!state.celebrated[day.d]) { state.celebrated[day.d] = true; celebrate(); }
      const ni = DAYS.findIndex(d => d.d === state.day) + 1;
      if (ni < DAYS.length) {
        state.day = DAYS[ni].d; state.clock = DAYS[ni].start; state.curIdx = -1;
        buildDay(); markDayTabs(); flyToStop(dayStops[0]);
      } else { state.clock = day.end; state.playing = false; syncPlay(); }
    }
  }
  const ps = partyState();

  /* nhóm + đường đã đi */
  partyMarker.setLatLng(ps.ll);
  const doneLL = dayStops.slice(0, Math.max(ps.idx + 1, 1)).map(s => s.pll);
  if (ps.traveling) doneLL.push(ps.ll);
  donePoly.setLatLngs(doneLL);

  /* pins */
  pins.forEach((o, i) => {
    const node = o.m.getElement() && o.m.getElement().querySelector('.pin');
    if (!node) return;
    const near = Math.abs(i - Math.max(ps.idx, 0)) <= 3;
    node.classList.toggle('cur', i === ps.idx && !ps.traveling);
    node.classList.toggle('done', i < ps.idx);
    node.classList.toggle('dim', !near);
    node.classList.toggle('nolabel', i !== ps.idx);
  });

  /* nền trời theo giờ */
  setPhase(state.clock);

  /* ánh sáng + sương mù */
  const pane = document.querySelector('.leaflet-tile-pane');
  if (pane) pane.style.filter = tileFilter(state.clock);
  const cur = ps.idx < 0 ? dayStops[0] : ps.from;
  $('fog').classList.toggle('on', !!((ps.traveling ? ps.to : cur).fog));

  /* HUD */
  $('clock').textContent = fmt(state.clock);
  $('nowTitle').textContent = ps.traveling ? `Đang di chuyển → ${ps.to.title}` : cur.title;
  $('nowSub').textContent = ps.traveling
    ? `${ps.to.distKm.toFixed(1)} km · còn ~${Math.max(0, Math.round(ps.to.min - state.clock))} phút`
    : cur.sub;
  $('zoneName').textContent = ZONE[(ps.traveling ? ps.to : cur).zone].name;
  const ti = $('travelInfo');
  if (ps.traveling) { ti.style.display = ''; ti.textContent = `${Math.round(ps.p * 100)}% đoạn đường · ~${ps.to.travel}′`; }
  else ti.style.display = 'none';
  $('prog').style.width = Math.max(0, Math.min(100, (state.clock - day.start) / (day.end - day.start) * 100)) + '%';
  if (!$('scrub').matches(':active')) $('scrub').value = state.clock;

  /* đổi điểm */
  if (ps.idx !== state.curIdx) {
    const forward = ps.idx > state.curIdx;
    state.curIdx = ps.idx;
    const items = [...$('list').children];
    items.forEach((n, i) => { n.classList.toggle('cur', i === ps.idx); n.classList.toggle('past', i < ps.idx); });
    const active = items[Math.max(ps.idx, 0)];
    if (active) $('list').scrollTop = active.offsetTop - 90;
    showPhoto(ps.idx < 0 ? null : dayStops[ps.idx]);
    const s = dayStops[Math.max(ps.idx, 0)];
    const nxt = dayStops[ps.idx + 1];
    if (ps.traveling && nxt) flyToSegment(s, nxt); else flyToStop(s);
    if (forward && ps.idx >= 0) ding(740);
  }

  drawBits(dt);
  requestAnimationFrame(frame);
}

/* ---------- bộ ảnh món ăn ---------- */
const FILTERS = ['Tất cả', 'Ngày 1', 'Ngày 2', 'Ngày 3', 'Sáng', 'Trưa', 'Tối', 'Ăn vặt'];
let filter = 'Tất cả';
$('foodFilters').innerHTML = FILTERS.map(f => `<button data-f="${f}" aria-pressed="${f === filter}">${f}</button>`).join('');
$('foodFilters').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  filter = b.dataset.f;
  [...$('foodFilters').children].forEach(x => x.setAttribute('aria-pressed', x === b));
  renderFoods();
});
function renderFoods() {
  const f = filter;
  const list = FOODS.filter(x => {
    if (f === 'Tất cả') return true;
    if (f.startsWith('Ngày')) return x.days.includes(+f.slice(-1));
    if (f === 'Ăn vặt') return x.meal === 'vặt';
    return x.meal === f.toLowerCase();
  });
  $('foods').innerHTML = list.map((x, i) => `<div class="fc" style="animation-delay:${i * 45}ms">
    ${x.photo ? `<img src="${x.photo}" alt="${x.name}" loading="lazy">`
      : `<div class="ph">Chưa có ảnh — thêm link ảnh của bạn vào data.js</div>`}
    <h3>${x.name}</h3>
    <p>Ngày ${x.days.join(', ')} · ${x.meal === 'vặt' ? 'ăn vặt' : 'bữa ' + x.meal}</p></div>`).join('');
}
renderFoods();

/* ---------- chi phí ---------- */
const maxCost = Math.max(...COSTS.map(c => c.max));
$('costs').innerHTML = COSTS.map(c => `<div class="row">
  <div>${c.label}</div>
  <div class="bar"><i data-w="${c.max / maxCost}"></i><i class="min" data-w="${c.min / maxCost}"></i></div>
  <div class="val">${c.min}k – ${c.max}k</div></div>`).join('');
const tMin = COSTS.reduce((a, c) => a + c.min, 0), tMax = COSTS.reduce((a, c) => a + c.max, 0);
$('costTotal').textContent = `Tổng: ${(tMin / 1000).toFixed(1)} – ${(tMax / 1000).toFixed(1)} triệu / người`;
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    [...e.target.querySelectorAll('.bar i')].forEach((i, k) => setTimeout(() => i.style.transform = `scaleX(${i.dataset.w})`, k * 55));
    io.unobserve(e.target);
  }
}), { threshold: .25 });
io.observe($('costs'));

$('notes').innerHTML = NOTES.map(n => `<li>${n}</li>`).join('');
$('packing').innerHTML = PACKING.map(n => `<li>${n}</li>`).join('');

/* ---------- khởi động ---------- */
buildDay(); markDayTabs(); syncPlay();
map.setView(dayStops[0].pll, 14);
requestAnimationFrame(frame);
setTimeout(() => { state.playing = true; syncPlay(); }, 1200);
const mapcard = document.querySelector('.mapcard');
new ResizeObserver(() => map.invalidateSize()).observe(mapcard);
addEventListener('load', () => map.invalidateSize());
[0, 120, 400, 1200].forEach(t => setTimeout(() => map.invalidateSize(), t));
