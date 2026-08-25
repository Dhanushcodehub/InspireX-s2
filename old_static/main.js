/* ============================================================
   INSPIRE X S2 — SHARED JAVASCRIPT
   Loader · Spark Canvas · Cursor · Nav · Reveal · Countdown ·
   FAQ · Card Tilt · Stats Count-up · Fill Bar · Back to Top
============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ====================================================
     LOADER
  ==================================================== */
  var loader = document.getElementById('loader');
  if (loader) {
    // Disabled session storage check so the loader runs on every refresh for now
    var alreadySeen = false;

    if (alreadySeen) {
      loader.style.display = 'none';
      document.body.style.overflow = '';
      setTimeout(function () {
        if (typeof window.revealHeroText === 'function') window.revealHeroText();
      }, 320);
    } else {
      document.body.style.overflow = 'hidden';

      /* Build letters */
      var lettersEl = document.getElementById('loaderLetters');
      if (lettersEl) {
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

      /* Phase 3 — tagline + progress bar */
      setTimeout(function () {
        var tag  = document.getElementById('loaderTagline');
        var wrap = document.getElementById('loaderBarWrap');
        var fill = document.getElementById('loaderBarFill');
        if (tag)  tag.classList.add('visible');
        if (wrap) wrap.classList.add('visible');
        if (fill) setTimeout(function () { fill.style.width = '100%'; }, 60);
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
    }
  }

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
  /* expose for form submit confetti */
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
      requestAnimationFrame(sparkLoop);
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
     MOBILE NAV
  ==================================================== */
  var burger = document.getElementById('burger');
  var panel  = document.getElementById('mobilePanel');
  if (burger && panel) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      panel.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        panel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
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
     SCROLL INDICATOR ANIMATION — pulse on scroll stop
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
     3D EARTH & SATELLITES (Three.js)
  ==================================================== */
  var earthContainer = document.getElementById('earth-canvas-container');
  if (earthContainer && typeof THREE !== 'undefined') {
    var scene3D = new THREE.Scene();
    var camera3D = new THREE.PerspectiveCamera(45, earthContainer.clientWidth / earthContainer.clientHeight, 0.1, 1000);
    camera3D.position.z = 250;
    camera3D.position.x = 0; // Center camera
    
    var renderer3D = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer3D.setSize(earthContainer.clientWidth, earthContainer.clientHeight);
    renderer3D.setPixelRatio(window.devicePixelRatio);
    earthContainer.appendChild(renderer3D.domElement);
    
    // Lighting for cinematic shadow on the right side
    var ambientLight = new THREE.AmbientLight(0x111122, 0.4); // slightly brighter ambient
    scene3D.add(ambientLight);
    
    var dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(-100, 80, 50); // Moved higher to cast deeper shadow on lower right
    scene3D.add(dirLight);

    var blueLight = new THREE.PointLight(0x0055FF, 1.5, 300);
    blueLight.position.set(-80, 0, 50);
    scene3D.add(blueLight);

    // Rim light from the right-back to separate earth from background
    var rimLight = new THREE.DirectionalLight(0x00ccff, 2.0);
    rimLight.position.set(100, 20, -50); // Comes from behind on the right
    scene3D.add(rimLight);

    // Earth Sphere
    var earthGeometry = new THREE.SphereGeometry(80, 64, 64);
    
    // Use texture from public Three.js examples
    var textureLoader = new THREE.TextureLoader();
    var earthMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0x222222,
      shininess: 15,
      transparent: true,
      opacity: 0.98,
      wireframe: false
    });
    
    // Load high-res bright daylight earth texture
    textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg', function(tex) {
      earthMat.map = tex;
      earthMat.needsUpdate = true;
    });

    var earthMesh = new THREE.Mesh(earthGeometry, earthMat);
    // Tilt earth slightly and start on a continent
    earthMesh.rotation.z = 23.5 * Math.PI / 180;
    earthMesh.rotation.y = Math.PI * 0.8; 
    scene3D.add(earthMesh);

    // Mouse tracking for parallax
    var targetRotationX = 0.8 * Math.PI; // default Y rotation
    var targetRotationY = 23.5 * Math.PI / 180; // default Z tilt
    
    var mouseX = 0;
    var mouseY = 0;
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

    // Resize handler
    window.addEventListener('resize', function() {
      if(!earthContainer) return;
      var w = earthContainer.clientWidth;
      var h = earthContainer.clientHeight;
      renderer3D.setSize(w, h);
      camera3D.aspect = w / h;
      camera3D.updateProjectionMatrix();
    });

    // Animation Loop
    function animateEarth() {
      requestAnimationFrame(animateEarth);
      
      if (!reduceMotion) {
        // Continuous slow rotation
        targetRotationX += 0.001; 
        
        // Smoothly interpolate current rotation towards target rotation + mouse offset
        earthMesh.rotation.y += (targetRotationX + mouseX - earthMesh.rotation.y) * 0.05;
        earthMesh.rotation.x += (mouseX * 0.5 - earthMesh.rotation.x) * 0.05; // slight tilt up/down
        
        // Parallax the CSS 3D text in opposite direction
        var textRotY = -15 - (mouseX * 200);
        var textRotX = 10 + (mouseY * 200);
        
        if (seasonTextTop) {
          seasonTextTop.style.transform = 'perspective(1200px) rotateY(' + textRotY + 'deg) rotateX(' + textRotX + 'deg)';
        }
        if (seasonTextBottom) {
          seasonTextBottom.style.transform = 'perspective(1200px) rotateY(' + textRotY + 'deg) rotateX(' + textRotX + 'deg)';
        }
      }
      
      renderer3D.render(scene3D, camera3D);
    }
    animateEarth();
  }

})();
