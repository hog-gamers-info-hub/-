let lastHash = null;
let isTransitioning = false;

window.addEventListener("hashchange", router);
window.addEventListener("load", () => {
    if (!window.location.hash) {
        window.location.hash = "#home";
    }
    router();
});

function router() {
    if (isTransitioning) return;

    const newHash = window.location.hash.substring(1) || "home";

    // Initial load – update directly without transition
    if (lastHash === null) {
        updateContent(newHash);
        lastHash = newHash;
        return;
    }

    // Same hash – ignore
    if (lastHash === newHash) return;

    isTransitioning = true;
    performTransition(newHash);
}

function performTransition(newHash) {
    const oldHash = lastHash;
    const oldIsHome = (oldHash === "home");
    const newIsHome = (newHash === "home");

    const homeView = document.getElementById("homeView");
    const pageView = document.getElementById("pageView");
    const footer = document.getElementById("footer");

    if (oldIsHome !== newIsHome) {
        // Switching between home and pageView
        const oldContainer = oldIsHome ? homeView : pageView;
        const newContainer = newIsHome ? homeView : pageView;

        // Fade out old container
        oldContainer.classList.add('fade-out');

        setTimeout(() => {
            // Update content (this will set display: none/block appropriately)
            updateContent(newHash);

            // Ensure old container is hidden and remove fade class
            oldContainer.classList.remove('fade-out');

            // Prepare new container for fade in
            newContainer.style.opacity = 0;
            // Force reflow to apply opacity before adding class
            void newContainer.offsetHeight;
            newContainer.classList.add('fade-in');

            setTimeout(() => {
                newContainer.classList.remove('fade-in');
                newContainer.style.opacity = '';
                isTransitioning = false;
            }, 300); // match CSS transition duration
        }, 300);
    } else {
        // Both are pageView sections
        const oldSection = document.getElementById(oldHash);
        const newSection = document.getElementById(newHash);

        if (oldSection && newSection) {
            oldSection.classList.add('fade-out');

            setTimeout(() => {
                updateContent(newHash);
                oldSection.classList.remove('fade-out');

                newSection.style.opacity = 0;
                void newSection.offsetHeight;
                newSection.classList.add('fade-in');

                setTimeout(() => {
                    newSection.classList.remove('fade-in');
                    newSection.style.opacity = '';
                    isTransitioning = false;
                }, 300);
            }, 300);
        } else {
            // Fallback if sections missing
            updateContent(newHash);
            isTransitioning = false;
        }
    }

    lastHash = newHash;
}

function updateContent(hash) {
    const homeView = document.getElementById("homeView");
    const pageView = document.getElementById("pageView");
    const footer = document.getElementById("footer");
    const title = document.getElementById("pageTitle");
    const homeBtn = document.getElementById("homeBtn");
    const copyBtn = document.getElementById("copyBtn");
    const breadcrumbTop = document.getElementById("breadcrumbTop");

    const allSections = document.querySelectorAll(".section-content");
    allSections.forEach(section => section.classList.remove("active-section"));

    // HOME
    if (hash === "home") {
        homeView.style.display = "block";
        pageView.style.display = "none";
        footer.style.display = "block";
        breadcrumbTop.innerText = "Official Tournament Information Hub";
        copyBtn.style.display = "none";
        return;
    }

    // NON-HOME
    homeView.style.display = "none";
    pageView.style.display = "block";
    footer.style.display = "none";
    copyBtn.style.display = "inline-block";

    const activeSection = document.getElementById(hash);
    if (!activeSection) return;

    activeSection.classList.add("active-section");
    title.innerText = activeSection.dataset.title;

    // Auto breadcrumb
    let breadcrumbPath = [];
    let current = activeSection;

    while (current && current.dataset.parent) {
        breadcrumbPath.unshift(current.dataset.title);
        current = document.getElementById(current.dataset.parent);
    }

    breadcrumbTop.innerText = "Home > " + breadcrumbPath.join(" > ");

    // Show Home button only if not direct child of home
    homeBtn.style.display =
        activeSection.dataset.parent !== "home" ? "inline-block" : "none";
}

// Controlled Back Navigation
document.getElementById("backBtn").onclick = function () {
    const hash = window.location.hash.substring(1);
    if (hash === "home") return;

    const current = document.getElementById(hash);

    if (!current || !current.dataset.parent) {
        window.location.hash = "#home";
        return;
    }

    window.location.hash = "#" + current.dataset.parent;
};

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.getElementById("copyBtn");
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        setTimeout(() => {
            btn.innerText = originalText;
        }, 2000);
    });
}

// ========== INFO ICON POPUP WITH HIGHLIGHT ==========
document.addEventListener("DOMContentLoaded", function() {
    const infoIcons = document.querySelectorAll('.info-icon');

    // Helper to remove 'active' class from all icons
    function deactivateAllIcons() {
        infoIcons.forEach(icon => icon.classList.remove('active'));
    }

    infoIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();      // prevent link navigation
            e.stopPropagation();     // avoid closing conflicts

            // Get or create popup
            let popup = icon.nextElementSibling;
            if (!popup || !popup.classList.contains('popup')) {
                popup = document.createElement('div');
                popup.className = 'popup';
                popup.textContent = icon.dataset.popup;
                icon.insertAdjacentElement('afterend', popup);
            }

            // Check if this popup is already open
            const wasOpen = popup.classList.contains('show');

            // Close all other popups and deactivate their icons
            document.querySelectorAll('.popup.show').forEach(p => {
                p.classList.remove('show');
                const prevIcon = p.previousElementSibling;
                if (prevIcon && prevIcon.classList.contains('info-icon')) {
                    prevIcon.classList.remove('active');
                }
            });

            if (!wasOpen) {
                // Open this popup and highlight its icon
                popup.classList.add('show');
                icon.classList.add('active');
            }
            // If it was open, we've already closed it and removed its active class above
        });
    });

    // Close popups and remove highlights when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.info-icon') && !e.target.closest('.popup')) {
            document.querySelectorAll('.popup.show').forEach(p => {
                p.classList.remove('show');
            });
            deactivateAllIcons();
        }
    });
});
