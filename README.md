# 🌍 Microplastics Earth — Interactive 3D Web Visualization

An interactive, responsive 3D web experience exploring microplastic pollution, ocean currents, and global environmental impact. Built with Three.js, Vanilla JavaScript, and Vite.

---

## ✨ Features

- **Realistic 3D Earth Visualization**: Multi-layered Three.js Earth model featuring day/night textures, clouds, specular maps, atmospheric glow, and smooth camera transitions.
- **Interactive Layers & Heatmaps**: Toggle microplastic density hotspots across global ocean gyres.
- **Timeline & Scenarios**: Explore pollution projections and timelines with synchronized camera and visual effects.
- **Interactive Microscope & Pollution Calculator**: Deep-dive tools to analyze particle types and estimate annual personal impact.
- **Multi-language Support (i18n)**: Russian and English localized interfaces.
- **Responsive & Performant**: Mobile-ready UI with optimized asset loading and canvas render loop.

---

## 🛠️ Tech Stack

- **Three.js** — 3D graphics, shaders, and rendering pipeline
- **Vite** — Fast modern frontend build tool and dev server
- **Vanilla JavaScript (ES Modules)** — Modular architecture without framework overhead
- **HTML5 & Modern CSS3** — Glassmorphism UI, fluid layouts, and keyframe animations

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Deploy to GitHub Pages

To deploy automatically to GitHub Pages using GitHub Actions:

1. In repository settings on GitHub, navigate to **Settings** > **Pages**.
2. Under **Build and deployment**, select **Source: GitHub Actions**.
3. Push to `main` — the workflow will automatically build and publish your site!
