import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import app from "../../firebase";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import {
  deleteFail,
  deleteStart,
  deleteSuccess,
  signInStart,
  signOutFail,
  signOutStart,
  signOutSuccess,
  updateFail,
  updateStart,
  updateSuccess,
} from "../redux/user/user.slice";
import { Link, useNavigate } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { BiSolidShow } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const { currentUser, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);

  const [data, setData] = useState({});
  console.log(data);

  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // Get the firebase storage for this app
    const storage = getStorage(app);

    // Create a file name and add a date and time so that there are no name clashes
    const fileName = new Date().getTime() + file.name;

    // Create the storage reference by using  the storage and the filename
    const storageRef = ref(storage, fileName);

    // Create the upload task for starting uploading
    const uploadTask = uploadBytesResumable(storageRef, file);

    //Start Uploading
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prev) => {
            return { ...prev, avatar: downloadURL };
          })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };
  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFail(data.message));
        setData(data);
        return;
      }
      setData(data);

      dispatch(updateSuccess(data));
    } catch (error) {
      dispatch(updateFail(error.message));
    }
  };

  const deleteUserAccount = async () => {
    try {
      deleteStart();
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        deleteFail(data.message);
        return;
      }
      deleteSuccess();
      navigate("/sign-in");

      console.log(data);
    } catch (error) {
      deleteFail(error.message);
    }
  };

  const signOutHandler = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`/api/auth/signout/${currentUser._id}`);
      const data = res.json;

      if (data.success === false) {
        dispatch(signOutFail(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFail(error.message));
    }
  };

  const showUserListingsHandler = async () => {
    try {
      setShowListingsError(false);
      setShowListings(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(data.message);
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(error.message);
    }
  };

  const deleteListingHandler = async () => {
    try {
      const res = await fetch(
        `/api/listings/delete-listing/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      setUserListings(data);
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main>
      <section className="py-16 w-full max-w-xl mx-auto pt-40 p-4">
        <h1 className="text-center text-6xl text-slate-300 font-semibold  ">
          Profile
        </h1>
        <form
          className="flex flex-col gap-4 justify-center p-4"
          onSubmit={handleSubmit}
        >
          <input
            type="file"
            ref={fileRef}
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            className="hidden"
          />
          <img
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className="w-40 h-40  rounded-full self-center object-cover hue-rotate-60 my-10"
            onClick={() => fileRef.current.click()}
          />
          {file && (
            <div className="text-center font-semibold text-green-500 self-center ">
              {!fileUploadError && (
                <>
                  {" "}
                  {filePerc === 100 ? (
                    <p>Success</p>
                  ) : (
                    <p> Uploading {filePerc}%</p>
                  )}
                </>
              )}
              {fileUploadError && (
                <p className="text-center font-semibold text-red-400 self-center ">
                  Error Uploading file!
                </p>
              )}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
            onChange={handleChange}
            id="username"
            defaultValue={currentUser.username}
          />
          <input
            type="email"
            placeholder="Email"
            className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
            onChange={handleChange}
            id="email"
            defaultValue={currentUser.email}
          />
          <input
            type="password"
            placeholder="Password"
            className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
            onChange={handleChange}
            id="password"
          />
          <button
            disabled={
              !formData.username && !formData.email && !formData.password
            }
            type="submit"
            className="flex items-center justify-center gap-2 bg-purple-700 text-white py-2 rounded-md text-xl uppercase hover:opacity-90 disabled:opacity-60 "
          >
            Update <RxUpdate />
          </button>
          <button
            disabled={false}
            className="flex items-center gap-2 justify-center bg-slate-950 text-white py-2 rounded-md text-xl uppercase hover:opacity-90 disabled:opacity-60 "
            onClick={() => {
              navigate("/create-listing");
            }}
          >
            CREATE LISTING <MdOutlineLibraryAdd />
          </button>
        </form>
        <div className="flex justify-between  p-4">
          <button
            className="flex items-center gap-1 bg-slate-950 text-white py-2 px-4 rounded-md font-semibold"
            onClick={deleteUserAccount}
          >
            Delete Account <MdDeleteOutline className="text-red-500" />
          </button>
          <button
            className="flex items-center gap-1 bg-slate-950 text-white py-2 px-4 rounded-md font-semibold"
            onClick={signOutHandler}
          >
            Sign Out <MdLogout className="text-red-500" />
          </button>
        </div>
        {!error && data._id && (
          <p className="text-green-500 text-center font-semibold">
            Successfully Updated!
          </p>
        )}

        {error && data.message && (
          <p className="text-red-500 text-center font-semibold">
            Error : {error}! 🥲
          </p>
        )}
        <button
          className="flex items-center gap-2 text-slate-950 font-semibold  text-xl px-6 py-2 rounded-3xl mt-10 bg-slate-300 w-max mx-auto"
          onClick={showUserListingsHandler}
        >
          Show Listings
        </button>
        <p className="text-red-700 mt-5">
          {showListingsError && "Error showing listings"}
        </p>
        {userListings && showListings && userListings.length > 0 && (
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-slate-300 my-7 text-5xl font-semibold">
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className=" rounded-lg p-3 flex justify-between items-center gap-4 bg-slate-950 "
              >
                <Link to={`/listings/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="h-16 w-16 object-contain "
                  />
                </Link>
                <Link
                  className="text-slate-300 font-semibold  hover:underline truncate flex-1"
                  to={`/listings/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col ">
                  <button
                    className="text-red-700 uppercase flex items-center rounded-md justify-center gap-1 bg-slate-300 font-semibold py-1 px-2 mb-2 w-full"
                    onClick={deleteListingHandler}
                  >
                    Delete <MdDeleteOutline />
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase flex items-center rounded-md justify-center gap-1 bg-slate-300  font-semibold py-1 px-2 w-full">
                      Edit <FaEdit />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {userListings.length === 0 && showListings && (
          <h1 className="text-center mt-7 text-2xl font-semibold text-slate-300">
            No listings found 🥲
          </h1>
        )}
      </section>
    </main>
  );
};

export default Profile;
