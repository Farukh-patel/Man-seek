import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import Loader from "./Loader";

function Home() {
  const navigate = useNavigate();
  const [user, setuser] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [AllConversation, setAllConversation] = useState([]);
  const [ligthMode, setLigthMode] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await axios.get(`${BACKEND_URL}/users/verify`, {
          withCredentials: true,
        });
        if (!res.data.success) {
          navigate("/login");
        }
      } catch (error) {
        console.error("user is not authenticated", error);
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchAllConversations = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/ai/allconversations`, {
          withCredentials: true,
        });
        setAllConversation(response.data.data);
        setuser(response.data.user);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchAllConversations();
  }, []);

  const handleAskQuestion = async () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", content: message }]);
    setMessage("");
    setisLoading(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/ai/gemini`,
        {
          content: message,
          conversationId: conversationId || null,
          title: newChatTitle || "new chat",
        },
        { withCredentials: true }
      );

      if (res.data.conversationId && !conversationId) {
        setConversationId(res.data.conversationId);
      }

      let parsedMessage = marked.parse(res.data.message);

      setMessages((prev) => [
        ...prev,
        { sender: "gemini", content: parsedMessage },
      ]);
    } catch (error) {
      console.error("Error in frontend:", error);
    } finally {
      setisLoading(false);
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") handleAskQuestion();
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/users/logout`, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const changeMode = () => {
    setLigthMode((prev) => !prev);
  };

  const handleDeleteConversation = async (index) => {
    const DeletingId = AllConversation[index]._id;
    try {
      let res = await axios.delete(
        `${BACKEND_URL}/ai/deleteConversation/${DeletingId}`,
        { withCredentials: true }
      );
      if (res.data.message === "success") {
        let filteredConversations = AllConversation.filter(
          (_, i) => i !== index
        );
        setAllConversation(filteredConversations);
        alert("Conversation Deleted successfully!!");
      }
    } catch (error) {
      console.log(error.message);
      alert("Error in Deleting the conversation!!");
    }
  };

  const handleNewchat = () => {
    setShowTitleInput((prev) => !prev);
  };

  const handleShowConversation = async (index) => {
    const conversationId = AllConversation[index]._id;
    try {
      let response = await axios.get(
        `${BACKEND_URL}/ai/showconversation/${conversationId}`,
        { withCredentials: true }
      );

      const rawMessages = response.data.messages;

      const parsedMessages = rawMessages.map((msg) => {
        return {
          ...msg,
          text: msg.type === "gemini" ? marked.parse(msg.text || "") : msg.text,
        };
      });

      setMessages(parsedMessages);
      setConversationId(conversationId);
    } catch (error) {
      console.log(error);
      alert("Failed to load conversation");
    }
  };

  const handleStartnewChat = () => {
    setShowTitleInput(false);
    navigate("/");
  };

  return (
    <div className="h-screen w-full flex  font-sans">
      {/* Sidebar */}
      <div
        className={`${ligthMode ? "bg-gray-200" : "bg-zinc-900"} ${
          ligthMode ? "text-black" : "text-white"
        } w-1/4 h-full flex flex-col justify-between border-r border-zinc-700`}
      >
        <div className="p-4 flex items-center gap-3 border-b border-zinc-700">
          <img className="h-8 " src="brain.png" alt="logo" />
          <h4 className="font-bold ">Man-Seek</h4>
        </div>

        <div
          className={`${
            ligthMode ? "bg-gray-200" : "bg-zinc-800"
          } flex-1 p-2 overflow-y-auto scrollbar-thin`}
        >
          {AllConversation.map((item, index) => (
            <p
              onClick={() => handleShowConversation(index)}
              key={index}
              className={`text-sm  ${
                ligthMode ? "bg-gray-200" : "bg-zinc-900"
              } flex justify-between rounded p-2 mt-2 ${
                ligthMode ? "hover:bg-gray-300" : "hover: bg-zinc-700"
              } cursor-pointer truncate`}
            >
              {item.title || `Conversation ${index + 1}`}{" "}
              <i
                onClick={() => handleDeleteConversation(index)}
                className="fa  fa-trash-o hover:text-red-500 fa-lg"
                aria-hidden="true"
              ></i>
            </p>
          ))}
        </div>

        <div className="p-4  flex flex-col items-center gap-3 border-t border-zinc-700">
          <div className="flex items-center gap-2">
            <img className="h-8 rounded-full" src="default.png" alt="User" />
            <p className="font-bold">{user.fullname}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 cursor-pointer text-sm hover:underline"
          >
            <i className="fa fa-sign-out  mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div
        className={`${ligthMode ? "bg-gray-200" : "bg-zinc-900"} ${
          ligthMode ? "text-black" : "text-white"
        }   w-full flex flex-col`}
      >
        {/* Top Bar */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-700">
          <button
            onClick={handleNewchat}
            className="text-sm flex items-center gap-2 px-3 py-1 border border-zinc-700 cursor-pointer rounded hover:border-blue-500"
          >
            <i className="fa fa-pencil-square-o hover:text-blue-500" /> New Chat
          </button>
          {showTitleInput && (
            <div className="flex items-center gap-2 mt-2 mr-130">
              <input
                type="text"
                placeholder="Enter chat title"
                className="px-2 py-1 border border-zinc-700 rounded "
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
              />
              <button
                onClick={handleStartnewChat}
                className="px-3 py-1 text-sm border hover:border-blue-500 rounded  border-zinc-700"
              >
                Start
              </button>
            </div>
          )}
          <button
            onClick={changeMode}
            className="text-sm flex items-center gap-2 px-3 py-1 border border-zinc-700  cursor-pointer rounded hover:border-blue-500"
          >
            <i className={`fa ${ligthMode ? "fa-moon-o" : "fa-sun-o"}`} />
            {ligthMode ? "Dark Mode" : "Ligth Mode"}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1  overflow-y-auto p-4 space-y-4">
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={` p-3 text-sm max-w-lg relative ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-[10px] rounded-br-none"
                    : "bg-green-500 text-black rounded-[10px] rounded-bl-none"
                }`}
              >
                <span className="font-bold text-xs block mb-1">
                  {msg.sender === "user" ? "@you" : "@gemini"}
                </span>
                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                <div className="text-[12px] text-right text-zinc-900 mt-1">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </div> 
              </div>
            </div>
          ))}
        </div>
        
          {isLoading && (
            <div className="flex p-3 justify-start">
            <Loader/>
            </div>
          )}
      

        {/* Input */}
        <div className="p-4 border-t border-zinc-700">
          <div className="flex items-center border-1 border-zinc-700 rounded-md px-4 py-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleOnKeyDown}
              type="text"
              placeholder="Ask Anything!"
              className=" outline-none flex-1 placeholder-gray-400"
            />
            <button onClick={handleAskQuestion}>
              <i className="fa fa-paper-plane cursor-pointer fa-lg  hover:text-blue-500 ml-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
 