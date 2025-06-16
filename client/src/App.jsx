import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { AuthContext } from "./context/AuthContext.jsx";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
function App() {
  const { authUser } = useContext(AuthContext);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          index
          element={!authUser ? <Login /> : <Navigate to="/chat" />}
        />
        <Route
          path="/chat"
          element={authUser ? <Chat /> : <Navigate to="/" />}
        />
        <Route
          path="/profile-update"
          element={authUser ? <ProfileUpdate /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
