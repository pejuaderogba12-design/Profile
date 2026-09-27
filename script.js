/* =================================================================
   PROFILE THEME — script.js

   Six small features live in this file. Each one is written to be
   read top to bottom — look for the numbered comments.
   ================================================================= */

// -------------------------------------------------------------
// 1. DARK / LIGHT MODE TOGGLE
// Saves your choice in localStorage so it's remembered next time
// this page is opened.
// -------------------------------------------------------------
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector(".theme-icon");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "light" ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    theme === "light" ? "Switch to dark mode" : "Switch to light mode"
  );
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme || "dark");

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem("theme", next);
});


// -------------------------------------------------------------
// 2. MOBILE MENU TOGGLE
// Shows/hides the nav links on small screens, and closes the
// menu again once a link is tapped.
// -------------------------------------------------------------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});


// -------------------------------------------------------------
// 3. HERO "TYPING" EFFECT
// Reads the text out of the data-text attribute and types it
// into the page one letter at a time.
// -------------------------------------------------------------
const typedEl = document.getElementById("typedComment");

if (typedEl) {
  const fullText = typedEl.dataset.text;
  let charIndex = 0;

  function typeNextChar() {
    if (charIndex <= fullText.length) {
      typedEl.textContent = fullText.slice(0, charIndex);
      charIndex++;
      setTimeout(typeNextChar, 60);
    }
  }

  typeNextChar();
}


// -------------------------------------------------------------
// 4. HIGHLIGHT THE CURRENT SECTION IN THE NAV
// As you scroll, the nav link for the section on screen gets an
// "active" class. Uses the IntersectionObserver API, which
// watches elements without checking scroll position by hand.
// -------------------------------------------------------------
const sections = document.querySelectorAll("main .section");
const navLinkByHref = new Map();
navLinks.querySelectorAll("a").forEach((link) => {
  navLinkByHref.set(link.getAttribute("href"), link);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = navLinkByHref.get(`#${entry.target.id}`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" } // counts a section as "current" once it crosses the middle of the screen
);

sections.forEach((section) => sectionObserver.observe(section));


// -------------------------------------------------------------
// 5. COPY EMAIL ADDRESS TO CLIPBOARD
// -------------------------------------------------------------
const copyEmailBtn = document.getElementById("copyEmail");
const copyHint = document.getElementById("copyHint");

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = copyEmailBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      copyHint.textContent = "copied!";
    } catch (err) {
      copyHint.textContent = "couldn't copy — try selecting it manually";
    }
    setTimeout(() => {
      copyHint.textContent = "click to copy";
    }, 1800);
  });
}


// -------------------------------------------------------------
// 6. FOOTER YEAR
// So the copyright line never goes out of date.
// -------------------------------------------------------------
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


// -------------------------------------------------------------
// 7. ANIMATE THE NAME, LETTER BY LETTER
// Splits the name into one <span> per character so each letter
// can be animated separately in CSS. Every span gets a --i
// custom property holding its position, which the CSS keyframes
// use to stagger the animation letter by letter (see style.css,
// section "NAME ANIMATION").
// -------------------------------------------------------------
const nameEl = document.querySelector(".hero .hero-name");

function animateName(el) {
  const text = el.textContent;
  el.textContent = ""; // clear it, we're about to rebuild it letter by letter

  // Letters are grouped into per-word wrappers (with a real, breakable
  // space between words) so a long name can still wrap onto a new line
  // between words, never in the middle of one.
  const words = text.split(" ");
  let index = 0;

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";

    [...word].forEach((char) => {
      const letterSpan = document.createElement("span");
      letterSpan.textContent = char;
      letterSpan.className = "letter";
      letterSpan.style.setProperty("--i", index); // used by the CSS animation-delay
      wordSpan.appendChild(letterSpan);
      index++;
    });

    el.appendChild(wordSpan);

    if (wordIndex < words.length - 1) {
      el.appendChild(document.createTextNode(" "));
      index++;
    }
  });
}

if (nameEl) {
  animateName(nameEl);
}


// -------------------------------------------------------------
// 8. GUIDE PAGE — CHECKLIST (only runs if a checklist is on the page)
// Remembers which boxes you've ticked using localStorage, so your
// progress is still there next time you open the guide.
// -------------------------------------------------------------
const checklist = document.getElementById("checklist");

if (checklist) {
  const STORAGE_KEY = "guideChecklist";
  const checkboxes = checklist.querySelectorAll("input[type='checkbox']");
  const progressEl = document.getElementById("checklistProgress");
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  function updateProgress() {
    const done = [...checkboxes].filter((box) => box.checked).length;
    progressEl.textContent = `${done} of ${checkboxes.length} done`;
  }

  checkboxes.forEach((box) => {
    box.checked = Boolean(savedState[box.dataset.key]);

    box.addEventListener("change", () => {
      savedState[box.dataset.key] = box.checked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
      updateProgress();
    });
  });

  updateProgress();
}


// -------------------------------------------------------------
// 9. GUIDE PAGE — LIVE NAME-ANIMATION DEMO (only runs if it's on the page)
// Lets you click between the three animation styles and see the
// name replay its entrance animation in the new style.
// -------------------------------------------------------------
const demoName = document.getElementById("demoName");

if (demoName) {
  animateName(demoName); // split "Try Me" into animated letters too

  document.querySelectorAll(".anim-buttons button").forEach((button) => {
    button.addEventListener("click", () => {
      demoName.classList.remove("name-wave", "name-wiggle");
      if (button.dataset.mode) {
        demoName.classList.add(button.dataset.mode);
      }
      // Re-run the letter split so the entrance animation plays again
      animateName(demoName);
    });
  });
}


// -------------------------------------------------------------
// 10. SCROLL PROGRESS BAR
// Fills the thin bar at the very top of the page based on how far
// down you've scrolled — 0% at the top, 100% at the bottom.
// -------------------------------------------------------------
const scrollProgress = document.getElementById("scrollProgress");

if (scrollProgress) {
  function updateScrollProgress() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = `${percent}%`;
  }

  window.addEventListener("scroll", updateScrollProgress);
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();
}


// -------------------------------------------------------------
// 11. HEADING UNDERLINE REVEAL
// Adds a "revealed" class to each section heading the first time
// it scrolls into view, which triggers the underline to grow in
// CSS (see style.css, ".section-heading::after").
// -------------------------------------------------------------
const headingObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target); // only needs to happen once per heading
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".section-heading").forEach((heading) => {
  headingObserver.observe(heading);
});


// -------------------------------------------------------------
// 12. SKILL PILL POP-IN
// The first time the skills list scrolls into view, each pill
// pops in one after another (see style.css, ".skills-visible").
// -------------------------------------------------------------
const skillList = document.querySelector(".skill-list");

if (skillList) {
  const pills = skillList.querySelectorAll(".skill-pill");
  pills.forEach((pill, index) => pill.style.setProperty("--i", index));

  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("skills-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillObserver.observe(skillList);
}


// A little hello for anyone curious enough to open DevTools —
// if you're reading this, you're already thinking like a developer.
console.log("👋 Hey! If you're reading this in DevTools, you're already thinking like a developer.");
