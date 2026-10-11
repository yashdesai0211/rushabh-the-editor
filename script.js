/*
  RUSHABH — THE EDITOR | Portfolio configuration
  Add real links below before publishing. Leave a value empty to hide that button.
  Do not paste private API keys or passwords here.
*/
const SITE_CONFIG = {
  rushabhInstagram: "https://www.instagram.com/rushabh_creator21/",
  rushabhEmail: "rushabhnaik86@gmail.com",
  rushabhPhone: "+918793299284",
  rushabhWhatsApp: "918793299284",
  developerEmail: "firstforgestudios.games@gmail.com",
  developerInstagram: "https://www.instagram.com/its_yashhh02/",
  projects: {
    devotional: { youtube: "", instagram: "", video: "assets/videos/devotional.mp4" },
    trending: { youtube: "", instagram: "", video: "assets/videos/trending.mp4" },
    character: { youtube: "", instagram: "", video: "assets/videos/character.mp4" },
    normal: { youtube: "", instagram: "", video: "assets/videos/normal.mp4" },
    podcast: { youtube: "", instagram: "", video: "assets/videos/podcast.mp4" }
  }
};

const $ = (id) => document.getElementById(id);
const nav = $("nav");
const menuToggle = $("menuToggle");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "×" : "☰";
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const selector = link.getAttribute("href");
    if (!selector || selector === "#") return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    if (link.id === "dialogContact" && $("projectDialog")?.open) $("projectDialog").close();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    nav?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) { menuToggle.setAttribute("aria-label", "Open navigation"); menuToggle.textContent = "☰"; }
  });
});

// Portfolio filters
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const projectCards = [...document.querySelectorAll(".project-card")];
filterButtons.forEach((button) => button.addEventListener("click", () => {
  const filter = button.dataset.filter;
  filterButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  projectCards.forEach((card) => {
    card.hidden = filter !== "all" && card.dataset.category !== filter;
  });
}));

// Per-project social destinations are loaded from SITE_CONFIG.
function setExternalLink(anchor, url) {
  if (!anchor) return;
  const value = (url || "").trim();
  const safe = /^https:\/\//i.test(value) && (() => { try { const parsed = new URL(value); return ["youtube.com", "www.youtube.com", "youtu.be", "instagram.com", "www.instagram.com"].includes(parsed.hostname); } catch { return false; } })();
  if (!safe) {
    anchor.hidden = true;
    anchor.removeAttribute("href");
    return false;
  }
  anchor.href = value;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  anchor.hidden = false;
  return true;
}

const dialog = $("projectDialog");
const dialogYoutube = $("dialogYoutube");
const dialogInstagram = $("dialogInstagram");
function openProject(card) {
  const projectId = card.dataset.project;
  const links = SITE_CONFIG.projects[projectId] || {};
  $("dialogTitle").textContent = card.dataset.title || "Video edit";
  $("dialogKind").textContent = card.dataset.kind || "VIDEO EDIT";
  $("dialogDescription").textContent = card.dataset.description || "Explore this edit on Rushabh's social channels.";
  const videoPath = card.dataset.video || links.video || "";
  const dialogVideo = $("dialogVideo");
  const dialogVideoSource = $("dialogVideoSource");
  if (videoPath && dialogVideo && dialogVideoSource) {
    dialogVideoSource.src = videoPath;
    dialogVideo.poster = card.dataset.thumbnail || "";
    dialogVideo.load();
    $("dialogThumbnailWrap").hidden = false;
  } else if (dialogVideo && dialogVideoSource) {
    dialogVideo.pause();
    dialogVideoSource.removeAttribute("src");
    dialogVideo.load();
    $("dialogThumbnailWrap").hidden = true;
  }
  setExternalLink(dialogYoutube, links.youtube);
  setExternalLink(dialogInstagram, links.instagram);
  const hasLinks = !dialogYoutube.hidden || !dialogInstagram.hidden;
  $("dialogLinksNote").hidden = hasLinks;
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "open");
}
projectCards.forEach((card) => {
  card.querySelector(".project-open")?.addEventListener("click", () => openProject(card));
});
$("dialogClose")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog?.addEventListener("close", () => {
  const video = $("dialogVideo");
  const source = $("dialogVideoSource");
  if (video) video.pause();
  if (source) source.removeAttribute("src");
  if (video) video.load();
});

// Contact buttons never pretend an email/number exists when it has not been configured.
function configureEmail(displayId, buttonId, email, label) {
  const display = $(displayId), button = $(buttonId);
  if (!display || !button) return;
  const value = (email || "").trim();
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    display.textContent = "Contact link not configured yet";
    button.hidden = true;
    return;
  }
  display.textContent = value;
  if (display.tagName === "A") display.href = `mailto:${value}`;
  button.href = `mailto:${value}?subject=${encodeURIComponent(`Enquiry for ${label}`)}`;
  button.hidden = false;
}
configureEmail("rushabhEmailDisplay", "rushabhEmailButton", SITE_CONFIG.rushabhEmail, "Rushabh");
configureEmail("developerEmailDisplay", "developerEmailButton", SITE_CONFIG.developerEmail, "website development");

const rushabhInstagramButton = $("rushabhInstagramButton");
if (SITE_CONFIG.rushabhInstagram && /^https:\/\/www\.instagram\.com\/[A-Za-z0-9._]+\/?$/.test(SITE_CONFIG.rushabhInstagram)) {
  rushabhInstagramButton.href = SITE_CONFIG.rushabhInstagram;
  rushabhInstagramButton.target = "_blank";
  rushabhInstagramButton.rel = "noopener noreferrer";
  rushabhInstagramButton.hidden = false;
} else if (rushabhInstagramButton) rushabhInstagramButton.hidden = true;

const phoneButton = $("rushabhPhoneButton");
if (phoneButton && SITE_CONFIG.rushabhPhone) phoneButton.href = `tel:${SITE_CONFIG.rushabhPhone}`;
const whatsappButton = $("rushabhWhatsAppButton");
const phone = (SITE_CONFIG.rushabhWhatsApp || "").replace(/\D/g, "");
if (whatsappButton && phone.length >= 10) {
  whatsappButton.href = `https://wa.me/${phone}`;
  whatsappButton.target = "_blank";
  whatsappButton.rel = "noopener noreferrer";
  whatsappButton.hidden = false;
} else if (whatsappButton) whatsappButton.hidden = true;

$("currentYear").textContent = new Date().getFullYear();

const developerInstagramButton = $("developerInstagramButton");
if (developerInstagramButton && SITE_CONFIG.developerInstagram) {
  developerInstagramButton.href = SITE_CONFIG.developerInstagram;
  developerInstagramButton.target = "_blank";
  developerInstagramButton.rel = "noopener noreferrer";
}
