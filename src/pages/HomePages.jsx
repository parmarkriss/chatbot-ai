import React, { useEffect, useState, useRef } from 'react';
import ChatbotIcon from '../components/ChatbotIcon';
import Chatform from '../components/Chatform';
import Chatmessage from '../components/Chatmessage';

const LOCAL_STORAGE_KEY = "chatHistory";

const HomePages = () => {
  const [chathistory, setChathistory] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  useEffect(() => {
    // Load messages from localStorage and filter expired ones
    const savedData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (savedData) {
      const { messages, timestamp } = savedData;
      const currentTime = Date.now();

      if (currentTime - timestamp < EXPIRATION_TIME) {
        setChathistory(messages);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear expired messages
      }
    }
  }, []);

  useEffect(() => {
    // Save messages to localStorage whenever chathistory updates
    if (chathistory.length > 0) {
      const dataToStore = {
        messages: chathistory,
        timestamp: Date.now(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    }
  }, [chathistory]);

  const generateBotmessage = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChathistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };

    const formattedHistory = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: formattedHistory }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Something went wrong");
      }

      if (data?.candidates?.length > 0) {
        const apiresponsetext = data.candidates[0].content.parts[0].text
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .trim();

        updateHistory(apiresponsetext);
      } else {
        console.error("No valid candidates found in response");
      }
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chathistory]);

  return (
    <div>
      <div className={`container ${showChatbot ? 'show-chatbot' : ''}`}>
        <button
          id="chatbot-toggler"
          onClick={() => setShowChatbot(prev => !prev)}
          className={`fixed bottom-[30px] right-[35px] border-none h-[50px] w-[50px] flex items-center justify-center cursor-pointer rounded-full bg-[#6D4FC2] transform transition-transform duration-300 ${showChatbot ? 'rotate-90' : ''}`}
        >
          <span className={`material-symbols-rounded absolute text-[#fff] transition-opacity duration-300 ${showChatbot ? 'opacity-0' : 'opacity-100'}`}>mode_comment</span>
          <span className={`material-symbols-rounded absolute text-[#fff] transition-opacity duration-300 ${showChatbot ? 'opacity-100' : 'opacity-0'}`}>close</span>
        </button>

        <div className={`chatbot-popup w-[420px] h-[500px] overflow-hidden bg-[#fff] rounded-[15px] flex flex-col fixed bottom-[90px] right-[35px] transition-opacity duration-300 ${showChatbot ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="chat-header flex p-[15px] [22px] items-center justify-between bg-[#6D4FC2]">
            <div className="header-info flex gap-4 items-center">
              <ChatbotIcon />
              <h2 className="logo-text text-[#fff] text-[1.31rem] font-semibold">Chatbot</h2>
            </div>
            <button className="material-symbols-rounded w-[40px] h-[40px] border-none outline-none text-[#fff] pt-[2px] bg-[#6D4FC2] transition-all duration-200 ease-in-out text-[1.31rem] cursor-pointer rounded-full hover:bg-[#593bab] ml-auto" onClick={() => setShowChatbot(prev => !prev)}>
              keyboard_arrow_down
            </button>
          </div>

          <div ref={chatBodyRef} className="chatbot-body flex-1 p-[25px] [22px] h-[460px] overflow-y-auto flex gap-[20px] flex-col shadow-custom">
            <span className="date-label text-gray-500 text-sm">
              {new Date().toLocaleDateString() === new Date().toLocaleDateString() ? "Today" : "Yesterday"}
            </span>

            <div className="message bot-message flex gap-11 items-center">
              <ChatbotIcon />
              <p className="message-text p-[12px] [16px] max-w-[75%] whitespace-pre-line text-start text-[0.95rem] break-words bg-[#F6F2FF] rounded-[13px]">Hey There 👋 <br /> How Can Help you Today?</p>
            </div>

            {chathistory.map((chat, index) => <Chatmessage key={index} chat={chat} />)}
          </div>

          <div className="chat-footer w-full bg-white p-[15px] rounded-b-[15px]">
            <Chatform chathistory={chathistory} setChathistory={setChathistory} generateBotmessage={generateBotmessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePages;
