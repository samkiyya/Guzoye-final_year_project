import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddTour from "./pages/AddTour";
import { useAppContext } from "./contexts/AppContext";
function App() {
  const { isLogedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home page</p>
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <p>Search page </p>
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />{" "}
            </Layout>
          }
        />

        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />{" "}
            </Layout>
          }
        />
        {isLogedIn && (
          <>
            <Route
              path="/add-tour"
              element={
                <Layout>
                  <AddTour />{" "}
                </Layout>
              }
            />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
