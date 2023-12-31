import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import heroImg from "../assets/hero.jpg";
import { MdRocketLaunch } from "react-icons/md";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          "/api/listings/get-listings?offer=true&limit=4"
        );
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listings/get-listings?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listings/get-listings?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <main>
      <div className="relative h-[70vh]">
        <div className="flex flex-col gap-12 p-[8rem] px-4 max-w-6xl mx-auto backdrop-blur-[2px] w-full h-full">
          <h1 className="text-slate-300 font-bold text-4xl lg:text-6xl">
            Find your next <span className="text-purple-400">perfect</span>
            <br />
            place with ease
          </h1>
          <div className="text-gray-400 text-xl  text-just flex flex-col gap-4">
            <p>
              Welcome to Your Dream Home! Discover exceptional living with our
              exclusive real estate listings.
            </p>
            <p>
              Explore a world of possibilities and let us guide you to your next
              home sweet home. Start your journey today!
            </p>
          </div>
          <Link
            to={"/search"}
            className="flex items-center gap-2 text-xl  text-slate-900 rounded-md font-bold hover:underline bg-slate-300 self-start py-2 px-3"
          >
            Get started <MdRocketLaunch className="text-3xl text-purple-800" />
          </Link>
        </div>

        <div className="h-[70vh] w-full absolute inset-0 z-[-1] brightness-[20%]">
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover bg-top"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 px-4 flex flex-col  mb-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-10">
              <h2 className="text-4xl font-semibold text-slate-300 mb-2">
                Recent offers
              </h2>
              <Link
                className="text-xl text-purple-400 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div>
            <div className="my-10">
              <h2 className="text-4xl font-semibold text-slate-300 mb-2">
                Recent places for rent
              </h2>
              <Link
                className="text-xl text-purple-400 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div>
            <div className="my-10">
              <h2 className="text-4xl font-semibold text-slate-300 mb-2">
                Recent places for sale
              </h2>
              <Link
                className="text-xl text-purple-400 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
