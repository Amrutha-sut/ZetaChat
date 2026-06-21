import "./Chatwindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function ChatWindow(){
    const {
        prompt, setPrompt, 
        reply, setReply, 
        currThreadId, 
        prevChats, setPrevChats, 
        setNewChat,
        token, 
        onLogout
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 
    const navigate = useNavigate();

    const isLoggedIn = !!token || !!localStorage.getItem("token");

    const getReply = async()=>{
        if(!prompt.trim()) return;
        
        // 🛠️ FIX: Instead of calling a missing state function, alert the user and route them directly to /login
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        setLoading(true);
        setNewChat(false);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token || localStorage.getItem("token")}` 
            },
            body: JSON.stringify({ message: prompt, threadId: currThreadId })
        };
        try {
            const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8080";
            const response = await fetch(`${baseUrl}/api/chat`, options);

            const res = await response.json();
            
            if (response.ok) {
                setReply(res.reply);
            } else {
                console.log("Chat Error:", res.error);
            }
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    };

    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats => (
                [...prevChats, { role: "user", content: prompt }, { role: "assistant", content: reply }]
            ));
        }
        setPrompt("");
    }, [reply]);

    return(
        <div className="chatWindow">
            <div className="navbar">
                <span>ZetaChat</span>
                <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    
                    <div className="dropDownItem" onClick={() => { navigate("/pricing"); setIsOpen(false); }}>
                        Upgrade Plan<i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    
                    {!isLoggedIn ? (
                        <>
                            <div className="dropDownItem" onClick={() => { navigate("/login"); setIsOpen(false); }}>
                                Log In<i className="fa-solid fa-right-from-bracket"></i>
                            </div>
                            <div className="dropDownItem" onClick={() => { navigate("/signup"); setIsOpen(false); }}>
                                Sign Up<i className="fa-solid fa-user-plus"></i>
                            </div>
                        </>
                    ) : (
                        <div className="dropDownItem" onClick={onLogout} style={{ color: "#ff4d4d" }}>
                            Log Out<i className="fa-solid fa-arrow-right-from-bracket"></i>
                        </div>
                    )}
                </div>
            }
            
            <Chat />
            <ScaleLoader color="#5a5151" loading={loading} />

            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">SigmaGPT can make mistakes. Check important info.</p>
            </div>
        </div>
    )
}
export default ChatWindow;
