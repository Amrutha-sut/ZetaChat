import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const { 
        allThreads, 
        setAllThreads, 
        currThreadId, 
        setNewChat, 
        setPrompt, 
        setReply, 
        setCurrThreadId, 
        setPrevChats,
        token 
    } = useContext(MyContext); 

    const getAllThreads = async () => {
        const activeToken = token || localStorage.getItem("token");
        if (!activeToken) {
            setAllThreads([]);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: { "Authorization": `Bearer ${activeToken}` }
            });
            
            const res = await response.json();

            if (response.ok && Array.isArray(res)) {
                const filteredData = res.map(thread => ({
                    threadId: thread.threadId,
                    title: thread.title
                }));
                setAllThreads(filteredData);
            } else {
                console.log("Backend error or unauthorized:", res.error);
                setAllThreads([]); 
            }

        } catch (err) {
            console.log("Network error fetching threads:", err);
            setAllThreads([]);
        }
    };

    // 🛠️ FIX 2: Added 'token' to the dependency array so it refreshes instantly when logging in/out
    useEffect(() => {
        getAllThreads();
    }, [currThreadId, token]);

    const createNewchat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        const activeToken = token || localStorage.getItem("token");
        
        try {
            // 🛠️ FIX 3: Added authorization headers to prevent 401 unauthorized errors
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                headers: { "Authorization": `Bearer ${activeToken}` }
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        const activeToken = token || localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${activeToken}` }
            });
            const res = await response.json();
            console.log(res);
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if (threadId === currThreadId) {
                createNewchat();
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewchat}>
                <img src="src/assets/blacklogo.png" alt="gpt_logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >
                            {thread.title}
                            <i className="fa-solid fa-trash" onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By SLA &hearts;</p>
            </div>
        </section>
    );
}

export default Sidebar;
