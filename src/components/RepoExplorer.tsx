import { useState, useEffect } from "react";
import { fetchRepo } from "../lib/github";
import { type Repo } from "../lib/github";
import { GoArrowUpRight } from "react-icons/go";

type state =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; repos: Repo[] };

function RepoExplorer({ userName }: { userName: string }) {
  const [state, setState] = useState<state>({ status: "idle" });
  useEffect(() => {
    const controller = new AbortController();

    if (userName.trim() === "") {
      setState({ status: "idle" });
      return;
    }

    async function featch() {
      setState({ status: "loading" });
      try {
        const repo = await fetchRepo(userName, controller.signal);
        setState({ status: "success", repos: repo });
        console.log(repo);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        const message = err instanceof Error ? err.message : "sth wents wrong";

        setState({ status: "error", message: message });
      }
    }

    featch();
  }, [userName]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 mt-7">
      <div className="col-span-full flex justify-between capitalize">
        <h2 className="text-4xl font-bold">repos</h2>
        <select className="border rounded-lg px-5 capitalize outline-0">
          <option value="statrs">statrs</option>
          <option value="name">name</option>
        </select>
      </div>
      {state.status === "success" &&
        state.repos.map((repo) => (
          <div
            key={repo.id}
            className="flex gap-5 flex-col border border-gray-400 p-7 text-gray-800 rounded-2xl bg-gray-300 shadow-md shadow-gray-400 justify-between hover:scale-102 transition-transform duration-300 ease-out"
          >
            <div className="flex justify-between items-center gap-3 capitalize">
              <h3 className="text-2xl font-bold text-purple-900">
                {repo.name}
              </h3>
              <a
                href={repo.clone_url}
                className="flex items-center justify-center hover:text-purple-950 text-[16px] hover:text-shadow-sm hover:text-shadow-purple-400 transition-all duration-300m ease-out text-purple-900"
              >
                see repository
                <GoArrowUpRight className="p-0.5 text-xl ml-2" />
              </a>
            </div>
            <div className="capitalize">
              {repo.description === null ? (
                <p className="text-center">no description.</p>
              ) : (
                repo.description
              )}
            </div>

            <div className="flex justify-between border-t items-center border-t-purple-400">
              <div className="text-xl capitalize font-semibold">
                {repo.stargazers_count === 0 ? (
                  <p className="line-through">stars</p>
                ) : (
                  <p>stars: {repo.stargazers_count}</p>
                )}
              </div>

              <h4 className="text-md font-semibold border border-purple-400 px-4 py-1 rounded-4xl bg-purple-200 shadow-md shadow-purple-300  mt-2">
                {repo.language ? repo.language : "no language"}
              </h4>
            </div>
          </div>
        ))}
    </div>
  );
}

export default RepoExplorer;
