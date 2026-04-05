const modalFinal = document.getElementById("projectViewerModalFinal");
const modalFrameFinal = document.getElementById("modalProjectFrameFinal");
const modalImageFinal = document.getElementById("modalProjectImageFinal");
const modalTitleFinal = document.getElementById("modalProjectTitleFinal");
const modalSummaryFinal = document.getElementById("modalProjectSummaryFinal");
const modalOpenLinkFinal = document.getElementById("modalProjectOpenLinkFinal");
const modalCloseBtnFinal = document.getElementById("modalCloseBtnFinal");

const launchCardsFinal = document.querySelectorAll(".project-launch-card-final");
const rowButtonsFinal = document.querySelectorAll(".projects-row-btn-final");

function isImageUrlFinal(url) {
  if (!url) return false;
  return (
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".webp") ||
    url.endsWith(".gif")
  );
}

function getEmbedUrlFinal(url) {
  if (!url) return "";

  if (isImageUrlFinal(url) || url.endsWith(".pdf")) {
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

function clearViewerFinal() {
  modalFrameFinal.classList.remove("is-visible");
  modalImageFinal.classList.remove("is-visible");
  modalFrameFinal.src = "";
  modalImageFinal.src = "";
}

function openModalViewerFinal(card) {
  const title = card.dataset.title || "Project Viewer";
  const summary = card.dataset.summary || "Live product preview.";
  const live = card.dataset.live || "#";
  const embed = getEmbedUrlFinal(live);

  document.querySelectorAll(".project-launch-card-final").forEach((item) => {
    item.classList.remove("is-active");
  });
  card.classList.add("is-active");

  modalTitleFinal.textContent = title;
  modalSummaryFinal.textContent = summary;
  modalOpenLinkFinal.href = live;

  clearViewerFinal();

  if (isImageUrlFinal(embed)) {
    modalImageFinal.src = embed;
    modalImageFinal.classList.add("is-visible");
  } else {
    modalFrameFinal.src = embed;
    modalFrameFinal.classList.add("is-visible");
  }

  modalFinal.classList.add("is-open");
  modalFinal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModalViewerFinal() {
  modalFinal.classList.remove("is-open");
  modalFinal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearViewerFinal();
}

launchCardsFinal.forEach((card) => {
  card.addEventListener("click", () => openModalViewerFinal(card));
});

modalCloseBtnFinal.addEventListener("click", closeModalViewerFinal);

modalFinal.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
    closeModalViewerFinal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModalViewerFinal();
  }
});

rowButtonsFinal.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.target;
    const direction = button.dataset.direction;
    const track = document.getElementById(targetId);

    if (!track) return;

    const viewport = track.parentElement;
    const scrollAmount = viewport.clientWidth;

    track.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth"
    });
  });
});
