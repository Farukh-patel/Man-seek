import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [AllConversation, setAllConversation] = useState([])

 useEffect(() => {
  const fetchAllConversations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/ai/allconversations", {
        withCredentials: true,
      });
      console.log("Fetched conversations:", response.data.data);
      setAllConversation(response.data.data); // only the actual array
    } catch (error) {
      console.log("Error in frontend fetching all conversations:", error);
    }
  };

  fetchAllConversations();
}, []);

  

  const handleAskQuestion = async () => {
    try {
      setMessages((prev) => [...prev, { type: "user", text: message }]);
      setMessage(""); 
      const res = await axios.post("http://localhost:3000/ai/gemini", { content: message, conversationId: conversationId || null },{
        withCredentials: true,
      });

      if (res.data.conversationId && !conversationId) {
        setConversationId(res.data.conversationId);
      }

      setMessages((prev) => [
        ...prev,
        { type: "gemini", text: res.data.message },
      ]);
      // console.log(messages);
    } catch (error) {
      console.log("error in frontend",error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  };

  const handleOnkeyDown = (e) => {
    if (e.key === "Enter") {
      handleAskQuestion();
    }
  };

  const handleLogout=async()=>{
    try {
      let res=await axios.get("http://localhost:3000/auth/logout",null,{withCredentials:true});
      alert(res.message)
      //navigate to login page
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="h-screen w-full flex">
      <div className="bg-zinc-900 w-1/4 h-full flex flex-col justify-between">
        <div className="p-2 flex gap-3 justify-center items-center mt-3">
          <img className="h-8" src="brain.png" alt="" />
          <span className="font-bold text-gray-400 "><h4>Man-Seek</h4></span>
        </div>
        <div className="bg-zinc-800 h-full p-2 overflow-y-auto scrollbar-thin-y">
         <p className="text-sm bg-zinc-900 text-gray-400 rounded p-1 mt-2 cursor-pointer">New chat 1</p>
         <p className="text-sm bg-zinc-900 text-gray-400 rounded p-1 mt-2 cursor-pointer">New chat 1</p>
         <p className="text-sm bg-zinc-900 text-gray-400 rounded p-1 mt-2 cursor-pointer">New chat 1</p>
         <p className="text-sm bg-zinc-900 text-gray-400 rounded p-1 mt-2 cursor-pointer">New chat 1</p>
         <p className="text-sm bg-zinc-900 text-gray-400 rounded p-1 mt-2 cursor-pointer">New chat 1</p>
         <p className="text-sm bg-zinc-900 text-gray-400 rounded p-1 mt-2 cursor-pointer">New chat 1</p>
         <p className="text-sm bg-zinc-900 text-gray-400 rounded p-1 mt-2 cursor-pointer">New chat 1</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-3 mb-2 p-2">
          <div className="flex justify-center items-center">
          <img className="h-8" src="default.png" alt="" />
          <p className="text-gray-400">farukh patel</p>
          </div>
            <button onClick={handleLogout} className="text-red-500 text-sm cursor-pointer"><i className="fa fa-sign-out text-white mr-2" aria-hidden="true"></i>Logout</button>
        </div>
      </div>
      <div className="bg-zinc-800 h-full w-full flex flex-col p-2 overflow-y-auto">
        <div className="bg-zinc-800 h-12 flex justify-between">
          <div className="flex justify-center items-center border-1 border-zinc-800 hover:border-blue-500 text-white w-25 gap-2 cursor-pointer text-sm rounded-md"><i className="fa fa-pencil-square-o" aria-hidden="true"></i>New Chat</div>
          <button className="p-2 cursor-pointer border-1 border-zinc-800 text-sm hover:border-blue-500 text-white rounded-md"> <i className="fa fa-sun-o " aria-hidden="true"></i> Light Mode</button>
        </div>
        <div className="messageDiv bg-zinc-800 h-100 w-full overflow-y-auto p-4 ">
          {messages.map((msg, index) => (
            <div
            key={index}
            className={`flex w-full p-2 mt-2 ${msg.type === "user" ? "justify-end" : "justify-start"}` }
            >
              <div
                className={ "bg-green-400 w-fit max-w-1/2 mt-2 p-1  text-xs rounded-md"}
              >
                <span className="text-blue-900 font-bold text-xs ">
                  {msg.type === "user" ? "@you" : "@gemini"}
                </span>
                <br />
                {msg.text}
                <br />
                <div className="w-full flex justify-end h-auto">

                <span className="text-gray-600 text-[10px] mt-2">09:12 pm</span>
                </div>

              </div>
            </div>
          ))}
        </div>
        <div className="bg-zinc-980 flex justify-center h-30 items-end ">
          <div className="w-135 h-15 rounded-md bg-zinc-900 mb-8 p-3 shadow-lg shadow-gray-900 flex">
            <input
            onKeyDown={handleOnkeyDown}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Ask Anything!"
              className="border-b border-gray-200 text-white text-md focus:border-blue-500 outline-none w-full p-2"
            />
            <button  onClick={handleAskQuestion}>
              <i
                className="fa fa-arrow-circle-right fa-lg text-white cursor-pointer ml-5"
                aria-hidden="true"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
