import { useState, useEffect } from "react";
import { Alert, Textarea } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function ShowQuiz({ data }) {
  console.log(data);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [scheduleData, setScheduleData] = useState({});

  return (
    <>
      <div id="quizContainer" className="w-100 m-10">
        {
          <ul className="flex flex-col w-30 text-black text-base my-4 border-2">
            <li className="text-black text-base">{data.Question}</li>
            <li className="text-black text-base">
              <input name={data._id} type="radio" value={data.choiceA} />
              {s.choiceA}
            </li>
            <li className="text-black text-base">
              <input name={data._id} type="radio" value={data.choiceB} />
              {data.choiceB}
            </li>
            <li className="text-black text-base">
              <input name={data._id} type="radio" value={data.choiceC} />
              {data.choiceC}
            </li>
            <li className="text-black text-base">
              <input name={data._id} type="radio" value={data.choiceD} />
              {s.choiceD}
            </li>
          </ul>
        }
      </div>
    </>
  );
}
