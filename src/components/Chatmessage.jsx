import React from 'react';
import ChatbotIcon from './ChatbotIcon';

const Chatmessage = ({ chat }) => {
  return (
    <div>
      <div
        className={`message ${
          chat.role === 'model' ? 'bot' : 'user'
        }-message ${chat.isError ? "error" : ""} flex gap-11 items-center ${
          chat.role === 'model' ? 'justify-start' : 'justify-end'
        }`}
      >
        {chat.role === 'model' && <ChatbotIcon />}
        <p
          className={`message-text text-start p-[12px] max-w-[75%] whitespace-pre-line text-[0.95rem] break-words ${
            chat.role === 'model'
              ? 'bg-[#F6F2FF] text-[#000] rounded-tl-[13px] rounded-tr-[13px] rounded-bl-[13px] rounded-br-[13px]'
              : 'bg-[#6D4FC2] text-[#fff] rounded-tl-[13px] rounded-tr-[13px] rounded-bl-[3px] rounded-br-[13px]'
          }`}
        >
          {chat.text}
        </p>
      </div>
    </div>
    )
};

export default Chatmessage;

