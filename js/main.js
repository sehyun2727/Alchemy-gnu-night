/* GNU NIGHT in Gwangju — scroll engine + setlist turntables */
(() => {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const pad   = n => String(n).padStart(2, '0');
const esc   = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const isKo  = s => /[가-힣]/.test(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================
   DATA — 여기만 고치면 셋리스트가 바뀝니다.
   t: 제목 / r: 읽기(로마자) / a: 아티스트 / d: 한 줄 설명
   quirk: reverse | rain | blur | wobble  (턴테이블 고장 종류)
   ========================================================= */
const SHOW_START = '2026-10-31T18:00:00+09:00';

const SETS = [
  { id:'akg', order:'01', team:'Alchemy Kung-Fu Generation', from:'ALCHEMY',
    tagline:'ASIAN KUNG-FU GENERATION 커버 · 4곡 · 첫 무대', color:'#e9b52a', abbr:'AKG', quirk:'reverse',
    songs:[
      {t:'ソラニン', r:'Solanin', a:'ASIAN KUNG-FU GENERATION',
       d:'2010년, 아사노 이니오 원작 영화 「소라닌」의 주제가. 조용히 시작하는 척하다가 마지막에 전부 터뜨리는 곡. 첫 곡부터 감정선을 다 씁니다.'},
      {t:'リライト', r:'Rewrite', a:'ASIAN KUNG-FU GENERATION',
       d:'2004년 「강철의 연금술사」 4기 오프닝. 연금술 동아리 Alchemy가 연금술사의 노래를 안 할 수는 없습니다. 후렴의 절규는 관객 몫.'},
      {t:'Re:Re:', r:'Re:Re:', a:'ASIAN KUNG-FU GENERATION',
       d:'2004년 앨범 「ソルファ」에 실렸다가 2016년 「僕だけがいない街」 오프닝으로 다시 녹음된 곡. 두 번 태어난 노래가 오늘 세 번째로 태어납니다.'},
      {t:'転がる岩、君に朝が降る', r:'Korogaru Iwa, Kimi ni Asa ga Furu', a:'ASIAN KUNG-FU GENERATION',
       d:'2008년 「ワールド ワールド ワールド」 수록. 구르는 돌 위로 아침이 내리는 노래. 시끄러운 세트를 가장 조용한 곡으로 닫습니다.'}
    ]},
  { id:'ameu', order:'02', team:'Ameu', from:'AMEU',
    tagline:'King Gnu 커버 · 7곡 · 두 번째 무대', color:'#43c3d6', abbr:'AMEU', quirk:'rain',
    songs:[
      {t:"It's a small world", r:"It's a small world", a:'King Gnu',
       d:'2019년 「Sympa」 수록. 작은 세계의 문이 열리는 오프너. 밤의 두 번째 막이 여기서 시작됩니다.'},
      {t:'Prayer X', r:'Prayer X', a:'King Gnu',
       d:'2018년, 애니메이션 「BANANA FISH」 엔딩. 무겁고 느리게 가라앉는 기도. 조명이 가장 어두워지는 구간.'},
      {t:'マスカラ', r:'Mascara', a:'King Gnu',
       d:'2021년 발표. 흘러내리는 마스카라처럼 번지는 후렴. 세트의 온도를 한 단계 올립니다.'},
      {t:'傘', r:'Umbrella', a:'King Gnu',
       d:'2020년 「CEREMONY」 수록. 빗소리처럼 조용히 쌓이는 곡. 우산은 펴지 마세요, 뒷사람이 안 보입니다.'},
      {t:'白日', r:'Hakujitsu', a:'King Gnu',
       d:'2019년 드라마 「イノセンス 冤罪弁護士」 주제가. King Gnu를 전국구로 만든 곡. 첫 소절부터 전원 합창이 예상됩니다.'},
      {t:'どろん', r:'Doron', a:'King Gnu',
       d:'2020년 영화 「スマホを落としただけなのに 囚われの殺人鬼」 주제가. 어둡고 빠르게 도망치는 곡. 연기처럼 사라질 준비.'},
      {t:'飛行艇', r:'Hikoutei', a:'King Gnu',
       d:'2019년 발표, 「CEREMONY」 수록. 세트의 마지막, 비행정이 이륙합니다. 손은 위로.'}
    ]},
  { id:'kansoku', order:'03', team:'관측불가', from:'ALCHEMY',
    tagline:'RADWIMPS · BUMP OF CHICKEN · THE ORAL CIGARETTES · 米津玄師 · 4곡 · 세 번째 무대', color:'#ff4d5a', abbr:'???', quirk:'blur',
    songs:[
      {t:'夢灯籠', r:'Yume Tourou', a:'RADWIMPS',
       d:'2016년 영화 「君の名は。」의 첫 곡. 등롱 하나를 켜고 시작하는 짧은 서곡. 관측을 시작합니다.'},
      {t:'天体観測', r:'Tentai Kansoku', a:'BUMP OF CHICKEN',
       d:'2001년. 팀 이름 「관측불가」의 출처. 관측 불가라고 해놓고 천체관측을 합니다. 이 모순이 팀의 정체성.'},
      {t:'狂乱 Hey Kids!!', r:'Kyouran Hey Kids!!', a:'THE ORAL CIGARETTES',
       d:'2015년 「ノラガミ ARAGOTO」 오프닝. 이 밤에서 가장 빠르고 시끄러운 구간. 앞줄은 각오하세요.'},
      {t:'ピースサイン', r:'Peace Sign', a:'米津玄師',
       d:'2017년 「僕のヒーローアカデミア」 2기 오프닝. 마지막은 피스 사인으로. 관측 종료.'}
    ]},
  { id:'kawarimono', order:'04', team:'Kawarimono', from:'KAWARIMONO',
    tagline:'King Gnu 커버 · 7곡 · 마지막 무대', color:'#e9b52a', abbr:'KWR', quirk:'wobble',
    songs:[
      {t:'一途', r:'Ichizu', a:'King Gnu',
       d:'2021년 「劇場版 呪術廻戦 0」 주제가. 밤의 마지막 막을 전속력으로 여는 곡.'},
      {t:'FLASH!!!', r:'FLASH!!!', a:'King Gnu',
       d:'2019년 「Sympa」 수록. 느낌표 세 개만큼 터지는 곡. 플래시는 제목에만.'},
      {t:'Teenager Forever', r:'Teenager Forever', a:'King Gnu',
       d:'2019년 발표, 「CEREMONY」 수록. 영원히 10대인 척하는 노래. 오늘은 다들 그런 척 좀 하는 시간.'},
      {t:'Sorrows', r:'Sorrows', a:'King Gnu',
       d:'2019년 「Sympa」 수록. 세트 한가운데 놓인 짧은 슬픔. 잠깐 숨 고르기.'},
      {t:'Vinyl', r:'Vinyl', a:'King Gnu',
       d:'2017년 「Tokyo Rendez-Vous」 수록. 초기 King Gnu의 그루브. 지금 보고 있는 이 턴테이블 위에서 듣기 가장 알맞은 곡.'},
      {t:'AIZO', r:'AIZO', a:'King Gnu',
       d:'세트 후반, 마지막 한 곡을 위한 예열. 여기서부터는 앉아 있기 어려울 예정.'},
      {t:'雨燦々', r:'Ame Sansan', a:'King Gnu',
       d:'2022년 드라마 「オールドルーキー」 주제가. GNU NIGHT의 마지막 곡. 비가 찬란하게 내리고, 밤이 끝납니다.'}
    ]}
];
const TOTAL = SETS.reduce((a, s) => a + s.songs.length, 0);

/* ================= 턴테이블 생성 ================= */
function discSVG(S){
  const n = S.songs.length, step = 360 / n, R = 215, C = 300;
  const reverse = S.quirk === 'reverse';
  const th0 = (-step / 2) * Math.PI / 180;               // 경로 시작 = 12시 방향에서 반 칸 앞
  const sx = C + R * Math.sin(th0), sy = C - R * Math.cos(th0);
  const ex = C - R * Math.sin(th0), ey = C + R * Math.cos(th0);
  const pid = 'path-' + S.id;
  const d = `M${sx},${sy} A${R},${R} 0 1 1 ${ex},${ey} A${R},${R} 0 1 1 ${sx},${sy}`;
  let grooves = '';
  for (let r = 110; r <= 282; r += 8) grooves += `<circle cx="${C}" cy="${C}" r="${r}" fill="none" stroke="rgba(255,255,255,${r % 24 === 6 ? .14 : .06})" stroke-width="1"/>`;
  const fs = n > 5 ? 17 : 20;
  const labels = S.songs.map((s, i) => {
    const slot = reverse ? (n - i) % n : i;              // reverse: 곡 순서를 반대 방향으로 배치
    const off = ((slot + 0.5) / n * 100).toFixed(3);
    return `<text class="lbl" data-i="${i}" font-size="${fs}"><textPath href="#${pid}" startOffset="${off}%" text-anchor="middle">${esc(s.t)}</textPath></text>`;
  }).join('');
  return `<svg viewBox="0 0 600 600" role="img" aria-label="${esc(S.team)} 셋리스트 턴테이블">
    <defs>
      <path id="${pid}" d="${d}" fill="none"/>
      <radialGradient id="sheen-${S.id}" cx="30%" cy="25%" r="80%"><stop offset="0" stop-color="rgba(255,255,255,.16)"/><stop offset=".55" stop-color="rgba(255,255,255,0)"/></radialGradient>
    </defs>
    <circle cx="300" cy="300" r="292" fill="#0b0b0b" stroke="rgba(244,239,228,.35)" stroke-width="2"/>
    ${grooves}
    <circle cx="300" cy="300" r="292" fill="url(#sheen-${S.id})"/>
    <circle cx="300" cy="300" r="96" fill="${S.color}"/>
    <text x="300" y="290" text-anchor="middle" class="disc__abbr">${esc(S.abbr)}</text>
    <text x="300" y="324" text-anchor="middle" class="disc__side">SIDE ${S.order} · ${n} TRACKS · 33⅓</text>
    <circle cx="300" cy="300" r="7" fill="#050505"/>
    ${labels}
  </svg>`;
}

function buildSets(){
  const host = $('#setsHost');
  SETS.forEach(S => {
    const n = S.songs.length;
    const sec = document.createElement('section');
    sec.className = 'set'; sec.id = 'set-' + S.id; sec.dataset.quirk = S.quirk;
    sec.style.height = `calc(${n} * 70vh + 100vh)`;
    const rain = S.quirk === 'rain'
      ? '<div class="rain" aria-hidden="true">' + Array.from({length: 22}, () => `<i style="--x:${(Math.random() * 100).toFixed(1)};--d:${Math.random().toFixed(2)}"></i>`).join('') + '</div>'
      : '';
    sec.innerHTML = `
      <div class="set__sticky">
        <header class="set__head">
          <span class="set__order">STAGE ${S.order} / 04 · ${esc(S.from)}</span>
          <h2 class="set__team ${isKo(S.team) ? 'is-ko' : ''}" data-crown-target="set-${S.id}" data-crown-pos="left">${esc(S.team)}</h2>
          <p class="set__from">${esc(S.tagline)}</p>
        </header>
        <div class="set__body">
          <div class="deck" style="--c:${S.color}">
            <div class="disc">${discSVG(S)}</div>
            <div class="arm" aria-hidden="true"></div>
            ${rain}
          </div>
          <div class="now">
            <span class="now__idx"></span>
            <h3 class="now__title"></h3>
            <p class="now__romaji"></p>
            <p class="now__artist"></p>
            <p class="now__desc"></p>
            <ol class="now__list">${S.songs.map((s, i) => `<li data-i="${i}"><span>${pad(i + 1)}</span>${esc(s.t)}</li>`).join('')}</ol>
          </div>
        </div>
        <div class="set__hint">SCROLL = 턴테이블 회전</div>
      </div>`;
    host.appendChild(sec);
    S.el = sec; S.disc = $('.disc', sec); S.arm = $('.arm', sec);
    S.labels = $$('.lbl', sec); S.items = $$('.now__list li', sec); S.card = $('.now', sec);
    S.now = { idx: $('.now__idx', sec), title: $('.now__title', sec), romaji: $('.now__romaji', sec), artist: $('.now__artist', sec), desc: $('.now__desc', sec) };
    S.cur = -1; S.rot = 0; S.rotTarget = 0;
    setNow(S, 0, true);
  });
}

function setNow(S, i, silent){
  if (S.cur === i) return;
  S.cur = i;
  const s = S.songs[i], n = S.songs.length, step = 360 / n;
  S.now.idx.textContent = `TRACK ${pad(i + 1)} / ${pad(n)}`;
  if (S.quirk === 'reverse' && !silent && !reduce) scramble(S.now.title, s.t); else S.now.title.textContent = s.t;
  S.now.romaji.textContent = s.r !== s.t ? s.r : '';
  S.now.artist.textContent = s.a;
  S.now.desc.textContent = s.d;
  S.labels.forEach(l => l.classList.toggle('is-current', +l.dataset.i === i));
  S.items.forEach(l => l.classList.toggle('is-current', +l.dataset.i === i));
  S.rotTarget = (S.quirk === 'reverse' ? 1 : -1) * i * step;
  if (!silent){ S.card.classList.remove('swap'); void S.card.offsetWidth; S.card.classList.add('swap'); }
}

/* リライト: 제목이 스크램블되며 다시 쓰여집니다 */
function scramble(el, text){
  const pool = 'リライトREWRITE#%&*+=▮▯';
  let frame = 0; const total = 16;
  cancelAnimationFrame(el._raf);
  const tick = () => {
    frame++;
    const reveal = Math.floor(text.length * frame / total);
    let out = '';
    for (let i = 0; i < text.length; i++) out += i < reveal ? text[i] : pool[(Math.random() * pool.length) | 0];
    el.textContent = out;
    if (frame < total) el._raf = requestAnimationFrame(tick); else el.textContent = text;
  };
  tick();
}

/* ================= 스크롤 엔진 ================= */
const layers = $$('.paint__layer');
const hero = $('.hero'), heroGnu = $('#heroGnu'), heroSub = $('#heroSub'), heroMeta = $('#heroMeta'), heroScroll = $('.hero__scroll');
const drips = $$('.drip');
drips.forEach(d => { d._f = 0.55 + Math.random() * 0.9; d._g = 0.3 + Math.random() * 0.9; });
const order = $('.order'), track = $('#orderTrack'), walker = $('#walker');
let lastOrderP = 0, walkerDir = 1;
const ticket = $('.ticket'), stubL = $('.stub__half--l'), stubR = $('.stub__half--r'), perf = $('.stub__perf'), tHint = $('.ticket__hint');
const crown = $('#crown'), dock = $('#dock'), navTrack = $('#navTrack');
const NAV_DEFAULT = navTrack.textContent;
let targets = [], cx = 0, cy = 0, cs = 1, trackText = null;
const mobile = () => matchMedia('(max-width:640px)').matches;

function rectProgress(el){
  const r = el.getBoundingClientRect(), H = innerHeight;
  if (r.bottom < 0 || r.top > H) return null;
  const total = r.height - H;
  return { r, p: total <= 0 ? 0 : clamp(-r.top / total, 0, 1) };
}

function heroUpdate(){
  const s = rectProgress(hero); if (!s) return;
  const p = s.p, q = clamp((p - 0.08) / 0.72, 0, 1);
  if (!reduce) drips.forEach(d => {
    const e = Math.pow(q, 1 + d._g);
    d.style.transform = `translateY(${e * d._f * 75}vh) scaleY(${1 + e * d._g * 2.4})`;
    d.style.opacity = 1 - clamp((q - 0.6) / 0.4, 0, 1);
  });
  heroGnu.style.transform = `scale(${1 + p * 0.75}) translateY(${p * 6}vh)`;
  heroGnu.style.opacity = clamp(0.5 + p * 0.5, 0, 1) * (1 - clamp((p - 0.82) / 0.18, 0, 1));
  const fade = 1 - clamp((p - 0.25) / 0.35, 0, 1);
  heroSub.style.opacity = heroMeta.style.opacity = fade;
  heroScroll.style.opacity = 1 - clamp(p / 0.15, 0, 1);
}

function orderUpdate(){
  const s = rectProgress(order); if (!s) return;
  const p = s.p;
  const maxX = Math.max(0, track.scrollWidth - innerWidth);
  track.style.transform = `translate(${-p * maxX}px, -50%)`;
  if (Math.abs(p - lastOrderP) > 0.0005) walkerDir = p > lastOrderP ? 1 : -1;
  lastOrderP = p;
  const bob = reduce ? 0 : Math.sin(p * 110);
  walker.style.transform = `translateX(${p * 44}vw) translateY(${-Math.abs(bob) * 8}px) rotate(${bob * 2.2}deg) scaleX(${walkerDir})`;
}

function setUpdate(S){
  const s = rectProgress(S.el); if (!s) return;
  const n = S.songs.length;
  const i = clamp(Math.floor(s.p * n), 0, n - 1);
  setNow(S, i, false);
  S.rot = reduce ? S.rotTarget : lerp(S.rot, S.rotTarget, 0.09);
  S.disc.style.transform = `rotate(${S.rot}deg)`;
  const armDir = S.quirk === 'reverse' ? -1 : 1;
  S.arm.style.transform = `rotate(${armDir * (-24 + (i / Math.max(1, n - 1)) * 16)}deg)`;
  const before = SETS.slice(0, SETS.indexOf(S)).reduce((a, x) => a + x.songs.length, 0);
  trackText = `TRACK ${pad(before + i + 1)} / ${TOTAL} · ${S.team}`;
}

function ticketUpdate(){
  const s = rectProgress(ticket); if (!s) return;
  const q = clamp((s.p - 0.12) / 0.7, 0, 1), e = q * q * (3 - 2 * q);
  if (mobile()){
    stubL.style.transform = `translateY(${-e * 16}vh) rotate(${-e * 6}deg)`;
    stubR.style.transform = `translateY(${e * 16}vh) rotate(${e * 5}deg)`;
  } else {
    stubL.style.transform = `translate(${-e * 24}vw, ${e * 3}vh) rotate(${-e * 9}deg)`;
    stubR.style.transform = `translate(${e * 24}vw, ${-e * 2}vh) rotate(${e * 6}deg)`;
  }
  perf.style.opacity = 1 - e;
  const done = e > 0.92;
  if (tHint._done !== done){
    tHint._done = done;
    tHint.textContent = done ? 'ADMIT ONE — 입장 완료. 좋은 밤 되세요.' : '스크롤하면 표가 찢어집니다. 진짜 표는 입구에서 찢습니다.';
  }
}

/* 왕관: 화면에 보이는 제목 중 가장 가까운 것 위에 앉음. 없으면 좌상단 로고로 귀환 */
function crownUpdate(){
  const H = innerHeight;
  let best = null, bestD = 1e9;
  for (const t of targets){
    const r = t.getBoundingClientRect();
    if (r.bottom < 0 || r.top > H) continue;
    const d = Math.abs(r.top - H * 0.28);
    if (d < bestD){ bestD = d; best = { t, r }; }
  }
  let tx, ty, ts;
  if (best){
    const { t, r } = best, w = 56;
    tx = t.dataset.crownPos === 'left' ? r.left : r.left + r.width / 2 - w / 2;
    ty = r.top + 2;
    ts = +(t.dataset.crownScale || 1);
  } else {
    const r = dock.getBoundingClientRect(); tx = r.left - 8; ty = r.top - 6; ts = 0.62;
  }
  const k = reduce ? 1 : 0.12;
  cx = lerp(cx, tx, k); cy = lerp(cy, ty, k); cs = lerp(cs, ts, k);
  crown.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${cs})`;
}

function frame(){
  const y = scrollY;
  if (!reduce) layers.forEach((l, i) => {
    l.style.transform = `translate3d(${Math.sin(y / 1900 + i * 2) * 40}px, ${Math.sin(y / 1400 + i) * 60}px, 0) rotate(${Math.sin(y / 2600 + i) * 3}deg)`;
  });
  heroUpdate();
  orderUpdate();
  trackText = null;
  SETS.forEach(setUpdate);
  const nt = trackText || NAV_DEFAULT;
  if (navTrack.textContent !== nt) navTrack.textContent = nt;
  ticketUpdate();
  crownUpdate();
  requestAnimationFrame(frame);
}

/* ================= 카운트다운 ================= */
function countdown(){
  const el = $('#count'), T = new Date(SHOW_START).getTime();
  const cells = { d: $('[data-cd="d"]', el), h: $('[data-cd="h"]', el), m: $('[data-cd="m"]', el), s: $('[data-cd="s"]', el) };
  let timer;
  const tick = () => {
    const now = Date.now(), diff = T - now;
    if (diff <= 0){
      el.innerHTML = now < T + 4 * 3600e3
        ? '<div class="count__live">NOW PLAYING — 하멜아트홀</div>'
        : '<div class="count__live">THANK YOU, GWANGJU.</div>';
      clearInterval(timer); return;
    }
    const s = Math.floor(diff / 1000);
    cells.d.textContent = String(Math.floor(s / 86400)).padStart(3, '0');
    cells.h.textContent = pad(Math.floor(s % 86400 / 3600));
    cells.m.textContent = pad(Math.floor(s % 3600 / 60));
    cells.s.textContent = pad(s % 60);
  };
  timer = setInterval(tick, 1000); tick();
}

/* ================= 주소 뒤집기 (FLIP) ================= */
function prepAddr(io){
  const el = $('.addr'); if (!el) return;
  const text = el.dataset.text;
  el.innerHTML = Array.from(text).map(c => `<span>${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
  const spans = $$('span', el), n = spans.length;
  const pos = spans.map(s => s.offsetLeft);
  spans.forEach((s, i) => {
    s.style.transform = `translateX(${pos[n - 1 - i] - pos[i]}px) rotate(180deg)`;
    s.style.transitionDelay = `${i * 28}ms`;
  });
  io.observe(el);
}

/* ================= 반응형 마키 ================= */
function buildMarquee(el){
  const unit = el.dataset.text.split('|').map(s => `<span>${esc(s.trim())}</span><em>★</em>`).join('');
  const inner = document.createElement('div'); inner.className = 'marquee__inner';
  el.appendChild(inner);
  const fill = () => {
    inner.innerHTML = unit;
    let guard = 0;
    while (inner.scrollWidth < innerWidth && guard++ < 20) inner.innerHTML += unit;
    inner.innerHTML += inner.innerHTML;                       // 2배 복제 → -50% 이동으로 무한 루프
    inner.style.setProperty('--dur', `${inner.scrollWidth / (+el.dataset.speed || 80)}s`);
  };
  fill();
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fill, 200); });
}

/* ================= init ================= */
function init(){
  buildSets();
  targets = $$('[data-crown-target]');
  $$('.fact b').forEach(b => { if (isKo(b.textContent)) b.classList.add('ko'); });
  countdown();
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.3 });
  $$('.fact, .reveal').forEach(el => io.observe(el));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    prepAddr(io);
    $$('.marquee').forEach(buildMarquee);
  });
  const d = dock.getBoundingClientRect(); cx = d.left; cy = d.top;
  requestAnimationFrame(frame);
}
document.readyState === 'loading' ? addEventListener('DOMContentLoaded', init) : init();
})();
