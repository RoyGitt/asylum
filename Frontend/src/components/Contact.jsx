import { useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ landlord, listing }) => {
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        name="message"
        id="message"
        rows="2"
        value={message}
        onChange={handleChange}
        placeholder="Enter your message here..."
        className="w-full border p-3 rounded-lg"
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
