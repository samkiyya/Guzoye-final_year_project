import { useState } from "react";
import "react-chatbot-kit/build/main.css";
import "./guzoyeBot.css";
import { Chatbot } from "react-chatbot-kit";
import config from "../../components/bot/Config";
import ActionProvider from "../../components/bot/ActionProvider";
import MessageParser from "../../components/bot/MessageParser";
import { useAuth } from "../../context/AuthContext";

const GuzoyeBot = () => {
  const { user, isAuthenticated } = useAuth();
  const [showBot, toggleBot] = useState(false);

  const saveMessages = (messages) => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  };

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem("chat_messages"));
    return messages;
  };

  if (!isAuthenticated || user.role !== "traveler") {
    return null; // Don't render the bot if the user is not authenticated or not a traveler
  }

  return (
    <div className="chatbot-popup">
      {showBot && (
        <Chatbot
          config={config}
          actionProvider={ActionProvider}
          messageHistory={loadMessages()}
          messageParser={MessageParser}
          saveMessages={saveMessages}
        />
      )}
      <button
        className="chatbot-button-popup"
        onClick={() => toggleBot((prev) => !prev)}
      >
        Need Support
      </button>
    </div>
  );
};

export default GuzoyeBot;
