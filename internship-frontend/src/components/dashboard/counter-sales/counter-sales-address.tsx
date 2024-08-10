"use client";

import { useSearchAddressStore } from "@/lib/store/useSearchAddressStore";
import _ from "lodash";
import { ChangeEvent, useCallback, useRef } from "react";
import { MdSearch } from "react-icons/md";
import CounterSalesAddressForm from "./counter-sales-address-form";

const CounterSalesAddress = () => {
  const { addressList, getAddresses, setAddress, clearAddresses } =
    useSearchAddressStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    clearAddresses();

    // Clear the input field
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const debouncedHandleChange = useCallback(
    _.debounce((text: string) => {
      getAddresses(text);
    }, 200),
    [] // Thêm các dependency vào đây nếu cần thiết
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedHandleChange(event.target.value);
  };

  const handleSuggestionClick = (address: IAddress) => {
    setAddress(address);
    clearInput();
  };

  return (
    <div className="p-5 rounded-lg bg-gray-600">
      <div className="p-2 flex items-center gap-2 bg-gray-700 rounded-lg w-max">
        <MdSearch />
        <input
          type="text"
          name="searchText"
          placeholder="Search Address..."
          ref={inputRef}
          onChange={handleChange}
          className="bg-transparent border-none text-white outline-none"
        />
      </div>
      <div className="relative">
        {addressList?.length > 0 && (
          <ul className="mt-2 absolute left-160 w-full shadow-md z-20">
            {addressList.map((item: IAddress, index) => (
              <li
                key={index}
                className="p-1 bg-slate-800 border border-slate-200 relative cursor-pointer hover:bg-slate-700"
                onClick={() => handleSuggestionClick(item)}
              >
                <div className="text-sm leading-6">
                  <figure className="relative flex flex-col py-2 px-4">
                    <figcaption className="flex items-center">
                      <div className="flex flex-col gap-2">
                        <div className="text-base text-slate-200 font-semibold">
                          {item.fullName}
                        </div>
                        <div className="text-slate-300">{item.email}</div>
                        <div className="text-slate-300">{item.phone}</div>
                        <div className="text-slate-300">{item.address}</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <CounterSalesAddressForm />
    </div>
  );
};

export default CounterSalesAddress;
