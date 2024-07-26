"use client";
import { FormEvent, ChangeEvent, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { useSearchStore } from "@/lib/store/useSearchStore";
import Link from "next/link";

const SearchBar = () => {
  const { suggestions, getSuggestions, clearSuggestions } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const clearInput = () => {
    clearSuggestions();

    // Clear the input field
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const searchText = formData.get("searchText") as string;

    clearInput();

    router.push(`/product/?search=${searchText}`);
  };

  const debouncedHandleChange = useCallback(
    _.debounce((text: string) => {
      getSuggestions(text);
    }, 200),
    [] // Thêm các dependency vào đây nếu cần thiết
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedHandleChange(event.target.value);
  };

  const handleSuggestionClick = (item: string) => {
    clearInput();

    router.push(`/product/?search=${item}`);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1"
      >
        <input
          type="text"
          name="searchText"
          placeholder="Search"
          ref={inputRef}
          onChange={handleChange}
          className="flex-1 bg-transparent outline-none"
        />
        <button type="submit" className="cursor-pointer">
          <Image src="/search.png" alt="Search" width={16} height={16} />
        </button>
      </form>
      {suggestions?.length > 0 && (
        <ul className="mt-2 absolute top-14 left-160 bg-white rounded-md border border-gray-100 w-[40%] shadow-sm z-20 xl:w-[25%] md:shadow-md ">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="px-2 py-1 border-b-2 border-gray-100 relative cursor-pointer hover:bg-lime-50 hover:text-gray-900"
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchBar;
