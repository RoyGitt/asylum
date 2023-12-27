import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from "react-redux";

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const toggleMenuHandler = () => {
    setToggleMenu((prev) => !prev);
  };

  return (
    <header className="bg-slate-300 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 gap-4 sm:gap-0">
        <h1 className="font-bold text-xl sm:text-3xl flex flex-wrap">
          <Link to="/">
            <span className="text-slate-500 tracking-widest">Roy</span>
            <span className="text-slate-700 ">Estate</span>
          </Link>
        </h1>
        <form className="flex items-center bg-slate-100 w-full sm:w-64 rounded-lg p-3 ">
          <input
            className=" bg-transparent focus:outline-none w-[100%]"
            type="text"
            placeholder="Search..."
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="hidden sm:flex gap-5 items-center font-semibold text-lg text-slate-700">
          <li className="cursor-pointer ">
            <Link to="/">Home</Link>
          </li>
          <li className="cursor-pointer ">
            <Link to="/about">About</Link>
          </li>
          <li className="cursor-pointer ">
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link to="/sign-up"> Sign Up</Link>
            )}
          </li>
        </ul>
        {toggleMenu ? (
          <MdOutlineClose
            className="text-5xl sm:hidden block"
            onClick={toggleMenuHandler}
          />
        ) : (
          <RiMenu3Fill
            className="text-5xl sm:hidden block"
            onClick={toggleMenuHandler}
          />
        )}

        <ul
          className={`flex flex-col absolute w-2/4 top-[5rem] rounded-tl-lg rounded-bl-lg shadow-2xl right-1 px-4 py-6 bg-slate-700 text-white h-max
         gap-5  items-center font-semibold text-lg transition-all ${
           toggleMenu ? "translate-x-[0%]" : "translate-x-[105%]"
         }`}
        >
          <li className="cursor-pointer ">
            <Link to="/">Home</Link>
          </li>
          <li className="cursor-pointer ">
            <Link to="/about">About</Link>
          </li>
          <li className="cursor-pointer ">
            {currentUser ? (
              <Link to="/profile">
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
            ) : (
              <Link to="/sign-up"> Sign Up</Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
