const projectsViewport = document.getElementById("projectsViewport");
const projectsPrev = document.getElementById("projectsPrev");
const projectsNext = document.getElementById("projectsNext");

if (projectsViewport && projectsPrev && projectsNext) {
  const scrollAmount = 380;

  projectsPrev.addEventListener("click", () => {
    projectsViewport.scrollBy({
      left: -scrollAmount,
      behavior: "smooth"
    });
  });

  projectsNext.addEventListener("click", () => {
    projectsViewport.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  });
}
