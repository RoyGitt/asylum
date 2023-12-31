import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [landlord, setLandlord] = useState();

  useEffect(() => {
    const getListingData = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listings/get-listing/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };
    getListingData();
  }, []);

  const showContactsHandler = async () => {
    setContact(true);
    try {
      const res = await fetch(`/api/user/get-user/${listing.userRef}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
      }
      setLandlord(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(listing);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && !loading && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
            className="fixed top-[13%] right-[3%] z-10  rounded-full w-12 h-12 flex justify-center items-center bg-purple-500 cursor-pointer"
          >
            <FaShare className="text-slate-100" />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md  p-2 bg-purple-500 text-slate-100 font-semibold">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4 text-slate-300">
            <h2 className=" flex flex-col text-3xl font-semibold">
              {listing.name}
              <span>
                <span className="text-purple-400 ">₹</span>{" "}
                {listing.offer
                  ? listing.discountPrice.toLocaleString("en-US")
                  : listing.regularPrice.toLocaleString("en-US")}
              </span>
              {listing.type === "rent" && " / month"}
            </h2>
            <p className="flex items-center mt-6 gap-2 text-slate-300  text-md font-semibold">
              <FaMapMarkerAlt className="text-purple-400" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="border-2 border-purple-300 w-full max-w-[200px] text-purple-300 text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-purple-800 font-semibold w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ₹{" "}
                  {(
                    +listing.regularPrice - +listing.discountPrice
                  ).toLocaleString("en-US")}{" "}
                  OFF
                </p>
              )}
            </div>
            <p className="text-slate-300">
              <span className="font-semibold text-slate-300"></span>
              {listing.description}
            </p>
            <ul className="text-slate-300 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-xl text-purple-300" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap ">
                <FaBath className="text-xl text-purple-300" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-xl text-purple-300" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-xl text-purple-300" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {listing.userRef !== currentUser._id && (
              <>
                {!contact && (
                  <button
                    className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                    onClick={showContactsHandler}
                  >
                    Contact landlord
                  </button>
                )}

                {landlord && (
                  <div>
                    <p>
                      Contact{" "}
                      <span className="font-semibold">{landlord.username}</span>{" "}
                      for{" "}
                      <span className="font-semibold">
                        {listing.name.toLowerCase()}
                      </span>
                    </p>
                    {contact && (
                      <Contact landlord={landlord} listing={listing} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
export default Listing;
