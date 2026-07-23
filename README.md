# Portfolio Website

Personal portfolio website showcasing my projects, skills, and experience as an aspiring Unity Developer.

## Live Demo

[Demo](https://peasinteractive.io.vn/)

## Features

- Responsive design
- Project showcase
- Expandable solo project case studies
- GIF-ready project media placeholders
- Technical highlights
- Live GitHub activity
- Skills section
- Contact information
- Project modal system

## Replacing Portfolio Placeholders

### Project GIFs

1. Add each GIF to the `assets` folder.
2. Open `projects.json`.
3. Replace the empty `gif` value with the file path:

```json
"gif": "assets/DeliveryS.gif"
```

Update the `timeline` and `challenge` fields in the same file with the
real development duration and technical case-study notes.

### Resume

1. Add the PDF as `assets/Hoang-Anh-Peas-Resume.pdf`.
2. In `index.html`, replace the disabled résumé placeholder with:

```html
<a href="assets/Hoang-Anh-Peas-Resume.pdf"
   class="btn-outline"
   download>
    Download Résumé
</a>
```

## GitHub Contribution History

The contribution calendar is generated securely during deployment by
`.github/workflows/deploy-pages.yml`. The workflow:

1. Fetches every available contribution year from GitHub's GraphQL API.
2. Generates `contributions.json` inside the deployment artifact.
3. Deploys the refreshed static site to GitHub Pages.
4. Runs after every push to `main`, once per day, or manually.

After pushing the workflow, open the repository on GitHub and go to:

`Settings` → `Pages` → `Build and deployment` → `Source` → `GitHub Actions`

Public contribution history works with GitHub's automatic workflow token.
To include authorized private contribution counts, create a repository secret
named `CONTRIBUTIONS_TOKEN` containing a token with the required user-read
permission. Never put this token in `script.js` or any other public file.

## Technologies

- HTML5
- CSS3
- JavaScript

## Projects Included

### DeliveryS
Delivery-focused simulation project featuring:
- Player movement
- Day/Night cycle
- Spawn systems
- Game settings

### Personal Backend
Backend API powered by:
- Node.js
- PostgreSQL
- Docker

## Installation

Clone the repository:

```bash
git clone https://github.com/hoanganhpeas/portfolio-website.git
