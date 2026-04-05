const viewerFrame = document.getElementById("viewerFrame");
const viewerTitle = document.getElementById("viewerTitle");
const viewerSummary = document.getElementById("viewerSummary");
const viewerOpenLink = document.getElementById("viewerOpenLink");

const modal = document.getElementById("projectModal");
const modalFrame = document.getElementById("modalViewerFrame");
const modalTitle = document.getElementById("modalViewerTitle");
const modalSummary = document.getElementById("modalViewerSummary");
const modalOpenLink = document.getElementById("modalViewerOpenLink");
const modalCloseBtn = document.getElementById("modalCloseBtn");

const launchCards = document.querySelectorAll(".project-launch-card");

function isMobileView() {
  return window.matchMedia("(max-width: 1024px)").matches;
}

function getEmbedUrl(url) {
  if (!url) return "";

  // Local image / file
  if (
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".webp") ||
    url.endsWith(".pdf")
  ) {
    return url;
  }

  // Google Drive file
  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  // Google Slides
  if (url.includes("docs.google.com/presentation/d/")) {
    return url.replace(/\/edit.*$/, "/preview");
  }

  // Google Docs
  if (url.includes("docs.google.com/document/d/")) {
    return url.replace(/\/edit.*$/, "/preview");
  }

  // YouTube normal link
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = new URL(url).searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // YouTube short link
  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts[1]) {
      const id = parts[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
  }

  // For services like Power BI, ArcGIS Experience, Kobo and others
  return url;
}

function setActiveCard(card) {
  document.querySelectorAll(".project-launch-card").forEach((item) => {
    item.classList.remove("is-active");
  });
  card.classList.add("is-active");
}

function openDesktopViewer(title, summary, live) {
  const embed = getEmbedUrl(live);

  if (viewerTitle) viewerTitle.textContent = title;
  if (viewerSummary) viewerSummary.textContent = summary;
  if (viewerFrame) viewerFrame.src = embed || "";
  if (viewerOpenLink) viewerOpenLink.href = live || "#";
}

function openModalViewer(title, summary, live) {
  const embed = getEmbedUrl(live);

  if (modalTitle) modalTitle.textContent = title;
  if (modalSummary) modalSummary.textContent = summary;
  if (modalFrame) modalFrame.src = embed || "";
  if (modalOpenLink) modalOpenLink.href = live || "#";

  if (modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeModalViewer() {
  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  if (modalFrame) {
    modalFrame.src = "";
  }
}

function activateCard(card) {
  const title = card.dataset.title || "Project Viewer";
  const summary = card.dataset.summary || "Live product preview.";
  const live = card.dataset.live || "#";

  setActiveCard(card);

  if (isMobileView()) {
    openModalViewer(title, summary, live);
  } else {
    openDesktopViewer(title, summary, live);
  }
}

launchCards.forEach((card) => {
  card.addEventListener("click", () => activateCard(card));
});

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModalViewer);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
      closeModalViewer();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModalViewer();
  }
});

// Load first card into sticky viewer on desktop only
if (launchCards.length > 0 && !isMobileView()) {
  const firstCard = launchCards[0];
  const title = firstCard.dataset.title || "Project Viewer";
  const summary = firstCard.dataset.summary || "Live product preview.";
  const live = firstCard.dataset.live || "#";
  setActiveCard(firstCard);
  openDesktopViewer(title, summary, live);
}

// If user resizes from mobile to desktop, ensure sticky viewer is populated
window.addEventListener("resize", () => {
  if (!isMobileView()) {
    const activeCard = document.querySelector(".project-launch-card.is-active");
    if (activeCard instanceof HTMLElement) {
      openDesktopViewer(
        activeCard.dataset.title || "Project Viewer",
        activeCard.dataset.summary || "Live product preview.",
        activeCard.dataset.live || "#"
      );
    } else if (launchCards.length > 0) {
      const firstCard = launchCards[0];
      setActiveCard(firstCard);
      openDesktopViewer(
        firstCard.dataset.title || "Project Viewer",
        firstCard.dataset.summary || "Live product preview.",
        firstCard.dataset.live || "#"
      );
    }
  }
});
