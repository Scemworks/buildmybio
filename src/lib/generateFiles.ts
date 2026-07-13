import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { GitHubData } from './github';

export interface CustomizationData {
  host: string;
  city: string;
  role: string;
  tools: string;
  lang: string;
  editor: string;
  status: string;
  mood: string;
  projects: { name: string; url: string; language: string | null }[];
}

export function generateNeofetchSVG(data: GitHubData, custom: CustomizationData): string {
  // SVG Template using robust IDs for python regex updating
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 530" width="800" height="530" role="img" aria-label="${data.name} - neofetch terminal">
  <defs>
    <linearGradient id="termBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0e13;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#21262d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#161b22;stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <style>
      text, tspan {
        font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Courier New', monospace;
      }
      .terminal-window {
        animation: openTerminal 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        transform-origin: 400px 265px;
        opacity: 0;
        transform: scale(0.95);
      }
      @keyframes openTerminal {
        to { opacity: 1; transform: scale(1); }
      }
      .cursor {
        animation: blink 1s step-start infinite;
        animation-delay: 2.65s;
        opacity: 0;
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
      .prompt-line {
        opacity: 0;
        animation: fadeIn 0.01s forwards;
        animation-delay: 0.6s;
      }
      .cmd-text {
        clip-path: inset(0 100% 0 0);
        animation: revealCmd 0.4s steps(8, end) forwards;
        animation-delay: 1.4s;
      }
      @keyframes revealCmd {
        0%   { clip-path: inset(0 100% 0 0); }
        100% { clip-path: inset(0 0% 0 0); }
      }
      @keyframes moveCursor {
        0%   { transform: translateX(0); }
        100% { transform: translateX(67px); } /* 8 chars * ~8.4px */
      }
      .type-cursor {
        animation: 
          moveCursor 0.4s steps(8, end) 1.4s forwards,
          blink 0.8s step-start 0.6s infinite,
          solid 0.6s step-start 1.4s forwards,
          hideCursor 0.01s 2.0s forwards;
        opacity: 0;
      }
      @keyframes solid {
        0%, 100% { opacity: 1; }
      }
      @keyframes hideCursor { to { opacity: 0; visibility: hidden; } }
      .ascii-block { opacity: 0; animation: fadeIn 0.01s forwards; animation-delay: 2.00s; }
      .info-row { opacity: 0; animation: fadeIn 0.01s forwards; }
      .info-delay-0 { animation-delay: 2.20s; }
      .info-delay-1 { animation-delay: 2.22s; }
      .info-delay-2 { animation-delay: 2.24s; }
      .info-delay-3 { animation-delay: 2.26s; }
      .info-delay-4 { animation-delay: 2.28s; }
      .info-delay-5 { animation-delay: 2.30s; }
      .info-delay-6 { animation-delay: 2.32s; }
      .info-delay-7 { animation-delay: 2.34s; }
      .info-delay-8 { animation-delay: 2.36s; }
      .info-delay-9 { animation-delay: 2.38s; }
      .info-delay-10 { animation-delay: 2.40s; }
      .info-delay-11 { animation-delay: 2.42s; }
      .info-delay-12 { animation-delay: 2.44s; }
      .info-delay-13 { animation-delay: 2.46s; }
      .info-delay-14 { animation-delay: 2.48s; }
      .info-delay-15 { animation-delay: 2.50s; }
      .info-delay-16 { animation-delay: 2.04s; }
      .info-delay-17 { animation-delay: 2.08s; }
      .palette { opacity: 0; animation: fadeIn 0.01s forwards; animation-delay: 2.12s; }
      .final-prompt { opacity: 0; animation: fadeIn 0.01s forwards; animation-delay: 2.65s; }
      @keyframes fadeIn {
        to { opacity: 1; }
      }
    </style>
  </defs>

  <g class="terminal-window">
  <g filter="url(#shadow)">
    <rect x="0" y="0" width="800" height="530" rx="12" ry="12" fill="#1c2128" />
    <rect x="0" y="0" width="800" height="38" rx="12" ry="12" fill="url(#headerGrad)" />
    <rect x="0" y="20" width="800" height="18" fill="url(#headerGrad)" />
    <circle cx="22" cy="19" r="6" fill="#ff5f57"/>
    <circle cx="42" cy="19" r="6" fill="#ffbd2e"/>
    <circle cx="62" cy="19" r="6" fill="#28c840"/>
    <text x="400" y="24" text-anchor="middle" fill="#8b949e" font-size="13" font-family="'JetBrains Mono', monospace">${data.username}@github — neofetch</text>
    <rect x="0" y="38" width="800" height="492" fill="url(#termBg)" />
  </g>

  <g xml:space="preserve">
    <!-- PROMPT + TYPING COMMAND -->
    <g class="prompt-line">
      <text x="20" y="70" font-size="14" fill="#58a6ff" filter="url(#glow)"><tspan fill="#3fb950">${data.username}</tspan><tspan fill="#8b949e">@</tspan><tspan fill="#58a6ff">github</tspan><tspan fill="#8b949e">:</tspan><tspan fill="#f0883e">~</tspan><tspan fill="#8b949e">$ </tspan></text>
      <text x="190" y="70" font-size="14" fill="#e6edf3" class="cmd-text">neofetch</text>
      <rect x="190" y="56" width="8" height="16" fill="#58a6ff" class="type-cursor"/>
    </g>

    <!-- ASCII ART BLOCK (LEFT COLUMN) -->
    <g class="ascii-block" font-size="8" fill="#3fb950" filter="url(#glow)" font-family="'JetBrains Mono', monospace">
      <text x="25" y="110">███████╗&#160;██████╗███████╗███╗&#160;&#160;&#160;███╗██╗&#160;&#160;&#160;&#160;██╗&#160;██████╗&#160;██████╗&#160;██╗&#160;&#160;██╗███████╗</text>
      <text x="25" y="119">██╔════╝██╔════╝██╔════╝████╗&#160;████║██║&#160;&#160;&#160;&#160;██║██╔═══██╗██╔══██╗██║&#160;██╔╝██╔════╝</text>
      <text x="25" y="128">███████╗██║&#160;&#160;&#160;&#160;&#160;█████╗&#160;&#160;██╔████╔██║██║&#160;█╗&#160;██║██║&#160;&#160;&#160;██║██████╔╝█████╔╝&#160;███████╗</text>
      <text x="25" y="137">╚════██║██║&#160;&#160;&#160;&#160;&#160;██╔══╝&#160;&#160;██║╚██╔╝██║██║███╗██║██║&#160;&#160;&#160;██║██╔══██╗██╔═██╗&#160;╚════██║</text>
      <text x="25" y="146">███████║╚██████╗███████╗██║&#160;╚═╝&#160;██║╚███╔███╔╝╚██████╔╝██║&#160;&#160;██║██║&#160;&#160;██╗███████║</text>
      <text x="25" y="155">╚══════╝&#160;╚═════╝╚══════╝╚═╝&#160;&#160;&#160;&#160;&#160;╚═╝&#160;╚══╝╚══╝&#160;&#160;╚═════╝&#160;╚═╝&#160;&#160;╚═╝╚═╝&#160;&#160;╚═╝╚══════╝</text>
      
      <text x="40" y="210" font-size="12" fill="#238636">==================================================</text>
      <text x="40" y="230" font-size="12" fill="#238636">&#160;&#160;&#160;&#160;Building&#160;cool&#160;stuff,&#160;one&#160;commit&#160;at&#160;a&#160;time&#160;&#160;&#160;&#160;&#160;</text>
      <text x="40" y="250" font-size="12" fill="#238636">==================================================</text>
    </g>

    <!-- STATUS & MOOD (LEFT COLUMN) -->
    <g font-family="'JetBrains Mono', monospace" font-size="13">
      <text x="40" y="290" class="info-row info-delay-16" fill="#8b949e">Status : <tspan fill="#3fb950">● ${custom.status}</tspan></text>
      <text x="40" y="312" class="info-row info-delay-17" fill="#8b949e">Mood&#160;&#160;&#160;: <tspan fill="#f0883e">${custom.mood}</tspan></text>
    </g>

    <!-- COLOR PALETTE (LEFT COLUMN) -->
    <g class="palette">
      <text x="40" y="356" font-size="12" fill="#8b949e" font-family="'JetBrains Mono', monospace">colors :</text>
      <rect x="40"  y="370" width="22" height="14" rx="2" fill="#21262d"/>
      <rect x="66"  y="370" width="22" height="14" rx="2" fill="#ff5f57"/>
      <rect x="92"  y="370" width="22" height="14" rx="2" fill="#3fb950"/>
      <rect x="118" y="370" width="22" height="14" rx="2" fill="#f0883e"/>
      <rect x="144" y="370" width="22" height="14" rx="2" fill="#58a6ff"/>
      <rect x="170" y="370" width="22" height="14" rx="2" fill="#bc8cff"/>
      <rect x="196" y="370" width="22" height="14" rx="2" fill="#39c5cf"/>
      <rect x="222" y="370" width="22" height="14" rx="2" fill="#e6edf3"/>
      
      <rect x="40"  y="388" width="22" height="14" rx="2" fill="#30363d"/>
      <rect x="66"  y="388" width="22" height="14" rx="2" fill="#ffa198"/>
      <rect x="92"  y="388" width="22" height="14" rx="2" fill="#56d364"/>
      <rect x="118" y="388" width="22" height="14" rx="2" fill="#ffa657"/>
      <rect x="144" y="388" width="22" height="14" rx="2" fill="#79c0ff"/>
      <rect x="170" y="388" width="22" height="14" rx="2" fill="#d2a8ff"/>
      <rect x="196" y="388" width="22" height="14" rx="2" fill="#76e3ea"/>
      <rect x="222" y="388" width="22" height="14" rx="2" fill="#ffffff"/>
    </g>

    <!-- INFO PANEL (RIGHT COLUMN) -->
    <g font-family="'JetBrains Mono', monospace" font-size="14">
      <text x="440" y="120" class="info-row info-delay-0"><tspan fill="#3fb950" font-weight="bold">${data.name.toLowerCase().replace(/\\s/g, '')}</tspan><tspan fill="#8b949e">@</tspan><tspan fill="#58a6ff" font-weight="bold">${data.username}</tspan></text>
      <text x="440" y="140" fill="#30363d" class="info-row info-delay-1">---------------------------------</text>
      <text x="440" y="166" class="info-row info-delay-2"><tspan fill="#58a6ff">OS    </tspan><tspan fill="#8b949e">: </tspan><tspan fill="#e6edf3">GitHub Flavored Linux</tspan></text>
      <text x="440" y="188" class="info-row info-delay-3"><tspan fill="#58a6ff">Host  </tspan><tspan fill="#8b949e">: </tspan><a href="https://${custom.host}" target="_blank"><tspan fill="#e6edf3">${custom.host}</tspan></a></text>
      <text x="440" y="210" class="info-row info-delay-4"><tspan fill="#58a6ff">City  </tspan><tspan fill="#8b949e">: </tspan><tspan fill="#e6edf3">${custom.city}</tspan></text>
      <text x="440" y="232" class="info-row info-delay-5"><tspan fill="#58a6ff">Role  </tspan><tspan fill="#8b949e">: </tspan><tspan fill="#e6edf3">${custom.role}</tspan></text>
      <text x="440" y="254" class="info-row info-delay-6"><tspan fill="#58a6ff">Tools </tspan><tspan fill="#8b949e">: </tspan><tspan fill="#e6edf3">${custom.tools}</tspan></text>
      <text x="440" y="276" class="info-row info-delay-7"><tspan fill="#58a6ff">Lang  </tspan><tspan fill="#8b949e">: </tspan><tspan fill="#e6edf3">${custom.lang}</tspan></text>
      <text x="440" y="298" class="info-row info-delay-8"><tspan fill="#58a6ff">Editor</tspan><tspan fill="#8b949e">: </tspan><tspan fill="#e6edf3">${custom.editor}</tspan></text>
      <text x="440" y="320" class="info-row info-delay-9" id="stat-repos"><tspan fill="#58a6ff">Repos&#160;</tspan><tspan fill="#8b949e">: </tspan><tspan fill="#f0883e">${data.publicRepos}</tspan><tspan fill="#e6edf3"> public</tspan></text>
      <text x="440" y="342" class="info-row info-delay-10" id="stat-follow"><tspan fill="#58a6ff">Follow</tspan><tspan fill="#8b949e">: </tspan><tspan fill="#e6edf3">${data.followers} followers, ${data.following} following</tspan></text>
      <text x="440" y="364" class="info-row info-delay-11" id="stat-stars"><tspan fill="#58a6ff">Stars&#160;</tspan><tspan fill="#8b949e">: </tspan><tspan fill="#f0883e">${data.totalStars}</tspan><tspan fill="#e6edf3"> total</tspan></text>

      <!-- Projects -->
      <text x="440" y="396" class="info-row info-delay-12"><tspan fill="#58a6ff">Projects</tspan><tspan fill="#8b949e">:</tspan></text>
      ${custom.projects.map((p, i) => `
      <text x="440" y="${418 + (i * 22)}" class="info-row info-delay-${13 + i}"><tspan fill="#8b949e">&#160;&#160;&gt;&#160;</tspan><a href="${p.url}" target="_blank"><tspan fill="#3fb950">${p.name}</tspan></a><tspan fill="#8b949e">&#160;&#160;[${p.language || 'Code'}]</tspan></text>`).join('')}
    </g>

    <!-- FINAL PROMPT + BLINKING CURSOR -->
    <g class="final-prompt">
      <text x="20" y="500" font-size="14" font-family="'JetBrains Mono', monospace"><tspan fill="#3fb950">${data.username}</tspan><tspan fill="#8b949e">@</tspan><tspan fill="#58a6ff">github</tspan><tspan fill="#8b949e">:</tspan><tspan fill="#f0883e">~</tspan><tspan fill="#8b949e">$ </tspan></text>
      <rect x="190" y="486" width="8" height="16" rx="1" fill="#58a6ff" class="cursor"/>
    </g>
  </g>

  <!-- OUTER BORDER GLOW -->
  <rect x="0" y="0" width="800" height="530" rx="12" ry="12" fill="none" stroke="#1f6feb" stroke-width="1.5" opacity="0.6"/>
  </g>
</svg>`;
}

export function generateUpdateScript(username: string): string {
  return `import re
import urllib.request
import json

USERNAME = "${username}"

# 1. Fetch user data from GitHub API
url = f"https://api.github.com/users/{USERNAME}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        repos = data.get("public_repos", 0)
        followers = data.get("followers", 0)
        following = data.get("following", 0)
except Exception as e:
    print(f"Error fetching user data: {e}")
    exit(1)

# 2. Fetch total stars (iterate through repos)
stars = 0
try:
    repos_url = f"https://api.github.com/users/{USERNAME}/repos?per_page=100"
    req_repos = urllib.request.Request(repos_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_repos) as response:
        repos_data = json.loads(response.read().decode())
        for repo in repos_data:
            stars += repo.get("stargazers_count", 0)
except Exception as e:
    print(f"Error fetching repos: {e}")
    pass

# 3. Read SVG file
svg_path = "neofetch.svg"
try:
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()
except FileNotFoundError:
    print(f"Error: {svg_path} not found.")
    exit(1)

# 4. Update stats using regex
# Repos
svg_content = re.sub(
    r'(id="stat-repos".*?<tspan fill="#f0883e">)\d+(</tspan><tspan fill="#e6edf3"> public</tspan></text>)',
    rf'\\g<1>{repos}\\g<2>',
    svg_content
)

# Follow
svg_content = re.sub(
    r'(id="stat-follow".*?<tspan fill="#e6edf3">)\d+ followers, \d+ following(</tspan></text>)',
    rf'\\g<1>{followers} followers, {following} following\\g<2>',
    svg_content
)

# Stars
if stars > 0:
    svg_content = re.sub(
        r'(id="stat-stars".*?<tspan fill="#f0883e">)\d+(</tspan><tspan fill="#e6edf3"> total</tspan></text>)',
        rf'\\g<1>{stars}\\g<2>',
        svg_content
    )

# 5. Write back to SVG
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(svg_content)

print(f"Successfully updated SVG! Repos: {repos}, Followers: {followers}, Following: {following}, Stars: {stars}")
`;
}

export function generateReadme(username: string): string {
  return `<p align="center">
  <a href="https://github.com/${username}" target="_blank">
    <img src="./neofetch.svg" alt="Neofetch Stats" />
  </a>
</p>
`;
}

export function generateWorkflow(): string {
  return `name: Update Neofetch SVG

on:
  schedule:
    - cron: '0 0 * * *' # Runs every day at midnight UTC
  workflow_dispatch: # Allows manual trigger from the GitHub Actions tab

jobs:
  update-svg:
    runs-on: ubuntu-latest
    permissions:
      contents: write # Needed to commit and push changes back

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Run update script
        run: python update_stats.py

      - name: Commit and push changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add neofetch.svg
          git diff --quiet && git diff --staged --quiet || (git commit -m "chore: update GitHub stats in neofetch.svg" && git push)
`;
}

export async function downloadFilesZip(data: GitHubData, custom: CustomizationData) {
  const zip = new JSZip();

  zip.file('neofetch.svg', generateNeofetchSVG(data, custom));
  zip.file('update_stats.py', generateUpdateScript(data.username));
  zip.file('README.md', generateReadme(data.username));
  zip.folder('.github')?.folder('workflows')?.file('update-neofetch.yml', generateWorkflow());

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'github-neofetch-profile.zip');
}
