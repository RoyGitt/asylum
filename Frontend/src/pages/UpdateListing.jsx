import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../../firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";

const UpdateListing = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listingId, setListingId] = useState("");

  const navigate = useNavigate();

  const params = useParams();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getListingData = async () => {
      try {
        const res = await fetch(`/api/listings/get-listing/${params.id}`);
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListingId(data._id);
        setFormData({
          imageUrls: data.imageUrls,
          name: data.name,
          description: data.description,
          address: data.address,
          type: data.type,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          regularPrice: data.regularPrice,
          discountPrice: data.discountPrice,
          offer: data.offer,
          parking: data.parking,
          furnished: data.furnished,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    getListingData();
  }, []);

  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  console.log(formData.imageUrls);

  const imageSubmitHandler = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      console.log(promises);
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const imageDeleteHandler = (url) => {
    const newImageUrlArray = formData.imageUrls.filter(
      (imageURL) => imageURL !== url
    );

    setFormData((prev) => {
      return { ...prev, imageUrls: newImageUrlArray };
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData((prev) => {
        return {
          ...prev,
          type: e.target.id,
        };
      });
    }

    if (
      e.target.id === "furnished" ||
      e.target.id === "parking" ||
      e.target.id === "offer"
    ) {
      setFormData((prev) => {
        return { ...prev, [e.target.id]: e.target.checked };
      });
    }
    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData((prev) => {
        return { ...prev, [e.target.id]: e.target.value };
      });
    }
  };
  const updateListingHandler = async (e) => {
    e.preventDefault();
    if (formData.regularPrice < formData.discountPrice) {
      setError("Regular price must be more than the discounted price");
      return;
    }
    try {
      setError(false);
      setLoading(true);
      const res = await fetch(`/api/listings/update-listing/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });

      const data = res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      }
      setLoading(false);
      navigate(`/listings/${listingId}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-4 max-w-4xl mx-auto min-h-screen">
      <h1 className="font-semibold text-center my-7 mb-10 pt-20 text-5xl text-slate-300">
        Update Listing
      </h1>
      <form
        className="flex flex-col sm:flex-row gap-4 text-slate-300"
        onSubmit={updateListingHandler}
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
            id="name"
            onChange={handleChange}
            value={formData.name}
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                onChange={handleChange}
                required
                className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" ? (
                  <span className="text-xs">(₹ / month)</span>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="10000000"
                onChange={handleChange}
                required
                className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
                value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                {formData.type === "rent" ? (
                  <span className="text-xs">(₹ / month)</span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-slate-300 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 text-slate-300 bg-slate-900 rounded w-full file:text-slate-300 file:bg-slate-800 file:outline-none file:border-none file:px-3 file:py-2 file:rounded-md file:mr-2"
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={imageSubmitHandler}
              className="p-3 text-slate-300 bg-slate-900 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.map((url) => {
            return (
              <div
                className="flex justify-between p-3 items-center bg-slate-950 rounded-md"
                key={url}
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    imageDeleteHandler(url);
                  }}
                  className="flex items-center gap-1 bg-red-500 text-white py-2 px-4 rounded-md font-semibold"
                >
                  Delete <MdDeleteOutline />
                </button>
              </div>
            );
          })}

          <button
            type="submit"
            disabled={loading || error}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {uploading ? "Waiting..." : "Update"}
          </button>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </form>
    </main>
  );
};
export default UpdateListing;
