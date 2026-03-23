// ═══════════════════════════════════════════════════════
// BYSS GROUP — GitHub API Integration
// Repo stats, commits, issues for all BYSS projects
// ═══════════════════════════════════════════════════════

const GITHUB_REPOS = [
  { owner: "Oshinsu", repo: "Orion-Global-Marketing", project: "orion" },
  { owner: "Oshinsu", repo: "emploi-ia-france-travail", project: "byss-emploi" },
  { owner: "Oshinsu", repo: "random-rendezvous-now", project: "random" },
  { owner: "Oshinsu", repo: "Evren-Kairos", project: "evren-kairos" },
  { owner: "Oshinsu", repo: "Polyseer", project: "polyseer" },
  { owner: "Oshinsu", repo: "google_ads_mcp_server", project: "google-ads-mcp" },
  { owner: "Oshinsu", repo: "mcp-global-servers", project: "mcp-servers" },
  { owner: "Oshinsu", repo: "mcp-insee", project: "mcp-insee" },
  { owner: "Oshinsu", repo: "agent-seo", project: "agent-seo" },
  { owner: "Oshinsu", repo: "FTMCP", project: "ftmcp" },
  { owner: "Oshinsu", repo: "Manga-Factory-AI", project: "manga-factory" },
  { owner: "Oshinsu", repo: "voice-biz-coach", project: "voice-coach" },
  { owner: "Oshinsu", repo: "sim-nation-saga", project: "sim-nation" },
  { owner: "Oshinsu", repo: "Bixa", project: "bixa" },
  { owner: "Oshinsu", repo: "LORE-FM", project: "lore-fm" },
  { owner: "Oshinsu", repo: "CK2-MOD-AI", project: "ck2-mod" },
  { owner: "Oshinsu", repo: "AIADMAKER", project: "aiadmaker" },
] as const;

export type GitHubProject = (typeof GITHUB_REPOS)[number]["project"];

// ── Cache (5 min TTL) ──
const cache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expires: Date.now() + CACHE_TTL });
}

// ── Auth headers ──
function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "BYSS-CARRIER",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function ghFetch<T>(path: string): Promise<T> {
  const cacheKey = `gh:${path}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`https://api.github.com${path}`, {
    headers: getHeaders(),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} — ${path}`);
  }

  const data = (await res.json()) as T;
  setCache(cacheKey, data);
  return data;
}

// ── Types ──
export interface RepoStats {
  name: string;
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  lastPush: string;
  language: string | null;
  size: number;
  description: string | null;
  defaultBranch: string;
  htmlUrl: string;
  topics: string[];
}

export interface CommitInfo {
  sha: string;
  shortSha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface IssueInfo {
  number: number;
  title: string;
  state: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
  isPullRequest: boolean;
  url: string;
}

export interface AllReposStatus {
  repos: (RepoStats & { project: string })[];
  totalStars: number;
  totalForks: number;
  totalIssues: number;
  lastActivity: string;
  fetchedAt: string;
}

// ── Functions ──

export async function getRepoStats(owner: string, repo: string): Promise<RepoStats> {
  const data = await ghFetch<Record<string, unknown>>(`/repos/${owner}/${repo}`);
  return {
    name: data.name as string,
    fullName: data.full_name as string,
    stars: data.stargazers_count as number,
    forks: data.forks_count as number,
    openIssues: data.open_issues_count as number,
    lastPush: data.pushed_at as string,
    language: data.language as string | null,
    size: data.size as number,
    description: data.description as string | null,
    defaultBranch: data.default_branch as string,
    htmlUrl: data.html_url as string,
    topics: (data.topics as string[]) || [],
  };
}

export async function getRecentCommits(
  owner: string,
  repo: string,
  limit = 5
): Promise<CommitInfo[]> {
  const data = await ghFetch<Record<string, unknown>[]>(
    `/repos/${owner}/${repo}/commits?per_page=${limit}`
  );
  return data.map((c) => {
    const commit = c.commit as Record<string, unknown>;
    const author = commit.author as Record<string, unknown>;
    return {
      sha: c.sha as string,
      shortSha: (c.sha as string).slice(0, 7),
      message: (commit.message as string).split("\n")[0],
      author: author.name as string,
      date: author.date as string,
      url: c.html_url as string,
    };
  });
}

export async function getOpenIssues(
  owner: string,
  repo: string
): Promise<IssueInfo[]> {
  const data = await ghFetch<Record<string, unknown>[]>(
    `/repos/${owner}/${repo}/issues?state=open&per_page=20`
  );
  return data.map((issue) => ({
    number: issue.number as number,
    title: issue.title as string,
    state: issue.state as string,
    author: (issue.user as Record<string, unknown>)?.login as string,
    createdAt: issue.created_at as string,
    updatedAt: issue.updated_at as string,
    labels: ((issue.labels as Record<string, unknown>[]) || []).map(
      (l) => l.name as string
    ),
    isPullRequest: !!issue.pull_request,
    url: issue.html_url as string,
  }));
}

export async function getAllReposStatus(): Promise<AllReposStatus> {
  const cacheKey = "gh:all-repos-status";
  const cached = getCached<AllReposStatus>(cacheKey);
  if (cached) return cached;

  const repos = await Promise.all(
    GITHUB_REPOS.map(async ({ owner, repo, project }) => {
      try {
        const stats = await getRepoStats(owner, repo);
        return { ...stats, project };
      } catch {
        return {
          name: repo,
          fullName: `${owner}/${repo}`,
          stars: 0,
          forks: 0,
          openIssues: 0,
          lastPush: "",
          language: null,
          size: 0,
          description: null,
          defaultBranch: "main",
          htmlUrl: `https://github.com/${owner}/${repo}`,
          topics: [],
          project,
        };
      }
    })
  );

  const result: AllReposStatus = {
    repos,
    totalStars: repos.reduce((s, r) => s + r.stars, 0),
    totalForks: repos.reduce((s, r) => s + r.forks, 0),
    totalIssues: repos.reduce((s, r) => s + r.openIssues, 0),
    lastActivity: repos
      .filter((r) => r.lastPush)
      .sort((a, b) => new Date(b.lastPush).getTime() - new Date(a.lastPush).getTime())[0]
      ?.lastPush || "",
    fetchedAt: new Date().toISOString(),
  };

  setCache(cacheKey, result);
  return result;
}

// ── Helpers ──
export function getRepoConfig(projectSlug: string) {
  return GITHUB_REPOS.find((r) => r.project === projectSlug) || null;
}

export { GITHUB_REPOS };
