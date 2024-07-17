import { Link } from "react-router-dom";

function Footer() {
  var date = new Date().getFullYear();

  return (
    <div className="flex flex-col w-full bg-slate-900 font-sans text-sm sm:text-md xl:text-base">
      <div className="flex flex-wrap justify-between gap-6 px-4 py-8 text-white sm:justify-evenly">
        <div className="flex flex-col gap-1 xl:gap-2">
          <h3 className="text-lg font-bold hover:none mb-1 xl:mb-2">Pages</h3>
          <Link to="/" className="hover:text-red-600">
            Home
          </Link>
          <Link to="/packages" className="hover:text-red-600">
            Posts
          </Link>
          <Link to="/about" className="hover:text-red-600">
            About
          </Link>
          <Link to="/ab sb" className="hover:text-red-600">
            Contact
          </Link>
          <Link to="/terms" className="hover:text-red-600">
            Terms & Services
          </Link>
          <Link to="/about" className="hover:text-red-600">
            About
          </Link>
        </div>
        <div className="flex flex-col gap-1 xl:gap-2">
          <h3 className="text-lg font-bold hover:none mb-1 xl:mb-2">Sites</h3>
          <Link to="/">Home</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/tours">Tours</Link>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms & Services</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="flex flex-col gap-1 xl:gap-2">
          <h3 className="text-lg font-bold hover:none mb-1 xl:mb-2">
            Our partners
          </h3>
          <Link to="/">Home</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/about">About</Link>
          <Link to="/ab sb">Privacy policy</Link>
          <Link to="/terms">Terms & Services</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="flex flex-col gap-1 xl:gap-2">
          <h3 className="text-lg font-bold hover:none mb-1 xl:mb-2">Socials</h3>
          <Link to="/">Home</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/about">About</Link>
          <Link to="/ab sb">Privacy policy</Link>
          <Link to="/about">Terms & Services</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
      <hr className="h-0.5 mx-4 my-4 xl:mx-16 xl:my-6 rounded border-none bg-yellow-500" />
      <div className="flex flex-col text-white pb-4 text-sm self-center xl:pb-6 xl:gap-1 xl:text-base">
        <p className="self-center">&copy; ጉZOዬ Travel, {date}</p>
        <p className="self-center">
          Developed by -{" "}
          <Link
            to="www.google.com"
            className="underline font-serif hover:text-yellow-500 hover:underline"
          >
            LMS IS student
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Footer;
