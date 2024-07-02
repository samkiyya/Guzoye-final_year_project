import React from "react";
import PropTypes from "prop-types";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleCustomResponse = (response) => {
    const message = createChatBotMessage(response);
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  const handleGeneralQuery = () => {
    const message = createChatBotMessage(
      "Can you please specify your query? I'm here to help with any questions you might have about your trip."
    );
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  const handleUserName = (name) => {
    const message = createChatBotMessage(
      `Nice to meet you, ${name}! How can I assist you with your travel plans?`
    );
    setState((state) => ({
      ...state,
      messages: [...state.messages, message],
      userName: name,
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleCustomResponse,
            handleGeneralQuery,
            handleUserName,
          },
        });
      })}
    </div>
  );
};

ActionProvider.propTypes = {
  createChatBotMessage: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ActionProvider;
