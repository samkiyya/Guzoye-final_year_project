import React from "react";
import PropTypes from "prop-types";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleGreet = () => {
    const message = createChatBotMessage("Hello! How can I assist you?");
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleGreet },
          children: child.props.children,
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
