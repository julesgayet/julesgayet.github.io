// Apparition au scroll, lien actif dans la nav, compteurs des chiffres clés.
document.documentElement.classList.add("js");

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const reveal = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add("in");
    reveal.unobserve(e.target);
  }
}, { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

const links = [...document.querySelectorAll(".nav-links a")];
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    links.forEach((a) => a.classList.toggle("active", a.hash === "#" + e.target.id));
  }
}, { rootMargin: "-45% 0px -50% 0px" });
links.forEach((a) => { const s = document.querySelector(a.hash); if (s) spy.observe(s); });

const fmt = new Intl.NumberFormat("fr-FR");
const count = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    count.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1100;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = fmt.format(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
});
if (!reduce) document.querySelectorAll("[data-count]").forEach((el) => count.observe(el));

// Lockd : l'iPhone se couche et ses écrans sortent en éventail pendant le défilement (repris de lockd.fr).
const lkStage = document.getElementById("lkStage");
const lkPhone = document.getElementById("lkPhone");
if (lkStage && lkPhone) {
  const box = lkStage.parentElement;
  const pages = lkPhone.querySelectorAll(".ui-page");
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = box.getBoundingClientRect();
    const vh = innerHeight;
    // Démarre quand le haut du panneau atteint 55 % de l'écran, finit à 10 %
    const raw = (vh * 0.55 - r.top) / (vh * 0.45);
    const p = reduce ? 0.6 : ease(Math.min(1, Math.max(0, raw)));
    lkPhone.style.transform = `rotateX(${55 * p}deg) rotateZ(${-14 * p}deg) translateX(${-200 * p}px)`;
    const fit = Math.min(1, (box.clientHeight - 30) / 640, box.clientWidth / (330 + 380 * p));
    lkStage.style.transform = `translate(${30 * p}px, ${-45 * p}px) scale(${fit * (1 - 0.12 * p)})`;
    pages.forEach((el) => {
      const i = Number(el.dataset.i) || 0;
      el.style.transform = `translate3d(${i * 150 * p}px, ${-i * 30 * p}px, ${(i * 70 + 4) * p + 2 + i}px)`;
    });
    lkPhone.classList.toggle("is-lifted", p > 0.15);
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  addEventListener("scroll", request, { passive: true });
  addEventListener("resize", request);
}
