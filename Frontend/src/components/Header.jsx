import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-slate-300 shadow-md">
      <div className="flex justify-around items-center py-5 ">
        <h1 className="font-bold text-sm sm:text-3xl flex flex-wrap">
          <Link to="/">
            <span className="text-slate-500 tracking-widest">Roy</span>
            <span className="text-slate-700 ">Estate</span>
          </Link>
        </h1>
        <form className="flex items-center bg-slate-100 flex-[0.4] rounded-md py-2 px-3 ">
          <input
            className=" bg-transparent focus:outline-none w-[100%]"
            type="text"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-5 items-center font-semibold text-lg text-slate-700">
          <li className="cursor-pointer ">
            <Link to="/">Home</Link>
          </li>
          <li className="cursor-pointer ">
            <Link to="/about">About</Link>
          </li>
          <li className="cursor-pointer ">
            <Link to="/sign-up"> Sign Up</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
