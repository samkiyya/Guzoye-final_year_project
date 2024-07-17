import GuzoyeMap from "./GuzoyeMap.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

const Index = () => {
  return (
    <ErrorBoundary>
      <GuzoyeMap />
    </ErrorBoundary>
  );
};
export default Index;
