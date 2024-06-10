"use client";

import { MdSearch } from "react-icons/md";

interface SearchFieldProps {
  placeholder: string;
}

const Search: React.FC<SearchFieldProps> = ({ placeholder }) => {
  return (
    <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg w-max">
      <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent border-none text-white outline-none"
      />
    </div>
  );
};

export default Search;
