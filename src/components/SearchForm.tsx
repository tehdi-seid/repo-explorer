import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

function SearchForm({ onSearch }: { onSearch: (userName: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  inputRef.current?.focus();
  console.log(inputRef);
  const [inputText, setInputText] = useState("");
  function handleInpuet(e: ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearch(inputText);
  }

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <form
      className="flex md:mt-10 mt-6 md:w-1/2 mx-auto w-full relative border rounded-4xl border-gray-900"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="username eg. tehdi-seid"
        value={inputText}
        onChange={(e) => handleInpuet(e)}
        className="w-full outline-0 md:px-5 md:py-2 px-4 py-1.5 md:text-[18px]"
      />
      <div className="absolute right-0 top-0 flex justify-center items-center h-full rounded-r-full bg-purple-900 px-4 text-gray-300 font-bold border border-purple-900">
        <button type="submit" className="md:text-2xl cursor-pointer">
          <FaMagnifyingGlass />
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
