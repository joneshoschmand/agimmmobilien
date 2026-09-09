/* AG Immobilien – Angebote
   Scroll-Choreografie, Filter, Navigation */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Hero-Auftakt ─────────────────────────────────────── */
  var hero      = $('.hero');
  var lightHero = hero || $('.page-hero');
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { if (hero) hero.classList.add('is-ready'); });
  });

  /* ── Laufband nahtlos schließen ───────────────────────── */
  var ticker = $('#ticker');
  if (ticker && !reduced) ticker.innerHTML += ticker.innerHTML;

  /* ── Reveal beim Scrollen ─────────────────────────────── */
  /* Bewusst scroll-basiert statt IntersectionObserver: läuft im selben
     rAF-Takt wie die Parallaxe und kann nicht in einem Zustand hängen
     bleiben, in dem Inhalte unsichtbar sind. */
  var pending = $$('[data-reveal]');
  if (reduced) {
    pending.forEach(function (el) { el.classList.add('in'); });
    pending = [];
  }

  /* ── Strichzeichnung: Linien zeichnen sich ────────────── */
  var art = $('#art');
  if (art) {
    $$('.draw', art).forEach(function (p) {
      try { p.style.setProperty('--len', Math.ceil(p.getTotalLength()) + 4); }
      catch (err) { /* ohne getTotalLength bleibt der CSS-Standard */ }
    });
    if (reduced) art.classList.add('in');
  }

  /* ── Zähler ───────────────────────────────────────────── */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dur = 1500, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased).toLocaleString('de-DE');
      if (p < 1) requestAnimationFrame(step);
    }
    if (reduced) { el.textContent = target.toLocaleString('de-DE'); return; }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if (reduced) {
    counters.forEach(countUp);
    counters = [];
  }

  /* ── Parallaxe + Kopfzeile + Fortschritt (ein rAF-Loop) ─ */
  var layers   = $$('[data-parallax]').map(function (el) {
    return { el: el, speed: parseFloat(el.getAttribute('data-parallax')) || 0.15 };
  });
  var imgs     = $$('[data-parallax-img]').map(function (el) {
    return { el: el, speed: parseFloat(el.getAttribute('data-parallax-img')) || 0.05 };
  });
  var head     = $('#head');
  var progress = $('#progress');
  var sunHost  = $('.offers-section');
  var sunscape = sunHost ? $('.sunscape', sunHost) : null;
  var ticking  = false;

  function inView(el, pad) {
    var r = el.getBoundingClientRect();
    return r.bottom > -(pad || 0) && r.top < window.innerHeight + (pad || 0);
  }

  function frame() {
    ticking = false;
    var y  = window.pageYOffset || document.documentElement.scrollTop;
    var vh = window.innerHeight;

    /* Sichtbares einblenden */
    if (pending.length) {
      pending = pending.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.88 && r.bottom > 0) { el.classList.add('in'); return false; }
        return true;
      });
    }
    if (art && !art.classList.contains('in')) {
      var ar = art.getBoundingClientRect();
      if (ar.top < vh * 0.8 && ar.bottom > 0) art.classList.add('in');
    }
    if (counters.length) {
      counters = counters.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) { countUp(el); return false; }
        return true;
      });
    }

    if (head) {
      head.classList.toggle('is-stuck', y > 24);
      if (lightHero && head.hasAttribute('data-light-hero')) {
        head.classList.toggle('is-light', y < lightHero.offsetHeight - 120);
      }
    }

    if (sunscape) {
      var sb = sunHost.getBoundingClientRect();
      /* 0 = Abschnitt beginnt am unteren Rand, 1 = er ist ganz durchgescrollt */
      var sp = (vh - sb.top) / (vh + sb.height);
      sp = sp < 0 ? 0 : sp > 1 ? 1 : sp;
      var arc = Math.sin(sp * Math.PI);            /* Sonnenbogen */
      var sx  = (6 + sp * 88).toFixed(1);
      /* Höhe relativ zum Blickfeld, umgerechnet in eine Position im Abschnitt */
      var top = (-sb.top + vh * (0.34 - arc * 0.22)).toFixed(1) + 'px';
      sunscape.style.setProperty('--sun-x', sx);
      sunscape.style.setProperty('--sun-top', top);
      sunscape.style.setProperty('--sun-i', arc.toFixed(3));
      sunHost.style.setProperty('--sun-x', sx);
    }

    if (progress) {
      var max = document.documentElement.scrollHeight - vh;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }

    if (!reduced) {
      layers.forEach(function (l) {
        if (!inView(l.el.parentNode || l.el, 200)) return;
        var box = (l.el.parentNode || l.el).getBoundingClientRect();
        var off = (box.top + box.height / 2 - vh / 2) * -l.speed;
        l.el.style.transform = 'translate3d(0,' + off.toFixed(2) + 'px,0)';
      });
      imgs.forEach(function (l) {
        var host = l.el.parentNode;
        if (!inView(host, 160)) return;
        var box = host.getBoundingClientRect();
        var off = (box.top + box.height / 2 - vh / 2) * -l.speed;
        l.el.style.transform = 'translate3d(0,' + off.toFixed(2) + 'px,0)';
      });
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', onScroll);
  window.setTimeout(onScroll, 250);
  window.setTimeout(onScroll, 900);
  frame();

  /* ── Filter ───────────────────────────────────────────── */
  var chips  = $$('.chip');
  var offers = $$('.offer');
  var empty  = $('#offersEmpty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      var visible = 0;
      offers.forEach(function (o) {
        var show = (f === 'alle' || o.getAttribute('data-type') === f);
        if (show) visible++;
        if (show) {
          o.classList.remove('is-hidden');
          requestAnimationFrame(function () { o.classList.remove('is-fading'); });
        } else {
          o.classList.add('is-fading');
          window.setTimeout(function () {
            if (o.classList.contains('is-fading')) o.classList.add('is-hidden');
          }, reduced ? 0 : 260);
        }
      });
      if (empty) empty.classList.toggle('is-on', visible === 0);
      onScroll();
    });
  });


  /* ── Die Reise des Strandkorbs ────────────────────────────
     Keyframes nach dem Vorbild der anime.js-Sequenz – nur läuft die
     Zeitachse nicht von selbst, sondern am Scrollrad: die Szene wandert
     durchs Blickfeld, der Korb zieht hinaus und kommt zurück auf seine
     Mulde. Ein weiches Nachziehen (lerp) nimmt das Tempo raus.        */
  var korb = $('#korbReise');
  if (korb && !reduced) {
    var EASE = {
      linear: function (t) { return t; },
      inOut:  function (t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },
      out:    function (t) { return 1 - Math.pow(1 - t, 3); },
      'in':   function (t) { return t * t * t; }
    };

    /* Baut aus Keyframes ({to, duration, delay, ease}) eine Spur. */
    function track(from, keys) {
      var t = 0, prev = from, segs = [];
      keys.forEach(function (k) {
        var d = k.delay || 0;
        if (d) { segs.push({ t0: t, t1: t + d, a: prev, b: prev, e: EASE.linear }); t += d; }
        segs.push({ t0: t, t1: t + k.duration, a: prev, b: k.to, e: EASE[k.ease] || EASE.inOut });
        t += k.duration; prev = k.to;
      });
      return { segs: segs, from: from, last: prev };
    }
    function sample(tr, time) {
      var segs = tr.segs, s, p;
      if (time <= segs[0].t0) return tr.from;
      for (var i = 0; i < segs.length; i++) {
        s = segs[i];
        if (time <= s.t1) {
          p = (s.t1 === s.t0) ? 1 : (time - s.t0) / (s.t1 - s.t0);
          return s.a + (s.b - s.a) * s.e(p < 0 ? 0 : p > 1 ? 1 : p);
        }
      }
      return tr.last;
    }

    var DUR = 3000;                       /* Länge der Keyframe-Folge */
    /* Quer über den Strand, von der einen Mulde zur anderen. */
    var trX = track(0, [{ to: 1, duration: 2200, delay: 400 }]);
    /* Nur ein leichtes Anheben in der Mitte – nie unter die Standlinie. */
    var trY = track(0, [{ to: -1, duration: 1100, delay: 400, ease: 'out' },
                        { to: 0,  duration: 1100, ease: 'in' }]);
    var trS = track(1, [{ to: .88, duration: 1100, delay: 400 }, { to: 1, duration: 1100 }]);
    /* Statt der vollen Umdrehung eine Neigung in die Laufrichtung –
       ein sich überschlagender Strandkorb wirkte wie ein Gag.
       Die 360° laufen stattdessen ruhig auf der Sonne (CSS: sonne-dreh). */
    var trR = track(0, [{ to: 5, duration: 700, delay: 400 },
                        { to: -4, duration: 900 },
                        { to: 0,  duration: 600 }]);

    var szene   = korb.parentNode;
    var schatten = korb.firstElementChild;
    var weg      = 272;
    var ist      = 0;
    var laeuft   = false;

    function messen() {
      /* Die volle Strecke: von der Mulde links bis zur Mulde rechts. */
      weg = Math.max(60, szene.clientWidth - korb.offsetWidth - korb.offsetLeft * 2);
    }

    /* 0 = Szene betritt das Blickfeld von unten, 1 = sie hat es oben verlassen */
    function ziel() {
      var r = szene.getBoundingClientRect();
      var p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }

    function zeichne() {
      var time = ist * DUR;
      var x  = sample(trX, time) * weg;
      var y  = sample(trY, time) * 18;   /* nur ein Anheben, kein Absacken */
      var sc = sample(trS, time);
      var ro = sample(trR, time);

      korb.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0) ' +
                             'rotate(' + ro.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';

      if (schatten) {
        var hoch = -y / 18;                       /* 0 = steht, 1 = angehoben */
        schatten.style.opacity   = (.24 - hoch * .12).toFixed(3);
        schatten.style.transform = 'translateX(-50%) scale(' + (1 - hoch * .18).toFixed(3) + ')';
      }
    }

    function tick() {
      var r = szene.getBoundingClientRect();
      if (r.bottom < -120 || r.top > window.innerHeight + 120) { laeuft = false; return; }

      var z = ziel(), d = z - ist;
      if (Math.abs(d) < 0.001) { ist = z; zeichne(); laeuft = false; return; }
      ist += d * 0.055;                            /* ruhiges Nachziehen */
      zeichne();
      requestAnimationFrame(tick);
    }
    function anstossen() { if (!laeuft) { laeuft = true; requestAnimationFrame(tick); } }

    messen();
    ist = ziel();
    zeichne();
    window.addEventListener('scroll', anstossen, { passive: true });
    window.addEventListener('resize', function () { messen(); anstossen(); });
    window.addEventListener('load',   function () { messen(); anstossen(); });
  }

  /* ── Mobile Navigation ────────────────────────────────── */
  var burger = $('#burger');
  var nav    = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }
})();
