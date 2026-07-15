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

## 📖 How to Deploy to Your GitHub Profile

Once you have customized your profile and downloaded the `github-profile-stats.zip` file, follow these steps to make it live on your GitHub profile:

### Step 1: Create a Special Repository

Create a new repository with a name that **exactly matches your GitHub username**. GitHub will recognize this as your special profile repository. Make sure to set it to **Public** and check **Add a README file**.

<div align="center">
  <table width="100%">
    <tr>
      <td bgcolor="#f6f8fa" style="padding: 16px;">
        <h3 style="margin: 0; font-family: sans-serif;">Create a new repository</h3>
        <p style="margin: 0; color: #57606a; font-family: sans-serif;">A repository contains all project files, including the revision history.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px; border: 1px solid #d0d7de; font-family: sans-serif;">
        <span style="color: #57606a;">Owner</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span style="color: #57606a;">Repository name</span><br/>
        <code style="font-size: 16px;">your-username</code> / <code style="font-size: 16px;"><b>your-username</b></code> ✅<br/><br/>
        <div style="background-color: #ddf4ff; color: #0969da; padding: 12px; border: 1px solid #54aeff; border-radius: 6px;">
          🐱 <b>You found a secret!</b> <code>your-username/your-username</code> is a ✨special✨ repository that you can use to add a <code>README.md</code> to your GitHub profile. Make sure it's public and initialize it with a README to get started.
        </div>
        <br/>
        🔘 <b>Public</b><br/>
        <small style="color: #57606a;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Anyone on the internet can see this repository.</small><br/><br/>
        ☑️ <b>Add a README file</b><br/>
        <small style="color: #57606a;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is where you can write a long description for your project.</small><br/><br/>
        <img src="https://img.shields.io/badge/Create_repository-2da44e?style=for-the-badge&logo=github&logoColor=white" alt="Create Repository" />
      </td>
    </tr>
  </table>
</div>
<br/>

### Step 2: Extract & Upload Files

Extract the `github-profile-stats.zip` file you downloaded from BuildMyBio. 
Go to your new repository on GitHub, click on **Add file** -> **Upload files**, and drag all the extracted files into the dropzone.

<div align="center">
  <table width="100%">
    <tr>
      <td bgcolor="#f6f8fa" style="padding: 16px;">
        <h3 style="margin: 0; font-family: sans-serif;"><span style="color: #0969da;">your-username</span> / <span style="color: #0969da;"><b>your-username</b></span></h3>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 48px; border: 2px dashed #d0d7de; border-radius: 6px; font-family: sans-serif; background-color: #f6f8fa;">
        <br/>
        <h1 style="margin: 0;">📁</h1>
        <h3 style="color: #24292f; margin-bottom: 4px;">Drag files here to add them to your repository</h3>
        <p style="color: #0969da; margin-top: 0;">Or choose your files</p>
        <p style="color: #57606a; font-size: 13px;"><i>(Drag <b>neofetch.svg</b>, <b>update_stats.py</b>, <b>README.md</b>, etc. here)</i></p>
        <br/>
      </td>
    </tr>
  </table>
</div>
<br/>

### Step 3: Commit the Changes

Once the files are uploaded, scroll down to the **Commit changes** box. GitHub will automatically populate it with a default message like "Add files via upload". Click the green **Commit changes** button.

<div align="center">
  <table width="100%">
    <tr>
      <td bgcolor="#f6f8fa" style="padding: 16px; border-bottom: 1px solid #d0d7de;">
        <h3 style="margin: 0; font-family: sans-serif;">Commit changes</h3>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px; border: 1px solid #d0d7de; font-family: sans-serif; background-color: #ffffff;">
        <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 8px; background-color: #f6f8fa;">
          <code>Add files via upload</code>
        </div>
        <br/>
        <div style="border: 1px solid #d0d7de; border-radius: 6px; padding: 8px; height: 60px; color: #57606a; background-color: #f6f8fa;">
          <small>Add an optional extended description...</small>
        </div>
        <br/>
        🔘 <b>Commit directly to the <code style="background-color: #ddf4ff; color: #0969da; padding: 2px 6px; border-radius: 4px;">main</code> branch.</b><br/><br/>
        <img src="https://img.shields.io/badge/Commit_changes-2da44e?style=for-the-badge" alt="Commit changes" />
      </td>
    </tr>
  </table>
</div>
<br/>

And you're done! Your GitHub profile is now beautifully updated. 

*(Note: The GitHub Action will automatically run at midnight UTC every day to refresh your SVG stats, or you can trigger it manually in the Actions tab!)*

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