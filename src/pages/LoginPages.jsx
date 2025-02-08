import React, { useEffect, useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import HomePages from './HomePages';
import messages from '../components/Message';

Date.prototype.getDayOfYear = function () {
    const start = new Date(this.getFullYear(), 0, 0);
    const diff = this - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

const LoginPages = () => {
    const { user } = useUser();
    const [message, setMessage] = useState('');


    useEffect(() => {
        const currentDayOfYear = new Date().getDayOfYear();
        const storedMessageDay = localStorage.getItem('lastMessageDay');

        if (storedMessageDay !== currentDayOfYear.toString()) {
            const messageIndex = currentDayOfYear % messages.length;
            setMessage(messages[messageIndex]);
            localStorage.setItem('lastMessageDay', currentDayOfYear);
        } else {
            setMessage(messages[storedMessageDay % messages.length]);
        }
    }, []);

    const currentHour = new Date().getHours();

    const getGreeting = () => {
        if (currentHour < 12) {
          return "Good Morning";
        } else if (currentHour < 18) {
          return "Good Afternoon";
        } else if (currentHour < 21) {
          return "Good Evening";
        } else {
          return "Good Night";
        }
      };
      
    return (
        <div>
            <SignedIn>
                <div className="login p-4 shadow-lg flex justify-between items-center py-[10px] px-[50px]">
                    <div className="flex items-center">
                        <img src="/images/chatbot.png" alt="ChatBot" className='w-[40px] me-[10px]' />
                        <h1 className="text-[28px] font-semibold text-[#FFFFFF]">ChatBot-Ai</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <UserButton />
                    </div>
                </div>
            </SignedIn>

            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-[#ededed] rounded-[10px] shadow-lg w-[50%] text-center px-[15px] py-[20px]">
                    <SignedOut>
                        <div className="mb-4 text-center">
                            <p className="text-[24px] font-bold text-[#800020] mb-[10px]">
                                Welcome back! Sign in to get started and experience the best of ChatBot-Ai.
                            </p>
                            <p className="text-[18px] text-[#2F4F6D] mb-[20px]">
                                Your AI assistant is just one click away. Let's get started!
                            </p>
                            <SignInButton className="w-[175px] h-[50px] bg-gradient-to-r from-[#6D4FC2] to-[#593bab] text-[#fff] py-2 rounded-[10px] hover:opacity-90 transition duration-300 border-none shadow-lg">
                                Sign In
                            </SignInButton>
                        </div>
                    </SignedOut>

                    <SignedIn>
                        <div className="mb-4">
                            {user && (
                                <>
                                    <h2 className="text-[30px] font-semibold text-[#800020] shadow-lg">
                                        Hii {user.firstName}! {getGreeting()}
                                    </h2>

                                    <p className="mt-[5px] text-[18px] text-[#2e4154]">{message}</p>

                                    <p className="text-[16px] font-medium text-[#502d2d] mb-[20px]  mt-[5px] animate-typewriter">
                                        <span class="material-symbols-outlined " style={{ fontWeight: "bold" }}>
                                            lightbulb
                                        </span>
                                        Tip: Click the chatbot icon at the bottom right corner for instant AI assistance!
                                    </p>
                                    <HomePages />
                                </>
                            )}
                        </div>
                    </SignedIn>
                </div>
            </div>
        </div>
    );
};

export default LoginPages;
