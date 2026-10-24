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
      className="flex w-max mx-auto mt-10"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="border border-gray-900 rounded-4xl relative w-80 md:w-100">
        <input
          ref={inputRef}
          type="text"
          placeholder="Username eg. tehdi-seid"
          value={inputText}
          onChange={(e) => handleInpuet(e)}
          className="w-full outline-0 px-5 py-2 text-[18px] placeholder:text-md "
        />
        <div className="absolute right-0 top-0 flex justify-center items-center h-full rounded-r-full bg-purple-900 px-4 text-gray-300 font-bold">
          <button type="submit" className="text-2xl cursor-pointer">
            <FaMagnifyingGlass />
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchForm;
