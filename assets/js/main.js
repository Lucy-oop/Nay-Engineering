/* =========================================================
   NAY ENGINEERING — interactions
   ========================================================= */
(function () {
  "use strict";
  const D = window.NAY;
  const page = document.body.dataset.page || "";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const IMG = "public/img/";
  const ARROW = '<svg class="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6"/></svg>';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Shared layout: preloader, header, menu, footer ---------- */
  const NAV = [
    ["index.html", "Home", "home"],
    ["about.html", "About Us", "about"],
    ["services.html", "Services", "services"],
    ["projects.html", "Projects", "projects"],
    ["contact.html", "Contact Us", "contact"]
  ];
  const cur = (k) => (k === page ? ' aria-current="page"' : "");

  const pre = document.createElement("div");
  pre.className = "preloader";
  pre.innerHTML = `<img class="preloader__logo" src="${IMG}logo-white.png" alt=""><span class="preloader__bar"></span>`;
  document.body.prepend(pre);

  const header = document.createElement("header");
  header.className = "header" + (document.body.dataset.header === "solid" ? " header--solid" : "");
  header.innerHTML = `
    <div class="container header__inner">
      <a class="header__logo" href="index.html" aria-label="Nay Engineering — home">
        <img class="logo-white" src="${IMG}logo-white.png" alt="Nay Engineering">
        <img class="logo-color" src="${IMG}logo.png" alt="" aria-hidden="true">
      </a>
      <nav class="nav" aria-label="Main">
        ${NAV.slice(0, 4).map(([h, l, k]) => `<a class="nav__link" href="${h}"${cur(k)}>${l}</a>`).join("")}
      </nav>
      <a class="btn btn--sun" href="contact.html">Contact us ${ARROW}</a>
      <button class="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    </div>`;
  pre.after(header);

  const mm = document.createElement("div");
  mm.className = "mobile-menu";
  mm.innerHTML = `
    <ul>${NAV.map(([h, l, k]) => `<li><a class="mm-link" href="${h}"${cur(k)}><span>${l}</span></a></li>`).join("")}</ul>
    <div class="mobile-menu__foot">
      <p>${esc(D.address)}</p>
      <p><a href="tel:${D.phoneHref}">${esc(D.phone)}</a></p>
    </div>`;
  header.after(mm);

  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <img class="footer__logo" src="${IMG}logo-white.png" alt="Nay Engineering">
          <p style="max-width:34ch">Steel structure, piping and metal fabrication &amp; installation for construction and industry in Singapore.</p>
          <div class="footer__social"${D.social.facebook === "#" && D.social.x === "#" ? " hidden" : ""}>
            <a href="${D.social.facebook}" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z"/></svg></a>
            <a href="${D.social.x}" aria-label="X (Twitter)"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2h3.4l-7.4 8.5L23 22h-6.8l-5.3-7-6.1 7H1.4l7.9-9L1 2h7l4.8 6.4L18.2 2zm-1.2 18h1.9L7.1 3.9H5.1L17 20z"/></svg></a>
          </div>
        </div>
        <div>
          <h4>Quick links</h4>
          <ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="services.html#steel">Steel Structures</a></li>
            <li><a href="services.html#piping">Piping</a></li>
            <li><a href="services.html#metal">Metal Components</a></li>
            <li><a href="services.html#construction">Construction</a></li>
            <li><a href="services.html#design-build">Design &amp; Build</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>${D.addressShort.map(esc).join("<br>")}</li>
            <li><a href="tel:${D.phoneHref}">${esc(D.phone)}</a></li>
            <li><a href="mailto:${D.email}">${esc(D.email)}</a><br><a href="mailto:${D.email2}">${esc(D.email2)}</a></li>
            <li>${esc(D.hours)}</li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} ${esc(D.company)}. All rights reserved. GST Reg: ${esc(D.gst)}</span>
        <span><a href="#">Terms &amp; Conditions</a> &nbsp;·&nbsp; <a class="to-top" href="#top">Back to top ↑</a></span>
      </div>
    </div>`;
  document.body.append(footer);
  document.body.id = "top";

  /* ---------- Load state ---------- */
  const t0 = performance.now();
  const markLoaded = () => {
    const wait = Math.max(0, (reduce ? 0 : 1000) - (performance.now() - t0));
    setTimeout(() => {
      document.documentElement.classList.add("is-loaded");
      setTimeout(() => pre.remove(), 1200);
      startHero();
    }, wait);
  };
  if (document.readyState === "complete") markLoaded();
  else window.addEventListener("load", markLoaded);
  setTimeout(() => document.documentElement.classList.contains("is-loaded") || markLoaded(), 4000);

  /* ---------- Header: solid on scroll, hide on scroll down ---------- */
  let lastY = window.scrollY;
  const onScrollHeader = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    const hide = y > lastY && y > 300 && !document.body.classList.contains("menu-open");
    header.classList.toggle("is-hidden", hide);
    document.body.classList.toggle("header-hidden", hide);
    lastY = y;
  };

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger", header);
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) burger.click();
  });

  /* ---------- Render: home project carousel ---------- */
  const cardMedia = (p) =>
    p.images.length
      ? `<img src="${IMG}${p.images[0]}" alt="${esc(p.title)}" loading="lazy" draggable="false">`
      : `<div class="pcard__art"><div><strong>${esc(p.art.big)}</strong><span>${esc(p.art.small)}</span></div></div>`;

  const homeTrack = $("#home-projects");
  if (homeTrack) {
    homeTrack.innerHTML = D.projects
      .map(
        (p) => `<a class="pcard" href="projects.html#${p.id}">
        <div class="pcard__media">${cardMedia(p)}
          <div class="pcard__info">
            <span class="pcard__tag">${esc(D.categories[p.cat])}</span>
            <h3 class="pcard__title">${esc(p.title)}</h3>
            <p class="pcard__client">${esc(p.client)}</p>
          </div>
        </div></a>`
      )
      .join("");
  }

  /* ---------- Render: projects page ---------- */
  const grid = $("#project-grid");
  if (grid) {
    const filters = $("#filters");
    const counts = D.projects.reduce((a, p) => ((a[p.cat] = (a[p.cat] || 0) + 1), a), {});
    filters.innerHTML =
      `<button class="chip is-active" data-f="all">All projects<sup>${D.projects.length}</sup></button>` +
      Object.entries(D.categories)
        .filter(([k]) => counts[k])
        .map(([k, v]) => `<button class="chip" data-f="${k}">${esc(v)}<sup>${counts[k]}</sup></button>`)
        .join("");

    grid.innerHTML = D.projects
      .map(
        (p, i) => `<button class="pitem pcard reveal" id="${p.id}" data-cat="${p.cat}" data-i="${i}" ${p.images.length ? "" : "disabled"} aria-label="View ${esc(p.title)} gallery">
        <div class="pcard__media">${cardMedia(p)}
          ${p.images.length > 1 ? `<span class="pitem__count"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>${p.images.length} photos</span>` : ""}
          <div class="pcard__info">
            <span class="pcard__tag">${String(i + 1).padStart(2, "0")} · ${esc(D.categories[p.cat])}</span>
            <h3 class="pcard__title">${esc(p.title)}</h3>
            <p class="pcard__client">${esc(p.client)}</p>
            ${p.parts ? `<div class="pitem__parts">${p.parts.map((x) => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
          </div>
        </div></button>`
      )
      .join("");

    const layout = () => {
      const vis = $$(".pitem", grid).filter((it) => !it.classList.contains("is-hidden"));
      vis.forEach((it, n) => it.classList.toggle("is-wide", n % 3 === 2 || (n === vis.length - 1 && n % 3 === 0)));
    };
    layout();
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      $$(".chip", filters).forEach((c) => c.classList.toggle("is-active", c === b));
      const f = b.dataset.f;
      $$(".pitem", grid).forEach((it) => it.classList.toggle("is-hidden", f !== "all" && it.dataset.cat !== f));
      layout();
    });

    // Lightbox
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML = `
      <div class="lightbox__head"><div><h3></h3><p></p></div>
        <button class="round-btn" data-lb="close" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>
      <div class="lightbox__stage"></div>
      <div class="lightbox__foot">
        <button class="round-btn" data-lb="prev" aria-label="Previous photo"><svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M15 8H2M7 3L2 8l5 5" stroke="currentColor" stroke-width="1.6"/></svg></button>
        <span class="lightbox__counter"></span>
        <button class="round-btn" data-lb="next" aria-label="Next photo"><svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6"/></svg></button>
      </div>`;
    document.body.append(lb);
    let cp = null, ci = 0, opener = null;
    const show = () => {
      $(".lightbox__stage", lb).innerHTML = `<img src="${IMG}${cp.images[ci]}" alt="${esc(cp.title)} — photo ${ci + 1}">`;
      $(".lightbox__counter", lb).textContent = `${ci + 1} / ${cp.images.length}`;
      $$('[data-lb="prev"],[data-lb="next"]', lb).forEach((b) => (b.style.visibility = cp.images.length > 1 ? "" : "hidden"));
    };
    const open = (p, btn) => {
      cp = p; ci = 0; opener = btn;
      $("h3", lb).textContent = p.title;
      $("p", lb).textContent = p.client;
      show();
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
      $('[data-lb="close"]', lb).focus();
    };
    const close = () => { lb.classList.remove("is-open"); document.body.style.overflow = ""; opener && opener.focus(); };
    const step = (d) => { ci = (ci + d + cp.images.length) % cp.images.length; show(); };
    grid.addEventListener("click", (e) => {
      const it = e.target.closest(".pitem");
      if (it && !it.disabled) open(D.projects[+it.dataset.i], it);
    });
    lb.addEventListener("click", (e) => {
      const a = e.target.closest("[data-lb]");
      if (a) ({ close, prev: () => step(-1), next: () => step(1) })[a.dataset.lb]();
      else if (e.target === lb || e.target.classList.contains("lightbox__stage")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
    // Deep link (#reducer etc.) — open after load
    if (location.hash) {
      const p = D.projects.find((x) => "#" + x.id === location.hash);
      if (p && p.images.length) window.addEventListener("load", () => setTimeout(() => open(p, document.getElementById(p.id)), 1300));
    }
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }),
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  $$(".reveal, .img-reveal, .split-lines").forEach((el) => io.observe(el));

  /* ---------- Counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = parseFloat(el.dataset.count), dur = 1800, s = performance.now();
      cio.unobserve(el);
      if (reduce) { el.textContent = end.toLocaleString(); return; }
      const tick = (now) => {
        const k = Math.min(1, (now - s) / dur), e = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(end * e).toLocaleString();
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => { el.textContent = "0"; cio.observe(el); });

  /* ---------- Scroll-highlight text ---------- */
  const hl = $$(".highlight-text");
  hl.forEach((el) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) frag.append(t);
            else { const s = document.createElement("span"); s.className = "w" + (node.tagName === "EM" ? " accent" : ""); s.textContent = t; frag.append(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
    $$("em", el).forEach((em) => (em.style.fontStyle = "normal"));
  });
  const updateHighlight = () => {
    hl.forEach((el) => {
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const ws = el._ws || (el._ws = $$(".w", el));
      const n = Math.round(p * ws.length);
      ws.forEach((w, i) => w.classList.toggle("on", i < n));
    });
  };

  /* ---------- Parallax ---------- */
  const px = $$("[data-parallax]");
  const updateParallax = () => {
    if (reduce) return;
    const vh = window.innerHeight;
    px.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const amt = parseFloat(el.dataset.parallax) || 0.12;
      const c = (r.top + r.height / 2 - vh / 2) * -amt;
      (el.firstElementChild || el).style.transform = `translate3d(0, ${c.toFixed(1)}px, 0)`;
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScrollHeader(); updateHighlight(); updateParallax(); ticking = false; });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Hero slider ---------- */
  function startHero() {
    const hero = $(".hero");
    if (!hero || hero._started) return;
    hero._started = true;
    const slides = $$(".hero__slide", hero), tabs = $$(".hero__tab", hero);
    const DUR = 7000;
    let i = 0, timer = null, remaining = DUR, startedAt = 0;
    hero.style.setProperty("--dur", DUR / 1000 + "s");
    const go = (n) => {
      slides[i].classList.remove("is-active"); tabs[i].classList.remove("is-active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active");
      void tabs[i].offsetWidth; // restart bar animation
      tabs[i].classList.add("is-active");
      schedule(DUR);
    };
    const schedule = (ms) => { clearTimeout(timer); remaining = ms; startedAt = Date.now(); if (!reduce) timer = setTimeout(() => go(i + 1), ms); };
    tabs.forEach((t, n) => t.addEventListener("click", () => n !== i && go(n)));
    hero.addEventListener("mouseenter", () => { clearTimeout(timer); remaining -= Date.now() - startedAt; hero.classList.add("is-paused"); });
    hero.addEventListener("mouseleave", () => { hero.classList.remove("is-paused"); schedule(Math.max(300, remaining)); });
    tabs[0].classList.add("is-active");
    schedule(DUR);
  }

  /* ---------- Cursor-follow image list ---------- */
  const xl = $(".xlist");
  if (xl && window.matchMedia("(hover: hover)").matches && !reduce) {
    const box = document.createElement("div");
    box.className = "cursor-img";
    const items = $$(".xlist__item", xl);
    box.innerHTML = items.map((it) => `<img src="${IMG}${it.dataset.img}" alt="">`).join("");
    document.body.append(box);
    const imgs = $$("img", box);
    let tx = 0, ty = 0, x = 0, y = 0, raf = null;
    const loop = () => { x += (tx - x) * 0.14; y += (ty - y) * 0.14; box.style.left = x + "px"; box.style.top = y + "px"; raf = requestAnimationFrame(loop); };
    xl.addEventListener("mousemove", (e) => { tx = e.clientX + 180; ty = e.clientY; });
    xl.addEventListener("mouseenter", (e) => { x = tx = e.clientX + 180; y = ty = e.clientY; box.classList.add("is-on"); raf = requestAnimationFrame(loop); });
    xl.addEventListener("mouseleave", () => { box.classList.remove("is-on"); cancelAnimationFrame(raf); });
    items.forEach((it, n) => it.addEventListener("mouseenter", () => imgs.forEach((im, k) => im.classList.toggle("is-on", k === n))));
  }

  /* ---------- Drag carousel ---------- */
  $$(".carousel").forEach((c) => {
    const track = $(".carousel__track", c), bar = $(".carousel__progress i", c);
    const prev = $("[data-dir='-1']", c), next = $("[data-dir='1']", c);
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      const vis = track.clientWidth / track.scrollWidth;
      const p = max > 0 ? track.scrollLeft / max : 1;
      if (bar) { bar.style.width = Math.min(100, vis * 100) + "%"; bar.style.transform = `translateX(${p * (1 / vis - 1) * 100}%)`; }
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > max - 4;
    };
    const card = () => (track.firstElementChild ? track.firstElementChild.offsetWidth + 24 : 300);
    [prev, next].forEach((b) => b && b.addEventListener("click", () => track.scrollBy({ left: card() * +b.dataset.dir, behavior: "smooth" })));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; track.classList.add("is-dragging"); }
      track.scrollLeft = sl - dx;
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      if (moved) {
        track.classList.remove("is-dragging");
        const w = card();
        track.scrollTo({ left: Math.round(track.scrollLeft / w) * w, behavior: "smooth" });
      }
    });
    track.addEventListener("click", (e) => moved && e.preventDefault(), true);
  });

  /* ---------- Services sticky sub-nav ---------- */
  const sn = $(".svc-nav");
  if (sn) {
    const links = $$("a", sn);
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => {
          const on = l.getAttribute("href") === "#" + en.target.id;
          l.classList.toggle("is-active", on);
          if (on) l.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".svc").forEach((s) => sio.observe(s));
  }

  /* ---------- Contact: fill details + form ---------- */
  $$("[data-fill]").forEach((el) => {
    const k = el.dataset.fill;
    if (k === "phone") { el.textContent = D.phone; el.href = "tel:" + D.phoneHref; }
    else if (k === "email" || k === "email2") { el.textContent = D[k]; el.href = "mailto:" + D[k]; }
    else el.textContent = D[k];
  });
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const f = new FormData(form);
      const body = `Name: ${f.get("name")}\nCompany: ${f.get("company") || "-"}\nEmail: ${f.get("email")}\nPhone: ${f.get("phone") || "-"}\nService: ${f.get("service")}\n\n${f.get("message")}`;
      location.href = `mailto:${D.email}?cc=${encodeURIComponent(D.email2)}&subject=${encodeURIComponent("Project enquiry — " + f.get("service"))}&body=${encodeURIComponent(body)}`;
      $(".form-status", form).textContent = "Opening your email app to send the enquiry…";
    });
  }
})();
