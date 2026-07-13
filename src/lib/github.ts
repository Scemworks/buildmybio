export interface GitHubData {
  username: string;
  name: string;
  bio: string | null;
  location: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  topProjects: { name: string; url: string; language: string | null }[];
  topLanguages: string;
  topTopics: string;
  asciiArt: string;
  inferredRole: string;
  inferredMood: string;
}

export async function fetchGitHubData(username: string): Promise<GitHubData> {
  const userRes = await fetch(`https://api.github.com/users/${username}`);
  if (!userRes.ok) throw new Error('User not found');
  const user = await userRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  let totalStars = 0;
  let topProjects: { name: string; html_url: string; language: string | null; stargazers_count: number }[] = [];
  let topLanguages = '';
  let topTopics = '';

  if (reposRes.ok) {
    const repos = await reposRes.json();
    const languageCounts: Record<string, number> = {};
    const topicCounts: Record<string, number> = {};

    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      }
      if (repo.topics && Array.isArray(repo.topics)) {
        repo.topics.forEach((topic: string) => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      }
    }
    
    // Sort by stars descending
    topProjects = repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 3);

    const topLangsArr = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
    topLanguages = topLangsArr.join(', ');

    const topTopicsArr = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
    topTopics = topTopicsArr.join(', ');
  }

  // Infer role based on bio and top languages
  const bioLower = user.bio?.toLowerCase() || '';
  let inferredRole = 'Software Engineer';
  const topLangsList = topLanguages.split(', ').map(l => l.toLowerCase());
  const mainLang = topLangsList[0];

  if (bioLower.includes('frontend') || bioLower.includes('front-end')) inferredRole = 'Frontend Developer';
  else if (bioLower.includes('backend') || bioLower.includes('back-end')) inferredRole = 'Backend Developer';
  else if (bioLower.includes('fullstack') || bioLower.includes('full-stack') || bioLower.includes('full stack')) inferredRole = 'Fullstack Developer';
  else if (bioLower.includes('data scientist') || bioLower.includes('data science') || bioLower.includes('data analyst')) inferredRole = 'Data Scientist';
  else if (bioLower.includes('machine learning') || bioLower.includes('ml engineer') || bioLower.includes('ai ')) inferredRole = 'AI/ML Engineer';
  else if (bioLower.includes('devops') || bioLower.includes('sre') || bioLower.includes('sysadmin')) inferredRole = 'DevOps Engineer';
  else if (bioLower.includes('mobile') || bioLower.includes('ios') || bioLower.includes('android')) inferredRole = 'Mobile Developer';
  else if (bioLower.includes('student')) inferredRole = 'Student';
  else if (bioLower.includes('designer') || bioLower.includes('ui/ux')) inferredRole = 'UI/UX Designer';
  else if (bioLower.includes('software engineer')) inferredRole = 'Software Engineer';
  else if (bioLower.includes('developer')) inferredRole = 'Developer';
  else if (mainLang) {
    if (['javascript', 'typescript', 'html', 'css', 'svelte', 'vue'].includes(mainLang)) inferredRole = 'Frontend Developer';
    else if (['python', 'jupyter notebook', 'r'].includes(mainLang)) inferredRole = 'Backend / Data Developer';
    else if (['java', 'c#', 'go', 'rust', 'ruby', 'php'].includes(mainLang)) inferredRole = 'Backend Developer';
    else if (['swift', 'kotlin', 'dart', 'objective-c'].includes(mainLang)) inferredRole = 'Mobile Developer';
    else if (['c++', 'c'].includes(mainLang)) inferredRole = 'Systems Developer';
  }

  // Infer mood based on bio keywords
  let inferredMood = 'building . learning . shipping';
  if (bioLower) {
    if (bioLower.includes('coffee')) inferredMood = 'fueled by coffee ☕';
    else if (bioLower.includes('learn')) inferredMood = 'always learning 📚';
    else if (bioLower.includes('music')) inferredMood = 'coding to music 🎵';
    else if (bioLower.includes('bug') || bioLower.includes('debug')) inferredMood = 'squashing bugs 🐛';
    else if (bioLower.includes('open source') || bioLower.includes('oss')) inferredMood = 'open source enthusiast 🌍';
    else if (bioLower.includes('sleep') || bioLower.includes('tired')) inferredMood = 'needs sleep 😴';
    else if (bioLower.includes('design') || bioLower.includes('art')) inferredMood = 'designing things 🎨';
    else if (bioLower.includes('hack')) inferredMood = 'hacking away 💻';
    else if (user.bio && user.bio.length < 25) inferredMood = user.bio;
  }

  // Fetch ASCII art
  let asciiArt = '';
  try {
    const asciiRes = await fetch(`/api/ascii?text=${encodeURIComponent(username)}`);
    if (asciiRes.ok) {
      asciiArt = await asciiRes.text();
    }
  } catch (e) {
    console.error('Failed to fetch ascii art', e);
  }

  return {
    username: user.login,
    name: user.name || user.login,
    bio: user.bio,
    location: user.location || 'The Internet',
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalStars,
    topLanguages,
    topTopics,
    asciiArt,
    inferredRole,
    inferredMood,
    topProjects: topProjects.map(p => ({
      name: p.name,
      url: p.html_url,
      language: p.language || 'Unknown'
    }))
  };
}
