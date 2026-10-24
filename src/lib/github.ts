export type Repo = {
  id: string;
  name: string;
  clone_url: string;
  description?: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
};

export class GithubError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "GithubError";
  }
}

export async function fetchRepo(
  userName: string,
  signal?: AbortSignal,
): Promise<Repo[]> {
  const url = new URL(
    `https://api.github.com/users/${encodeURIComponent(userName)}/repos`,
  );

  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/vnd.github+json" },
  });

  const data = (await res.json()) as Repo[];
  console.log(data);
  if (res.status === 404)
    throw new GithubError(`No GitHub user named "${userName}"`, 404);
  if (!res.ok) throw new Error("something unExpected happen!");

  return data;
}

// export function sortRepos(repo: Repo[], sortKey: string) {}
