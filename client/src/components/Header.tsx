import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
const Header = () => {
  const { isLogedIn } = useAppContext();
  return (
    <div className="bg-blue-600 py-6 ">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">ጉzoዬ</Link>
        </span>
        <span className="flex space-x-2">
          {isLogedIn ? (
            <>
              <Link
                className="flex items-center text-white p-3 font-bold hover:bg-blue-800"
                to="my-bookings"
              >
                My Bookings
              </Link>
              <Link
                className="flex items-center text-white p-3 font-bold hover:bg-blue-800"
                to="my-travel"
              >
                My Travels
              </Link>
              <Link
                className="flex items-center text-white p-3 font-bold hover:bg-blue-800"
                to="my-profile"
              >
                My Profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-grey-200"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;
