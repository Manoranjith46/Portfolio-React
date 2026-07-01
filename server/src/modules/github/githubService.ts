import { env } from '../../config/env.js';
import { generateProjectSummary } from '../ai/aiService.js';
import { getDocument, setDocument } from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';

const GITHUB_USERNAME = 'Manoranjith46';

/**
 * Fetch repositories list from GitHub API.
 * Falls back to mock repos if GITHUB_CLIENT_ID is not configured or in case of errors.
 */
export async function fetchGitHubRepos(): Promise<any[]> {
  if (!env.GITHUB_CLIENT_ID && !env.GITHUB_CLIENT_SECRET) {
    console.warn('[GitHub] GITHUB_CLIENT_* keys missing. Falling back to mock repositories.');
    return getMockGitHubRepos();
  }

  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;
  const headers: Record<string, string> = {
    'User-Agent': 'Portfolio-OS-Server',
    Accept: 'application/vnd.github.v3+json',
  };

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    const credentials = Buffer.from(`${env.GITHUB_CLIENT_ID}:${env.GITHUB_CLIENT_SECRET}`).toString('base64');
    headers['Authorization'] = `Basic ${credentials}`;
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }
    return (await response.json()) as any[];
  } catch (err) {
    console.error('[GitHub] Fetch repositories failed. Falling back to mock repositories:', err);
    return getMockGitHubRepos();
  }
}

/**
 * Fetch repository README file text from GitHub API.
 */
export async function fetchRepoReadme(repoName: string): Promise<string> {
  const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`;
  const headers: Record<string, string> = {
    'User-Agent': 'Portfolio-OS-Server',
    Accept: 'application/vnd.github.v3+json',
  };

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    const credentials = Buffer.from(`${env.GITHUB_CLIENT_ID}:${env.GITHUB_CLIENT_SECRET}`).toString('base64');
    headers['Authorization'] = `Basic ${credentials}`;
  }

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return '';
    const data = (await response.json()) as any;
    if (data.content && data.encoding === 'base64') {
      return Buffer.from(data.content, 'base64').toString('utf8');
    }
    return '';
  } catch (err) {
    console.error(`[GitHub] Fetch README failed for ${repoName}:`, err);
    return '';
  }
}

/**
 * Synchronizes repositories into the database, generating AI description summaries if necessary.
 */
export async function syncAllRepos(): Promise<void> {
  try {
    const repos = await fetchGitHubRepos();
    // Limit to top 15 recently updated repos to prevent rate limits
    const activeRepos = repos.slice(0, 15);

    for (const repo of activeRepos) {
      const existing = await getDocument<any>(Collections.GITHUB_REPOS, repo.name);

      let description = repo.description || '';
      let readme = '';

      // Generate AI summary if description is thin
      if (description.length < 50) {
        readme = await fetchRepoReadme(repo.name);
        if (readme) {
          try {
            const aiSummary = await generateProjectSummary(readme, repo.name, [repo.language || '']);
            description = aiSummary.overview;
          } catch (err) {
            console.error(`[GitHub] AI summary generation failed for ${repo.name}:`, err);
          }
        }
      }

      const repoDoc = {
        repoName: repo.name,
        description: description || 'No description provided.',
        topics: repo.topics || [],
        languages: repo.language ? [repo.language] : [],
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        lastUpdated: repo.updated_at,
        repoUrl: repo.html_url,
        liveUrl: repo.homepage || '',
        license: repo.license?.name || '',
        readme,
        published: existing?.published ?? false,
        hidden: existing?.hidden ?? false,
        pinned: existing?.pinned ?? false,
        featured: existing?.featured ?? false,
      };

      await setDocument(Collections.GITHUB_REPOS, repo.name, repoDoc);
    }
  } catch (err) {
    console.error('[GitHub] syncAllRepos failed:', err);
    throw err;
  }
}

function getMockGitHubRepos(): any[] {
  return [
    {
      name: 'Portfolio-React',
      description: 'Single-user Portfolio Management Platform built with React and TypeScript.',
      topics: ['react', 'typescript', 'vite', 'zustand'],
      language: 'TypeScript',
      stargazers_count: 5,
      forks_count: 2,
      updated_at: new Date().toISOString(),
      html_url: 'https://github.com/Manoranjith46/Portfolio-React',
      homepage: 'https://manoranjithd.vercel.app',
    },
    {
      name: 'Video-Conferencing-App',
      description: 'Video conferencing web application utilizing ReactJS and ZegoCloud.',
      topics: ['react', 'video-chat', 'zegocloud'],
      language: 'JavaScript',
      stargazers_count: 3,
      forks_count: 1,
      updated_at: new Date().toISOString(),
      html_url: 'https://github.com/Manoranjith46/Video-Conferencing-App',
      homepage: 'https://km-pg.vercel.app/login',
    },
  ];
}
