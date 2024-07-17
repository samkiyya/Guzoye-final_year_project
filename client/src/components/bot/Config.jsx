import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "./BotAvatar";
import UserAvatar from "./UserAvatar";

const botName = "ጉZOዬ";

const config = {
  initialMessages: [
    createChatBotMessage(`Hi! I'm ${botName}, what can I help you with today?`),
  ],
  botName: botName,
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />,
    userAvatar: (props) => <UserAvatar {...props} />,
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#5acc9a",
    },
  },
};

export default config;
