// =========================
// Scroll Reveal Animation
// =========================

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    {
        threshold: 0.15
    }
);

document.querySelectorAll("section").forEach(section => {
    section.classList.add("hidden");
    observer.observe(section);
});


// =========================
// Project Modal
// =========================

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalGithub = document.getElementById("modalGithub");

// 🔥 FIX: event delegation (QUAN TRỌNG)
const grid = document.getElementById("projectGrid");

grid.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (!card) return;

    modalTitle.textContent = card.dataset.title || "";
    modalDescription.textContent = card.dataset.description || "";

    const githubLink = card.dataset.github;

    if (githubLink) {
        modalGithub.href = githubLink;
        modalGithub.style.display = "inline-block";
    } else {
        modalGithub.style.display = "none";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
});


// Close modal
document.querySelector(".close-modal").addEventListener("click", closeModal);

window.addEventListener("click", e => {
    if (e.target === modal) {
        closeModal();
    }
});

window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}


// =========================
// Mobile Menu
// =========================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


// =========================
// Theme Toggle
// =========================

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light") ? "light" : "dark"
    );
});

if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
}


// =========================
// Load Projects (FIXED SAFE VERSION)
// =========================

async function loadProjects() {
    const response = await fetch("projects.json");
    const projects = await response.json();

    const grid = document.getElementById("projectGrid");

    // clear trước để tránh duplicate
    grid.innerHTML = "";

    projects.forEach(project => {

        const tags = (project.tags || [])
            .map(tag => `<span>${tag}</span>`)
            .join("");

        grid.innerHTML += `
            <div class="project-card"
                 data-title="${project.title || ""}"
                 data-description="${project.description || ""}"
                 data-github="${project.github || ""}">

                <img src="${project.image || ""}" alt="${project.title || ""}">

                <div class="project-content">

                    <h3>${project.title || ""}</h3>

                    <p>${project.description || ""}</p>

                    <div class="project-tags">
                        ${tags}
                    </div>

                </div>

            </div>
        `;
    });
}

loadProjects();