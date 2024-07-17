import { Alert } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/auth/authSlice";

export default function Registration() {
  const [FirstName, setFName] = useState("");
  const [LastName, setLName] = useState("");
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nationality, setNationality] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
    } else {
      try {
        const res = await register({
          FirstName,
          LastName,
          username,
          email,
          password,
          nationality,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        setErrorMessage(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div>
      <section className="pl-[10rem] flex flex-wrap">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4">Register</h1>

          <form onSubmit={submitHandler} className="container w-[40rem]">
            <div className="my-[2rem]">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-white"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Your First Name"
                value={FirstName}
                onChange={(e) => setFName(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Your Last Name"
                value={LastName}
                onChange={(e) => setLName(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Username"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-2 border rounded w-full"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="my-[2rem]">
              <div className="flex items-center">
                <input
                  id="nationality"
                  type="checkbox"
                  className="mr-2"
                  checked={nationality}
                  onChange={(e) => setNationality(e.target.checked)}
                />
                <label
                  htmlFor="nationality"
                  className="text-sm font-medium text-white"
                >
                  Are you Ethiopian?
                </label>
              </div>
            </div>

            <button
              className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
              disabled={isLoading}
              onClick={submitHandler}
              type="submit"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            {isLoading && <Loader />}
          </form>

          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}

          <div className="mt-4">
            <OAuth />
          </div>

          <div className="mt-4">
            <p className="text-white">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-pink-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
