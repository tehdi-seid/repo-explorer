// import React from "react";

import { useState } from "react";
import SearchForm from "./components/SearchForm.tsx";
import RepoExplorer from "./components/RepoExplorer.tsx";

function App() {
  const [userName, setUserName] = useState("");

  return (
    <div className="">
      <h1 className="md:text-6xl text-3xl font-bold mx-auto w-max bg-linear-90 from-indigo-900 to-purple-900 text-transparent bg-clip-text mt-5">
        Repo-expolorer
      </h1>
      <SearchForm onSearch={setUserName} />

      <RepoExplorer userName={userName} />
    </div>
  );
}

export default App;
