import { useState, useEffect, type ChangeEvent } from "react";
import { fetchRepo } from "../lib/github";
import { type Repo } from "../lib/github";
import { LuLoaderCircle } from "react-icons/lu";
import { VscLinkExternal } from "react-icons/vsc";
// import Sort from "./Sort";

export type state =
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
        setState({
          status: "success",
          repos: repo.sort((a, b) => b.stargazers_count - a.stargazers_count),
        });
        console.log(repo);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        const message = err instanceof Error ? err.message : "sth wents wrong";

        setState({ status: "error", message: message });
      }
    }

    featch();

    return () => {
      controller.abort();
    };
  }, [userName]);

  if (state.status === "idle")
    return (
      <div className="flex justify-center mt-10 text-xl capitalize bg-linear-90 from-purple-950 to-pink-950 w-max mx-auto text-transparent bg-clip-text font-semibold shadow-lg">
        <p className="bg-line">enter a user name</p>
      </div>
    );

  if (state.status === "loading")
    return (
      <div>
        <div className="flex justify-center items-center flex-col mt-5">
          <LuLoaderCircle className="text-3xl animate-spin  mb-3 text-purple-900" />
          <p className="text-lg text-purple-950">loading, please wait....</p>
        </div>
      </div>
    );
  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "statrs" && state.status === "success") {
      setState({
        status: "success",
        repos: state.repos.sort(
          (a, b) => b.stargazers_count - a.stargazers_count,
        ),
      });
    } else if (
      e.target.value === "alphabetically" &&
      state.status === "success"
    ) {
      setState({
        status: "success",
        repos: state.repos.toSorted((a, b) => a.name.localeCompare(b.name)),
      });
    } else {
      state.status === "success" &&
        setState({
          status: "success",
          repos: state.repos.toSorted((a, b) =>
            b.updated_at.localeCompare(a.updated_at),
          ),
        });
    }
    if (state.status === "error")
      return (
        <div>
          <p>unable to fetch repositories</p>
        </div>
      );
  }

  return (
    <div className="grid md:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4 mt-7 max-w-full">
      <div className="col-span-full flex capitalize flex-wrap justify-between">
        <h2 className="text-2xl md:text-4xl font-bold">repos</h2>
        <select
          className="border border-purple-950 rounded-lg px-3 capitalize outline-0 text-sm"
          onChange={(e) => handleChange(e)}
        >
          <option value="statrs">statrs</option>
          <option value="alphabetically">alphabetically</option>
          <option value="latest update">latest update</option>
        </select>
      </div>
      {state.status === "success" &&
        state.repos.map((repo) => (
          <div
            key={repo.id}
            className="flex gap-5 flex-col border border-gray-400 p-7 text-gray-800 rounded-2xl bg-gray-300 shadow-md shadow-gray-400 justify-between hover:scale-102 transition-transform duration-300 ease-out"
          >
            <div className="flex justify-between items-center gap-3 capitalize">
              <h3 className="md:text-2xl  font-bold text-purple-900">
                {repo.name}
              </h3>
              <a
                href={repo.clone_url}
                target="_blank"
                className="flex items-center hover:text-purple-950 md:text-[16px] text-xs hover:text-shadow-sm hover:text-shadow-purple-400 transition-all duration-300m ease-out text-purple-900"
              >
                see repository
                <VscLinkExternal className="p-0.5 text-lg md:text-xl ml-1" />
              </a>
            </div>
            <div className="capitalize flex flex-col justify-between">
              {repo.description === null ? (
                <p className="text-center">no description.</p>
              ) : (
                <p>{repo.description}</p>
              )}

              <p className="text-right text-[12px] mt-5">
                {new Date(repo.updated_at).toLocaleDateString()}
              </p>
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
