# Aafrin Shaikh - Personal Portfolio Website

A personal portfolio website for **Aafrin Shaikh**, Third-Year Computer Engineering student at Ajeenkya DY Patil School of Engineering and aspiring Frontend Developer.

Built with **HTML5, CSS3, and Vanilla JavaScript** using a clean three-file architecture, modern design system tokens, electric blue and purple gradient theme, and full accessibility support.

---

## 🌟 Key Features

- **Design System**: Deep navy background (`#050d1a`), electric blue (`#2563eb`) & vibrant purple (`#8b5cf6`) accents, soft glassmorphism, and responsive typography using *Plus Jakarta Sans* and *Inter*.
- **Dark & Light Mode**: Theme toggle with automatic detection of system preferences and persistent `localStorage` synchronization.
- **Dynamic Typewriter**: Hero section animation cycling through student and developer roles.
- **Authentic Showcase**:
  - **About Me**: Student journey and core motivation.
  - **Education**: B.E. Computer Engineering (2024–2028) & Higher Secondary (12th Science).
  - **Skills & Tools**: Programming Languages, Frontend, Tools, Core Concepts, and Interests.
  - **Featured Projects**:
    1. *ScamShield AI* (Python, Machine Learning)
    2. *ScholarTechies* (HTML5, CSS3, JavaScript, Firebase)
    3. *Drishti AI* (Python, OpenCV)
  - **Certifications & Training**: Verified JPMorgan Chase & Lloyds Banking Group job simulations, ICAT, and courses.
  - **Interactive Project Modals**: Complete architectural descriptions, features, and specs without external dependencies.
  - **Resume Download**: Direct one-click download of the verified `AafrinResume.pdf` document.
  - **Accessible Contact Form**: Real-time validation, accessible feedback, honeypot spam protection, and mailto fallback.

---

## 📁 Project Architecture

```
Portfolio/
├── index.html                  # Semantic, SEO-optimized HTML5 structure
├── style.css                   # Custom Vanilla CSS3 design system & animations
├── script.js                   # Modular Vanilla JavaScript application logic
├── vercel.json                 # Production deployment & security headers config
├── README.md                   # Repository documentation
└── assets/
    ├── icons/
    │   └── favicon.svg         # Modern vector AS monogram favicon
    ├── images/
    │   ├── myphoto.jpg         # Professional portrait photograph
    │   ├── project-scamshield.svg      # ScamShield AI vector illustration
    │   ├── project-scholartechies.svg  # ScholarTechies platform illustration
    │   └── project-drishti.svg         # Drishti AI computer vision illustration
    └── resume/
        └── AafrinResume.pdf    # Official two-page curriculum vitae
```

---

## 🚀 Running Locally

You can preview the website locally using any standard static server:

### Option A: Using Python (Built-in)
```bash
# In the project root directory:
python -m http.server 3000
```
Open your browser at `http://localhost:3000`.

### Option B: Using Node.js (npx)
```bash
npx serve .
```

### Option C: VS Code Live Server
Right-click `index.html` in VS Code and select **"Open with Live Server"**.

---

## 🌐 Deployment Instructions

### 1. Deploying to GitHub Pages
1. Initialize a git repository and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Aafrin Shaikh portfolio"
   ```
2. Create a repository on GitHub (e.g. `aafrinshaikh.github.io` or `portfolio`).
3. Push your repository:
   ```bash
   git remote add origin https://github.com/aafrinshaikh196666-maker/portfolio.git
   git branch -M main
   git push -u origin main
   ```
4. Navigate to your repository on GitHub:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
   - Your site will be live at `https://aafrinshaikh196666-maker.github.io/portfolio/`.

### 2. Deploying to Vercel
1. Install the Vercel CLI or link directly via GitHub:
   ```bash
   npm i -g vercel
   vercel
   ```
2. Accept the default settings. Vercel will automatically read `vercel.json` and serve the static files with pre-configured caching and security headers.

---

## 📬 Contact & Socials

- **Email**: [aafrinshaikh1966@gmail.com](mailto:aafrinshaikh1966@gmail.com)
- **LinkedIn**: [linkedin.com/in/aafrin-shaikh-96bb1b325](https://www.linkedin.com/in/aafrin-shaikh-96bb1b325/)
- **GitHub**: [github.com/aafrinshaikh196666-maker](https://github.com/aafrinshaikh196666-maker)
