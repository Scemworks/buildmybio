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

## 🚀 Deploying to Your GitHub Profile

Once you have generated and downloaded your zip file from BuildMyBio, follow these steps to add it to your profile.

### Step 1: Create a "Special" Repository
You need to create a repository with the exact same name as your GitHub username.

<table>
  <tr>
    <td width="800">
      <h2>Create a new repository</h2>
      <p>A repository contains all project files, including the revision history.</p>
      <hr>
      <p>Owner * &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Repository name *</p>
      <p><kbd>your-username</kbd> / <kbd><b>your-username</b></kbd> <span>✔️</span></p>
      <p>🟢 <i>You found a secret! your-username/your-username is a ✨special✨ repository that you can use to add a README.md to your GitHub profile. Make sure it's public and initialize it with a README to get started.</i></p>
      <hr>
      <p>◉ <b>Public</b><br>
      <span style="color: gray; font-size: 12px;">Anyone on the internet can see this repository. You choose who can commit.</span></p>
      <p>◯ <b>Private</b><br>
      <span style="color: gray; font-size: 12px;">You choose who can see and commit to this repository.</span></p>
      <hr>
      <p>☑️ <b>Add a README file</b><br>
      <span style="color: gray; font-size: 12px;">This is where you can write a long description for your project.</span></p>
      <br>
      <kbd>&nbsp;Create repository&nbsp;</kbd>
    </td>
  </tr>
</table>

### Step 2: Upload Your BuildMyBio Files
Extract the ZIP file you downloaded from BuildMyBio. Then, upload those files directly to your new repository.

<table>
  <tr>
    <td width="800">
      <h3>your-username / your-username</h3>
      <hr>
      <p><span>Code ▾</span> &nbsp;&nbsp;&nbsp;&nbsp; <kbd>Add file ▾</kbd> → <b>Upload files</b></p>
      <br>
      <div align="center" style="border: 1px dashed gray; padding: 20px;">
        <h2>📁</h2>
        <p><b>Drag files here to add them to your repository</b></p>
        <p>Or <kbd>choose your files</kbd></p>
      </div>
      <br>
      <p><i>(Upload all contents from the extracted ZIP: <code>neofetch.svg</code>, <code>README.md</code>, scripts, and the <code>.github</code> folder if available.)</i></p>
      <hr>
      <h4>Commit changes</h4>
      <p><kbd>Add BuildMyBio profile SVG 🚀</kbd></p>
      <br>
      <kbd style="background-color: #2ea44f; color: white;">&nbsp;Commit changes&nbsp;</kbd>
    </td>
  </tr>
</table>

**Note:** If you generated the **Advanced Stats SVG**, the uploaded `.github/workflows` folder will automatically trigger a GitHub Action every night at midnight to update your stats!

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