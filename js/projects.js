const modal = document.getElementById("projectViewerModal");
const modalFrame = document.getElementById("modalProjectFrame");
const modalImage = document.getElementById("modalProjectImage");
const modalTitle = document.getElementById("modalProjectTitle");
const modalSummary = document.getElementById("modalProjectSummary");
const modalOpenLink = document.getElementById("modalProjectOpenLink");
const modalCloseBtn = document.getElementById("modalCloseBtn");

const launchCards = document.querySelectorAll(".project-launch-card");

function isImageUrl(url) {
  if (!url) return false;
  return (
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".webp") ||
    url.endsWith(".gif")
  );
}

function getEmbedUrl(url) {
  if (!url) return "";

  if (isImageUrl(url) || url.endsWith(".pdf")) {
    return url;
  }

  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/file\/d\/([^/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  if (url.includes("docs.google.com/presentation/d/")) {
    return url.replace(/\/edit.*$/, "/preview");
  }

  if (url.includes("docs.google.com/document/d/")) {
    return url.replace(/\/edit.*$/, "/preview");
  }

  if (url.includes("youtube.com/watch?v=")) {
    const videoId = new URL(url).searchParams.get("v");
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts[1]) {
      const id = parts[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
  }

  return url;
}

function clearViewer() {
  modalFrame.classList.remove("is-visible");
  modalImage.classList.remove("is-visible");
  modalFrame.src = "";
  modalImage.src = "";
}

function openModalViewer(card) {
  const title = card.dataset.title || "Project Viewer";
  const summary = card.dataset.summary || "Live product preview.";
  const live = card.dataset.live || "#";
  const embed = getEmbedUrl(live);

  document.querySelectorAll(".project-launch-card").forEach((item) => {
    item.classList.remove("is-active");
  });
  card.classList.add("is-active");

  modalTitle.textContent = title;
  modalSummary.textContent = summary;
  modalOpenLink.href = live;

  clearViewer();

  if (isImageUrl(embed)) {
    modalImage.src = embed;
    modalImage.classList.add("is-visible");
  } else {
    modalFrame.src = embed;
    modalFrame.classList.add("is-visible");
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModalViewer() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearViewer();
}

launchCards.forEach((card) => {
  card.addEventListener("click", () => openModalViewer(card));
});

modalCloseBtn.addEventListener("click", closeModalViewer);

modal.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
    closeModalViewer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModalViewer();
  }
});
