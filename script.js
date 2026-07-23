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
// Project Case Studies
// =========================

const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalGithub = document.getElementById("modalGithub");
const modalMedia = document.getElementById("modalMedia");
const modalRole = document.getElementById("modalRole");
const modalTimeline = document.getElementById("modalTimeline");
const modalTools = document.getElementById("modalTools");
const modalHighlights = document.getElementById("modalHighlights");
const modalChallenge = document.getElementById("modalChallenge");
const closeModalButton = document.querySelector(".close-modal");
const grid = document.getElementById("projectGrid");

let loadedProjects = [];
let lastFocusedElement = null;

grid.addEventListener("click", event => {
    const card = event.target.closest(".project-card");
    if (!card) return;

    openProjectModal(loadedProjects[Number(card.dataset.projectIndex)], card);
});

grid.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const card = event.target.closest(".project-card");
    if (!card) return;

    event.preventDefault();
    openProjectModal(loadedProjects[Number(card.dataset.projectIndex)], card);
});

function createMediaPlaceholder(projectTitle) {
    const placeholder = document.createElement("div");
    placeholder.className = "media-placeholder";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-film";
    icon.setAttribute("aria-hidden", "true");

    const title = document.createElement("strong");
    title.textContent = "Gameplay GIF coming soon";

    const hint = document.createElement("span");
    hint.textContent =
        `Add a GIF path to ${projectTitle} in projects.json when it is ready.`;

    placeholder.append(icon, title, hint);
    return placeholder;
}

function openProjectModal(project, trigger) {
    if (!project) return;

    lastFocusedElement = trigger;
    modalTitle.textContent = project.title || "";
    modalDescription.textContent = project.description || "";
    modalRole.textContent = project.role || "Solo Developer";
    modalTimeline.textContent = project.timeline || "Add development time";
    modalTools.textContent = project.tools || (project.tags || []).join(", ");
    modalChallenge.textContent =
        project.challenge ||
        "Add the hardest technical challenge and how you solved it.";

    modalHighlights.replaceChildren();

    (project.highlights || []).forEach(highlight => {
        const item = document.createElement("li");
        item.textContent = highlight;
        modalHighlights.append(item);
    });

    modalMedia.replaceChildren();

    if (project.gif) {
        const demo = document.createElement("img");
        demo.src = project.gif;
        demo.alt = `${project.title} gameplay demonstration`;
        demo.addEventListener("error", () => {
            modalMedia.replaceChildren(createMediaPlaceholder(project.title));
        });
        modalMedia.append(demo);
    } else {
        modalMedia.append(createMediaPlaceholder(project.title));
    }

    if (project.github && project.github !== "#") {
        modalGithub.href = project.github;
        modalGithub.style.display = "inline-flex";
    } else {
        modalGithub.removeAttribute("href");
        modalGithub.style.display = "none";
    }

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeModalButton.focus();
}

closeModalButton.addEventListener("click", closeModal);

window.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

window.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.style.display === "flex") {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "auto";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}


// =========================
// Mobile Menu
// =========================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

navLinks.addEventListener("click", event => {
    if (event.target.matches("a")) {
        navLinks.classList.remove("active");
    }
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
// Load Projects
// =========================

async function loadProjects() {
    try {
        const response = await fetch("projects.json");

        if (!response.ok) {
            throw new Error("Project data request failed");
        }

        loadedProjects = await response.json();
        grid.replaceChildren();

        loadedProjects.forEach((project, index) => {
            const card = document.createElement("article");
            card.className = "project-card";
            card.dataset.projectIndex = index;
            card.tabIndex = 0;
            card.setAttribute("role", "button");
            card.setAttribute(
                "aria-label",
                `View ${project.title} project case study`
            );

            const image = document.createElement("img");
            image.src = project.image || "";
            image.alt = `${project.title || "Project"} preview`;

            const content = document.createElement("div");
            content.className = "project-content";

            const role = document.createElement("span");
            role.className = "project-role";
            role.textContent = project.role || "Solo Developer";

            const title = document.createElement("h3");
            title.textContent = project.title || "";

            const description = document.createElement("p");
            description.textContent = project.description || "";

            const tags = document.createElement("div");
            tags.className = "project-tags";

            (project.tags || []).forEach(tag => {
                const tagElement = document.createElement("span");
                tagElement.textContent = tag;
                tags.append(tagElement);
            });

            const prompt = document.createElement("span");
            prompt.className = "project-prompt";
            prompt.textContent = "View case study \u2192";

            content.append(role, title, description, tags, prompt);
            card.append(image, content);
            grid.append(card);
        });
    } catch (error) {
        console.error("Unable to load projects:", error);
        grid.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.className = "project-error";
        errorMessage.textContent = "Projects are temporarily unavailable.";
        grid.append(errorMessage);
    }
}

loadProjects();


// =========================
// Contribution History
// =========================

const contributionSummary = document.getElementById("contributionSummary");
const contributionYears = document.getElementById("contributionYears");
const contributionStatus = document.getElementById("contributionStatus");
const contributionChart = document.getElementById("contributionChart");
const contributionMonths = document.getElementById("contributionMonths");
const contributionCalendar = document.getElementById(
    "contributionCalendar"
);

const contributionLevels = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4
};

function formatContributionDate(date) {
    return new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric"
    }).format(new Date(`${date}T00:00:00Z`));
}

function renderContributionYear(yearData) {
    const weekCount = yearData.weeks.length;

    contributionSummary.textContent =
        `${yearData.totalContributions.toLocaleString()} contributions ` +
        `in ${yearData.year}`;

    contributionCalendar.replaceChildren();
    contributionMonths.replaceChildren();
    contributionCalendar.style.setProperty("--week-count", weekCount);
    contributionMonths.style.setProperty("--week-count", weekCount);
    contributionCalendar.setAttribute(
        "aria-label",
        `${yearData.totalContributions.toLocaleString()} GitHub ` +
        `contributions in ${yearData.year}`
    );

    const monthStarts = yearData.months.map(month => {
        const start = yearData.weeks.findIndex(week =>
            week.contributionDays.some(day => day.date >= month.firstDay)
        );

        return {
            ...month,
            start: Math.max(0, start)
        };
    });

    monthStarts.forEach((month, index) => {
        const nextStart =
            monthStarts[index + 1]?.start ?? weekCount;
        const span = Math.max(1, nextStart - month.start);
        const label = document.createElement("span");

        label.textContent = month.name.slice(0, 3);
        label.style.gridColumn = `${month.start + 1} / span ${span}`;
        contributionMonths.append(label);
    });

    yearData.weeks.forEach((week, weekIndex) => {
        for (let weekday = 0; weekday < 7; weekday += 1) {
            const day = week.contributionDays.find(
                contributionDay => contributionDay.weekday === weekday
            );
            const cell = document.createElement("span");

            cell.className = "contribution-day";
            cell.style.gridColumn = weekIndex + 1;
            cell.style.gridRow = weekday + 1;

            if (!day) {
                cell.classList.add("is-empty");
                cell.setAttribute("aria-hidden", "true");
            } else {
                const countLabel =
                    `${day.contributionCount} ` +
                    `${day.contributionCount === 1
                        ? "contribution"
                        : "contributions"}`;
                const accessibleLabel =
                    `${countLabel} on ${formatContributionDate(day.date)}`;

                cell.dataset.level =
                    contributionLevels[day.contributionLevel] ?? 0;
                cell.title = accessibleLabel;
            }

            contributionCalendar.append(cell);
        }
    });

    contributionYears.querySelectorAll("button").forEach(button => {
        const isSelected = Number(button.dataset.year) === yearData.year;
        button.classList.toggle("active", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
    });
}

async function loadContributionHistory() {
    try {
        const response = await fetch("contributions.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Contribution data request failed");
        }

        const data = await response.json();
        const years = [...(data.years || [])].sort(
            (first, second) => second.year - first.year
        );

        if (years.length === 0) {
            throw new Error("No contribution years were found");
        }

        contributionYears.replaceChildren();

        years.forEach(yearData => {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.year = yearData.year;
            button.textContent = yearData.year;
            button.setAttribute("aria-pressed", "false");
            button.addEventListener("click", () => {
                renderContributionYear(yearData);
            });
            contributionYears.append(button);
        });

        contributionStatus.hidden = true;
        contributionChart.hidden = false;
        renderContributionYear(years[0]);
    } catch (error) {
        console.error("Unable to load contribution history:", error);
        contributionSummary.textContent =
            "Contribution history is available on GitHub.";
        contributionStatus.replaceChildren();

        const fallback = document.createElement("a");
        fallback.href = `https://github.com/${GITHUB_USERNAME}`;
        fallback.target = "_blank";
        fallback.rel = "noopener noreferrer";
        fallback.textContent = "View the contribution calendar on GitHub";
        contributionStatus.append(fallback);
    }
}


// =========================
// GitHub Activity
// =========================

const GITHUB_USERNAME = "hoanganhpeas";

loadContributionHistory();

async function loadGitHubActivity() {
    const reposList = document.getElementById("githubReposList");

    try {
        const [profileResponse, reposResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
            fetch(
                `https://api.github.com/users/${GITHUB_USERNAME}/repos` +
                "?type=owner&sort=pushed&per_page=100"
            )
        ]);

        if (!profileResponse.ok || !reposResponse.ok) {
            throw new Error("GitHub request failed");
        }

        const profile = await profileResponse.json();
        const repositories = await reposResponse.json();
        const ownedRepositories = repositories.filter(repo => !repo.fork);
        const totalStars = ownedRepositories.reduce(
            (total, repo) => total + repo.stargazers_count,
            0
        );

        document.getElementById("githubRepos").textContent =
            profile.public_repos;
        document.getElementById("githubFollowers").textContent =
            profile.followers;
        document.getElementById("githubStars").textContent =
            totalStars;

        reposList.replaceChildren();

        if (ownedRepositories.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.className = "github-status";
            emptyMessage.textContent = "No public repositories found.";
            reposList.append(emptyMessage);
            return;
        }

        ownedRepositories.slice(0, 4).forEach(repo => {
            const card = document.createElement("a");
            card.className = "github-repo";
            card.href = repo.html_url;
            card.target = "_blank";
            card.rel = "noopener noreferrer";

            const title = document.createElement("h3");
            title.textContent = repo.name;

            const description = document.createElement("p");
            description.textContent =
                repo.description || "No description available.";

            const details = document.createElement("div");
            details.className = "github-repo-details";

            const language = document.createElement("span");
            language.textContent = repo.language || "Other";

            const stars = document.createElement("span");
            stars.textContent = `\u2605 ${repo.stargazers_count}`;

            details.append(language, stars);
            card.append(title, description, details);
            reposList.append(card);
        });
    } catch (error) {
        console.error("Unable to load GitHub activity:", error);
        reposList.replaceChildren();

        const errorMessage = document.createElement("p");
        errorMessage.className = "github-status";
        errorMessage.textContent =
            "GitHub activity is temporarily unavailable.";
        reposList.append(errorMessage);
    }
}

loadGitHubActivity();
