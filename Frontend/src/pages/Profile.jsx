import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <main>
      <section className="py-16 w-full max-w-xl mx-auto">
        <h1 className="text-center text-3xl font-semibold mb-4">Profile</h1>
        <form className="flex flex-col  gap-4 justify-center p-4">
          <img
            src={currentUser.avatar}
            alt="profile"
            className="w-40 h-40  rounded-full self-center"
          />
          <input
            type="text"
            placeholder="Username"
            className="text-lg px-4 py-2 rounded-md  shadow-sm"
          />
          <input
            type="email"
            placeholder="Email"
            className="text-lg px-4 py-2 rounded-md  shadow-sm"
          />
          <input
            type="password"
            placeholder="Password"
            className="text-lg px-4 py-2 rounded-md  shadow-sm"
          />
          <button className="bg-green-500 text-white font-semibold text-xl py-2 ">
            Update
          </button>
        </form>
        <div className="flex justify-between  p-4">
          <button className="bg-red-400 text-white py-2 px-4 rounded-md font-semibold">
            Delete Account
          </button>
          <button className="bg-red-400 text-white py-2 px-4 rounded-md font-semibold">
            Sign Out
          </button>
        </div>
      </section>
    </main>
  );
};

export default Profile;
