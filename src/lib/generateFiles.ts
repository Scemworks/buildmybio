import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { GitHubData } from './github';

export interface CustomizationData {
  status: string;
  mood: string;
  tagline: string;
  infoFields: { label: string; value: string }[];
  projects: { name: string; url: string; language: string | null }[];
  includeAdvancedStats?: boolean;
  includePrivateCommits?: boolean;
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
      ${data.asciiArt 
        ? data.asciiArt.replace(/\r/g, '').split('\n').map((line, i) => `<text x="25" y="${110 + i * 9}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&#160;')}</text>`).join('\n      ')
        : `<text x="25" y="110">${data.username}</text>`
      }
      
      <text x="40" y="210" font-size="12" fill="#238636">==================================================</text>
      <text x="220" y="230" font-size="12" fill="#238636" text-anchor="middle">${(custom.tagline || 'Building cool stuff, one commit at a time').replace(/ /g, '&#160;')}</text>
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
        <text x="440" y="120" class="info-row info-delay-0"><tspan fill="#3fb950" font-weight="bold">${data.name.toLowerCase().replace(/\s/g, '')}</tspan><tspan fill="#8b949e">@</tspan><tspan fill="#58a6ff" font-weight="bold">${data.username}</tspan></text>
        <text x="440" y="140" fill="#30363d" class="info-row info-delay-1">---------------------------------</text>
        
        ${(() => {
          const maxLen = Math.max(...custom.infoFields.map(f => f.label.length), 6);
          let y = 166;
          let delay = 2;
          let out = '';
          
          // Dynamic Fields
          custom.infoFields.forEach((field) => {
            const paddedLabel = field.label.padEnd(maxLen, ' ');
            const val = field.label.toLowerCase() === 'host' && !field.value.includes('<a') 
              ? `<a href="https://${field.value}" target="_blank"><tspan fill="#e6edf3">${field.value}</tspan></a>` 
              : `<tspan fill="#e6edf3">${field.value}</tspan>`;
            
            out += `<text x="440" y="${y}" class="info-row info-delay-${delay}"><tspan fill="#58a6ff">${paddedLabel}</tspan><tspan fill="#8b949e">: </tspan>${val}</text>\n        `;
            y += 22;
            delay++;
          });
          
          // Fixed GitHub Stats
          const statsLabelLen = maxLen;
          out += `<text x="440" y="${y}" class="info-row info-delay-${delay}" id="stat-repos"><tspan fill="#58a6ff">${'Repos'.padEnd(statsLabelLen, ' ')}</tspan><tspan fill="#8b949e">: </tspan><tspan fill="#f0883e">${data.publicRepos}</tspan><tspan fill="#e6edf3"> public</tspan></text>\n        `;
          y += 22; delay++;
          out += `<text x="440" y="${y}" class="info-row info-delay-${delay}" id="stat-follow"><tspan fill="#58a6ff">${'Follow'.padEnd(statsLabelLen, ' ')}</tspan><tspan fill="#8b949e">: </tspan><tspan fill="#e6edf3">${data.followers} followers, ${data.following} following</tspan></text>\n        `;
          y += 22; delay++;
          out += `<text x="440" y="${y}" class="info-row info-delay-${delay}" id="stat-stars"><tspan fill="#58a6ff">${'Stars'.padEnd(statsLabelLen, ' ')}</tspan><tspan fill="#8b949e">: </tspan><tspan fill="#f0883e">${data.totalStars}</tspan><tspan fill="#e6edf3"> total</tspan></text>\n        `;
          y += 32; delay++; // gap for projects

          // Projects
          out += `<text x="440" y="${y}" class="info-row info-delay-${delay}"><tspan fill="#58a6ff">Projects</tspan><tspan fill="#8b949e">:</tspan></text>\n        `;
          y += 22; delay++;
          
          custom.projects.forEach((p) => {
            out += `<text x="440" y="${y}" class="info-row info-delay-${delay}"><tspan fill="#8b949e">&#160;&#160;&gt;&#160;</tspan><a href="${p.url}" target="_blank"><tspan fill="#3fb950">${p.name}</tspan></a><tspan fill="#8b949e">&#160;&#160;[${p.language || 'Code'}]</tspan></text>\n        `;
            y += 22; delay++;
          });
          
          return out;
        })()}
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
import os

USERNAME = "${username}"
token = os.environ.get("GH_PAT")

headers = {'User-Agent': 'Mozilla/5.0'}
if token:
    headers['Authorization'] = f"Bearer {token}"

# 1. Fetch user data from GitHub API
url = f"https://api.github.com/users/{USERNAME}"
req = urllib.request.Request(url, headers=headers)
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
    req_repos = urllib.request.Request(repos_url, headers=headers)
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

export function generateReadme(username: string, includeAdvancedStats?: boolean): string {
  return `<p align="center">
  <a href="https://github.com/${username}" target="_blank">
    <img src="./neofetch.svg" alt="Neofetch Stats" />${includeAdvancedStats ? '\n    <br/>\n    <img src="./github_advanced_stats.svg?v=1" alt="Advanced GitHub Stats" />' : ''}
  </a>
</p>
`;
}

export function generateWorkflow(includeAdvancedStats?: boolean): string {
  return `name: Update GitHub Stats SVG

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
        run: |
          python update_stats.py${includeAdvancedStats ? '\n          python update_advanced_stats.py' : ''}
        env:
          GH_PAT: ${{ secrets.GH_PAT }}

      - name: Commit and push changes
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add neofetch.svg${includeAdvancedStats ? ' github_advanced_stats.svg README.md' : ''}
          git diff --quiet && git diff --staged --quiet || (git commit -m "chore: update GitHub stats in SVG" && git push)
`;
}

export async function downloadFilesZip(data: GitHubData, custom: CustomizationData) {
  const zip = new JSZip();

  zip.file('neofetch.svg', generateNeofetchSVG(data, custom));
  zip.file('update_stats.py', generateUpdateScript(data.username));
  if (custom.includeAdvancedStats) {
    zip.file('update_advanced_stats.py', generateUpdateAdvancedScript(data.username, custom.includePrivateCommits || false));
  }
  zip.file('README.md', generateReadme(data.username, custom.includeAdvancedStats));
  zip.folder('.github')?.folder('workflows')?.file('update-stats.yml', generateWorkflow(custom.includeAdvancedStats));

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'github-profile-stats.zip');
}

export function generateUpdateAdvancedScript(username: string, includePrivateCommits: boolean): string {
  return `import urllib.request
import json
import os
import datetime
import re

USERNAME = "${username}"
env_file = ".env"

# 1. Load Environment Variables
if os.path.exists(env_file):
    with open(env_file) as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                parts = line.strip().split('=', 1)
                if len(parts) == 2:
                    os.environ[parts[0]] = parts[1].strip("'\" ")

token = os.environ.get("GH_PAT")
if not token:
    print("Error: GH_PAT is missing. Please add it to your .env file or GitHub Secrets.")
    exit(1)

# 2. GraphQL Query Definition
# We fetch basic profile info, total PRs/Issues, language stats, and the contribution calendar.
# To get exact lifetime commits, we would query each year, but for simplicity we fetch the current year
# and use totalCommitContributions for the last year. However, the user wants lifetime commits.
# We will query the REST API for public lifetime commits or use GraphQL to fetch all years dynamically.

def run_graphql_query(query, variables):
    req = urllib.request.Request("https://api.github.com/graphql", method="POST")
    req.add_header("Authorization", f"Bearer {token}")
    req.add_header("Content-Type", "application/json")
    data = json.dumps({"query": query, "variables": variables}).encode("utf-8")
    try:
        with urllib.request.urlopen(req, data=data) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"GraphQL Error: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode())
        return None

# Fetch creation date to know how many years to query
init_query = """
query(\$username: String!) {
  user(login: \$username) {
    createdAt
  }
}
"""
init_res = run_graphql_query(init_query, {"username": USERNAME})
created_at_str = init_res['data']['user']['createdAt']
created_year = int(created_at_str[:4])
current_year = datetime.datetime.now().year

# Dynamically construct query for all years
years_queries = ""
for y in range(created_year, current_year + 1):
    from_date = f"{y}-01-01T00:00:00Z"
    to_date = f"{y}-12-31T23:59:59Z"
    years_queries += f"""
    year_{y}: contributionsCollection(from: "{from_date}", to: "{to_date}") {{
      totalCommitContributions
      restrictedContributionsCount
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar {{
        totalContributions
        weeks {{
          contributionDays {{
            contributionCount
            date
          }}
        }}
      }}
    }}
    """

full_query = f"""
query(\$username: String!) {{
  user(login: \$username) {{
    repositories(first: 100, ownerAffiliations: OWNER, isFork: false, orderBy: {{field: STARGAZERS, direction: DESC}}) {{
      nodes {{
        stargazers {{ totalCount }}
        languages(first: 10, orderBy: {{field: SIZE, direction: DESC}}) {{
          edges {{ size node {{ color name }} }}
        }}
      }}
    }}
    repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {{
      totalCount
    }}
    {years_queries}
  }}
}}
"""

print("Fetching full GitHub stats via GraphQL...")
data = run_graphql_query(full_query, {"username": USERNAME})
user_data = data['data']['user']
name = user_data.get('name')
if not name:
    name = USERNAME

# Fetch private repo commit counts separately
# NOTE: When querying your OWN profile with your OWN token, restrictedContributionsCount
# is always 0 because nothing is "restricted" from you. totalCommitContributions already
# includes both public AND private commits. To get the actual private commit count,
# we query private repos directly.
private_repos_query = """
{
  viewer {
    repositories(first: 100, privacy: PRIVATE, ownerAffiliations: OWNER) {
      nodes {
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 0) {
                totalCount
              }
            }
          }
        }
      }
    }
  }
}
"""
private_data = run_graphql_query(private_repos_query, {})
private_repo_commits = 0
if private_data and 'data' in private_data:
    for repo in private_data['data']['viewer']['repositories']['nodes']:
        if repo.get('defaultBranchRef') and repo['defaultBranchRef'].get('target'):
            private_repo_commits += repo['defaultBranchRef']['target']['history']['totalCount']

# 3. Calculate Stats
total_stars = 0
languages = {}
total_lang_size = 0

for repo in user_data['repositories']['nodes']:
    total_stars += repo['stargazers']['totalCount']
    for lang_edge in repo['languages']['edges']:
        name = lang_edge['node']['name']
        color = lang_edge['node']['color']
        size = lang_edge['size']
        if name not in languages:
            languages[name] = {"size": 0, "color": color}
        languages[name]['size'] += size
        total_lang_size += size

# Sort languages by size
sorted_langs = sorted(languages.items(), key=lambda item: item[1]['size'], reverse=True)
top_langs = sorted_langs[:5] # Top 5

# Aggregate lifetime contributions
total_commits = 0  # This will hold ALL commits (public + private) from the contributions API
total_prs = 0
total_issues = 0
contributions_last_year = user_data.get('repositoriesContributedTo', {}).get('totalCount', 0)

# Track all contribution days for streaks
all_days = []

for y in range(created_year, current_year + 1):
    year_data = user_data[f'year_{y}']
    total_commits += year_data['totalCommitContributions']  # Includes both public & private
    total_prs += year_data['totalPullRequestContributions']
    total_issues += year_data['totalIssueContributions']
    
    for week in year_data['contributionCalendar']['weeks']:
        for day in week['contributionDays']:
            all_days.append({
                "date": day['date'],
                "count": day['contributionCount']
            })

# Fix missing days or duplicates by sorting
all_days.sort(key=lambda d: d['date'])

today_date = datetime.datetime.now().date()
today_str = today_date.strftime("%Y-%m-%d")
tomorrow_str = (today_date + datetime.timedelta(days=1)).strftime("%Y-%m-%d")

filtered_days = []
for day in all_days:
    d_str = day['date']
    c = day['count']
    if d_str <= today_str or (d_str == tomorrow_str and c > 0):
        filtered_days.append(day)

all_days = filtered_days

# Calculate streaks
excluded_days = []

def is_excluded_day(date_str, excluded):
    if not excluded:
        return False
    dt = datetime.datetime.strptime(date_str, "%Y-%m-%d")
    return dt.strftime("%a") in excluded

if all_days:
    first_date = all_days[0]['date']
    last_date = all_days[-1]['date']
else:
    first_date = today_str
    last_date = today_str

current_streak = 0
current_start = first_date
current_end = first_date

longest_streak = 0
longest_start = first_date
longest_end = first_date

total_contributions = 0

for day in all_days:
    date = day['date']
    count = day['count']
    total_contributions += count
    
    # check if still in streak
    if count > 0 or (current_streak > 0 and is_excluded_day(date, excluded_days)):
        current_streak += 1
        current_end = date
        # set start on first day of streak
        if current_streak == 1:
            current_start = date
            
        # update longestStreak
        if current_streak >= longest_streak:
            longest_streak = current_streak
            longest_start = current_start
            longest_end = current_end
    # reset streak but give exception for today
    elif date != last_date:
        current_streak = 0
        current_start = last_date
        current_end = last_date

def format_date(d_str):
    if not d_str: return ""
    d = datetime.datetime.strptime(d_str, "%Y-%m-%d")
    if d.year == current_year:
        return d.strftime("%b %d").replace(" 0", " ")
    else:
        return d.strftime("%b %d, %Y").replace(" 0", " ")

current_date_str = f"{format_date(current_start)} - {format_date(current_end)}" if current_streak > 0 else "None"
longest_date_str = f"{format_date(longest_start)} - {format_date(longest_end)}" if longest_streak > 0 else "None"

# total_commits already includes private commits when querying with own token
# private_repo_commits is the actual count from private repos
total_private_commits = private_repo_commits
total_public_commits = total_commits - total_private_commits
total_lifetime_commits = total_commits

# Rank Calculation
score = total_commits * 1 + total_prs * 5 + total_issues * 3 + total_stars * 10
rank = "C"
percentage = 30
if score > 1000:
    rank = "B"
    percentage = 50
if score > 5000:
    rank = "A"
    percentage = 70
if score > 10000:
    rank = "A+"
    percentage = 85
if score > 20000:
    rank = "S"
    percentage = 100

# 4. Generate SVG Content
svg_width = 800
gap = 30

# Calculate heights dynamically
block1_height = 240
block2_height = 190

# Calculate language rows
num_langs = len(top_langs)
cols = 3
rows = (num_langs + cols - 1) // cols
block3_height = 160 + (rows * 40)

svg_height = block1_height + gap + block2_height + gap + block3_height + 20 # 20 padding at bottom

# Calculate ring stroke lengths (radius 40, circumference 251.327)
r_circ = 251.327
dash_length = 221.326
streak_pct = min((current_streak / max(longest_streak, 1)) * 100, 100)
orange_dash = dash_length * (streak_pct / 100)
orange_gap = r_circ - orange_dash
orange_vis = 'visibility="hidden"' if current_streak == 0 else ''

# Language bar SVG components
lang_bars = ""
lang_labels = ""
x_offset = 0
bar_width = 720

# To prevent division by zero
if total_lang_size == 0: total_lang_size = 1

# Terminal neon color palette for distinct, vibrant language colors
neon_colors = ["#ff5f57", "#ffbd2e", "#28c840", "#58a6ff", "#d2a8ff", "#ff7b72", "#79c0ff", "#f2cc60", "#a5d6ff"]

for idx, (lang_name, lang_data) in enumerate(top_langs):
    pct = (lang_data['size'] / total_lang_size) * 100
    width = (pct / 100) * bar_width
    
    # Use a vibrant terminal color instead of GitHub's default
    display_color = neon_colors[idx % len(neon_colors)]
    
    lang_bars += f'<rect x="{x_offset}" y="0" width="{width}" height="12" fill="{display_color}" />\n'
    x_offset += width
    
    # Label
    col = idx % cols
    row = idx // cols
    lx = col * 240
    ly = 50 + (row * 35)
    lang_labels += f'''
    <g transform="translate({lx}, {ly})">
        <circle cx="6" cy="-1" r="6" fill="{display_color}" />
        <text x="20" y="4" font-family="'JetBrains Mono', monospace" font-size="14" fill="#8b949e">{lang_name} {pct:.1f}%</text>
    </g>
    '''

def get_terminal_header(width, height):
    return f"""
    <rect x="0" y="0" width="{width}" height="{height}" rx="12" ry="12" fill="#1c2128" />
    <rect x="0" y="0" width="{width}" height="38" rx="12" ry="12" fill="url(#headerGrad)" />
    <rect x="0" y="20" width="{width}" height="18" fill="url(#headerGrad)" />
    <circle cx="22" cy="19" r="6" fill="#ff5f57"/>
    <circle cx="42" cy="19" r="6" fill="#ffbd2e"/>
    <circle cx="62" cy="19" r="6" fill="#28c840"/>
    <rect x="0" y="38" width="{width}" height="{height - 38}" rx="12" ry="12" fill="url(#termBg)" />
    <rect x="0" y="0" width="{width}" height="{height}" rx="12" ry="12" fill="none" stroke="#1f6feb" stroke-width="1.5" opacity="0.6"/>
"""

svg_template = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_width} {svg_height}" width="{svg_width}" height="{svg_height}">
  <defs>
    <linearGradient id="termBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0d1117;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0e13;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#21262d;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#161b22;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
    <style>
      .title {{ font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: bold; fill: #e6edf3; }}
      .label {{ font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: bold; fill: #58a6ff; }}
      .colon {{ font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: bold; fill: #8b949e; }}
      .value {{ font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: bold; fill: #e6edf3; }}
      .highlight {{ fill: #e6edf3; font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: bold; text-anchor: middle; }}
      .streak-label {{ fill: #8b949e; font-size: 14px; text-anchor: middle; font-family: 'JetBrains Mono', monospace; }}
      /* Animation styles */
      @keyframes slideUpFade {{
        from {{ opacity: 0; transform: translateY(20px); }}
        to {{ opacity: 1; transform: translateY(0); }}
      }}
      .animated-block {{
        opacity: 0;
        animation: slideUpFade 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }}
      /* Neofetch takes ~2.65s to finish, so we start after that */
      .block-1 {{ animation-delay: 2.8s; }}
      .block-2 {{ animation-delay: 3.1s; }}
      .block-3 {{ animation-delay: 3.4s; }}
    </style>
  </defs>

  <!-- BLOCK 1: GitHub Stats -->
  <g transform="translate(0, 0)" filter="url(#shadow)">
    <g class="animated-block block-1">
    {get_terminal_header(svg_width, block1_height)}
    <text x="30" y="70" class="title"><tspan fill="#3fb950">{name}</tspan><tspan fill="#8b949e">'s </tspan><tspan fill="#58a6ff">GitHub Stats</tspan></text>
    
    <text x="30" y="105"><tspan class="label">Total Stars Earned</tspan><tspan class="colon">    : </tspan><tspan class="value">{total_stars}</tspan></text>
    <text x="30" y="130"><tspan class="label">Public Commits</tspan><tspan class="colon">        : </tspan><tspan class="value">{total_public_commits}</tspan></text>
    <text x="30" y="155"><tspan class="label">Private Commits</tspan><tspan class="colon">       : </tspan><tspan class="value">{total_private_commits}</tspan></text>
    <text x="30" y="180"><tspan class="label">Total PRs</tspan><tspan class="colon">             : </tspan><tspan class="value">{total_prs}</tspan></text>
    <text x="30" y="205"><tspan class="label">Contributed to (last year): </tspan><tspan class="value">{contributions_last_year}</tspan></text>
    <text x="360" y="105"><tspan class="label">Total Issues</tspan><tspan class="colon">          : </tspan><tspan class="value">{total_issues}</tspan></text>

    <!-- Rank Badge -->
    <g transform="translate(680, 135)">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#21262d" stroke-width="8" />
      <circle cx="0" cy="0" r="40" fill="none" stroke="#3fb950" stroke-width="8" stroke-dasharray="{2 * 3.14159 * 40}" stroke-dashoffset="{(2 * 3.14159 * 40) - ((2 * 3.14159 * 40) * (percentage / 100))}" transform="rotate(-90)" />
      <text x="0" y="10" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="bold" fill="#e6edf3" text-anchor="middle">{rank}</text>
    </g>
    </g>
  </g>

  <!-- BLOCK 2: Streaks -->
  <g transform="translate(0, {block1_height + gap})" filter="url(#shadow)">
    <g class="animated-block block-2">
    {get_terminal_header(svg_width, block2_height)}
    <text x="400" y="24" text-anchor="middle" fill="#8b949e" font-size="13" font-family="'JetBrains Mono', monospace">streak_stats.sh</text>
    
    <!-- Dividers -->
    <line x1="280" y1="60" x2="280" y2="170" stroke="#8b949e" stroke-width="1" opacity="0.4" />
    <line x1="520" y1="60" x2="520" y2="170" stroke="#8b949e" stroke-width="1" opacity="0.4" />

    <!-- Total Contributions -->
    <g transform="translate(160, 110)">
        <text x="0" y="-3" class="highlight">{total_contributions}</text>
        <text x="0" y="50" fill="#e6edf3" font-size="14" text-anchor="middle" font-family="'JetBrains Mono', monospace">Total Contributions</text>
        <text x="0" y="75" fill="#8b949e" font-size="12" text-anchor="middle" font-family="'JetBrains Mono', monospace">{created_year} - Present</text>
    </g>

    <!-- Current Streak -->
    <g transform="translate(400, 110)">
        <!-- Background Track with Gap -->
        <circle cx="0" cy="-15" r="40" fill="none" stroke="#21262d" stroke-width="6" stroke-linecap="round" stroke-dasharray="221.326 30" stroke-dashoffset="-15" transform="rotate(-90 0 -15)" />
        <!-- Orange Progress Ring -->
        <circle cx="0" cy="-15" r="40" fill="none" stroke="#f0883e" stroke-width="6" stroke-linecap="round" stroke-dasharray="{orange_dash} {orange_gap}" stroke-dashoffset="-15" transform="rotate(-90 0 -15)" {orange_vis} />
        <!-- Flame Icon -->
        <path d="M0,-8 C3,-4 5,-1 5,2 C5,4.8 2.8,7 0,7 C-2.8,7 -5,4.8 -5,2 C-5,-0.5 -2,-3 -1,-5 C-1.5,-4 -2,-2.5 -2,-1 C-2,1 -0.5,2 0.5,2 C1.5,2 2,1 2,-0.5 C2,-1.5 1.5,-3 0 -5 Z" fill="#f0883e" transform="translate(0, -55) scale(1.1)"/>
        
        <text x="0" y="-3" class="highlight" font-size="32">{current_streak}</text>
        <text x="0" y="50" fill="#f0883e" font-weight="bold" font-size="16" text-anchor="middle" font-family="'JetBrains Mono', monospace">Current Streak</text>
        <text x="0" y="75" fill="#8b949e" font-size="12" text-anchor="middle" font-family="'JetBrains Mono', monospace">{current_date_str}</text>
    </g>

    <!-- Longest Streak -->
    <g transform="translate(640, 110)">
        <text x="0" y="-3" class="highlight">{longest_streak}</text>
        <text x="0" y="50" fill="#e6edf3" font-size="14" text-anchor="middle" font-family="'JetBrains Mono', monospace">Longest Streak</text>
        <text x="0" y="75" fill="#8b949e" font-size="12" text-anchor="middle" font-family="'JetBrains Mono', monospace">{longest_date_str}</text>
    </g>
    </g>
  </g>

  <!-- BLOCK 3: Languages -->
  <g transform="translate(0, {block1_height + block2_height + (gap * 2)})" filter="url(#shadow)">
    <g class="animated-block block-3">
    {get_terminal_header(svg_width, block3_height)}
    <text x="400" y="24" text-anchor="middle" fill="#8b949e" font-size="13" font-family="'JetBrains Mono', monospace">languages.sh</text>
    <text x="30" y="65" class="title">Most Used Languages</text>
    
    <g transform="translate(40, 95)">
        <!-- Stacked Bar -->
        <clipPath id="bar-clip">
            <rect x="0" y="0" width="{bar_width}" height="12" rx="6" />
        </clipPath>
        <g clip-path="url(#bar-clip)">
            {lang_bars}
        </g>
        
        <!-- Language Labels -->
        <g transform="translate(0, 30)">
            {lang_labels}
        </g>
    </g>
    </g>
  </g>

</svg>"""

with open("github_advanced_stats.svg", "w", encoding="utf-8") as f:
    f.write(svg_template)

import time
import re
try:
    timestamp = int(time.time())
    with open("README.md", "r", encoding="utf-8") as f:
        readme_content = f.read()
    
    readme_content = re.sub(r'github_advanced_stats\.svg\?v=\d+', f'github_advanced_stats.svg?v={timestamp}', readme_content)
    
    with open("README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)
except Exception as e:
    print("Could not update README.md", e)

print("Successfully generated github_advanced_stats.svg!")

`
}
