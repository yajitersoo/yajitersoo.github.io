const projectsViewport = document.getElementById("projectsViewport");
const projectsPrev = document.getElementById("projectsPrev");
const projectsNext = document.getElementById("projectsNext");

if (projectsViewport && projectsPrev && projectsNext) {
  const getScrollAmount = () => {
    return Math.min(projectsViewport.clientWidth * 0.9, 380);
  };

  projectsPrev.addEventListener("click", () => {
    projectsViewport.scrollBy({
      left: -getScrollAmount(),
      behavior: "smooth"
    });
  });

  projectsNext.addEventListener("click", () => {
    projectsViewport.scrollBy({
      left: getScrollAmount(),
      behavior: "smooth"
    });
  });
}
