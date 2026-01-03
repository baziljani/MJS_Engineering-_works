
// Carousel
let index = 0;
const track = document.querySelector(".carousel-track");

function updateSlide() {
  if (!track) return;
  track.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
  const slides = document.querySelectorAll(".carousel-slide");
  if (!slides.length) return;
  index = (index + 1) % slides.length;
  updateSlide();
}

function prevSlide() {
  const slides = document.querySelectorAll(".carousel-slide");
  if (!slides.length) return;
  index = (index - 1 + slides.length) % slides.length;
  updateSlide();
}

/* Auto slide */
setInterval(nextSlide, 5000);


// Sparks canvas
const canvas = document.getElementById("sparks");
const ctx = canvas ? canvas.getContext("2d") : null;
if (canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let sparks = [];
window.addEventListener("mousemove", (e) => {
  if (!canvas) return;
  for (let i = 0; i < 5; i++) {
    sparks.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * -6,
      life: 30
    });
  }
});

function drawSparks() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = sparks.length - 1; i >= 0; i--) {
    const s = sparks[i];
    ctx.beginPath();
    ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();

    s.x += s.vx;
    s.y += s.vy;
    s.life--;

    if (s.life <= 0) sparks.splice(i, 1);
  }

  requestAnimationFrame(drawSparks);
}
drawSparks();


// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
  reveals.forEach(r => {
    const windowHeight = window.innerHeight;
    const top = r.getBoundingClientRect().top;

    if (top < windowHeight - 100) {
      r.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


// Single consolidated PROJECT FILTER (safe when called from inline onclick)
function filterProjects(type) {
  const slides = document.querySelectorAll(".carousel-slide");
  const buttons = document.querySelectorAll(".project-tabs button");

  buttons.forEach(b => b.classList.remove("active"));

  // Try to find the button that matches the type (inline onclick contains the type)
  const selector = `.project-tabs button[onclick*="'${type}'"]`;
  const matchBtn = document.querySelector(selector) || document.activeElement;
  if (matchBtn && matchBtn.classList) matchBtn.classList.add("active");

  slides.forEach(slide => {
    if (type === "all" || slide.classList.contains(type)) {
      slide.style.display = "block";
    } else {
      slide.style.display = "none";
    }
  });

  index = 0;
  updateSlide();
}


// Modal & Gallery (single implementations)
let galleryImgs = [];
let currentIndex = 0;
let selectedImage = "";
let selectedProject = "";

function openModal(src, project = "Welding Work") {
  selectedImage = src;
  selectedProject = project;

  const imgs = document.querySelectorAll(".gallery-grid img");
  galleryImgs = Array.from(imgs).map(img => img.src);
  currentIndex = galleryImgs.indexOf(src);

  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  if (modalImg) modalImg.src = src;
  if (modal) modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("imgModal");
  if (modal) modal.style.display = "none";
}

document.getElementById("imgModal")?.addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});

function nextImg() {
  if (!galleryImgs.length) return;
  currentIndex = (currentIndex + 1) % galleryImgs.length;
  document.getElementById("modalImg").src = galleryImgs[currentIndex];
}

function prevImg() {
  if (!galleryImgs.length) return;
  currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
  document.getElementById("modalImg").src = galleryImgs[currentIndex];
}


function sendWAFromModal() {
  const imageName = selectedImage.split("/").pop();

  const message = `Hello MJS Engineering Works,\\n\\nProject: ${selectedProject || "Welding Work"}\\nImage Reference: ${imageName}\\n\\nI would like to know:\\n• Price details\\n• Material used\\n• Time required\\n\\nPlease contact me.`;

  window.open(
    "https://wa.me/918248881263?text=" +
      encodeURIComponent(message),
    "_blank"
  );
}


// Navigation link active state on scroll
const navLinks = document.querySelectorAll("nav a");
window.addEventListener("scroll", () => {
  let fromTop = window.scrollY + 120;

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    let section = document.querySelector(href);
    if (!section) return;

    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});


// Experience counter
let started = false;
const counter = document.getElementById("expCounter");
function startCounter() {
  if (started || !counter) return;
  started = true;

  let count = 0;
  const target = 15;
  const interval = setInterval(() => {
    count++;
    counter.innerText = count;
    if (count === target) clearInterval(interval);
  }, 120);
}

window.addEventListener("scroll", () => {
  const about = document.getElementById("about");
  if (!about) return;
  if (about.getBoundingClientRect().top < window.innerHeight - 100) {
    startCounter();
  }
});


// Dynamic header height to avoid fixed header overlapping content
(function () {
  const setHeaderHeight = () => {
    const header = document.querySelector('.header');
    if (!header) return;
    const h = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', h + 'px');
  };

  // simple debounce
  const debounce = (fn, wait = 100) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  window.addEventListener('load', setHeaderHeight);
  window.addEventListener('resize', debounce(setHeaderHeight, 120));

  const headerEl = document.querySelector('.header');
  if (headerEl && window.MutationObserver) {
    const obs = new MutationObserver(debounce(setHeaderHeight, 80));
    obs.observe(headerEl, { attributes: true, childList: true, subtree: true });
  }
  // expose for other code (e.g. toggle) to trigger header recalculation
  window.updateHeaderHeight = setHeaderHeight;
})();

// Mobile menu toggle logic (responsive, auto close on outside click)
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const navInner = document.querySelector('.nav-inner');
  if (!toggle || !navInner) return;

  const THRESH = 550; // px

  const debounce = (fn, wait = 100) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  function applyResponsiveState() {
    if (window.innerWidth <= THRESH) {
      // hide nav by default on extra-narrow screens
      navInner.classList.remove('open');
      toggle.style.display = '';
      toggle.setAttribute('aria-expanded', 'false');
    } else {
      // ensure nav visible on larger screens and hide toggle
      navInner.classList.remove('open');
      toggle.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
    }
    if (window.updateHeaderHeight) window.updateHeaderHeight();
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = navInner.classList.toggle('open');
    // when menu changes height, update header offset
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (window.updateHeaderHeight) window.updateHeaderHeight();
  });

  // close menu when clicking a nav link (mobile)
  navInner.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && window.innerWidth <= THRESH) {
      navInner.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      if (window.updateHeaderHeight) window.updateHeaderHeight();
    }
    // If a dropdown parent is clicked, toggle its open state on narrow screens
    if (e.target.closest('.dropdown') && window.innerWidth <= THRESH) {
      const dd = e.target.closest('.dropdown');
      dd.classList.toggle('open');
    }
  });

  // close when clicking outside
  document.addEventListener('click', function (e) {
    if (window.innerWidth <= THRESH && navInner.classList.contains('open')) {
      if (!navInner.contains(e.target) && !toggle.contains(e.target)) {
        navInner.classList.remove('open');
        // remove any open dropdown markers
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
        toggle.setAttribute('aria-expanded', 'false');
        if (window.updateHeaderHeight) window.updateHeaderHeight();
      }
    }
  });

  window.addEventListener('resize', debounce(applyResponsiveState, 120));

  // initialize
  applyResponsiveState();
})();