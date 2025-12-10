// Smooth interactions + accessibility
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
gsap.registerPlugin(ScrollTrigger);

// Scroll reveal for key elements
gsap.utils
  .toArray(
    ".editor-card-large, .small-card, .big-card, .pf-card, .editor-copy-large, .testimonial-final, .big-footer"
  )
  .forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 92%" },
      opacity: 0,
      y: 18,
      duration: 0.7,
      delay: i * 0.04,
      ease: "power3.out",
    });
  });

// Hero subtle parallax
gsap.to("#hero", {
  backgroundPosition: "50% 40%",
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: 0.6,
  },
});

// Glass search entrance
gsap.from(".hero-search", {
  opacity: 0,
  y: 18,
  duration: 0.8,
  delay: 0.12,
  ease: "power3.out",
});

// Micro interactions: tilt for pointer devices, touch-friendly no-tilt for touch
const supportsPointer = window.matchMedia("(pointer:fine)").matches;
if (supportsPointer) {
  document.querySelectorAll(".property-card").forEach((card) => {
    let active = false;
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width / 2;
      const cy = e.clientY - r.top - r.height / 2;
      gsap.to(card, {
        rotationY: clamp(cx / 30, -6, 6),
        rotationX: clamp(-cy / 40, -5, 5),
        scale: 1.02,
        duration: 0.32,
        transformPerspective: 700,
        ease: "power3.out",
      });
    });
    card.addEventListener("mouseleave", () =>
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      })
    );
    card.addEventListener("focusin", () =>
      gsap.to(card, { scale: 1.02, duration: 0.25 })
    );
    card.addEventListener("focusout", () =>
      gsap.to(card, { scale: 1, duration: 0.25 })
    );
  });
} else {
  // On touch devices keep hover effects simple and accessible
  document.querySelectorAll(".property-card").forEach((card) => {
    card.addEventListener("touchstart", () => card.classList.add("touched"));
    card.addEventListener("touchend", () => card.classList.remove("touched"));
  });
}

// Pill filter logic (with smooth transitions)
(function () {
  const pills = Array.from(document.querySelectorAll(".pills-wrap .pill"));
  const cards = Array.from(
    document.querySelectorAll(".cards-grid .property-card")
  );
  function setActive(p) {
    pills.forEach((x) => x.classList.remove("active"));
    p.classList.add("active");
  }
  function filter(cat) {
    cards.forEach((c) => {
      const ok = cat === "all" || c.dataset.category === cat;
      gsap.to(c, {
        autoAlpha: ok ? 1 : 0,
        y: ok ? 0 : 18,
        scale: ok ? 1 : 0.985,
        duration: 0.45,
        ease: "power2.out",
        pointerEvents: ok ? "auto" : "none",
      });
    });
  }
  pills.forEach((p) => {
    p.addEventListener("click", () => {
      setActive(p);
      filter(p.dataset.filter || "all");
      p.scrollIntoView({
        inline: "center",
        behavior: "smooth",
        block: "nearest",
      });
    });
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        p.click();
      }
    });
  });
  filter("all");
})();

// Fav toggles w/ animation + aria
document.querySelectorAll(".fav").forEach((btn) => {
  btn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    const pressed = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", String(!pressed));
    gsap.fromTo(
      btn,
      { scale: 0.92 },
      { scale: 1, duration: 0.36, ease: "elastic.out(1,0.65)" }
    );
    btn.classList.toggle("saved", !pressed);
  });
});

// Editor carousel (2 slides)
(function () {
  const slides = [
    {
      img: "/assets/img/hotel_img_3.jpg",
      title: "Property Presentation",
      copy: "Let us handle the daily operations of your property. We guarantee efficient maintenance and increased profitability.",
    },
    {
      img: "/assets/img/hotel_img_4.jpg",
      title: "Leasing Solutions",
      copy: "Explore our personalized rental services to find the perfect property match. We offer access to high-quality homes in desirable areas.",
    },
  ];
  let idx = 0;
  const el0 = document.getElementById("editorCard0");
  const el1 = document.getElementById("editorCard1");

  function render(i) {
    const a = slides[i % slides.length],
      b = slides[(i + 1) % slides.length];
    // fade swap both cards
    [
      [el0, a],
      [el1, b],
    ].forEach(([el, slide]) => {
      gsap.to(el, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          el.style.backgroundImage = `url('${slide.img}')`;
          el.querySelector("h4").textContent = slide.title;
          el.querySelector("p").textContent = slide.copy;
          gsap.to(el, { opacity: 1, duration: 0.36, ease: "power3.out" });
        },
      });
    });
  }

  document.getElementById("editorNext").addEventListener("click", () => {
    idx = (idx + 1) % slides.length;
    render(idx);
  });
  document.getElementById("editorPrev").addEventListener("click", () => {
    idx = (idx - 1 + slides.length) % slides.length;
    render(idx);
  });

  // keyboard accessible
  ["editorNext", "editorPrev"].forEach((id) => {
    const el = document.getElementById(id);
    el?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  render(0);
})();

// Portfolio hover microinteraction
document.querySelectorAll(".small-card, .big-card").forEach((el) => {
  el.addEventListener("mouseenter", () =>
    gsap.to(el, { scale: 1.02, duration: 0.36, ease: "power3.out" })
  );
  el.addEventListener("mouseleave", () =>
    gsap.to(el, { scale: 1, duration: 0.36, ease: "power3.out" })
  );
});

// Testimonial autoplay with pause on hover/focus, keyboard arrows support
(function () {
  const imgs = [
    "/assets/img/hotel_img_2.jpg",
    "/assets/img/hotel_img_3.jpg",
    "/assets/img/hotel_img_1.jpg",
  ];
  const el = document.getElementById("testimonialImage");
  let idx = 0;
  let timer = null;
  const duration = 4200;

  function show(i) {
    idx = (i + imgs.length) % imgs.length;
    gsap.to(el, {
      opacity: 0,
      duration: 0.22,
      onComplete: () => {
        el.src = imgs[idx];
        gsap.to(el, { opacity: 1, duration: 0.36 });
      },
    });
  }
  function next() {
    show(idx + 1);
  }
  function prev() {
    show(idx - 1);
  }

  document.getElementById("testNext").addEventListener("click", next);
  document.getElementById("testPrev").addEventListener("click", prev);

  // autoplay
  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => next(), duration);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // pause on hover/focus for both image & controls
  const region = document.querySelector(".testimonial-final");
  region.addEventListener("mouseenter", stop);
  region.addEventListener("mouseleave", start);
  region.addEventListener("focusin", stop);
  region.addEventListener("focusout", start);

  // keyboard arrows
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  start();
})();

// Footer search UX (demo only)
document
  .getElementById("footerSearchInput")
  ?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.target;
      gsap.fromTo(
        input,
        { boxShadow: "0 0 0 rgba(0,0,0,0)" },
        {
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          duration: 0.36,
          onComplete: () => {
            setTimeout(() => input.blur(), 600);
          },
        }
      );
    }
  });

// anchor smooth scroll fallback
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", function (e) {
    const id = this.getAttribute("href");
    if (id && id.length > 1) {
      e.preventDefault();
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Prevent demo hero form from reloading
document
  .querySelector(".hero-search")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();
    document
      .querySelector("#portfolio")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
