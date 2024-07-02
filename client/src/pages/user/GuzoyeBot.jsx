import { useState, useEffect, useRef } from "react";
import "react-chatbot-kit/build/main.css";
import "./guzoyeBot.css";
import { Chatbot } from "react-chatbot-kit";
import config from "../../components/bot/Config";
import ActionProvider from "../../components/bot/ActionProvider";
import MessageParser from "../../components/bot/MessageParser";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
// import { useAuth } from "../../context/AuthContext";

const GuzoyeBot = () => {
  const [showBot, toggleBot] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const chatbotBodyRef = useRef(null);

  const saveMessages = (messages) => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  };

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem("chat_messages"));
    return messages;
  };

  const clearMessages = () => {
    localStorage.removeItem("chat_messages");
    window.location.reload(); // Refresh the page to update the chat
  };

  useEffect(() => {
    if (showBot && chatbotBodyRef.current) {
      chatbotBodyRef.current.scrollTop = 0; // Scroll to top
    }
  }, [showBot]);

  return (
    <div className="chatbot-popup">
      {showBot && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">Ethiopian Tourism Bot</div>
            <div className="chatbot-menu">
              <button
                className="menu-button"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                ...
              </button>
              {showMenu && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={clearMessages}>
                    Clear Chat
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="chatbot-body" ref={chatbotBodyRef}>
            <Chatbot
              config={config}
              actionProvider={ActionProvider}
              messageParser={MessageParser}
              messageHistory={loadMessages()}
              saveMessages={saveMessages}
            />
          </div>
        </div>
      )}
      <button
        className="chatbot-button-popup"
        onClick={() => toggleBot((prev) => !prev)}
      >
        {showBot ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
};

export default GuzoyeBot;
