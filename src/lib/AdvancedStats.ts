import { AdvancedGitHubData } from './github';
import { CustomizationData } from './generateFiles';

export function generateAdvancedStatsSVG(username: string, name: string, advancedData: AdvancedGitHubData, custom: CustomizationData): string {
  const svg_width = 800;
  const gap = 30;
  const includePrivate = custom.includePrivateCommits || false;
  const block1_height = 240;
  const block2_height = 190;

  const langs = advancedData.topLangs;
  const num_langs = langs.length;
  const cols = 3;
  const rows = Math.floor((num_langs + cols - 1) / cols);
  const block3_height = 160 + (rows * 40);

  const svg_height = block1_height + gap + block2_height + gap + block3_height + 20;

  const total_stars = advancedData.totalStars;
  const total_commits = advancedData.totalCommits;
  const total_prs = advancedData.totalPRs;
  const total_issues = advancedData.totalIssues;
  const contributions_last_year = advancedData.contributionsLastYear;

  const total_private_commits = advancedData.totalPrivateCommits || 0;
  const total_public_commits = total_commits - total_private_commits;
  
  const commitRows = includePrivate ? `
    <text x="30" y="130"><tspan class="label">Public Commits</tspan><tspan class="colon">        : </tspan><tspan class="value">${total_public_commits}</tspan></text>
    <text x="30" y="155"><tspan class="label">Private Commits</tspan><tspan class="colon">       : </tspan><tspan class="value">${total_private_commits}</tspan></text>
    <text x="30" y="180"><tspan class="label">Total PRs</tspan><tspan class="colon">             : </tspan><tspan class="value">${total_prs}</tspan></text>
    <text x="30" y="205"><tspan class="label">Contributed to (last year): </tspan><tspan class="value">${contributions_last_year}</tspan></text>` : `
    <text x="30" y="130"><tspan class="label">Total Commits</tspan><tspan class="colon">         : </tspan><tspan class="value">${total_commits}</tspan></text>
    <text x="30" y="155"><tspan class="label">Total PRs</tspan><tspan class="colon">             : </tspan><tspan class="value">${total_prs}</tspan></text>
    <text x="30" y="180"><tspan class="label">Contributed to (last year): </tspan><tspan class="value">${contributions_last_year}</tspan></text>`;

  const rankY = 135;

  // Language bars
  let lang_bars = "";
  let lang_labels = "";
  let x_offset = 0;
  const bar_width = 720;
  const neon_colors = ["#ff5f57", "#ffbd2e", "#28c840", "#58a6ff", "#d2a8ff", "#ff7b72", "#79c0ff", "#f2cc60", "#a5d6ff"];

  langs.forEach((lang, idx) => {
    const pct = (lang.size / (advancedData.totalLangSize || 1)) * 100;
    const width = (pct / 100) * bar_width;
    const display_color = neon_colors[idx % neon_colors.length];

    lang_bars += `<rect x="${x_offset}" y="0" width="${width}" height="12" fill="${display_color}" />`;
    x_offset += width;

    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const lx = col * 240;
    const ly = 50 + (row * 35);
    lang_labels += `
    <g transform="translate(${lx}, ${ly})">
        <circle cx="6" cy="-1" r="6" fill="${display_color}" />
        <text x="20" y="4" font-family="'JetBrains Mono', monospace" font-size="14" fill="#8b949e">${lang.name} ${pct.toFixed(1)}%</text>
    </g>`;
  });

  const get_terminal_header = (width: number, height: number) => {
    return `
    <rect x="0" y="0" width="${width}" height="${height}" rx="12" ry="12" fill="#1c2128" />
    <rect x="0" y="0" width="${width}" height="38" rx="12" ry="12" fill="url(#headerGrad)" />
    <rect x="0" y="20" width="${width}" height="18" fill="url(#headerGrad)" />
    <circle cx="22" cy="19" r="6" fill="#ff5f57"/>
    <circle cx="42" cy="19" r="6" fill="#ffbd2e"/>
    <circle cx="62" cy="19" r="6" fill="#28c840"/>
    <rect x="0" y="38" width="${width}" height="${height - 38}" rx="12" ry="12" fill="url(#termBg)" />
    <rect x="0" y="0" width="${width}" height="${height}" rx="12" ry="12" fill="none" stroke="#1f6feb" stroke-width="1.5" opacity="0.6"/>`;
  };

  const score = advancedData.totalCommits * 1 + advancedData.totalPRs * 5 + advancedData.totalIssues * 3 + advancedData.totalStars * 10;
  let rank = "C";
  let percentage = 30;
  if (score > 1000) { rank = "B"; percentage = 50; }
  if (score > 5000) { rank = "A"; percentage = 70; }
  if (score > 10000) { rank = "A+"; percentage = 85; }
  if (score > 20000) { rank = "S"; percentage = 100; }

  const streak_pct = Math.min((advancedData.currentStreak / Math.max(advancedData.longestStreak, 1)) * 100, 100);
  const orange_dash = 221.326 * (streak_pct / 100);
  const orange_gap = 251.327 - orange_dash;
  const orange_vis = advancedData.currentStreak === 0 ? 'visibility="hidden"' : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svg_width} ${svg_height}" width="${svg_width}" height="${svg_height}">
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
      .title { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: bold; fill: #e6edf3; }
      .label { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: bold; fill: #58a6ff; }
      .colon { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: bold; fill: #8b949e; }
      .value { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: bold; fill: #e6edf3; }
      .highlight { fill: #e6edf3; font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: bold; text-anchor: middle; }
      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animated-block {
        opacity: 0;
        animation: slideUpFade 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      .block-1 { animation-delay: 2.8s; }
      .block-2 { animation-delay: 3.1s; }
      .block-3 { animation-delay: 3.4s; }
    </style>
  </defs>

  <g transform="translate(0, 0)" filter="url(#shadow)">
    <g class="animated-block block-1">
    ${get_terminal_header(svg_width, block1_height)}
    <text x="30" y="70" class="title"><tspan fill="#3fb950">${name || username}</tspan><tspan fill="#8b949e">'s </tspan><tspan fill="#58a6ff">GitHub Stats</tspan></text>

    <text x="30" y="105"><tspan class="label">Total Stars Earned</tspan><tspan class="colon">    : </tspan><tspan class="value">${total_stars}</tspan></text>
    ${commitRows}
    <text x="360" y="105"><tspan class="label">Total Issues</tspan><tspan class="colon">          : </tspan><tspan class="value">${total_issues}</tspan></text>

    <g transform="translate(680, ${rankY})">
      <circle cx="0" cy="0" r="40" fill="none" stroke="#21262d" stroke-width="8" />
      <circle cx="0" cy="0" r="40" fill="none" stroke="#3fb950" stroke-width="8" stroke-dasharray="251.327" stroke-dashoffset="${251.327 - (251.327 * (percentage / 100))}" transform="rotate(-90)" />
      <text x="0" y="10" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="bold" fill="#e6edf3" text-anchor="middle">${rank}</text>
    </g>
    </g>
  </g>

  <g transform="translate(0, ${block1_height + gap})" filter="url(#shadow)">
    <g class="animated-block block-2">
    ${get_terminal_header(svg_width, block2_height)}
    <text x="400" y="24" text-anchor="middle" fill="#8b949e" font-size="13" font-family="'JetBrains Mono', monospace">streak_stats.sh</text>

    <line x1="280" y1="60" x2="280" y2="170" stroke="#8b949e" stroke-width="1" opacity="0.4" />
    <line x1="520" y1="60" x2="520" y2="170" stroke="#8b949e" stroke-width="1" opacity="0.4" />

    <g transform="translate(160, 110)">
        <text x="0" y="-3" class="highlight">${advancedData.totalContributions}</text>
        <text x="0" y="50" fill="#e6edf3" font-size="14" text-anchor="middle" font-family="'JetBrains Mono', monospace">Total Contributions</text>
        <text x="0" y="75" fill="#8b949e" font-size="12" text-anchor="middle" font-family="'JetBrains Mono', monospace">${advancedData.createdYear} - Present</text>
    </g>

    <g transform="translate(400, 110)">
        <circle cx="0" cy="-15" r="40" fill="none" stroke="#21262d" stroke-width="6" stroke-linecap="round" stroke-dasharray="221.326 30" stroke-dashoffset="-15" transform="rotate(-90 0 -15)" />
        <circle cx="0" cy="-15" r="40" fill="none" stroke="#f0883e" stroke-width="6" stroke-linecap="round" stroke-dasharray="${orange_dash} ${orange_gap}" stroke-dashoffset="-15" transform="rotate(-90 0 -15)" ${orange_vis} />
        <path d="M0,-8 C3,-4 5,-1 5,2 C5,4.8 2.8,7 0,7 C-2.8,7 -5,4.8 -5,2 C-5,-0.5 -2,-3 -1,-5 C-1.5,-4 -2,-2.5 -2,-1 C-2,1 -0.5,2 0.5,2 C1.5,2 2,1 2,-0.5 C2,-1.5 1.5,-3 0 -5 Z" fill="#f0883e" transform="translate(0, -55) scale(1.1)"/>

        <text x="0" y="-3" class="highlight" font-size="32">${advancedData.currentStreak}</text>
        <text x="0" y="50" fill="#f0883e" font-weight="bold" font-size="16" text-anchor="middle" font-family="'JetBrains Mono', monospace">Current Streak</text>
        <text x="0" y="75" fill="#8b949e" font-size="12" text-anchor="middle" font-family="'JetBrains Mono', monospace">${advancedData.currentStreakDate}</text>
    </g>

    <g transform="translate(640, 110)">
        <text x="0" y="-3" class="highlight">${advancedData.longestStreak}</text>
        <text x="0" y="50" fill="#e6edf3" font-size="14" text-anchor="middle" font-family="'JetBrains Mono', monospace">Longest Streak</text>
        <text x="0" y="75" fill="#8b949e" font-size="12" text-anchor="middle" font-family="'JetBrains Mono', monospace">${advancedData.longestStreakDate}</text>
    </g>
    </g>
  </g>

  <g transform="translate(0, ${block1_height + block2_height + (gap * 2)})" filter="url(#shadow)">
    <g class="animated-block block-3">
    ${get_terminal_header(svg_width, block3_height)}
    <text x="400" y="24" text-anchor="middle" fill="#8b949e" font-size="13" font-family="'JetBrains Mono', monospace">languages.sh</text>
    <text x="30" y="65" class="title">Most Used Languages</text>

    <g transform="translate(40, 95)">
        <clipPath id="bar-clip">
            <rect x="0" y="0" width="${bar_width}" height="12" rx="6" />
        </clipPath>
        <g clip-path="url(#bar-clip)">
            ${lang_bars}
        </g>

        <g transform="translate(0, 30)">
            ${lang_labels}
        </g>
    </g>
    </g>
  </g>
</svg>`;
}
