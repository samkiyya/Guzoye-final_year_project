import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const { currentUser } = useSelector((state) => state.user);
  const [counter, setCounter] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(`${API_BASE_URL}/api/user/getQuiz`);
        const quizData = await res.json();

        if (!res.ok) {
          throw new Error(quizData.message || "Failed to fetch quiz data");
        }

        // Ensure only 10 questions are fetched
        setData(quizData.slice(0, 10));
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleAnswerSelection = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = () => {
    if (data[counter]) {
      if (data[counter].correctAnswer === selectedOption) {
        setScore(score + 1);
      }
    }
    if (counter + 1 < data.length) {
      setCounter(counter + 1);
      setSelectedOption("");
    } else {
      navigate("/quiz-complete", { state: { score } });
    }
  };

  const startQuiz = () => {
    document.getElementById("quizContainer").classList.remove("hidden");
    document.getElementById("startButton").classList.add("hidden");
    document.getElementById("notice").classList.add("hidden");
  };

  const renderQuestion = () => {
    if (!data[counter]) return null;
    const currentQuestion = data[counter];

    return (
      <>
        <li id="question" className="text-black text-base">
          {currentQuestion.Questions}
        </li>
        {currentQuestion.options.map((option, index) => (
          <li key={index} className="text-black text-base">
            <input
              type="radio"
              name="quizOption"
              value={option.option}
              checked={selectedOption === option.option}
              onChange={handleAnswerSelection}
            />
            <span>{option.option}</span>
          </li>
        ))}
      </>
    );
  };

  return (
    <>
      {currentUser.role === "guide" && (
        <>
          <div id="quiz" className="">
            <p id="notice" className="">
              By taking this quiz you are ....
            </p>
          </div>
          <button
            id="startButton"
            className="bg-red-400 w-48 h-16 rounded-2xl"
            onClick={startQuiz}
          >
            Start Quiz
          </button>
          <div id="quizContainer" className="hidden">
            <ul className="flex flex-col w-30 text-black text-base my-4 border-2">
              {renderQuestion()}
              <li className="self-end">
                <button id="button" onClick={handleSubmit}>
                  Next
                </button>
              </li>
            </ul>
          </div>
          {loading && <p>Loading...</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </>
      )}
    </>
  );
}
