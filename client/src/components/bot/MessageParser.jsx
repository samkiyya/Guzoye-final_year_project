import React from "react";
import PropTypes from "prop-types";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      actions.handleGreet();
    } else if (lowerCaseMessage.includes("help")) {
      actions.handleHelp();
    } else if (
      lowerCaseMessage.includes("book") ||
      lowerCaseMessage.includes("booking")
    ) {
      actions.handleBooking();
    } else if (lowerCaseMessage.includes("itinerary")) {
      actions.handleItinerary();
    } else if (lowerCaseMessage.includes("travel tips")) {
      actions.handleTravelTips();
    } else {
      actions.handleGeneralQuery();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse,
        });
      })}
    </div>
  );
};

MessageParser.propTypes = {
  children: PropTypes.node.isRequired,
  actions: PropTypes.object.isRequired,
  setState: PropTypes.func.isRequired,
};

export default MessageParser;
