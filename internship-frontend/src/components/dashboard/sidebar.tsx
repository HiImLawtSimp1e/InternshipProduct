"use client";

import Image from "next/image";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdWork,
  MdAnalytics,
  MdPeople,
  MdLogout,
  MdStorage,
  MdCategory,
  MdOutlinePostAdd,
  MdDvr,
  MdArticle,
  MdAirplaneTicket,
} from "react-icons/md";
import MenuLink from "./menu-link";
import { ReactNode } from "react";
import { setLogoutPublic } from "@/services/auth-service/auth-service";

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
  const handleLogout = () => {
    setLogoutPublic();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

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
          title: "Product Attributes",
          path: "/dashboard/product-attributes",
          icon: <MdDvr />,
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
          title: "Orders",
          path: "/dashboard/orders",
          icon: <MdArticle />,
        },
        {
          title: "Counter Sales",
          path: "/dashboard/counter-sales",
          icon: <MdArticle />,
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
        {
          title: "Vouchers",
          path: "/dashboard/vouchers",
          icon: <MdAirplaneTicket />,
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
      <span className="px-5 text-gray-500 font-bold text-xs my-2 block">
        User
      </span>
      <div className="mx-2">
        <button
          onClick={handleLogout}
          type="submit"
          className="p-5 w-full flex items-center gap-2 my-1 rounded-lg hover:bg-gray-700"
        >
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
