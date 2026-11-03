// Add only contact details you want to show publicly.
const CONTACT = {
  email: "sah544@gmail.com",
  linkedin: "www.linkedin.com/in/triloki-sah-1ab4a8347",
  github: "https://github.com/tr1l0k1s4h"
};

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  siteNav.classList.remove("is-open");
}

menuButton.addEventListener("click", function () {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("click", function (event) {
  if (!siteNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeMenu();
});

window.addEventListener("resize", function () {
  if (window.innerWidth > 650) closeMenu();
});

const themeButton = document.querySelector(".theme-toggle");
let savedTheme = "light";

try {
  savedTheme = localStorage.getItem("triloki-portfolio-theme") || "light";
} catch (error) {
  savedTheme = "light";
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  const isDark = theme === "dark";
  themeButton.textContent = isDark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeButton.setAttribute("aria-pressed", String(isDark));
}

setTheme(savedTheme);
themeButton.addEventListener("click", function () {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("triloki-portfolio-theme", nextTheme);
  } catch (error) {
    // The theme still changes until the page is closed.
  }
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectRows = document.querySelectorAll(".project-row");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const filter = button.dataset.filter;

    filterButtons.forEach(function (item) {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    projectRows.forEach(function (project) {
      project.hidden = filter !== "all" && project.dataset.category !== filter;
    });
  });
});

document.querySelectorAll("[data-contact]").forEach(function (link) {
  const kind = link.dataset.contact;
  const value = CONTACT[kind];

  if (!value) return;
  link.hidden = false;
  link.href = kind === "email" ? "mailto:" + value : (value.startsWith("http") ? value : "https://" + value);

  if (kind !== "email") {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});

const setupMessage = document.querySelector("#contact-setup");
if (CONTACT.email || CONTACT.linkedin || CONTACT.github) setupMessage.hidden = true;

const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("#copy-status");

async function copyEmail() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(CONTACT.email);
    } else {
      const emailField = document.createElement("textarea");
      emailField.value = CONTACT.email;
      emailField.setAttribute("readonly", "");
      emailField.style.position = "fixed";
      emailField.style.opacity = "0";
      document.body.append(emailField);
      emailField.select();
      const copied = document.execCommand("copy");
      emailField.remove();
      if (!copied) throw new Error("Copy failed.");
    }
    copyStatus.textContent = "Email copied.";
  } catch (error) {
    copyStatus.textContent = "Copy is unavailable. Use the Email link instead.";
  }
}

if (CONTACT.email) {
  copyButton.hidden = false;
  copyButton.addEventListener("click", copyEmail);
}

const progressBar = document.querySelector("#reading-progress-bar");
const progressMeter = document.querySelector(".reading-progress");
const backToTop = document.querySelector("#back-to-top");

function updateScroll() {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;
  progressBar.style.width = percent + "%";
  progressMeter.setAttribute("aria-valuenow", String(Math.round(percent)));
  backToTop.hidden = window.scrollY < 400;
}

window.addEventListener("scroll", updateScroll);
window.addEventListener("resize", updateScroll);
updateScroll();

backToTop.addEventListener("click", function () {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  window.scrollTo({ top: 0, behavior: motion });
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
