import React from "react";
import CreateTour from "../../components/CreateTour";
import TourList from "../../components/TourList";

const App: React.FC = () => {
  return (
    <div>
      <CreateTour />
      <TourList />
    </div>
  );
};

export default App;
