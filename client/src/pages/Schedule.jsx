import { useState, useEffect } from "react";
import { Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function Schedule() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    getSchedule();
  }, [data]);

  const deleteSchedule = async (e, s) => {
    // alert('are you sure you want to delete')
    console.log(s._id);
    try {
      await fetch(`${API_BASE_URL}/api/user/deleteSchedule/${s._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const getSchedule = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(
        `${API_BASE_URL}/api/user/getSchedule/${currentUser._id}`
      );

      setData(await res.json());
      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      setLoading(false);

      if (res.ok) {
        data.map((s) => {
          console.log(s);
        });
        // console.log(data[0]);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <>
      <Link to="/createSchedule">
        <button className="bg-red-400 w-48 h-16 rounded-2xl">
          New schedule
        </button>
      </Link>
      <div className="w-30 mt-5 p-12">
        {data === null
          ? data.map(() => <div key={0}>You have not scheduled yet</div>)
          : data.map((s) => (
              <ul
                key={s._id}
                className="flex flex-col w-30 text-black text-base my-4 border-2"
              >
                <li className="text-black text-base">{s._id}</li>
                <li className="text-black text-base">{s.scheduleName}</li>
                <li className="text-black text-base">{s.userName}</li>
                {currentUser.role === "guide" && (
                  <li className="text-black text-base">
                    {s.tourists.join(",  ")}
                  </li>
                )}
                <li className="text-black text-base">
                  {s.destination.join(",  ")}
                </li>
                <li className="text-black text-base">{s.date}</li>
                <li className="self-end">
                  <button onClick={deleteSchedule}>Delete</button>
                </li>
              </ul>
            ))}
      </div>
      <Alert>{errorMessage}</Alert>
    </>
  );
}
