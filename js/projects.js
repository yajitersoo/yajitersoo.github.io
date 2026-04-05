const viewerFrame = document.getElementById("viewerFrame");
const viewerTitle = document.getElementById("viewerTitle");
const viewerSummary = document.getElementById("viewerSummary");
const viewerOpenLink = document.getElementById("viewerOpenLink");
const launchCards = document.querySelectorAll(".project-launch-card");

function getEmbedUrl(url) {
  if (!url) return "";

  // Local image or file
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

  // Power BI / ArcGIS / Kobo and other public pages
  return url;
}

function activateCard(card) {
  const title = card.dataset.title || "Project Viewer";
  const summary = card.dataset.summary || "Live product preview.";
  const live = card.dataset.live || "";
  const embed = getEmbedUrl(live);

  document.querySelectorAll(".project-launch-card").forEach((item) => {
    item.classList.remove("is-active");
  });

  card.classList.add("is-active");

  if (viewerTitle) viewerTitle.textContent = title;
  if (viewerSummary) viewerSummary.textContent = summary;

  if (viewerFrame) {
    viewerFrame.src = embed || "";
  }

  if (viewerOpenLink) {
    viewerOpenLink.href = live || "#";
  }

  const viewerSection = document.getElementById("live-viewer");
  if (viewerSection) {
    viewerSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

launchCards.forEach((card) => {
  card.addEventListener("click", () => activateCard(card));
});

// Load the first card by default
if (launchCards.length > 0) {
  activateCard(launchCards[0]);
}
