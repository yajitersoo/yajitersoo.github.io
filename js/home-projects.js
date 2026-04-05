const homeModalFinal = document.getElementById("homeProjectViewerModalFinal");
const homeModalFrameFinal = document.getElementById("homeModalProjectFrameFinal");
const homeModalImageFinal = document.getElementById("homeModalProjectImageFinal");
const homeModalTitleFinal = document.getElementById("homeModalProjectTitleFinal");
const homeModalSummaryFinal = document.getElementById("homeModalProjectSummaryFinal");
const homeModalOpenLinkFinal = document.getElementById("homeModalProjectOpenLinkFinal");
const homeModalCloseBtnFinal = document.getElementById("homeModalCloseBtnFinal");

const homeLaunchCardsFinal = document.querySelectorAll(".home-project-launch-card-final");
const homeRowButtonsFinal = document.querySelectorAll(".home-projects-row-btn-final");

function isImageUrlHomeFinal(url) {
  if (!url) return false;
  return (
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".webp") ||
    url.endsWith(".gif")
  );
}

function getEmbedUrlHomeFinal(url) {
  if (!url) return "";

  if (isImageUrlHomeFinal(url) || url.endsWith(".pdf")) {
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

function clearHomeViewerFinal() {
  if (!homeModalFrameFinal || !homeModalImageFinal) return;

  homeModalFrameFinal.classList.remove("is-visible");
  homeModalImageFinal.classList.remove("is-visible");
  homeModalFrameFinal.src = "";
  homeModalImageFinal.src = "";
}

function openHomeModalViewerFinal(card) {
  if (
    !homeModalFinal ||
    !homeModalTitleFinal ||
    !homeModalSummaryFinal ||
    !homeModalOpenLinkFinal ||
    !homeModalFrameFinal ||
    !homeModalImageFinal
  ) {
    return;
  }

  const title = card.dataset.title || "Project Viewer";
  const summary = card.dataset.summary || "Live product preview.";
  const live = card.dataset.live || "#";
  const embed = getEmbedUrlHomeFinal(live);

  document.querySelectorAll(".home-project-launch-card-final").forEach((item) => {
    item.classList.remove("is-active");
  });

  card.classList.add("is-active");

  homeModalTitleFinal.textContent = title;
  homeModalSummaryFinal.textContent = summary;
  homeModalOpenLinkFinal.href = live;

  clearHomeViewerFinal();

  if (isImageUrlHomeFinal(embed)) {
    homeModalImageFinal.src = embed;
    homeModalImageFinal.classList.add("is-visible");
  } else {
    homeModalFrameFinal.src = embed;
    homeModalFrameFinal.classList.add("is-visible");
  }

  homeModalFinal.classList.add("is-open");
  homeModalFinal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeHomeModalViewerFinal() {
  if (!homeModalFinal) return;

  homeModalFinal.classList.remove("is-open");
  homeModalFinal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  clearHomeViewerFinal();
}

if (homeLaunchCardsFinal.length) {
  homeLaunchCardsFinal.forEach((card) => {
    card.addEventListener("click", () => openHomeModalViewerFinal(card));
  });
}

if (homeModalCloseBtnFinal) {
  homeModalCloseBtnFinal.addEventListener("click", closeHomeModalViewerFinal);
}

if (homeModalFinal) {
  homeModalFinal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.closeModal === "true") {
      closeHomeModalViewerFinal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && homeModalFinal && homeModalFinal.classList.contains("is-open")) {
    closeHomeModalViewerFinal();
  }
});

if (homeRowButtonsFinal.length) {
  homeRowButtonsFinal.forEach((button) => {
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
}
