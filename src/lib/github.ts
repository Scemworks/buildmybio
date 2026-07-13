export interface GitHubData {
  username: string;
  name: string;
  location: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  topProjects: { name: string; url: string; language: string | null }[];
}

export async function fetchGitHubData(username: string): Promise<GitHubData> {
  const userRes = await fetch(`https://api.github.com/users/${username}`);
  if (!userRes.ok) throw new Error('User not found');
  const user = await userRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
  let totalStars = 0;
  let topProjects: { name: string; html_url: string; language: string | null; stargazers_count: number }[] = [];

  if (reposRes.ok) {
    const repos = await reposRes.json();
    for (const repo of repos) {
      totalStars += repo.stargazers_count || 0;
    }
    
    // Sort by stars descending
    topProjects = repos.sort((a: any, b: any) => b.stargazers_count - a.stargazers_count).slice(0, 3);
  }

  return {
    username: user.login,
    name: user.name || user.login,
    location: user.location || 'The Internet',
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalStars,
    topProjects: topProjects.map(p => ({
      name: p.name,
      url: p.html_url,
      language: p.language || 'Unknown'
    }))
  };
}
