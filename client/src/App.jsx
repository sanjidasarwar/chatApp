import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login/Login";
import NotFound from "./pages/NotFound/NotFound";
import ProfileUpdate from "./pages/ProfileUpdate/ProfileUpdate";
function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route index element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile-update" element={<ProfileUpdate />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
