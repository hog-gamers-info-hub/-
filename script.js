window.addEventListener("hashchange", router);
window.addEventListener("load", () => {
    if (!window.location.hash) {
        window.location.hash = "#home";
    }
    router();
});

function router() {

    const hash = window.location.hash.substring(1);

    const homeView = document.getElementById("homeView");
    const pageView = document.getElementById("pageView");
    const footer = document.getElementById("footer");
    const title = document.getElementById("pageTitle");
    const homeBtn = document.getElementById("homeBtn");

    const allSections = document.querySelectorAll(".section-content");
    allSections.forEach(section => section.classList.remove("active-section"));

    // ================= HOME =================
    if (hash === "home") {
        homeView.style.display = "block";
        pageView.style.display = "none";
        footer.style.display = "block";
        return;
    }

    // ================= NON-HOME =================
    homeView.style.display = "none";
    pageView.style.display = "block";
    footer.style.display = "none";

    const activeSection = document.getElementById(hash);

    if (activeSection) {
        activeSection.classList.add("active-section");
        title.innerText = formatTitle(hash);
    }

    // Show Home button only on Level-3 (if hash contains "-")
    if (hash.includes("-")) {
        homeBtn.style.display = "inline-block";
    } else {
        homeBtn.style.display = "none";
    }
}

function formatTitle(text) {
    return text
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}