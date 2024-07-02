import React from "react";
import PropTypes from "prop-types";
import chatbotConfig from "./responseConfig.json";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    let matched = false;

    for (const [category, { keywords, response, responses }] of Object.entries(
      chatbotConfig
    )) {
      if (keywords.some((keyword) => lowerCaseMessage.includes(keyword))) {
        if (responses) {
          for (const [key, resp] of Object.entries(responses)) {
            if (lowerCaseMessage.includes(key)) {
              actions.handleCustomResponse(resp);
              matched = true;
              break;
            }
          }
        } else {
          actions.handleCustomResponse(response);
          matched = true;
        }
        if (matched) break;
      }
    }

    if (!matched) {
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
};

export default MessageParser;
