import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [inputError, setInputError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (formData.username && formData.email && formData.password) {
      setInputError(false);
    } else setInputError(true);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setData(data);
      if (data.success === false) {
        setSubmitError(true);
        console.log(submitError);
        setLoading(false);
      }
      navigate("/");
    } catch (error) {
      setLoading(false);
      setSubmitError(false);
    }

    console.log(submitError);
  };

  return (
    <div className="max-w-lg mx-auto p-2">
      <div className="flex flex-col ">
        <h1 className="text-4xl text-center my-[40px] font-bold">Sign Up</h1>
        <form className="flex flex-col " onSubmit={handleSubmit}>
          <input
            className="mb-3 py-1 px-4 text-lg rounded-md focus:outline-none"
            type="text"
            placeholder="username"
            id="username"
            onChange={handleChange}
          />
          <input
            className="mb-3 py-1 px-4 text-lg rounded-md focus:outline-none"
            type="email"
            placeholder="email"
            id="email"
            onChange={handleChange}
          />
          <input
            className="mb-3 py-1 px-4 text-lg rounded-md focus:outline-none"
            type="password"
            placeholder="password"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={inputError}
            className="bg-slate-700 text-white py-1 rounded-md text-xl uppercase hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
          <Oauth />
        </form>
      </div>
      <div className="flex gap-1 mt-3">
        <p>Have an account?</p>
        <Link to="/sign-up">
          <span className="text-[#5352ed]">Sign Up</span>
        </Link>
      </div>
      {submitError && <p className="mt-3 text-[#eb4d4b]">{data.message}</p>}
    </div>
  );
};

export default SignUp;
