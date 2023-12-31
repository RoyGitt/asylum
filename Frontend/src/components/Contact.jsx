import { useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ landlord, listing }) => {
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <textarea
        name="message"
        id="message"
        rows="4"
        value={message}
        onChange={handleChange}
        placeholder="Enter your message here..."
        className="py-1 px-4 shadow-sm text-lg rounded-lg focus:outline-none bg-slate-500 placeholder:text-purple-200 text-slate-300"
      />
      <Link
        to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
        className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
      >
        Send
      </Link>
    </div>
  );
};
export default Contact;
