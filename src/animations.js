import * as THREE from 'three';

// Track the earth renderer so we can destroy it on route change
let earthRenderer = null;
let earthAnimFrame = null;
let sparkAnimFrame = null;
let loaderInjected = false;

export function destroyEarth() {
  if (earthAnimFrame) {
    cancelAnimationFrame(earthAnimFrame);
    earthAnimFrame = null;
  }
  if (earthRenderer) {
    try { earthRenderer.dispose(); } catch(e) {}
    earthRenderer = null;
  }
  // Remove the canvas from the container so it doesn't duplicate
  var earthContainer = document.getElementById('earth-canvas-container');
  if (earthContainer) {
    while (earthContainer.firstChild) {
      earthContainer.removeChild(earthContainer.firstChild);
    }
  }
}

export function initAnimations() {
/* ============================================================
   INSPIRE X S2 — SHARED JAVASCRIPT
   Loader · Spark Canvas · Cursor · Nav · Reveal · Countdown ·
   FAQ · Card Tilt · Stats Count-up · Fill Bar · Back to Top ·
   3D Earth · Timeline · Hero Wave Canvas
============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';

  /* ====================================================
     INJECT LOADER (only on home page, only once per session)
  ==================================================== */
  if (isHome && !document.getElementById('loader')) {
    var alreadySeen = sessionStorage.getItem('ixLoaderShown');
    if (!alreadySeen) {
      var loaderEl = document.createElement('div');
      loaderEl.id = 'loader';
      loaderEl.setAttribute('role', 'status');
      loaderEl.setAttribute('aria-label', 'Loading InspireX Season 2');
      loaderEl.innerHTML = `
        <canvas id="loaderCanvas"></canvas>
        <div class="loader-content">
          <div class="loader-pre">Connect Club Presents</div>
          <div class="loader-letters" id="loaderLetters"></div>
          <div class="loader-sub" id="loaderSub">SEASON &nbsp;2</div>
          <div class="loader-tagline" id="loaderTagline">Illuminating Minds — Building Bridges</div>
        </div>
        <div class="loader-curtain loader-curtain-l"></div>
        <div class="loader-curtain loader-curtain-r"></div>
      `;
      document.body.insertBefore(loaderEl, document.body.firstChild);
    }
  }

  /* ====================================================
     LOADER
  ==================================================== */
  var loader = document.getElementById('loader');
  if (loader) {
    document.body.style.overflow = 'hidden';

    /* Build letters */
    var lettersEl = document.getElementById('loaderLetters');
    if (lettersEl && lettersEl.children.length === 0) {
      var TITLE = 'INSPIRE X';
      TITLE.split('').forEach(function (ch, i) {
        if (ch === ' ') {
          var sp = document.createElement('span');
          sp.className = 'loader-space';
          lettersEl.appendChild(sp);
          return;
        }
        var s = document.createElement('span');
        s.className = 'loader-letter';
        s.textContent = ch;
        s.style.animationDelay = (i * 90 + 240) + 'ms';
        lettersEl.appendChild(s);
      });
    }

    /* Phase 2 — subtitle */
    setTimeout(function () {
      var sub = document.getElementById('loaderSub');
      if (sub) sub.classList.add('visible');
    }, 1100);

    /* Phase 3 — tagline */
    setTimeout(function () {
      var tag  = document.getElementById('loaderTagline');
      if (tag) tag.classList.add('visible');
    }, 1500);

    /* Phase 4 — split curtain + hide */
    setTimeout(function () {
      loader.classList.add('splitting');
      setTimeout(function () {
        loader.style.display = 'none';
        document.body.style.overflow = '';
        sessionStorage.setItem('ixLoaderShown', '1');
        if (typeof window.revealHeroText === 'function') window.revealHeroText();
      }, 920);
    }, 2900);
  } else if (isHome) {
    // Loader already dismissed — just reveal hero text
    setTimeout(function () {
      if (typeof window.revealHeroText === 'function') window.revealHeroText();
    }, 100);
  }

  /* ====================================================
     HERO REVEAL FUNCTION
  ==================================================== */
  window.revealHeroText = function () {
    var seq = [
      { sel: '.hero-eyebrow-row',                 delay: 0   },
      { sel: '.hero h1 .line:nth-child(1) span',  delay: 120 },
      { sel: '.hero h1 .line:nth-child(2) span',  delay: 300 },
      { sel: '.hero-season',                       delay: 500 },
      { sel: '.hero-tagline',                      delay: 660 },
      { sel: '.info-pills',                        delay: 820 },
      { sel: '.hero-actions',                      delay: 960 },
      { sel: '.countdown',                         delay: 1100 }
    ];
    seq.forEach(function (item) {
      var el = document.querySelector(item.sel);
      if (!el) return;
      setTimeout(function () { el.classList.add('hero-show'); }, item.delay);
    });
  };

  /* ====================================================
     LOADER CANVAS — converging particles
  ==================================================== */
  var lc = document.getElementById('loaderCanvas');
  if (lc && loader && loader.style.display !== 'none' && !reduceMotion) {
    var lCtx = lc.getContext('2d');
    var lW, lH;
    (function lResize() {
      lW = lc.width  = lc.offsetWidth  || window.innerWidth;
      lH = lc.height = lc.offsetHeight || window.innerHeight;
    })();
    window.addEventListener('resize', function () {
      lW = lc.width  = lc.offsetWidth  || window.innerWidth;
      lH = lc.height = lc.offsetHeight || window.innerHeight;
    });

    var lParticles = [];
    for (var pi = 0; pi < 90; pi++) {
      var angle = Math.random() * Math.PI * 2;
      var radius = Math.max(window.innerWidth, window.innerHeight) * 0.75;
      lParticles.push({
        x: window.innerWidth  / 2 + Math.cos(angle) * radius,
        y: window.innerHeight / 2 + Math.sin(angle) * radius,
        tx: window.innerWidth  / 2 + (Math.random() - 0.5) * 280,
        ty: window.innerHeight / 2 + (Math.random() - 0.5) * 220,
        p: 0,
        spd: 0.0035 + Math.random() * 0.007,
        sz: Math.random() * 2.2 + 0.6,
        col: Math.random() > 0.42 ? '255,92,40' : '110,242,192'
      });
    }

    function lLoop() {
      if (!lc.isConnected || loader.style.display === 'none') return;
      lCtx.clearRect(0, 0, lW, lH);
      for (var i = lParticles.length - 1; i >= 0; i--) {
        var p = lParticles[i];
        p.p = Math.min(1, p.p + p.spd);
        var e = 1 - Math.pow(1 - p.p, 3);
        var px = p.x + (p.tx - p.x) * e;
        var py = p.y + (p.ty - p.y) * e;
        var a  = p.sz > 1.5 ? Math.sin(p.p * Math.PI) * 0.9 : Math.sin(p.p * Math.PI) * 0.6;
        lCtx.beginPath();
        lCtx.fillStyle = 'rgba(' + p.col + ',' + a + ')';
        lCtx.arc(px, py, p.sz, 0, Math.PI * 2);
        lCtx.fill();
        if (p.p >= 1) lParticles.splice(i, 1);
      }
      requestAnimationFrame(lLoop);
    }
    lLoop();
  }

  /* ====================================================
     SPARK CANVAS — cursor trail
  ==================================================== */
  // Cancel previous spark loop if any
  if (sparkAnimFrame) { cancelAnimationFrame(sparkAnimFrame); sparkAnimFrame = null; }

  var canvas = document.getElementById('sparkCanvas');
  var ctx, W, H, particles = [], lastSpawn = 0;

  function spawn(x, y, n) {
    n = n || 3;
    for (var i = 0; i < n; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.95) * 2.2,
        life: 1,
        size: Math.random() * 2.6 + 0.8,
        col: Math.random() > 0.38 ? '255,92,40' : '110,242,192'
      });
    }
  }
  window.ix_spawn = spawn;

  if (canvas) {
    ctx = canvas.getContext('2d');
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    if (!reduceMotion) {
      window.addEventListener('pointermove', function (e) {
        var now = Date.now();
        if (now - lastSpawn > 16) { spawn(e.clientX, e.clientY); lastSpawn = now; }
      });
    }
    function sparkLoop() {
      sparkAnimFrame = requestAnimationFrame(sparkLoop);
      ctx.clearRect(0, 0, W, H);
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.026; p.life -= 0.017;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.fillStyle = 'rgba(' + p.col + ',' + p.life + ')';
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    sparkLoop();
  }

  /* ====================================================
     CURSOR GLOW
  ==================================================== */
  var glow = document.getElementById('cursorGlow');
  if (glow && !reduceMotion) {
    var glX = -500, glY = -500, tX = -500, tY = -500;
    window.addEventListener('pointermove', function (e) { tX = e.clientX; tY = e.clientY; });
    (function glowLoop() {
      glX += (tX - glX) * 0.09;
      glY += (tY - glY) * 0.09;
      glow.style.left = glX + 'px';
      glow.style.top  = glY + 'px';
      requestAnimationFrame(glowLoop);
    })();
  }

  /* ====================================================
     SCROLL PROGRESS BAR
  ==================================================== */
  var meter = document.getElementById('ignitionMeter');
  if (meter) {
    function updateMeter() {
      var h = document.documentElement;
      meter.style.width = ((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 || 0) + '%';
    }
    window.addEventListener('scroll', updateMeter, { passive: true });
    updateMeter();
  }

  /* ====================================================
     NAV GLASS SCROLL STATE
  ==================================================== */
  var navGlass = document.querySelector('.nav-glass');
  if (navGlass) {
    function updateNav() {
      navGlass.classList.toggle('scrolled', window.scrollY > 30);
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ====================================================
     SCROLLSPY
  ==================================================== */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if (sections.length && navLinks.length) {
    window.addEventListener('scroll', function () {
      var pos = window.scrollY + 140;
      sections.forEach(function (sec) {
        if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          var m = document.querySelector('.nav-links a[href="#' + sec.id + '"]');
          if (m) m.classList.add('active');
        }
      });
    }, { passive: true });
  }

  /* ====================================================
     SCROLL REVEAL (IntersectionObserver)
  ==================================================== */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.11 });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ====================================================
     STAT COUNT-UP
  ==================================================== */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var ioStat = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      ioStat.disconnect();
      var t0 = null, dur = 1500;
      requestAnimationFrame(function step(ts) {
        if (!t0) t0 = ts;
        var prog = Math.min((ts - t0) / dur, 1);
        var ease = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.round(target * ease);
        if (prog < 1) requestAnimationFrame(step);
        else el.textContent = target;
      });
    }, { threshold: 0.5 });
    ioStat.observe(el);
  });

  /* ====================================================
     COUNTDOWN
  ==================================================== */
  var cdTarget = new Date('2026-09-13T08:00:00');
  var cdEls = ['cdDays','cdHrs','cdMins','cdSecs'].map(function (id) {
    return document.getElementById(id);
  });
  function pad(n) { return String(n).padStart(2, '0'); }
  function tick(el, val) {
    if (!el) return;
    var s = pad(val);
    if (el.textContent !== s) {
      el.classList.remove('tick');
      void el.offsetWidth;
      el.textContent = s;
      el.classList.add('tick');
      setTimeout(function () { el.classList.remove('tick'); }, 220);
    }
  }
  function updateCD() {
    var d = Math.max(0, cdTarget - new Date());
    tick(cdEls[0], Math.floor(d / 86400000));
    tick(cdEls[1], Math.floor((d % 86400000) / 3600000));
    tick(cdEls[2], Math.floor((d % 3600000)  / 60000));
    tick(cdEls[3], Math.floor((d % 60000)    / 1000));
  }
  if (cdEls[0]) { updateCD(); setInterval(updateCD, 1000); }

  /* ====================================================
     REGISTER PAGE COUNTDOWN
  ==================================================== */
  var regCdTarget = new Date('2026-09-13T08:00:00');
  var regCdEls = ['cd-days','cd-hours','cd-mins','cd-secs'].map(function (id) {
    return document.getElementById(id);
  });
  function updateRegCD() {
    var d = Math.max(0, regCdTarget - new Date());
    if (regCdEls[0]) regCdEls[0].textContent = pad(Math.floor(d / 86400000));
    if (regCdEls[1]) regCdEls[1].textContent = pad(Math.floor((d % 86400000) / 3600000));
    if (regCdEls[2]) regCdEls[2].textContent = pad(Math.floor((d % 3600000) / 60000));
    if (regCdEls[3]) regCdEls[3].textContent = pad(Math.floor((d % 60000) / 1000));
  }
  if (regCdEls[0]) { updateRegCD(); setInterval(updateRegCD, 1000); }

  /* ====================================================
     3D CARD TILT
  ==================================================== */
  if (!reduceMotion) {
    document.querySelectorAll('.tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r  = card.getBoundingClientRect();
        var x  = e.clientX - r.left, y = e.clientY - r.top;
        var rx = ((y / r.height) - 0.5) * -11;
        var ry = ((x / r.width)  - 0.5) *  11;
        card.style.transform = 'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-6px)';
        card.style.setProperty('--mx', x + 'px');
        card.style.setProperty('--my', y + 'px');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ====================================================
     FAQ ACCORDION
  ==================================================== */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var ans  = item.querySelector('.faq-a');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!wasOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
  var firstOpen = document.querySelector('.faq-item.open .faq-a');
  if (firstOpen) firstOpen.style.maxHeight = firstOpen.scrollHeight + 'px';

  /* ====================================================
     SEAT FILL BAR
  ==================================================== */
  var fillBar = document.getElementById('fillBar');
  if (fillBar) {
    var fbIO = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        fbIO.disconnect();
        setTimeout(function () { fillBar.style.width = '68%'; }, 300);
      }
    }, { threshold: 0.4 });
    fbIO.observe(fillBar);
  }

  /* ====================================================
     BACK TO TOP
  ==================================================== */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ====================================================
     SCROLL INDICATOR
  ==================================================== */
  var scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    var scrollTimer;
    window.addEventListener('scroll', function () {
      scrollCue.style.opacity = '0';
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        if (window.scrollY < 200) scrollCue.style.opacity = '1';
      }, 1200);
    }, { passive: true });
  }

  /* ====================================================
     TIMELINE SCROLL ANIMATION
  ==================================================== */
  var timeline = document.querySelector('.timeline');
  if (timeline) {
    // Create the progress line element if not already present
    var progressLine = timeline.querySelector('.timeline-progress');
    if (!progressLine) {
      progressLine = document.createElement('div');
      progressLine.className = 'timeline-progress';
      timeline.appendChild(progressLine);
    }

    var tItems = document.querySelectorAll('.t-item');

    function updateTimeline() {
      var rect = timeline.getBoundingClientRect();
      var windowHeight = window.innerHeight;
      var progress = 0;
      var timelineStart = rect.top - (windowHeight * 0.6);
      var timelineHeight = rect.height;

      if (timelineStart < 0) {
        progress = Math.abs(timelineStart) / timelineHeight;
        progress = Math.max(0, Math.min(1, progress));
      }

      progressLine.style.height = (progress * 100) + '%';

      tItems.forEach(function(item) {
        var dot = item.querySelector('.t-dot');
        var content = item.querySelector('.t-content');
        if (!dot || !content) return;
        var itemRect = item.getBoundingClientRect();
        if (itemRect.top < windowHeight * 0.6) {
          dot.classList.add('active');
          content.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateTimeline, { passive: true });
    window.addEventListener('resize', updateTimeline, { passive: true });
    setTimeout(updateTimeline, 200);
  }

  /* ====================================================
     3D EARTH & SATELLITES (Three.js)
  ==================================================== */
  var earthContainer = document.getElementById('earth-canvas-container');
  if (earthContainer && typeof THREE !== 'undefined') {
    var w = earthContainer.clientWidth || 800;
    var h = earthContainer.clientHeight || w;

    var scene3D = new THREE.Scene();
    var camera3D = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera3D.position.z = 250;
    camera3D.position.x = 0;

    earthRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    earthRenderer.setSize(w, h);
    earthRenderer.setPixelRatio(window.devicePixelRatio);
    earthContainer.appendChild(earthRenderer.domElement);

    // Lighting
    var ambientLight = new THREE.AmbientLight(0x111122, 0.4);
    scene3D.add(ambientLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(-100, 80, 50);
    scene3D.add(dirLight);

    var blueLight = new THREE.PointLight(0x0055FF, 1.5, 300);
    blueLight.position.set(-80, 0, 50);
    scene3D.add(blueLight);

    var rimLight = new THREE.DirectionalLight(0x00ccff, 2.0);
    rimLight.position.set(100, 20, -50);
    scene3D.add(rimLight);

    // Earth Sphere
    var earthGeometry = new THREE.SphereGeometry(80, 64, 64);
    var textureLoader = new THREE.TextureLoader();
    var earthMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x222222,
      shininess: 15,
      transparent: true,
      opacity: 0.98
    });

    textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', function(tex) {
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    });

    var earthMesh = new THREE.Mesh(earthGeometry, earthMat);
    earthMesh.rotation.z = 23.5 * Math.PI / 180;
    earthMesh.rotation.y = Math.PI * 0.8;
    scene3D.add(earthMesh);

    var targetRotationX = 0.8 * Math.PI;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var seasonTextTop = document.getElementById('season-text-top');
    var seasonTextBottom = document.getElementById('season-text-bottom');

    document.addEventListener('mousemove', function(event) {
      if (!reduceMotion) {
        mouseX = (event.clientX - windowHalfX) * 0.0005;
        mouseY = (event.clientY - windowHalfY) * 0.0005;
      }
    }, false);

    window.addEventListener('resize', function() {
      if (!earthContainer || !earthRenderer) return;
      var w = earthContainer.clientWidth;
      var h = earthContainer.clientHeight || w;
      earthRenderer.setSize(w, h);
      camera3D.aspect = w / Math.max(h, 1);
      camera3D.updateProjectionMatrix();
    });

    function animateEarth() {
      earthAnimFrame = requestAnimationFrame(animateEarth);

      if (!reduceMotion) {
        targetRotationX += 0.001;
        earthMesh.rotation.y += (targetRotationX + mouseX - earthMesh.rotation.y) * 0.05;
        earthMesh.rotation.x += (mouseX * 0.5 - earthMesh.rotation.x) * 0.05;

        var textRotY = -15 - (mouseX * 200);
        var textRotX = 10 + (mouseY * 200);
        if (seasonTextTop)    seasonTextTop.style.transform    = 'perspective(1200px) rotateY(' + textRotY + 'deg) rotateX(' + textRotX + 'deg)';
        if (seasonTextBottom) seasonTextBottom.style.transform = 'perspective(1200px) rotateY(' + textRotY + 'deg) rotateX(' + textRotX + 'deg)';
      }

      if (earthRenderer) earthRenderer.render(scene3D, camera3D);
    }
    animateEarth();
  }

  /* ====================================================
     HERO 3D WAVE BACKGROUND — Three.js
  ==================================================== */
  (function () {
    if (typeof THREE === 'undefined') return;
    if (reduceMotion) return;

    var heroCanvas = document.getElementById('heroCanvas');
    if (!heroCanvas) return;

    var isMobile   = window.innerWidth < 768;
    var GRID       = isMobile ? 38 : 58;
    var SPACING    = isMobile ? 2.0 : 1.38;
    var COUNT      = GRID * GRID;
    var VW         = window.innerWidth;
    var VH         = window.innerHeight;

    var scene    = new THREE.Scene();
    var camera   = new THREE.PerspectiveCamera(52, VW / VH, 0.1, 1000);
    camera.position.set(0, 48, 100);
    camera.lookAt(-15, -5, 0);

    var renderer = new THREE.WebGLRenderer({
      canvas: heroCanvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(VW, VH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    var geo    = new THREE.BufferGeometry();
    var posArr = new Float32Array(COUNT * 3);
    var colArr = new Float32Array(COUNT * 3);
    var bX     = new Float32Array(COUNT);
    var bZ     = new Float32Array(COUNT);

    for (var i = 0; i < GRID; i++) {
      for (var j = 0; j < GRID; j++) {
        var idx = i * GRID + j;
        var x   = (j - GRID / 2) * SPACING;
        var z   = (i - GRID / 2) * SPACING;
        bX[idx] = x; bZ[idx] = z;
        posArr[idx * 3]     = x;
        posArr[idx * 3 + 1] = 0;
        posArr[idx * 3 + 2] = z;
        colArr[idx * 3]     = 1.0;
        colArr[idx * 3 + 1] = 0.36;
        colArr[idx * 3 + 2] = 0.16;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colArr, 3));

    var mat = new THREE.PointsMaterial({
      size: isMobile ? 0.30 : 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      sizeAttenuation: true
    });

    scene.add(new THREE.Points(geo, mat));

    var mX = 0, mY = 0;
    var camX = 0, camY = 48, camZ = 100;
    var tCX  = 0, tCY  = 22, tCZ  = 58;
    var introT = 0;

    window.addEventListener('mousemove', function (e) {
      mX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener('resize', function () {
      VW = window.innerWidth; VH = window.innerHeight;
      camera.aspect = VW / VH;
      camera.updateProjectionMatrix();
      renderer.setSize(VW, VH);
    });

    var t = 0;
    function loop() {
      requestAnimationFrame(loop);
      t += 0.011;

      if (introT < 1) {
        introT = Math.min(1, introT + 0.006);
        var ease = 1 - Math.pow(1 - introT, 3);
        camX += (0 - camX) * 0.05;
        camY += ((48 - ease * 26) - camY) * 0.05;
        camZ += ((100 - ease * 42) - camZ) * 0.05;
      } else {
        tCX = mX * 11; tCY = -mY * 6 + 18; tCZ = 52;
        camX += (tCX - camX) * 0.042;
        camY += (tCY - camY) * 0.042;
        camZ += (tCZ - camZ) * 0.042;
      }
      camera.position.set(camX, camY, camZ);
      camera.lookAt(-15, -5, 0);

      var pos = geo.attributes.position.array;
      var col = geo.attributes.color.array;

      for (var k = 0; k < COUNT; k++) {
        var px = bX[k], pz = bZ[k];
        var dist = Math.sqrt(px * px + pz * pz);

        var wave =
          Math.sin(px * 0.26 + t) * Math.cos(pz * 0.21 + t * 0.72) * 3.8 +
          Math.sin(dist * 0.17 - t * 1.08) * 2.4 +
          Math.cos(px * 0.11 - pz * 0.14 + t * 0.48) * 1.3;

        pos[k * 3 + 1] = wave;

        var norm = Math.max(0, Math.min(1, (wave + 7.5) / 15.0));

        if (norm > 0.58) {
          var a = (norm - 0.58) / 0.42;
          col[k*3] = 0.0; col[k*3+1] = 0.1 + a * 0.23; col[k*3+2] = 0.5 + a * 0.5;
        } else if (norm < 0.38) {
          var b = 1 - norm / 0.38;
          col[k*3] = 0.0; col[k*3+1] = 0.5 + b * 0.4; col[k*3+2] = 0.8 + b * 0.2;
        } else {
          col[k*3] = 0.0; col[k*3+1] = 0.05; col[k*3+2] = 0.15;
        }
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate    = true;
      renderer.render(scene, camera);
    }
    loop();

    setTimeout(function () { heroCanvas.classList.add('visible'); }, 80);
  })();

})();

}
