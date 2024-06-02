import { useState, useEffect } from "react";
import { Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function CreateSchedule() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [inputData, setInputData] = useState("");
  const [touristData, setTouristData] = useState([]);
  const [destData, setDestData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      role: currentUser.role,
      email: currentUser.email,
      userName: currentUser.username,
      ...formData,
      tourists: touristData,
      destination: destData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const changeHandler = (e) => {
    setInputData(e.target.value.trim());
  };

  const handleTourist = (e) => {
    setTouristData([...touristData, e.target.value.trim()]);
  };

  const handleDestination = (e) => {
    setDestData([...destData, e.target.value.trim()]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(`${API_BASE_URL}/api/user/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if (res.ok) {
        navigate("/schedule");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Schedule
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="scheduleName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Schedule Name
                  </label>
                  <input
                    type="text"
                    id="scheduleName"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="schedule name"
                  />
                </div>
                {currentUser.role === "guide" && (
                  <div>
                    <label
                      htmlFor="tourists"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {" "}
                      Tourists User Name
                    </label>
                    <div className="flex flex-row justify-between gap-y-4 flex-wrap">
                      <input
                        type="text"
                        onChange={changeHandler}
                        onBlur={handleTourist}
                        id="tourists1"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-15 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Tourist username"
                        value={formData.tourists1}
                        required=""
                      />
                      <input
                        type="text"
                        onChange={changeHandler}
                        onBlur={handleTourist}
                        id="tourists2"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-15 self-end p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="(optional)"
                        value={formData.tourists2}
                        required=""
                      />
                      <input
                        type="text"
                        onFocus={changeHandler}
                        onBlur={handleTourist}
                        id="tourists3"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-15 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="(optional)"
                        value={formData.tourists3}
                        required=""
                      />
                      <input
                        type="text"
                        onChange={changeHandler}
                        onBlur={handleTourist}
                        id="tourists4"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-15 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="(optional)"
                        value={formData.tourists4}
                        required=""
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label
                    htmlFor="destination"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Destination
                  </label>
                  <div className="flex flex-row justify-between gap-y-4 flex-wrap">
                    <select
                      value={formData.destination1}
                      onChange={changeHandler}
                      onBlur={handleDestination}
                      id="destination1"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-15 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Your destination</option>
                      <option value="Lalibela">Lalibela</option>
                      <option value="Axum">Axum</option>
                      <option value="Gondar">Gondar</option>
                      <option value="Harar">Harar</option>
                      <option value="Semein Mountain">Semein Mountain</option>
                      <option value="Sof Umer">Sof Umer</option>
                    </select>
                    <select
                      value={formData.destination2}
                      onChange={changeHandler}
                      onBlur={handleDestination}
                      id="destination2"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-15 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">(optional)</option>
                      <option value="Lalibela">Lalibela</option>
                      <option value="Axum">Axum</option>
                      <option value="Gondar">Gondar</option>
                      <option value="Harar">Harar</option>
                      <option value="Semein Mountain">Semein Mountain</option>
                      <option value="Sof Umer">Sof Umer</option>
                    </select>
                    <select
                      value={formData.destination3}
                      onChange={changeHandler}
                      onBlur={handleDestination}
                      id="destination3"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-15 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">(optional)</option>
                      <option value="Lalibela">Lalibela</option>
                      <option value="Axum">Axum</option>
                      <option value="Gondar">Gondar</option>
                      <option value="Harar">Harar</option>
                      <option value="Semein Mountain">Semein Mountain</option>
                      <option value="Sof Umer">Sof Umer</option>
                    </select>
                    <select
                      value={formData.destination4}
                      onChange={changeHandler}
                      onBlur={handleDestination}
                      id="destination4"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-15 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">(optional)</option>
                      <option value="Lalibela">Lalibela</option>
                      <option value="Axum">Axum</option>
                      <option value="Gondar">Gondar</option>
                      <option value="Harar">Harar</option>
                      <option value="Semein Mountain">Semein Mountain</option>
                      <option value="Sof Umer">Sof Umer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-black bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {loading ? (
                    <>
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>

              {errorMessage && (
                <Alert className="mt-5" color="failure">
                  {errorMessage}
                </Alert>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
