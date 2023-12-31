import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFail,
  signInStart,
  signInSuccess,
} from "../redux/user/user.slice";
import Oauth from "../components/Oauth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [inputError, setInputError] = useState(null);

  const { loading, error, currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (formData.email && formData.password) {
      setInputError(false);
    } else setInputError(true);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch("api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(signInFail(data.message));
      }
      if (data.email) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
      setFormData({});
    } catch (error) {
      dispatch(signInFail(error.message));
    }
  };

  return (
    <main className="max-w-lg mx-auto p-4 pt-40 min-h-screen">
      <div className="flex flex-col ">
        <h1 className="text-6xl text-center my-[40px] font-semibold text-slate-300">
          Sign In
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
            type="email"
            placeholder="Email"
            id="email"
            onChange={handleChange}
            required
          />
          <input
            className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
            required
          />
          <button
            disabled={inputError}
            className="bg-purple-700 text-white py-2 rounded-md text-xl uppercase hover:opacity-90 disabled:opacity-60 "
          >
            {loading ? "Loading..." : "Sign in"}
          </button>
          <Oauth />
        </form>
      </div>
      <div className="flex gap-1 mt-3">
        <p className="text-slate-300">Create an account?</p>
        <Link to="/sign-up">
          <span className="text-purple-400">Sign Up</span>
        </Link>
      </div>
      {error && <p className="mt-3 text-[#eb4d4b]">{error}</p>}
    </main>
  );
};

export default SignUp;
