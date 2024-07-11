"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import CartModal from "./cart-modal";
import { useCartStore } from "@/lib/custom/customHook";

const NavIcons = () => {
  const { cartItems, counter, totalAmount, getCart } = useCartStore();
  const profileRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    getCart();
  }, [cartItems]);

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const handleProfile = () => {
    setIsCartOpen(false);
    setIsProfileOpen((prev) => !prev);
  };
  const handleCart = () => {
    setIsProfileOpen(false);
    setIsCartOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setIsProfileOpen(false);
    }
    if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
      setIsCartOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
      />
      <div className="relative cursor-pointer" onClick={handleCart}>
        <Image src="/cart.png" alt="" width={22} height={22} />
        {counter >= 1 && (
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-rose-400 rounded-full text-white text-sm flex items-center justify-center">
            {counter}
          </div>
        )}
      </div>
      {isCartOpen && (
        <div
          ref={cartRef}
          className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20"
        >
          <CartModal cartItems={cartItems} totalAmount={totalAmount} />
        </div>
      )}
      {isProfileOpen && (
        <div
          ref={profileRef}
          className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20"
        >
          <Link href="/profile">Profile</Link>
          <div className="mt-2 cursor-pointer">Logout</div>
        </div>
      )}
    </div>
  );
};

export default NavIcons;
