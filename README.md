# 🎨 BuildMyBio

[![Live Demo](https://img.shields.io/badge/Live%20Demo-buildmybio.vercel.app-c2703e?style=for-the-badge)](https://buildmybio.vercel.app)

BuildMyBio is a modern Next.js application that generates an animated, self-updating terminal SVG (Neofetch-style) for your GitHub Profile README. Try it live at [buildmybio.vercel.app](https://buildmybio.vercel.app) or host it yourself! It infers your developer persona, extracts top projects, and crafts beautifully animated statistics—all without needing a database.

## ✨ Features

- **Neofetch Style:** Generate a sleek terminal-style SVG directly from your GitHub username.
- **Smart Inference:** Automatically infers your role (e.g., Frontend Developer, AI/ML Engineer), mood, and a personalized tagline based on your GitHub activity and bio.
- **Advanced Integrations:** Include your lifetime commits, pull requests, issues, streak data, and top language distributions.
- **Customizable:** Tweak your identity, categories, and top projects in real-time with an interactive UI.
- **Ready to Use:** One-click download provides you with a ZIP file containing the SVG and a ready-to-paste `README.md`.
- **Private Commit Support:** Securely fetch your private contributions using a GitHub Personal Access Token (PAT).

## 🚀 Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS V4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Typography:** Custom ASCII fonts via `figlet`

## 🛠️ Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

## 🔐 Advanced Stats Setup (Optional)

If you enable the **Generate Advanced Stats SVG** and want to include **Private Commits**, you'll need to set up a GitHub PAT (Personal Access Token) inside your profile repository's GitHub Actions.

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens?type=beta) and generate a new token (Classic).
2. Check the `read:user` and `repo` scopes.
3. In your GitHub profile repository (e.g., `yourusername/yourusername`), go to **Settings** → **Secrets and variables** → **Actions**.
4. Add a **New repository secret** named `GH_PAT` and paste your token.

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a pull request if you'd like to improve the project.

## 📄 License

This project is open-source and available for everyone to use and modify.