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
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser, error } = useSelector((state) => state.user);
  console.log(currentUser);
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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

  const singOutHandler = async () => {
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

  return (
    <main>
      <section className="py-16 w-full max-w-xl mx-auto">
        <h1 className="text-center text-3xl font-semibold mb-4">Profile</h1>
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
            className="w-40 h-40  rounded-full self-center object-cover"
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
            className="text-lg px-4 py-2 rounded-md  shadow-sm"
            onChange={handleChange}
            id="username"
            defaultValue={currentUser.username}
          />
          <input
            type="email"
            placeholder="Email"
            className="text-lg px-4 py-2 rounded-md  shadow-sm"
            onChange={handleChange}
            id="email"
            defaultValue={currentUser.email}
          />
          <input
            type="password"
            placeholder="Password"
            className="text-lg px-4 py-2 rounded-md  shadow-sm"
            onChange={handleChange}
            id="password"
          />
          <button
            disabled={false}
            type="submit"
            className="bg-blue-700 text-white font-semibold text-xl py-2 disabled:bg-slate-500 disabled:opacity-70"
          >
            Update
          </button>
          <button
            disabled={false}
            className="bg-green-500 text-white font-semibold text-xl py-2 disabled:bg-slate-500 disabled:opacity-70"
            onClick={() => {
              navigate("/create-listing");
            }}
          >
            CREATE LISTING
          </button>
        </form>
        <div className="flex justify-between  p-4">
          <button
            className="bg-red-400 text-white py-2 px-4 rounded-md font-semibold"
            onClick={deleteUserAccount}
          >
            Delete Account
          </button>
          <button
            className="bg-red-400 text-white py-2 px-4 rounded-md font-semibold"
            onClick={singOutHandler}
          >
            Sign Out
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
      </section>
    </main>
  );
};

export default Profile;
