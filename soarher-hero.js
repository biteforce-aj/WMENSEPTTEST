(function () {
  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursorRing");
  if (!cursor || !ring) return;
  let mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animRing);
  }
  animRing();
  document
    .querySelectorAll("a, button, .cta-btn, .gain-card, .module-item")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.style.width = "20px";
        cursor.style.height = "20px";
        ring.style.width = "56px";
        ring.style.height = "56px";
      });
      el.addEventListener("mouseleave", () => {
        cursor.style.width = "12px";
        cursor.style.height = "12px";
        ring.style.width = "36px";
        ring.style.height = "36px";
      });
    });
})();

/* ═══ PARTICLES ═══ */
(function () {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(scatter) {
      this.x = Math.random() * W;
      this.y = scatter ? Math.random() * H : H + Math.random() * 100;
      this.size = Math.random() * 2 + 0.5;
      this.speed = Math.random() * 0.6 + 0.2;
      this.opacity = Math.random() * 0.45 + 0.08;
      this.drift = (Math.random() - 0.5) * 0.35;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(58,175,110,${this.opacity})`;
      ctx.fill();
    }
  }
  const particles = Array.from({ length: 55 }, () => new Particle());
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ═══ COUNTDOWN ═══ */
(function () {
  const deadline = new Date("2026-03-22T23:59:59");
  const els = {
    d: document.getElementById("cd-days"),
    h: document.getElementById("cd-hours"),
    m: document.getElementById("cd-mins"),
    s: document.getElementById("cd-secs"),
  };
  const strip = document.querySelector(".countdown-strip");
  if (!strip) return;
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function tick() {
    const diff = deadline - new Date();
    if (diff <= 0) {
      strip.innerHTML =
        '<span style="color:var(--slate);font-size:.85rem;letter-spacing:.1em">Applications Closed</span>';
      return;
    }
    if (els.d) els.d.textContent = pad(Math.floor(diff / 86400000));
    if (els.h) els.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    if (els.m) els.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
    if (els.s) els.s.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

/* ═══ SCROLL REVEAL ═══ */
(function () {
  const targets = document.querySelectorAll(".reveal-child");
  if (!targets.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  targets.forEach((el) => observer.observe(el));
})();

/* ═══ STAT COUNTERS ═══ */
(function () {
  const stats = document.querySelectorAll(".stat-num[data-target]");
  if (!stats.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / 1200, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );
  stats.forEach((el) => observer.observe(el));
})();

/* ═══ SCROLL REVEAL — NEW SECTIONS ═══ */
(function () {
  const targets = document.querySelectorAll(".reveal-always");
  if (!targets.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  targets.forEach((el) => observer.observe(el));
})();

/* ═══ MOBILE NAV ═══ */
function showMenu() {
  document.getElementById("navLinks").classList.add("active");
}
function hideMenu() {
  document.getElementById("navLinks").classList.remove("active");
}
