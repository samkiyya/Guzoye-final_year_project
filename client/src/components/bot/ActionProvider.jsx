import React from "react";
import PropTypes from "prop-types";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleGreet = () => {
    const message = createChatBotMessage("Hello! How can I assist you today?");
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  const handleHelp = () => {
    const message = createChatBotMessage(
      "Here are some things I can assist you with: booking a package, checking your itinerary, providing travel tips, or answering general questions about your trip. What do you need help with?"
    );
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  const handleBooking = () => {
    const message = createChatBotMessage(
      "Sure! I can help you book a package. Please provide the package ID and your travel dates."
    );
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  const handleItinerary = () => {
    const message = createChatBotMessage(
      "I can help you check your itinerary. Please provide your booking reference number."
    );
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  const handleTravelTips = () => {
    const message = createChatBotMessage(
      "Here are some travel tips: 1. Always keep a copy of your passport. 2. Learn basic phrases in the local language. 3. Keep your valuables secure. Do you need tips for a specific destination?"
    );
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  const handleGeneralQuery = () => {
    const message = createChatBotMessage(
      "Can you please specify your query? I'm here to help with any questions you might have about your trip."
    );
    setState((state) => ({ ...state, messages: [...state.messages, message] }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleGreet,
            handleHelp,
            handleBooking,
            handleItinerary,
            handleTravelTips,
            handleGeneralQuery,
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
