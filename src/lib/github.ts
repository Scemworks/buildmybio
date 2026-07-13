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
    topProjects: topProjects.map(p => ({
      name: p.name,
      url: p.html_url,
      language: p.language || 'Unknown'
    }))
  };
}
