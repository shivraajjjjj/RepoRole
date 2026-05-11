export function parseRepoUrl(repoUrl) {
  try {
    const url = new URL(repoUrl);

    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
      throw new Error("Not a GitHub URL");
    }

    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length < 2) {
      throw new Error("Invalid GitHub repo URL");
    }

    return {
      owner: parts[0],
      repo: parts[1]
    };
  } catch {
    throw new Error("Invalid repository URL");
  }
}
