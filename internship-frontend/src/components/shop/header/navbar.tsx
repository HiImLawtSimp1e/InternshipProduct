import Link from "next/link";
import Image from "next/image";
import Menu from "./menu";
import NavIcons from "./nav-icons";
import SearchBar from "./search-bar";

const Navbar = () => {
  return (
    <div className="h-20 py-3 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative bg-light shadow-sm md:shadow-md">
      <div className="flex items-center justify-between md:hidden">
        {/* Moblie */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={24} height={24} />
          <div className="text-2xl tracking-wide">NEXT SHOP</div>
        </Link>
        <Menu />
      </div>
      {/* Tablet & PC  */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <div className="text-2xl tracking-wide">NEXTSHOP</div>
          </Link>
          <div className="hidden xl:flex gap-4">
            <Link href="/">Homepage</Link>
            <Link href="/product">Shop</Link>
            <Link href="/post">Post</Link>
            <Link href="/">Contact</Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="mx-4 w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
