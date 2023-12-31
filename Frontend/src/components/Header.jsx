import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { RiMenu3Fill } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoHomeOutline } from "react-icons/io5";
import { IoLogoElectron } from "react-icons/io5";

const Header = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const toggleMenuHandler = () => {
    setToggleMenu((prev) => !prev);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="bg-slate-900 shadow-md ">
      <div className="bg-slate-900 flex justify-between items-center max-w-6xl mx-auto py-3 px-4 sm:px-0 fixed sm:relative  sm:gap-4 gap-6 z-10">
        <h1 className="font-bold text-xl sm:text-3xl flex flex-wrap">
          <Link to="/" className="flex items-center">
            <span className="text-slate-300 text-4xl font-light tracking-widest">
              A
            </span>
            <span className="text-purple-400 tracking-widest ">sylum</span>
            <IoHomeOutline className="text-white" />
          </Link>
        </h1>
        <form
          onSubmit={searchHandler}
          className="flex items-center bg-slate-500 w-full sm:flex-[0.7] sm:w-64 rounded-lg py-2 px-2 "
        >
          <input
            className=" bg-transparent focus:outline-none w-[100%] text-slate-300 placeholder:text-slate-300  px-3"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleChange}
          />
          <button>
            <FaSearch className="text-purple-200" />
          </button>
        </form>
        <ul className="hidden sm:flex gap-5 items-center font-semibold text-lg text-slate-300">
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
            className="text-5xl sm:hidden block text-slate-300"
            onClick={toggleMenuHandler}
          />
        ) : (
          <RiMenu3Fill
            className="text-5xl sm:hidden block text-slate-300"
            onClick={toggleMenuHandler}
          />
        )}

        <ul
          className={`flex flex-col fixed w-full z-50  top-[4.5rem] rounded-tl-lg rounded-bl-lg shadow-2xl right-1  px-4 py-6 bg-slate-700 text-white h-max
         gap-8  items-center font-semibold text-lg transition-all  ${
           toggleMenu ? "translate-y-[0%]" : "translate-y-[-150%]"
         }`}
        >
          <li className="cursor-pointer " onClick={toggleMenuHandler}>
            <Link to="/" className="flex text-xl gap-4 items-center">
              Home <IoHomeOutline className="text-3xl" />
            </Link>
          </li>
          <li className="cursor-pointer " onClick={toggleMenuHandler}>
            <Link to="/about" className="text-xl flex gap-4 items-center">
              About <IoLogoElectron className="text-3xl" />
            </Link>
          </li>
          <li className="cursor-pointer " onClick={toggleMenuHandler}>
            {currentUser ? (
              <Link to="/profile" className="flex gap-4 text-xl  items-center">
                Profile
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
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
