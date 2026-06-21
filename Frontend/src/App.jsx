import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import PricingModal from "./PricingModal.jsx";
import AuthModal from "./AuthModal.jsx"; 
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import { v1 as uuidv1 } from "uuid";
import { Routes, Route, useNavigate } from "react-router-dom"; // Added useNavigate

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const navigate = useNavigate();

  const handleLoginSuccess = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    navigate("/"); // Redirect back to workspace automatically on success
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate("/"); // Send to home route
    window.location.reload(); 
  };
  
  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    token,                     
    onLogout: handleLogout,     
    onSuccessAuth: handleLoginSuccess // Updated parameter reference hook name
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Routes>
          <Route path="/" element={<><Sidebar /><ChatWindow /></>} />
          <Route path="/chat" element={<><Sidebar /><ChatWindow /></>} />

          <Route 
            path="/login" 
            element={
              <>
                <Sidebar />
                <ChatWindow />
                <AuthModal mode="login" />
              </>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <>
                <Sidebar />
                <ChatWindow />
                <AuthModal mode="signup" />
              </>
            } 
          />

          {/* Standalone Route */}
          <Route path="/pricing" element={<PricingModal />} />
        </Routes>
      </MyContext.Provider>
    </div>
  )
}

export default App;
