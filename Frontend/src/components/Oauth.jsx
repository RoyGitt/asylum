import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "../../firebase";
import { useDispatch } from "react-redux";
import {
  signInFail,
  signInStart,
  signInSuccess,
} from "../redux/user/user.slice";
import { useNavigate } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";

const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    dispatch(signInStart());
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFail(error.message));
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="flex items-center justify-center gap-3 bg-slate-50 shadow-sm text-slate-700  py-1 rounded-md text-xl capitalize"
    >
      Continue with google <FcGoogle />
    </button>
  );
};

export default Oauth;
