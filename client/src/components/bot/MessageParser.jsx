import React from "react";
import PropTypes from "prop-types";

const MessageParser = ({ children, parse }) => {
  const handleMessage = (message) => {
    parse(message);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          handleMessage: handleMessage,
          children: child.props.children,
        });
      })}
    </div>
  );
};

MessageParser.propTypes = {
  children: PropTypes.node.isRequired,
  parse: PropTypes.func.isRequired,
};

export default MessageParser;
