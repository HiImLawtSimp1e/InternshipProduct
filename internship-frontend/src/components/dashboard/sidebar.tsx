import Image from "next/image";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdOutlineSettings,
  MdHelpCenter,
  MdLogout,
  MdStorage,
  MdCategory,
  MdOutlinePostAdd,
} from "react-icons/md";
import MenuLink from "./menu-link";
import { ReactNode } from "react";

interface MenuCategory {
  title: string;
  list: MenuItem[];
}

interface MenuItem {
  title: string;
  path: string;
  icon: ReactNode;
}

const Sidebar = () => {
  const menuItems: MenuCategory[] = [
    {
      title: "Pages",
      list: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: <MdDashboard />,
        },
        {
          title: "Product Types",
          path: "/dashboard/product-types",
          icon: <MdStorage />,
        },
        {
          title: "Products",
          path: "/dashboard/products",
          icon: <MdShoppingBag />,
        },
        {
          title: "Category",
          path: "/dashboard/category",
          icon: <MdCategory />,
        },
        {
          title: "Users",
          path: "/dashboard/users",
          icon: <MdSupervisedUserCircle />,
        },
        {
          title: "Posts",
          path: "/dashboard/posts",
          icon: <MdOutlinePostAdd />,
        },
      ],
    },
    {
      title: "Analytics",
      list: [
        {
          title: "Revenue",
          path: "/dashboard/revenue",
          icon: <MdWork />,
        },
        {
          title: "Reports",
          path: "/dashboard/reports",
          icon: <MdAnalytics />,
        },
        {
          title: "Teams",
          path: "/dashboard/teams",
          icon: <MdPeople />,
        },
      ],
    },
    {
      title: "User",
      list: [
        {
          title: "Settings",
          path: "/dashboard/settings",
          icon: <MdOutlineSettings />,
        },
        {
          title: "Help",
          path: "/dashboard/help",
          icon: <MdHelpCenter />,
        },
      ],
    },
  ];
  return (
    <div className="sticky top-10">
      <div className="flex items-center p-5 gap-5">
        <Image
          className="rounded-full object-cover"
          src={"/noavatar.png"}
          alt=""
          width="50"
          height="50"
        />
        <div className="flex flex-col">
          <span className="font-medium">Lawther Nguyen</span>
          <span className="text-xs text-gray-500">Administrator</span>
        </div>
      </div>
      <ul className="list-none">
        {menuItems.map((cat: MenuCategory) => (
          <li key={cat.title}>
            <span className="px-5 text-gray-500 font-bold text-xs my-2 block">
              {cat.title}
            </span>
            {cat.list.map((item: MenuItem) => (
              <MenuLink item={item} key={item.title} />
            ))}
          </li>
        ))}
      </ul>
      <form className="mx-2 pb-2">
        <button className="p-5 w-full flex items-center gap-2 my-1 rounded-lg hover:bg-gray-700">
          <MdLogout />
          Logout
        </button>
      </form>
    </div>
  );
};
export default Sidebar;
