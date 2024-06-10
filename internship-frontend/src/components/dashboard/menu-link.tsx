"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface MenuItem {
  title: string;
  path: string;
  icon: ReactNode;
}

interface MenuLinkProps {
  item: MenuItem;
}

const MenuLink = ({ item }: MenuLinkProps) => {
  return (
    <Link
      href={item.path}
      className={
        "p-5 flex items-center gap-2 my-1 mx-2 rounded-lg hover:bg-gray-700"
      }
    >
      <span>{item.icon}</span>
      {item.title}
    </Link>
  );
};

export default MenuLink;
