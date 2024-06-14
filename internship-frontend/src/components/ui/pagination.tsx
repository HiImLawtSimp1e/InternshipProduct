import Link from "next/link";

interface IProps {
  pages: number;
  currentPage: number;
  pageSize: number;
}

const Pagination = ({ pages, currentPage, pageSize }: IProps) => {
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <ul className="mt-5 float-right inline-flex -space-x-px text-sm">
      <li>
        <button
          className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-e-0 rounded-s-lg bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 ${
            currentPage === 1
              ? "cursor-not-allowed pointer-events-none opacity-50"
              : ""
          }`}
        >
          <Link href={currentPage === 1 ? "#" : `?page=${currentPage - 1}`}>
            Previous
          </Link>
        </button>
      </li>
      {pageNumbers.map((page) => (
        <li key={page}>
          <Link href={currentPage === page ? "#" : `?page=${page}`}>
            <button
              className={`flex items-center justify-center px-3 h-8 leading-tight ${
                currentPage === page
                  ? "border border-gray-700 bg-gray-700 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {page}
            </button>
          </Link>
        </li>
      ))}
      <li>
        <button
          className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-e-0 rounded-e-lg bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 ${
            currentPage === pages
              ? "cursor-not-allowed pointer-events-none opacity-50"
              : ""
          }`}
        >
          <Link href={`?page=${currentPage + 1}`}>Next</Link>
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
