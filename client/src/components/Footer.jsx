import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex flex-col font-semibold bg-slate-950 text-slate-300 px-4 py-10 text-center">
      Developed by Arannyak Roy
      <a
        href="https://github.com/RoyGitt"
        target="_blank"
        className="flex items-center justify-center gap-2 mt-3"
      >
        Visit my <FaGithub />
      </a>
    </div>
  );
};
export default Footer;
